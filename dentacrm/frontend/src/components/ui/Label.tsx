import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>): JSX.Element {
  return (
    <label
      {...props}
      className={cn("mb-1 block text-sm font-medium text-slate-700", className)}
    >
      {children}
    </label>
  );
}
