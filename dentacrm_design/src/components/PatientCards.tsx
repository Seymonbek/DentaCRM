import React, { useState } from "react";
import { 
  Users, 
  Search, 
  PlusCircle, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Droplet, 
  AlertTriangle, 
  ClipboardList, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  Activity, 
  ChevronRight,
  Stethoscope,
  BriefcaseMedical
} from "lucide-react";
import { Patient, Dentist, ToothStatus, PatientTreatment } from "../types";
import TreatmentVisualizer from "./TreatmentVisualizer";

interface PatientCardsProps {
  patients: Patient[];
  dentists: Dentist[];
  onAddPatient: (patient: Omit<Patient, "id" | "registeredAt" | "toothStates" | "treatments">) => void;
  onUpdatePatientToothStates: (id: string, toothNumber: number, status: ToothStatus) => void;
  onAddPatientTreatment: (patientId: string, treatment: Omit<PatientTreatment, "id">) => void;
}

export default function PatientCards({
  patients,
  dentists,
  onAddPatient,
  onUpdatePatientToothStates,
  onAddPatientTreatment,
}: PatientCardsProps) {
  // Navigation & selection
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"odontogram" | "history" | "notes">("odontogram");

  // Patient registration form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGender, setNewGender] = useState("Ayol");
  const [newBirthDate, setNewBirthDate] = useState("1995-01-01");
  const [newAddress, setNewAddress] = useState("");
  const [newBloodType, setNewBloodType] = useState("A (II) Rh+");
  const [newAllergies, setNewAllergies] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Treatment recording form state
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [treatmentDesc, setTreatmentDesc] = useState("Plomba qo'yish");
  const [treatmentCost, setTreatmentCost] = useState(300000);
  const [treatmentStatus, setTreatmentStatus] = useState<"planned" | "completed">("completed");
  const [treatmentTooth, setTreatmentTooth] = useState<number | "">("");
  const [treatmentDentist, setTreatmentDentist] = useState(dentists[0]?.name || "");

  // Filtering
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      alert("Iltimos, ism va telefon raqamini kiriting!");
      return;
    }
    onAddPatient({
      name: newName,
      phone: newPhone,
      email: newEmail,
      gender: newGender,
      birthDate: newBirthDate,
      address: newAddress,
      bloodType: newBloodType,
      allergies: newAllergies,
      notes: newNotes,
    });
    
    // Reset and close
    setShowAddForm(false);
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewAddress("");
    setNewAllergies("");
    setNewNotes("");
  };

  const handleTreatmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    onAddPatientTreatment(selectedPatient.id, {
      date: new Date().toISOString().split('T')[0],
      description: treatmentDesc,
      cost: Number(treatmentCost),
      status: treatmentStatus,
      toothNumber: treatmentTooth !== "" ? Number(treatmentTooth) : undefined,
      dentistName: treatmentDentist,
    });

    setShowTreatmentForm(false);
    setTreatmentDesc("Plomba qo'yish");
    setTreatmentCost(300000);
    setTreatmentTooth("");
  };

  const getAge = (birthDateStr: string) => {
    if (!birthDateStr) return "";
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age + " yosh";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="patient-cards-workspace">
      
      {/* Left Column: Patient Search and Selector List */}
      <div className="sleek-card rounded-2xl p-5 space-y-4" id="patient-list-sidebar">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-200 flex items-center gap-2 font-display">
            <Users className="text-sky-400" size={20} />
            Bemorlar bo'limi
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="p-1.5 bg-sky-500/10 border border-sky-500/20 text-[#38bdf8] hover:bg-sky-500/20 rounded-lg transition-colors cursor-pointer"
            id="register-patient-btn"
            title="Yangi bemor ro'yxatdan o'tkazish"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Bemor ismini kiriting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
            id="search-patients"
          />
        </div>

        {/* Patient Selection list */}
        <div className="space-y-2 overflow-y-auto max-h-[520px] pr-1" id="patient-scroll-list">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-semibold">Hech qanday bemor topilmadi.</div>
          ) : (
            filteredPatients.map((p) => {
              const isActive = selectedPatient?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setActiveTab("odontogram"); // reset tab
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive 
                      ? "border-sky-500/40 bg-sky-500/10 shadow-lg shadow-sky-500/5" 
                      : "border-slate-800/60 bg-slate-950/20 hover:bg-slate-800/40 hover:border-slate-700/60"
                  }`}
                  id={`patient-select-item-${p.id}`}
                >
                  <div className="space-y-1">
                    <h4 className={`text-xs font-bold ${isActive ? "text-[#f8fafc]" : "text-slate-200"}`}>{p.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-0.5"><Phone size={10} /> {p.phone}</span>
                      <span>•</span>
                      <span>{getAge(p.birthDate)}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className={isActive ? "text-sky-400" : "text-slate-500"} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Detailed Clinical Card for Selected Patient */}
      <div className="lg:col-span-2 space-y-6" id="patient-detail-card">
        {selectedPatient ? (
          <>
            {/* Header Demographic Section */}
            <div className="sleek-card rounded-2xl p-5 space-y-4" id="demographic-card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-extrabold text-lg">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-extrabold text-slate-100 font-display">{selectedPatient.name}</h1>
                      <span className="bg-slate-950 text-slate-400 text-[10px] font-bold px-2 py-0.5 border border-slate-800 rounded-lg">
                        ID: #{selectedPatient.id.split('-')[1]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={12} className="text-sky-400" /> {selectedPatient.birthDate} ({getAge(selectedPatient.birthDate)})</span>
                      <span>•</span>
                      <span>Jinsi: {selectedPatient.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Quick New Treatment Trigger */}
                <button
                  onClick={() => {
                    if (dentists.length > 0) setTreatmentDentist(dentists[0].name);
                    setShowTreatmentForm(true);
                  }}
                  className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-sky-500/10 transition-all flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  id="add-treatment-quick-btn"
                >
                  <Plus size={14} /> Muolaja yozish
                </button>
              </div>

              {/* Patient Contact & Blood Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/60 text-xs font-semibold text-slate-300" id="contact-details-grid">
                <div className="flex items-center gap-1.5 p-2 bg-slate-950/40 border border-slate-800/40 rounded-xl">
                  <Phone size={14} className="text-sky-400 shrink-0" />
                  <span className="truncate">{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-950/40 border border-slate-800/40 rounded-xl">
                  <Mail size={14} className="text-sky-400 shrink-0" />
                  <span className="truncate">{selectedPatient.email || "Email kiritilmagan"}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-950/40 border border-slate-800/40 rounded-xl">
                  <MapPin size={14} className="text-sky-400 shrink-0" />
                  <span className="truncate">{selectedPatient.address}</span>
                </div>
              </div>

              {/* Vital Warning Badges (Blood and Allergies) */}
              <div className="flex flex-wrap gap-2 pt-1" id="warning-badges-section">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/20">
                  <Droplet size={14} className="text-rose-400 fill-rose-950" />
                  Qon guruhi: {selectedPatient.bloodType}
                </span>

                {selectedPatient.allergies && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-300 text-xs font-extrabold rounded-lg border border-amber-500/20 animate-pulse">
                    <AlertTriangle size={14} className="text-amber-400" />
                    Allergiya: {selectedPatient.allergies}
                  </span>
                )}
              </div>
            </div>

            {/* Diagnostic tabs panel (Odontogram vs Treatment History vs Clinical Notes) */}
            <div className="sleek-card rounded-2xl shadow-lg overflow-hidden" id="diagnostics-panel">
              {/* Tab headers */}
              <div className="bg-slate-950/40 border-b border-slate-800/60 flex p-1" id="tab-headers">
                <button
                  onClick={() => setActiveTab("odontogram")}
                  className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "odontogram"
                      ? "bg-slate-800/80 text-sky-400 border border-slate-700/50 shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                  }`}
                  id="tab-odontogram-btn"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Activity size={14} /> Tish Xaritasi
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-slate-800/80 text-sky-400 border border-slate-700/50 shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                  }`}
                  id="tab-history-btn"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ClipboardList size={14} /> Davolanish Tarixi
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "notes"
                      ? "bg-slate-800/80 text-sky-400 border border-slate-700/50 shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                  }`}
                  id="tab-notes-btn"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Stethoscope size={14} /> Klinik Qaydlar
                  </span>
                </button>
              </div>

              {/* Tab contents */}
              <div className="p-5" id="tab-content-body">
                {activeTab === "odontogram" && (
                  <TreatmentVisualizer
                    toothStates={selectedPatient.toothStates}
                    onToothStatusChange={(toothNum, status) => {
                      onUpdatePatientToothStates(selectedPatient.id, toothNum, status);
                    }}
                  />
                )}

                {activeTab === "history" && (
                  <div className="space-y-4" id="patient-treatments-history">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-slate-200">Muolajalar va Davo choralari hisoboti</h3>
                      <button
                        onClick={() => setShowTreatmentForm(true)}
                        className="text-xs text-[#38bdf8] hover:text-sky-300 font-bold flex items-center gap-0.5"
                        id="add-treatment-history-shortcut"
                      >
                        <Plus size={14} /> Yangi Muolaja
                      </button>
                    </div>

                    {selectedPatient.treatments.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs font-semibold">Hech qanday muolaja qayd etilmagan.</div>
                    ) : (
                      <div className="space-y-3" id="treatments-log-list">
                        {selectedPatient.treatments
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((tr) => (
                            <div
                              key={tr.id}
                              className="p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              id={`treatment-log-item-${tr.id}`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-xs font-bold text-slate-200">{tr.description}</h4>
                                  {tr.toothNumber && (
                                    <span className="bg-sky-500/10 text-[#38bdf8] border border-sky-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      {tr.toothNumber}-tish
                                    </span>
                                  )}
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                    tr.status === "completed" 
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" 
                                      : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                                  }`}>
                                    {tr.status === "completed" ? "Yakunlandi" : "Rejalashtirildi"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                                  <span>Sana: {tr.date}</span>
                                  <span>•</span>
                                  <span>Shifokor: {tr.dentistName}</span>
                                </div>
                              </div>
                              <div className="text-right text-xs font-extrabold text-[#f8fafc] font-mono">
                                {tr.cost.toLocaleString("uz-UZ")} so'm
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="space-y-4 text-xs text-slate-300 font-medium" id="patient-clinical-notes-tab">
                    <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-2">
                      <h3 className="font-bold text-slate-200 flex items-center gap-1 text-sm">
                        <BriefcaseMedical size={16} className="text-sky-400" />
                        Tashrif davomida olingan anamnez ma'lumotlari:
                      </h3>
                      <p className="leading-relaxed whitespace-pre-wrap">{selectedPatient.notes || "Hech qanday maxsus klinik qaydlar yozilmagan."}</p>
                    </div>

                    <div className="p-3 bg-sky-500/5 text-sky-300 border border-sky-500/10 rounded-xl">
                      <p className="font-bold">Kasallik varaqasini to'ldirish eslatmasi:</p>
                      <p className="mt-1 leading-relaxed text-slate-300 text-[11px]">
                        Kasal varaqasida keltirilgan allergiya va anamnez ko'rsatkichlari har safar bemor tish davolatganda, shifokor dori dozalarini tanlayotganda yoki og'riqsizlantirish anesteziyasini amalga oshirayotganda e'tibor qilinishi majburiy hisoblanadi.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="sleek-card rounded-2xl p-10 text-center text-slate-400">
            Klinika bemorlari ro'yxati bo'sh. Yarating.
          </div>
        )}
      </div>

      {/* 1. Add Patient Modal Dialog */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="add-patient-overlay">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scale-up" id="add-patient-box">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-base font-extrabold text-slate-100 font-display">Yangi Bemor Kasallik Varaqasini Ochish</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-slate-200 font-bold cursor-pointer transition-colors"
                id="close-add-patient-modal"
              >
                Yopish
              </button>
            </div>

            <form onSubmit={handlePatientSubmit} className="space-y-4" id="add-patient-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Ism va Familiya</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Masalan: Bekzodbek Alimov"
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Telefon raqam</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+998 90 123-45-67"
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Email (Ixtiyoriy)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="alimov@gmail.com"
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Tug'ilgan sana</label>
                  <input
                    type="date"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Jinsi</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  >
                    <option value="Erkak" className="bg-slate-900">Erkak</option>
                    <option value="Ayol" className="bg-slate-900">Ayol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Qon guruhi</label>
                  <select
                    value={newBloodType}
                    onChange={(e) => setNewBloodType(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  >
                    <option value="O (I) Rh+" className="bg-slate-900">O (I) Rh+</option>
                    <option value="O (I) Rh-" className="bg-slate-900">O (I) Rh-</option>
                    <option value="A (II) Rh+" className="bg-slate-900">A (II) Rh+</option>
                    <option value="A (II) Rh-" className="bg-slate-900">A (II) Rh-</option>
                    <option value="B (III) Rh+" className="bg-slate-900">B (III) Rh+</option>
                    <option value="B (III) Rh-" className="bg-slate-900">B (III) Rh-</option>
                    <option value="AB (IV) Rh+" className="bg-slate-900">AB (IV) Rh+</option>
                    <option value="AB (IV) Rh-" className="bg-slate-900">AB (IV) Rh-</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Allergiyalar (Lidokain, Penitsillin va hkz)</label>
                  <input
                    type="text"
                    value={newAllergies}
                    onChange={(e) => setNewAllergies(e.target.value)}
                    placeholder="Masalan: Lidokain (bo'lmasa bo'sh qoldiring)"
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Yashash manzili</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Masalan: Toshkent sh., Chilonzor 5-daha, 12-uy"
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Klinik qaydlar / Anamnez</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Kariesga moyillik, tish milkining yallig'lanishi va qo'shimcha tushuntirishlar..."
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 h-20 resize-none focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Bemor ochish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Record Treatment Modal Dialog */}
      {showTreatmentForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="treatment-modal-overlay">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-scale-up" id="treatment-modal-box">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-base font-extrabold text-slate-100 font-display">Muolaja hisoboti yozish</h2>
              <button
                onClick={() => setShowTreatmentForm(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer transition-colors"
                id="close-treatment-modal-btn"
              >
                Yopish
              </button>
            </div>

            <form onSubmit={handleTreatmentSubmit} className="space-y-4" id="treatment-record-form">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Davo muolajasi ta'rifi</label>
                <input
                  type="text"
                  value={treatmentDesc}
                  onChange={(e) => setTreatmentDesc(e.target.value)}
                  placeholder="Masalan: 3-tish kanalini tozalash..."
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Muolaja narxi (Summada)</label>
                  <input
                    type="number"
                    min={0}
                    value={treatmentCost}
                    onChange={(e) => setTreatmentCost(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Tish raqami (Ixtiyoriy)</label>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    placeholder="Masalan: 14"
                    value={treatmentTooth}
                    onChange={(e) => setTreatmentTooth(e.target.value !== "" ? Number(e.target.value) : "")}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Holat (Status)</label>
                  <select
                    value={treatmentStatus}
                    onChange={(e) => setTreatmentStatus(e.target.value as "planned" | "completed")}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  >
                    <option value="completed" className="bg-slate-900">Yakunlandi (Kassa tushumi)</option>
                    <option value="planned" className="bg-slate-900">Rejalashtirildi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Shifokor</label>
                  <select
                    value={treatmentDentist}
                    onChange={(e) => setTreatmentDentist(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  >
                    {dentists.map(d => (
                      <option key={d.id} value={d.name} className="bg-slate-900">{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {treatmentStatus === "completed" && (
                <div className="p-2.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-xl text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0 animate-pulse" />
                  Eslatma: Ushbu muolaja yakunlangan deb qayd etilsa, Klinika kassasiga avtomatik tushum kiritiladi!
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowTreatmentForm(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Qayd qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
