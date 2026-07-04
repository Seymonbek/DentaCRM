import { LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const ROLE_LABEL: Record<string, string> = {
  bosh_shifokor: "Bosh shifokor",
  doctor: "Shifokor",
  administrator: "Administrator",
};

export function Header(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Sidebarni ochish/yopish"
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>
      <div className="flex-1" />
      {user ? (
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-500">
              {ROLE_LABEL[user.role] ?? user.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="Tizimdan chiqish"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </header>
  );
}
