import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps): JSX.Element {
  return (
    <span
      className={cn("skeleton block", className)}
      aria-hidden="true"
    />
  );
}
