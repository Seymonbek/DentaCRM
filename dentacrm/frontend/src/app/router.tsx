import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { homeForRole, RoleGuard } from "@/app/RoleGuard";
import { useAuthStore } from "@/store/authStore";

import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DepartmentsPage } from "@/pages/DepartmentsPage";
import { DoctorsPage } from "@/pages/DoctorsPage";
import { DoctorDetailPage } from "@/pages/DoctorDetailPage";
import { FinancePage } from "@/pages/FinancePage";
import { InventoryPage } from "@/pages/InventoryPage";
import { RatingsPage } from "@/pages/RatingsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { MyAppointmentsPage } from "@/pages/MyAppointmentsPage";
import { MyPatientsPage } from "@/pages/MyPatientsPage";
import { PatientDetailPage } from "@/pages/PatientDetailPage";
import { SchedulePage } from "@/pages/SchedulePage";
import { NewPatientPage } from "@/pages/NewPatientPage";
import { NewAppointmentPage } from "@/pages/NewAppointmentPage";
import { NewPaymentPage } from "@/pages/NewPaymentPage";
import { ReportsPage } from "@/pages/ReportsPage";

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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorDetailPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* bosh_shifokor + doctor */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor", "doctor"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/ratings" element={<RatingsPage />} />
      </Route>

      {/* doctor */}
      <Route
        element={
          <RoleGuard allow={["doctor"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
      </Route>

      {/* doctor + administrator (patient views) */}
      <Route
        element={
          <RoleGuard allow={["doctor", "administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route path="/my-patients" element={<MyPatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
      </Route>

      {/* administrator */}
      <Route
        element={
          <RoleGuard allow={["administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/patients/new" element={<NewPatientPage />} />
        <Route path="/appointments/new" element={<NewAppointmentPage />} />
        <Route path="/payments/new" element={<NewPaymentPage />} />
      </Route>

      {/* Everyone (settings) */}
      <Route
        element={
          <RoleGuard allow={["bosh_shifokor", "doctor", "administrator"]}>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
