/**
 * Reports API — mirrors ``/api/v1/reports/``.
 *
 * Endpoints return aggregate payloads pre-warmed in Redis for 5 minutes
 * (see :mod:`apps.reports.services`). The frontend layers TanStack Query
 * on top with the same TTL so the UI is warm without hammering the API.
 */
import { request } from "./client";

export type ReportPeriod = "day" | "week" | "month";

// ---- Raw shapes returned by the backend -----------------------------------

interface BackendRange {
  start: string;
  end: string;
}

interface BackendDashboardRaw {
  period: string;
  range: BackendRange;
  kpi: {
    revenue: string;
    newPatients: number;
    appointmentsTotal: number;
    lowStockCount: number;
  };
  generatedAt: string;
}

interface BackendRevenueRaw {
  period: string;
  range: BackendRange;
  total: string;
  byDay: { date: string; amount: string }[];
  byMethod: { method: string; amount: string; count: number }[];
  generatedAt: string;
}

interface BackendProceduresRaw {
  period: string;
  range: BackendRange;
  results: { procedure: string; count: number; revenue: string }[];
  generatedAt: string;
}

interface BackendDepartmentsRaw {
  period: string;
  range: BackendRange;
  results: { department: string; count: number; revenue: string }[];
  generatedAt: string;
}

// ---- Normalised shapes consumed by the UI ---------------------------------

export interface DashboardKPI {
  period: string;
  startAt: string;
  endAt: string;
  revenue: string;
  patientsToday: number;
  appointmentsToday: number;
  lowStockCount: number;
}

export interface RevenuePayload {
  period: string;
  startAt: string;
  endAt: string;
  total: string;
  byDay: { date: string; amount: string }[];
  byMethod: { method: string; amount: string; count: number }[];
}

export interface ProceduresPayload {
  period: string;
  items: { procedure: string; count: number; revenue: string }[];
}

export interface DepartmentsPayload {
  period: string;
  items: { department: string; count: number; revenue: string }[];
}

export async function getDashboardReport(period: ReportPeriod = "day"): Promise<DashboardKPI> {
  const raw = await request<BackendDashboardRaw>({
    method: "GET",
    url: "/reports/dashboard/",
    params: { period },
  });
  return {
    period: raw.period,
    startAt: raw.range?.start ?? "",
    endAt: raw.range?.end ?? "",
    revenue: raw.kpi?.revenue ?? "0",
    patientsToday: raw.kpi?.newPatients ?? 0,
    appointmentsToday: raw.kpi?.appointmentsTotal ?? 0,
    lowStockCount: raw.kpi?.lowStockCount ?? 0,
  };
}

export async function getRevenueReport(period: ReportPeriod = "week"): Promise<RevenuePayload> {
  const raw = await request<BackendRevenueRaw>({
    method: "GET",
    url: "/reports/revenue/",
    params: { period },
  });
  return {
    period: raw.period,
    startAt: raw.range?.start ?? "",
    endAt: raw.range?.end ?? "",
    total: raw.total ?? "0",
    byDay: raw.byDay ?? [],
    byMethod: raw.byMethod ?? [],
  };
}

export async function getProceduresReport(period: ReportPeriod = "week"): Promise<ProceduresPayload> {
  const raw = await request<BackendProceduresRaw>({
    method: "GET",
    url: "/reports/procedures/",
    params: { period },
  });
  return {
    period: raw.period,
    items: raw.results ?? [],
  };
}

export async function getDepartmentsReport(period: ReportPeriod = "week"): Promise<DepartmentsPayload> {
  const raw = await request<BackendDepartmentsRaw>({
    method: "GET",
    url: "/reports/departments/",
    params: { period },
  });
  return {
    period: raw.period,
    items: raw.results ?? [],
  };
}
