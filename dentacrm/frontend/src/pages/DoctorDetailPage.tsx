import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CalendarOff,
  Clock,
  Plus,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";

import { normaliseApiError } from "@/api/client";
import { WEEKDAY_LABELS, type DoctorWorkingHour } from "@/api/doctors";
import { getDoctorCommissionsSummary } from "@/api/payments";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  useAvailableSlots,
  useCreateTimeOff,
  useCreateWorkingHour,
  useDeleteTimeOff,
  useDeleteWorkingHour,
  useDoctor,
  useTimeOff,
  useWorkingHours,
} from "@/hooks/useDoctors";
import { toast } from "@/store/notificationStore";
import { useQuery } from "@tanstack/react-query";

const workingHoursSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM formatida kiriting"),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM formatida kiriting"),
  })
  .refine((v) => v.startTime < v.endTime, {
    path: ["endTime"],
    message: "Tugash vaqti boshlanish vaqtidan keyin bo'lsin",
  });

type WorkingHourValues = z.infer<typeof workingHoursSchema>;

const timeOffSchema = z
  .object({
    dateStart: z.string().min(1, "Sana kerak"),
    dateEnd: z.string().min(1, "Sana kerak"),
    reason: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .refine((v) => v.dateStart <= v.dateEnd, {
    path: ["dateEnd"],
    message: "Oxirgi sana boshlanish sanasidan keyin bo'lsin",
  });

type TimeOffValues = z.infer<typeof timeOffSchema>;

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function last30DaysRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  const iso = (d: Date): string => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

export function DoctorDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const doctorId = id ?? "";

  const doctorQ = useDoctor(doctorId);

  if (!doctorId) {
    return (
      <section className="mx-auto max-w-3xl">
        <EmptyState
          title="Shifokor topilmadi"
          description="URL noto'g'ri yoki shifokor mavjud emas."
          icon={<AlertTriangle className="h-10 w-10" aria-hidden="true" />}
          action={
            <Link
              to="/doctors"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              ← Shifokorlar ro'yxatiga qaytish
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="doctor-detail-title" className="max-w-6xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            to="/doctors"
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Shifokorlar
          </Link>
          {doctorQ.isLoading ? (
            <>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="mt-2 h-4 w-40" />
            </>
          ) : doctorQ.data ? (
            <>
              <h1
                id="doctor-detail-title"
                className="flex items-center gap-3 text-2xl font-semibold text-slate-900"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </span>
                {doctorQ.data.user?.firstName} {doctorQ.data.user?.lastName}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {doctorQ.data.specialization || "Mutaxassislik ko'rsatilmagan"}
              </p>
            </>
          ) : (
            <p className="text-sm text-rose-600">
              Shifokor topilmadi yoki yuklashda xatolik yuz berdi.
            </p>
          )}
        </div>
      </header>

      {doctorQ.data ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileCard doctor={doctorQ.data} />
            <CommissionsSummaryCard doctorId={doctorId} />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <WorkingHoursCard doctorId={doctorId} />
            <TimeOffCard doctorId={doctorId} />
            <AvailableSlotsCard doctorId={doctorId} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Profile / commissions cards
// ---------------------------------------------------------------------------
function ProfileCard({
  doctor,
}: {
  doctor: NonNullable<ReturnType<typeof useDoctor>["data"]>;
}): JSX.Element {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Profil
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        <Row label="Telefon" value={doctor.user?.phoneNumber ?? "—"} />
        <Row
          label="Rol"
          value={doctor.user?.role === "bosh_shifokor" ? "Bosh shifokor" : "Shifokor"}
        />
        <Row
          label="Bo'limlar"
          value={
            doctor.departments.length
              ? doctor.departments.map((d) => d.name).join(", ")
              : "—"
          }
        />
        <Row
          label="Komissiya"
          value={`${doctor.defaultCommissionRate ?? "0"}% (${
            doctor.commissionBasis === "from_net" ? "sof daromaddan" : "umumiy summadan"
          })`}
        />
        <Row
          label="Holati"
          value={
            <span
              className={
                doctor.isActive
                  ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                  : "inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
              }
            >
              {doctor.isActive ? "Faol" : "Faol emas"}
            </span>
          }
        />
        {doctor.bio ? (
          <Row label="Bio" value={<span className="whitespace-pre-line">{doctor.bio}</span>} />
        ) : null}
      </dl>
    </article>
  );
}

function CommissionsSummaryCard({ doctorId }: { doctorId: string }): JSX.Element {
  const { from, to } = useMemo(() => last30DaysRange(), []);
  const q = useQuery({
    queryKey: ["doctor", doctorId, "commissions-summary", from, to],
    queryFn: () => getDoctorCommissionsSummary(doctorId, { from, to }),
    staleTime: 60_000,
  });

  return (
    <article className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Komissiya (so'nggi 30 kun)
      </h2>
      {q.isLoading ? (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : q.data ? (
        <div className="mt-3">
          <p className="text-3xl font-semibold text-slate-900">
            {Number(q.data.totalAmount).toLocaleString("uz-UZ")} so'm
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {q.data.count} ta muolaja • {from} → {to}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Ma'lumot yuklanmadi.</p>
      )}
    </article>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="col-span-2 text-slate-800">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Working hours
// ---------------------------------------------------------------------------
function WorkingHoursCard({ doctorId }: { doctorId: string }): JSX.Element {
  const workingHoursQ = useWorkingHours(doctorId);
  const createMut = useCreateWorkingHour(doctorId);
  const deleteMut = useDeleteWorkingHour(doctorId);
  const [pendingDelete, setPendingDelete] = useState<DoctorWorkingHour | null>(
    null,
  );

  const form = useForm<WorkingHourValues>({
    resolver: zodResolver(workingHoursSchema),
    defaultValues: {
      weekday: 0,
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createMut.mutateAsync({
        weekday: values.weekday,
        startTime: values.startTime,
        endTime: values.endTime,
      });
      toast.success("Ish soati qo'shildi.");
      form.reset({ weekday: values.weekday, startTime: "09:00", endTime: "18:00" });
    } catch (err) {
      toast.error(normaliseApiError(err).error.message, "Xatolik");
    }
  });

  const grouped = useMemo(() => {
    const buckets: Record<number, DoctorWorkingHour[]> = {};
    (workingHoursQ.data ?? []).forEach((wh) => {
      (buckets[wh.weekday] ??= []).push(wh);
    });
    return buckets;
  }, [workingHoursQ.data]);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Clock className="h-5 w-5 text-brand-600" aria-hidden="true" />
            Ish jadvali
          </h2>
          <p className="text-xs text-slate-500">
            Har hafta takrorlanadigan ish soatlari.
          </p>
        </div>
      </header>

      {workingHoursQ.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (workingHoursQ.data ?? []).length === 0 ? (
        <p className="text-sm text-slate-500">
          Hozircha ish jadvali kiritilmagan. Quyidagi forma orqali qo'shing.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {WEEKDAY_LABELS.map((label, weekday) => {
            const rows = grouped[weekday] ?? [];
            if (rows.length === 0) return null;
            return (
              <li key={weekday} className="flex items-start gap-3 py-2">
                <div className="w-24 text-sm font-medium text-slate-700">
                  {label}
                </div>
                <div className="flex flex-1 flex-wrap gap-2">
                  {rows.map((wh) => (
                    <span
                      key={wh.id}
                      className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {wh.startTime.slice(0, 5)} – {wh.endTime.slice(0, 5)}
                      <button
                        type="button"
                        onClick={() => setPendingDelete(wh)}
                        aria-label="O'chirish"
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4"
      >
        <div>
          <Label htmlFor="wh-weekday">Kun</Label>
          <select
            id="wh-weekday"
            {...form.register("weekday")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            {WEEKDAY_LABELS.map((label, i) => (
              <option key={i} value={i}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="wh-start">Boshlanish</Label>
          <Input
            id="wh-start"
            type="time"
            {...form.register("startTime")}
            invalid={Boolean(form.formState.errors.startTime)}
          />
          {form.formState.errors.startTime ? (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.startTime.message}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="wh-end">Tugash</Label>
          <Input
            id="wh-end"
            type="time"
            {...form.register("endTime")}
            invalid={Boolean(form.formState.errors.endTime)}
          />
          {form.formState.errors.endTime ? (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.endTime.message}
            </p>
          ) : null}
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            size="md"
            disabled={createMut.isPending}
            className="w-full"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {createMut.isPending ? "Qo'shilmoqda…" : "Qo'shish"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Ish soatini o'chirasizmi?"
        description={
          pendingDelete
            ? `${WEEKDAY_LABELS[pendingDelete.weekday]} • ${pendingDelete.startTime.slice(0, 5)} – ${pendingDelete.endTime.slice(0, 5)}`
            : ""
        }
        confirmLabel="O'chirish"
        cancelLabel="Bekor qilish"
        destructive
        loading={deleteMut.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await deleteMut.mutateAsync(pendingDelete.id);
            toast.success("Ish soati o'chirildi.");
          } catch (err) {
            toast.error(normaliseApiError(err).error.message, "Xatolik");
          } finally {
            setPendingDelete(null);
          }
        }}
      />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Time off
// ---------------------------------------------------------------------------
function TimeOffCard({ doctorId }: { doctorId: string }): JSX.Element {
  const timeOffQ = useTimeOff(doctorId);
  const createMut = useCreateTimeOff(doctorId);
  const deleteMut = useDeleteTimeOff(doctorId);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const form = useForm<TimeOffValues>({
    resolver: zodResolver(timeOffSchema),
    defaultValues: {
      dateStart: todayIso(),
      dateEnd: todayIso(),
      reason: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createMut.mutateAsync({
        dateStart: values.dateStart,
        dateEnd: values.dateEnd,
        reason: values.reason?.trim() || "",
      });
      toast.success("Dam olish qo'shildi.");
      form.reset({
        dateStart: todayIso(),
        dateEnd: todayIso(),
        reason: "",
      });
    } catch (err) {
      toast.error(normaliseApiError(err).error.message, "Xatolik");
    }
  });

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <CalendarOff className="h-5 w-5 text-amber-600" aria-hidden="true" />
          Dam olish kunlari
        </h2>
        <p className="text-xs text-slate-500">
          Shifokor ushbu oralig'da yangi navbat qabul qilmaydi.
        </p>
      </header>

      {timeOffQ.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (timeOffQ.data ?? []).length === 0 ? (
        <p className="text-sm text-slate-500">Hozircha dam olish belgilanmagan.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {(timeOffQ.data ?? []).map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-3 py-2 text-sm"
            >
              <div>
                <div className="font-medium text-slate-800">
                  {entry.dateStart} → {entry.dateEnd}
                </div>
                <div className="text-xs text-slate-500">
                  {entry.reason || "Sabab ko'rsatilmagan"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingDelete(entry.id)}
                aria-label="O'chirish"
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4"
      >
        <div>
          <Label htmlFor="to-start">Boshlanish</Label>
          <Input
            id="to-start"
            type="date"
            {...form.register("dateStart")}
            invalid={Boolean(form.formState.errors.dateStart)}
          />
        </div>
        <div>
          <Label htmlFor="to-end">Tugash</Label>
          <Input
            id="to-end"
            type="date"
            {...form.register("dateEnd")}
            invalid={Boolean(form.formState.errors.dateEnd)}
          />
          {form.formState.errors.dateEnd ? (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.dateEnd.message}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="to-reason">Sabab</Label>
          <Input
            id="to-reason"
            placeholder="Ta'til, kasallik…"
            {...form.register("reason")}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            variant="secondary"
            disabled={createMut.isPending}
            className="w-full"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {createMut.isPending ? "Qo'shilmoqda…" : "Qo'shish"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Dam olishni bekor qilasizmi?"
        confirmLabel="O'chirish"
        cancelLabel="Bekor"
        destructive
        loading={deleteMut.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await deleteMut.mutateAsync(pendingDelete);
            toast.success("Dam olish o'chirildi.");
          } catch (err) {
            toast.error(normaliseApiError(err).error.message, "Xatolik");
          } finally {
            setPendingDelete(null);
          }
        }}
      />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Available slots preview (today by default)
// ---------------------------------------------------------------------------
function AvailableSlotsCard({ doctorId }: { doctorId: string }): JSX.Element {
  const [date, setDate] = useState<string>(todayIso());
  const slotsQ = useAvailableSlots(doctorId, date);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <CalendarClock className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            Bo'sh slotlar
          </h2>
          <p className="text-xs text-slate-500">
            30 daqiqalik intervallar bilan bo'sh vaqtlar.
          </p>
        </div>
        <div>
          <Label htmlFor="slots-date" className="sr-only">
            Sana
          </Label>
          <Input
            id="slots-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-40"
          />
        </div>
      </header>

      {slotsQ.isLoading ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (slotsQ.data?.slots ?? []).length === 0 ? (
        <p className="text-sm text-slate-500">
          Ushbu kunda bo'sh slot yo'q yoki ish jadvali kiritilmagan.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slotsQ.data!.slots.map((s, idx) => (
            <span
              key={`${s.start}-${idx}`}
              className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
            >
              {s.start.slice(0, 5)} – {s.end.slice(0, 5)}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
