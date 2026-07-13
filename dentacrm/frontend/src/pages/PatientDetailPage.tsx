import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarPlus, CreditCard, User, MapPin, Phone } from "lucide-react";

import { usePatient } from "@/hooks/usePatients";
import {
  getPatientHistory,
  getPatientOdontogram,
  type PatientHistoryEvent,
  type PatientOdontogramTooth,
} from "@/api/patients";
import { usePatientBalance } from "@/hooks/usePayments";
import { Odontogram } from "@/components/odontogram/Odontogram";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type TabKey = "timeline" | "odontogram" | "payments" | "photos";

const TABS: { key: TabKey; label: string }[] = [
  { key: "timeline",   label: "Tarix"      },
  { key: "odontogram", label: "Odontogram" },
  { key: "payments",   label: "To'lovlar"  },
  { key: "photos",     label: "Rasmlar"    },
];

export function PatientDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const patient = usePatient(id);
  const [tab, setTab] = useState<TabKey>("timeline");

  const history = useQuery<PatientHistoryEvent[]>({
    queryKey: ["patients", id, "history"],
    queryFn:  () => getPatientHistory(id as string),
    enabled:  Boolean(id) && tab === "timeline",
  });

  const odontogram = useQuery<PatientOdontogramTooth[]>({
    queryKey: ["patients", id, "odontogram"],
    queryFn:  () => getPatientOdontogram(id as string),
    enabled:  Boolean(id) && tab === "odontogram",
  });

  const balance = usePatientBalance(id);

  if (!id) return <EmptyState title="Bemor topilmadi" description="ID ko'rsatilmagan yoki noto'g'ri." />;
  if (patient.isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
  if (!patient.data) return <EmptyState title="Bemor topilmadi" description="Bunday ID bilan bemor mavjud emas." />;

  const p = patient.data;

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-6xl page-enter">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
            style={{ background: "linear-gradient(135deg,#6d28d9,#a78bfa)", boxShadow: "0 0 20px rgba(109,40,217,0.35)" }}
          >
            {p.firstName?.[0]}{p.lastName?.[0]}
          </div>
          <div>
            <h1 id="page-title" className="text-2xl font-bold text-fg">{p.firstName} {p.lastName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-fg-3">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{p.phoneNumber}</span>
              {p.address && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.address}</span>}
              <span className={`badge ${p.gender === "male" ? "badge-blue" : p.gender === "female" ? "badge-violet" : "badge-muted"}`}>
                {p.gender === "male" ? "Erkak" : p.gender === "female" ? "Ayol" : "Noma'lum"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/payments/new?patientId=${p.id}`}>
            <Button variant="secondary"><CreditCard className="h-4 w-4" />To'lov qo'shish</Button>
          </Link>
          <Link to={`/appointments/new?patientId=${p.id}`}>
            <Button><CalendarPlus className="h-4 w-4" />Yangi navbat</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Sidebar info ── */}
        <aside className="card p-5 lg:col-span-1 space-y-4">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fg-3">
            <User className="h-3.5 w-3.5" />
            Ma'lumot
          </h2>
          <dl className="space-y-3 text-sm">
            <InfoRow label="Ism"       value={p.firstName} />
            <InfoRow label="Familiya"  value={p.lastName} />
            <InfoRow label="Telefon"   value={p.phoneNumber} />
            <InfoRow label="Jinsi"     value={p.gender === "male" ? "Erkak" : p.gender === "female" ? "Ayol" : "—"} />
            <InfoRow label="Manzil"    value={p.address || "—"} />
            <InfoRow label="Eslatmalar" value={p.notes || "—"} />
            {balance.data && (
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between">
                  <dt className="text-fg-3">Qarzdorlik</dt>
                  <dd className={`font-semibold ${Number(balance.data.balance) > 0 ? "text-danger" : "text-success"}`}>
                    {balance.data.balance} so'm
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </aside>

        {/* ── Tabs ── */}
        <div className="lg:col-span-2">
          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Bemor bo'limlari"
            className="mb-5 flex gap-1 rounded-2xl border border-border bg-surface-2 p-1"
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 select-none",
                  tab === t.key
                    ? "bg-surface text-fg shadow-sm border border-border"
                    : "text-fg-3 hover:text-fg",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel">
            {tab === "timeline"   && <TimelineView events={history.data ?? []} loading={history.isLoading} />}
            {tab === "odontogram" && <OdontogramView teeth={odontogram.data ?? []} loading={odontogram.isLoading} />}
            {tab === "payments"   && <PaymentsView balance={balance.data ?? null} loading={balance.isLoading} />}
            {tab === "photos"     && (
              <EmptyState
                title="Rasmlar tez orada"
                description="Davolash rasmlari galereyasi keyingi versiyada qo'shiladi."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-fg-3">{label}</dt>
      <dd className="text-right font-medium text-fg">{value}</dd>
    </div>
  );
}

function TimelineView({ events, loading }: { events: PatientHistoryEvent[]; loading: boolean }): JSX.Element {
  if (loading) return <Skeleton className="h-64 rounded-2xl" />;
  if (events.length === 0) return (
    <EmptyState title="Tarix bo'sh" description="Ushbu bemor uchun hali hech qanday hodisa yozilmagan." />
  );
  return (
    <ol className="relative border-l border-border pl-6 space-y-5">
      {events.map((event) => (
        <li key={event.id}>
          <span
            className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500"
            style={{ boxShadow: "0 0 0 3px hsl(var(--color-surface))" }}
          />
          <p className="text-sm font-semibold text-fg">{event.title}</p>
          <p className="text-xs text-fg-3 mt-0.5">
            {format(new Date(event.occurredAt), "yyyy-MM-dd HH:mm")} — {event.type}
          </p>
          {event.summary && <p className="mt-1 text-sm text-fg-2">{event.summary}</p>}
        </li>
      ))}
    </ol>
  );
}

function OdontogramView({ teeth, loading }: { teeth: PatientOdontogramTooth[]; loading: boolean }): JSX.Element {
  if (loading) return <Skeleton className="h-64 rounded-2xl" />;
  return <Odontogram teeth={teeth} />;
}

function PaymentsView({
  balance,
  loading,
}: {
  balance: { balance: string; totalBilled: string; totalPaid: string } | null;
  loading: boolean;
}): JSX.Element {
  if (loading) return <Skeleton className="h-32 rounded-2xl" />;
  if (!balance) return (
    <EmptyState title="Balans mavjud emas" description="Bu bemor uchun to'lov tarixida ma'lumot yo'q." />
  );
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Jami hisoblangan" value={`${balance.totalBilled} so'm`} tone="blue" />
      <StatCard label="To'langan"        value={`${balance.totalPaid} so'm`}   tone="green" />
      <StatCard label="Qarzdorlik"       value={`${balance.balance} so'm`}     tone="red" />
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "blue"|"green"|"red" }): JSX.Element {
  const styles = {
    blue:  "border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400",
    green: "border-success/20 bg-success/5 text-success",
    red:   "border-danger/20 bg-danger/5 text-danger",
  };
  return (
    <div className={`card p-4 border ${styles[tone]}`}>
      <p className="text-[11px] uppercase tracking-wider font-semibold opacity-70">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}
