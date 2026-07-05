import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";

/**
 * Top-level React error boundary (T120 — production hardening).
 *
 * React's rendering pipeline unmounts the whole subtree when a child
 * component throws. Without a boundary, a single misbehaving page —
 * e.g. a lazy-loaded chunk that fails to fetch, a bad API payload
 * that trips an unchecked ``.map()``, or a downstream library crash —
 * takes the entire SPA blank. That is the worst possible failure mode
 * because the user has no recovery path other than a manual browser
 * reload.
 *
 * This component:
 *
 * 1. Catches errors thrown during render / effects in its subtree.
 * 2. Renders a themed fallback UI with two escape hatches — a "retry"
 *    button that clears the boundary state (so a transient error, e.g.
 *    a chunk-load timeout, can be re-attempted without a full reload)
 *    and a "reload" button (nuclear option).
 * 3. Reports the error to the console with the component stack so that
 *    the browser devtools still surface the problem. When a monitoring
 *    provider (Sentry etc.) is wired in later, this hook is the single
 *    place to route the report.
 *
 * The class-based API is required — React does not yet expose an
 * equivalent hooks primitive for catching descendant errors.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional custom fallback renderer. When provided it receives the
   * error and a ``reset`` callback so callers (e.g. per-route boundaries
   * that want a compact inline banner) can render their own UI without
   * losing the retry mechanic.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /**
   * Called with the error and info on catch. Useful for wiring in
   * Sentry.captureException without hard-coding a dep here.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Always log so devtools + server-side logs (via Playwright's
    // captureConsole) can pick it up.
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] caught error:", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Xatolik
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Kutilmagan xatolik yuz berdi
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
          Sahifani ko'rsatishda muammo yuz berdi. Qayta urinib ko'ring yoki
          sahifani yangilang. Muammo davom etsa, tizim administratoriga
          murojaat qiling.
        </p>
        {import.meta.env.DEV ? (
          <pre
            data-testid="error-boundary-details"
            className="mt-4 max-w-xl overflow-auto rounded-md bg-slate-100 p-3 text-left text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {error.message}
          </pre>
        ) : null}
        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={this.reset}>
            Qayta urinish
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
          >
            Sahifani yangilash
          </Button>
        </div>
      </div>
    );
  }
}
