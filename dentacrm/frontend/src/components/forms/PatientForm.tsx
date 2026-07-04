import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useCreatePatient, useUpdatePatient } from "@/hooks/usePatients";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import type { PatientInput, PatientRecord } from "@/api/patients";

const patientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "Ism kamida 2 belgi bo'lishi kerak." })
    .max(100),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Familiya kamida 2 belgi bo'lishi kerak." })
    .max(100),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, {
      message: "Telefon raqami xalqaro formatda (+998901234567).",
    }),
  gender: z.enum(["male", "female"]).nullable().optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  initial?: PatientRecord;
  onSuccess?: (patient: PatientRecord) => void;
  submitLabel?: string;
}

export function PatientForm({
  initial,
  onSuccess,
  submitLabel = "Saqlash",
}: PatientFormProps): JSX.Element {
  const navigate = useNavigate();
  const create = useCreatePatient();
  const update = useUpdatePatient(initial?.id ?? "");
  const isEditing = Boolean(initial);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      phoneNumber: initial?.phoneNumber ?? "",
      gender: initial?.gender ?? null,
      address: initial?.address ?? "",
      notes: initial?.notes ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: PatientFormValues) {
    const payload: PatientInput = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      gender: values.gender ?? null,
      address: values.address ?? "",
      notes: values.notes ?? "",
    };
    try {
      const patient = isEditing
        ? await update.mutateAsync(payload)
        : await create.mutateAsync(payload);
      toast.success(
        isEditing ? "Bemor yangilandi" : "Bemor qo'shildi",
      );
      if (onSuccess) {
        onSuccess(patient);
      } else {
        navigate(`/patients/${patient.id}`);
      }
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="Bemor formasi"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName">Ism *</Label>
          <Input
            id="firstName"
            invalid={!!errors.firstName}
            placeholder="Bemor ismi"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Familiya *</Label>
          <Input
            id="lastName"
            invalid={!!errors.lastName}
            placeholder="Bemor familiyasi"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phoneNumber">Telefon raqami *</Label>
          <Input
            id="phoneNumber"
            invalid={!!errors.phoneNumber}
            placeholder="+998901234567"
            autoComplete="tel"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="gender">Jinsi</Label>
          <select
            id="gender"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            {...register("gender", {
              setValueAs: (v) => (v === "" ? null : v),
            })}
          >
            <option value="">— Ko'rsatilmagan —</option>
            <option value="male">Erkak</option>
            <option value="female">Ayol</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Manzil</Label>
        <Input
          id="address"
          placeholder="Shahar, ko'cha, uy raqami"
          {...register("address")}
        />
      </div>

      <div>
        <Label htmlFor="notes">Tibbiy izohlar</Label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Allergiya, surunkali kasalliklar, muhim eslatmalar"
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
          {isSubmitting ? "Saqlanmoqda..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
