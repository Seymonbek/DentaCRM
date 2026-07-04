import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BadgeDollarSign,
  Filter,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import type { DoctorRecord } from "@/api/doctors";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHOD_OPTIONS } from "@/api/payments";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDoctors } from "@/hooks/useDoctors";
import {
  useDoctorCommissionsSummary,
  usePayments,
} from "@/hooks/usePayments";
import { cn } from "@/lib/utils";
import type {
  CommissionSummary,
  Payment,
  PaymentMethod,
} from "@/types";

const PAGE_SIZE = 15;

/**
 * FinancePage — bosh_shifokor's finance dashboard.
 *
 * Combines three already-shipped backend endpoints:
 *
 *   * ``GET /api/v1/payments/``                       — paginated payments
 *   * ``GET /api/v1/doctors/``                        — doctor list
 *   * ``GET /api/v1/doctors/{id}/commissions/summary/`` — per-doctor totals
 *
 * The month range is derived on the client (start-of-month → now) and
 * fed into the summary endpoint so the reader sees a consistent
 * "current-month" view of both revenue (payments) and doctor
 * commissions. Payments themselves are unfiltered by default so admin
 * can page through the full receipts book.
 */

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
const AMOUNT_FORMATTER = new Intl.NumberFormat("uz-UZ", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatSum(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined || raw === "") return "0";
  const n = typeof raw === "number" ? raw : Number(raw);
  if (Number.isNaN(n)) return String(raw);
  return AMOUNT_FORMATTER.format(Math.round(n));
}

function safeDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd.MM.yyyy HH:mm");
  } catch {
    return iso;
  }
}

function monthRange(): { from: string; to: string; label: string } {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    from: format(first, "yyyy-MM-dd"),
    to: format(now, "yyyy-MM-dd"),
    label: format(now, "MMMM yyyy"),
  };
}

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------
interface KpiProps {
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "danger";
  loading?: boolean;
  icon: typeof Users;
}

const TONE_STYLES: Record<
  NonNullable<KpiProps["tone"]>,
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
  tone = "primary",
  loading,
  icon: Icon,
}: KpiProps): JSX.Element {
  const styles = TONE_STYLES[tone];
  return (
    <article className="card p-5" aria-busy={loading || undefined}>
      <div className="mb-3 flex items-start justify-between gap-3">
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
      {loading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
      )}
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Doctor commissions row (a light selector — fetches on demand)
// ---------------------------------------------------------------------------
function DoctorCommissionRow({
  doctor,
  from,
  to,
}: {
  doctor: DoctorRecord;
  from: string;
  to: string;
}): JSX.Element {
  const q = useDoctorCommissionsSummary(doctor.id, { from, to });
  const summary: CommissionSummary | undefined = q.data;
  return (
    <tr className="border-b border-slate-100 last:border-none">
      <td className="px-4 py-3">
        <Link
          to={`/doctors/${doctor.id}`}
          className="text-sm font-medium text-foreground hover:text-brand-600 dark:hover:text-brand-300"
        >
          {doctor.user?.firstName} {doctor.user?.lastName}
        </Link>
        <p className="text-xs text-muted-foreground">
          {doctor.specialization || "—"}
        </p>
      </td>
      <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-200">
        {q.isLoading ? <Skeleton className="ml-auto h-4 w-14" /> : summary?.count ?? 0}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        {q.isLoading ? (
          <Skeleton className="ml-auto h-4 w-24" />
        ) : (
          <span className="font-semibold text-foreground">
            {formatSum(summary?.totalAmount ?? "0")} so'm
          </span>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export function FinancePage(): JSX.Element {
  const range = useMemo(() => monthRange(), []);
  const [page, setPage] = useState(1);
  const [method, setMethod] = useState<PaymentMethod | "">("");

  const paymentsQ = usePayments({
    page,
    pageSize: PAGE_SIZE,
    method: method || undefined,
  });

  const doctorsQ = useDoctors({ pageSize: 50 });

  // Sum of the currently loaded page — a quick "recent revenue" proxy.
  // Real month-level totals come from the reports app in Faza 4 (T19).
  const pageRevenue = useMemo(() => {
    const rows = paymentsQ.data?.results ?? [];
    return rows.reduce((acc, row) => {
      const n = Number(row.amount);
      return acc + (Number.isFinite(n) ? n : 0);
    }, 0);
  }, [paymentsQ.data]);

  const columns: DataTableColumn<Payment>[] = [
    {
      key: "createdAt",
      header: "Sana",
      cell: (row) => (
        <span className="whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
          {safeDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Miqdor",
      align: "right",
      cell: (row) => (
        <span className="whitespace-nowrap font-semibold text-foreground">
          {formatSum(row.amount)} so'm
        </span>
      ),
    },
    {
      key: "method",
      header: "Turi",
      hideBelow: "sm",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            row.method === "cash"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
              : row.method === "card"
                ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
          )}
        >
          {PAYMENT_METHOD_LABELS[row.method]}
        </span>
      ),
    },
    {
      key: "receivedBy",
      header: "Qabul qilgan",
      hideBelow: "md",
      cell: (row) =>
        row.receivedBy ? (
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {row.receivedBy.firstName} {row.receivedBy.lastName}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "note",
      header: "Izoh",
      hideBelow: "lg",
      cell: (row) =>
        row.note ? (
          <span className="line-clamp-1 text-sm text-slate-600 dark:text-slate-300">
            {row.note}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "treatmentId",
      header: "Davolash",
      align: "right",
      hideBelow: "lg",
      cell: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.treatmentId.slice(0, 8)}…
        </span>
      ),
    },
  ];

  const totalCount = paymentsQ.data?.count ?? 0;
  const doctors = doctorsQ.data?.results ?? [];

  return (
    <section aria-labelledby="finance-title" className="space-y-6">
      <PageHeader
        title="Moliya"
        description={`To'lovlar, komissiya va daromad — davr: ${range.label}.`}
      />

      {/* --- KPI cards ------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Sahifadagi tushum"
          value={`${formatSum(pageRevenue)} so'm`}
          hint={`So'nggi ${PAGE_SIZE} ta to'lov summasi`}
          tone="success"
          loading={paymentsQ.isLoading}
          icon={TrendingUp}
        />
        <KpiCard
          label="Jami to'lovlar"
          value={totalCount.toLocaleString("uz-UZ")}
          hint="Barcha vaqt bo'yicha yozuvlar soni"
          tone="primary"
          loading={paymentsQ.isLoading}
          icon={ReceiptText}
        />
        <KpiCard
          label="To'lov turlari"
          value={String(PAYMENT_METHOD_OPTIONS.length)}
          hint="Naqd, karta, Payme, Click, Bank"
          tone="warning"
          icon={BadgeDollarSign}
        />
        <KpiCard
          label="Faol shifokorlar"
          value={(doctorsQ.data?.count ?? 0).toLocaleString("uz-UZ")}
          hint="Komissiya oluvchi shifokorlar"
          tone="primary"
          loading={doctorsQ.isLoading}
          icon={Users}
        />
      </div>

      {/* --- Payments list -------------------------------------------- */}
      <article
        className="card p-0"
        aria-labelledby="finance-payments-heading"
      >
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-700">
          <div>
            <h2
              id="finance-payments-heading"
              className="text-lg font-semibold text-foreground"
            >
              To'lovlar
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Klinika kassasidagi so'nggi tushumlar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="finance-method-filter"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              Turi:
            </label>
            <select
              id="finance-method-filter"
              value={method}
              onChange={(event) => {
                setMethod(event.target.value as PaymentMethod | "");
                setPage(1);
              }}
              className="block rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Barchasi</option>
              {PAYMENT_METHOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-5">
          <DataTable<Payment>
            columns={columns}
            rows={paymentsQ.data?.results}
            rowKey={(row) => row.id}
            isLoading={paymentsQ.isLoading}
            error={paymentsQ.isError ? paymentsQ.error : undefined}
            emptyTitle="To'lovlar topilmadi"
            emptyDescription={
              method
                ? "Tanlangan to'lov turi bo'yicha yozuvlar yo'q."
                : "Klinika hali hech qanday to'lov qabul qilmagan."
            }
          />
          {paymentsQ.data ? (
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              count={paymentsQ.data.count}
              onPageChange={setPage}
              isLoading={paymentsQ.isFetching}
              className="mt-2"
            />
          ) : null}
        </div>
      </article>

      {/* --- Doctor commissions --------------------------------------- */}
      <article
        className="card p-6"
        aria-labelledby="finance-commissions-heading"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="finance-commissions-heading"
              className="text-lg font-semibold text-foreground"
            >
              Shifokor komissiyalari — {range.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hisobot {range.from} — {range.to} oraliğı bo'yicha.
            </p>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-300"
          >
            Shifokorlar →
          </Link>
        </div>

        {doctorsQ.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            title="Shifokorlar topilmadi"
            description="Avval /doctors sahifasidan shifokor qo'shing."
            icon={<AlertTriangle className="h-10 w-10" aria-hidden="true" />}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Shifokor</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Davolashlar
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Komissiya summasi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900">
                {doctors.map((doctor) => (
                  <DoctorCommissionRow
                    key={doctor.id}
                    doctor={doctor}
                    from={range.from}
                    to={range.to}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
