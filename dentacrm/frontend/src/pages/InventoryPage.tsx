/**
 * InventoryPage — Faza 3 / T16 completion.
 *
 * Real page (no placeholder) consuming ``/api/v1/materials/``:
 *
 *   * DataTable with pagination, search, and ``below_threshold`` filter.
 *   * Header banner listing low-stock materials so the user notices at
 *     a glance which items need restocking (PROJECT_BRIEF § "inventory").
 *   * bosh_shifokor — full CRUD + restock; doctor — read-only view.
 *   * Modals for create / edit / restock, all using RHF + Zod.
 *   * Skeleton loading, EmptyState, and Toast notifications on every
 *     mutation, per PROJECT_BRIEF § "UI/UX Design".
 */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Package,
  PencilLine,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { normaliseApiError } from "@/api/client";
import type {
  Material,
  MaterialInput,
  MaterialUnit,
} from "@/api/inventory";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSort,
} from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  useCreateMaterial,
  useDeleteMaterial,
  useMaterials,
  useRestockMaterial,
  useUpdateMaterial,
} from "@/hooks/useMaterials";
import { cn, formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/notificationStore";

const PAGE_SIZE = 20;

const UNIT_LABELS: Record<MaterialUnit, string> = {
  gram: "gramm",
  piece: "dona",
  ml: "ml",
};

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------
const decimalString = (opts: { min?: number; allowEmpty?: boolean } = {}) => {
  const { min = 0, allowEmpty = false } = opts;
  return z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val === "") {
        if (!allowEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Qiymat majburiy.",
          });
        }
        return;
      }
      if (!/^-?\d+(\.\d+)?$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faqat raqam kiriting.",
        });
        return;
      }
      const num = Number(val);
      if (Number.isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Noto'g'ri son.",
        });
        return;
      }
      if (num < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Qiymat ${min} dan kichik bo'lmasligi kerak.`,
        });
      }
    });
};

const materialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Kamida 2 belgi kiriting")
    .max(150, "Ko'pi bilan 150 belgi"),
  unit: z.enum(["gram", "piece", "ml"], {
    errorMap: () => ({ message: "O'lchov birligini tanlang" }),
  }),
  quantityInStock: decimalString({ min: 0 }),
  minimumThreshold: decimalString({ min: 0 }),
  unitCost: decimalString({ min: 0, allowEmpty: true }),
  notes: z.string().trim().max(1000, "Ko'pi bilan 1000 belgi").optional(),
});
type MaterialFormValues = z.infer<typeof materialSchema>;

const editMaterialSchema = materialSchema.omit({ quantityInStock: true });

const restockSchema = z.object({
  amount: decimalString({ min: 0.001 }).refine((v) => Number(v) > 0, {
    message: "Miqdor musbat bo'lishi kerak.",
  }),
  note: z.string().trim().max(255, "Ko'pi bilan 255 belgi").optional(),
});
type RestockFormValues = z.infer<typeof restockSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatQty(value: string, unit: MaterialUnit): string {
  const num = Number(value);
  if (Number.isNaN(num)) return `${value} ${UNIT_LABELS[unit]}`;
  const trimmed = Number.isInteger(num)
    ? num.toString()
    : num.toFixed(3).replace(/\.?0+$/, "");
  return `${trimmed} ${UNIT_LABELS[unit]}`;
}

function formatCost(value: string | null): string {
  if (value === null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(num);
}

// ===========================================================================
// Page
// ===========================================================================
export function InventoryPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const canManage = user?.role === "bosh_shifokor";

  const [search, setSearch] = useState("");
  const [belowOnly, setBelowOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<DataTableSort | null>({
    field: "name",
    direction: "asc",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [restocking, setRestocking] = useState<Material | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Material | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const ordering = sort
    ? `${sort.direction === "desc" ? "-" : ""}${sort.field}`
    : undefined;

  const query = useMaterials({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    belowThreshold: belowOnly,
    ordering,
  });

  // Separate query for the low-stock banner — always shows below-threshold
  // items regardless of the current filter.
  const lowStockQuery = useMaterials({
    page: 1,
    pageSize: 5,
    belowThreshold: true,
    ordering: "name",
  });

  const deleteMutation = useDeleteMaterial();

  const columns: DataTableColumn<Material>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Nomi",
        sortable: true,
        cell: (row) => (
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md",
                row.isBelowThreshold
                  ? "bg-amber-100 text-amber-700"
                  : "bg-brand-50 text-brand-600",
              )}
            >
              <Package className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="font-medium text-slate-900">{row.name}</div>
              {row.notes ? (
                <div className="line-clamp-1 text-xs text-slate-500">
                  {row.notes}
                </div>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        key: "quantityInStock",
        header: "Zaxirada",
        sortable: true,
        sortField: "quantity_in_stock",
        align: "right",
        cell: (row) => (
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={cn(
                "font-medium tabular-nums",
                row.isBelowThreshold ? "text-amber-700" : "text-slate-900",
              )}
            >
              {formatQty(row.quantityInStock, row.unit)}
            </span>
            <span className="text-xs text-slate-500">
              min: {formatQty(row.minimumThreshold, row.unit)}
            </span>
          </div>
        ),
      },
      {
        key: "isBelowThreshold",
        header: "Holati",
        align: "center",
        hideBelow: "md",
        cell: (row) =>
          row.isBelowThreshold ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Kam qoldi
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Yetarli
            </span>
          ),
      },
      {
        key: "unitCost",
        header: "Birlik narxi",
        align: "right",
        hideBelow: "lg",
        cell: (row) => (
          <span className="text-xs text-slate-600 tabular-nums">
            {formatCost(row.unitCost)}
          </span>
        ),
      },
      {
        key: "updatedAt",
        header: "Yangilangan",
        sortable: true,
        sortField: "updated_at",
        hideBelow: "lg",
        cell: (row) => (
          <span className="text-xs text-slate-500">
            {formatDateTime(row.updatedAt)}
          </span>
        ),
      },
    ],
    [],
  );

  const handleDelete = async (): Promise<void> => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success("Material arxivga ko'chirildi.", pendingDelete.name);
      setPendingDelete(null);
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "O'chirishda xatolik");
    }
  };

  const lowStockCount = lowStockQuery.data?.count ?? 0;
  const lowStockRows = lowStockQuery.data?.results ?? [];

  return (
    <section className="max-w-6xl">
      <PageHeader
        title="Omborxona"
        description="Materiallar ro'yxati, zaxira holati va to'ldirish tarixi."
        actions={
          canManage ? (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Yangi material
            </Button>
          ) : null
        }
      />

      {/* --- Low-stock banner ---------------------------------------- */}
      {lowStockCount > 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {lowStockCount} ta material minimum chegara ostida:
              </p>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {lowStockRows.map((row) => (
                  <li key={row.id}>
                    <span className="font-medium">{row.name}</span>{" "}
                    <span className="text-amber-700">
                      ({formatQty(row.quantityInStock, row.unit)} / min{" "}
                      {formatQty(row.minimumThreshold, row.unit)})
                    </span>
                  </li>
                ))}
                {lowStockCount > lowStockRows.length ? (
                  <li className="text-amber-700">
                    …va yana {lowStockCount - lowStockRows.length} ta.
                  </li>
                ) : null}
              </ul>
            </div>
            {!belowOnly ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBelowOnly(true);
                  setPage(1);
                }}
              >
                Barchasini ko'rish
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* --- Filters --------------------------------------------------- */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full max-w-sm">
            <Label htmlFor="materials-search" className="sr-only">
              Materiallarni qidirish
            </Label>
            <Input
              id="materials-search"
              type="search"
              placeholder="Nom yoki izoh bo'yicha qidirish…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <label className="inline-flex select-none items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              checked={belowOnly}
              onChange={(event) => {
                setBelowOnly(event.target.checked);
                setPage(1);
              }}
            />
            Faqat kam qolganlar
          </label>
        </div>
        {query.data ? (
          <span className="text-xs text-slate-500">
            Jami: {query.data.count.toLocaleString("uz-UZ")}
          </span>
        ) : null}
      </div>

      {/* --- Table ---------------------------------------------------- */}
      <DataTable<Material>
        columns={columns}
        rows={query.data?.results}
        rowKey={(row) => row.id}
        isLoading={query.isLoading}
        error={query.isError ? query.error : undefined}
        emptyTitle="Materiallar topilmadi"
        emptyDescription={
          debouncedSearch || belowOnly
            ? "Joriy filtr bo'yicha hech nima chiqmadi. Filtrlarni tozalab qayta urinib ko'ring."
            : canManage
              ? "Birinchi materialingizni qo'shish uchun yuqoridagi tugmani bosing."
              : "Hozircha ombor bo'sh — bosh shifokor materiallarni qo'shishi kerak."
        }
        emptyAction={
          !debouncedSearch && !belowOnly && canManage ? (
            <Button size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Material qo'shish
            </Button>
          ) : undefined
        }
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        rowActions={
          canManage
            ? (row) => (
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRestocking(row)}
                    aria-label={`${row.name} — to'ldirish`}
                    title="To'ldirish"
                  >
                    <RotateCcw
                      className="h-4 w-4 text-emerald-600"
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(row)}
                    aria-label={`${row.name} — tahrirlash`}
                    title="Tahrirlash"
                  >
                    <PencilLine className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingDelete(row)}
                    aria-label={`${row.name} — o'chirish`}
                    title="O'chirish"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              )
            : undefined
        }
      />

      {query.data ? (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          count={query.data.count}
          onPageChange={setPage}
          isLoading={query.isFetching}
          className="mt-2"
        />
      ) : null}

      {/* --- Modals --------------------------------------------------- */}
      {canManage ? (
        <>
          <MaterialFormModal
            open={isCreating}
            title="Yangi material"
            submitLabel="Yaratish"
            onClose={() => setIsCreating(false)}
          />
          <MaterialFormModal
            open={editing !== null}
            title={editing ? `Materialni tahrirlash — ${editing.name}` : ""}
            submitLabel="Saqlash"
            material={editing}
            onClose={() => setEditing(null)}
          />
          <RestockModal
            open={restocking !== null}
            material={restocking}
            onClose={() => setRestocking(null)}
          />
          <ConfirmDialog
            open={pendingDelete !== null}
            title="Materialni arxivlashni tasdiqlang"
            description={
              pendingDelete
                ? `"${pendingDelete.name}" arxivga o'tkaziladi. Uni keyinchalik qayta faollashtirish mumkin.`
                : undefined
            }
            confirmLabel="Arxivlash"
            destructive
            loading={deleteMutation.isPending}
            onConfirm={handleDelete}
            onClose={() => setPendingDelete(null)}
          />
        </>
      ) : null}

      {/* Doctor view — remind that write operations require bosh_shifokor. */}
      {!canManage && (query.data?.results.length ?? 0) === 0 && !query.isLoading ? (
        <div className="mt-6">
          <EmptyState
            title="Faqat o'qish uchun"
            description="Materiallarni faqat bosh shifokor qo'sha oladi. Siz zaxira holatini kuzatib borishingiz mumkin."
          />
        </div>
      ) : null}
    </section>
  );
}

// ===========================================================================
// Material form modal (create + edit)
// ===========================================================================
interface MaterialFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  material?: Material | null;
  onClose: () => void;
}

function MaterialFormModal({
  open,
  title,
  submitLabel,
  material,
  onClose,
}: MaterialFormModalProps): JSX.Element {
  const isEdit = Boolean(material);
  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial(material?.id ?? "");

  const defaultValues: MaterialFormValues = material
    ? {
        name: material.name,
        unit: material.unit,
        quantityInStock: material.quantityInStock,
        minimumThreshold: material.minimumThreshold,
        unitCost: material.unitCost ?? "",
        notes: material.notes ?? "",
      }
    : {
        name: "",
        unit: "piece",
        quantityInStock: "0",
        minimumThreshold: "0",
        unitCost: "",
        notes: "",
      };

  // In edit mode we validate against a schema without quantityInStock —
  // it's shown as a read-only display so the user knows to use /restock/.
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(
      isEdit ? (editMaterialSchema as unknown as typeof materialSchema) : materialSchema,
    ),
    values: defaultValues,
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  const closeAndReset = (): void => {
    form.reset();
    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEdit && material) {
        const payload: Partial<MaterialInput> = {
          name: values.name.trim(),
          unit: values.unit,
          minimumThreshold: values.minimumThreshold,
          unitCost: values.unitCost === "" ? null : values.unitCost,
          notes: values.notes?.trim() ?? "",
        };
        await updateMutation.mutateAsync(payload);
        toast.success("Material yangilandi.", material.name);
      } else {
        const payload: MaterialInput = {
          name: values.name.trim(),
          unit: values.unit,
          quantityInStock: values.quantityInStock,
          minimumThreshold: values.minimumThreshold,
          unitCost: values.unitCost === "" ? null : values.unitCost,
          notes: values.notes?.trim() ?? "",
        };
        await createMutation.mutateAsync(payload);
        toast.success("Yangi material yaratildi.", payload.name);
      }
      closeAndReset();
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "Saqlashda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      onClose={submitting ? () => undefined : closeAndReset}
      title={title}
      description={
        isEdit
          ? "Material ma'lumotlarini yangilang. Zaxira miqdorini faqat 'To'ldirish' orqali o'zgartiring."
          : "Material nomi, o'lchov birligi va boshlang'ich zaxirasini kiriting."
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={closeAndReset}
            disabled={submitting}
          >
            Bekor qilish
          </Button>
          <Button type="button" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Saqlanmoqda…" : submitLabel}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="material-name">Nomi *</Label>
          <Input
            id="material-name"
            {...form.register("name")}
            invalid={Boolean(form.formState.errors.name)}
            autoFocus
          />
          {form.formState.errors.name ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="material-unit">O'lchov birligi *</Label>
            <select
              id="material-unit"
              {...form.register("unit")}
              className={cn(
                "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm",
                "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40",
                form.formState.errors.unit &&
                  "border-red-400 focus:border-red-500 focus:ring-red-500/40",
              )}
            >
              <option value="piece">Dona</option>
              <option value="gram">Gramm</option>
              <option value="ml">Millilitr</option>
            </select>
            {form.formState.errors.unit ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {form.formState.errors.unit.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="material-cost">Birlik narxi (UZS)</Label>
            <Input
              id="material-cost"
              inputMode="decimal"
              placeholder="Masalan, 120000"
              {...form.register("unitCost")}
              invalid={Boolean(form.formState.errors.unitCost)}
            />
            {form.formState.errors.unitCost ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {form.formState.errors.unitCost.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="material-quantity">
              Boshlang'ich zaxira *
            </Label>
            <Input
              id="material-quantity"
              inputMode="decimal"
              disabled={isEdit}
              {...form.register("quantityInStock")}
              invalid={Boolean(form.formState.errors.quantityInStock)}
            />
            {isEdit ? (
              <p className="mt-1 text-xs text-slate-500">
                Tahrirlashda zaxira o'zgarmaydi — "To'ldirish" tugmasidan
                foydalaning.
              </p>
            ) : null}
            {form.formState.errors.quantityInStock ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {form.formState.errors.quantityInStock.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="material-threshold">Minimum chegara *</Label>
            <Input
              id="material-threshold"
              inputMode="decimal"
              {...form.register("minimumThreshold")}
              invalid={Boolean(form.formState.errors.minimumThreshold)}
            />
            {form.formState.errors.minimumThreshold ? (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {form.formState.errors.minimumThreshold.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="material-notes">Izoh</Label>
          <textarea
            id="material-notes"
            rows={3}
            {...form.register("notes")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            placeholder="Ixtiyoriy — turi, katalog raqami va boshqalar."
          />
          {form.formState.errors.notes ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {form.formState.errors.notes.message}
            </p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}

// ===========================================================================
// Restock modal
// ===========================================================================
interface RestockModalProps {
  open: boolean;
  material: Material | null;
  onClose: () => void;
}

function RestockModal({
  open,
  material,
  onClose,
}: RestockModalProps): JSX.Element {
  const restockMutation = useRestockMaterial(material?.id ?? "");

  const form = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema),
    defaultValues: { amount: "", note: "" },
    values: { amount: "", note: "" },
  });

  const submitting = restockMutation.isPending;

  const closeAndReset = (): void => {
    form.reset({ amount: "", note: "" });
    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!material) return;
    try {
      const updated = await restockMutation.mutateAsync({
        amount: values.amount,
        note: values.note?.trim() ?? "",
      });
      toast.success(
        `Zaxira yangilandi: ${formatQty(updated.quantityInStock, updated.unit)}`,
        material.name,
      );
      closeAndReset();
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "To'ldirishda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      onClose={submitting ? () => undefined : closeAndReset}
      title={material ? `Zaxirani to'ldirish — ${material.name}` : ""}
      description={
        material
          ? `Joriy zaxira: ${formatQty(material.quantityInStock, material.unit)} (min: ${formatQty(
              material.minimumThreshold,
              material.unit,
            )}).`
          : undefined
      }
      size="sm"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={closeAndReset}
            disabled={submitting}
          >
            Bekor qilish
          </Button>
          <Button type="button" onClick={onSubmit} disabled={submitting || !material}>
            {submitting ? "Saqlanmoqda…" : "To'ldirish"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="restock-amount">
            Qo'shiladigan miqdor{material ? ` (${UNIT_LABELS[material.unit]})` : ""}
            {" *"}
          </Label>
          <Input
            id="restock-amount"
            inputMode="decimal"
            autoFocus
            {...form.register("amount")}
            invalid={Boolean(form.formState.errors.amount)}
          />
          {form.formState.errors.amount ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {form.formState.errors.amount.message}
            </p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="restock-note">Izoh</Label>
          <Input
            id="restock-note"
            placeholder="Masalan, 'Yangi partiya 2026-07-04'"
            {...form.register("note")}
            invalid={Boolean(form.formState.errors.note)}
          />
          {form.formState.errors.note ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {form.formState.errors.note.message}
            </p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
