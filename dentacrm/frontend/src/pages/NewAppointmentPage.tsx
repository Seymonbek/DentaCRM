import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, Clock, User, Stethoscope, Building2, FileText, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
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
import type { AvailableSlot } from "@/api/appointments";

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

  // ── Safely normalise slots — backend may return array, paginated obj, or undefined ──
  const slotOptions: AvailableSlot[] = useMemo(() => {
    const raw = slots.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    // Paginated shape: { results: [...] }
    if (typeof raw === "object" && "results" in raw && Array.isArray((raw as { results: unknown[] }).results)) {
      return (raw as { results: AvailableSlot[] }).results;
    }
    return [];
  }, [slots.data]);

  async function onSubmit(values: AppointmentFormValues) {
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
    <section aria-labelledby="page-title" className="mx-auto max-w-2xl page-enter">
      <PageHeader
        title="Yangi navbat"
        description="Bemor, shifokor va bo'sh slotni tanlab navbat bering."
        icon={<CalendarDays className="h-5 w-5" />}
        actions={
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card p-6 space-y-6"
        aria-label="Navbat formasi"
        noValidate
      >

        {/* ── Patient search ─────────────────────────────────────── */}
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fg-3 mb-3">
            <User className="h-3.5 w-3.5" />
            Bemor ma'lumotlari
          </legend>

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
              className="select-field"
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
              <p role="alert" className="field-error">
                {errors.patientId.message}
              </p>
            )}
          </div>
        </fieldset>

        <hr className="section-divider" />

        {/* ── Doctor & Department ───────────────────────────────── */}
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fg-3 mb-3">
            <Stethoscope className="h-3.5 w-3.5" />
            Shifokor va bo'lim
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="doctorId">Shifokor *</Label>
              <select
                id="doctorId"
                className="select-field"
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
                <p role="alert" className="field-error">
                  {errors.doctorId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="departmentId">
                <Building2 className="inline h-3.5 w-3.5 mr-1" />
                Bo'lim *
              </Label>
              <select
                id="departmentId"
                className="select-field"
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
                <p role="alert" className="field-error">
                  {errors.departmentId.message}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <hr className="section-divider" />

        {/* ── Date & Slot ───────────────────────────────────────── */}
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fg-3 mb-3">
            <Clock className="h-3.5 w-3.5" />
            Vaqt va slot
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Sana *</Label>
              <Input
                id="date"
                type="date"
                invalid={!!errors.date}
                min={today}
                {...register("date")}
              />
              {errors.date && (
                <p role="alert" className="field-error">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="slot">Bo'sh vaqt *</Label>
              <select
                id="slot"
                className="select-field"
                disabled={!selectedDoctorId || slots.isLoading}
                {...register("slot")}
              >
                <option value="">
                  {!selectedDoctorId
                    ? "— Avval shifokorni tanlang —"
                    : slots.isLoading
                      ? "Yuklanmoqda..."
                      : slotOptions.length === 0
                        ? "Bo'sh slot topilmadi"
                        : "— Vaqtni tanlang —"}
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
                <p role="alert" className="field-error">
                  {errors.slot.message}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <hr className="section-divider" />

        {/* ── Notes ─────────────────────────────────────────────── */}
        <div>
          <Label htmlFor="notes">
            <FileText className="inline h-3.5 w-3.5 mr-1" />
            Izoh
          </Label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Sabab, kutilgan davolash, va hokazo..."
            className="textarea-field"
            {...register("notes")}
          />
        </div>

        {/* ── Actions ───────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Saqlanmoqda..." : "Navbatni saqlash"}
          </Button>
        </div>
      </form>
    </section>
  );
}
