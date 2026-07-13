import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { homeForRole } from "@/app/RoleGuard";
import { useAuthStore } from "@/store/authStore";

export function NotFoundPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const target = user ? homeForRole(user.role) : "/login";

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-brand-600/6 blur-[80px]" />

      <div className="relative animate-scale-in">
        {/* 404 number */}
        <p className="font-display text-[120px] font-bold leading-none tracking-tighter text-border select-none">
          404
        </p>

        <div className="-mt-4">
          <h1 className="text-xl font-bold text-fg">Sahifa topilmadi</h1>
          <p className="mt-2 text-sm text-fg-3 max-w-sm mx-auto leading-relaxed">
            So'ralgan sahifa mavjud emas yoki siz unga kirish huquqiga ega emassiz.
          </p>
        </div>

        <Button asChild className="mt-8">
          <Link to={target}>← Bosh sahifaga qaytish</Link>
        </Button>
      </div>
    </main>
  );
}
