import { create } from "zustand";

export type ToastKind = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  kind: ToastKind;
  title?: string;
  description?: string;
  createdAt: number;
}

export interface NotificationState {
  toasts: ToastMessage[];
  push: (input: Omit<ToastMessage, "id" | "createdAt"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

let counter = 0;
function nextId(): string {
  counter += 1;
  return `t-${Date.now()}-${counter}`;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  push: (input) => {
    const id = input.id ?? nextId();
    const message: ToastMessage = {
      id,
      kind: input.kind,
      title: input.title,
      description: input.description,
      createdAt: Date.now(),
    };
    set((s) => ({ toasts: [...s.toasts, message] }));
    return id;
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/**
 * Convenience helpers so components can call
 *   toast.success("Saqlandi")
 * without pulling the whole store.
 */
export const toast = {
  info: (msg: string, title?: string) =>
    useNotificationStore.getState().push({ kind: "info", description: msg, title }),
  success: (msg: string, title?: string) =>
    useNotificationStore.getState().push({ kind: "success", description: msg, title }),
  warning: (msg: string, title?: string) =>
    useNotificationStore.getState().push({ kind: "warning", description: msg, title }),
  error: (msg: string, title?: string) =>
    useNotificationStore.getState().push({ kind: "error", description: msg, title }),
};
