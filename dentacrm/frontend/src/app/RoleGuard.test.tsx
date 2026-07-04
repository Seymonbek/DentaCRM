import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { RoleGuard, homeForRole } from "@/app/RoleGuard";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";

const doctor: User = {
  id: "1",
  firstName: "A",
  lastName: "B",
  phoneNumber: "+998900000001",
  role: "doctor",
};

const boss: User = {
  id: "2",
  firstName: "C",
  lastName: "D",
  phoneNumber: "+998900000002",
  role: "bosh_shifokor",
};

function renderWithRoute(initial: string, allow: User["role"][]): void {
  render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <RoleGuard allow={allow}>
              <div>PROTECTED_CONTENT</div>
            </RoleGuard>
          }
        />
        <Route path="/login" element={<div>LOGIN_PAGE</div>} />
        <Route path="/dashboard" element={<div>DASHBOARD</div>} />
        <Route path="/my-appointments" element={<div>MY_APPOINTMENTS</div>} />
        <Route path="/schedule" element={<div>SCHEDULE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("<RoleGuard />", () => {
  it("redirects unauthenticated users to /login", () => {
    useAuthStore.setState({ user: null, status: "unauthenticated" });
    renderWithRoute("/protected", ["bosh_shifokor"]);
    expect(screen.getByText("LOGIN_PAGE")).toBeInTheDocument();
  });

  it("renders children when the user role is allowed", () => {
    useAuthStore.setState({ user: boss, status: "authenticated" });
    renderWithRoute("/protected", ["bosh_shifokor"]);
    expect(screen.getByText("PROTECTED_CONTENT")).toBeInTheDocument();
  });

  it("redirects to the role-specific home when access is denied", () => {
    useAuthStore.setState({ user: doctor, status: "authenticated" });
    renderWithRoute("/protected", ["bosh_shifokor"]);
    expect(screen.getByText("MY_APPOINTMENTS")).toBeInTheDocument();
  });

  it("shows a hydration placeholder while auth state is loading", () => {
    useAuthStore.setState({ user: null, status: "loading" });
    renderWithRoute("/protected", ["bosh_shifokor"]);
    expect(screen.getByText(/yuklanmoqda/i)).toBeInTheDocument();
  });
});

describe("homeForRole", () => {
  it("maps each role to its dashboard route", () => {
    expect(homeForRole("bosh_shifokor")).toBe("/dashboard");
    expect(homeForRole("doctor")).toBe("/my-appointments");
    expect(homeForRole("administrator")).toBe("/schedule");
  });
});
