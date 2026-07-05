import { Suspense, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Suspense boundary used to gate every lazy-loaded route (T120).
 *
 * The fallback intentionally mimics the layout of a real page —
 * header row + a couple of body rows — so the transition from the
 * skeleton to the loaded page is visually stable and does not shift
 * the user's eye. This is the same shimmer skeleton the DataTable
 * loading state uses, so both loading UX paths share a common
 * visual language.
 */
export function RouteSuspense({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-live="polite"
          aria-label="Sahifa yuklanmoqda"
          className="space-y-4 p-6"
          data-testid="route-suspense-fallback"
        >
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
