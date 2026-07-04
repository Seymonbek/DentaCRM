import { QueryClient } from "@tanstack/react-query";

/**
 * Shared TanStack Query client. Kept minimal — feature-specific query
 * keys and stale-time overrides live next to the hooks that use them.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Do not retry auth failures — the axios interceptor already tried
        // refresh once, so a persisting 401 means the session is dead.
        const status = (error as { response?: { status?: number } } | null)?.response
          ?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
