import { useEffect } from "react";
import { AppRouter } from "./app/router";
import { ThemeProvider } from "./app/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastViewport } from "./components/ui/Toast";
import { useAuthStore } from "./store/authStore";

/**
 * Top-level app component.
 *
 * Responsibilities:
 *  - Wrap the tree in :class:`ThemeProvider` so the user's theme
 *    preference (light / dark / system) is applied to ``<html>``.
 *  - Wrap the router in a top-level :class:`ErrorBoundary` (T120) so a
 *    render-time crash or a lazy-chunk load failure surfaces a themed
 *    retry UI instead of a blank screen. Sub-trees can still install
 *    their own boundaries if they want a compact inline fallback.
 *  - Kick off an initial auth hydration attempt (via refresh cookie /
 *    stored token) so a returning visitor lands on their intended page
 *    without a flash of the login screen.
 *  - Mount the toast viewport once at the root.
 */
export default function App(): JSX.Element {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
      <ToastViewport />
    </ThemeProvider>
  );
}
