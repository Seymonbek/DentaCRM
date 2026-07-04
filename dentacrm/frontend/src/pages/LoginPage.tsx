import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { normaliseApiError } from "@/api/client";
import { homeForRole } from "@/app/RoleGuard";
import { toast } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Telefon raqamini kiriting")
    .regex(/^\+?[0-9\s\-()]{7,20}$/u, "Xalqaro formatda kiriting"),
  password: z.string().min(1, "Parolni kiriting"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage(): JSX.Element {
  const login = useAuthStore((s) => s.login);
  const authStatus = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneNumber: "", password: "" },
  });

  if (authStatus === "authenticated" && user) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? homeForRole(user.role)} replace />;
  }

  const onSubmit = async (values: LoginValues): Promise<void> => {
    setSubmitError(null);
    try {
      await login(values.phoneNumber.trim(), values.password);
      const target = homeForRole(useAuthStore.getState().user?.role ?? "administrator");
      toast.success("Xush kelibsiz!", "Kirish");
      navigate(target, { replace: true });
    } catch (err) {
      const envelope = normaliseApiError(err);
      setSubmitError(envelope.error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">DentaCRM</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tizimga kirish uchun telefon raqami va parolingizni kiriting
          </p>
        </header>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Kirish formasi"
        >
          <div>
            <Label htmlFor="phoneNumber">Telefon raqami</Label>
            <Input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="+998901234567"
              invalid={Boolean(errors.phoneNumber)}
              aria-describedby={errors.phoneNumber ? "phone-err" : undefined}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber ? (
              <p id="phone-err" role="alert" className="mt-1 text-xs text-red-600">
                {errors.phoneNumber.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "pw-err" : undefined}
              {...register("password")}
            />
            {errors.password ? (
              <p id="pw-err" role="alert" className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {submitError}
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            )}
            Kirish
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Parolingizni unutdingizmi? Klinika administratoriga murojaat qiling.
        </p>
      </div>
    </main>
  );
}
