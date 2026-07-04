import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserCircle2 } from "lucide-react";
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

const PAGE_SIZE = 20;

const patientSchema = z.object({
  firstName: z.string().trim().min(2, "Ism kamida 2 belgi bo'lsin"),
  lastName: z.string().trim().min(2, "Familiya kamida 2 belgi bo'lsin"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?\d{9,15}$/, "Telefon +998... formatida bo'lishi kerak"),
  gender: z.enum(["male", "female"]).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export function MyPatientsPage(): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const canCreate = user?.role === "administrator" || user?.role === "bosh_shifokor";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<DataTableSort | null>({
    field: "last_name",
    direction: "asc",
  });
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
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <UserCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <div className="font-medium text-slate-900">{row.fullName}</div>
            <div className="text-xs text-slate-500">{row.phoneNumber}</div>
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
        <span className="text-sm text-slate-700">
          {row.gender === "male" ? "Erkak" : row.gender === "female" ? "Ayol" : "—"}
        </span>
      ),
    },
    {
      key: "address",
      header: "Manzil",
      hideBelow: "lg",
      cell: (row) => (
        <span className="text-xs text-slate-500">
          {row.address || <span className="text-slate-400">—</span>}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Izohlar",
      hideBelow: "lg",
      cell: (row) => (
        <span className="line-clamp-1 text-xs text-slate-500">
          {row.notes || <span className="text-slate-400">—</span>}
        </span>
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
              ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
          }
        >
          {row.isActive ? "Faol" : "Arxivda"}
        </span>
      ),
    },
  ];

  return (
    <section className="max-w-6xl">
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Label htmlFor="patients-search" className="sr-only">
            Bemorlarni qidirish
          </Label>
          <Input
            id="patients-search"
            type="search"
            placeholder="Ism, familiya yoki telefon…"
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
            : canCreate
              ? "Birinchi bemorni qo'shing."
              : "Hozircha bemorlar yo'q."
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
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
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

      <CreatePatientModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onCreated={(patient) => {
          setIsCreating(false);
          navigate(`/patients/${patient.id}`);
        }}
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Create modal (shared between MyPatientsPage and NewPatientPage below).
// ---------------------------------------------------------------------------
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
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      gender: "",
      address: "",
      notes: "",
    },
  });

  const submitting = mutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: PatientInput = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      gender: values.gender ? (values.gender as "male" | "female") : null,
      address: values.address?.trim() ?? "",
      notes: values.notes?.trim() ?? "",
    };
    try {
      const created = await mutation.mutateAsync(payload);
      toast.success("Yangi bemor qo'shildi.", created.fullName);
      form.reset();
      onCreated?.(created);
      onClose();
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "Saqlashda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      title="Yangi bemor"
      description="Bemor haqida asosiy ma'lumotlarni to'ldiring."
      size="lg"
      onClose={submitting ? () => undefined : () => {
        form.reset();
        onClose();
      }}
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
            {submitting ? "Saqlanmoqda…" : "Yaratish"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="patient-firstName">Ism *</Label>
          <Input
            id="patient-firstName"
            {...form.register("firstName")}
            invalid={Boolean(form.formState.errors.firstName)}
            autoFocus
          />
          {form.formState.errors.firstName ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.firstName.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="patient-lastName">Familiya *</Label>
          <Input
            id="patient-lastName"
            {...form.register("lastName")}
            invalid={Boolean(form.formState.errors.lastName)}
          />
          {form.formState.errors.lastName ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.lastName.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="patient-phone">Telefon *</Label>
          <Input
            id="patient-phone"
            placeholder="+998901234567"
            {...form.register("phoneNumber")}
            invalid={Boolean(form.formState.errors.phoneNumber)}
          />
          {form.formState.errors.phoneNumber ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.phoneNumber.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="patient-gender">Jinsi</Label>
          <select
            id="patient-gender"
            {...form.register("gender")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
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
          <textarea
            id="patient-notes"
            rows={3}
            {...form.register("notes")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
      </form>
    </Modal>
  );
}
