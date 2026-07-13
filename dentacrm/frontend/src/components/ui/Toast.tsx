import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationStore, type ToastKind } from "@/store/notificationStore";

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

const STYLES: Record<ToastKind, { wrapper: string; icon: string; bar: string }> = {
  success: {
    wrapper: "border-emerald-500/25 bg-emerald-950/80",
    icon:    "text-emerald-400",
    bar:     "bg-emerald-500",
  },
  error: {
    wrapper: "border-red-500/25 bg-red-950/80",
    icon:    "text-red-400",
    bar:     "bg-red-500",
  },
  warning: {
    wrapper: "border-amber-500/25 bg-amber-950/80",
    icon:    "text-amber-400",
    bar:     "bg-amber-500",
  },
  info: {
    wrapper: "border-violet-500/25 bg-violet-950/80",
    icon:    "text-violet-400",
    bar:     "bg-violet-500",
  },
};

export function ToastViewport(): JSX.Element {
  const toasts = useNotificationStore((s) => s.toasts);
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[360px]"
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          id={t.id}
          kind={t.kind}
          title={t.title}
          message={t.description}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  id: string;
  kind: ToastKind;
  title?: string;
  message?: string;
  duration?: number;
}

function ToastItem({ id, kind, title, message, duration = 4500 }: ToastItemProps): JSX.Element {
  const dismiss = useNotificationStore((s) => s.dismiss);
  const Icon = ICONS[kind];
  const s = STYLES[kind];

  useEffect(() => {
    const t = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, dismiss]);

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto relative flex items-start gap-3.5 rounded-2xl border p-4",
        "animate-toast-in overflow-hidden",
        s.wrapper,
      )}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: "0 20px 48px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Left color bar */}
      <div className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-full", s.bar)} />

      <Icon className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", s.icon)} aria-hidden="true" />

      <div className="min-w-0 flex-1 pl-1">
        {title ? (
          <p className="text-[13px] font-semibold leading-tight text-white">{title}</p>
        ) : null}
        {message ? (
          <p className={cn("text-[12px] leading-snug text-slate-400", title ? "mt-1" : "font-medium text-white")}>
            {message}
          </p>
        ) : null}
      </div>

      <button
        onClick={() => dismiss(id)}
        aria-label="Yopish"
        className="shrink-0 rounded-lg p-1 text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all duration-150 active:scale-90"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
