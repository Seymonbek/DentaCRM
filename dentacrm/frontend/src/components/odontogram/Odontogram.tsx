import { useMemo } from "react";
import type { PatientOdontogramTooth } from "@/api/patients";

/**
 * Interactive 32-tooth SVG odontogram using FDI numbering.
 *
 * Quadrants (adult permanent teeth):
 *   Upper right: 18 17 16 15 14 13 12 11 (patient's right = viewer's left)
 *   Upper left:  21 22 23 24 25 26 27 28
 *   Lower left:  31 32 33 34 35 36 37 38
 *   Lower right: 48 47 46 45 44 43 42 41
 *
 * Color legend (PROJECT_BRIEF § "UI/UX Design Requirements"):
 *   healthy  → green
 *   planned  → yellow
 *   treated  → blue
 *   missing  → red
 */
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

const STATUS_COLOR: Record<PatientOdontogramTooth["status"], string> = {
  healthy: "hsl(var(--color-success))",
  planned: "hsl(var(--color-warning))",
  treated: "hsl(var(--color-primary))",
  missing: "hsl(var(--color-danger))",
};

export interface OdontogramProps {
  teeth: PatientOdontogramTooth[];
  onSelectTooth?: (tooth: PatientOdontogramTooth) => void;
  selectedTooth?: number | null;
}

export function Odontogram({
  teeth,
  onSelectTooth,
  selectedTooth,
}: OdontogramProps): JSX.Element {
  const byNumber = useMemo(() => {
    const map = new Map<number, PatientOdontogramTooth>();
    for (const t of teeth) map.set(t.toothNumber, t);
    return map;
  }, [teeth]);

  function toothOrDefault(n: number): PatientOdontogramTooth {
    return (
      byNumber.get(n) ?? {
        toothNumber: n,
        status: "healthy",
      }
    );
  }

  return (
    <figure aria-label="Odontogram" className="w-full">
      <div className="card p-4">
        <ToothRow
          teeth={UPPER_RIGHT.concat(UPPER_LEFT)}
          get={toothOrDefault}
          onSelect={onSelectTooth}
          selected={selectedTooth}
        />
        <div className="my-2 border-t border-dashed border-border" />
        <ToothRow
          teeth={LOWER_RIGHT.concat(LOWER_LEFT)}
          get={toothOrDefault}
          onSelect={onSelectTooth}
          selected={selectedTooth}
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-4 text-xs text-fg-3">
        {(
          [
            ["healthy", "Sog'lom"],
            ["planned", "Rejalashtirilgan"],
            ["treated", "Davolangan"],
            ["missing", "Yo'q"],
          ] as const
        ).map(([status, label]) => (
          <span key={status} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            {label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

interface ToothRowProps {
  teeth: number[];
  get: (n: number) => PatientOdontogramTooth;
  onSelect?: (tooth: PatientOdontogramTooth) => void;
  selected?: number | null;
}

function ToothRow({ teeth, get, onSelect, selected }: ToothRowProps): JSX.Element {
  return (
    <div className="grid grid-cols-8 gap-1 md:grid-cols-16">
      {teeth.map((n) => {
        const tooth = get(n);
        const color = STATUS_COLOR[tooth.status];
        const isSelected = selected === n;
        return (
          <button
            key={n}
            type="button"
            title={`Tish ${n} — ${tooth.status}`}
            aria-label={`Tish ${n}, holati ${tooth.status}`}
            onClick={() => onSelect?.(tooth)}
            className={`flex flex-col items-center rounded border transition-colors ${
              isSelected
                ? "border-brand-600 ring-2 ring-brand-500/40"
                : "border-border hover:border-brand-400/50"
            }`}
          >
            <span
              aria-hidden="true"
              className="mt-1 h-6 w-6 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-medium text-fg-2">{n}</span>
          </button>
        );
      })}
    </div>
  );
}
