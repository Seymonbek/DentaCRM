import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main
          className="flex-1 p-5 sm:p-7 lg:p-8"
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
