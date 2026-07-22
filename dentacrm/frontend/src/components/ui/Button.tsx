import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size    = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  asChild?:  boolean;
  loading?:  boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: [
    "btn-gradient",
    "text-white font-semibold",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
  ].join(" "),

  secondary: [
    "bg-surface-2 text-fg-2 font-medium",
    "border border-border",
    "shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.55)]",
    "hover:bg-surface-3 hover:border-border hover:text-fg",
    "dark:shadow-[0_1px_2px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.04)]",
    "active:scale-[0.97] active:shadow-none",
    "transition-all duration-150",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),

  outline: [
    "border border-border bg-transparent text-fg-2 font-medium",
    "hover:bg-surface-2 hover:text-fg",
    "active:scale-[0.97]",
    "transition-all duration-150",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),

  ghost: [
    "bg-transparent text-fg-3 font-medium",
    "hover:bg-surface-2 hover:text-fg",
    "active:scale-[0.97]",
    "transition-all duration-150",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),

  destructive: [
    "bg-danger text-white font-semibold",
    "shadow-[0_2px_8px_rgba(220,38,38,0.28),inset_0_1px_0_rgba(255,255,255,0.18)]",
    "hover:brightness-105 hover:shadow-[0_4px_14px_rgba(220,38,38,0.38)]",
    "active:scale-[0.97]",
    "transition-all duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
};

const SIZE_CLASSES: Record<Size, string> = {
  sm:   "h-8  px-3  text-xs  gap-1.5 rounded-[10px]",
  md:   "h-9  px-4  text-sm  gap-2   rounded-[11px]",
  lg:   "h-11 px-5  text-sm  gap-2   rounded-[12px]",
  icon: "h-9  w-9   text-sm  rounded-[11px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        disabled={disabled ?? loading}
        aria-busy={loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading ? (
              <svg
                className="mr-1.5 h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {children}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";
