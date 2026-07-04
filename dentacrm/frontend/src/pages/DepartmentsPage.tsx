import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, PencilLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Department, DepartmentInput } from "@/api/departments";
import { normaliseApiError } from "@/api/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn, type DataTableSort } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "@/hooks/useDepartments";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDateTime } from "@/lib/utils";
import { toast } from "@/store/notificationStore";

const PAGE_SIZE = 20;

const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Kamida 2 belgi kiriting")
    .max(100, "Ko'pi bilan 100 belgi"),
  description: z
    .string()
    .trim()
    .max(1000, "Ko'pi bilan 1000 belgi")
    .optional()
    .or(z.literal("")),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export function DepartmentsPage(): JSX.Element {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<DataTableSort | null>({
    field: "name",
    direction: "asc",
  });
  const [editing, setEditing] = useState<Department | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Department | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  const ordering = sort ? `${sort.direction === "desc" ? "-" : ""}${sort.field}` : undefined;
  const query = useDepartments({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    ordering,
  });

  const deleteMutation = useDeleteDepartment();

  const columns: DataTableColumn<Department>[] = [
    {
      key: "name",
      header: "Nomi",
      sortable: true,
      cell: (row) => (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600">
            <Building2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="font-medium text-slate-900">{row.name}</div>
            <div className="line-clamp-2 text-xs text-slate-500">
              {row.description || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Holati",
      align: "center",
      hideBelow: "md",
      cell: (row) => (
        <span
          className={
            row.isActive
              ? "inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
          }
        >
          {row.isActive ? "Faol" : "Arxivda"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Yaratilgan",
      sortable: true,
      sortField: "created_at",
      hideBelow: "lg",
      cell: (row) => (
        <span className="text-xs text-slate-500">{formatDateTime(row.createdAt)}</span>
      ),
    },
  ];

  const handleDelete = async (): Promise<void> => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success("Bo'lim arxivga ko'chirildi.", pendingDelete.name);
      setPendingDelete(null);
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "O'chirishda xatolik");
    }
  };

  return (
    <section className="max-w-6xl">
      <PageHeader
        title="Bo'limlar"
        description="Klinika bo'limlarini yaratish, tahrirlash va arxivlash."
        actions={
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Yangi bo'lim
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Label htmlFor="departments-search" className="sr-only">
            Bo'limlarni qidirish
          </Label>
          <Input
            id="departments-search"
            type="search"
            placeholder="Nom yoki tavsif bo'yicha qidirish…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        {query.data ? (
          <span className="text-xs text-slate-500">
            Jami: {query.data.count.toLocaleString("uz-UZ")}
          </span>
        ) : null}
      </div>

      <DataTable<Department>
        columns={columns}
        rows={query.data?.results}
        rowKey={(row) => row.id}
        isLoading={query.isLoading}
        error={query.isError ? query.error : undefined}
        emptyTitle="Bo'limlar topilmadi"
        emptyDescription={
          debouncedSearch
            ? "Qidiruv bo'yicha hech nima chiqmadi. Boshqa kalit so'z sinab ko'ring."
            : "Birinchi bo'limingizni qo'shish uchun yuqoridagi tugmani bosing."
        }
        emptyAction={
          !debouncedSearch ? (
            <Button size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Bo'lim qo'shish
            </Button>
          ) : undefined
        }
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        rowActions={(row) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(row)}
              aria-label={`${row.name} bo'limini tahrirlash`}
            >
              <PencilLine className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPendingDelete(row)}
              aria-label={`${row.name} bo'limini o'chirish`}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
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

      <DepartmentFormModal
        open={isCreating}
        title="Yangi bo'lim"
        onClose={() => setIsCreating(false)}
        submitLabel="Yaratish"
      />

      <DepartmentFormModal
        open={editing !== null}
        title={editing ? `Bo'limni tahrirlash — ${editing.name}` : ""}
        department={editing}
        onClose={() => setEditing(null)}
        submitLabel="Saqlash"
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Bo'limni arxivlashni tasdiqlang"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" bo'limi arxivga o'tkaziladi. Uni keyinchalik qayta faollashtirish mumkin.`
            : undefined
        }
        confirmLabel="Arxivlash"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Form modal (create + edit share the same body).
// ---------------------------------------------------------------------------
interface DepartmentFormModalProps {
  open: boolean;
  title: string;
  department?: Department | null;
  submitLabel: string;
  onClose: () => void;
}

function DepartmentFormModal({
  open,
  title,
  department,
  submitLabel,
  onClose,
}: DepartmentFormModalProps): JSX.Element {
  const isEdit = Boolean(department);
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment(department?.id ?? "");

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    values: department
      ? { name: department.name, description: department.description }
      : { name: "", description: "" },
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: DepartmentInput = {
      name: values.name.trim(),
      description: values.description?.trim() ?? "",
    };
    try {
      if (isEdit && department) {
        await updateMutation.mutateAsync(payload);
        toast.success("Bo'lim yangilandi.", department.name);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Yangi bo'lim yaratildi.", payload.name);
      }
      form.reset();
      onClose();
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "Saqlashda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      onClose={submitting ? () => undefined : () => {
        form.reset();
        onClose();
      }}
      title={title}
      description={
        isEdit
          ? "Bo'lim ma'lumotlarini yangilang."
          : "Bo'lim nomi va qisqacha tavsifini kiriting."
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onClose();
            }}
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
      <form
        onSubmit={onSubmit}
        className="space-y-4"
        aria-labelledby="department-form-title"
      >
        <div>
          <Label htmlFor="department-name">Nomi *</Label>
          <Input
            id="department-name"
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
        <div>
          <Label htmlFor="department-description">Tavsif</Label>
          <textarea
            id="department-description"
            rows={3}
            {...form.register("description")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
          {form.formState.errors.description ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
