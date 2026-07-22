import React from "react";
import { 
  DollarSign, 
  Users, 
  CalendarDays, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  Plus, 
  CheckCircle,
  Clock,
  BriefcaseMedical
} from "lucide-react";
import { Patient, Appointment, InventoryItem, Transaction, Dentist } from "../types";

interface DashboardProps {
  patients: Patient[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  dentists: Dentist[];
  onNavigate: (page: string) => void;
  onCompleteAppointment: (id: string) => void;
  onAddAppointmentClick: () => void;
}

export default function Dashboard({
  patients,
  appointments,
  inventory,
  transactions,
  dentists,
  onNavigate,
  onCompleteAppointment,
  onAddAppointmentClick,
}: DashboardProps) {
  // Format currency to Uzbek Soum (UZS)
  const formatUZS = (num: number) => {
    return num.toLocaleString("uz-UZ") + " so'm";
  };

  // 1. Stats calculation
  const totalRevenue = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpense;

  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
  
  // Today's appointments (hardcoded as matching 2026-07-20 in mockData)
  const todayStr = "2026-07-20";
  const todayAppointments = appointments.filter(app => app.date === todayStr);
  const pendingToday = todayAppointments.filter(app => app.status === "scheduled");

  // Chart data calculations: Income vs Expenses by Category
  const categoriesData = React.useMemo(() => {
    const incomeByCat: Record<string, number> = {};
    transactions
      .filter(t => t.type === "income")
      .forEach(t => {
        incomeByCat[t.category] = (incomeByCat[t.category] || 0) + t.amount;
      });
    return Object.entries(incomeByCat).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const maxCategoryValue = Math.max(...categoriesData.map(c => c.value), 1);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Hero Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#020617] border border-slate-800/80 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden" id="hero-panel">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none flex items-center justify-center translate-x-12">
          <BriefcaseMedical size={280} className="text-sky-500" />
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Klinika Markazi
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 font-display">
            DentaCRM <span className="gradient-text font-black">Tizimiga</span> xush kelibsiz!
          </h1>
          <p className="text-slate-300 mt-2 text-xs leading-relaxed">
            Klinikangizning bugungi ko'rsatkichlari, mijozlar qabuli jadvali va dori-darmonlar zaxirasini bitta interaktiv ekranda boshqaring.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={onAddAppointmentClick}
              className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
              id="quick-add-app-btn"
            >
              <Plus size={16} /> Yangi Qabul Qo'shish
            </button>
            <button
              onClick={() => onNavigate("patients")}
              className="bg-slate-800/60 hover:bg-slate-700 text-slate-200 hover:text-white transition-all font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              id="quick-view-patients-btn"
            >
              <Users size={16} /> Bemorlar Ro'yxati
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Stat 1: Revenue */}
        <div className="sleek-card sleek-card-hover rounded-2xl p-5 relative" id="stat-card-revenue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Umumiy Tushum</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">{formatUZS(totalRevenue)}</h3>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400 font-bold">
              <TrendingUp size={14} />
              <span>+14.5% o'sish (bu oy)</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Net Profit */}
        <div className="sleek-card sleek-card-hover rounded-2xl p-5 relative" id="stat-card-profit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sof Foyda</span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">{formatUZS(netProfit)}</h3>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
              <span>Xarajatlar: {formatUZS(totalExpense)}</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Patients */}
        <div className="sleek-card sleek-card-hover rounded-2xl p-5 relative" id="stat-card-patients">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faol Bemorlar</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">{patients.length} nafar</h3>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-sky-400 font-bold">
              <ArrowUpRight size={14} />
              <span>+3 bemor bugun ro'yxatdan o'tdi</span>
            </div>
          </div>
        </div>

        {/* Stat 4: Inventory Alert */}
        <div className="sleek-card sleek-card-hover rounded-2xl p-5 relative" id="stat-card-inventory">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ombor Ogohlantirishi</span>
            <div className={`p-2 rounded-xl ${lowStockItems.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800/50 text-slate-400'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">
              {lowStockItems.length > 0 ? `${lowStockItems.length} dori kam qoldi` : "Hammasi yetarli"}
            </h3>
            <div className="flex items-center gap-1 mt-2 text-[11px] font-bold">
              {lowStockItems.length > 0 ? (
                <span className="text-amber-400 font-bold animate-pulse">Tezkor to'ldirish zarur</span>
              ) : (
                <span className="text-slate-400 font-medium">Zaxira tahlili me'yorda</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Warning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-analytics-section">
        {/* Visual Analytics Column */}
        <div className="sleek-card rounded-2xl p-5 shadow-lg lg:col-span-2" id="revenue-by-category-chart">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-200 font-display">Yo'nalishlar bo'yicha daromad tahlili</h2>
              <p className="text-xs text-slate-400">Muolaja turlarining klinikaga keltirgan foydasi</p>
            </div>
            <button
              onClick={() => onNavigate("finance")}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition-all cursor-pointer"
              id="view-financials-btn"
            >
              Moliya bo'limi <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4 py-3">
            {categoriesData.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">Moliyaviy ma'lumot topilmadi.</div>
            ) : (
              categoriesData.map((item, index) => {
                const percentage = Math.round((item.value / maxCategoryValue) * 100);
                const colors = [
                  "from-sky-400 to-blue-600",
                  "from-emerald-400 to-emerald-600",
                  "from-pink-400 to-rose-600",
                  "from-amber-400 to-orange-500",
                  "from-purple-400 to-violet-600"
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <div key={item.name} className="space-y-1.5" id={`category-chart-item-${index}`}>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-[#f8fafc] font-mono font-bold">{formatUZS(item.value)}</span>
                    </div>
                    <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden border border-slate-800/40">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-400" id="chart-legend">
            <span>Implantologiya, Terapiya, Ortopediya va Xirurgiya hisoboti</span>
            <span className="font-bold text-sky-400">Avtomatik yangilanadi</span>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="sleek-card rounded-2xl p-5 shadow-lg" id="low-stock-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-slate-200 font-display">Tugayotgan zaxiralar</h2>
            <button
              onClick={() => onNavigate("inventory")}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold transition-all cursor-pointer"
              id="go-to-inventory-btn"
            >
              Omborni boshqarish
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 space-y-2">
              <CheckCircle className="text-emerald-400" size={36} />
              <p className="text-xs font-bold text-slate-300">Barcha dorilar va jihozlar yetarli!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1" id="low-stock-list">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-center justify-between"
                  id={`low-stock-item-${item.id}`}
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">Yetkazib beruvchi: {item.supplier}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                      Kam: {item.quantity} {item.unit}
                    </span>
                    <p className="text-[9px] text-slate-500 mt-1">Me'yor: {item.minQuantity} {item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 bg-sky-500/5 border border-sky-500/10 rounded-xl flex gap-3 text-xs text-sky-300 items-start">
            <Clock size={16} className="mt-0.5 shrink-0 text-sky-400" />
            <p className="text-[11px] leading-relaxed text-slate-300"><strong>Eslatma:</strong> Dorilar zaxirasi har safar yangi qabul yakunlanib dori qo'llanganda avtomatik ravishda kamayadi.</p>
          </div>
        </div>
      </div>

      {/* Today's Appointments List */}
      <div className="sleek-card rounded-2xl p-5 shadow-lg" id="todays-appointments-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-200 font-display flex items-center gap-2">
              Bugungi qabullar ro'yxati <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded-full font-mono">{todayAppointments.length}</span>
            </h2>
            <p className="text-xs text-slate-400">Toshkent vaqti bilan: 20-Iyul, 2026</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate("schedule")}
              className="text-xs bg-slate-800/60 hover:bg-slate-700 text-slate-200 hover:text-white transition-all font-bold px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
              id="open-calendar-btn"
            >
              Taqvimni ko'rish
            </button>
          </div>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CalendarDays size={40} className="mx-auto text-slate-500 mb-2" />
            <p className="text-xs font-bold text-slate-400">Bugun hech qanday bemor yozilmagan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="todays-appointments-grid">
            {todayAppointments.map((app) => {
              const dentist = dentists.find(d => d.id === app.dentistId);
              const isCompleted = app.status === "completed";
              const isCancelled = app.status === "cancelled";

              return (
                <div
                  key={app.id}
                  className={`border rounded-xl p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                    isCompleted
                      ? "bg-slate-900/20 border-slate-800/40 opacity-70"
                      : isCancelled
                      ? "bg-rose-950/20 border-rose-900/30 opacity-60"
                      : "bg-slate-800/30 border-slate-700/60 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5"
                  }`}
                  id={`app-card-${app.id}`}
                >
                  <div className="space-y-3">
                    {/* Time & Chair & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        <Clock size={12} />
                        <span>{app.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                          {app.chairNumber}-kursi
                        </span>
                        {isCompleted && (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                            Tugallandi
                          </span>
                        )}
                        {isCancelled && (
                          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                            Bekor qilindi
                          </span>
                        )}
                        {!isCompleted && !isCancelled && (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                            Kutilmoqda
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Patient info */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{app.patientName}</h4>
                      <p className="text-xs text-[#38bdf8] font-bold mt-0.5">{app.treatmentType}</p>
                    </div>

                    {/* Dentist details */}
                    {dentist && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                        <img
                          src={dentist.photoUrl}
                          alt={dentist.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-[10px] font-bold text-slate-300">{dentist.name}</p>
                          <p className="text-[9px] text-slate-400">{dentist.specialty}</p>
                        </div>
                      </div>
                    )}

                    {app.notes && (
                      <div className="bg-slate-950/40 p-2 rounded-lg text-[10px] text-slate-400">
                        <strong>Eslatma:</strong> {app.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions (Only if active) */}
                  {!isCompleted && !isCancelled && (
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end gap-2">
                      <button
                        onClick={() => onCompleteAppointment(app.id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        id={`complete-btn-${app.id}`}
                      >
                        <CheckCircle size={12} /> Yakunlash
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
