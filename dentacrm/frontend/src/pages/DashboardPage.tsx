import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  PackageSearch,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatsCharts } from "@/components/dashboard/StatsCharts";
import { cn } from "@/lib/utils";
import { listDepartments } from "@/api/departments";
import { listDoctors } from "@/api/doctors";
import { listMaterials, type Material } from "@/api/inventory";
import { listPatients } from "@/api/patients";
import type { Paginated } from "@/types";

/**
 * DashboardPage — bosh_shifokor's landing page.
 *
 * PROJECT_BRIEF § "Zamonaviy CRM dizayn qoidalari" #2 defines the
 * expected shape: KPI cards on top, drill-down links below. This page
 * hits already-shipped endpoints (``/patients/``, ``/doctors/``,
 * ``/departments/``, ``/materials/?below_threshold=true``) and does
 * NOT introduce any new backend contract. Charts (revenue over time,
 * procedures breakdown) land alongside the ``reports`` app in Faza 4.
 *
 * Data-fetching strategy:
 *   * Each KPI is its own query so a slow endpoint does not block the
 *     others — the tile renders a skeleton until its own data lands.
 *   * We rely on the paginated ``count`` field for counts so the
 *     payload is tiny (page_size=1).
 *   * Low-stock uses the existing ``?below_threshold=true`` filter and
 *     surfaces the first few offending materials for a quick glance.
 */

// ---------------------------------------------------------------------------
// KPI card primitive
// ---------------------------------------------------------------------------
interface KpiCardProps {
  label: string;
  value: string | number | null | undefined;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger";
  loading?: boolean;
  linkTo?: string;
  linkLabel?: string;
}

const TONE_STYLES: Record<
  NonNullable<KpiCardProps["tone"]>,
  { badge: string; icon: string }
> = {
  primary: {
    badge: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200",
    icon: "text-brand-600 dark:text-brand-300",
  },
  success: {
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
    icon: "text-emerald-600 dark:text-emerald-300",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    icon: "text-amber-600 dark:text-amber-300",
  },
  danger: {
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
    icon: "text-rose-600 dark:text-rose-300",
  },
};

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  loading = false,
  linkTo,
  linkLabel,
}: KpiCardProps): JSX.Element {
  const styles = TONE_STYLES[tone];
  return (
    <article
      className="card flex flex-col gap-3 p-5"
      aria-busy={loading || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
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
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {value ?? "—"}
          </p>
        )}
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {linkTo ? (
        <Link
          to={linkTo}
          className="mt-auto text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          {linkLabel ?? "Batafsil →"}
        </Link>
      ) : null}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export function DashboardPage(): JSX.Element {
  const patientsQ = useQuery<Paginated<unknown>>({
    queryKey: ["dashboard", "patients-count"],
    queryFn: () => listPatients({ page: 1, pageSize: 1 }),
    staleTime: 60_000,
  });
  const doctorsQ = useQuery<Paginated<unknown>>({
    queryKey: ["dashboard", "doctors-count"],
    queryFn: () => listDoctors({ page: 1, pageSize: 1 }),
    staleTime: 60_000,
  });
  const departmentsQ = useQuery<Paginated<unknown>>({
    queryKey: ["dashboard", "departments-count"],
    queryFn: () => listDepartments({ page: 1, pageSize: 1 }),
    staleTime: 60_000,
  });
  const lowStockQ = useQuery<Paginated<Material>>({
    queryKey: ["dashboard", "low-stock"],
    queryFn: () => listMaterials({ belowThreshold: true, pageSize: 5 }),
    staleTime: 60_000,
  });

  const lowStockItems = useMemo(
    () => lowStockQ.data?.results ?? [],
    [lowStockQ.data],
  );

  return (
    <section aria-labelledby="dashboard-title" className="space-y-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            id="dashboard-title"
            className="text-2xl font-semibold text-foreground"
          >
            Boshqaruv paneli
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Klinika holati, umumiy KPI ko'rsatkichlari va e'tibor talab
            qiladigan bo'limlar.
          </p>
        </div>
      </header>

      {/* --- KPI grid ---------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Bemorlar"
          icon={Users}
          tone="primary"
          value={patientsQ.data?.count}
          hint="Faol bemorlar ro'yxati"
          loading={patientsQ.isLoading}
          linkTo="/my-patients"
          linkLabel="Bemorlar →"
        />
        <KpiCard
          label="Shifokorlar"
          icon={Stethoscope}
          tone="success"
          value={doctorsQ.data?.count}
          hint="Ro'yxatga olingan shifokorlar"
          loading={doctorsQ.isLoading}
          linkTo="/doctors"
          linkLabel="Shifokorlar →"
        />
        <KpiCard
          label="Bo'limlar"
          icon={Building2}
          tone="warning"
          value={departmentsQ.data?.count}
          hint="Faol klinika bo'limlari"
          loading={departmentsQ.isLoading}
          linkTo="/departments"
          linkLabel="Bo'limlar →"
        />
        <KpiCard
          label="Kam zaxira"
          icon={AlertTriangle}
          tone="danger"
          value={lowStockQ.data?.count}
          hint="Minimum chegara ostidagi materiallar"
          loading={lowStockQ.isLoading}
          linkTo="/inventory"
          linkLabel="Omborga o'tish →"
        />
      </div>

      {/* --- Charts ---------------------------------------------------- */}
      <StatsCharts period="week" />

      {/* --- Low stock detail ------------------------------------------- */}
      <article
        className="card p-6"
        aria-labelledby="dashboard-low-stock-heading"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              id="dashboard-low-stock-heading"
              className="text-lg font-semibold text-foreground"
            >
              Materiallar — e'tibor talab qiladi
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Zaxirasi minimum chegaraga tushgan yoki tushib qolgan materiallar.
            </p>
          </div>
          <Link
            to="/inventory?filter=low"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
          >
            To'liq ro'yxat →
          </Link>
        </div>

        {lowStockQ.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : lowStockItems.length === 0 ? (
          <EmptyState
            title="Barcha materiallar yetarli"
            description="Hozircha hech qanday material minimum chegaraga tushmagan."
            icon={<PackageSearch className="h-10 w-10" aria-hidden="true" />}
          />
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {lowStockItems.map((mat) => (
              <li
                key={mat.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {mat.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Ombor: {mat.quantityInStock} {mat.unit} • Min:{" "}
                    {mat.minimumThreshold} {mat.unit}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
                  )}
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  Kam qolgan
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
