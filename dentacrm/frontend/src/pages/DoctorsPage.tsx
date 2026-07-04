import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Stethoscope } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { normaliseApiError } from "@/api/client";
import type { DoctorCreateInput, DoctorRecord } from "@/api/doctors";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn, type DataTableSort } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { useCreateDoctor, useDoctors } from "@/hooks/useDoctors";
import { useDepartments } from "@/hooks/useDepartments";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { toast } from "@/store/notificationStore";

const PAGE_SIZE = 20;

const doctorSchema = z.object({
  firstName: z.string().trim().min(2, "Ism kamida 2 belgi bo'lsin"),
  lastName: z.string().trim().min(2, "Familiya kamida 2 belgi bo'lsin"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?\d{9,15}$/, "Telefon +998... formatida bo'lishi kerak"),
  password: z.string().min(8, "Parol kamida 8 belgi bo'lishi kerak"),
  specialization: z.string().trim().max(150).optional().or(z.literal("")),
  commissionBasis: z.enum(["from_total", "from_net"]).default("from_total"),
  defaultCommissionRate: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Foizni son sifatida kiriting (masalan 30 yoki 32.5)")
    .default("30"),
  role: z.enum(["doctor", "bosh_shifokor"]).default("doctor"),
  departmentIds: z.array(z.string().uuid()).default([]),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export function DoctorsPage(): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);

  const doctorsQuery = useDoctors({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
    department: department || undefined,
    ordering: sort ? `${sort.direction === "desc" ? "-" : ""}${sort.field}` : undefined,
  });
  const departmentsQuery = useDepartments({ pageSize: 100 });

  const columns: DataTableColumn<DoctorRecord>[] = [
    {
      key: "user",
      header: "Shifokor",
      sortField: "user__last_name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <div className="font-medium text-slate-900">
              {row.user?.firstName} {row.user?.lastName}
            </div>
            <div className="text-xs text-slate-500">{row.user?.phoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      header: "Mutaxassisligi",
      hideBelow: "md",
      cell: (row) => (
        <span className="text-sm text-slate-700">
          {row.specialization || <span className="text-slate-400">—</span>}
        </span>
      ),
    },
    {
      key: "departments",
      header: "Bo'limlar",
      hideBelow: "md",
      cell: (row) =>
        row.departments.length ? (
          <div className="flex flex-wrap gap-1">
            {row.departments.slice(0, 3).map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
              >
                {d.name}
              </span>
            ))}
            {row.departments.length > 3 ? (
              <span className="text-xs text-slate-500">
                +{row.departments.length - 3}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "commissionBasis",
      header: "Komissiya",
      align: "right",
      hideBelow: "lg",
      cell: (row) => (
        <div className="text-right text-xs">
          <div className="font-medium text-slate-800">
            {row.defaultCommissionRate ?? "0.00"}%
          </div>
          <div className="text-slate-500">
            {row.commissionBasis === "from_net" ? "sof daromaddan" : "umumiy summadan"}
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
              ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
          }
        >
          {row.isActive ? "Faol" : "Faol emas"}
        </span>
      ),
    },
  ];

  return (
    <section className="max-w-6xl">
      <PageHeader
        title="Shifokorlar"
        description="Shifokorlar ro'yxati, ish jadvali va komissiya sozlamalari."
        actions={
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Yangi shifokor
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Label htmlFor="doctors-search" className="sr-only">
            Shifokorlarni qidirish
          </Label>
          <Input
            id="doctors-search"
            type="search"
            placeholder="Ism, familiya, telefon…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <Label htmlFor="doctors-department" className="sr-only">
            Bo'lim bo'yicha filtr
          </Label>
          <select
            id="doctors-department"
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            <option value="">Barcha bo'limlar</option>
            {departmentsQuery.data?.results.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right text-xs text-slate-500 sm:self-center">
          {doctorsQuery.data
            ? `Jami: ${doctorsQuery.data.count.toLocaleString("uz-UZ")}`
            : "—"}
        </div>
      </div>

      <DataTable<DoctorRecord>
        columns={columns}
        rows={doctorsQuery.data?.results}
        rowKey={(row) => row.id}
        isLoading={doctorsQuery.isLoading}
        error={doctorsQuery.isError ? doctorsQuery.error : undefined}
        emptyTitle="Shifokorlar topilmadi"
        emptyDescription={
          debouncedSearch || department
            ? "Filtrni o'zgartirib qayta urinib ko'ring."
            : "Klinikaga birinchi shifokorni qo'shing."
        }
        onRowClick={(row) => navigate(`/doctors/${row.id}`)}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
      />

      {doctorsQuery.data ? (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          count={doctorsQuery.data.count}
          onPageChange={setPage}
          isLoading={doctorsQuery.isFetching}
          className="mt-2"
        />
      ) : null}

      <CreateDoctorModal open={isCreating} onClose={() => setIsCreating(false)} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Create-doctor modal
// ---------------------------------------------------------------------------
function CreateDoctorModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): JSX.Element {
  const mutation = useCreateDoctor();
  const departmentsQuery = useDepartments({ pageSize: 100 });

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      specialization: "",
      commissionBasis: "from_total",
      defaultCommissionRate: "30",
      role: "doctor",
      departmentIds: [],
    },
  });

  const submitting = mutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: DoctorCreateInput = {
      user: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        role: values.role,
      },
      specialization: values.specialization?.trim() ?? "",
      commissionBasis: values.commissionBasis,
      defaultCommissionRate: values.defaultCommissionRate,
      departmentIds: values.departmentIds,
    };
    try {
      await mutation.mutateAsync(payload);
      toast.success("Yangi shifokor qo'shildi.", `${payload.user.firstName} ${payload.user.lastName}`);
      form.reset();
      onClose();
    } catch (err) {
      const message = normaliseApiError(err).error.message;
      toast.error(message, "Shifokor qo'shishda xatolik");
    }
  });

  return (
    <Modal
      open={open}
      title="Yangi shifokor"
      description="Foydalanuvchi hisobi va shifokor profili birga yaratiladi."
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
            {submitting ? "Yaratilmoqda…" : "Yaratish"}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="doctor-firstName">Ism *</Label>
          <Input
            id="doctor-firstName"
            {...form.register("firstName")}
            invalid={Boolean(form.formState.errors.firstName)}
            autoFocus
          />
          {form.formState.errors.firstName ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.firstName.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="doctor-lastName">Familiya *</Label>
          <Input
            id="doctor-lastName"
            {...form.register("lastName")}
            invalid={Boolean(form.formState.errors.lastName)}
          />
          {form.formState.errors.lastName ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.lastName.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="doctor-phone">Telefon *</Label>
          <Input
            id="doctor-phone"
            placeholder="+998901234567"
            {...form.register("phoneNumber")}
            invalid={Boolean(form.formState.errors.phoneNumber)}
          />
          {form.formState.errors.phoneNumber ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.phoneNumber.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="doctor-password">Parol *</Label>
          <Input
            id="doctor-password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            invalid={Boolean(form.formState.errors.password)}
          />
          {form.formState.errors.password ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="doctor-specialization">Mutaxassisligi</Label>
          <Input id="doctor-specialization" {...form.register("specialization")} />
        </div>
        <div>
          <Label htmlFor="doctor-role">Rol</Label>
          <select
            id="doctor-role"
            {...form.register("role")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            <option value="doctor">Shifokor</option>
            <option value="bosh_shifokor">Bosh shifokor</option>
          </select>
        </div>
        <div>
          <Label htmlFor="doctor-commissionBasis">Komissiya asosi</Label>
          <select
            id="doctor-commissionBasis"
            {...form.register("commissionBasis")}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            <option value="from_total">Umumiy summadan</option>
            <option value="from_net">Sof daromaddan</option>
          </select>
        </div>
        <div>
          <Label htmlFor="doctor-rate">Komissiya % *</Label>
          <Input
            id="doctor-rate"
            {...form.register("defaultCommissionRate")}
            invalid={Boolean(form.formState.errors.defaultCommissionRate)}
          />
          {form.formState.errors.defaultCommissionRate ? (
            <p className="mt-1 text-xs text-red-600">
              {form.formState.errors.defaultCommissionRate.message}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <Label>Bo'limlar</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {departmentsQuery.data?.results.map((d) => (
              <label
                key={d.id}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  value={d.id}
                  {...form.register("departmentIds")}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{d.name}</span>
              </label>
            ))}
            {departmentsQuery.data?.results.length === 0 ? (
              <p className="text-xs text-slate-500">
                Avval bo'lim yarating, so'ng shifokorni tayinlashingiz mumkin.
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </Modal>
  );
}
