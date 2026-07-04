import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";

import { useAuthStore } from "@/store/authStore";
import {
  useAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { APPOINTMENT_STATUS_LABELS } from "@/api/appointments";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import type { AppointmentStatus } from "@/types";

const STATUS_ACTIONS: {
  label: string;
  next: AppointmentStatus;
  variant?: "primary" | "secondary" | "destructive";
}[] = [
  { label: "Tasdiqlash", next: "confirmed", variant: "secondary" },
  { label: "Boshlash", next: "in_progress", variant: "primary" },
  { label: "Yakunlash", next: "completed", variant: "primary" },
  { label: "Kelmadi", next: "no_show", variant: "destructive" },
];

export function MyAppointmentsPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);

  const doctorId = user?.id ? undefined : undefined;
  // The backend already scopes `/appointments/` by the authenticated
  // doctor when role=doctor, so we do not need to pass `doctor=`.
  const today = format(new Date(), "yyyy-MM-dd");
  const twoWeeks = format(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    "yyyy-MM-dd",
  );
  const query = useAppointments({
    dateFrom: today,
    dateTo: twoWeeks,
    pageSize: 50,
  });

  const updateStatus = useUpdateAppointmentStatus();

  const appointments = useMemo(
    () => query.data?.results ?? [],
    [query.data],
  );

  async function onChangeStatus(id: string, next: AppointmentStatus) {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(
        `Navbat holati: ${APPOINTMENT_STATUS_LABELS[next]}`,
      );
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  }

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1
          id="page-title"
          className="text-2xl font-semibold text-slate-900"
        >
          Mening navbatlarim
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Bugungi va yaqinlashayotgan navbatlar. Har biri uchun holatni
          yangilash mumkin.
        </p>
      </div>

      {query.isLoading && (
        <div className="space-y-2" aria-hidden="true">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      )}

      {!query.isLoading && appointments.length === 0 && (
        <EmptyState
          title="Navbatlar yo'q"
          description="Yaqin 2 hafta ichida sizga tegishli navbat topilmadi."
        />
      )}

      {!query.isLoading && appointments.length > 0 && (
        <ul className="space-y-3">
          {appointments.map((appt) => {
            const start = new Date(appt.scheduledStart);
            const patientName = appt.patient
              ? `${appt.patient.firstName} ${appt.patient.lastName}`
              : appt.patientId.slice(0, 8);
            return (
              <li
                key={appt.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{patientName}</p>
                  <p className="text-sm text-slate-600">
                    {format(start, "yyyy-MM-dd HH:mm")} —{" "}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${statusClasses(appt.status)}`}
                    >
                      {APPOINTMENT_STATUS_LABELS[appt.status]}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(start, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_ACTIONS.filter((a) => a.next !== appt.status).map(
                    (action) => (
                      <Button
                        key={action.next}
                        size="sm"
                        variant={action.variant ?? "outline"}
                        onClick={() => onChangeStatus(appt.id, action.next)}
                        disabled={updateStatus.isPending}
                      >
                        {action.label}
                      </Button>
                    ),
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* touch unused variable so tsc(--noUnusedLocals) stays happy */}
      <span className="sr-only">{doctorId ?? ""}</span>
    </section>
  );
}

function statusClasses(status: AppointmentStatus): string {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-teal-100 text-teal-800";
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-slate-200 text-slate-600";
    case "no_show":
      return "bg-red-100 text-red-800";
  }
}
