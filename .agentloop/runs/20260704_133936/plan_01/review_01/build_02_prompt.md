# Continue Building

You were building and got interrupted. Continue from where you left off.

## Rules
1. Check what exists in the repo snapshot
2. Find the next unfinished task from the plan
3. Implement it completely
4. Run verification
5. Report progress

## Previous Output

{{previous_builder_output}}

## Plan

STDOUT:
Reading directory: [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main[0m[38;5;244m (using tool: read, max depth: 2, max entries: 1000, excluding: defaults)[0m
[38;5;10m ✓ [0mSuccessfully read directory [38;5;141m/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main[0m [38;5;244m(38 entries)[0m
[38;5;244m - Completed in 0.8s[0m

[38;5;141m> [0m[1mjson
[0m[38;5;10m{
  "plan_name": "DentaCRM — Modular monolith (Django 5 + React 18) implementation",
  "phase": 1,
  "done": false,
  "notes": "Initial full plan derived from PROJECT_BRIEF.md. Ordered strictly by dependency. Each task is one build iteration and ends with verification. Backend endpoints precede the frontend that consumes them. Tests and CI come at the end (Phase 6). done stays false until every acceptance criterion (1–33) in PROJECT_BRIEF is met.",
  "tasks": [
    {
      "id": 1,
      "phase": "1-foundation",
      "component": "infra",
      "title": "Repo skeleton + Docker Compose (dev)",
      "description": "Create top-level layout: dentacrm/backend, dentacrm/frontend, docker-compose.yml, .env.example, .gitignore, README stub. docker-compose.yml services: postgres:16 (with btree_gist init script), redis:7, minio, backend (build from backend/Dockerfile), celery_worker, celery_beat, bot, frontend (Vite dev server). Add healthchecks and named volumes. Add a postgres init SQL that runs `CREATE EXTENSION IF NOT EXISTS btree_gist;`. No Django code yet — only Dockerfile placeholders that install requirements.",
      "depends_on": [],
      "acceptance": "docker compose config validates; `docker compose up postgres redis minio` starts and psql shows btree_gist extension available. Files: docker-compose.yml, backend/Dockerfile, frontend/Dockerfile, .env.example, scripts/init-postgres.sql.",
      "brief_criteria": [33]
    },
    {
      "id": 2,
      "phase": "1-foundation",
      "component": "backend",
      "title": "Django project bootstrap + split settings",
      "description": "Create backend/config/{settings/{base.py,dev.py,prod.py}, urls.py, wsgi.py, asgi.py, celery.py}, manage.py, requirements/{base.txt,dev.txt,prod.txt} with PINNED versions (Django==5.0.x, DRF, simplejwt, drf-spectacular, django-filter, django-simple-history, django-storages, boto3, Pillow, psycopg[binary], redis, celery, django-celery-beat, aiogram, factory_boy, pytest-django). Configure DATABASES from env, INSTALLED_APPS with placeholders, LANGUAGE_CODE='uz', TIME_ZONE='Asia/Tashkent'. Wire drf-spectacular at /api/docs/ and /api/schema/. Configure Celery app in config/celery.py.",
      "depends_on": [1],
      "acceptance": "`python manage.py check` passes inside backend container; `python manage.py migrate` runs the auth+contenttypes tables; /api/docs/ returns Swagger UI (empty schema OK).",
      "brief_criteria": [1, 2, 14]
    },
    {
      "id": 3,
      "phase": "1-foundation",
      "component": "backend",
      "title": "core app — BaseModel, pagination, exception handler",
      "description": "Create apps/core with: models.BaseModel (UUID pk, created_at, updated_at, is_active, abstract=True); pagination.StandardResultsSetPagination returning {count,next,previous,results}; exceptions.custom_exception_handler returning {error:{code,message,details}} for DRF errors; permissions.IsBoshShifokor/IsDoctor/IsAdministrator (role checks against request.user.role). Register in settings (DEFAULT_PAGINATION_CLASS, EXCEPTION_HANDLER).",
      "depends_on": [2],
      "acceptance": "Import works; unit test hitting a stub view returns paginated shape; forcing a ValidationError returns the standard error envelope.",
      "brief_criteria": [1]
    },
    {
      "id": 4,
      "phase": "1-foundation",
      "component": "backend",
      "title": "accounts app — User + OTPCode + JWT auth",
      "description": "Custom User with phone_number USERNAME_FIELD (unique), first_name, last_name, role choices (bosh_shifokor|doctor|administrator), telegram_chat_id, two_factor_enabled, is_active. OTPCode model. UserManager. AUTH_USER_MODEL wired BEFORE any migrations run for other apps. simplejwt configured (access 15m, refresh 7d, rotate+blacklist). Endpoints: POST /api/v1/auth/login/ (phone+password → tokens), POST /api/v1/auth/refresh/, GET /api/v1/auth/me/. Serializer for me returns {id, firstName, lastName, phoneNumber, role} (camelCase via to_representation).",
      "depends_on": [3],
      "acceptance": "makemigrations+migrate succeed with custom User as initial. Manual login via httpie returns tokens; /auth/me/ with Bearer works; wrong password returns standard error envelope. Pytest: test_login_success, test_me_requires_auth.",
      "brief_criteria": [3, 15]
    },
    {
      "id": 5,
      "phase": "1-foundation",
      "component": "frontend",
      "title": "Frontend scaffold — Vite+TS+Tailwind+Router+shadcn",
      "description": "cd frontend && init Vite React-TS. Install PINNED versions of: react@18, react-router-dom@6, @tanstack/react-query, zustand, react-hook-form, zod, @hookform/resolvers, axios, tailwindcss, shadcn/ui base components (button, input, dialog, toast, table), date-fns, recharts. Configure tsconfig strict, path alias @/*, tailwind.config.js, index.css. src/ structure: api/, app/ (router, providers), components/{layout,ui}, pages/, hooks/, store/, types/, utils/. Add authStore (Zustand, access token in memory only), notificationStore (toast queue), uiStore. Add axios client with request interceptor (Bearer) and response interceptor for 401 → refresh once via /auth/refresh/ then retry. Add RoleGuard component and router with /login route only (stub Dashboard). .env.example with VITE_API_URL.",
      "depends_on": [4],
      "acceptance": "`npm run build` succeeds with strict TS. `npm run dev` serves /login. Axios interceptor unit-tested with mock adapter for refresh flow.",
      "brief_criteria": [18, 29]
    },
    {
      "id": 6,
...[middle truncated by orchestrator]...
tory per role, DoctorFactory, PatientFactory, AppointmentFactory, TreatmentFactory, MaterialFactory). Required suites: test_double_booking.py, test_commission.py (both bases + override), test_inventory.py (stock decrement + low-stock alert), test_rbac.py (matrix across every endpoint per role). conftest.py sets CELERY_TASK_ALWAYS_EAGER, uses postgres testcontainer or reuse db. Coverage target ≥80% on services/selectors.",
      "depends_on": [17, 15, 10, 8, 9],
      "acceptance": "`pytest -q` all green; coverage.xml produced; RBAC matrix covers every viewset.",
      "brief_criteria": [15]
    },
    {
      "id": 26,
      "phase": "6-polish-deploy",
      "component": "frontend",
      "title": "Frontend test suite — Vitest units + Playwright e2e",
      "description": "Vitest+RTL tests: PatientForm, AppointmentForm, TreatmentForm (nested), Odontogram interaction, axios refresh interceptor, RoleGuard. Playwright: e2e flow login (as administrator) → create patient → book appointment → login as doctor → complete treatment with tooth record → login as bosh_shifokor → verify dashboard KPI change and Finance revenue up. Playwright runs against docker-compose stack.",
      "depends_on": [24, 21, 20, 16],
      "acceptance": "`npm run test` green; `npm run e2e` green in CI (with docker-compose services running).",
      "brief_criteria": [32]
    },
    {
      "id": 27,
      "phase": "6-polish-deploy",
      "component": "backend",
      "title": "seed_demo_data management command",
      "description": "backend/apps/core/management/commands/seed_demo_data.py: idempotent (delete-recreate under --fresh flag). Creates: 1 bosh_shifokor (phone +998900000001 / password demo1234), 2 doctors (with DoctorProfile, working hours Mon–Fri 09:00–18:00, one procedure type each), 1 administrator, 10 patients, 5 appointments across next 7 days with mixed statuses, 3 completed treatments with tooth records + material usage + one payment each, 5 materials (one below threshold). Prints credentials at the end.",
      "depends_on": [17, 15, 10],
      "acceptance": "`python manage.py seed_demo_data --fresh` succeeds; running twice without --fresh does not duplicate; UI login with printed creds works.",
      "brief_criteria": [17]
    },
    {
      "id": 28,
      "phase": "6-polish-deploy",
      "component": "infra",
      "title": "Production compose — Nginx + Gunicorn + prod settings",
      "description": "docker-compose.prod.yml with: nginx service serving frontend build + reverse-proxying /api → gunicorn backend (--workers 4 --timeout 60), gunicorn service, celery worker, celery beat, bot (webhook mode), postgres (external volume), redis, minio. backend/Dockerfile multi-stage for prod (no dev deps). frontend/Dockerfile multi-stage (build → nginx static). config/settings/prod.py: DEBUG=False, SECURE_* headers, ALLOWED_HOSTS from env, S3/MinIO storage backend, SIMPLE_JWT tokens signed with env secret. Provide nginx/nginx.conf with gzip + static caching. Document env vars in .env.example.",
      "depends_on": [1],
      "acceptance": "`docker compose -f docker-compose.prod.yml config` validates; local prod smoke test: `docker compose -f docker-compose.prod.yml up` serves frontend at :80 and /api/docs/ works over the same origin.",
      "brief_criteria": [33]
    },
    {
      "id": 29,
      "phase": "6-polish-deploy",
      "component": "infra",
      "title": "GitHub Actions CI — lint + test + build",
      "description": ".github/workflows/ci.yml with jobs: backend (ruff + mypy + pytest on postgres+redis service containers), frontend (eslint + tsc --noEmit + vitest + build), docker-build (build both images, do not push). Cache pip and npm. Fail on any red step.",
      "depends_on": [25, 26, 28],
      "acceptance": "Push to a PR → all 3 jobs green on a clean seeded state. Badge added to README.",
      "brief_criteria": [33]
    },
    {
      "id": 30,
      "phase": "6-polish-deploy",
      "component": "backend",
      "title": "Swagger polish + final acceptance sweep",
      "description": "drf-spectacular: tag every viewset, add @extend_schema examples for auth, appointments (available-slots), treatments (nested), payments, reports. Add security scheme (Bearer). Ensure every endpoint listed in PROJECT_BRIEF section 'API Endpoints' is present and documented. Manually walk through acceptance criteria 1–33 and file any regressions as follow-up planner input.",
      "depends_on": [29, 27],
      "acceptance": "/api/docs/ shows all documented endpoints with examples; a checklist file docs/acceptance.md maps each of the 33 criteria to the task/test that proves it and is fully checked.",
      "brief_criteria": [14, 33]
    }
  ]
}
[0m[0m[0m
[0m[0m
Notes on the plan structure:[0m[0m
[0m[0m
- Ordering is strict on dependencies: [38;5;10maccounts[0m (T4) unblocks every other backend app; [38;5;10mscheduling[0m waits on [38;5;10mdoctors[0m + [38;5;10mpatients[0m; [38;5;10mpayments[0m waits on [38;5;10mtreatments[0m + [38;5;10minventory[0m because commission-from-net needs material cost.[0m[0m
- Backend endpoints always land before the frontend task that consumes them (e.g. T10 before T24, T17 before T21, T18–19 before T20).[0m[0m
- Parallelizable tracks: after T4, T7 / T9 / T5 can run in parallel; after T12, T13 / T14 / T15 can run in parallel; T25 and T26 can run in parallel.[0m[0m
- [38;5;10mdone: false[0m because none of the 33 acceptance criteria are met yet. The plan will flip to [38;5;10mdone: true[0m only after T30's acceptance checklist passes end-to-end.
STDERR:
[32mAll tools are now trusted ([0m[31m![0m[32m). Kiro will execute tools without asking for confirmation.[0m
Agents can sometimes do unexpected things so understand the risks.

Learn more at [38;5;141mhttps://kiro.dev/docs/cli/chat/security/#using-tools-trust-all-safely[0m



[38;5;252m[0m[?25l[?25l[0m[0m[?25l[0m[0m[0m
[38;5;8m
 ▸ Credits: 3.08 • Time: 2m 0s

[0m[1G[0m[0m[?25h


## Reviewer Feedback



## Repository Snapshot

## git_status
```text
fatal: not a git repository (or any of the parent directories): .git

```

## git_diff_stat
```text
warning: Not a git repository. Use --no-index to compare two paths outside a working tree
usage: git diff --no-index [<options>] <path> <path>

Diff output format options
    -p, --patch           generate patch
    -s, --no-patch        suppress diff output
    -u                    generate patch
    -U, --unified[=<n>]   generate diffs with <n> lines context
    -W, --[no-]function-context
                          generate diffs with <n> lines context
    --raw                 generate the diff in raw format
    --patch-with-raw      synonym for '-p --raw'
    --patch-with-stat     synonym for '-p --stat'
    --numstat             machine friendly --stat
    --shortstat           output only the last line of --stat
    -X, --dirstat[=<param1,param2>...]
                          output the distribution of relative amount of changes for each sub-directory
    --cumulative          synonym for --dirstat=cumulative
    --dirstat-by-file[=<param1,param2>...]
                          synonym for --dirstat=files,param1,param2...
    --check               warn if changes introduce conflict markers or whitespace errors
    --summary             condensed summary such as creations, renames and mode changes
    --name-only           show only names of changed files
    --name-status         show only names and status of changed files
    --stat[=<width>[,<name-width>[,<count>]]]
                          generate diffstat
    --stat-width <width>  generate diffstat with a given width
    --stat-name-width <width>
                          generate diffstat with a given name width
    --stat-graph-width <width>
                          generate diffstat with a given graph width
    --stat-count <count>  generate diffstat with limited lines
    --[no-]compact-summary
                          generate compact summary in diffstat
    --binary              output a binary diff that can be applied
    --[no-]full-index     show full pre- and post-image object names on the "index" lines
    --[no-]color[=<when>] show colored diff
    --ws-error-highlight <kind>
                          highlight whitespace errors in the 'context', 'old' or 'new' lines in the diff
    -z                    do not munge pathnames and use NULs as output field terminators in --raw or --numstat
    --[no-]abbrev[=<n>]   use <n> digits to display object names
    --src-prefix <prefix> show the given source prefix instead of "a/"
    --dst-prefix <prefix> show the given destination prefix instead of "b/"
    --line-prefix <prefix>
                          prepend an additional prefix to every line of output
    --no-prefix           do not show any source or destination prefix
    --default-prefix      use default prefixes a/ and b/
    --inter-hunk-context <n>
                          show context between diff hunks up to the specified number of lines
    --output-indicator-new <char>
                          specify the character to indicate a new line instead of '+'
    --
...[middle truncated by orchestrator]...
ore-cr-at-eol    ignore carrier-return at the end of line
    --ignore-blank-lines  ignore changes whose lines are all blank
    -I, --[no-]ignore-matching-lines <regex>
                          ignore changes whose all lines match <regex>
    --[no-]indent-heuristic
                          heuristic to shift diff hunk boundaries for easy reading
    --patience            generate diff using the "patience diff" algorithm
    --histogram           generate diff using the "histogram diff" algorithm
    --diff-algorithm <algorithm>
                          choose a diff algorithm
    --anchored <text>     generate diff using the "anchored diff" algorithm
    --word-diff[=<mode>]  show word diff, using <mode> to delimit changed words
    --word-diff-regex <regex>
                          use <regex> to decide what a word is
    --color-words[=<regex>]
                          equivalent to --word-diff=color --word-diff-regex=<regex>
    --[no-]color-moved[=<mode>]
                          moved lines of code are colored differently
    --[no-]color-moved-ws <mode>
                          how white spaces are ignored in --color-moved

Other diff options
    --[no-]relative[=<prefix>]
                          when run from subdir, exclude changes outside and show relative paths
    -a, --[no-]text       treat all files as text
    -R                    swap two inputs, reverse the diff
    --[no-]exit-code      exit with 1 if there were differences, 0 otherwise
    --[no-]quiet          disable all output of the program
    --[no-]ext-diff       allow an external diff helper to be executed
    --[no-]textconv       run external text conversion filters when comparing binary files
    --ignore-submodules[=<when>]
                          ignore changes to submodules in the diff generation
    --submodule[=<format>]
                          specify how differences in submodules are shown
    --ita-invisible-in-index
                          hide 'git add -N' entries from the index
    --ita-visible-in-index
                          treat 'git add -N' entries as real in the index
    -S <string>           look for differences that change the number of occurrences of the specified string
    -G <regex>            look for differences that change the number of occurrences of the specified regex
    --pickaxe-all         show all changes in the changeset with -S or -G
    --pickaxe-regex       treat <string> in -S as extended POSIX regular expression
    -O <file>             control the order in which files appear in the output
    --rotate-to <path>    show the change in the specified path first
    --skip-to <path>      skip the output to the specified path
    --find-object <object-id>
                          look for differences that change the number of occurrences of the specified object
    --diff-filter [(A|C|D|M|R|T|U|X|B)...[*]]
                          select files by diff type
    --output <file>       output to a specific file


```

## recent_files
```text
agentloop.toml
agentloop.toml.example
AGENTS.md
ai_orchestrator/context_store.py
ai_orchestrator/dashboard.py
ai_orchestrator/__init__.py
ai_orchestrator/orchestrator.py
ai_orchestrator/telegram_notifier.py
dentacrm/backend/Dockerfile
dentacrm/backend/.dockerignore
dentacrm/backend/README.md
dentacrm/docker-compose.yml
dentacrm/.env
dentacrm/.env.example
dentacrm/frontend/Dockerfile
dentacrm/frontend/.dockerignore
dentacrm/frontend/package.json
dentacrm/frontend/placeholder-server.mjs
dentacrm/frontend/README.md
dentacrm/.gitignore
dentacrm/README.md
dentacrm/scripts/init-postgres.sql
.env.example
examples/todo_app/agentloop.toml
examples/todo_app/PROJECT_BRIEF.md
.gitignore
.kiro/agents/ai-builder.json
.kiro/agents/ai-planner.json
.kiro/agents/ai-reviewer.json
.kiro/steering/orchestration.md
PROJECT_BRIEF.md
prompts/builder_codex.md
prompts/continue_codex.md
prompts/discovery_kiro.md
prompts/planner_kiro.md
prompts/replan_kiro.md
prompts/review_kiro.md
pyproject.toml
README.md

```

## Brief

# DentaCRM — Tish klinikalari uchun boshqaruv tizimi

## Goal

Tish klinikalari uchun to'liq CRM tizimi qurish: bemor boshqaruvi, navbat/jadval, davolanish yozuvlari, odontogram (tish formulasi), omborxona, to'lovlar, shifokor reytingi, Telegram bot va boshqaruv paneli. Modular monolith arxitektura: Django 5 backend + React 18 frontend.

---

## Tech Stack

### Backend
- Python 3.12, Django 5.x, Django REST Framework
- PostgreSQL 16 (btree_gist extension)
- Redis 7 (cache + Celery broker)
- Celery 5.x + Celery Beat
- Aiogram 3.x (Telegram bot)
- djangorestframework-simplejwt (auth)
- drf-spectacular (Swagger docs)
- django-filter, django-storages, django-simple-history
- Pillow, factory_boy, pytest-django

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS + shadcn/ui
- TanStack Query (server state)
- Zustand (UI state)
- React Hook Form + Zod (formalar)
- Axios (HTTP, auto-refresh interceptor)
- React Router v6
- Recharts (grafiklar)
- date-fns
- Vitest + React Testing Library + Playwright

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)
- MinIO (S3-compatible storage, local dev)
- GitHub Actions (CI/CD)

---

## Architecture

Modular monolith: bitta Django loyihasi, ajratilgan apps/ modullar, bitta deploy birligi.

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                             │
│   React SPA (Bosh shifokor / Doktor / Administrator panellari)    │
│                    Telegram (bemor va xodim botlari)               │
└───────────────────────┬───────────────────────┬───────────────────┘
                         │ HTTPS/REST (JWT)      │ Telegram Bot API
                         ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                              │
│  Django 5 + DRF (Gunicorn)              Aiogram 3.x bot            │
│  /api/v1/...                             (webhook, prod)           │
└───────────────────────┬───────────────────────┬───────────────────┘
                         │                       │
              ┌──────────┴──────────┐   ┌────────┴─────────┐
              ▼                     ▼   ▼                  ▼
      ┌───────────────┐   ┌────────────────┐    ┌────────────────┐
      │  PostgreSQL 16 │   │  Redis 7        │    │  Object Storage │
      └───────────────┘   │  cache/broker    │    │  (S3 / MinIO)   │
                           └───────┬────────┘    └────────────────┘
                                   ▼
                          ┌──────────────────┐
                          │ Celery worker +   │
                          │ Celery beat       │
                          └──────────────────┘
```

Qatlamlar (har app ichida): models.py → selectors.py (o'qish) → services.py (yozish/logika) → serializers.py → permissions.py → views.py (faqat orkestratsiya) → tasks.py → signals.py

### Repository tuzilishi
```
dentacrm/
├── backend/
│   ├── config/
│   │   ├── settings/{base.py, dev.py, prod.py}
│   │   ├── urls.py, celery.py, asgi.py, wsgi.py
│   ├── apps/
│   │   ├── core/ accounts/ departments/ doctors/ patients/
│   │   ├── scheduling/ treatments/ odontogram/ prescriptions/
│   │   ├── inventory/ payments/ ratings/ notifications/
│   │   ├── reports/ telegram_bot/
│   ├── tests/
│   ├── manage.py
│   ├── requirements/{base.txt, dev.txt, prod.txt}
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/ app/ components/ pages/ hooks/ store/ types/ utils/
│   ├── .env.example
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
└── .github/workflows/ci.yml
```

---

## Database Schema

### core app
- `BaseModel` (abstract): `id: UUID`, `created_at: DateTimeField(auto_now_add)`, `updated_at: DateTimeField(auto_now)`, `is_active: BooleanField(default=True)`

### accounts app
- `User`: `phone_number` (unique, login sifatida), `first_name`, `last_name`, `role` (choices: bosh_shifokor/doctor/administrator), `telegram_chat_id` (nullable), `two_factor_enabled` (bool), `is_active`
- `OTPCode`: `user` FK, `code` (CharField), `purpose` (choices: login/password_reset), `expires_at`, `is_used`

### departments app
- `Department`: `name`, `description`, `created_by` FK(User), `is_active`

### doctors app
- `DoctorProfile`: `user` OneToOne(User), `departments` M2M(Department), `specialization`, `bio`, `commission_basis` (choices: from_total/from_net), `default_commission_rate` (DecimalField), `can_view_other_doctors` (bool)
- `WorkingHours`: `doctor` FK(DoctorProfile), `weekday` (0-6), `start_time`, `end_time`
- `TimeOff`: `doctor` FK, `date_start`, `date_end`, `reason`
- `ProcedureType`: `name`, `department` FK, `default_duration_minutes`, `default_price`, `commission_rate_override` (nullable)

### patients app
- `Patient`: `first_name`, `last_name`, `phone_number`, `gender` (nullable, choices: male/female), `address` (nullable), `notes` (allergiya/surunkali kasalliklar), `telegram_chat_id` (nullable), `created_by` FK(User)

### scheduling app
- `Appointment`: `patient` FK, `doctor` FK, `department` FK, `procedure_type` FK (nullable), `scheduled_start` (DateTimeField), `scheduled_end` (DateTimeField), `status` (choices: scheduled/confirmed/in_progress/completed/cancelled/no_show), `created_by` FK, `reminder_1d_sent` (bool), `reminder_2h_sent` (bool)
- **Double-booking himoyasi:** PostgreSQL ExclusionConstraint (btree_gist) — `(doctor_id, tstzrange(scheduled_start, scheduled_end))` DB darajasida

### treatments app
- `Treatment`: `appointment` FK, `doctor` FK, `patient` FK, `department` FK, `procedure_type` FK, `diagnosis`, `description`, `price` (DecimalField), `payment_status` (choices: unpaid/partial/paid), `stage` (choices: in_progress/completed)
- `TreatmentPhoto`: `treatment` FK, `photo_type` (choices: before/after/xray), `image` (ImageField), `uploaded_at`

### odontogram app
- `ToothRecord`: `treatment` FK, `
...[middle truncated by orchestrator]...
RestockForm`, `WorkingHoursEditor` (React Hook Form + Zod)

### State Management
- `authStore` (Zustand): user, accessToken (faqat memory, localStorage emas), login/logout/refresh
- `uiStore` (Zustand): sidebarOpen, activeModal, theme
- `notificationStore` (Zustand): toast queue
- Server state: TanStack Query (usePatients, useAppointments, etc.)

### TypeScript Interfaces
- `User`: id, firstName, lastName, phoneNumber, role
- `Patient`: id, firstName, lastName, phoneNumber, gender?, address?, notes?
- `Doctor`: id, user, departments[], specialization, commissionBasis
- `Appointment`: id, patientId, doctorId, scheduledStart (ISO), scheduledEnd, status
- `Treatment`: id, appointmentId, diagnosis, price, paymentStatus, toothRecords[]
- `ToothRecord`: toothNumber, procedure, status
- `Material`: id, name, unit, quantityInStock, minimumThreshold
- `Payment`: id, treatmentId, amount, method

---

## Acceptance Criteria

### Backend
1. ✅ Django loyihasi ishlaydi, barcha app'lar ro'yxatdan o'tgan
2. ✅ PostgreSQL ga ulanadi, barcha modellar migrate qilingan
3. ✅ JWT auth ishlaydi (login, refresh, me endpoint)
4. ✅ RBAC — har rol faqat o'ziga ruxsat berilgan endpointlarga kira oladi
5. ✅ Double-booking himoyasi — PostgreSQL ExclusionConstraint bilan DB darajasida
6. ✅ Barcha CRUD endpointlar ishlaydi (patients, appointments, treatments, payments, materials)
7. ✅ Odontogram — tooth_number validatsiyasi (FDI: 11-48), treatment bilan bog'lanadi
8. ✅ Komissiya avtomatik hisoblanadi (from_total va from_net)
9. ✅ Inventory — MaterialUsage signal orqali stock avtomatik kamayadi + low_stock alert
10. ✅ Retsept Telegram orqali bemorga yuboriladi
11. ✅ Celery tasklar ishlaydi (reminder, follow-up, cache, backup)
12. ✅ Rasm yuklash (before/after/xray) + thumbnail generatsiya
13. ✅ Reports — aggregate querylar + Redis cache
14. ✅ Swagger docs `/api/docs/` da ko'rinadi
15. ✅ Tests — double-booking, komissiya, inventory, RBAC uchun pytest testlar
16. ✅ Docker Compose — backend, postgres, redis, celery, bot barasi ishlaydi
17. ✅ seed_demo_data management command (1 bosh shifokor, 2 doktor, 1 admin, 10 bemor)

### Frontend
18. ✅ Login sahifasi ishlaydi, JWT token bilan auth
19. ✅ Role-based routing — har rol faqat o'z sahifalarini ko'radi
20. ✅ Dashboard — statistika grafiklari (Recharts)
21. ✅ Patients CRUD — qidirish, kartochka, timeline
22. ✅ Odontogram — interaktiv SVG, tish tanlash va muolaja belgilash
23. ✅ ScheduleCalendar — shifokor jadvali, bo'sh slotlarni ko'rsatish
24. ✅ Appointments — yaratish (slot tanlash), status o'zgartirish
25. ✅ Treatments — forma (tish yozuvlari, materiallar birga), rasm yuklash
26. ✅ Payments — to'lov kiritish, qarzdorlik ko'rsatish
27. ✅ Inventory — materiallar ro'yxati, restock, low-stock warning
28. ✅ Ratings — leaderboard, badge'lar
29. ✅ Axios interceptor — access token avtomatik refresh
30. ✅ Loading (Skeleton), Error (toast), Empty state barcha sahifalarda

### Integration
31. ✅ Telegram bot — xodim bildirishnomalari + bemor eslatmalari ishlaydi
32. ✅ End-to-end: login → navbat → davolanish → to'lov oqimi ishlaydi
33. ✅ docker-compose up bilan butun tizim bir komandada ishga tushadi

---

## Non-goals

- Multi-tenant (ko'p klinika) — faqat bitta klinika uchun
- Bemor o'zi navbatga yozilishi (faqat administrator orqali)
- Real payment gateway integratsiyasi (Payme/Click API) — faqat to'lov turini saqlash
- Mobile native app — faqat responsive web
- Video konsultatsiya
- AI-based diagnostika

---

## Constraints

- Barcha external service'lar (Telegram, S3) local dev'da mock/MinIO bilan ishlashi kerak
- PostgreSQL 16 bilan ishlash kerak (btree_gist uchun)
- Python 3.12+, Node 20+
- Docker Compose bilan bir komandada ishga tushishi kerak
- Secrets faqat .env faylda, kodda hech qanday hardcoded secret bo'lmasligi kerak
- Barcha API response'lar standart error format (4.3 bandga mos)
- Frontend — mobile-first responsive dizayn
- Audit log — Treatment, Payment, Material o'zgarishlari django-simple-history bilan kuzatiladi

---

## Implementation Phases

### Faza 1 — Foundation (birinchi qurilishi kerak)
1. Docker Compose setup (postgres, redis, backend, frontend containers)
2. Django project structure (config/, apps/, settings)
3. core app (BaseModel, pagination, exception handler)
4. accounts app (User model, JWT auth, login/refresh/me)
5. RBAC permissions (IsBoshShifokor, IsDoctor, IsAdministrator)
6. Frontend: Vite + React + TypeScript setup, routing, auth store, login page

### Faza 2 — Core Business Logic
7. departments app (CRUD)
8. doctors app (DoctorProfile, WorkingHours, TimeOff, ProcedureType)
9. patients app (CRUD + search)
10. scheduling app (Appointments + double-booking constraint + available-slots)
11. Frontend: Sidebar, DataTable, departments/doctors/patients sahifalari

### Faza 3 — Clinical Features
12. treatments app (Treatment, TreatmentPhoto, nested creation)
13. odontogram app (ToothRecord, FDI validation)
14. prescriptions app (templates + generation)
15. inventory app (Material, MaterialUsage, signals, stock logs)
16. Frontend: PatientDetail (timeline + odontogram), TreatmentForm, InventoryPage

### Faza 4 — Finance & Ratings
17. payments app (Payment, CommissionRecord, balance calculation)
18. ratings app (ScoreLog, Badge, DoctorBadge, leaderboard)
19. reports app (aggregate selectors, Redis cache)
20. Frontend: FinancePage, RatingsPage, DashboardPage (charts)

### Faza 5 — Notifications & Bot
21. notifications app (NotificationLog)
22. telegram_bot app (Aiogram dispatcher, staff/patient routers)
23. Celery tasks (reminders, follow-up, cache refresh, backup)
24. Frontend: ScheduleCalendar, NewAppointmentPage (slot picker)

### Faza 6 — Polish & Deploy
25. Tests (pytest: double-booking, commission, inventory, RBAC)
26. Frontend tests (Vitest: forms, Odontogram; Playwright: e2e flow)
27. seed_demo_data management command
28. Docker Compose production config (nginx, gunicorn, env)
29. GitHub Actions CI (lint + test + build)
30. Swagger docs finalization


## Output

End with:
```json
{
  "state": "needs_review | complete | blocked",
  "summary": "What you changed",
  "files_changed": ["path/to/file"],
  "verification": "Commands run and results",
  "next_suggested_task": "What should happen next",
  "blockers": []
}
```
