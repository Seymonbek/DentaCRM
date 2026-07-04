import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Cog,
  CreditCard,
  LayoutDashboard,
  Package,
  Stethoscope,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import type { UserRole } from "@/types";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const NAV: NavItem[] = [
  {
    to: "/dashboard",
    label: "Boshqaruv paneli",
    icon: LayoutDashboard,
    roles: ["bosh_shifokor"],
  },
  {
    to: "/departments",
    label: "Bo'limlar",
    icon: Building2,
    roles: ["bosh_shifokor"],
  },
  {
    to: "/doctors",
    label: "Shifokorlar",
    icon: Stethoscope,
    roles: ["bosh_shifokor"],
  },
  {
    to: "/finance",
    label: "Moliya",
    icon: Wallet,
    roles: ["bosh_shifokor"],
  },
  {
    to: "/inventory",
    label: "Omborxona",
    icon: Package,
    roles: ["bosh_shifokor", "doctor"],
  },
  {
    to: "/ratings",
    label: "Reyting",
    icon: Trophy,
    roles: ["bosh_shifokor", "doctor"],
  },
  {
    to: "/my-appointments",
    label: "Mening navbatlarim",
    icon: CalendarDays,
    roles: ["doctor"],
  },
  {
    to: "/my-patients",
    label: "Mening bemorlarim",
    icon: Users,
    roles: ["doctor"],
  },
  {
    to: "/schedule",
    label: "Jadval",
    icon: CalendarDays,
    roles: ["administrator"],
  },
  {
    to: "/patients/new",
    label: "Bemor qo'shish",
    icon: UserPlus,
    roles: ["administrator"],
  },
  {
    to: "/appointments/new",
    label: "Navbat berish",
    icon: ClipboardList,
    roles: ["administrator"],
  },
  {
    to: "/payments/new",
    label: "To'lov qabul qilish",
    icon: CreditCard,
    roles: ["administrator"],
  },
  {
    to: "/reports",
    label: "Hisobotlar",
    icon: BarChart3,
    roles: ["bosh_shifokor"],
  },
  {
    to: "/settings",
    label: "Sozlamalar",
    icon: Cog,
    roles: ["bosh_shifokor", "doctor", "administrator"],
  },
];

export function Sidebar(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const role = user?.role;

  const items = role ? NAV.filter((item) => item.roles.includes(role)) : [];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-0 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
      aria-label="Asosiy navigatsiya"
    >
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <span className="text-lg font-semibold text-brand-700">DentaCRM</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:bg-slate-100",
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
        v0.1.0
      </div>
    </aside>
  );
}
