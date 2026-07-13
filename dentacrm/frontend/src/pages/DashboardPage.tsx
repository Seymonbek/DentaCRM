import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  PackageSearch,
  Stethoscope,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { listDepartments } from "@/api/departments";
import { listDoctors } from "@/api/doctors";
import { listMaterials, type Material } from "@/api/inventory";
import { listPatients } from "@/api/patients";
import type { Paginated } from "@/types";

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number | null | undefined;
  hint?: string;
  icon: LucideIcon;
  tone?: "violet" | "green" | "amber" | "rose";
  loading?: boolean;
  linkTo?: string;
  linkLabel?: string;
  index?: number;
}

const TONE_STYLES: Record<
  NonNullable<KpiCardProps["tone"]>,
  { iconBg: string; iconColor: string; glow: string; border: string }
> = {
  violet: {
    iconBg:    "from-violet-600/20 to-purple-600/20",
    iconColor: "text-violet-400",
    glow:      "rgba(124,58,237,0.25)",
    border:    "hover:border-violet-500/30",
  },
  green: {
    iconBg:    "from-emerald-600/20 to-teal-600/20",
    iconColor: "text-emerald-400",
    glow:      "rgba(16,185,129,0.25)",
    border:    "hover:border-emerald-500/30",
  },
  amber: {
    iconBg:    "from-amber-600/20 to-orange-600/20",
    iconColor: "text-amber-400",
    glow:      "rgba(245,158,11,0.25)",
    border:    "hover:border-amber-500/30",
  },
  rose: {
    iconBg:    "from-rose-600/20 to-red-600/20",
    iconColor: "text-rose-400",
    glow:      "rgba(244,63,94,0.25)",
    border:    "hover:border-rose-500/30",
  },
};

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "violet",
  loading = false,
  linkTo,
  linkLabel,
  index = 0,
}: KpiCardProps): JSX.Element {
  const s = TONE_STYLES[tone];
  return (
    <article
      className={cn(
        "card group relative flex flex-col gap-4 p-5 overflow-hidden kpi-card-accent",
        "hover:shadow-md transition-all duration-300 ease-spring",
        s.border,
        "animate-in",
      )}
      style={{ animationDelay: `${index * 70}ms` }}
      aria-busy={loading || undefined}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold text-fg-3 uppercase tracking-wider">{label}</p>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            "bg-gradient-to-br",
            s.iconBg,
          )}
          style={{ boxShadow: `0 0 16px ${s.glow}` }}
        >
          <Icon className={cn("h-4.5 w-4.5", s.iconColor)} aria-hidden="true" />
        </span>
      </div>

      {/* Value */}
      <div>
        {loading ? (
          <>
            <div className="skeleton h-9 w-24 mb-1.5 rounded-lg" />
            <div className="skeleton h-3 w-32 rounded" />
          </>
        ) : (
          <>
            <p className="text-[32px] font-display font-bold tracking-tight text-fg leading-none animate-count">
              {value ?? "—"}
            </p>
            {hint ? (
              <p className="mt-2 text-xs text-fg-3">{hint}</p>
            ) : null}
          </>
        )}
      </div>

      {/* Link */}
      {linkTo ? (
        <Link
          to={linkTo}
          className={cn(
            "mt-auto inline-flex items-center gap-1.5 text-xs font-semibold",
            "text-fg-3 hover:text-brand-400 transition-colors duration-150",
          )}
        >
          {linkLabel ?? "Batafsil"}
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </article>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-display font-bold text-fg">{title}</h2>
      {action}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

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

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Xayrli tong"
      : now.getHours() < 18
        ? "Xayrli kun"
        : "Xayrli kech";

  return (
    <section aria-labelledby="dashboard-title" className="space-y-8 max-w-6xl page-enter">

      {/* ── Page header ────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-fg-3 uppercase tracking-[0.12em] mb-2">
            {now.toLocaleDateString("uz-UZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 id="dashboard-title" className="text-[28px] font-display font-bold tracking-tight text-fg">
            {greeting}{" "}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-fg-3">
            Klinikaning bugungi holatiga umumiy ko'rinish
          </p>
        </div>

        {/* Live indicator */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold"
          style={{
            background: "rgba(16,185,129,0.10)",
            border: "1px solid rgba(16,185,129,0.25)",
            color: "#34d399",
          }}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" />
          Jonli
        </div>
      </div>

      {/* ── KPI Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
        <KpiCard
          index={0}
          label="Bemorlar"
          icon={Users}
          tone="violet"
          value={patientsQ.data?.count}
          hint="Jami ro'yxatdagi bemorlar"
          loading={patientsQ.isLoading}
          linkTo="/my-patients"
          linkLabel="Barchasini ko'rish"
        />
        <KpiCard
          index={1}
          label="Shifokorlar"
          icon={Stethoscope}
          tone="green"
          value={doctorsQ.data?.count}
          hint="Faol shifokorlar soni"
          loading={doctorsQ.isLoading}
          linkTo="/doctors"
          linkLabel="Barchasini ko'rish"
        />
        <KpiCard
          index={2}
          label="Bo'limlar"
          icon={Building2}
          tone="amber"
          value={departmentsQ.data?.count}
          hint="Klinika bo'limlari"
          loading={departmentsQ.isLoading}
          linkTo="/departments"
          linkLabel="Barchasini ko'rish"
        />
        <KpiCard
          index={3}
          label="Kam zaxira"
          icon={AlertTriangle}
          tone="rose"
          value={lowStockQ.data?.count}
          hint="Minimum chegara ostida"
          loading={lowStockQ.isLoading}
          linkTo="/inventory"
          linkLabel="Omborga o'tish"
        />
      </div>

      {/* ── Two column grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Low stock — 2 cols */}
        <article className="card p-6 lg:col-span-2" aria-labelledby="low-stock-heading">
          <SectionHeader
            title="⚠️ Zaxira kam materiallar"
            action={
              <Link
                to="/inventory?filter=low"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                To'liq ro'yxat
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />

          {lowStockQ.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48 rounded" />
                    <div className="skeleton h-3 w-32 rounded" />
                  </div>
                  <div className="skeleton h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <EmptyState
              title="Barcha materiallar yetarli"
              description="Hozircha hech qanday material minimum chegaraga tushmagan."
              icon={<PackageSearch className="h-6 w-6" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-border-2">
              {lowStockItems.map((mat) => (
                <li key={mat.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-fg">{mat.name}</p>
                    <p className="mt-0.5 text-xs text-fg-3">
                      Mavjud:{" "}
                      <span className="font-semibold text-danger">
                        {mat.quantityInStock} {mat.unit}
                      </span>
                      {" "}· Min: {mat.minimumThreshold} {mat.unit}
                    </p>
                  </div>
                  <span className="badge badge-danger shrink-0">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    Kam
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Quick actions — 1 col */}
        <div className="card p-5">
          <SectionHeader title="⚡ Tez harakatlar" />
          <div className="space-y-2.5">
            {[
              {
                to: "/my-patients",
                icon: Users,
                label: "Bemorlar ro'yxati",
                desc: "Barcha bemorlar",
                color: "from-violet-600/20 to-purple-600/20",
                iconColor: "text-violet-400",
              },
              {
                to: "/appointments/new",
                icon: Activity,
                label: "Navbat yaratish",
                desc: "Yangi navbat qo'shish",
                color: "from-emerald-600/20 to-teal-600/20",
                iconColor: "text-emerald-400",
              },
              {
                to: "/reports",
                icon: TrendingUp,
                label: "Hisobotlar",
                desc: "Statistika va tahlil",
                color: "from-amber-600/20 to-orange-600/20",
                iconColor: "text-amber-400",
              },
              {
                to: "/inventory",
                icon: Sparkles,
                label: "Ombor",
                desc: "Materiallar boshqaruvi",
                color: "from-rose-600/20 to-pink-600/20",
                iconColor: "text-rose-400",
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-3 rounded-xl p-3 border border-transparent
                  hover:border-border hover:bg-surface-2/60 hover:shadow-sm
                  transition-all duration-200 ease-spring"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    "bg-gradient-to-br",
                    item.color,
                    "transition-all duration-200 group-hover:scale-110",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", item.iconColor)} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-fg truncate leading-tight">{item.label}</p>
                  <p className="text-[11px] text-fg-3 truncate">{item.desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-fg-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
