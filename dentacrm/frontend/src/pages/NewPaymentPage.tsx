import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import { PAYMENT_METHOD_OPTIONS } from "@/api/payments";
import type { PaymentMethod } from "@/types";
import {
  useCreatePayment,
  usePatientBalance,
} from "@/hooks/usePayments";
import { useTreatments } from "@/hooks/useTreatments";

const paymentSchema = z.object({
  treatmentId: z.string().uuid({
    message: "Davolash tanlanishi shart.",
  }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/u, {
      message: "Miqdor musbat son bo'lishi kerak (masalan 250000.00).",
    })
    .refine((v) => Number(v) > 0, {
      message: "Miqdor 0 dan katta bo'lishi kerak.",
    }),
  method: z.enum(["cash", "card", "payme", "click", "bank_transfer"]),
  note: z.string().max(255).optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function NewPaymentPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTreatmentId = searchParams.get("treatmentId") ?? "";

  const [selectedTreatmentId, setSelectedTreatmentId] =
    useState<string>(initialTreatmentId);

  const treatments = useTreatments({
    paymentStatus: undefined,
    pageSize: 50,
  });
  const treatmentList = treatments.data?.results ?? [];

  const selectedTreatment = useMemo(
    () => treatmentList.find((t) => t.id === selectedTreatmentId) ?? null,
    [treatmentList, selectedTreatmentId],
  );
  const patientId = selectedTreatment?.patientId ?? undefined;
  const balance = usePatientBalance(patientId);

  const create = useCreatePayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      treatmentId: initialTreatmentId,
      amount: "",
      method: "cash",
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  function onTreatmentChange(id: string) {
    setSelectedTreatmentId(id);
    setValue("treatmentId", id, { shouldValidate: true });
  }

  async function onSubmit(values: PaymentFormValues) {
    try {
      const payment = await create.mutateAsync({
        treatmentId: values.treatmentId,
        amount: values.amount,
        method: values.method as PaymentMethod,
        note: values.note ?? "",
      });
      toast.success("To'lov qabul qilindi.");
      navigate(`/patients/${payment.patientId}`);
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "To'lovni saqlab bo'lmadi");
    }
  }

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1
          id="page-title"
          className="text-2xl font-semibold text-slate-900"
        >
          To'lov qabul qilish
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Davolash yozuvini tanlab, bemor to'lovini kiriting.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        aria-label="To'lov formasi"
      >
        <div>
          <Label htmlFor="treatmentId">Davolash *</Label>
          <select
            id="treatmentId"
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            value={selectedTreatmentId}
            onChange={(e) => onTreatmentChange(e.target.value)}
          >
            <option value="">— Davolashni tanlang —</option>
            {treatments.isLoading ? (
              <option disabled>Yuklanmoqda...</option>
            ) : (
              treatmentList.map((t) => {
                const patientName = t.patient
                  ? `${t.patient.firstName} ${t.patient.lastName}`
                  : t.patientId.slice(0, 8);
                const label = `${patientName} — ${t.diagnosis || "Davolash"} (${t.price} so'm, ${t.paymentStatus})`;
                return (
                  <option key={t.id} value={t.id}>
                    {label}
                  </option>
                );
              })
            )}
          </select>
          {errors.treatmentId && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.treatmentId.message}
            </p>
          )}
        </div>

        {balance.data && (
          <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              Bemorning umumiy qarzdorligi:{" "}
              <strong>{balance.data.balance} so'm</strong>{" "}
              (Jami hisoblangan: {balance.data.totalBilled}, To'langan:{" "}
              {balance.data.totalPaid})
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="amount">Miqdor (so'm) *</Label>
            <Input
              id="amount"
              inputMode="decimal"
              invalid={!!errors.amount}
              placeholder="250000"
              {...register("amount")}
            />
            {errors.amount && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="method">To'lov usuli *</Label>
            <select
              id="method"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              {...register("method")}
            >
              {PAYMENT_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="note">Izoh</Label>
          <textarea
            id="note"
            rows={2}
            placeholder="Ixtiyoriy — cheklar, chegirmalar, va h.k."
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            {...register("note")}
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
          <Button type="submit" disabled={isSubmitting || !selectedTreatmentId}>
            {isSubmitting ? "Saqlanmoqda..." : "To'lovni saqlash"}
          </Button>
        </div>
      </form>
    </section>
  );
}
