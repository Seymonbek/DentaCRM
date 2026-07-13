import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { normaliseApiError } from "@/api/client";
import type { PatientInput, PatientRecord } from "@/api/patients";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn, type DataTableSort } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useCreatePatient, usePatients } from "@/hooks/usePatients";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/notificationStore";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const patientSchema = z.object({
  firstName:   z.string().trim().min(2, "Ism kamida 2 belgi bo'lsin"),
  lastName:    z.string().trim().min(2, "Familiya kamida 2 belgi bo'lsin"),
  phoneNumber: z.string().trim().regex(/^\+?\d{9,15}$/, "Telefon +998... formatida bo'lishi kerak"),
  gender:      z.enum(["male", "female"]).optional().or(z.literal("")),
  address:     z.string().trim().max(500).optional().or(z.literal("")),
  notes:       z.string().trim().max(5000).optional().or(z.literal("")),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export function MyPatientsPage(): JSX.Element {
  const navigate   = useNavigate();
  const user       = useAuthStore((s) => s.user);
  const canCreate  = user?.role === "administrator" || user?.role === "bosh_shifokor";

  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [sort,       setSort]       = useState<DataTableSort | null>({ field: "last_name", direction: "asc" });
  const [isCreating, setIsCreating] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);

  const query = usePatients({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    ordering: sort ? `${sort.direction === "desc" ? "-" : ""}${sort.field}` : undefined,
  });

  const columns: DataTableColumn<PatientRecord>[] = [
    {
      key: "fullName",
      header: "Bemor",
      sortable: true,
      sortField: "last_name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-[11px] font-bold select-none">
            {row.firstName?.[0]}{row.lastName?.[0]}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-fg truncate">{row.fullName}</p>
            <p className="text-xs text-fg-3">{row.phoneNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: "gender",
      header: "Jinsi",
      align: "center",
      hideBelow: "md",
      cell: (row) => (
        <span className="text-sm text-fg-2">
          {row.gender === "male" ? "Erkak" : row.gender === "female" ? "Ayol" : "—"}
        </span>
      ),
    },
    {
      key: "address",
      header: "Manzil",
      hideBelow: "lg",
      cell: (row) => (
        <span className="text-xs text-fg-3 line-clamp-1">{row.address || "—"}</span>
      ),
    },
    {
      key: "isActive",
      header: "Holati",
      align: "center",
      hideBelow: "md",
      cell: (row) => (
        <span className={cn("badge", row.isActive ? "badge-green" : "badge-muted")}>
          {row.isActive ? "Faol" : "Arxivda"}
        </span>
      ),
    },
  ];

  return (
    <section className="max-w-6xl space-y-5">
      <PageHeader
        title="Bemorlar"
        description="Bemorlarni qidirish, kartochkasini ochish va yangi bemor qo'shish."
        actions={
          canCreate ? (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Yangi bemor
            </Button>
          ) : undefined
        }
      />

      {/* Search + count bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" aria-hidden="true" />
          <Label htmlFor="patients-search" className="sr-only">Bemorlarni qidirish</Label>
          <Input
            id="patients-search"
            type="search"
            placeholder="Ism, familiya yoki telefon…"
            value={search}
            className="pl-9"
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {query.data ? (
          <span className="text-xs text-fg-3 whitespace-nowrap">
            Jami: <span className="font-medium text-fg-2">{query.data.count.toLocaleString("uz-UZ")}</span> ta bemor
          </span>
        ) : null}
      </div>

      <DataTable<PatientRecord>
        columns={columns}
        rows={query.data?.results}
        rowKey={(row) => row.id}
        isLoading={query.isLoading}
        error={query.isError ? query.error : undefined}
        emptyTitle="Bemorlar topilmadi"
        emptyDescription={
          debouncedSearch
            ? "Qidiruv bo'yicha hech nima chiqmadi."
            : canCreate ? "Birinchi bemorni qo'shing." : "Hozircha bemorlar yo'q."
        }
        emptyAction={
          !debouncedSearch && canCreate ? (
            <Button size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Bemor qo'shish
            </Button>
          ) : undefined
        }
        onRowClick={(row) => navigate(`/patients/${row.id}`)}
        sort={sort}
        onSortChange={(next) => { setSort(next); setPage(1); }}
      />

      {query.data ? (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          count={query.data.count}
          onPageChange={setPage}
          isLoading={query.isFetching}
        />
      ) : null}

      <CreatePatientModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onCreated={(patient) => { setIsCreating(false); navigate(`/patients/${patient.id}`); }}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
export function CreatePatientModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (patient: PatientRecord) => void;
}): JSX.Element {
  const mutation = useCreatePatient();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { firstName: "", lastName: "", phoneNumber: "", gender: "", address: "", notes: "" },
  });

  const submitting = mutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: PatientInput = {
      firstName:   values.firstName.trim(),
      lastName:    values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      gender:      values.gender ? (values.gender as "male" | "female") : null,
      address:     values.address?.trim() ?? "",
      notes:       values.notes?.trim() ?? "",
    };
    try {
      const created = await mutation.mutateAsync(payload);
      toast.success("Yangi bemor qo'shildi.", created.fullName);
      form.reset();
      onCreated?.(created);
      onClose();
    } catch (err) {
      toast.error(normaliseApiError(err).error.message, "Saqlashda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      title="Yangi bemor"
      description="Bemor haqida asosiy ma'lumotlarni to'ldiring."
      size="lg"
      onClose={submitting ? () => undefined : () => { form.reset(); onClose(); }}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => { form.reset(); onClose(); }} disabled={submitting}>
            Bekor qilish
          </Button>
          <Button type="button" onClick={onSubmit} disabled={submitting} aria-busy={submitting}>
            {submitting ? "Saqlanmoqda…" : "Yaratish"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="patient-firstName">Ism *</Label>
          <Input id="patient-firstName" {...form.register("firstName")} invalid={Boolean(form.formState.errors.firstName)} autoFocus />
          {form.formState.errors.firstName ? <p className="field-error">{form.formState.errors.firstName.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="patient-lastName">Familiya *</Label>
          <Input id="patient-lastName" {...form.register("lastName")} invalid={Boolean(form.formState.errors.lastName)} />
          {form.formState.errors.lastName ? <p className="field-error">{form.formState.errors.lastName.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="patient-phone">Telefon *</Label>
          <Input id="patient-phone" placeholder="+998901234567" {...form.register("phoneNumber")} invalid={Boolean(form.formState.errors.phoneNumber)} />
          {form.formState.errors.phoneNumber ? <p className="field-error">{form.formState.errors.phoneNumber.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="patient-gender">Jinsi</Label>
          <select id="patient-gender" {...form.register("gender")} className="select-field">
            <option value="">Ko'rsatilmagan</option>
            <option value="male">Erkak</option>
            <option value="female">Ayol</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="patient-address">Manzil</Label>
          <Input id="patient-address" {...form.register("address")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="patient-notes">Izohlar (allergiya, surunkali kasalliklar)</Label>
          <textarea id="patient-notes" rows={3} {...form.register("notes")} className="textarea-field" />
        </div>
      </form>
    </Modal>
  );
}
