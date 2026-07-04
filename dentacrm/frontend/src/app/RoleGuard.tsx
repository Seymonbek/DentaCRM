import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  allow: UserRole[];
  children: ReactNode;
}

/**
 * Client-side authorization guard.
 *
 * - While auth state is hydrating we render a neutral placeholder so the
 *   user does not see a flash of the login page on refresh.
 * - Unauthenticated users get sent to /login with a ``from`` query so we
 *   can bounce them back post-login.
 * - Authenticated users whose role is not in ``allow`` get redirected to
 *   the appropriate home page for their role.
 */
export function RoleGuard({ allow, children }: RoleGuardProps): JSX.Element {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-slate-500"
        role="status"
        aria-live="polite"
      >
        Yuklanmoqda…
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }

  return <>{children}</>;
}

export function homeForRole(role: UserRole): string {
  switch (role) {
    case "bosh_shifokor":
      return "/dashboard";
    case "doctor":
      return "/my-appointments";
    case "administrator":
      return "/schedule";
    default:
      return "/login";
  }
}
