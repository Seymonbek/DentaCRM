import { ArrowLeft, Banknote, CreditCard, Receipt, User, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import { PAYMENT_METHOD_OPTIONS } from "@/api/payments";
import type { PaymentMethod } from "@/types";
import { useCreatePayment, usePatientBalance } from "@/hooks/usePayments";
import { useTreatments } from "@/hooks/useTreatments";
import { cn } from "@/lib/utils";

const METHOD_ICONS: Record<string, typeof CreditCard> = {
  cash:          Banknote,
  card:          CreditCard,
  payme:         CreditCard,
  click:         CreditCard,
  bank_transfer: Receipt,
};

const paymentSchema = z.object({
  treatmentId: z.string().uuid({ message: "Davolash tanlanishi shart." }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/u, { message: "Miqdor musbat son bo'lishi kerak (masalan 250000)." })
    .refine((v) => Number(v) > 0, { message: "Miqdor 0 dan katta bo'lishi kerak." }),
  method: z.enum(["cash", "card", "payme", "click", "bank_transfer"]),
  note: z.string().max(255).optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function NewPaymentPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTreatmentId = searchParams.get("treatmentId") ?? "";

  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(initialTreatmentId);
  const [selectedMethod, setSelectedMethod] = useState<string>("cash");

  const treatments    = useTreatments({ paymentStatus: undefined, pageSize: 50 });
  const treatmentList = treatments.data?.results ?? [];

  const selectedTreatment = useMemo(
    () => treatmentList.find((t) => t.id === selectedTreatmentId) ?? null,
    [treatmentList, selectedTreatmentId],
  );
  const balance = usePatientBalance(selectedTreatment?.patientId ?? undefined);
  const create  = useCreatePayment();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<PaymentFormValues>({
      resolver: zodResolver(paymentSchema),
      defaultValues: { treatmentId: initialTreatmentId, amount: "", method: "cash", note: "" },
    });

  function onTreatmentChange(id: string) {
    setSelectedTreatmentId(id);
    setValue("treatmentId", id, { shouldValidate: true });
  }

  function onMethodSelect(val: string) {
    setSelectedMethod(val);
    setValue("method", val as PaymentFormValues["method"], { shouldValidate: true });
  }

  async function onSubmit(values: PaymentFormValues) {
    try {
      const payment = await create.mutateAsync({
        treatmentId: values.treatmentId,
        amount:      values.amount,
        method:      values.method as PaymentMethod,
        note:        values.note ?? "",
      });
      toast.success("To'lov qabul qilindi.");
      navigate(`/patients/${payment.patientId}`);
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "To'lovni saqlab bo'lmadi");
    }
  }

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-2xl page-enter">
      <PageHeader
        title="To'lov qabul qilish"
        description="Davolash yozuvini tanlab, bemor to'lovini kiriting."
        icon={<Receipt className="h-5 w-5" />}
        actions={
          <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6" noValidate>

        {/* Treatment select */}
        <fieldset className="space-y-3">
          <legend className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fg-3">
            <FileText className="h-3.5 w-3.5" />
            Davolash yozuvi
          </legend>
          <div>
            <Label htmlFor="treatmentId">Davolash *</Label>
            <select
              id="treatmentId"
              className="select-field"
              value={selectedTreatmentId}
              onChange={(e) => onTreatmentChange(e.target.value)}
            >
              <option value="">— Davolashni tanlang —</option>
              {treatments.isLoading
                ? <option disabled>Yuklanmoqda...</option>
                : treatmentList.map((t) => {
                    const patientName = t.patient
                      ? `${t.patient.firstName} ${t.patient.lastName}`
                      : t.patientId.slice(0, 8);
                    return (
                      <option key={t.id} value={t.id}>
                        {patientName} — {t.diagnosis || "Davolash"} ({t.price} so'm)
                      </option>
                    );
                  })
              }
            </select>
            {errors.treatmentId && (
              <p role="alert" className="field-error">{errors.treatmentId.message}</p>
            )}
          </div>

          {/* Balance info */}
          {balance.isLoading && selectedTreatmentId && (
            <div className="card p-4"><Skeleton className="h-4 w-48" /></div>
          )}
          {balance.data && (
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-semibold text-fg-2">Bemor balansi</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Hisoblangan", value: `${balance.data.totalBilled} so'm` },
                  { label: "To'langan",   value: `${balance.data.totalPaid} so'm`,  className: "text-success" },
                  { label: "Qarzdorlik",  value: `${balance.data.balance} so'm`,    className: "text-danger font-bold" },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <p className="text-[10px] text-fg-3">{item.label}</p>
                    <p className={cn("text-[13px] font-semibold text-fg", item.className)}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </fieldset>

        <hr className="section-divider" />

        {/* Method selector — visual pill buttons */}
        <fieldset className="space-y-3">
          <legend className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-fg-3">
            <CreditCard className="h-3.5 w-3.5" />
            To'lov usuli *
          </legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {PAYMENT_METHOD_OPTIONS.map((opt) => {
              const Icon = METHOD_ICONS[opt.value] ?? CreditCard;
              const active = selectedMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onMethodSelect(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border p-3",
                    "text-xs font-medium transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                    active
                      ? "border-brand-500/40 bg-brand-500/8 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "border-border bg-surface-2 text-fg-3 hover:border-brand-400/30 hover:text-fg-2",
                  )}
                  aria-pressed={active}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="leading-tight text-center">{opt.label}</span>
                </button>
              );
            })}
          </div>
          {/* Hidden register for RHF */}
          <input type="hidden" {...register("method")} value={selectedMethod} />
        </fieldset>

        <hr className="section-divider" />

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Miqdor (so'm) *</Label>
          <div className="relative">
            <Banknote className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" />
            <Input
              id="amount"
              inputMode="decimal"
              invalid={!!errors.amount}
              placeholder="250 000"
              className="pl-9"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p role="alert" className="field-error">{errors.amount.message}</p>
          )}
        </div>

        {/* Note */}
        <div>
          <Label htmlFor="note">Izoh</Label>
          <textarea
            id="note"
            rows={2}
            placeholder="Ixtiyoriy — chegirma, chek raqami, va h.k."
            className="textarea-field"
            {...register("note")}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Bekor qilish
          </Button>
          <Button type="submit" size="md" disabled={isSubmitting || !selectedTreatmentId} aria-busy={isSubmitting}>
            {isSubmitting ? "Saqlanmoqda..." : "To'lovni saqlash"}
          </Button>
        </div>
      </form>
    </section>
  );
}
