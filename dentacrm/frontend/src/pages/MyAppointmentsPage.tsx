import { useMemo } from "react";
import { format, formatDistanceToNow, isFuture } from "date-fns";
import { uz } from "date-fns/locale";
import { CalendarDays, CheckCircle2, Clock, User, XCircle, AlertCircle, PlayCircle, CheckCheck } from "lucide-react";

import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { APPOINTMENT_STATUS_LABELS } from "@/api/appointments";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types";

const STATUS_ACTIONS: {
  label: string;
  next: AppointmentStatus;
  variant?: "primary" | "secondary" | "destructive";
  icon: typeof CheckCircle2;
}[] = [
  { label: "Tasdiqlash", next: "confirmed",   variant: "secondary",    icon: CheckCircle2 },
  { label: "Boshlash",   next: "in_progress", variant: "primary",      icon: PlayCircle   },
  { label: "Yakunlash",  next: "completed",   variant: "primary",      icon: CheckCheck   },
  { label: "Kelmadi",    next: "no_show",     variant: "destructive",  icon: XCircle      },
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; badge: string; icon: typeof Clock }> = {
  scheduled:   { label: "Rejalashtirilgan", badge: "badge-blue",   icon: Clock         },
  confirmed:   { label: "Tasdiqlangan",     badge: "badge-violet", icon: CheckCircle2  },
  in_progress: { label: "Bajarilmoqda",     badge: "badge-amber",  icon: PlayCircle    },
  completed:   { label: "Yakunlangan",      badge: "badge-green",  icon: CheckCheck    },
  cancelled:   { label: "Bekor qilingan",   badge: "badge-muted",  icon: XCircle       },
  no_show:     { label: "Kelmadi",          badge: "badge-danger", icon: AlertCircle   },
};

export function MyAppointmentsPage(): JSX.Element {
  const today    = format(new Date(), "yyyy-MM-dd");
  const twoWeeks = format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");

  // Role=doctor — backend scopes by auth user automatically
  const query = useAppointments({ dateFrom: today, dateTo: twoWeeks, pageSize: 50 });
  const updateStatus = useUpdateAppointmentStatus();

  const appointments = useMemo(() => query.data?.results ?? [], [query.data]);

  async function onChangeStatus(id: string, next: AppointmentStatus) {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(`Navbat holati: ${APPOINTMENT_STATUS_LABELS[next]}`);
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  }

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-4xl page-enter">
      <PageHeader
        title="Mening navbatlarim"
        description="Bugungi va yaqinlashayotgan navbatlar — holatni real vaqtda yangilang."
        icon={<CalendarDays className="h-5 w-5" />}
      />

      {/* Loading */}
      {query.isLoading && (
        <div className="space-y-3" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className="skeleton h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-3 w-32" />
              </div>
              <div className="skeleton h-8 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!query.isLoading && appointments.length === 0 && (
        <EmptyState
          title="Navbatlar yo'q"
          description="Yaqin 2 hafta ichida sizga tegishli navbat topilmadi."
          icon={<CalendarDays className="h-6 w-6" />}
        />
      )}

      {/* List */}
      {!query.isLoading && appointments.length > 0 && (
        <ul className="space-y-3">
          {appointments.map((appt, index) => {
            const start = new Date(appt.scheduledStart);
            const end   = new Date(appt.scheduledEnd);
            const patientName = appt.patient
              ? `${appt.patient.firstName} ${appt.patient.lastName}`
              : `Bemor #${appt.patientId.slice(0, 6)}`;
            const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.scheduled;
            const StatusIcon = cfg.icon;
            const isUpcoming = isFuture(start);
            const isActive   = appt.status === "in_progress";

            return (
              <li
                key={appt.id}
                className={cn(
                  "card p-5 transition-all duration-200",
                  "animate-in",
                  isActive && "border-amber-400/30 bg-amber-500/3",
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left — info */}
                  <div className="flex items-start gap-4">
                    {/* Time badge */}
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-center",
                      isActive
                        ? "bg-amber-500/15 border border-amber-400/25 text-amber-600 dark:text-amber-400"
                        : "bg-surface-2 border border-border text-fg-2",
                    )}>
                      <span className="text-[13px] font-bold leading-none">{format(start, "HH:mm")}</span>
                      <span className="text-[9px] text-fg-3 mt-0.5">{format(start, "dd.MM")}</span>
                    </div>

                    <div>
                      {/* Patient */}
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-fg-3" aria-hidden="true" />
                        <p className="text-[14px] font-semibold text-fg">{patientName}</p>
                      </div>

                      {/* Time range */}
                      <p className="mt-1 text-xs text-fg-3">
                        {format(start, "HH:mm")} → {format(end, "HH:mm")}
                        {" · "}
                        <span className={isUpcoming ? "text-brand-500" : "text-fg-3"}>
                          {formatDistanceToNow(start, { addSuffix: true, locale: uz })}
                        </span>
                      </p>

                      {/* Status */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <StatusIcon className="h-3 w-3" aria-hidden="true" />
                        <span className={cn("badge", cfg.badge)}>{cfg.label}</span>
                      </div>

                      {/* Notes */}
                      {appt.notes && (
                        <p className="mt-2 text-xs text-fg-3 italic max-w-xs line-clamp-1">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right — actions */}
                  {appt.status !== "completed" && appt.status !== "cancelled" && (
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end sm:gap-1.5">
                      {STATUS_ACTIONS.filter((a) => a.next !== appt.status && (
                        // Only show logical next steps
                        appt.status === "scheduled"   ? ["confirmed", "no_show"].includes(a.next) :
                        appt.status === "confirmed"   ? ["in_progress", "no_show"].includes(a.next) :
                        appt.status === "in_progress" ? ["completed"].includes(a.next) :
                        false
                      )).map((action) => (
                        <Button
                          key={action.next}
                          size="sm"
                          variant={action.variant ?? "secondary"}
                          onClick={() => onChangeStatus(appt.id, action.next)}
                          disabled={updateStatus.isPending}
                        >
                          <action.icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
