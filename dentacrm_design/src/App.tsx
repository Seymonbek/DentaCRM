import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Package, 
  DollarSign, 
  Settings, 
  Clock, 
  Menu, 
  X,
  Plus,
  Activity,
  Heart,
  BriefcaseMedical
} from "lucide-react";

import { 
  Patient, 
  Appointment, 
  InventoryItem, 
  Transaction, 
  Dentist, 
  ToothStatus, 
  PatientTreatment 
} from "./types";

import { 
  MOCK_PATIENTS, 
  MOCK_APPOINTMENTS, 
  MOCK_INVENTORY, 
  MOCK_TRANSACTIONS, 
  MOCK_DENTISTS,
  loadData,
  saveData 
} from "./data/mockData";

import Dashboard from "./components/Dashboard";
import Schedule from "./components/Schedule";
import PatientCards from "./components/PatientCards";
import Inventory from "./components/Inventory";
import Finance from "./components/Finance";

export default function App() {
  // 1. Centralized persistent states
  const [patients, setPatients] = useState<Patient[]>(() => 
    loadData<Patient[]>("patients", MOCK_PATIENTS)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    loadData<Appointment[]>("appointments", MOCK_APPOINTMENTS)
  );
  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    loadData<InventoryItem[]>("inventory", MOCK_INVENTORY)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadData<Transaction[]>("transactions", MOCK_TRANSACTIONS)
  );
  const [dentists] = useState<Dentist[]>(() => 
    MOCK_DENTISTS
  );

  // Layout states
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Save changes to localStorage whenever states change
  useEffect(() => {
    saveData("patients", patients);
  }, [patients]);

  useEffect(() => {
    saveData("appointments", appointments);
  }, [appointments]);

  useEffect(() => {
    saveData("inventory", inventory);
  }, [inventory]);

  useEffect(() => {
    saveData("transactions", transactions);
  }, [transactions]);

  // Clock tick simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Core Business Logic Helpers & Handlers

  // Handle appointment completion & trigger automated supply depletion
  const handleCompleteAppointment = (id: string) => {
    setAppointments((prevApps) =>
      prevApps.map((app) => {
        if (app.id === id) {
          // Trigger financial income log
          const incomeAmount = 300000; // estimated income per standard completion
          const transactionNo = "TX-A" + Math.floor(10000 + Math.random() * 90000);
          
          const newTx: Transaction = {
            id: transactionNo,
            date: new Date().toISOString().split("T")[0],
            type: "income",
            amount: incomeAmount,
            category: "Terapiya",
            description: `${app.patientName} qabuli - Yakuniy to'lov`,
            patientId: app.patientId,
            patientName: app.patientName,
          };

          setTransactions((prevTx) => [newTx, ...prevTx]);

          // Automatically consume medical resources (Gloves & Anesthetic) as a high-fidelity dental simulator!
          setInventory((prevInv) =>
            prevInv.map((item) => {
              // Gloves: item with ID "inv-4"
              if (item.id === "inv-4") {
                return { ...item, quantity: Math.max(0, item.quantity - 2) }; // consumes 2 glove kits
              }
              // Anesthetics: item with ID "inv-2"
              if (item.id === "inv-2") {
                return { ...item, quantity: Math.max(0, item.quantity - 1) }; // consumes 1 ampoule
              }
              return item;
            })
          );

          return { ...app, status: "completed" };
        }
        return app;
      })
    );
  };

  // Status updates (Scheduled, Cancelled, Completed)
  const handleUpdateAppointmentStatus = (
    id: string,
    status: "scheduled" | "completed" | "cancelled"
  ) => {
    if (status === "completed") {
      handleCompleteAppointment(id);
    } else {
      setAppointments((prevApps) =>
        prevApps.map((app) => (app.id === id ? { ...app, status } : app))
      );
    }
  };

  // Add Appointment
  const handleAddAppointment = (newApp: Omit<Appointment, "id">) => {
    const id = "app-" + Math.floor(1000 + Math.random() * 9000);
    setAppointments((prev) => [...prev, { ...newApp, id }]);
  };

  // Add Patient
  const handleAddPatient = (
    newPatient: Omit<Patient, "id" | "registeredAt" | "toothStates" | "treatments">
  ) => {
    const id = "patient-" + Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().split("T")[0];
    
    // Create standard healthy tooth state map
    const defaultToothStates: Record<number, ToothStatus> = {};
    for (let i = 1; i <= 32; i++) {
      defaultToothStates[i] = ToothStatus.HEALTHY;
    }

    const patientRecord: Patient = {
      ...newPatient,
      id,
      registeredAt: dateStr,
      toothStates: defaultToothStates,
      treatments: [],
    };

    setPatients((prev) => [patientRecord, ...prev]);
  };

  // Update tooth status on Odontogram chart
  const handleUpdatePatientToothStates = (
    patientId: string,
    toothNumber: number,
    status: ToothStatus
  ) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === patientId) {
          const updatedToothStates = { ...p.toothStates, [toothNumber]: status };
          return { ...p, toothStates: updatedToothStates };
        }
        return p;
      })
    );
  };

  // Log dental treatment & optionally generate kassa revenue if completed
  const handleAddPatientTreatment = (
    patientId: string,
    treatment: Omit<PatientTreatment, "id">
  ) => {
    const id = "tr-" + Math.floor(1000 + Math.random() * 9000);
    const completedRecord: PatientTreatment = { ...treatment, id };

    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === patientId) {
          const updatedTreatments = [completedRecord, ...p.treatments];
          return { ...p, treatments: updatedTreatments };
        }
        return p;
      })
    );

    // If treatment is completed immediately, register automatic cashflow income
    if (treatment.status === "completed") {
      const p = patients.find((pat) => pat.id === patientId);
      const transactionNo = "TX-T" + Math.floor(10000 + Math.random() * 90000);
      
      const newTx: Transaction = {
        id: transactionNo,
        date: treatment.date,
        type: "income",
        amount: treatment.cost,
        category: "Stomatologiya muolajasi",
        description: `${treatment.description} (${p?.name || "Bemor"})`,
        patientId,
        patientName: p?.name,
      };

      setTransactions((prevTx) => [newTx, ...prevTx]);
    }
  };

  // Add inventory item
  const handleAddInventoryItem = (
    item: Omit<InventoryItem, "id" | "lastRestocked">
  ) => {
    const id = "inv-" + Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().split("T")[0];
    const newItem: InventoryItem = { ...item, id, lastRestocked: dateStr };
    setInventory((prev) => [...prev, newItem]);
  };

  // Manual stock edits
  const handleUpdateStock = (id: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Restock purchase & log financial expense
  const handleRestockItem = (id: string, addQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedQuantity = item.quantity + addQuantity;
          const cost = addQuantity * item.pricePerUnit;
          const dateStr = new Date().toISOString().split("T")[0];

          // Register transaction
          const transactionNo = "TX-E" + Math.floor(10000 + Math.random() * 90000);
          const newTx: Transaction = {
            id: transactionNo,
            date: dateStr,
            type: "expense",
            amount: cost,
            category: "Klinika jihozlari / Materiallar",
            description: `${item.name} to'ldirildi (+${addQuantity} ${item.unit})`,
          };

          setTransactions((prevTx) => [newTx, ...prevTx]);

          return { ...item, quantity: updatedQuantity, lastRestocked: dateStr };
        }
        return item;
      })
    );
  };

  // Add manual transaction
  const handleAddTransaction = (newTx: Omit<Transaction, "id" | "date">) => {
    const id = "TX-M" + Math.floor(10000 + Math.random() * 90000);
    const date = new Date().toISOString().split("T")[0];
    const transaction: Transaction = {
      ...newTx,
      id,
      date,
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans flex" id="dentacrm-root">
      
      {/* 1. Sidebar Navigation (Left Panel) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#020617] border-r border-slate-800/80 text-slate-100 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="sidebar"
      >
        <div className="flex flex-col gap-6 p-5">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2.5 border-b border-slate-800/60 pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#38bdf8] flex items-center justify-center text-slate-900 shadow-md shadow-sky-500/20">
              <BriefcaseMedical size={22} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight gradient-text">DentaCRM</span>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Klinika Tizimi</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" id="nav-links">
            <button
              onClick={() => { setActivePage("dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                activePage === "dashboard"
                  ? "bg-sky-500/10 text-sky-400 border-r-3 border-sky-400 rounded-l-xl rounded-r-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl"
              }`}
              id="nav-dashboard"
            >
              <LayoutDashboard size={18} className={activePage === "dashboard" ? "text-sky-400" : "text-slate-400"} />
              <span>Bosh sahifa</span>
            </button>

            <button
              onClick={() => { setActivePage("schedule"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                activePage === "schedule"
                  ? "bg-sky-500/10 text-sky-400 border-r-3 border-sky-400 rounded-l-xl rounded-r-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl"
              }`}
              id="nav-schedule"
            >
              <CalendarDays size={18} className={activePage === "schedule" ? "text-sky-400" : "text-slate-400"} />
              <span>Qabullar jadvali</span>
            </button>

            <button
              onClick={() => { setActivePage("patients"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                activePage === "patients"
                  ? "bg-sky-500/10 text-sky-400 border-r-3 border-sky-400 rounded-l-xl rounded-r-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl"
              }`}
              id="nav-patients"
            >
              <Users size={18} className={activePage === "patients" ? "text-sky-400" : "text-slate-400"} />
              <span>Bemorlar varaqalari</span>
            </button>

            <button
              onClick={() => { setActivePage("inventory"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                activePage === "inventory"
                  ? "bg-sky-500/10 text-sky-400 border-r-3 border-sky-400 rounded-l-xl rounded-r-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl"
              }`}
              id="nav-inventory"
            >
              <Package size={18} className={activePage === "inventory" ? "text-sky-400" : "text-slate-400"} />
              <span>Ombor & Dorilar</span>
            </button>

            <button
              onClick={() => { setActivePage("finance"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                activePage === "finance"
                  ? "bg-sky-500/10 text-sky-400 border-r-3 border-sky-400 rounded-l-xl rounded-r-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl"
              }`}
              id="nav-finance"
            >
              <DollarSign size={18} className={activePage === "finance" ? "text-sky-400" : "text-slate-400"} />
              <span>Moliya & Kassa</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Account Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80"
              alt="Admin Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#38bdf8]/40"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#f8fafc] truncate">Dr. Alisher Umarov</p>
              <p className="text-[10px] text-slate-400 font-bold truncate">Bosh Shifokor / Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]" id="workspace-wrapper">
        
        {/* Responsive Header Bar */}
        <header className="bg-[#020617]/50 backdrop-blur-md border-b border-slate-800/80 h-16 flex items-center justify-between px-6 shrink-0" id="header-bar">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg md:hidden cursor-pointer"
              id="mobile-sidebar-toggle"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden sm:block">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bugungi Sana</span>
              <p className="text-xs font-extrabold text-slate-200">Dushanba, 20-Iyul, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Realtime Clock widget */}
            <div className="flex items-center gap-1.5 bg-slate-800/40 border border-slate-700/60 px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold text-sky-400 shadow-sm" id="realtime-clock">
              <Clock size={14} className="text-sky-400 animate-spin-slow" />
              <span>{currentTime || "09:00:00"}</span>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <span className="text-xs font-bold text-slate-300 hidden md:block">Yunusobod Shoxobchasi</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-950/50 animate-pulse"></span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Screen Workspace */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0b0f19]" id="inner-view-container">
          
          {activePage === "dashboard" && (
            <Dashboard
              patients={patients}
              appointments={appointments}
              inventory={inventory}
              transactions={transactions}
              dentists={dentists}
              onNavigate={(page) => setActivePage(page)}
              onCompleteAppointment={handleCompleteAppointment}
              onAddAppointmentClick={() => setActivePage("schedule")}
            />
          )}

          {activePage === "schedule" && (
            <Schedule
              patients={patients}
              appointments={appointments}
              dentists={dentists}
              onAddAppointment={handleAddAppointment}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            />
          )}

          {activePage === "patients" && (
            <PatientCards
              patients={patients}
              dentists={dentists}
              onAddPatient={handleAddPatient}
              onUpdatePatientToothStates={handleUpdatePatientToothStates}
              onAddPatientTreatment={handleAddPatientTreatment}
            />
          )}

          {activePage === "inventory" && (
            <Inventory
              inventory={inventory}
              onAddInventoryItem={handleAddInventoryItem}
              onUpdateStock={handleUpdateStock}
              onRestockItem={handleRestockItem}
            />
          )}

          {activePage === "finance" && (
            <Finance
              transactions={transactions}
              patients={patients}
              dentists={dentists}
              onAddTransaction={handleAddTransaction}
            />
          )}

        </main>
      </div>
    </div>
  );
}
