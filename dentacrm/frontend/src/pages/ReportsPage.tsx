import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Building2, CalendarDays, CreditCard, Landmark,
  ListChecks, TrendingUp, Users, Wallet, type LucideIcon,
} from "lucide-react";

import {
  getDashboardReport, getDepartmentsReport, getProceduresReport,
  getRevenueReport, type ReportPeriod,
} from "@/api/reports";
import { PAYMENT_METHOD_LABELS } from "@/api/payments";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const REPORT_TTL = 5 * 60 * 1000;

const CHART_COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

const PERIOD_OPTIONS: readonly { value: ReportPeriod; label: string }[] = [
  { value: "day",   label: "Bugun" },
  { value: "week",  label: "Hafta" },
  { value: "month", label: "Oy"    },
];

function formatCurrency(value: string | number | undefined): string {
  if (value === undefined || value === null) return "—";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("uz-UZ") + " so'm";
}

// ── Period Switcher ──────────────────────────────────────────────────────────
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
      className="inline-flex rounded-lg border border-border bg-surface-2 p-1 gap-0.5"
    >
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 select-none",
            value === opt.value
              ? "bg-surface text-fg shadow-xs border border-border"
              : "text-fg-3 hover:text-fg",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number | undefined | null;
  hint?: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "amber" | "rose";
  loading?: boolean;
}

const TONE = {
  blue:  { bg: "bg-brand-600/10 dark:bg-brand-600/20",  text: "text-brand-600 dark:text-brand-400"  },
  green: { bg: "bg-success/10 dark:bg-success/20",       text: "text-success"                        },
  amber: { bg: "bg-warning/10 dark:bg-warning/20",       text: "text-warning"                        },
  rose:  { bg: "bg-danger/10  dark:bg-danger/20",        text: "text-danger"                         },
};

function KpiCard({ label, value, hint, icon: Icon, tone, loading }: KpiCardProps): JSX.Element {
  const s = TONE[tone];
  return (
    <article className="card flex flex-col gap-4 p-5" aria-busy={loading || undefined}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-fg-3">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", s.bg)}>
          <Icon className={cn("h-4 w-4", s.text)} aria-hidden="true" />
        </span>
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-bold tracking-tight text-fg">{value ?? "—"}</p>
        )}
        {hint ? <p className="mt-1.5 text-xs text-fg-3">{hint}</p> : null}
      </div>
    </article>
  );
}

// ── Chart Card ───────────────────────────────────────────────────────────────
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
    <article className="card p-5">
      <header className="mb-5 flex items-center gap-3">
        {Icon ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-fg-3">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <h3 className="text-[14px] font-semibold text-fg leading-none">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs text-fg-3">{description}</p>
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

// ── Page ─────────────────────────────────────────────────────────────────────
export function ReportsPage(): JSX.Element {
  const [period, setPeriod] = useState<ReportPeriod>("week");

  const dashboardQ  = useQuery({ queryKey: ["reports", "dashboard",  period], queryFn: () => getDashboardReport(period),  staleTime: REPORT_TTL });
  const revenueQ    = useQuery({ queryKey: ["reports", "revenue",    period], queryFn: () => getRevenueReport(period),    staleTime: REPORT_TTL });
  const proceduresQ = useQuery({ queryKey: ["reports", "procedures", period], queryFn: () => getProceduresReport(period), staleTime: REPORT_TTL });
  const departmentsQ= useQuery({ queryKey: ["reports", "departments",period], queryFn: () => getDepartmentsReport(period),staleTime: REPORT_TTL });

  const revenueSeries = useMemo(
    () => revenueQ.data?.byDay.map((r) => ({ date: r.date, amount: Number(r.amount) })) ?? [],
    [revenueQ.data],
  );
  const methodSeries = useMemo(
    () =>
      revenueQ.data?.byMethod.map((r) => ({
        method: PAYMENT_METHOD_LABELS[r.method as PaymentMethod] ?? r.method,
        amount: Number(r.amount),
        count:  r.count,
      })) ?? [],
    [revenueQ.data],
  );
  const procedureRows  = proceduresQ.data?.items  ?? [];
  const departmentRows = departmentsQ.data?.items ?? [];

  const dateHint =
    dashboardQ.data?.startAt && dashboardQ.data?.endAt
      ? `${dashboardQ.data.startAt.slice(0, 10)} → ${dashboardQ.data.endAt.slice(0, 10)}`
      : undefined;

  return (
    <section aria-labelledby="reports-title" className="space-y-6 max-w-6xl">
      <PageHeader
        title="Hisobotlar"
        description="Daromad dinamikasi, muolajalar va bo'limlar kesimidagi statistika."
        actions={<PeriodSwitcher value={period} onChange={setPeriod} />}
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Umumiy daromad"    icon={Wallet}       tone="blue"  value={formatCurrency(dashboardQ.data?.revenue)}            loading={dashboardQ.isLoading}  hint={dateHint} />
        <KpiCard label="Bugungi bemorlar"  icon={Users}        tone="green" value={dashboardQ.data?.patientsToday ?? "—"}               loading={dashboardQ.isLoading}  hint="Kunlik unikal bemorlar" />
        <KpiCard label="Bugungi navbatlar" icon={CalendarDays} tone="amber" value={dashboardQ.data?.appointmentsToday ?? "—"}           loading={dashboardQ.isLoading} />
        <KpiCard label="Kam zaxira"        icon={ListChecks}   tone="rose"  value={dashboardQ.data?.lowStockCount ?? "—"}               loading={dashboardQ.isLoading}  hint="Min. chegaradan past" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Daromad dinamikasi" description="Kunlar bo'yicha yig'indi" icon={TrendingUp}>
          {revenueQ.isLoading ? <Skeleton className="h-64 w-full" /> : revenueSeries.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueSeries} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(215 16% 57%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215 16% 57%)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v), "Daromad"]}
                />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="To'lov usullari" description="Umumiy daromad usullar kesimida" icon={CreditCard}>
          {revenueQ.isLoading ? <Skeleton className="h-64 w-full" /> : methodSeries.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={methodSeries} dataKey="amount" nameKey="method" outerRadius={90} innerRadius={40}
                  paddingAngle={3} label={({ method }: { method: string }) => method} labelLine={false}>
                  {methodSeries.map((_row, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number) => [formatCurrency(v)]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Procedures + Departments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Muolajalar" description="Eng ko'p bajarilganlar" icon={Landmark}>
          {proceduresQ.isLoading ? <Skeleton className="h-64 w-full" /> : procedureRows.length === 0 ? <EmptyChart /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={procedureRows} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                  <XAxis dataKey="procedure" stroke="hsl(215 16% 57%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 16% 57%)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <table className="mt-4 w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 text-[11px] font-semibold uppercase tracking-wider text-fg-3">Muolaja</th>
                    <th className="py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-fg-3">Soni</th>
                    <th className="py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-fg-3">Daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {procedureRows.map((row) => (
                    <tr key={row.procedure} className="border-b border-border-2 last:border-none">
                      <td className="py-2.5 text-fg-2 font-medium">{row.procedure}</td>
                      <td className="py-2.5 text-right text-fg-2">{row.count.toLocaleString("uz-UZ")}</td>
                      <td className="py-2.5 text-right font-medium text-fg">{formatCurrency(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </ChartCard>

        <ChartCard title="Bo'limlar" description="Bo'lim kesimida daromad" icon={Building2}>
          {departmentsQ.isLoading ? <Skeleton className="h-64 w-full" /> : departmentRows.length === 0 ? <EmptyChart /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={departmentRows} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                  <XAxis dataKey="department" stroke="hsl(215 16% 57%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215 16% 57%)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number) => [formatCurrency(v)]} />
                  <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <table className="mt-4 w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 text-[11px] font-semibold uppercase tracking-wider text-fg-3">Bo'lim</th>
                    <th className="py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-fg-3">Muolajalar</th>
                    <th className="py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-fg-3">Daromad</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentRows.map((row) => (
                    <tr key={row.department} className="border-b border-border-2 last:border-none">
                      <td className="py-2.5 text-fg-2 font-medium">{row.department}</td>
                      <td className="py-2.5 text-right text-fg-2">{row.count.toLocaleString("uz-UZ")}</td>
                      <td className="py-2.5 text-right font-medium text-fg">{formatCurrency(row.revenue)}</td>
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
