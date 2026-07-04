import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import {
  useAvailableSlots,
  useCreateAppointment,
} from "@/hooks/useAppointments";
import { useDoctors } from "@/hooks/useDoctors";
import { useDepartments } from "@/hooks/useDepartments";
import { usePatients } from "@/hooks/usePatients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Input } from "@/components/ui/Input";

const appointmentSchema = z.object({
  patientId: z.string().uuid({ message: "Bemor tanlanishi shart." }),
  doctorId: z.string().uuid({ message: "Shifokor tanlanishi shart." }),
  departmentId: z.string().uuid({ message: "Bo'lim tanlanishi shart." }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, {
    message: "Sana YYYY-MM-DD formatida bo'lishi kerak.",
  }),
  slot: z.string().min(1, { message: "Vaqt tanlanishi shart." }),
  notes: z.string().max(500).optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export function NewAppointmentPage(): JSX.Element {
  const navigate = useNavigate();

  const [patientSearch, setPatientSearch] = useState<string>("");
  const debouncedSearch = useDebouncedValue(patientSearch, 300);
  const patients = usePatients({
    search: debouncedSearch || undefined,
    pageSize: 20,
  });

  const doctors = useDoctors({ pageSize: 100 });
  const departments = useDepartments({ pageSize: 100 });

  const create = useCreateAppointment();

  const today = format(new Date(), "yyyy-MM-dd");

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      departmentId: "",
      date: today,
      slot: "",
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const selectedDoctorId = watch("doctorId");
  const selectedDate = watch("date");
  const slots = useAvailableSlots(
    selectedDoctorId || undefined,
    selectedDate || undefined,
  );

  // Auto-select the doctor's first department when a doctor is picked.
  useEffect(() => {
    if (!selectedDoctorId) return;
    const doctor = doctors.data?.results.find((d) => d.id === selectedDoctorId);
    if (doctor && doctor.departments.length > 0) {
      setValue("departmentId", doctor.departments[0].id, {
        shouldValidate: true,
      });
    }
  }, [selectedDoctorId, doctors.data, setValue]);

  const slotOptions = useMemo(() => slots.data ?? [], [slots.data]);

  async function onSubmit(values: AppointmentFormValues) {
    // slot value carries "<startISO>|<endISO>"
    const [start, end] = values.slot.split("|");
    if (!start || !end) {
      toast.error("Vaqtni qayta tanlang.", "Xatolik");
      return;
    }
    try {
      const appointment = await create.mutateAsync({
        patientId: values.patientId,
        doctorId: values.doctorId,
        departmentId: values.departmentId,
        scheduledStart: start,
        scheduledEnd: end,
        notes: values.notes ?? "",
      });
      toast.success("Navbat yaratildi.");
      navigate(`/patients/${appointment.patientId}`);
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Navbatni saqlab bo'lmadi");
    }
  }

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1
          id="page-title"
          className="text-2xl font-semibold text-slate-900"
        >
          Yangi navbat
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Bemor, shifokor va bo'sh slotni tanlab navbat berish.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        aria-label="Navbat formasi"
      >
        <div>
          <Label htmlFor="patientSearch">Bemorni izlash</Label>
          <Input
            id="patientSearch"
            placeholder="Ism yoki telefon raqami bo'yicha qidirish"
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="patientId">Bemor *</Label>
          <select
            id="patientId"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            {...register("patientId")}
          >
            <option value="">— Bemorni tanlang —</option>
            {patients.data?.results.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {p.phoneNumber}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.patientId.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="doctorId">Shifokor *</Label>
            <select
              id="doctorId"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              {...register("doctorId")}
            >
              <option value="">— Shifokorni tanlang —</option>
              {doctors.data?.results.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user?.firstName} {d.user?.lastName} — {d.specialization}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.doctorId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="departmentId">Bo'lim *</Label>
            <select
              id="departmentId"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              {...register("departmentId")}
            >
              <option value="">— Bo'limni tanlang —</option>
              {departments.data?.results.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.departmentId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="date">Sana *</Label>
            <Input
              id="date"
              type="date"
              invalid={!!errors.date}
              {...register("date")}
            />
            {errors.date && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="slot">Bo'sh vaqt *</Label>
            <select
              id="slot"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              disabled={!selectedDoctorId || slots.isLoading}
              {...register("slot")}
            >
              <option value="">
                {selectedDoctorId
                  ? slots.isLoading
                    ? "Yuklanmoqda..."
                    : slotOptions.length === 0
                      ? "Bo'sh slot topilmadi"
                      : "— Vaqtni tanlang —"
                  : "— Avval shifokorni tanlang —"}
              </option>
              {slotOptions.map((s) => {
                const start = new Date(s.start);
                const end = new Date(s.end);
                const label = `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
                return (
                  <option key={s.start} value={`${s.start}|${s.end}`}>
                    {label}
                  </option>
                );
              })}
            </select>
            {errors.slot && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.slot.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Izoh</Label>
          <textarea
            id="notes"
            rows={2}
            placeholder="Sabab, kutgan davolash, va h.k."
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            {...register("notes")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Bekor qilish
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saqlanmoqda..." : "Navbatni saqlash"}
          </Button>
        </div>
      </form>
    </section>
  );
}
