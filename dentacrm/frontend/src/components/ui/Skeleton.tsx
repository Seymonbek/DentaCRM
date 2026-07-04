import { cn } from "@/lib/utils";

/**
 * Skeleton block used for loading states.
 *
 * PROJECT_BRIEF § "Zamonaviy CRM dizayn qoidalari" #9 asks for a
 * shimmer effect (not a pulse). The shimmer keyframe + gradient live
 * in ``tailwind.config.js`` + ``index.css`` (``.skeleton`` component
 * class), and this component reuses them so every loading state shares
 * the same visual language and theme tokens.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "block h-4 w-full rounded-md",
        "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200",
        "bg-[length:200%_100%] animate-shimmer",
        "dark:from-slate-800 dark:via-slate-700 dark:to-slate-800",
        className,
      )}
      {...props}
    />
  );
}
