import { useState } from "react";
import { Check, Monitor, Moon, Sun, ShieldCheck, ShieldAlert, Key, User, Save, Info, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUiStore, type ThemePreference } from "@/store/uiStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { updateProfile, enable2FA, disable2FA } from "@/api/auth";
import { toast } from "@/store/notificationStore";
import { normaliseApiError } from "@/api/client";

const ROLE_LABELS: Record<string, string> = {
  bosh_shifokor: "Bosh shifokor",
  doctor:        "Shifokor",
  administrator: "Administrator",
};

interface ThemeOption {
  value: ThemePreference;
  label: string;
  description: string;
  Icon: typeof Sun;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Yorug'",
    description: "Oq fon. Klinika muhitida qulay.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Qorong'i",
    description: "Ko'zni toliqtirmaydi — kechki smenalar uchun.",
    Icon: Moon,
  },
  {
    value: "system",
    label: "Tizim",
    description: "Qurilma sozlamasi bo'yicha avtomatik.",
    Icon: Monitor,
  },
];

export function SettingsPage(): JSX.Element {
  const user          = useAuthStore((s) => s.user);
  const setUser       = useAuthStore((s) => s.setUser);
  const theme         = useUiStore((s) => s.theme);
  const resolvedTheme = useUiStore((s) => s.resolvedTheme);
  const setTheme      = useUiStore((s) => s.setTheme);

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [telegramChatId, setTelegramChatId] = useState<string>(
    user?.telegramChatId ? String(user.telegramChatId) : ""
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 2FA States
  const [show2faConfirm, setShow2faConfirm] = useState(false);
  const [password2fa, setPassword2fa] = useState("");
  const [isToggling2fa, setIsToggling2fa] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Ism va familiya maydonlari to'ldirilishi shart.");
      return;
    }

    setIsSavingProfile(true);
    try {
      const parsedChatId = telegramChatId.trim() ? Number(telegramChatId.trim()) : null;
      if (telegramChatId.trim() && isNaN(Number(telegramChatId.trim()))) {
        toast.error("Telegram Chat ID faqat raqamlardan iborat bo'lishi kerak.");
        setIsSavingProfile(false);
        return;
      }

      const updated = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        telegramChatId: parsedChatId,
      });

      setUser(updated);
      toast.success("Profil ma'lumotlari muvaffaqiyatli saqlandi.");
    } catch (err) {
      const envelope = normaliseApiError(err);
      toast.error(envelope.error.message || "Profilni saqlashda xatolik yuz berdi.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleToggle2FA(e: React.FormEvent) {
    e.preventDefault();
    if (!password2fa) {
      toast.error("Parolingizni kiriting.");
      return;
    }

    setIsToggling2fa(true);
    try {
      const isEnabling = !user?.twoFactorEnabled;
      let response;
      if (isEnabling) {
        response = await enable2FA(password2fa);
      } else {
        response = await disable2FA(password2fa);
      }

      // Update local user state
      if (user) {
        setUser({
          ...user,
          twoFactorEnabled: response.twoFactorEnabled,
        });
      }

      toast.success(response.detail);
      setShow2faConfirm(false);
      setPassword2fa("");
    } catch (err) {
      const envelope = normaliseApiError(err);
      toast.error(envelope.error.message || "Xavfsizlik sozlamalarini yangilashda xatolik.");
    } finally {
      setIsToggling2fa(false);
    }
  }

  return (
    <section aria-labelledby="settings-title" className="max-w-4xl space-y-6 pb-12">
      <PageHeader
        title="Sozlamalar"
        description="Ilova ko'rinishi, shaxsiy profil va hisob xavfsizligini boshqarish."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* ── LEFT COLUMN: Profile & Theme (colspan 2) ──────────────────────── */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Shaxsiy ma'lumotlar Card */}
          <article className="card p-6" aria-labelledby="settings-profile-heading">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400">
                <User className="h-5 w-5" />
              </span>
              <div>
                <h2 id="settings-profile-heading" className="text-[16px] font-semibold text-fg leading-none">
                  Shaxsiy profil
                </h2>
                <p className="mt-1 text-xs text-fg-3">Profil ma'lumotlarini tahrirlang.</p>
              </div>
            </div>

            {user ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name-input" className="block text-xs font-semibold text-fg-2 mb-1.5">
                      Ism
                    </label>
                    <input
                      id="first-name-input"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name-input" className="block text-xs font-semibold text-fg-2 mb-1.5">
                      Familiya
                    </label>
                    <input
                      id="last-name-input"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Familiyangizni kiriting"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-fg-2 mb-1.5">
                    Telefon raqam (O'zgartirib bo'lmaydi)
                  </label>
                  <input
                    type="text"
                    value={user.phoneNumber}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed bg-white/[0.02]"
                  />
                </div>

                <div>
                  <label htmlFor="telegram-chat-id-input" className="block text-xs font-semibold text-fg-2 mb-1.5">
                    Telegram Chat ID
                  </label>
                  <input
                    id="telegram-chat-id-input"
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="Masalan, 123456789"
                    className="input-field"
                  />
                  <div className="mt-2 flex items-start gap-2 text-[11px] text-fg-3 leading-relaxed">
                    <Info className="h-3.5 w-3.5 shrink-0 text-violet-400 mt-0.5" />
                    <span>
                      Chat ID orqali Telegramda kirish kodlari va bildirishnomalarni olasiz. ID ni bilish uchun{" "}
                      <a 
                        href="https://t.me/userinfobot" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-violet-400 hover:underline inline-flex items-center gap-0.5"
                      >
                        @userinfobot
                      </a>{" "}
                      yoki klinikamiz botiga yozishingiz mumkin.
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isSavingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    O'zgarishlarni saqlash
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center text-sm text-fg-3">Foydalanuvchi ma'lumotlari yuklanmoqda...</div>
            )}
          </article>

          {/* Mavzu Card */}
          <article className="card p-6" aria-labelledby="settings-theme-heading">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400">
                <Sun className="h-5 w-5" />
              </span>
              <div>
                <h2 id="settings-theme-heading" className="text-[16px] font-semibold text-fg leading-none">
                  Mavzu sozlamalari
                </h2>
                <p className="mt-1 text-xs text-fg-3">
                  Ilovaning umumiy ko'rinish mavzusini tanlang. Aktiv:{" "}
                  <span className="font-semibold text-violet-400">
                    {resolvedTheme === "dark" ? "Qorong'i" : "Yorug'"}
                  </span>
                </p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label="Mavzu tanlovi"
              className="grid gap-3 sm:grid-cols-3"
            >
              {THEME_OPTIONS.map(({ value, label, description, Icon }) => {
                const active = theme === value;
                return (
                  <button
                    type="button"
                    key={value}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setTheme(value)}
                    data-theme-option={value}
                    className={cn(
                      "group relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left",
                      "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active
                        ? "border-brand-500/60 bg-brand-600/5 shadow-sm dark:border-brand-400/40 dark:bg-brand-500/8"
                        : "border-border hover:border-brand-400/40 hover:bg-surface-2",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                        active
                          ? "bg-brand-600 text-white"
                          : "bg-surface-2 text-fg-3 group-hover:bg-brand-600/10 group-hover:text-brand-600",
                      )}>
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      {active ? (
                        <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-fg">{label}</p>
                      <p className="mt-0.5 text-xs text-fg-3 leading-snug">{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        {/* ── RIGHT COLUMN: Security & 2FA ───────────────────────────────── */}
        <div className="space-y-6">
          {/* Xavfsizlik va 2FA Card */}
          <article className="card p-6 relative overflow-hidden" aria-labelledby="settings-security-heading">
            {/* Background specular lighting */}
            <div 
              className="absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-10 blur-xl pointer-events-none"
              style={{ background: user?.twoFactorEnabled ? "radial-gradient(circle, #10b981, transparent)" : "radial-gradient(circle, #ef4444, transparent)" }}
            />

            <div className="flex items-center gap-3 mb-6">
              <span className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                user?.twoFactorEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              )}>
                {user?.twoFactorEnabled ? (
                  <ShieldCheck className="h-5 w-5 animate-pulse-soft" />
                ) : (
                  <ShieldAlert className="h-5 w-5" />
                )}
              </span>
              <div>
                <h2 id="settings-security-heading" className="text-[16px] font-semibold text-fg leading-none">
                  Xavfsizlik
                </h2>
                <p className="mt-1 text-xs text-fg-3">Ikki bosqichli himoya (2FA).</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl p-3.5 bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg-2">Holati:</span>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full select-none",
                    user?.twoFactorEnabled 
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35"
                      : "bg-rose-500/15 text-rose-400 border border-rose-500/35"
                  )}>
                    {user?.twoFactorEnabled ? "Yoqilgan" : "O'chirilgan"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-fg-3 leading-relaxed">
                2FA yoqilganda, har safar yangi qurilmadan tizimga kirganingizda parolingizdan tashqari Telegram orqali yuboriladigan 6 xonali tasdiqlash kodi talab qilinadi.
              </p>

              {/* Action buttons */}
              {!show2faConfirm ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!user?.telegramChatId) {
                      toast.warning("2FA ni yoqish uchun avval Telegram Chat ID ni saqlashingiz kerak.");
                      return;
                    }
                    setShow2faConfirm(true);
                  }}
                  className={cn(
                    "w-full btn flex items-center justify-center gap-2 py-2.5",
                    user?.twoFactorEnabled 
                      ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25"
                  )}
                >
                  <Key className="h-4 w-4" />
                  {user?.twoFactorEnabled ? "2FA ni o'chirish" : "2FA ni faollashtirish"}
                </button>
              ) : (
                <form onSubmit={handleToggle2FA} className="space-y-3 pt-2 border-t border-white/[0.06] animate-scale-in">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Amalni tasdiqlash uchun parolingizni kiriting:</span>
                  </div>
                  <input
                    type="password"
                    value={password2fa}
                    onChange={(e) => setPassword2fa(e.target.value)}
                    placeholder="Joriy parolingiz"
                    className="input-field"
                    autoFocus
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShow2faConfirm(false);
                        setPassword2fa("");
                      }}
                      className="flex-1 btn bg-white/[0.06] hover:bg-white/[0.12] text-fg-2 py-2"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={isToggling2fa || !password2fa}
                      className={cn(
                        "flex-1 btn flex items-center justify-center gap-1.5 py-2",
                        user?.twoFactorEnabled 
                          ? "bg-rose-600 hover:bg-rose-500 text-white" 
                          : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      )}
                    >
                      {isToggling2fa && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Tasdiqlash
                    </button>
                  </div>
                </form>
              )}
            </div>
          </article>

          {/* Profil ma'lumotlari haqida ma'lumot Card */}
          <article className="card p-5 bg-white/[0.01]" aria-labelledby="settings-info-heading">
            <h3 id="settings-info-heading" className="text-xs font-bold text-fg uppercase tracking-widest mb-3 opacity-60">Hisob turi</h3>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 text-sm font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fg truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-fg-3 mt-0.5">
                  Rol: <span className="text-violet-400 font-medium">{user ? (ROLE_LABELS[user.role] ?? user.role) : ""}</span>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
