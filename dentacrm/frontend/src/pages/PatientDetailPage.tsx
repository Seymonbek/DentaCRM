import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

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

type TabKey = "timeline" | "odontogram" | "payments" | "photos";

export function PatientDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const patient = usePatient(id);
  const [tab, setTab] = useState<TabKey>("timeline");

  const history = useQuery<PatientHistoryEvent[]>({
    queryKey: ["patients", id, "history"],
    queryFn: () => getPatientHistory(id as string),
    enabled: Boolean(id) && tab === "timeline",
  });

  const odontogram = useQuery<PatientOdontogramTooth[]>({
    queryKey: ["patients", id, "odontogram"],
    queryFn: () => getPatientOdontogram(id as string),
    enabled: Boolean(id) && tab === "odontogram",
  });

  const balance = usePatientBalance(id);

  if (!id) {
    return (
      <EmptyState
        title="Bemor topilmadi"
        description="ID ko'rsatilmagan yoki noto'g'ri."
      />
    );
  }

  if (patient.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!patient.data) {
    return (
      <EmptyState
        title="Bemor topilmadi"
        description="Bunday ID bilan bemor mavjud emas."
      />
    );
  }

  const p = patient.data;

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1
            id="page-title"
            className="text-2xl font-semibold text-slate-900"
          >
            {p.firstName} {p.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {p.phoneNumber}
            {p.address ? ` — ${p.address}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/payments/new?patientId=${p.id}`}>
            <Button variant="secondary">To'lov qo'shish</Button>
          </Link>
          <Link to={`/appointments/new?patientId=${p.id}`}>
            <Button>Yangi navbat</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Ma'lumot
          </h2>
          <dl className="space-y-2 text-sm">
            <InfoRow label="Ism" value={p.firstName} />
            <InfoRow label="Familiya" value={p.lastName} />
            <InfoRow label="Telefon" value={p.phoneNumber} />
            <InfoRow
              label="Jinsi"
              value={
                p.gender === "male"
                  ? "Erkak"
                  : p.gender === "female"
                    ? "Ayol"
                    : "—"
              }
            />
            <InfoRow label="Manzil" value={p.address || "—"} />
            <InfoRow label="Eslatmalar" value={p.notes || "—"} />
            {balance.data && (
              <InfoRow
                label="Qarzdorlik"
                value={`${balance.data.balance} so'm`}
              />
            )}
          </dl>
        </aside>

        <div className="lg:col-span-2">
          <div
            role="tablist"
            aria-label="Bemor bo'limlari"
            className="mb-4 flex gap-2 border-b border-slate-200"
          >
            <TabButton current={tab} value="timeline" setTab={setTab}>
              Tarix
            </TabButton>
            <TabButton current={tab} value="odontogram" setTab={setTab}>
              Odontogram
            </TabButton>
            <TabButton current={tab} value="payments" setTab={setTab}>
              To'lovlar
            </TabButton>
            <TabButton current={tab} value="photos" setTab={setTab}>
              Rasmlar
            </TabButton>
          </div>

          <div role="tabpanel">
            {tab === "timeline" && (
              <TimelineView
                events={history.data ?? []}
                loading={history.isLoading}
              />
            )}
            {tab === "odontogram" && (
              <OdontogramView
                teeth={odontogram.data ?? []}
                loading={odontogram.isLoading}
              />
            )}
            {tab === "payments" && (
              <PaymentsView
                balance={balance.data ?? null}
                loading={balance.isLoading}
              />
            )}
            {tab === "photos" && (
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

// ---------------------------------------------------------------------------
// Helper subcomponents
// ---------------------------------------------------------------------------
function InfoRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-900">{value}</dd>
    </div>
  );
}

function TabButton({
  current,
  value,
  setTab,
  children,
}: {
  current: TabKey;
  value: TabKey;
  setTab: (v: TabKey) => void;
  children: React.ReactNode;
}): JSX.Element {
  const active = current === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => setTab(value)}
      className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand-600 text-brand-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function TimelineView({
  events,
  loading,
}: {
  events: PatientHistoryEvent[];
  loading: boolean;
}): JSX.Element {
  if (loading) return <Skeleton className="h-64" />;
  if (events.length === 0) {
    return (
      <EmptyState
        title="Tarix bo'sh"
        description="Ushbu bemor uchun hali hech qanday hodisa yozilmagan."
      />
    );
  }
  return (
    <ol className="relative border-l border-slate-200 pl-6">
      {events.map((event) => (
        <li key={event.id} className="mb-6 last:mb-0">
          <span className="absolute -left-2 h-4 w-4 rounded-full border-2 border-white bg-brand-500" />
          <p className="text-sm font-semibold text-slate-900">{event.title}</p>
          <p className="text-xs text-slate-500">
            {format(new Date(event.occurredAt), "yyyy-MM-dd HH:mm")} —{" "}
            {event.type}
          </p>
          {event.summary && (
            <p className="mt-1 text-sm text-slate-700">{event.summary}</p>
          )}
        </li>
      ))}
    </ol>
  );
}

function OdontogramView({
  teeth,
  loading,
}: {
  teeth: PatientOdontogramTooth[];
  loading: boolean;
}): JSX.Element {
  if (loading) return <Skeleton className="h-64" />;
  return <Odontogram teeth={teeth} />;
}

function PaymentsView({
  balance,
  loading,
}: {
  balance: { balance: string; totalBilled: string; totalPaid: string } | null;
  loading: boolean;
}): JSX.Element {
  if (loading) return <Skeleton className="h-32" />;
  if (!balance) {
    return (
      <EmptyState
        title="Balans mavjud emas"
        description="Bu bemor uchun to'lov tarixida ma'lumot yo'q."
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Jami hisoblangan" value={`${balance.totalBilled} so'm`} />
      <StatCard label="To'langan" value={`${balance.totalPaid} so'm`} />
      <StatCard label="Qarzdorlik" value={`${balance.balance} so'm`} accent />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}): JSX.Element {
  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        accent
          ? "border-brand-300 bg-brand-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          accent ? "text-brand-800" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
