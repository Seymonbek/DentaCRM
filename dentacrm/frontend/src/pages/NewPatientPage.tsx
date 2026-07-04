import { PatientForm } from "@/components/forms/PatientForm";

export function NewPatientPage(): JSX.Element {
  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1
          id="page-title"
          className="text-2xl font-semibold text-slate-900"
        >
          Yangi bemor
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Yangi bemorni ro'yxatga olish va aloqa ma'lumotlarini kiritish.
        </p>
      </div>
      <PatientForm submitLabel="Bemorni saqlash" />
    </section>
  );
}
