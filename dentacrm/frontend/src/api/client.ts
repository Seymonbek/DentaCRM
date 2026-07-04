import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiErrorPayload, TokenPair } from "@/types";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api/v1";

/**
 * Lightweight token store shared between the Axios interceptor and the
 * Zustand auth store. Kept **in memory only** for the access token so a
 * malicious script cannot read it from localStorage. The auth store is the
 * single writer.
 */
type TokenListener = (access: string | null) => void;

class TokenBridge {
  private access: string | null = null;
  private refresh: string | null = null;
  private listeners = new Set<TokenListener>();

  getAccess(): string | null {
    return this.access;
  }

  getRefresh(): string | null {
    return this.refresh;
  }

  set(pair: { access: string | null; refresh: string | null }): void {
    this.access = pair.access;
    this.refresh = pair.refresh;
    this.listeners.forEach((fn) => fn(this.access));
  }

  clear(): void {
    this.set({ access: null, refresh: null });
  }

  subscribe(fn: TokenListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const tokenBridge = new TokenBridge();

/**
 * Convert an Axios error into the standard ``ApiErrorPayload`` envelope.
 *
 * The backend always emits ``{error: {code, message, details}}`` (see
 * ``apps.core.exceptions.custom_exception_handler``). For network errors
 * or non-JSON responses we synthesise an equivalent shape so callers can
 * rely on a single error type.
 */
export function normaliseApiError(err: unknown): ApiErrorPayload {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiErrorPayload | undefined>;
    const data = axiosErr.response?.data;
    if (data && typeof data === "object" && "error" in data && data.error) {
      return data as ApiErrorPayload;
    }
    return {
      error: {
        code: axiosErr.code ?? "NETWORK_ERROR",
        message: axiosErr.message || "Serverga ulanib bo'lmadi.",
        details: {},
      },
    };
  }
  return {
    error: {
      code: "UNKNOWN",
      message: err instanceof Error ? err.message : "Nomaʼlum xatolik.",
      details: {},
    },
  };
}

// ---------------------------------------------------------------------------
// Axios instance with refresh interceptor.
// ---------------------------------------------------------------------------
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenBridge.getAccess();
  if (token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ---- Refresh coordination -----------------------------------------------------
let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refresh = tokenBridge.getRefresh();
  if (!refresh) {
    throw new Error("no-refresh-token");
  }
  const { data } = await axios.post<TokenPair>(
    `${API_BASE}/auth/refresh/`,
    { refresh },
    { headers: { "Content-Type": "application/json" } },
  );
  tokenBridge.set({ access: data.access, refresh: data.refresh });
  return data.access;
}

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Do not attempt refresh on auth endpoints themselves.
    const url = original?.url ?? "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        refreshPromise ??= performRefresh();
        const newAccess = await refreshPromise;
        refreshPromise = null;
        original.headers.set("Authorization", `Bearer ${newAccess}`);
        return apiClient.request(original);
      } catch (refreshErr) {
        refreshPromise = null;
        tokenBridge.clear();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Typed helper wrapping ``apiClient.request`` — returns just ``data`` so
 * callers don't have to destructure the Axios envelope everywhere.
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
