import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { homeForRole } from "@/app/RoleGuard";
import { useAuthStore } from "@/store/authStore";

export function NotFoundPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const target = user ? homeForRole(user.role) : "/login";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sahifa topilmadi</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        So'ralgan sahifa mavjud emas yoki siz unga kirish huquqiga ega emassiz.
      </p>
      <Button asChild className="mt-6">
        <Link to={target}>Bosh sahifaga qaytish</Link>
      </Button>
    </main>
  );
}
