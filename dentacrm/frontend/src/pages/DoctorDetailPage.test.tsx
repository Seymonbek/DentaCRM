import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { DoctorDetailPage } from "@/pages/DoctorDetailPage";
import * as doctorsApi from "@/api/doctors";
import * as paymentsApi from "@/api/payments";

const DOCTOR_ID = "22222222-2222-2222-2222-222222222222";

function renderDetail(): void {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/doctors/${DOCTOR_ID}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function mockAll(): void {
  vi.spyOn(doctorsApi, "getDoctor").mockResolvedValue({
    id: DOCTOR_ID,
    user: {
      id: "u-1",
      firstName: "Aziz",
      lastName: "Karimov",
      phoneNumber: "+998901234567",
      role: "doctor",
    },
    departments: [{ id: "d-1", name: "Terapiya" }],
    specialization: "Terapevt",
    bio: "",
    commissionBasis: "from_total",
    defaultCommissionRate: "30",
    canViewOtherDoctors: false,
    isActive: true,
    workingHours: [],
    createdAt: null,
    updatedAt: null,
  });
  vi.spyOn(doctorsApi, "listWorkingHours").mockResolvedValue([
    {
      id: "wh-1",
      doctorId: DOCTOR_ID,
      weekday: 0,
      weekdayLabel: "Mon",
      startTime: "09:00:00",
      endTime: "18:00:00",
    },
  ]);
  vi.spyOn(doctorsApi, "listTimeOff").mockResolvedValue([]);
  vi.spyOn(doctorsApi, "getAvailableSlots").mockResolvedValue({
    doctorId: DOCTOR_ID,
    date: "2026-07-04",
    slots: [
      { start: "09:00", end: "09:30" },
      { start: "09:30", end: "10:00" },
    ],
  });
  vi.spyOn(paymentsApi, "getDoctorCommissionsSummary").mockResolvedValue({
    doctorId: DOCTOR_ID,
    count: 4,
    totalAmount: "480000.00",
    dateFrom: null,
    dateTo: null,
  });
}

describe("<DoctorDetailPage />", () => {
  it("renders doctor profile, working hours and slots", async () => {
    mockAll();

    renderDetail();

    // Doctor name and specialization
    await waitFor(() =>
      expect(screen.getByText(/Aziz Karimov/i)).toBeInTheDocument(),
    );
    expect(screen.getByText("Terapevt")).toBeInTheDocument();

    // Working hours entry (Monday 09:00 – 18:00)
    await waitFor(() =>
      expect(screen.getByText(/09:00 – 18:00/)).toBeInTheDocument(),
    );

    // Commission summary
    await waitFor(() =>
      expect(screen.getByText(/480\s?000 so'm/)).toBeInTheDocument(),
    );

    // Available slots preview
    await waitFor(() =>
      expect(screen.getByText(/09:00 – 09:30/)).toBeInTheDocument(),
    );
  });
});
