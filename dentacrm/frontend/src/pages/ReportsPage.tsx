import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  CalendarDays,
  CreditCard,
  Landmark,
  ListChecks,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  getDashboardReport,
  getDepartmentsReport,
  getProceduresReport,
  getRevenueReport,
  type ReportPeriod,
} from "@/api/reports";
import { PAYMENT_METHOD_LABELS } from "@/api/payments";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const REPORT_TTL = 5 * 60 * 1000;

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

const PERIOD_OPTIONS: readonly { value: ReportPeriod; label: string }[] = [
  { value: "day", label: "Bugun" },
  { value: "week", label: "Hafta" },
  { value: "month", label: "Oy" },
];

interface ReportsPageState {
  period: ReportPeriod;
}

function formatCurrency(value: string | number | undefined): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("uz-UZ") + " so'm";
}

export function ReportsPage(): JSX.Element {
  const [period, setPeriod] = useState<ReportsPageState["period"]>("week");

  const dashboardQ = useQuery({
    queryKey: ["reports", "dashboard", period],
    queryFn: () => getDashboardReport(period),
    staleTime: REPORT_TTL,
  });
  const revenueQ = useQuery({
    queryKey: ["reports", "revenue", period],
    queryFn: () => getRevenueReport(period),
    staleTime: REPORT_TTL,
  });
  const proceduresQ = useQuery({
    queryKey: ["reports", "procedures", period],
    queryFn: () => getProceduresReport(period),
    staleTime: REPORT_TTL,
  });
  const departmentsQ = useQuery({
    queryKey: ["reports", "departments", period],
    queryFn: () => getDepartmentsReport(period),
    staleTime: REPORT_TTL,
  });

  const revenueSeries = useMemo(
    () =>
      revenueQ.data?.byDay.map((row) => ({
        date: row.date,
        amount: Number(row.amount),
      })) ?? [],
    [revenueQ.data],
  );
  const methodSeries = useMemo(
    () =>
      revenueQ.data?.byMethod.map((row) => ({
        method: PAYMENT_METHOD_LABELS[row.method as PaymentMethod] ?? row.method,
        amount: Number(row.amount),
        count: row.count,
      })) ?? [],
    [revenueQ.data],
  );
  const procedureRows = proceduresQ.data?.items ?? [];
  const departmentRows = departmentsQ.data?.items ?? [];

  return (
    <section aria-labelledby="reports-title" className="space-y-6">
      <PageHeader
        title="Hisobotlar"
        description="Daromad dinamikasi, muolajalar va bo'limlar kesimidagi statistika."
        actions={<PeriodSwitcher value={period} onChange={setPeriod} />}
      />

      {/* --- KPI grid ---------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Umumiy daromad"
          icon={Wallet}
          tone="primary"
          value={formatCurrency(dashboardQ.data?.revenue)}
          loading={dashboardQ.isLoading}
          hint={
            dashboardQ.data
              ? `${dashboardQ.data.startAt.slice(0, 10)} → ${dashboardQ.data.endAt.slice(0, 10)}`
              : undefined
          }
        />
        <KpiCard
          label="Bugungi bemorlar"
          icon={Users}
          tone="success"
          value={dashboardQ.data?.patientsToday ?? "—"}
          loading={dashboardQ.isLoading}
          hint="Kunlik unikal bemorlar"
        />
        <KpiCard
          label="Bugungi navbatlar"
          icon={CalendarDays}
          tone="warning"
          value={dashboardQ.data?.appointmentsToday ?? "—"}
          loading={dashboardQ.isLoading}
        />
        <KpiCard
          label="Kam zaxira"
          icon={ListChecks}
          tone="danger"
          value={dashboardQ.data?.lowStockCount ?? "—"}
          loading={dashboardQ.isLoading}
          hint="Minimum chegarasidan past"
        />
      </div>

      {/* --- Charts row -------------------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Daromad dinamikasi"
          description="Kunlar bo'yicha yig'indi"
          icon={TrendingUp}
        >
          {revenueQ.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : revenueSeries.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="To'lov usullari"
          description="Umumiy daromad usullar kesimida"
          icon={CreditCard}
        >
          {revenueQ.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : methodSeries.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={methodSeries}
                  dataKey="amount"
                  nameKey="method"
                  outerRadius={100}
                  label={(entry: { method: string }) => entry.method}
                >
                  {methodSeries.map((_row, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* --- Procedures + Departments ----------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Muolajalar"
          description="Eng ko'p bajarilgan muolajalar"
          icon={Landmark}
        >
          {proceduresQ.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : procedureRows.length === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={procedureRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="procedure" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <table className="mt-3 w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-1">Muolaja</th>
                    <th className="py-1 text-right">Soni</th>
                    <th className="py-1 text-right">Daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {procedureRows.map((row) => (
                    <tr
                      key={row.procedure}
                      className="border-b border-slate-100 last:border-none"
                    >
                      <td className="py-1 text-slate-700">{row.procedure}</td>
                      <td className="py-1 text-right text-slate-700">
                        {row.count.toLocaleString("uz-UZ")}
                      </td>
                      <td className="py-1 text-right font-medium text-slate-900">
                        {formatCurrency(row.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </ChartCard>

        <ChartCard
          title="Bo'limlar bo'yicha"
          description="Bo'lim kesimida daromad"
          icon={Building2}
        >
          {departmentsQ.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : departmentRows.length === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={departmentRows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <table className="mt-3 w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-1">Bo'lim</th>
                    <th className="py-1 text-right">Muolajalar</th>
                    <th className="py-1 text-right">Daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentRows.map((row) => (
                    <tr
                      key={row.department}
                      className="border-b border-slate-100 last:border-none"
                    >
                      <td className="py-1 text-slate-700">{row.department}</td>
                      <td className="py-1 text-right text-slate-700">
                        {row.count.toLocaleString("uz-UZ")}
                      </td>
                      <td className="py-1 text-right font-medium text-slate-900">
                        {formatCurrency(row.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </ChartCard>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function PeriodSwitcher({
  value,
  onChange,
}: {
  value: ReportPeriod;
  onChange: (v: ReportPeriod) => void;
}): JSX.Element {
  return (
    <div
      role="tablist"
      aria-label="Davr tanlash"
      className="inline-flex overflow-hidden rounded-md border border-slate-300 bg-white text-sm"
    >
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 font-medium transition-colors",
            value === opt.value
              ? "bg-brand-600 text-white"
              : "text-slate-600 hover:bg-slate-50",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number | undefined | null;
  hint?: string;
  icon: LucideIcon;
  tone: "primary" | "success" | "warning" | "danger";
  loading?: boolean;
}

const TONE_STYLES: Record<
  KpiCardProps["tone"],
  { badge: string; icon: string }
> = {
  primary: {
    badge: "bg-brand-50 text-brand-700",
    icon: "text-brand-600",
  },
  success: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "text-emerald-600",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700",
    icon: "text-amber-600",
  },
  danger: {
    badge: "bg-rose-50 text-rose-700",
    icon: "text-rose-600",
  },
};

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  loading,
}: KpiCardProps): JSX.Element {
  const styles = TONE_STYLES[tone];
  return (
    <article
      className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      aria-busy={loading || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg",
            styles.badge,
          )}
        >
          <Icon className={cn("h-5 w-5", styles.icon)} aria-hidden="true" />
        </span>
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {value ?? "—"}
          </p>
        )}
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </article>
  );
}

function ChartCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex items-start gap-3">
        {Icon ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
      </header>
      {children}
    </article>
  );
}

function EmptyChart(): JSX.Element {
  return (
    <EmptyState
      title="Ma'lumot yo'q"
      description="Ushbu davr uchun statistika hali yig'ilmagan."
    />
  );
}
