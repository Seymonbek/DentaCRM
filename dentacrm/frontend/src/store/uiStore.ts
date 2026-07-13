/**
 * UI store (Zustand) — global UI state that persists between sessions.
 *
 * Responsibilities:
 *   * ``sidebarOpen`` — collapse state of the sidebar (mobile / tablet).
 *   * ``activeModal`` — id of the currently-open modal (null when none).
 *   * Theme system (``theme`` + ``resolvedTheme``) — see below.
 *
 * Theme model
 * -----------
 * PROJECT_BRIEF § "Theme System" mandates three user-selectable themes:
 *   1. ``light`` — force light palette (#2563EB primary).
 *   2. ``dark``  — force dark palette (#3B82F6 primary).
 *   3. ``system`` — follow ``prefers-color-scheme`` at runtime.
 *
 * The store exposes:
 *   * ``theme``          — the user's *preference* (light | dark | system).
 *   * ``resolvedTheme``  — the *effective* palette (light | dark) after
 *                          resolving "system" against the media query.
 *   * ``setTheme(next)`` — updates preference, persists to localStorage,
 *                          re-evaluates ``resolvedTheme``.
 *
 * The <html> class is toggled by ``ThemeProvider`` (src/app/ThemeProvider.tsx)
 * — the store stays UI-framework agnostic so it is testable in isolation.
 *
 * Persistence
 * -----------
 * ``theme`` is written to ``localStorage`` under
 * :data:`THEME_STORAGE_KEY`. The initial value is read synchronously
 * from storage on module load so there is no flash of the wrong theme
 * on refresh. ``sidebarOpen`` is *not* persisted — collapse-state is
 * per-session UX only.
 */
import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "dentacrm.theme";

const THEME_VALUES: ReadonlySet<ThemePreference> = new Set([
  "light",
  "dark",
  "system",
]);

// ---------------------------------------------------------------------------
// Helpers (safe outside a browser — no window access at import time in tests)
// ---------------------------------------------------------------------------
function hasWindow(): boolean {
  return typeof window !== "undefined";
}

/** Read the user's stored preference; default to ``system``. */
export function readStoredTheme(): ThemePreference {
  if (!hasWindow()) return "system";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && THEME_VALUES.has(raw as ThemePreference)) {
      return raw as ThemePreference;
    }
  } catch {
    // localStorage may be blocked (private-mode) — fall through.
  }
  return "system";
}

/** Read the current OS-level preference. Falls back to ``light``. */
export function getSystemTheme(): ResolvedTheme {
  if (!hasWindow() || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Compute the effective palette from a user preference. */
export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  return pref === "system" ? getSystemTheme() : pref;
}

function writeStoredTheme(pref: ThemePreference): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Ignore write failures — preference reverts to default on next load.
  }
}

export const COLLAPSED_STORAGE_KEY = "dentacrm.sidebarCollapsed";

export function readStoredCollapsed(): boolean {
  if (!hasWindow()) return false;
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStoredCollapsed(collapsed: boolean): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Store definition
// ---------------------------------------------------------------------------
export interface UiState {
  // Sidebar / modal
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null;
  // Theme
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;

  // Actions
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setTheme: (theme: ThemePreference) => void;
  /**
   * Recompute ``resolvedTheme`` — called by :func:`ThemeProvider` when the
   * OS-level ``prefers-color-scheme`` changes while ``theme === "system"``.
   */
  refreshResolvedTheme: () => void;
}

const initialPref = readStoredTheme();
const initialCollapsed = readStoredCollapsed();

export const useUiStore = create<UiState>((set, get) => ({
  sidebarOpen: true,
  sidebarCollapsed: initialCollapsed,
  activeModal: null,
  theme: initialPref,
  resolvedTheme: resolveTheme(initialPref),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => {
    const next = !get().sidebarCollapsed;
    writeStoredCollapsed(next);
    set({ sidebarCollapsed: next });
  },
  setSidebarCollapsed: (collapsed) => {
    writeStoredCollapsed(collapsed);
    set({ sidebarCollapsed: collapsed });
  },
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  setTheme: (theme) => {
    if (!THEME_VALUES.has(theme)) return;
    writeStoredTheme(theme);
    set({ theme, resolvedTheme: resolveTheme(theme) });
  },

  refreshResolvedTheme: () => {
    const { theme } = get();
    set({ resolvedTheme: resolveTheme(theme) });
  },
}));

// ---------------------------------------------------------------------------
// Named selectors — helpful for tests + reselecting stable slices.
// ---------------------------------------------------------------------------
export const uiSelectors = {
  theme: (s: UiState) => s.theme,
  resolvedTheme: (s: UiState) => s.resolvedTheme,
  sidebarOpen: (s: UiState) => s.sidebarOpen,
  sidebarCollapsed: (s: UiState) => s.sidebarCollapsed,
  activeModal: (s: UiState) => s.activeModal,
} as const;
