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
          "relative w-full animate-scale-in",
          "rounded-2xl shadow-2xl",
          SIZE[size],
        )}
        style={{
          background: "hsl(var(--color-surface))",
          border: "1px solid hsl(var(--color-border))",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          animationDuration: "180ms",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(109,77,255,0.60), transparent)" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
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
              "text-fg-3 hover:bg-surface-2 hover:text-fg transition-all duration-150 active:scale-95",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="flex items-center justify-end gap-2.5 border-t border-border px-6 py-4 bg-surface-2/40 rounded-b-2xl">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
