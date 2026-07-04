import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNotificationStore, toast } from "@/store/notificationStore";
import {
  THEME_STORAGE_KEY,
  resolveTheme,
  useUiStore,
} from "@/store/uiStore";

describe("notification store", () => {
  afterEach(() => {
    useNotificationStore.getState().clear();
  });

  it("adds and dismisses toasts", () => {
    const id = toast.success("Saqlandi");
    expect(useNotificationStore.getState().toasts).toHaveLength(1);
    useNotificationStore.getState().dismiss(id);
    expect(useNotificationStore.getState().toasts).toHaveLength(0);
  });

  it("supports multiple concurrent toasts", () => {
    toast.info("A");
    toast.error("B");
    expect(useNotificationStore.getState().toasts.map((t) => t.kind)).toEqual([
      "info",
      "error",
    ]);
  });

  it("clears the queue", () => {
    toast.info("A");
    toast.info("B");
    useNotificationStore.getState().clear();
    expect(useNotificationStore.getState().toasts).toHaveLength(0);
  });
});

describe("ui store", () => {
  beforeEach(() => {
    // Reset theme to a deterministic starting point for every test.
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    useUiStore.getState().setTheme("light");
  });

  it("toggles the sidebar", () => {
    const { toggleSidebar } = useUiStore.getState();
    const initial = useUiStore.getState().sidebarOpen;
    toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(!initial);
  });

  it("opens and closes modals", () => {
    useUiStore.getState().openModal("edit-patient");
    expect(useUiStore.getState().activeModal).toBe("edit-patient");
    useUiStore.getState().closeModal();
    expect(useUiStore.getState().activeModal).toBeNull();
  });

  it("supports three theme options", () => {
    const setTheme = useUiStore.getState().setTheme;

    setTheme("dark");
    expect(useUiStore.getState().theme).toBe("dark");
    expect(useUiStore.getState().resolvedTheme).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    setTheme("light");
    expect(useUiStore.getState().theme).toBe("light");
    expect(useUiStore.getState().resolvedTheme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    setTheme("system");
    expect(useUiStore.getState().theme).toBe("system");
    // system resolves via matchMedia — either light or dark is valid.
    expect(["light", "dark"]).toContain(useUiStore.getState().resolvedTheme);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
  });

  it("ignores invalid theme values", () => {
    useUiStore.getState().setTheme("dark");
    // @ts-expect-error — invalid values should be rejected at runtime too.
    useUiStore.getState().setTheme("neon");
    expect(useUiStore.getState().theme).toBe("dark");
  });

  it("resolveTheme handles system by delegating to matchMedia", () => {
    const spy = vi
      .spyOn(window, "matchMedia")
      .mockImplementationOnce((query: string) => ({
        matches: query.includes("dark"),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }));
    expect(resolveTheme("system")).toBe("dark");
    spy.mockRestore();
  });
});
