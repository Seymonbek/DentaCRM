import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children?: ReactNode;
}

/**
 * Authenticated layout: sticky sidebar on desktop, top header with the
 * current user + logout, and a scrollable main region. Renders either
 * the routed ``<Outlet />`` or explicit children (used in tests).
 */
export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
