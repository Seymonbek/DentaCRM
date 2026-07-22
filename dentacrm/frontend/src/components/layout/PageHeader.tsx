import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Optional icon to display left of the title */
  icon?: ReactNode;
}

export function PageHeader({ title, description, actions, icon }: PageHeaderProps): JSX.Element {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-in">
      <div className="flex items-start gap-4 min-w-0">
        {/* Optional icon badge */}
        {icon ? (
          <div
            className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-teal-400"
            style={{
              background: "linear-gradient(135deg, hsl(173 87% 62% / 0.15), hsl(190 80% 60% / 0.10))",
              border: "1px solid hsl(173 87% 62% / 0.20)",
            }}
          >
            {icon}
          </div>
        ) : null}
        <div>
          <h1 className="text-[22px] font-display font-bold tracking-tight text-fg leading-tight">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 text-sm text-fg-3 leading-relaxed max-w-xl">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
