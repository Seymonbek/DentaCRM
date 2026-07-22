import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  Building2,
  PackageSearch,
  Stethoscope,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  Clock,
  PlayCircle,
  CheckCheck,
  XCircle,
  DollarSign,
  User,
  Package,
  Cog,
  ShieldAlert,
  Search,
  RotateCcw,
  Plus,
  ExternalLink,
  ClipboardList,
  CreditCard,
  Trophy,
  CalendarDays,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { DataTable, type DataTableColumn, type DataTableSort } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { cn, formatDateTime } from "@/lib/utils";
import { listDepartments } from "@/api/departments";
import { listDoctors } from "@/api/doctors";
import { listMaterials, type Material, type MaterialUnit } from "@/api/inventory";
import { listPatients } from "@/api/patients";
import { listAppointments, APPOINTMENT_STATUS_LABELS, type AppointmentRecord } from "@/api/appointments";
import { useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { useCreateMaterial, useRestockMaterial } from "@/hooks/useMaterials";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import type { Paginated, AppointmentStatus } from "@/types";

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number | null | undefined;
  hint?: string;
  icon: LucideIcon;
  tone?: "teal" | "green" | "amber" | "rose" | "sky";
  loading?: boolean;
  linkTo?: string;
  linkLabel?: string;
  index?: number;
}

const TONE_STYLES: Record<
  NonNullable<KpiCardProps["tone"]>,
  { iconBg: string; iconColor: string; glow: string; border: string }
> = {
  teal: {
    iconBg:    "from-teal-600/20 to-emerald-600/20",
    iconColor: "text-teal-500",
    glow:      "rgba(13,148,136,0.25)",
    border:    "hover:border-teal-500/30",
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
  sky: {
    iconBg:    "from-sky-600/20 to-blue-600/20",
    iconColor: "text-sky-400",
    glow:      "rgba(14,165,233,0.25)",
    border:    "hover:border-sky-500/30",
  },
};

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "teal",
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
              {value ?? "0"}
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
            "text-fg-3 hover:text-brand-500 transition-colors duration-150",
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

// ── Appointment Status Badge helper ──────────────────────────────────────────

const APPT_STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; badge: string; icon: typeof Clock }
> = {
  scheduled:   { label: "Rejalashtirilgan", badge: "badge-blue",   icon: Clock         },
  confirmed:   { label: "Tasdiqlangan",     badge: "badge-violet", icon: CheckCircle   },
  in_progress: { label: "Bajarilmoqda",     badge: "badge-amber",  icon: PlayCircle    },
  completed:   { label: "Yakunlangan",      badge: "badge-green",  icon: CheckCheck    },
  cancelled:   { label: "Bekor qilingan",   badge: "badge-muted",  icon: XCircle       },
  no_show:     { label: "Kelmadi",          badge: "badge-danger", icon: AlertTriangle },
};

const APPT_ACTIONS: {
  label: string;
  next: AppointmentStatus;
  variant?: "primary" | "secondary" | "destructive";
  icon: typeof CheckCircle;
}[] = [
  { label: "Tasdiqlash", next: "confirmed",   variant: "secondary",    icon: CheckCircle },
  { label: "Boshlash",   next: "in_progress", variant: "primary",      icon: PlayCircle   },
  { label: "Yakunlash",  next: "completed",   variant: "primary",      icon: CheckCheck   },
  { label: "Kelmadi",    next: "no_show",     variant: "destructive",  icon: XCircle      },
];

const ROLE_LABELS: Record<string, string> = {
  bosh_shifokor: "Bosh shifokor",
  doctor:        "Shifokor",
  administrator: "Administrator",
};

const UNIT_LABELS: Record<MaterialUnit, string> = {
  gram: "gramm",
  piece: "dona",
  ml: "ml",
};

// ── Validation Schemas ────────────────────────────────────────────────────────

const decimalString = (opts: { min?: number; allowEmpty?: boolean } = {}) => {
  const { min = 0, allowEmpty = false } = opts;
  return z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val === "") {
        if (!allowEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Qiymat majburiy.",
          });
        }
        return;
      }
      if (!/^-?\d+(\.\d+)?$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faqat raqam kiriting.",
        });
        return;
      }
      const num = Number(val);
      if (Number.isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Noto'g'ri son.",
        });
        return;
      }
      if (num < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Qiymat ${min} dan kichik bo'lmasligi kerak.`,
        });
      }
    });
};

const materialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Kamida 2 belgi kiriting")
    .max(150, "Ko'pi bilan 150 belgi"),
  unit: z.enum(["gram", "piece", "ml"], {
    errorMap: () => ({ message: "O'lchov birligini tanlang" }),
  }),
  quantityInStock: decimalString({ min: 0 }),
  minimumThreshold: decimalString({ min: 0 }),
  unitCost: decimalString({ min: 0, allowEmpty: true }),
  notes: z.string().trim().max(1000, "Ko'pi bilan 1000 belgi").optional(),
});
type MaterialFormValues = z.infer<typeof materialSchema>;

const restockSchema = z.object({
  amount: decimalString({ min: 0.001 }).refine((v) => Number(v) > 0, {
    message: "Miqdor musbat bo'lishi kerak.",
  }),
  note: z.string().trim().max(255, "Ko'pi bilan 255 belgi").optional(),
});
type RestockFormValues = z.infer<typeof restockSchema>;

// ── Page ────────────────────────────────────────────────────────────────────

export function DashboardPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "doctor";

  const isChief = role === "bosh_shifokor";
  const isDoc   = role === "doctor";
  const isAdmin = role === "administrator";

  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "admin">("overview");

  // Inventory tab states
  const [invSearch, setInvSearch] = useState("");
  const [invBelowOnly, setInvBelowOnly] = useState(false);
  const [invPage, setInvPage] = useState(1);
  const [invSort, setInvSort] = useState<DataTableSort | null>({ field: "name", direction: "asc" });

  // Modals state
  const [restockingMaterial, setRestockingMaterial] = useState<Material | null>(null);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  // ── Queries ────────────────────────────────────────────────────────────────

  const patientsQ = useQuery<Paginated<unknown>>({
    queryKey: ["dashboard", "patients-count"],
    queryFn: () => listPatients({ page: 1, pageSize: 1 }),
    staleTime: 60_000,
  });

  const doctorsQ = useQuery<Paginated<unknown>>({
    queryKey: ["dashboard", "doctors-count"],
    queryFn: () => listDoctors({ page: 1, pageSize: 1 }),
    enabled: isChief,
    staleTime: 60_000,
  });

  const departmentsQ = useQuery<Paginated<unknown>>({
    queryKey: ["dashboard", "departments-count"],
    queryFn: () => listDepartments({ page: 1, pageSize: 1 }),
    enabled: isChief,
    staleTime: 60_000,
  });

  const lowStockQ = useQuery<Paginated<Material>>({
    queryKey: ["dashboard", "low-stock"],
    queryFn: () => listMaterials({ belowThreshold: true, pageSize: 5 }),
    staleTime: 60_000,
  });

  // Main inventory tab query
  const invOrdering = invSort
    ? `${invSort.direction === "desc" ? "-" : ""}${invSort.field}`
    : undefined;

  const inventoryQ = useQuery<Paginated<Material>>({
    queryKey: ["dashboard-inventory", invPage, invSearch, invBelowOnly, invOrdering],
    queryFn: () =>
      listMaterials({
        page: invPage,
        pageSize: 10,
        search: invSearch,
        belowThreshold: invBelowOnly,
        ordering: invOrdering,
      }),
    staleTime: 30_000,
  });

  // Today's appointments
  const todayAppointmentsQ = useQuery<Paginated<AppointmentRecord>>({
    queryKey: ["dashboard", "today-appointments"],
    queryFn: () => listAppointments({ dateFrom: todayStr, dateTo: todayStr, pageSize: 20 }),
    staleTime: 30_000,
  });

  const updateStatus = useUpdateAppointmentStatus();

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleStatusChange(id: string, next: AppointmentStatus) {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(`Navbat holati muvaffaqiyatli o'zgartirildi: ${APPOINTMENT_STATUS_LABELS[next]}`);
      todayAppointmentsQ.refetch();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  }

  // ── Memoized state ─────────────────────────────────────────────────────────

  const lowStockItems = useMemo(
    () => lowStockQ.data?.results ?? [],
    [lowStockQ.data],
  );

  const todayAppointments = useMemo(
    () => todayAppointmentsQ.data?.results ?? [],
    [todayAppointmentsQ.data],
  );

  // Time-based greeting
  const now = new Date();
  const greeting = useMemo(() => {
    const hours = now.getHours();
    if (hours < 12) return "Xayrli tong";
    if (hours < 18) return "Xayrli kun";
    return "Xayrli kech";
  }, [now]);

  // Inventory table columns config
  const invColumns: DataTableColumn<Material>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Material nomi",
        sortable: true,
        cell: (row) => (
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl",
                row.isBelowThreshold ? "bg-warning/15 text-warning" : "bg-brand-600/10 text-brand-600 dark:text-brand-400",
              )}
            >
              <Package className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="font-semibold text-fg text-sm">{row.name}</div>
              {row.notes ? <div className="text-xs text-fg-3 truncate max-w-xs">{row.notes}</div> : null}
            </div>
          </div>
        ),
      },
      {
        key: "quantityInStock",
        header: "Zaxirada",
        sortable: true,
        sortField: "quantity_in_stock",
        align: "right",
        cell: (row) => (
          <div className="flex flex-col items-end">
            <span className={cn("font-semibold tabular-nums text-sm", row.isBelowThreshold ? "text-warning" : "text-fg")}>
              {row.quantityInStock} {UNIT_LABELS[row.unit]}
            </span>
            <span className="text-[10px] text-fg-3">min me'yor: {row.minimumThreshold}</span>
          </div>
        ),
      },
      {
        key: "isBelowThreshold",
        header: "Holati",
        align: "center",
        cell: (row) =>
          row.isBelowThreshold ? (
            <span className="inline-flex items-center gap-1 rounded-full badge badge-amber text-xs">
              <AlertTriangle className="h-3 w-3" /> Kam qoldi
            </span>
          ) : (
            <span className="badge badge-green text-xs">Yetarli</span>
          ),
      },
      {
        key: "unitCost",
        header: "Birlik narxi",
        align: "right",
        cell: (row) => (
          <span className="text-xs text-fg-2 tabular-nums">
            {row.unitCost
              ? new Intl.NumberFormat("uz-UZ", { style: "currency", currency: "UZS", maximumFractionDigits: 0 }).format(
                  Number(row.unitCost),
                )
              : "—"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section aria-labelledby="dashboard-title" className="h-[calc(100vh-100px)] lg:h-[calc(100vh-130px)] flex flex-col space-y-6 max-w-6xl page-enter overflow-hidden">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <p className="text-xs font-semibold text-fg-3 uppercase tracking-[0.12em] mb-1">
            {now.toLocaleDateString("uz-UZ", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 id="dashboard-title" className="text-[28px] font-display font-bold tracking-tight text-fg leading-tight">
            {greeting}, {user?.firstName ?? "Foydalanuvchi"}! <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-fg-3 flex items-center gap-2">
            Roli: <span className="badge badge-blue">{ROLE_LABELS[role] ?? role}</span> · Klinika ish faoliyatini nazorat qiling.
          </p>
        </div>

        {/* Live Indicator */}
        <div
          className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold self-start sm:self-center"
          style={{
            background: "rgba(20,184,166,0.10)",
            border: "1px solid rgba(20,184,166,0.25)",
            color: "#2dd4bf",
          }}
        >
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse-soft" />
          Klinika Faol
        </div>
      </div>

      {/* ── Tabs Navigation ────────────────────────────────────── */}
      <nav className="flex border-b border-border space-x-2 shrink-0" aria-label="Dashboard bo'limlari">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all",
            activeTab === "overview"
              ? "border-teal-500 text-teal-500 font-bold"
              : "border-transparent text-fg-3 hover:text-fg hover:border-border",
          )}
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          Bosh sahifa
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={cn(
            "flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all",
            activeTab === "inventory"
              ? "border-teal-500 text-teal-500 font-bold"
              : "border-transparent text-fg-3 hover:text-fg hover:border-border",
          )}
        >
          <Package className="h-4.5 w-4.5" />
          Omborxona boshqaruvi
        </button>
        {(isChief || isAdmin) && (
          <button
            onClick={() => setActiveTab("admin")}
            className={cn(
              "flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all",
              activeTab === "admin"
                ? "border-teal-500 text-teal-500 font-bold"
                : "border-transparent text-fg-3 hover:text-fg hover:border-border",
            )}
          >
            <Cog className="h-4.5 w-4.5" />
            Ma'muriyat & Admin Panel
          </button>
        )}
      </nav>

      {/* ── TAB CONTENT: OVERVIEW ──────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="flex-1 overflow-y-auto space-y-8 pr-1 pb-6 animate-in duration-200 scrollbar-thin">
          {/* Stepper Clinical Workflow */}
          <div className="card p-6 border border-brand-500/10">
            <div className="mb-4">
              <h2 className="text-[15px] font-display font-bold text-fg">🦷 Klinika Ish Oqimi va Qadamlar Sxemasi</h2>
              <p className="text-xs text-fg-3 mt-1">Yangi kelgan bemorni qabul qilishdan boshlab to'lov va zaxiralarni hisobdan chiqarishgacha:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
              <div className="flex flex-col p-4 rounded-2xl bg-surface-2/40 border border-border hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold">1</span>
                  <h3 className="text-xs font-bold text-fg">Bemor qo'shish</h3>
                </div>
                <p className="text-[11px] text-fg-3 mt-2 flex-1">Yangi bemorni tizimda ro'yxatga oling.</p>
                {isChief || isAdmin ? (
                  <Link to="/patients/new" className="mt-3 text-[11px] font-bold text-teal-500 hover:text-teal-400 inline-flex items-center gap-1">
                    Boshlash <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <Link to="/my-patients" className="mt-3 text-[11px] font-bold text-fg-3 hover:text-fg-2 inline-flex items-center gap-1">
                    Bemorlar <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              <div className="flex flex-col p-4 rounded-2xl bg-surface-2/40 border border-border hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold">2</span>
                  <h3 className="text-xs font-bold text-fg">Navbat belgilash</h3>
                </div>
                <p className="text-[11px] text-fg-3 mt-2 flex-1">Shifokor jadvaliga navbat va vaqt band qiling.</p>
                {isChief || isAdmin ? (
                  <Link to="/appointments/new" className="mt-3 text-[11px] font-bold text-teal-500 hover:text-teal-400 inline-flex items-center gap-1">
                    Navbat <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <Link to="/my-appointments" className="mt-3 text-[11px] font-bold text-fg-3 hover:text-fg-2 inline-flex items-center gap-1">
                    Jadval <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              <div className="flex flex-col p-4 rounded-2xl bg-surface-2/40 border border-border hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold">3</span>
                  <h3 className="text-xs font-bold text-fg">Qabulni boshlash</h3>
                </div>
                <p className="text-[11px] text-fg-3 mt-2 flex-1">Qabullar timeline-dan holatni 'Bajarilmoqda'ga o'tkazing.</p>
                <span className="mt-3 text-[11px] text-fg-3 font-semibold">Qabul vaqtida</span>
              </div>

              <div className="flex flex-col p-4 rounded-2xl bg-surface-2/40 border border-border hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold">4</span>
                  <h3 className="text-xs font-bold text-fg">Davolash & To'lov</h3>
                </div>
                <p className="text-[11px] text-fg-3 mt-2 flex-1">Tish kartasida muolajani yakunlang va kassa orqali to'lovni hisoblang.</p>
                <Link to="/payments/new" className="mt-3 text-[11px] font-bold text-teal-500 hover:text-teal-400 inline-flex items-center gap-1">
                  To'lov <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex flex-col p-4 rounded-2xl bg-surface-2/40 border border-border hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold">5</span>
                  <h3 className="text-xs font-bold text-fg">Omborxona & Zaxira</h3>
                </div>
                <p className="text-[11px] text-fg-3 mt-2 flex-1">Sarflangan ashyolarni ombordan kuzating va to'ldiring.</p>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="mt-3 text-[11px] font-bold text-teal-500 hover:text-teal-400 inline-flex items-center gap-1 text-left"
                >
                  Omborga o'tish <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
            <KpiCard
              index={0}
              label="Tizimdagi bemorlar"
              icon={Users}
              tone="teal"
              value={patientsQ.data?.count}
              hint="Jami ro'yxatdan o'tgan bemorlar"
              loading={patientsQ.isLoading}
              linkTo="/my-patients"
              linkLabel="Bemorlarga o'tish"
            />
            {isChief ? (
              <KpiCard
                index={1}
                label="Faol Shifokorlar"
                icon={Stethoscope}
                tone="green"
                value={doctorsQ.data?.count}
                hint="Klinikaning faol shifokorlari"
                loading={doctorsQ.isLoading}
                linkTo="/doctors"
                linkLabel="Barchasini ko'rish"
              />
            ) : (
              <KpiCard
                index={1}
                label="Bugungi navbatlarim"
                icon={Activity}
                tone="sky"
                value={todayAppointments.filter((a) => a.doctorId === user?.id).length}
                hint="Sizga bog'langan qabullar"
                loading={todayAppointmentsQ.isLoading}
                linkTo={isDoc ? "/my-appointments" : "/schedule"}
                linkLabel="Navbatlar ro'yxati"
              />
            )}
            {isChief ? (
              <KpiCard
                index={2}
                label="Klinika Bo'limlari"
                icon={Building2}
                tone="amber"
                value={departmentsQ.data?.count}
                hint="Xizmat ko'rsatuvchi bo'limlar"
                loading={departmentsQ.isLoading}
                linkTo="/departments"
                linkLabel="Bo'limlarni ko'rish"
              />
            ) : (
              <KpiCard
                index={2}
                label="Bugungi umumiy navbatlar"
                icon={CalendarDays}
                tone="amber"
                value={todayAppointmentsQ.data?.count}
                hint="Klinika bo'yicha bugungi bandliklar"
                loading={todayAppointmentsQ.isLoading}
                linkTo={isAdmin ? "/schedule" : "/my-appointments"}
                linkLabel="Qabul jadvaliga o'tish"
              />
            )}
            <KpiCard
              index={3}
              label="Zaxirasi kam materiallar"
              icon={AlertTriangle}
              tone="rose"
              value={lowStockQ.data?.count ?? 0}
              hint="Kam qolgan dental ashyolar"
              loading={lowStockQ.isLoading}
              linkTo="/inventory"
              linkLabel="Omborxonaga o'tish"
            />
          </div>

          {/* Today's Appointments Timeline & Low Stock warning widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <article className="card p-6 border border-border" aria-labelledby="timeline-heading">
                <SectionHeader
                  title={isDoc ? "📅 Mening bugungi qabullarim" : "📅 Klinikadagi bugungi navbatlar timeline"}
                  action={
                    <Link
                      to={isDoc ? "/my-appointments" : "/schedule"}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-500 hover:text-teal-400 transition-colors"
                    >
                      Batafsil ro'yxat <ArrowRight className="h-3 w-3" />
                    </Link>
                  }
                />

                {todayAppointmentsQ.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between gap-4 p-3.5 border border-border rounded-xl">
                        <div className="flex-1 space-y-2">
                          <div className="skeleton h-4 w-48 rounded" />
                          <div className="skeleton h-3 w-32 rounded" />
                        </div>
                        <div className="skeleton h-6 w-20 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <EmptyState
                    title="Bugun qabullar rejalashtirilmagan"
                    description="Hozircha bugungi kun uchun hech qanday navbat mavjud emas."
                    icon={<Clock className="h-6 w-6" aria-hidden="true" />}
                  />
                ) : (
                  <ul className="space-y-3">
                    {todayAppointments.map((appt) => {
                      const start = new Date(appt.scheduledStart);
                      const end = new Date(appt.scheduledEnd);
                      const patientName = appt.patient
                        ? `${appt.patient.firstName} ${appt.patient.lastName}`
                        : `Bemor #${appt.patientId.slice(0, 6)}`;
                      const doctorName = appt.doctor
                        ? `Shifokor: ${appt.doctor.firstName} ${appt.doctor.lastName}`
                        : `Shifokor #${appt.doctorId.slice(0, 6)}`;

                      const cfg = APPT_STATUS_CONFIG[appt.status] ?? APPT_STATUS_CONFIG.scheduled;
                      const StatusIcon = cfg.icon;
                      const isActive = appt.status === "in_progress";

                      return (
                        <li
                          key={appt.id}
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-2xl transition-all",
                            isActive
                              ? "border-amber-400/40 bg-amber-500/5 shadow-sm"
                              : "border-border bg-surface-2/20 hover:bg-surface-2/40 hover:border-teal-500/10",
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-center font-bold text-xs border",
                              isActive ? "bg-amber-500/15 border-amber-400/25 text-amber-400" : "bg-surface-2 border-border text-fg-2"
                            )}>
                              <span>{start.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-fg-3" aria-hidden="true" />
                                <Link to={`/patients/${appt.patientId}`} className="text-sm font-bold text-teal-400 hover:underline">
                                  {patientName}
                                </Link>
                              </div>
                              
                              {!isDoc && <p className="text-[11px] text-fg-3 mt-0.5">{doctorName}</p>}

                              <p className="text-xs text-fg-3 mt-1 flex items-center gap-1.5">
                                <span>{start.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</span>
                                {" · "}
                                <span className={cn("badge text-xs", cfg.badge)}>
                                  <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                                  {cfg.label}
                                </span>
                              </p>
                              {appt.notes && (
                                <p className="text-xs text-fg-3 italic mt-1.5 border-l-2 border-border pl-2">
                                  "{appt.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          {appt.status !== "completed" && appt.status !== "cancelled" && (
                            <div className="flex flex-wrap gap-2 items-center sm:justify-end self-end sm:self-center">
                              {APPT_ACTIONS.filter((a) => a.next !== appt.status && (
                                appt.status === "scheduled"   ? ["confirmed", "no_show"].includes(a.next) :
                                appt.status === "confirmed"   ? ["in_progress", "no_show"].includes(a.next) :
                                appt.status === "in_progress" ? ["completed"].includes(a.next) :
                                false
                              )).map((action) => (
                                <Button
                                  key={action.next}
                                  size="sm"
                                  variant={action.variant ?? "secondary"}
                                  onClick={() => handleStatusChange(appt.id, action.next)}
                                  disabled={updateStatus.isPending}
                                >
                                  <action.icon className="h-3.5 w-3.5" aria-hidden="true" />
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            </div>

            {/* Right side info / Tip widgets */}
            <div className="space-y-6">
              {/* Alert low stock items */}
              {lowStockItems.length > 0 && (
                <div className="card p-5 border border-amber-500/20 bg-amber-500/[0.02]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Zaxirada kam qolganlar
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs">
                    {lowStockItems.map((mat) => (
                      <li key={mat.id} className="flex justify-between border-b border-border-2 py-1 last:border-none">
                        <span className="font-semibold text-fg">{mat.name}</span>
                        <span className="text-amber-400 font-bold">{mat.quantityInStock} {UNIT_LABELS[mat.unit]}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="mt-4 text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
                  >
                    Hozir to'ldirish <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Tips panel */}
              <div className="card p-5 bg-gradient-to-br from-teal-500/[0.02] to-sky-500/[0.02] border border-teal-500/5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  💡 Foydali maslahatlar
                </h3>
                <ul className="mt-3 space-y-2.5 text-xs text-fg-2">
                  <li className="flex gap-2">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>Qabul timeline-dan foydalanib, bemorni navbatini o'zgartiring - bu shifokorlarga real vaqtda yangilanadi.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>Omborxona tabiga o'tib, zaxiradagi ashyolarni doimiy kuzatib boring hamda kiritib boring.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-500 font-bold">•</span>
                    <span>Qidiruv maydonini ochish uchun <strong>⌘ K</strong> tugmalaridan foydalaning.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: INVENTORY ─────────────────────────────── */}
      {activeTab === "inventory" && (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-6 animate-in duration-200 scrollbar-thin">
          <div className="card p-6 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-fg">📦 Klinik Materiallar va Asbob-uskunalar Ombori</h2>
                <p className="text-xs text-fg-3 mt-1">Materiallar zaxirasini boshqarish, kiritish va zaxirani to'ldirish (Restock) amallari.</p>
              </div>

              {isChief && (
                <Button onClick={() => setIsCreatingMaterial(true)} size="sm">
                  <Plus className="h-4 w-4" />
                  Yangi material qo'shish
                </Button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-3" />
                <Input
                  type="search"
                  placeholder="Material nomi bo'yicha qidirish..."
                  value={invSearch}
                  onChange={(e) => {
                    setInvSearch(e.target.value);
                    setInvPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              <label className="inline-flex select-none items-center gap-2 text-sm text-fg-2 self-center bg-surface-2/30 border border-border px-3 py-2 rounded-xl">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-md border-border text-teal-600 focus:ring-teal-500/30"
                  checked={invBelowOnly}
                  onChange={(e) => {
                    setInvBelowOnly(e.target.checked);
                    setInvPage(1);
                  }}
                />
                Faqat kam qolganlar
              </label>
            </div>

            {/* DataTable */}
            <DataTable<Material>
              columns={invColumns}
              rows={inventoryQ.data?.results}
              rowKey={(row) => row.id}
              isLoading={inventoryQ.isLoading}
              error={inventoryQ.isError ? inventoryQ.error : undefined}
              emptyTitle="Materiallar topilmadi"
              emptyDescription="Qidiruv natijalari bo'yicha yoki omborda materiallar mavjud emas."
              sort={invSort}
              onSortChange={(sort) => {
                setInvSort(sort);
                setInvPage(1);
              }}
              rowActions={
                isChief
                  ? (row) => (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRestockingMaterial(row)}
                          className="text-emerald-500 hover:bg-emerald-500/10 gap-1"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          To'ldirish
                        </Button>
                      </div>
                    )
                  : undefined
              }
            />

            {/* Pagination */}
            {inventoryQ.data && inventoryQ.data.count > 10 && (
              <Pagination
                page={invPage}
                pageSize={10}
                count={inventoryQ.data.count}
                onPageChange={setInvPage}
                isLoading={inventoryQ.isFetching}
                className="mt-4"
              />
            )}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: ADMINISTRATION ────────────────────────── */}
      {activeTab === "admin" && (isChief || isAdmin) && (
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 pb-6 animate-in duration-200 scrollbar-thin">
          <div className="card p-6 border border-border">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-fg">⚙️ Klinikani Ma'muriy Boshqarish Paneli</h2>
              <p className="text-xs text-fg-3 mt-1">Shifokorlar ish jadvali, bo'limlar tarkibi va Django tizim sozlamalarini boshqarish havola tizimlari.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Django Admin Portal */}
              <div className="flex flex-col p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] hover:bg-amber-500/[0.04] transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                    <ShieldAlert className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-fg">Tizim Bosh Admin Paneli</h3>
                </div>
                <p className="text-xs text-fg-3 mt-3 flex-1 leading-relaxed">
                  Foydalanuvchi ma'lumotlari, rollar, parollarni yangilash va tizimning to'liq ma'lumotlar bazasini boshqaradigan Django Admin portali.
                </p>
                <a
                  href="/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
                >
                  Admin Portalni ochish <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Doctors Management */}
              {isChief && (
                <div className="flex flex-col p-5 rounded-2xl border border-border bg-surface-2/20 hover:border-teal-500/25 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                      <Stethoscope className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="text-sm font-bold text-fg">Shifokorlarni Boshqarish</h3>
                  </div>
                  <p className="text-xs text-fg-3 mt-3 flex-1 leading-relaxed">
                    Klinika shifokorlar tarkibi, shaxsiy ma'lumotlari, mutaxassisligi va ularning kunlik ish soatlarini to'liq boshqarish sahifasi.
                  </p>
                  <Link
                    to="/doctors"
                    className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border hover:bg-surface-2 transition-colors"
                  >
                    Shifokorlarga o'tish <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Departments Management */}
              {isChief && (
                <div className="flex flex-col p-5 rounded-2xl border border-border bg-surface-2/20 hover:border-teal-500/25 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                      <Building2 className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="text-sm font-bold text-fg">Klinika Bo'limlari</h3>
                  </div>
                  <p className="text-xs text-fg-3 mt-3 flex-1 leading-relaxed">
                    Terapevtik, Ortopedik, Rentgen va jarrohlik bo'limlarini shakllantirish hamda ularning shifokorlarini boshqarish.
                  </p>
                  <Link
                    to="/departments"
                    className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border hover:bg-surface-2 transition-colors"
                  >
                    Bo'limlarga o'tish <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Timetable Management */}
              <div className="flex flex-col p-5 rounded-2xl border border-border bg-surface-2/20 hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                    <CalendarDays className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-fg">Ish va Qabul Jadvali</h3>
                </div>
                <p className="text-xs text-fg-3 mt-3 flex-1 leading-relaxed">
                  Barcha shifokorlarning ish kunlari, dam olish vaqtlari, bemorlar navbatlari va klinika bandligini kalendar ko'rinishida kuzatish.
                </p>
                <Link
                  to="/schedule"
                  className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border hover:bg-surface-2 transition-colors"
                >
                  Jadvalga o'tish <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Finance Management */}
              {isChief && (
                <div className="flex flex-col p-5 rounded-2xl border border-border bg-surface-2/20 hover:border-teal-500/25 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                      <DollarSign className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="text-sm font-bold text-fg">Moliya & Kassa Hisobi</h3>
                  </div>
                  <p className="text-xs text-fg-3 mt-3 flex-1 leading-relaxed">
                    Klinikaning umumiy oylik/kunlik tushumlari, bajarilgan muolajalar tahlili va moliyaviy hisobotlar tahlilini kuzatish sahifasi.
                  </p>
                  <Link
                    to="/finance"
                    className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border hover:bg-surface-2 transition-colors"
                  >
                    Moliyaga o'tish <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Ratings */}
              <div className="flex flex-col p-5 rounded-2xl border border-border bg-surface-2/20 hover:border-teal-500/25 transition-all">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                    <Trophy className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-fg">Fikrlar & Reyting</h3>
                </div>
                <p className="text-xs text-fg-3 mt-3 flex-1 leading-relaxed">
                  Bemorlar tomonidan shifokorlar ishiga berilgan baholar va davolash sifatini tahlil qilish tizimi.
                </p>
                <Link
                  to="/ratings"
                  className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border hover:bg-surface-2 transition-colors"
                >
                  Reytinglarga o'tish <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: RESTOCK MATERIAL ────────────────────────────── */}
      <RestockModal
        open={restockingMaterial !== null}
        material={restockingMaterial}
        onClose={() => {
          setRestockingMaterial(null);
          inventoryQ.refetch();
          lowStockQ.refetch();
        }}
      />

      {/* ── MODAL: CREATE MATERIAL ─────────────────────────────── */}
      <CreateMaterialModal
        open={isCreatingMaterial}
        onClose={() => {
          setIsCreatingMaterial(false);
          inventoryQ.refetch();
          lowStockQ.refetch();
        }}
      />
    </section>
  );
}

// ── Restock Modal Component ──────────────────────────────────────────────────

interface RestockModalProps {
  open: boolean;
  material: Material | null;
  onClose: () => void;
}

function RestockModal({ open, material, onClose }: RestockModalProps): JSX.Element {
  const restockMutation = useRestockMaterial(material?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema),
    defaultValues: { amount: "", note: "" },
    values: { amount: "", note: "" },
  });

  const submitting = restockMutation.isPending;

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!material) return;
    try {
      await restockMutation.mutateAsync({
        amount: values.amount,
        note: values.note?.trim() || undefined,
      });
      toast.success("Zaxira muvaffaqiyatli to'ldirildi", material.name);
      closeAndReset();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "To'ldirishda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : closeAndReset}
      title={material ? `Zaxirani to'ldirish: ${material.name}` : "Zaxirani to'ldirish"}
      description="Qabul qilingan yangi material miqdori va kelish sababini (ixtiyoriy) kiriting."
      footer={
        <>
          <Button variant="outline" onClick={closeAndReset} disabled={submitting}>
            Bekor qilish
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "To'ldirilmoqda..." : "Zaxirani yangilash"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="restock-amount">
            Miqdor ({material ? UNIT_LABELS[material.unit] : ""}) *
          </Label>
          <Input id="restock-amount" inputMode="decimal" autoFocus {...register("amount")} invalid={Boolean(errors.amount)} />
          {errors.amount && <p className="field-error">{errors.amount.message}</p>}
        </div>

        <div>
          <Label htmlFor="restock-note">Izoh / Hujjat raqami</Label>
          <Input id="restock-note" placeholder="Masalan: F-213 schyot-faktura yoki yetkazib beruvchi nomi" {...register("note")} invalid={Boolean(errors.note)} />
          {errors.note && <p className="field-error">{errors.note.message}</p>}
        </div>
      </form>
    </Modal>
  );
}

// ── Create Material Modal Component ──────────────────────────────────────────

interface CreateMaterialModalProps {
  open: boolean;
  onClose: () => void;
}

function CreateMaterialModal({ open, onClose }: CreateMaterialModalProps): JSX.Element {
  const createMutation = useCreateMaterial();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      unit: "piece",
      quantityInStock: "0",
      minimumThreshold: "5",
      unitCost: "",
      notes: "",
    },
  });

  const submitting = createMutation.isPending;

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync({
        name: values.name.trim(),
        unit: values.unit,
        quantityInStock: values.quantityInStock,
        minimumThreshold: values.minimumThreshold,
        unitCost: values.unitCost === "" ? null : values.unitCost,
        notes: values.notes?.trim() || "",
      });
      toast.success("Yangi material omborga qo'shildi", values.name);
      closeAndReset();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Material qo'shishda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : closeAndReset}
      title="Yangi material qo'shish"
      description="Omborxona uchun yangi stomatologik material, dori yoki asbob kiriting."
      footer={
        <>
          <Button variant="outline" onClick={closeAndReset} disabled={submitting}>
            Bekor qilish
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Qo'shilmoqda..." : "Materialni saqlash"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="material-name">Nomi *</Label>
          <Input id="material-name" autoFocus {...register("name")} invalid={Boolean(errors.name)} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="material-unit">Birligi *</Label>
            <select id="material-unit" {...register("unit")} className="select-field">
              <option value="piece">Dona</option>
              <option value="gram">Gramm</option>
              <option value="ml">Millilitr</option>
            </select>
          </div>

          <div>
            <Label htmlFor="material-cost">Birlik narxi (UZS)</Label>
            <Input id="material-cost" inputMode="decimal" placeholder="Masalan: 150000" {...register("unitCost")} invalid={Boolean(errors.unitCost)} />
            {errors.unitCost && <p className="field-error">{errors.unitCost.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="material-qty">Boshlang'ich zaxira *</Label>
            <Input id="material-qty" inputMode="decimal" {...register("quantityInStock")} invalid={Boolean(errors.quantityInStock)} />
            {errors.quantityInStock && <p className="field-error">{errors.quantityInStock.message}</p>}
          </div>

          <div>
            <Label htmlFor="material-threshold">Minimal chegara *</Label>
            <Input id="material-threshold" inputMode="decimal" {...register("minimumThreshold")} invalid={Boolean(errors.minimumThreshold)} />
            {errors.minimumThreshold && <p className="field-error">{errors.minimumThreshold.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="material-notes">Izoh / Tafsilotlar</Label>
          <textarea id="material-notes" rows={2} {...register("notes")} className="textarea-field" placeholder="Katalog raqami, marka yoki saqlash shartlari..." />
        </div>
      </form>
    </Modal>
  );
}
