import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";


interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

const SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({
  open,
  title,
  description,
  size = "md",
  onClose,
  footer,
  children,
}: ModalProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-in"
        style={{
          background: "rgba(5, 4, 16, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          animationDuration: "150ms",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "relative w-full animate-scale-in rounded-2xl shadow-2xl",
          SIZE[size],
        )}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 var(--card-shine)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          animationDuration: "180ms",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.70), transparent)" }}
        />

        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div>
            <h2 id="modal-title" className="text-[16px] font-display font-bold text-fg leading-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-fg-3">{description}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className={cn(
              "-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              "text-fg-3 hover:bg-white/[0.08] hover:text-fg transition-all duration-150 active:scale-95",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer ? (
          <div
            className="flex items-center justify-end gap-2.5 px-6 py-4 rounded-b-2xl border-t"
            style={{
              borderColor: "var(--card-border)",
              background: "hsl(var(--color-surface-2) / 0.40)",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
