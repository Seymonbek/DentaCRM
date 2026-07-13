import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Both 'isLoading' and legacy 'loading' are accepted */
  isLoading?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Tasdiqlash",
  cancelLabel = "Bekor qilish",
  destructive = false,
  isLoading,
  loading,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps): JSX.Element {
  const busy = isLoading ?? loading ?? false;
  const handleClose = onCancel ?? onClose ?? (() => undefined);

  return (
    <Modal
      open={open}
      title={title}
      size="sm"
      onClose={busy ? () => undefined : handleClose}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={handleClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            size="md"
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy}
          >
            {destructive && !busy && <Trash2 className="h-3.5 w-3.5" />}
            {busy ? "Bajarilmoqda…" : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {destructive ? (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "hsl(var(--color-danger-bg))",
              border: "1px solid hsl(var(--color-danger) / 0.20)",
            }}
          >
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
        ) : null}
        {description ? (
          <p className="text-sm text-fg-2 leading-relaxed pt-1.5 flex-1">{description}</p>
        ) : null}
      </div>
    </Modal>
  );
}
