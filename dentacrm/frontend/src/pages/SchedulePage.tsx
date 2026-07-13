import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppointments } from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { APPOINTMENT_STATUS_LABELS } from "@/api/appointments";
import type { AppointmentRecord } from "@/api/appointments";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 64; // px per hour
const START_HOUR  = 8;
const END_HOUR    = 20;

const STATUS_COLORS: Record<string, string> = {
  scheduled:   "border-brand-500  bg-brand-500/10  text-brand-700  dark:text-brand-300",
  in_progress: "border-warning    bg-warning/10    text-warning",
  completed:   "border-success    bg-success/10    text-success",
  cancelled:   "border-fg-3       bg-surface-2     text-fg-3",
  no_show:     "border-danger     bg-danger-bg     text-danger",
};

export function SchedulePage(): JSX.Element {
  const navigate = useNavigate();
  const [dateStr,  setDateStr]  = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [doctorId, setDoctorId] = useState<string>("");

  const doctors      = useDoctors({ pageSize: 100 });
  const appointments = useAppointments({
    doctor:   doctorId || undefined,
    dateFrom: dateStr,
    dateTo:   dateStr,
    pageSize: 100,
  });

  const items = useMemo(() => appointments.data?.results ?? [], [appointments.data]);

  return (
    <section aria-labelledby="schedule-title" className="max-w-6xl space-y-6">
      <PageHeader
        title="Jadval"
        description="Kunlik ko'rinish. Bo'sh vaqtga bosib yangi navbat qo'shishingiz mumkin."
        actions={
          <Button onClick={() => navigate("/appointments/new")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Yangi navbat
          </Button>
        }
      />

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-end gap-4">
        <div className="min-w-[160px]">
          <Label htmlFor="schedule-date">Sana</Label>
          <Input
            id="schedule-date"
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Label htmlFor="schedule-doctor">Shifokor</Label>
          <select
            id="schedule-doctor"
            className="select-field"
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

      {/* Calendar */}
      {appointments.isLoading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" aria-hidden="true" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Navbatlar yo'q"
          description="Tanlangan sana uchun hech qanday navbat yo'q. Yangi navbat qo'shing."
          icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
          action={
            <Button size="sm" onClick={() => navigate("/appointments/new")}>
              <Plus className="h-4 w-4" />
              Navbat qo'shish
            </Button>
          }
        />
      ) : (
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

function ScheduleCalendar({ date, items, onSelectSlot }: ScheduleCalendarProps): JSX.Element {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const now       = new Date();
  const isToday   = format(now, "yyyy-MM-dd") === date;
  const nowMinutes = isToday ? (now.getHours() - START_HOUR) * 60 + now.getMinutes() : null;

  const positioned = items.map((appt) => {
    const start = new Date(appt.scheduledStart);
    const end   = new Date(appt.scheduledEnd);
    const startMinutes   = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const durationMinutes = Math.max(15, (end.getTime() - start.getTime()) / 60_000);
    return { appt, startMinutes, durationMinutes };
  });

  return (
    <div
      role="grid"
      aria-label="Kunlik jadval"
      className="card overflow-hidden"
    >
      {/* Header bar */}
      <div className="border-b border-border bg-surface-2/60 px-4 py-3">
        <p className="text-[13px] font-semibold text-fg">
          {new Date(date + "T00:00:00").toLocaleDateString("uz-UZ", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      <div className="relative flex overflow-y-auto" style={{ maxHeight: 600 }}>
        {/* Hour labels */}
        <div className="w-16 shrink-0 border-r border-border bg-surface-2/40">
          {hours.map((h) => (
            <div
              key={h}
              className="relative flex items-start justify-end border-b border-border-2 pr-3 pt-1"
              style={{ height: HOUR_HEIGHT }}
            >
              <span className="text-[11px] font-medium text-fg-3 leading-none">
                {String(h).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Slots + events */}
        <div className="relative flex-1">
          {hours.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => onSelectSlot(h, 0)}
              className="block w-full border-b border-border-2 text-left transition-colors duration-100 hover:bg-brand-600/4"
              style={{ height: HOUR_HEIGHT }}
              aria-label={`Yangi navbat: ${h}:00`}
            />
          ))}

          {/* Appointment blocks */}
          {positioned.map(({ appt, startMinutes, durationMinutes }) => {
            if (startMinutes < 0 || startMinutes >= hours.length * 60) return null;
            const top    = (startMinutes / 60) * HOUR_HEIGHT;
            const height = Math.max(28, (durationMinutes / 60) * HOUR_HEIGHT - 2);
            const patientName = appt.patient
              ? `${appt.patient.firstName} ${appt.patient.lastName}`
              : appt.patientId.slice(0, 8);
            const colorClass = STATUS_COLORS[appt.status] ?? STATUS_COLORS.scheduled;
            return (
              <div
                key={appt.id}
                className={cn(
                  "absolute left-1 right-1 overflow-hidden rounded-lg border px-2 py-1 text-xs shadow-sm",
                  "transition-transform duration-100 hover:scale-[1.01] cursor-pointer",
                  colorClass,
                )}
                style={{ top, height }}
              >
                <p className="font-semibold truncate leading-tight">{patientName}</p>
                <p className="opacity-75 truncate">
                  {APPOINTMENT_STATUS_LABELS[appt.status]}
                </p>
              </div>
            );
          })}

          {/* Now indicator */}
          {nowMinutes !== null && nowMinutes >= 0 && nowMinutes <= hours.length * 60 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 border-t-2 border-danger"
              style={{ top: (nowMinutes / 60) * HOUR_HEIGHT }}
            >
              <span className="absolute -left-1 -top-[5px] h-2.5 w-2.5 rounded-full bg-danger" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
