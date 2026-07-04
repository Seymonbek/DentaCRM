import { FileQuestion } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state — used when a list has no rows.
 *
 * PROJECT_BRIEF § "Zamonaviy CRM dizayn qoidalari" #8: illustration +
 * description text + optional action button. Uses theme tokens so it
 * looks correct in both light and dark modes.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed",
        "border-slate-300 bg-white p-10 text-center",
        "dark:border-slate-700 dark:bg-slate-800",
        className,
      )}
    >
      <div className="mb-3 text-slate-400 dark:text-slate-500">
        {icon ?? <FileQuestion className="h-10 w-10" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
