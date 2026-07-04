import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm",
          "placeholder:text-slate-400 focus:outline-none focus:ring-2",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          invalid
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/40"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/40",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
