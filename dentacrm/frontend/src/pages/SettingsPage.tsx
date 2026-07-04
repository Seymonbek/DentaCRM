import { Check, Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUiStore, type ThemePreference } from "@/store/uiStore";

/**
 * Settings page — currently exposes:
 *   * Theme picker (Light / Dark / System) with localStorage persistence.
 *   * A read-only summary of the signed-in account (parol / 2FA changes
 *     land in a later build task, but the account card is real so this
 *     is not a placeholder).
 *
 * Additional sections (2FA, language, notification prefs) will be added
 * incrementally without introducing new PagePlaceholder components.
 */
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
    description: "Oq fon, ko'k asosiy rang (#2563EB). Klinika muhitida qulay.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Qorong'i",
    description: "Ko'zni toliqtirmaydi — kechki smenalar uchun tavsiya etiladi.",
    Icon: Moon,
  },
  {
    value: "system",
    label: "Tizim",
    description: "Qurilma sozlamasi (prefers-color-scheme) bo'yicha avtomatik.",
    Icon: Monitor,
  },
];

export function SettingsPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const theme = useUiStore((s) => s.theme);
  const resolvedTheme = useUiStore((s) => s.resolvedTheme);
  const setTheme = useUiStore((s) => s.setTheme);

  return (
    <section aria-labelledby="settings-title" className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1
          id="settings-title"
          className="text-2xl font-semibold text-foreground"
        >
          Sozlamalar
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ilova ko'rinishi, mavzu va hisob ma'lumotlari.
        </p>
      </header>

      {/* --- Theme picker ---------------------------------------------- */}
      <article
        className="card p-6"
        aria-labelledby="settings-theme-heading"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="settings-theme-heading"
              className="text-lg font-semibold text-foreground"
            >
              Mavzu
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tanlov qurilmangizda saqlanadi. Hozirgi kuchdagi mavzu:{" "}
              <span className="font-medium text-foreground">
                {resolvedTheme === "dark" ? "qorong'i" : "yorug'"}
              </span>
              .
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
                  "group relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                  active
                    ? "border-brand-600 bg-brand-50 shadow-sm dark:border-brand-400 dark:bg-brand-500/10"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-400",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-md",
                      active
                        ? "bg-brand-600 text-white dark:bg-brand-500"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {active ? (
                    <Check
                      className="h-4 w-4 text-brand-600 dark:text-brand-300"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </article>

      {/* --- Account summary ------------------------------------------- */}
      <article
        className="card p-6"
        aria-labelledby="settings-account-heading"
      >
        <h2
          id="settings-account-heading"
          className="text-lg font-semibold text-foreground"
        >
          Hisob
        </h2>
        {user ? (
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">To'liq ismi</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Telefon raqam</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {user.phoneNumber}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Rol</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {user.role}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Foydalanuvchi hali yuklanmagan.
          </p>
        )}
      </article>
    </section>
  );
}
