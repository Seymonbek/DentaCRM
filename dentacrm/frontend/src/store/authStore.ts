import { create } from "zustand";

import { fetchMe, login as apiLogin, refreshTokens } from "@/api/auth";
import { normaliseApiError, tokenBridge } from "@/api/client";
import type { User } from "@/types";

/**
 * Optional persistence of the refresh token in localStorage. Enabled by
 * ``VITE_REFRESH_STORAGE=local`` for dev convenience; the default of
 * "memory" keeps the token only in RAM.
 *
 * The access token is **never** persisted — it lives only in
 * :mod:`api/client.ts`'s in-memory ``tokenBridge``.
 */
const REFRESH_STORAGE_KEY = "dentacrm.refresh";
const REFRESH_MODE = (import.meta.env.VITE_REFRESH_STORAGE as string | undefined) ?? "memory";

function readPersistedRefresh(): string | null {
  if (REFRESH_MODE !== "local") return null;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(REFRESH_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePersistedRefresh(value: string | null): void {
  if (REFRESH_MODE !== "local") return;
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(REFRESH_STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(REFRESH_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;

  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  error: null,

  async login(phoneNumber, password) {
    set({ status: "loading", error: null });
    try {
      const pair = await apiLogin({ phoneNumber, password });
      tokenBridge.set({ access: pair.access, refresh: pair.refresh });
      writePersistedRefresh(pair.refresh);
      set({ user: pair.user, status: "authenticated", error: null });
    } catch (err) {
      const envelope = normaliseApiError(err);
      set({
        user: null,
        status: "unauthenticated",
        error: envelope.error.message,
      });
      tokenBridge.clear();
      writePersistedRefresh(null);
      throw err;
    }
  },

  logout() {
    tokenBridge.clear();
    writePersistedRefresh(null);
    set({ user: null, status: "unauthenticated", error: null });
  },

  async hydrate() {
    if (get().status === "loading" || get().status === "authenticated") return;
    const persisted = readPersistedRefresh();
    if (!persisted) {
      set({ status: "unauthenticated" });
      return;
    }
    set({ status: "loading" });
    try {
      const pair = await refreshTokens(persisted);
      tokenBridge.set({ access: pair.access, refresh: pair.refresh });
      writePersistedRefresh(pair.refresh);
      // /auth/me/ is authoritative for the user profile.
      const me = await fetchMe();
      set({ user: me, status: "authenticated", error: null });
    } catch {
      tokenBridge.clear();
      writePersistedRefresh(null);
      set({ user: null, status: "unauthenticated", error: null });
    }
  },

  setUser(user) {
    set({ user, status: user ? "authenticated" : "unauthenticated" });
  },
}));
