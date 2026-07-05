# Runner Lifecycle Steering — Read This Before Editing `agentloop.toml` During a Run

## Purpose

This file exists to prevent a specific 8-cycle failure loop that occurred during
DentaCRM plan cycles 02–05: builders repeatedly edited `agentloop.toml` in
response to `bash: line 1: python: command not found` in `test_backend.md`,
each time verifying the edit as green via a manual `bash -lc` reproduction —
but the orchestrator's automated runner kept reporting the same red signal on
the next cycle. Root cause was a runner-lifecycle mismatch, not a project
defect. Task T116 patched the runner; this steering doc records the invariant
so it does not need to be re-learned.

## The Invariant

`ai_orchestrator/orchestrator.py` calls `config = load_config(cfg_path)` **once**
in `main()` at process start. The same in-memory `Dict[str, Any]` is passed by
reference into every subsequent `run_tests(...)` invocation for the life of the
process. Python does not hot-reload modules or re-parse TOML files when they
change on disk.

**Consequence:** if a builder edits `agentloop.toml` while the orchestrator
process is already running, the on-disk edit has **no effect** on the running
runner unless `run_tests` explicitly re-reads the file from disk each call.

T116 introduced that reload:

```python
def run_tests(
    config: Dict[str, Any],
    project_root: Path,
    log_dir: Path,
    cfg_path: Optional[Path] = None,
) -> Tuple[bool, str]:
    if cfg_path is not None and cfg_path.exists() and tomllib is not None:
        try:
            with cfg_path.open("rb") as f:
                fresh = tomllib.load(f)
            fresh_project = fresh.get("project", {})
            if "tests" in fresh_project:
                config["project"]["tests"] = fresh_project["tests"]
            if "test_command" in fresh_project:
                config["project"]["test_command"] = fresh_project["test_command"]
        except Exception as exc:  # noqa: BLE001
            print(f"[agentloop] Warning: could not reload {cfg_path}: {exc}")
    ...
```

Both call sites in `main()` pass `cfg_path=cfg_path`.

## The Restart Requirement

T116 fixes the *code path*, but the fix itself is subject to the same
lifecycle constraint: a running orchestrator that was launched **before** T116
landed on disk is executing the pre-T116 `run_tests` from its own module
memory. It cannot pick up the T116 patch without a process restart. This is
independent of what `agentloop.toml` says.

**Operator action to make the runner observe T116:**

```bash
# From the repo root, stop the running orchestrator:
pkill -TERM -f "ai_orchestrator/orchestrator.py"
# Verify it stopped:
pgrep -a -f "ai_orchestrator/orchestrator.py"   # should print nothing
# Relaunch with --resume so plan/review state is preserved:
python3 ai_orchestrator/orchestrator.py --resume
```

Once relaunched, the next `run_tests` call will (a) execute the T116-patched
function and (b) reload `project.tests` / `project.test_command` from
`agentloop.toml` on disk. Both entries then pass through `bash -lc` with the
declared `cwd`, and both currently exit 0 (backend 438 passed in ~720 s,
frontend 41 passed in ~3 s — reproducible via the T117 simulation script).

## Rules for Future Agents

1. **Do not edit `agentloop.toml` in response to `python: command not found`
   in `test_backend.md` after T116 landed.** The config on disk is already
   correct (uses `./.venv/bin/python` explicitly, `cwd = "."`, inline
   `cd dentacrm/backend`). If the automated runner still reports that error,
   the running orchestrator process pre-dates T116 — the fix is an operator
   restart, not another config edit.

2. **Do not repeat the T117 verification-log row.** `dentacrm/README.md`
   `## Verification log` already contains the closing entry (row dated
   `2026-07-05 03:27`). Adding a duplicate is explicitly forbidden by
   plan_05 and adds noise, not signal.

3. **Do not touch `ai_orchestrator/orchestrator.py` for this class of
   symptom without evidence that the T116 reload block itself is broken.**
   Verify first with:
   ```bash
   python3 -c 'from ai_orchestrator.orchestrator import run_tests; import inspect; \
     assert "cfg_path" in inspect.signature(run_tests).parameters'
   ```
   If that exits 0, the code path is correct and the issue is process
   lifecycle, not code.

4. **Diagnose before editing.** If you see the same failure signal for a
   third consecutive cycle, the loop has already failed. Step back and check
   whether the running process, the on-disk code, and the on-disk config are
   actually consistent with each other. They frequently are not during long
   auto-orchestration runs.

## Reproduction: Confirm Green Without an Orchestrator Restart

The following simulates exactly what the T116-patched `run_tests` will do on
its next invocation. It is the source of truth for "is the project green?"
independent of any running orchestrator instance:

```bash
python3 <<'EOF'
import subprocess, tomllib, pathlib
cfg = tomllib.loads(pathlib.Path('agentloop.toml').read_text())
overall = True
for t in cfg['project']['tests']:
    r = subprocess.run(['bash', '-lc', t['command']], cwd=t['cwd'],
                       capture_output=True, text=True,
                       timeout=int(t.get('timeout_sec', 1800)))
    print(f"{t['name']}: rc={r.returncode}")
    if r.returncode != 0:
        overall = False
print("OVERALL:", "GREEN" if overall else "RED")
EOF
```

Expected output (as of plan_05):

```
backend: rc=0
frontend: rc=0
OVERALL: GREEN
```
