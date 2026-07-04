import { useEffect } from "react";
import { CheckCircle2, Info, TriangleAlert, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useNotificationStore, type ToastKind } from "@/store/notificationStore";

const ICONS: Record<ToastKind, JSX.Element> = {
  info: <Info className="h-5 w-5 text-brand-600" aria-hidden="true" />,
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />,
  warning: <TriangleAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />,
  error: <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />,
};

const AUTO_DISMISS_MS: Record<ToastKind, number> = {
  info: 4000,
  success: 3500,
  warning: 6000,
  error: 8000,
};

/** Renders the queue of toasts. Mount once at the app root. */
export function ToastViewport(): JSX.Element {
  const toasts = useNotificationStore((s) => s.toasts);
  const dismiss = useNotificationStore((s) => s.dismiss);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Bildirishnomalar"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          kind={toast.kind}
          title={toast.title}
          description={toast.description}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  id: string;
  kind: ToastKind;
  title?: string;
  description?: string;
  onDismiss: () => void;
}

function ToastItem({ id, kind, title, description, onDismiss }: ToastItemProps): JSX.Element {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, AUTO_DISMISS_MS[kind]);
    return () => window.clearTimeout(timeout);
  }, [kind, onDismiss]);

  return (
    <div
      role="status"
      data-toast-id={id}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-white p-4 shadow-lg animate-fade-in",
        kind === "error" && "border-red-200",
        kind === "warning" && "border-amber-200",
        kind === "success" && "border-emerald-200",
        kind === "info" && "border-brand-200",
      )}
    >
      <div className="mt-0.5 shrink-0">{ICONS[kind]}</div>
      <div className="min-w-0 flex-1">
        {title ? <p className="mb-0.5 text-sm font-semibold text-slate-900">{title}</p> : null}
        {description ? (
          <p className="break-words text-sm text-slate-700">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Yopish"
        className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
