import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3, Building2, CalendarDays, ClipboardList, Cog, CreditCard,
  LayoutDashboard, Package, Stethoscope, Trophy, UserPlus, Users, Wallet,
  ChevronRight, ChevronLeft, LogOut, Settings, User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import type { UserRole } from "@/types";

interface NavItem {
  to:       string;
  label:    string;
  icon:     LucideIcon;
  roles:    UserRole[];
  section?: string;
}

const NAV: NavItem[] = [
  { to: "/dashboard",        label: "Boshqaruv",      icon: LayoutDashboard, roles: ["bosh_shifokor", "doctor", "administrator"], section: "Asosiy"  },
  { to: "/departments",      label: "Bo'limlar",       icon: Building2,       roles: ["bosh_shifokor"]                                                  },
  { to: "/doctors",          label: "Shifokorlar",     icon: Stethoscope,     roles: ["bosh_shifokor"]                                                  },
  { to: "/finance",          label: "Moliya",          icon: Wallet,          roles: ["bosh_shifokor"]                                                  },
  { to: "/reports",          label: "Hisobotlar",      icon: BarChart3,       roles: ["bosh_shifokor"]                                                  },
  { to: "/my-appointments",  label: "Navbatlarim",     icon: CalendarDays,    roles: ["doctor"],                                section: "Asosiy"    },
  { to: "/my-patients",      label: "Bemorlar",        icon: Users,           roles: ["bosh_shifokor", "doctor", "administrator"], section: "Bemorlar"  },
  { to: "/inventory",        label: "Omborxona",       icon: Package,         roles: ["bosh_shifokor", "doctor", "administrator"]                       },
  { to: "/ratings",          label: "Reyting",         icon: Trophy,          roles: ["bosh_shifokor", "doctor"]                                        },
  { to: "/schedule",         label: "Jadval",          icon: CalendarDays,    roles: ["bosh_shifokor", "administrator"],         section: "Boshqaruv" },
  { to: "/patients/new",     label: "Bemor qo'shish",  icon: UserPlus,        roles: ["bosh_shifokor", "administrator"]                                 },
  { to: "/appointments/new", label: "Navbat berish",   icon: ClipboardList,   roles: ["bosh_shifokor", "administrator"]                                 },
  { to: "/payments/new",     label: "To'lov",          icon: CreditCard,      roles: ["bosh_shifokor", "doctor", "administrator"]                       },
  { to: "/settings",         label: "Sozlamalar",      icon: Cog,             roles: ["bosh_shifokor", "doctor", "administrator"], section: "Tizim"    },
];

const ROLE_LABELS: Record<string, string> = {
  bosh_shifokor: "Bosh shifokor",
  doctor:        "Shifokor",
  administrator:  "Administrator",
};

export function Sidebar(): JSX.Element {
  const user            = useAuthStore((s) => s.user);
  const logout          = useAuthStore((s) => s.logout);
  const sidebarOpen     = useUiStore((s) => s.sidebarOpen);
  const setSidebar      = useUiStore((s) => s.setSidebar);
  const toggleSidebar   = useUiStore((s) => s.toggleSidebar);
  const collapsed       = useUiStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useUiStore((s) => s.toggleSidebarCollapsed);
  const navigate        = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const role  = user?.role;
  const items = role ? NAV.filter((item) => item.roles.includes(role)) : [];

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Group by section
  const sections: { title: string; items: NavItem[] }[] = [];
  let currentSection = "";
  for (const item of items) {
    if (item.section && item.section !== currentSection) {
      currentSection = item.section;
      sections.push({ title: currentSection, items: [item] });
    } else if (sections.length === 0) {
      sections.push({ title: "", items: [item] });
    } else {
      sections[sections.length - 1].items.push(item);
    }
  }

  const sidebarW = collapsed ? "w-[70px]" : "w-[240px]";

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebar(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col",
          sidebarW,
          "transition-all duration-300 ease-spring lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-[4px_0_40px_rgba(0,0,0,0.25)]" : "-translate-x-full",
          "glass"
        )}
        style={{
          borderRight:  "1px solid var(--glass-border)",
        }}
        aria-label="Asosiy navigatsiya"
      >
        {/* Ambient glow top */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,1) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Ambient glow bottom */}
        <div
          className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,1) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* ── Logo ─────────────────────────────────────────── */}
        <div
          className={cn(
            "relative flex h-[60px] shrink-0 items-center gap-3 border-b",
            collapsed ? "justify-center px-0" : "px-4",
          )}
          style={{ borderColor: "var(--glass-border)" }}
        >
          {/* Logo mark */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background:  "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
              boxShadow:   "0 0 20px rgba(56, 189, 248, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C9.5 2 7.5 3.2 6.5 5c-.8 1.5-.8 3.2-.2 4.8L7 12c.3.9.5 2 .5 3s-.2 2.5-.5 3.5c-.2.8-.3 1.5.2 2.2.4.5 1 .8 1.8.8s1.2-.5 1.5-1c.3-.6.5-1.5.5-2.5s.2-2 .5-2 .5 1 .5 2 .2 1.9.5 2.5c.3.5.7 1 1.5 1s1.4-.3 1.8-.8c.5-.7.4-1.4.2-2.2-.3-1-.5-2.2-.5-3.5s.2-2.1.5-3l.7-2.2c.6-1.6.6-3.3-.2-4.8C16.5 3.2 14.5 2 12 2z" />
            </svg>
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display text-[16px] font-extrabold tracking-tight text-fg leading-none block">
                Denta<span className="gradient-text font-black">CRM</span>
              </span>
              <p className="text-[10px] text-fg-3 mt-0.5 leading-none">Klinika tizimi</p>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            aria-label={collapsed ? "Kengaytirish" : "Yig'ish"}
            onClick={toggleCollapsed}
            className={cn(
              "hidden lg:flex absolute -right-3 h-6 w-6 items-center justify-center rounded-full",
              "border text-fg-3 hover:text-fg transition-all duration-150 hover:scale-110",
            )}
            style={{
              background:   "var(--card-bg)",
              borderColor:  "var(--glass-border)",
              boxShadow:    "var(--shadow-sm)",
            }}
          >
            {collapsed
              ? <ChevronRight className="h-3 w-3" />
              : <ChevronLeft  className="h-3 w-3" />
            }
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
          {sections.map((sec) => (
            <div key={sec.title || "main"} className={collapsed ? "px-2" : "px-3"}>
              {sec.title && !collapsed ? (
                <p className="px-2.5 mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-fg-3 select-none">
                  {sec.title}
                </p>
              ) : sec.title && collapsed ? (
                <div className="my-1.5 h-px bg-fg-3/10" />
              ) : null}

              <div className="space-y-0.5">
                {sec.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    onClick={() => setSidebar(false)}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-3 rounded-xl text-[13px] font-medium",
                        "transition-all duration-200 ease-spring select-none",
                        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                        isActive
                          ? "text-[hsl(var(--color-primary))]"
                          : "text-fg-3 hover:text-fg",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active background pill */}
                        {isActive && (
                          <span
                            className="absolute inset-0 rounded-xl"
                            style={{
                              background:  "linear-gradient(135deg, hsla(var(--color-primary)/0.18) 0%, rgba(14,165,233,0.10) 100%)",
                              border:      "1px solid hsla(var(--color-primary)/0.25)",
                              boxShadow:   "inset 0 1px 0 rgba(255,255,255,0.06)",
                            }}
                            aria-hidden="true"
                          />
                        )}
                        <item.icon
                          className={cn(
                            "relative h-4 w-4 shrink-0 transition-all duration-200",
                            isActive
                              ? "text-[hsl(var(--color-primary))]"
                              : "text-fg-3 group-hover:text-fg",
                          )}
                          aria-hidden="true"
                        />
                        {!collapsed && (
                          <>
                            <span className="relative flex-1">{item.label}</span>
                            {isActive && (
                              <ChevronRight className="relative h-3 w-3 text-[hsl(var(--color-primary))]/60 shrink-0" />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Profile footer ────────────────────────────────── */}
        {user && (
          <div
            className="shrink-0 p-3 relative"
            style={{ borderTop: "1px solid var(--glass-border)" }}
            ref={profileRef}
          >
            {/* Profile dropdown */}
            {profileOpen && !collapsed && (
              <div
                className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl overflow-hidden animate-scale-in"
                style={{
                  background:  "var(--card-bg)",
                  border:      "1px solid var(--glass-border)",
                  boxShadow:   "var(--shadow-lg)",
                  animationDuration: "130ms",
                }}
              >
                {/* Info section */}
                <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
                  <p className="text-[13px] font-bold text-fg truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[11px] text-fg-3 mt-0.5">{ROLE_LABELS[user.role] ?? user.role}</p>
                </div>
                {/* Actions */}
                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => { navigate("/settings"); setProfileOpen(false); setSidebar(false); }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-fg-2 hover:bg-fg-3/10 transition-all duration-150"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Sozlamalar
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500/80 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-150"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Chiqish
                  </button>
                  </div>
              </div>
            )}

            {/* Profile button */}
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              title={collapsed ? `${user.firstName} ${user.lastName}` : undefined}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl transition-all duration-150",
                collapsed ? "justify-center p-2" : "px-3 py-2.5",
                "hover:bg-fg-3/10",
                profileOpen && "bg-fg-3/5",
              )}
            >
              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white select-none"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                  boxShadow:  "0 0 12px rgba(20,184,166,0.40)",
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>

              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-[12px] font-semibold text-fg-2 leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-fg-3 truncate capitalize mt-0.5">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </p>
                  </div>
                  {/* Online dot */}
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse-soft" />
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
