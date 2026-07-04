import { useEffect } from "react";
import { AppRouter } from "./app/router";
import { ThemeProvider } from "./app/ThemeProvider";
import { ToastViewport } from "./components/ui/Toast";
import { useAuthStore } from "./store/authStore";

/**
 * Top-level app component.
 *
 * Responsibilities:
 *  - Wrap the tree in :class:`ThemeProvider` so the user's theme
 *    preference (light / dark / system) is applied to ``<html>``.
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
      <AppRouter />
      <ToastViewport />
    </ThemeProvider>
  );
}
