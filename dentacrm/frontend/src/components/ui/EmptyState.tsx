import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      {/* Icon container */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-fg-3"
        style={{
          background: "linear-gradient(135deg, hsl(var(--color-surface-2)), hsl(var(--color-surface-3)))",
          border: "1px solid hsl(var(--color-border))",
          boxShadow: "var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {icon ?? (
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        )}
      </div>

      <div className="max-w-[280px]">
        <p className="text-[14px] font-semibold text-fg leading-tight">{title}</p>
        {description ? (
          <p className="mt-1.5 text-[13px] text-fg-3 leading-relaxed">{description}</p>
        ) : null}
      </div>

      {action ? (
        <div className="mt-1">{action}</div>
      ) : null}
    </div>
  );
}
