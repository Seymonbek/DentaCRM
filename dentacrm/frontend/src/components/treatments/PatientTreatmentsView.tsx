import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Plus,
  Edit2,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  Upload,
  User,
  Activity,
  Image as ImageIcon,
  DollarSign,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useTreatments,
  useCreateTreatment,
  useUpdateTreatment,
  useCreateToothRecord,
  useCloneOdontogram,
  useTreatmentPhotos,
  useUploadTreatmentPhoto,
} from "@/hooks/useTreatments";
import { useDoctors, useProcedureTypes } from "@/hooks/useDoctors";
import { useDepartments } from "@/hooks/useDepartments";
import {
  usePrescriptions,
  usePrescriptionTemplates,
  useIssuePrescription,
} from "@/hooks/usePrescriptions";
import { Odontogram } from "@/components/odontogram/Odontogram";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";
import type { TreatmentRecord, ToothProcedure, ToothStatus } from "@/api/treatments";

// Zod schemas
const treatmentSchema = z.object({
  doctorId: z.string().uuid({ message: "Shifokor tanlanishi shart." }),
  departmentId: z.string().uuid({ message: "Bo'lim tanlanishi shart." }),
  procedureTypeId: z.string().uuid().nullable().optional(),
  diagnosis: z.string().min(1, { message: "Tashxis kiritilishi shart." }).max(500),
  description: z.string().max(10000).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/u, {
    message: "Narx musbat son bo'lishi kerak.",
  }),
  stage: z.enum(["in_progress", "completed"]),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

const toothRecordSchema = z.object({
  toothNumber: z.coerce.number().int().min(11).max(48),
  procedure: z.enum([
    "filling",
    "root_canal",
    "extraction",
    "crown",
    "implant",
    "cleaning",
    "whitening",
  ]),
  status: z.enum(["healthy", "treated", "missing", "planned"]),
  notes: z.string().max(500).optional(),
});

type ToothRecordFormValues = z.infer<typeof toothRecordSchema>;

const prescriptionSchema = z.object({
  templateId: z.string().uuid().nullable().optional(),
  content: z.string().max(20000).optional(),
  send: z.boolean().default(true),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PatientTreatmentsViewProps {
  patientId: string;
}

export function PatientTreatmentsView({ patientId }: PatientTreatmentsViewProps): JSX.Element {
  const treatmentsQuery = useTreatments({ patient: patientId, pageSize: 100 });
  const doctorsQuery = useDoctors({ pageSize: 100 });
  const departmentsQuery = useDepartments({ pageSize: 100 });
  const procedureTypesQuery = useProcedureTypes();

  const createTreatmentMutation = useCreateTreatment();
  const updateTreatmentMutation = useUpdateTreatment();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentRecord | null>(null);
  const [expandedTreatmentId, setExpandedTreatmentId] = useState<string | null>(null);

  const treatments = useMemo(() => treatmentsQuery.data?.results ?? [], [treatmentsQuery.data]);
  const doctors = useMemo(() => doctorsQuery.data?.results ?? [], [doctorsQuery.data]);
  const departments = useMemo(() => departmentsQuery.data?.results ?? [], [departmentsQuery.data]);
  const procedureTypes = useMemo(() => procedureTypesQuery.data ?? [], [procedureTypesQuery.data]);

  // Form for New/Edit Treatment
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      doctorId: "",
      departmentId: "",
      procedureTypeId: null,
      diagnosis: "",
      description: "",
      price: "0",
      stage: "in_progress",
    },
  });

  const selectedDepartmentId = watch("departmentId");
  const selectedProcedureTypeId = watch("procedureTypeId");

  // Filter procedure types by department
  const filteredProcedureTypes = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return procedureTypes.filter((pt) => pt.department.id === selectedDepartmentId);
  }, [procedureTypes, selectedDepartmentId]);

  // Auto-set default price when procedure type is selected
  const onProcedureTypeChange = (ptId: string) => {
    setValue("procedureTypeId", ptId || null);
    if (ptId) {
      const selectedPt = procedureTypes.find((pt) => pt.id === ptId);
      if (selectedPt) {
        setValue("price", selectedPt.defaultPrice);
      }
    }
  };

  const handleOpenNewModal = () => {
    reset({
      doctorId: doctors[0]?.id ?? "",
      departmentId: departments[0]?.id ?? "",
      procedureTypeId: null,
      diagnosis: "",
      description: "",
      price: "0",
      stage: "in_progress",
    });
    setEditingTreatment(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEditModal = (treatment: TreatmentRecord) => {
    setEditingTreatment(treatment);
    reset({
      doctorId: treatment.doctorId,
      departmentId: treatment.departmentId,
      procedureTypeId: treatment.procedureTypeId,
      diagnosis: treatment.diagnosis,
      description: treatment.description,
      price: treatment.price,
      stage: treatment.stage,
    });
    setIsNewModalOpen(true);
  };

  const onSubmitTreatment = async (values: TreatmentFormValues) => {
    try {
      if (editingTreatment) {
        // Since hook is instantiated dynamically, we call the mutationFn directly or mutateAsync
        await updateTreatmentMutation.mutateAsync({
          id: editingTreatment.id,
          input: values,
        });
      } else {
        await createTreatmentMutation.mutateAsync({
          patientId,
          ...values,
        });
        toast.success("Davolash yozuvi muvaffaqiyatli yaratildi.");
      }
      setIsNewModalOpen(false);
      treatmentsQuery.refetch();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  };

  if (treatmentsQuery.isLoading) {
    return <Skeleton className="h-64 rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-fg">Davolash yozuvlari</h3>
        <Button onClick={handleOpenNewModal}>
          <Plus className="h-4 w-4 mr-1.5" />
          Yangi muolaja
        </Button>
      </div>

      {treatments.length === 0 ? (
        <EmptyState
          title="Muolajalar topilmadi"
          description="Bemor uchun hali hech qanday davolash yozuvi kiritilmagan."
          icon={<FileText className="h-10 w-10 text-fg-3" />}
        />
      ) : (
        <div className="space-y-4">
          {treatments.map((tr) => (
            <TreatmentItem
              key={tr.id}
              treatment={tr}
              isExpanded={expandedTreatmentId === tr.id}
              onToggle={() =>
                setExpandedTreatmentId(expandedTreatmentId === tr.id ? null : tr.id)
              }
              onEdit={() => handleOpenEditModal(tr)}
              refetchTreatments={() => treatmentsQuery.refetch()}
            />
          ))}
        </div>
      )}

      {/* New/Edit Treatment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-fg">
              {editingTreatment ? "Davolash yozuvini tahrirlash" : "Yangi davolash yozuvi"}
            </h3>

            <form onSubmit={handleSubmit(onSubmitTreatment)} className="space-y-4">
              <div>
                <Label htmlFor="doctorId">Shifokor *</Label>
                <select id="doctorId" className="select-field" {...register("doctorId")}>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user?.firstName} {d.user?.lastName} ({d.specialization})
                    </option>
                  ))}
                </select>
                {errors.doctorId && <p className="field-error">{errors.doctorId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departmentId">Bo'lim *</Label>
                  <select
                    id="departmentId"
                    className="select-field"
                    {...register("departmentId")}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <p className="field-error">{errors.departmentId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="procedureTypeId">Muolaja turi</Label>
                  <select
                    id="procedureTypeId"
                    className="select-field"
                    value={selectedProcedureTypeId || ""}
                    onChange={(e) => onProcedureTypeChange(e.target.value)}
                  >
                    <option value="">— Muolaja turini tanlang —</option>
                    {filteredProcedureTypes.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name} ({pt.defaultPrice} so'm)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="diagnosis">Tashxis *</Label>
                <Input id="diagnosis" {...register("diagnosis")} placeholder="Masalan: Tish chirishi" />
                {errors.diagnosis && <p className="field-error">{errors.diagnosis.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Tavsif (muolaja tafsilotlari)</Label>
                <textarea
                  id="description"
                  className="textarea-field"
                  rows={3}
                  {...register("description")}
                  placeholder="Klinik tavsif, dori tavsiyalari va boshqalar..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Narxi (so'm) *</Label>
                  <Input id="price" {...register("price")} placeholder="500000" />
                  {errors.price && <p className="field-error">{errors.price.message}</p>}
                </div>

                <div>
                  <Label htmlFor="stage">Bosqich *</Label>
                  <select id="stage" className="select-field" {...register("stage")}>
                    <option value="in_progress">Davom etmoqda</option>
                    <option value="completed">Yakunlangan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsNewModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface TreatmentItemProps {
  treatment: TreatmentRecord;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  refetchTreatments: () => void;
}

function TreatmentItem({
  treatment,
  isExpanded,
  onToggle,
  onEdit,
  refetchTreatments,
}: TreatmentItemProps): JSX.Element {
  const [activeSubTab, setActiveSubTab] = useState<"odontogram" | "prescription" | "photos">(
    "odontogram"
  );

  const cloneMutation = useCloneOdontogram(treatment.id);

  const handleCloneOdontogram = async () => {
    try {
      await cloneMutation.mutateAsync();
      toast.success("Tish holati muvaffaqiyatli nusxalandi.");
      refetchTreatments();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  };

  return (
    <div className="card border border-border overflow-hidden transition-all duration-200 hover:border-brand-500/25">
      {/* Header Summary */}
      <div
        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-fg leading-none">
              {treatment.diagnosis || "Tashxis qo'yilmagan"}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-fg-3">
              <span>Shifokor: {treatment.doctor?.user?.firstName} {treatment.doctor?.user?.lastName}</span>
              <span>•</span>
              <span>Bo'lim: {treatment.department?.name}</span>
              <span>•</span>
              <span>{format(new Date(treatment.createdAt ?? Date.now()), "yyyy-MM-dd HH:mm")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-base font-bold text-fg">{treatment.price} so'm</span>
          <span
            className={`badge ${
              treatment.stage === "completed"
                ? "badge-green"
                : "badge-blue"
            }`}
          >
            {treatment.stage === "completed" ? "Yakunlangan" : "Davom etmoqda"}
          </span>
          <span
            className={`badge ${
              treatment.paymentStatus === "paid"
                ? "badge-green"
                : treatment.paymentStatus === "partial"
                ? "badge-amber"
                : "badge-muted"
            }`}
          >
            {treatment.paymentStatus === "paid"
              ? "To'langan"
              : treatment.paymentStatus === "partial"
              ? "Qisman"
              : "To'lanmagan"}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border p-5 space-y-6 bg-surface-2/40 animate-in slide-in-from-top duration-200">
          {treatment.description && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-fg-3">Tavsif</h5>
              <p className="text-sm text-fg-2 whitespace-pre-wrap">{treatment.description}</p>
            </div>
          )}

          {/* Sub-tabs bar */}
          <div className="flex gap-2 border-b border-border pb-1">
            {(
              [
                ["odontogram", "Tish kartasi", FileText],
                ["prescription", "Retseptlar", Sparkles],
                ["photos", "Rasmlar", ImageIcon],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSubTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeSubTab === key
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-fg-3 hover:text-fg"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Sub-tab Content */}
          <div className="pt-2">
            {activeSubTab === "odontogram" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h6 className="text-xs font-bold uppercase tracking-wider text-fg-3">
                    Odontogramma
                  </h6>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCloneOdontogram}
                    disabled={cloneMutation.isPending}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${cloneMutation.isPending ? "animate-spin" : ""}`} />
                    Avvalgi holatdan nusxalash
                  </Button>
                </div>

                <TreatmentOdontogramView
                  treatmentId={treatment.id}
                  records={treatment.toothRecords ?? []}
                  refetch={refetchTreatments}
                />
              </div>
            )}

            {activeSubTab === "prescription" && (
              <TreatmentPrescriptionView
                treatmentId={treatment.id}
                refetch={refetchTreatments}
              />
            )}

            {activeSubTab === "photos" && (
              <TreatmentPhotosView
                treatment={treatment}
                refetch={refetchTreatments}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SUB-VIEW: Odontogram ──────────────────────────────────────────────────
interface TreatmentOdontogramViewProps {
  treatmentId: string;
  records: Array<{
    id: string;
    toothNumber: number;
    procedure: ToothProcedure;
    status: ToothStatus;
    notes: string;
  }>;
  refetch: () => void;
}

function TreatmentOdontogramView({
  treatmentId,
  records,
  refetch,
}: TreatmentOdontogramViewProps): JSX.Element {
  const createToothRecordMutation = useCreateToothRecord(treatmentId);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ToothRecordFormValues>({
    resolver: zodResolver(toothRecordSchema),
    defaultValues: {
      toothNumber: 11,
      procedure: "filling",
      status: "planned",
      notes: "",
    },
  });

  const onSubmit = async (values: ToothRecordFormValues) => {
    try {
      await createToothRecordMutation.mutateAsync(values);
      toast.success("Tish muolajasi yozuvi saqlandi.");
      setSelectedTooth(null);
      reset();
      refetch();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  };

  // Convert current treatment records to shape needed by Odontogram component
  const odontogramTeeth = useMemo(() => {
    return records.map((r) => ({
      toothNumber: r.toothNumber,
      status: r.status,
      procedure: r.procedure,
      notes: r.notes,
    }));
  }, [records]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Odontogram
          teeth={odontogramTeeth}
          selectedTooth={selectedTooth}
          onSelectTooth={(t) => setSelectedTooth(t.toothNumber)}
        />
      </div>

      <div className="card p-4 border border-border space-y-4">
        <h6 className="text-sm font-bold text-fg">
          {selectedTooth ? `Tish #${selectedTooth} muolajasi` : "Tish tanlang"}
        </h6>

        {selectedTooth ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input type="hidden" {...register("toothNumber")} value={selectedTooth} />

            <div>
              <Label htmlFor="procedure">Muolaja turi</Label>
              <select id="procedure" className="select-field" {...register("procedure")}>
                <option value="filling">Plomba qo'yish (Filling)</option>
                <option value="root_canal">Kanal davolash (Root Canal)</option>
                <option value="extraction">Tishni sug'urish (Extraction)</option>
                <option value="crown">Koronka qo'yish (Crown)</option>
                <option value="implant">Implant qo'yish (Implant)</option>
                <option value="cleaning">Tish tozalash (Cleaning)</option>
                <option value="whitening">Oqartirish (Whitening)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">Holati</Label>
              <select id="status" className="select-field" {...register("status")}>
                <option value="planned">Rejalashtirilgan</option>
                <option value="treated">Davolangan</option>
                <option value="missing">Yo'q (sug'urilgan)</option>
                <option value="healthy">Sog'lom</option>
              </select>
            </div>

            <div>
              <Label htmlFor="notes">Izohlar</Label>
              <textarea id="notes" className="textarea-field" rows={2} {...register("notes")} placeholder="Qo'shimcha tafsilotlar..." />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                Saqlash
              </Button>
              <Button type="button" variant="secondary" onClick={() => setSelectedTooth(null)}>
                Bekor qilish
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-fg-3 italic">
            Tish kartasidan biror tish ustiga bosib, unga muolaja yoki holat biriktiring.
          </p>
        )}
      </div>
    </div>
  );
}

// ── SUB-VIEW: Prescription ────────────────────────────────────────────────
interface TreatmentPrescriptionViewProps {
  treatmentId: string;
  refetch: () => void;
}

function TreatmentPrescriptionView({
  treatmentId,
  refetch,
}: TreatmentPrescriptionViewProps): JSX.Element {
  const templatesQuery = usePrescriptionTemplates();
  const prescriptionsQuery = usePrescriptions({ treatment: treatmentId });
  const issueMutation = useIssuePrescription(treatmentId);

  const templates = templatesQuery.data ?? [];
  const prescriptions = prescriptionsQuery.data?.results ?? [];

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      templateId: null,
      content: "",
      send: true,
    },
  });

  const selectedTemplateId = watch("templateId");

  // Auto-fill content when template is selected
  const onTemplateChange = (id: string) => {
    setValue("templateId", id || null);
    if (id) {
      const selected = templates.find((t) => t.id === id);
      if (selected) {
        setValue("content", selected.content);
      }
    }
  };

  const onSubmit = async (values: PrescriptionFormValues) => {
    try {
      await issueMutation.mutateAsync({
        templateId: values.templateId,
        content: values.content,
        send: values.send,
      });
      toast.success("Retsept muvaffaqiyatli yaratildi va saqlandi.");
      reset();
      refetch();
      prescriptionsQuery.refetch();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Xatolik");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Existing Prescriptions */}
      <div className="space-y-3">
        <h6 className="text-xs font-bold uppercase tracking-wider text-fg-3">Yozilgan retseptlar</h6>
        {prescriptionsQuery.isLoading ? (
          <Skeleton className="h-32 rounded-xl" />
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-fg-3 italic">Ushbu muolaja uchun hali retsept yozilmagan.</p>
        ) : (
          <ul className="space-y-2">
            {prescriptions.map((pr) => (
              <li key={pr.id} className="card p-4 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs text-fg-3">
                  <span>{format(new Date(pr.createdAt ?? Date.now()), "yyyy-MM-dd HH:mm")}</span>
                  {pr.isSent ? (
                    <span className="badge badge-green flex items-center gap-1">
                      <Send className="h-3 w-3" /> Telegramda yuborildi
                    </span>
                  ) : (
                    <span className="badge badge-muted">Kutish rejimida</span>
                  )}
                </div>
                <p className="text-sm text-fg-2 whitespace-pre-wrap">{pr.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* New Prescription Form */}
      <div className="card p-4 border border-border space-y-3">
        <h6 className="text-sm font-bold text-fg">Yangi retsept yozish</h6>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="templateId">Shablon tanlash</Label>
            <select
              id="templateId"
              className="select-field"
              value={selectedTemplateId || ""}
              onChange={(e) => onTemplateChange(e.target.value)}
            >
              <option value="">— Shablonni tanlang —</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="content">Retsept matni *</Label>
            <textarea
              id="content"
              className="textarea-field"
              rows={4}
              {...register("content")}
              placeholder="Masalan: Paracetamol 500mg, 1 kunda 2 mahal ovqatdan keyin..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="send" {...register("send")} className="rounded border-border text-brand-600 focus:ring-brand-500" />
            <Label htmlFor="send" className="mb-0 text-xs text-fg-2 cursor-pointer">
              Bemorga Telegram orqali yuborish
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-1.5" />
            Retseptni chop etish / yuborish
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── SUB-VIEW: Photos ──────────────────────────────────────────────────────
interface TreatmentPhotosViewProps {
  treatment: TreatmentRecord;
  refetch: () => void;
}

function TreatmentPhotosView({
  treatment,
  refetch,
}: TreatmentPhotosViewProps): JSX.Element {
  const uploadMutation = useUploadTreatmentPhoto(treatment.id);
  const [photoType, setPhotoType] = useState<"before" | "after" | "xray">("before");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const photos = treatment.photos ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Rasm fayli tanlanishi shart.");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        photoType,
        caption,
        file: selectedFile,
      });
      toast.success("Rasm muvaffaqiyatli yuklandi.");
      setSelectedFile(null);
      setCaption("");
      refetch();
    } catch (err) {
      const { error } = normaliseApiError(err);
      toast.error(error.message, "Yuklab bo'lmadi");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Existing Photos */}
      <div className="md:col-span-2 space-y-3">
        <h6 className="text-xs font-bold uppercase tracking-wider text-fg-3">Yuklangan rasmlar</h6>
        {photos.length === 0 ? (
          <p className="text-sm text-fg-3 italic">Ushbu muolaja uchun hali rasm yuklanmagan.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((ph) => (
              <div key={ph.id} className="card overflow-hidden border border-border group relative">
                <img src={ph.imageUrl || ""} alt={ph.caption} className="h-32 w-full object-cover transition-transform group-hover:scale-105" />
                <div className="p-2 space-y-0.5">
                  <span className="badge badge-muted text-[9px] uppercase tracking-wider">{ph.photoType}</span>
                  {ph.caption && <p className="text-xs text-fg-2 truncate">{ph.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Form */}
      <div className="card p-4 border border-border space-y-3">
        <h6 className="text-sm font-bold text-fg">Rasm yuklash</h6>
        <form onSubmit={handleUpload} className="space-y-3">
          <div>
            <Label htmlFor="photoType">Rasm turi</Label>
            <select
              id="photoType"
              className="select-field"
              value={photoType}
              onChange={(e) => setPhotoType(e.target.value as any)}
            >
              <option value="before">Davolashdan oldin (Before)</option>
              <option value="after">Davolashdan keyin (After)</option>
              <option value="xray">Rentgen (X-Ray)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="caption">Izoh</Label>
            <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Tish ko'rinishi..." />
          </div>

          <div>
            <Label htmlFor="file">Rasm tanlang *</Label>
            <input
              type="file"
              id="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full text-xs text-fg-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500/10 file:text-brand-600 hover:file:bg-brand-500/20"
            />
          </div>

          <Button type="submit" className="w-full" disabled={uploadMutation.isPending || !selectedFile}>
            <Upload className="h-4 w-4 mr-1.5" />
            Yuklash
          </Button>
        </form>
      </div>
    </div>
  );
}
