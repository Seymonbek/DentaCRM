/**
 * ThemeProvider — applies the user's theme preference to ``<html>``.
 *
 * The Zustand ``uiStore`` owns the *state* (light | dark | system) and
 * writes it to localStorage. This component is the *side-effect* layer:
 *
 *   * On mount and whenever ``resolvedTheme`` changes, it toggles the
 *     ``dark`` class on ``document.documentElement`` so Tailwind's
 *     ``darkMode: 'class'`` variants activate.
 *   * When the user picks ``system``, it listens to
 *     ``(prefers-color-scheme: dark)`` and forwards changes into the
 *     store via ``refreshResolvedTheme()``.
 *   * It also updates ``<meta name="theme-color">`` so mobile browser
 *     chrome (URL bar) matches the palette.
 *
 * Rendered exactly once at the app root (in ``App.tsx``); returns its
 * children unchanged so it slots into any tree.
 */
import { useEffect, type ReactNode } from "react";

import { useUiStore } from "@/store/uiStore";

const META_LIGHT = "#ffffff";
const META_DARK = "#0f172a";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const theme = useUiStore((s) => s.theme);
  const resolved = useUiStore((s) => s.resolvedTheme);
  const refreshResolvedTheme = useUiStore((s) => s.refreshResolvedTheme);

  // ---- Apply <html class="dark"> whenever resolvedTheme changes -------
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;

    // Sync <meta name="theme-color"> for mobile browser chrome.
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = resolved === "dark" ? META_DARK : META_LIGHT;
  }, [resolved]);

  // ---- Watch prefers-color-scheme when the user picked "system" -------
  useEffect(() => {
    if (theme !== "system") return;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (): void => refreshResolvedTheme();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // Safari <14 fallback
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, [theme, refreshResolvedTheme]);

  return <>{children}</>;
}
