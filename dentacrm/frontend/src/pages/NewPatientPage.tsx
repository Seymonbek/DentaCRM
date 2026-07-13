import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatientForm } from "@/components/forms/PatientForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";

export function NewPatientPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="page-title" className="mx-auto max-w-3xl page-enter">
      <PageHeader
        title="Yangi bemor"
        description="Yangi bemorni ro'yxatga olish va aloqa ma'lumotlarini kiritish."
        icon={<User className="h-5 w-5" />}
        actions={
          <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>
        }
      />
      <div className="card p-6">
        <PatientForm submitLabel="Bemorni saqlash" />
      </div>
    </section>
  );
}
