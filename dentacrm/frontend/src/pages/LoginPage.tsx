import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, Phone, Lock, ShieldCheck, Sparkles } from "lucide-react";

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
      toast.success("Xush kelibsiz!", "Tizimga muvaffaqiyatli kirdingiz");
      navigate(target, { replace: true });
    } catch (err) {
      const envelope = normaliseApiError(err);
      setSubmitError(envelope.error.message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* ── Animated ambient background ────────────────────────── */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a0614 0%, #0d0920 40%, #080d1a 100%)" }} />

      {/* Orbs */}
      <div
        className="ambient-orb orb-1"
        style={{ width: 700, height: 700, top: -250, left: -200, background: "radial-gradient(circle, rgba(109,77,255,0.55) 0%, transparent 65%)" }}
      />
      <div
        className="ambient-orb orb-2"
        style={{ width: 600, height: 600, bottom: -200, right: -150, background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 65%)" }}
      />
      <div
        className="ambient-orb orb-3"
        style={{ width: 400, height: 400, top: "40%", right: "15%", background: "radial-gradient(circle, rgba(59,130,246,0.30) 0%, transparent 65%)" }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Card container ─────────────────────────────────────── */}
      <div className="relative w-full max-w-[400px] mx-4 animate-scale-in">

        {/* Floating badge */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold text-violet-300"
            style={{
              background: "rgba(109,77,255,0.15)",
              border: "1px solid rgba(109,77,255,0.30)",
              backdropFilter: "blur(12px)",
            }}
          >
            <ShieldCheck className="h-3 w-3" />
            Xavfsiz kirish
          </div>
        </div>

        {/* Logo & title */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl relative"
            style={{
              background: "linear-gradient(135deg, #6d4dff 0%, #a855f7 100%)",
              boxShadow: "0 0 40px rgba(109,77,255,0.60), 0 0 80px rgba(109,77,255,0.20), inset 0 1px 0 rgba(255,255,255,0.30)",
            }}
          >
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C9.5 2 7.5 3.2 6.5 5c-.8 1.5-.8 3.2-.2 4.8L7 12c.3.9.5 2 .5 3s-.2 2.5-.5 3.5c-.2.8-.3 1.5.2 2.2.4.5 1 .8 1.8.8s1.2-.5 1.5-1c.3-.6.5-1.5.5-2.5s.2-2 .5-2 .5 1 .5 2 .2 1.9.5 2.5c.3.5.7 1 1.5 1s1.4-.3 1.8-.8c.5-.7.4-1.4.2-2.2-.3-1-.5-2.2-.5-3.5s.2-2.1.5-3l.7-2.2c.6-1.6.6-3.3-.2-4.8C16.5 3.2 14.5 2 12 2z" />
            </svg>
            {/* Sparkle */}
            <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse-soft" />
          </div>

          <div className="text-center">
            <h1 className="text-[28px] font-display font-bold tracking-tight text-white leading-none">
              Denta<span style={{ color: "#a78bfa" }}>CRM</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Klinika boshqaruv tizimi
            </p>
          </div>
        </div>

        {/* Glass Form card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: "rgba(15, 10, 30, 0.65)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Kirish formasi"
          >
            {/* Phone */}
            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-[12px] font-semibold text-slate-300 uppercase tracking-wider"
              >
                Telefon raqami
              </Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+998 90 123 45 67"
                  invalid={Boolean(errors.phoneNumber)}
                  aria-describedby={errors.phoneNumber ? "phone-err" : undefined}
                  className="pl-10 h-11 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-slate-600
                    focus:border-violet-500/60 focus:ring-violet-500/20 focus:bg-white/[0.08]
                    hover:border-white/[0.20] transition-all duration-200"
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber ? (
                <p id="phone-err" role="alert" className="field-error">
                  {errors.phoneNumber.message}
                </p>
              ) : null}
            </div>

            {/* Password */}
            <div>
              <Label
                htmlFor="password"
                className="text-[12px] font-semibold text-slate-300 uppercase tracking-wider"
              >
                Parol
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "pw-err" : undefined}
                  className="pl-10 h-11 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-slate-600
                    focus:border-violet-500/60 focus:ring-violet-500/20 focus:bg-white/[0.08]
                    hover:border-white/[0.20] transition-all duration-200"
                  {...register("password")}
                />
              </div>
              {errors.password ? (
                <p id="pw-err" role="alert" className="field-error">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            {/* Error banner */}
            {submitError ? (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in"
              >
                {submitError}
              </div>
            ) : null}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="btn-gradient w-full h-12 mt-2 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2.5
                disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isSubmitting ? "Kirilmoqda…" : "Tizimga kirish"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-slate-600">
          Parolni unutdingizmi?{" "}
          <span className="text-violet-400 font-medium hover:text-violet-300 cursor-pointer transition-colors">
            Administratorga murojaat qiling.
          </span>
        </p>
      </div>
    </main>
  );
}
