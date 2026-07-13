import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
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
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        {/* Icon */}
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-bg text-danger mb-5">
          <AlertTriangle className="h-6 w-6" />
        </span>

        <p className="text-xs font-semibold uppercase tracking-widest text-danger mb-2">
          Xatolik
        </p>
        <h1 className="text-xl font-bold text-fg">
          Kutilmagan xatolik yuz berdi
        </h1>
        <p className="mt-2 max-w-md text-sm text-fg-3 leading-relaxed">
          Sahifani ko'rsatishda muammo yuz berdi. Qayta urinib ko'ring yoki
          sahifani yangilang. Muammo davom etsa, tizim administratoriga
          murojaat qiling.
        </p>

        {/* Dev-only error details */}
        {import.meta.env.DEV ? (
          <pre
            data-testid="error-boundary-details"
            className="mt-5 max-w-xl overflow-auto rounded-xl border border-border bg-surface-2 p-4 text-left text-xs text-fg-2 font-mono"
          >
            {error.message}
          </pre>
        ) : null}

        <div className="mt-6 flex gap-2">
          <Button variant="primary" size="md" onClick={this.reset}>
            <RefreshCw className="h-3.5 w-3.5" />
            Qayta urinish
          </Button>
          <Button
            variant="secondary"
            size="md"
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
