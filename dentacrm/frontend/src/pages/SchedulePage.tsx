import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useAppointments } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { APPOINTMENT_STATUS_LABELS } from "@/api/appointments";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { AppointmentRecord } from "@/api/appointments";

const HOUR_HEIGHT = 60; // pixels per hour
const START_HOUR = 8;
const END_HOUR = 20;

export function SchedulePage(): JSX.Element {
  const navigate = useNavigate();
  const [dateStr, setDateStr] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [doctorId, setDoctorId] = useState<string>("");

  const doctors = useDoctors({ pageSize: 100 });
  const appointments = useAppointments({
    doctor: doctorId || undefined,
    dateFrom: dateStr,
    dateTo: dateStr,
    pageSize: 100,
  });

  const items = useMemo(
    () => appointments.data?.results ?? [],
    [appointments.data],
  );

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            id="page-title"
            className="text-2xl font-semibold text-slate-900"
          >
            Jadval
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Kunlik ko'rinish. Bo'sh vaqtga bosib navbat qo'shishingiz mumkin.
          </p>
        </div>
        <Button onClick={() => navigate("/appointments/new")}>
          Yangi navbat
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="date">Sana</Label>
          <Input
            id="date"
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="doctor">Shifokor</Label>
          <select
            id="doctor"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">Barcha shifokorlar</option>
            {doctors.data?.results.map((d) => (
              <option key={d.id} value={d.id}>
                {d.user?.firstName} {d.user?.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {appointments.isLoading && (
        <div className="space-y-2" aria-hidden="true">
          <Skeleton className="h-96" />
        </div>
      )}

      {!appointments.isLoading && items.length === 0 && (
        <EmptyState
          title="Navbatlar yo'q"
          description="Tanlangan sana uchun hech qanday navbat yo'q. Yangi navbat qo'shing."
        />
      )}

      {!appointments.isLoading && items.length > 0 && (
        <ScheduleCalendar
          date={dateStr}
          items={items}
          onSelectSlot={(hour, minute) => {
            const params = new URLSearchParams({
              date: dateStr,
              hour: String(hour),
              minute: String(minute),
              ...(doctorId ? { doctor: doctorId } : {}),
            });
            navigate(`/appointments/new?${params.toString()}`);
          }}
        />
      )}
    </section>
  );
}

interface ScheduleCalendarProps {
  date: string;
  items: AppointmentRecord[];
  onSelectSlot: (hour: number, minute: number) => void;
}

function ScheduleCalendar({
  date,
  items,
  onSelectSlot,
}: ScheduleCalendarProps): JSX.Element {
  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i,
  );

  const now = new Date();
  const isToday = format(now, "yyyy-MM-dd") === date;
  const nowMinutes = isToday
    ? (now.getHours() - START_HOUR) * 60 + now.getMinutes()
    : null;

  const positioned = items.map((appt) => {
    const start = new Date(appt.scheduledStart);
    const end = new Date(appt.scheduledEnd);
    const startMinutes =
      (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const durationMinutes = Math.max(
      15,
      (end.getTime() - start.getTime()) / 60_000,
    );
    return { appt, startMinutes, durationMinutes };
  });

  return (
    <div
      role="grid"
      aria-label="Kunlik jadval"
      className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative flex">
        <div className="w-16 flex-shrink-0 border-r border-slate-200">
          {hours.map((h) => (
            <div
              key={h}
              className="border-b border-slate-100 px-2 py-1 text-xs text-slate-500"
              style={{ height: HOUR_HEIGHT }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        <div className="relative flex-1">
          {hours.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => onSelectSlot(h, 0)}
              className="block w-full border-b border-slate-100 text-left hover:bg-brand-50"
              style={{ height: HOUR_HEIGHT }}
            >
              <span className="sr-only">Yangi navbat: {h}:00</span>
            </button>
          ))}

          {positioned.map(({ appt, startMinutes, durationMinutes }) => {
            if (startMinutes < 0 || startMinutes >= hours.length * 60) {
              return null;
            }
            const top = (startMinutes / 60) * HOUR_HEIGHT;
            const height = (durationMinutes / 60) * HOUR_HEIGHT;
            const patientName = appt.patient
              ? `${appt.patient.firstName} ${appt.patient.lastName}`
              : appt.patientId.slice(0, 8);
            return (
              <div
                key={appt.id}
                className="absolute left-1 right-1 rounded-md border border-brand-600 bg-brand-100 px-2 py-1 text-xs text-brand-900 shadow-sm"
                style={{ top, height }}
              >
                <p className="font-semibold">{patientName}</p>
                <p className="opacity-80">
                  {APPOINTMENT_STATUS_LABELS[appt.status]}
                </p>
              </div>
            );
          })}

          {nowMinutes !== null &&
            nowMinutes >= 0 &&
            nowMinutes <= hours.length * 60 && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 border-t-2 border-red-500"
                style={{ top: (nowMinutes / 60) * HOUR_HEIGHT }}
              >
                <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
