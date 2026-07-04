import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ReportsPage } from "@/pages/ReportsPage";
import * as reportsApi from "@/api/reports";

function renderReports(): void {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/reports"]}>
        <Routes>
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("<ReportsPage />", () => {
  it("renders KPI cards and charts once data loads", async () => {
    vi.spyOn(reportsApi, "getDashboardReport").mockResolvedValue({
      period: "week",
      startAt: "2026-06-27T00:00:00Z",
      endAt: "2026-07-04T00:00:00Z",
      revenue: "1250000.00",
      patientsToday: 12,
      appointmentsToday: 18,
      lowStockCount: 3,
    });
    vi.spyOn(reportsApi, "getRevenueReport").mockResolvedValue({
      period: "week",
      startAt: "2026-06-27T00:00:00Z",
      endAt: "2026-07-04T00:00:00Z",
      total: "1250000.00",
      byDay: [
        { date: "2026-06-30", amount: "250000.00" },
        { date: "2026-07-01", amount: "500000.00" },
      ],
      byMethod: [
        { method: "cash", amount: "800000.00", count: 5 },
        { method: "card", amount: "450000.00", count: 3 },
      ],
    });
    vi.spyOn(reportsApi, "getProceduresReport").mockResolvedValue({
      period: "week",
      items: [
        { procedure: "cleaning", count: 4, revenue: "400000.00" },
      ],
    });
    vi.spyOn(reportsApi, "getDepartmentsReport").mockResolvedValue({
      period: "week",
      items: [
        { department: "Terapiya", count: 6, revenue: "800000.00" },
      ],
    });

    renderReports();

    // Header
    expect(
      screen.getByRole("heading", { name: /hisobotlar/i }),
    ).toBeInTheDocument();

    // KPI values arrive after fetch resolves
    await waitFor(() =>
      expect(screen.getByText(/1\s?250\s?000 so'm/)).toBeInTheDocument(),
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // Period switcher present
    expect(screen.getByRole("tab", { name: /hafta/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    // Table row from procedures
    expect(screen.getByText("cleaning")).toBeInTheDocument();
    expect(screen.getByText("Terapiya")).toBeInTheDocument();
  });

  it("shows an empty state when no data is returned", async () => {
    vi.spyOn(reportsApi, "getDashboardReport").mockResolvedValue({
      period: "day",
      startAt: "2026-07-04T00:00:00Z",
      endAt: "2026-07-04T23:59:59Z",
      revenue: "0.00",
      patientsToday: 0,
      appointmentsToday: 0,
      lowStockCount: 0,
    });
    vi.spyOn(reportsApi, "getRevenueReport").mockResolvedValue({
      period: "day",
      startAt: "2026-07-04T00:00:00Z",
      endAt: "2026-07-04T23:59:59Z",
      total: "0.00",
      byDay: [],
      byMethod: [],
    });
    vi.spyOn(reportsApi, "getProceduresReport").mockResolvedValue({
      period: "day",
      items: [],
    });
    vi.spyOn(reportsApi, "getDepartmentsReport").mockResolvedValue({
      period: "day",
      items: [],
    });

    renderReports();

    await waitFor(() =>
      expect(
        screen.getAllByText(/ma'lumot yo'q/i).length,
      ).toBeGreaterThanOrEqual(2),
    );
  });
});
