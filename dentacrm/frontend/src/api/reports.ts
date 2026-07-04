/**
 * Reports API — mirrors ``/api/v1/reports/``.
 *
 * Endpoints return aggregate payloads pre-warmed in Redis for 5 minutes
 * (see :mod:`apps.reports.services`). The frontend layers TanStack Query
 * on top with the same TTL so the UI is warm without hammering the API.
 */
import { request } from "./client";

export type ReportPeriod = "day" | "week" | "month";

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

export function getDashboardReport(period: ReportPeriod = "day"): Promise<DashboardKPI> {
  return request<DashboardKPI>({
    method: "GET",
    url: "/reports/dashboard/",
    params: { period },
  });
}

export function getRevenueReport(
  period: ReportPeriod = "week",
): Promise<RevenuePayload> {
  return request<RevenuePayload>({
    method: "GET",
    url: "/reports/revenue/",
    params: { period },
  });
}

export function getProceduresReport(
  period: ReportPeriod = "week",
): Promise<ProceduresPayload> {
  return request<ProceduresPayload>({
    method: "GET",
    url: "/reports/procedures/",
    params: { period },
  });
}

export function getDepartmentsReport(
  period: ReportPeriod = "week",
): Promise<DepartmentsPayload> {
  return request<DepartmentsPayload>({
    method: "GET",
    url: "/reports/departments/",
    params: { period },
  });
}
