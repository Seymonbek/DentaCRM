import { useState, useCallback, useEffect } from "react";
import { LogOut, Menu, Bell, Search, Command, X, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { GlobalSearch, useSearchShortcut } from "@/components/ui/GlobalSearch";
import { listNotifications } from "@/api/notifications";
import type { NotificationLog } from "@/types";

const ROLE_LABEL: Record<string, string> = {
  bosh_shifokor: "Bosh shifokor",
  doctor:        "Shifokor",
  administrator: "Administrator",
};

const TYPE_LABELS: Record<string, string> = {
  "inventory.low_stock": "Zaxira kam qoldi",
  "appointments.reminder_1d": "Navbat eslatmasi (1 kun)",
  "appointments.reminder_2h": "Navbat eslatmasi (2 soat)",
  "appointments.cancelled": "Navbat bekor qilindi",
  "prescriptions.sent": "Retsept yuborildi",
  "payments.received": "To'lov qabul qilindi",
  "patients.followup_invite": "Profilaktik taklif",
  "patients.new": "Yangi bemor",
  "ratings.milestone": "Reyting yutug'i",
  "generic": "Bildirishnoma",
};

const READ_NOTIFS_KEY = "dentacrm.readNotifications";

function getReadNotifs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(READ_NOTIFS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveReadNotifs(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function formatTimeAgo(isoString: string | null): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Hozir";
    
    const diffMins = Math.floor(diffMs / 60_000);
    if (diffMins < 1) return "Hozir";
    if (diffMins < 60) return `${diffMins} daq`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} soat`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} kun`;
  } catch {
    return "";
  }
}

export function Header(): JSX.Element {
  const user          = useAuthStore((s) => s.user);
  const logout        = useAuthStore((s) => s.logout);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate      = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [readIds, setReadIds]       = useState<string[]>(() => getReadNotifs());

  // Load real user notifications via React Query (refetch every 30s)
  const notificationsQ = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications({ pageSize: 20 }),
    refetchInterval: 30_000,
    enabled: !!user,
  });

  const notifications = notificationsQ.data?.results ?? [];
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const openSearch  = useCallback(() => setSearchOpen(true),  []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useSearchShortcut(openSearch);

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    const newReadIds = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(newReadIds);
    saveReadNotifs(newReadIds);
  };

  const markRead = (id: string) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      saveReadNotifs(newReadIds);
    }
  };

  const handleNotifClick = (n: NotificationLog) => {
    markRead(n.id);
    setNotifOpen(false);
    
    // Deep linking based on context
    if (n.context?.patientId) {
      navigate(`/patients/${n.context.patientId}`);
    } else if (n.context?.appointmentId) {
      navigate("/appointments");
    } else if (n.context?.treatmentId) {
      navigate("/treatments");
    } else if (n.context?.materialId) {
      navigate("/inventory");
    }
  };

  return (
    <>
      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onClose={closeSearch} />

      <header
        className={cn(
          "sticky top-0 z-20 flex h-[60px] shrink-0 items-center gap-2.5 px-4 sm:px-5",
          "transition-all duration-200",
        )}
        style={{
          background:   "linear-gradient(180deg, hsl(252 28% 5% / 0.95) 0%, hsl(252 25% 4% / 0.9) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          id="sidebar-toggle"
          aria-label="Menyuni ochish"
          className={cn(
            "lg:hidden -ml-1 flex h-9 w-9 items-center justify-center",
            "rounded-xl text-white/50 hover:bg-white/[0.07] hover:text-white",
            "transition-all duration-150 active:scale-95",
          )}
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* ── Search trigger ────────────────────────────────── */}
        <button
          type="button"
          id="search-trigger"
          aria-label="Qidirish (⌘K)"
          onClick={openSearch}
          className={cn(
            "hidden md:flex flex-1 max-w-sm items-center gap-2.5 rounded-xl px-3.5 py-2",
            "text-white/35 text-[13px] cursor-text text-left",
            "transition-all duration-200 hover:text-white/60",
          )}
          style={{
            background:  "rgba(255,255,255,0.04)",
            border:      "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,77,255,0.35)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-white/30" aria-hidden="true" />
          <span className="flex-1 select-none">Qidirish…</span>
          <span className="hidden lg:flex items-center gap-0.5">
            <kbd
              className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono text-white/25"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >⌘</kbd>
            <kbd
              className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono text-white/25"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >K</kbd>
          </span>
        </button>

        {/* Mobile search icon */}
        <button
          type="button"
          onClick={openSearch}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-white/50 hover:bg-white/[0.07] hover:text-white transition-all duration-150 active:scale-95"
          aria-label="Qidirish"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Right actions ─────────────────────────────────── */}
        <div className="flex items-center gap-1">

          {/* Notifications */}
          <div className="relative">
            <button
              id="notifications-btn"
              aria-label="Bildirishnomalar"
              aria-expanded={notifOpen}
              onClick={() => setNotifOpen((o) => !o)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-xl",
                "text-white/50 hover:bg-white/[0.07] hover:text-white",
                "transition-all duration-150 active:scale-95",
                notifOpen && "bg-white/[0.07] text-white",
              )}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white animate-pulse-soft"
                  style={{ background: "hsl(var(--color-primary))", boxShadow: "0 0 6px hsl(var(--color-primary)/0.6)" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} aria-hidden="true" />
                <div
                  className="absolute right-0 top-full mt-2 w-[320px] rounded-2xl overflow-hidden z-20 animate-scale-in"
                  style={{
                    background:  "hsl(252 28% 7%)",
                    border:      "1px solid rgba(255,255,255,0.08)",
                    boxShadow:   "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                    animationDuration: "140ms",
                    transformOrigin: "top right",
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3.5 border-b"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <p className="text-[13px] font-bold text-white">Bildirishnomalar</p>
                      {unreadCount > 0 && (
                        <p className="text-[11px] text-white/40 mt-0.5">{unreadCount} ta o'qilmagan</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-[11px] text-violet-400 hover:text-violet-300 font-medium transition-colors"
                        >
                          Hammasini o'qildi qilish
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-all"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* List */}
                  <ul className="max-h-[300px] overflow-y-auto divide-y" style={{ divideColor: "rgba(255,255,255,0.04)" }}>
                    {notifications.length === 0 ? (
                      <li className="px-4 py-8 text-center text-xs text-white/35">
                        Bildirishnomalar mavjud emas
                      </li>
                    ) : (
                      notifications.map((n) => {
                        const isRead = readIds.includes(n.id);
                        const label = TYPE_LABELS[n.type] ?? "Bildirishnoma";
                        return (
                          <li
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer",
                              "hover:bg-white/[0.03]",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                                isRead ? "bg-white/10" : "bg-violet-500",
                              )}
                              style={isRead ? {} : { boxShadow: "0 0 6px rgba(139,92,246,0.7)" }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className={cn("text-[11px] font-bold uppercase tracking-wider", isRead ? "text-white/20" : "text-violet-400")}>
                                {label}
                              </p>
                              <p className={cn("text-[12px] leading-snug mt-0.5", isRead ? "text-white/40" : "text-white/80 font-medium")}>
                                {n.message}
                              </p>
                              <p className="text-[10px] text-white/25 mt-1">{formatTimeAgo(n.createdAt)} oldin</p>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>

                  {/* Footer */}
                  <div
                    className="px-4 py-3 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                  >
                    <p className="text-[11px] text-center text-white/25">So'nggi 20 ta bildirishnoma</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <span className="mx-1 h-5 w-px bg-white/[0.08]" />

          {/* User profile */}
          {user && (
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-bold text-white select-none cursor-pointer"
                onClick={() => navigate("/settings")}
                style={{
                  background: "linear-gradient(135deg, #6d4dff, #a855f7)",
                  boxShadow:  "0 0 12px rgba(109,77,255,0.40)",
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>

              {/* Name/role — hidden on small screens */}
              <div className="hidden sm:block leading-tight cursor-pointer" onClick={() => navigate("/settings")}>
                <p className="text-[13px] font-semibold text-white leading-none mb-0.5">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-white/40 leading-none">
                  {ROLE_LABEL[user.role] ?? user.role}
                </p>
              </div>

              {/* Settings */}
              <button
                type="button"
                onClick={() => navigate("/settings")}
                aria-label="Sozlamalar"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:bg-white/[0.07] hover:text-white transition-all duration-150 active:scale-95"
              >
                <Settings className="h-4 w-4" />
              </button>

              {/* Logout */}
              <button
                id="logout-btn"
                type="button"
                onClick={logout}
                aria-label="Chiqish"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
