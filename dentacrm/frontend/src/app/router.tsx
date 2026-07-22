import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { homeForRole, RoleGuard } from "@/app/RoleGuard";
import { RouteSuspense } from "@/app/RouteSuspense";
import { useAuthStore } from "@/store/authStore";

// Login + 404 stay eager: they are tiny and the login page is the
// entry point for every unauthenticated visitor, so lazy-loading them
// would trade a real network round-trip for zero savings.
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/**
 * Lazy-loaded page components (T120 — code-splitting).
 *
 * Each ``React.lazy(() => import(...))`` becomes its own Vite chunk at
 * build time, so a user who only visits ``/my-appointments`` never
 * downloads the JS for ``FinancePage`` or ``ReportsPage``. This is
 * measurable — the initial bundle before this change contained every
 * page's imports (Recharts, react-hook-form, zod, factory forms) which
 * doubled first-load payload for the ~90% of authenticated users who
 * only ever visit their role's primary page.
 *
 * The lazy chunks are wrapped in :component:`RouteSuspense` (skeleton
 * fallback) and the whole ``<Routes>`` tree is wrapped in an
 * :class:`ErrorBoundary` at the ``App`` level so a chunk-load failure
 * (network hiccup, mid-deploy stale HTML) surfaces a themed retry UI
 * rather than blanking the SPA.
 */
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const DepartmentsPage = lazy(() =>
  import("@/pages/DepartmentsPage").then((m) => ({ default: m.DepartmentsPage })),
);
const DoctorsPage = lazy(() =>
  import("@/pages/DoctorsPage").then((m) => ({ default: m.DoctorsPage })),
);
const DoctorDetailPage = lazy(() =>
  import("@/pages/DoctorDetailPage").then((m) => ({ default: m.DoctorDetailPage })),
);
const FinancePage = lazy(() =>
  import("@/pages/FinancePage").then((m) => ({ default: m.FinancePage })),
);
const InventoryPage = lazy(() =>
  import("@/pages/InventoryPage").then((m) => ({ default: m.InventoryPage })),
);
const RatingsPage = lazy(() =>
  import("@/pages/RatingsPage").then((m) => ({ default: m.RatingsPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const MyAppointmentsPage = lazy(() =>
  import("@/pages/MyAppointmentsPage").then((m) => ({
    default: m.MyAppointmentsPage,
  })),
);
const MyPatientsPage = lazy(() =>
  import("@/pages/MyPatientsPage").then((m) => ({ default: m.MyPatientsPage })),
);
const PatientDetailPage = lazy(() =>
  import("@/pages/PatientDetailPage").then((m) => ({
    default: m.PatientDetailPage,
  })),
);
const SchedulePage = lazy(() =>
  import("@/pages/SchedulePage").then((m) => ({ default: m.SchedulePage })),
);
const NewPatientPage = lazy(() =>
  import("@/pages/NewPatientPage").then((m) => ({ default: m.NewPatientPage })),
);
const NewAppointmentPage = lazy(() =>
  import("@/pages/NewAppointmentPage").then((m) => ({
    default: m.NewAppointmentPage,
  })),
);
const NewPaymentPage = lazy(() =>
  import("@/pages/NewPaymentPage").then((m) => ({ default: m.NewPaymentPage })),
);
const ReportsPage = lazy(() =>
  import("@/pages/ReportsPage").then((m) => ({ default: m.ReportsPage })),
);

/**
 * Central route table.
 *
 * Routes are grouped by role via ``<RoleGuard>``. Public routes (only
 * ``/login`` today) sit outside the guard.
 *
 * When a bare ``/`` is hit we redirect to the role-specific home. Any
 * unknown path falls through to :component:`NotFoundPage`.
 */
export function AppRouter(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const rootRedirect = user ? homeForRole(user.role) : "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={rootRedirect} replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* bosh_shifokor */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route
          path="/departments"
          element={
            <RouteSuspense>
              <DepartmentsPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/doctors"
          element={
            <RouteSuspense>
              <DoctorsPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/doctors/:id"
          element={
            <RouteSuspense>
              <DoctorDetailPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/finance"
          element={
            <RouteSuspense>
              <FinancePage />
            </RouteSuspense>
          }
        />
        <Route
          path="/reports"
          element={
            <RouteSuspense>
              <ReportsPage />
            </RouteSuspense>
          }
        />
      </Route>

      {/* bosh_shifokor + doctor + administrator */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor", "doctor", "administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route
          path="/inventory"
          element={
            <RouteSuspense>
              <InventoryPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/ratings"
          element={
            <RouteSuspense>
              <RatingsPage />
            </RouteSuspense>
          }
        />
      </Route>

      {/* doctor */}
      <Route
        element={
          <RoleGuard allow={["doctor"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route
          path="/my-appointments"
          element={
            <RouteSuspense>
              <MyAppointmentsPage />
            </RouteSuspense>
          }
        />
      </Route>

      {/* bosh_shifokor + doctor + administrator (patient views & payments) */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor", "doctor", "administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route
          path="/my-patients"
          element={
            <RouteSuspense>
              <MyPatientsPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <RouteSuspense>
              <PatientDetailPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/payments/new"
          element={
            <RouteSuspense>
              <NewPaymentPage />
            </RouteSuspense>
          }
        />
      </Route>

      {/* bosh_shifokor + administrator (scheduling & patient registration) */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor", "administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route
          path="/schedule"
          element={
            <RouteSuspense>
              <SchedulePage />
            </RouteSuspense>
          }
        />
        <Route
          path="/patients/new"
          element={
            <RouteSuspense>
              <NewPatientPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/appointments/new"
          element={
            <RouteSuspense>
              <NewAppointmentPage />
            </RouteSuspense>
          }
        />
      </Route>

      {/* Everyone (dashboard & settings) */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor", "doctor", "administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RouteSuspense>
              <DashboardPage />
            </RouteSuspense>
          }
        />
        <Route
          path="/settings"
          element={
            <RouteSuspense>
              <SettingsPage />
            </RouteSuspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
