import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type ?? "text"}
      className={cn(
        // Base — iOS rounded input style
        "flex h-9 w-full rounded-[12px] px-3.5 py-2 text-sm",
        "border bg-surface text-fg",
        "placeholder:text-fg-3",
        "outline-none",
        // Subtle inner shadow (Apple control style)
        "shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]",
        "dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]",
        // Transitions
        "transition-all duration-150",
        // Normal border
        "border-border hover:border-fg-3/50",
        // Focus — brand ring (like iOS blue)
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15",
        // Invalid
        invalid && "border-danger focus:border-danger focus:ring-danger/15",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-45",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);

Input.displayName = "Input";
