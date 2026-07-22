import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type, style, ...props }, ref) => (
    <input
      ref={ref}
      type={type ?? "text"}
      className={cn(
        "flex h-9 w-full rounded-[12px] px-3.5 py-2 text-sm",
        "outline-none transition-all duration-150",
        "placeholder:text-fg-3",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        invalid && "ring-2 ring-danger/30",
        className,
      )}
      style={{
        background: "hsl(var(--color-surface-2))",
        border: `1px solid ${invalid ? "hsl(var(--color-danger))" : "hsl(var(--color-border))"}`,
        color: "hsl(var(--color-fg))",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.10)",
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = invalid
          ? "hsl(var(--color-danger))"
          : "hsl(var(--color-primary))";
        e.currentTarget.style.boxShadow = invalid
          ? "0 0 0 3px hsl(var(--color-danger) / 0.15)"
          : "0 0 0 3px hsl(var(--color-primary) / 0.15)";
        e.currentTarget.style.background = "hsl(var(--color-surface))";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = invalid
          ? "hsl(var(--color-danger))"
          : "hsl(var(--color-border))";
        e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.10)";
        e.currentTarget.style.background = "hsl(var(--color-surface-2))";
        props.onBlur?.(e);
      }}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);

Input.displayName = "Input";
