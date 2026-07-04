import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

import { tokenBridge } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { THEME_STORAGE_KEY, useUiStore } from "@/store/uiStore";

// jsdom lacks ``matchMedia`` — several UI libraries call into it. Define
// it BEFORE the store initialisation runs (already imported above) so that
// theme resolution never crashes in tests.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

// jsdom lacks ``ResizeObserver`` — Recharts' ``ResponsiveContainer`` needs
// one. A no-op polyfill is sufficient because tests don't measure layout.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = ResizeObserverStub;
}

// Reset all Zustand stores + Axios tokens between tests so state does not
// leak across cases.
beforeEach(() => {
  tokenBridge.clear();
  useAuthStore.setState({ user: null, status: "idle", error: null });
  useNotificationStore.setState({ toasts: [] });
  useUiStore.setState({
    sidebarOpen: true,
    activeModal: null,
    theme: "light",
    resolvedTheme: "light",
  });
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Ignore — some tests may lock localStorage on purpose.
  }
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
