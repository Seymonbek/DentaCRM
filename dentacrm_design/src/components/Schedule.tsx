import React, { useState } from "react";
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  Search, 
  User, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Tag 
} from "lucide-react";
import { Patient, Appointment, Dentist } from "../types";

interface ScheduleProps {
  patients: Patient[];
  appointments: Appointment[];
  dentists: Dentist[];
  onAddAppointment: (appointment: Omit<Appointment, "id">) => void;
  onUpdateAppointmentStatus: (id: string, status: "scheduled" | "completed" | "cancelled") => void;
}

export default function Schedule({
  patients,
  appointments,
  dentists,
  onAddAppointment,
  onUpdateAppointmentStatus,
}: ScheduleProps) {
  // Filters & State
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-20"); // default to mock today
  const [selectedDentist, setSelectedDentist] = useState<string>("all");
  const [selectedChair, setSelectedChair] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states for booking
  const [formPatientId, setFormPatientId] = useState<string>("");
  const [formDentistId, setFormDentistId] = useState<string>("");
  const [formDate, setFormDate] = useState<string>("2026-07-20");
  const [formTime, setFormTime] = useState<string>("09:00");
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formTreatment, setFormTreatment] = useState<string>("Karies davolash");
  const [formChair, setFormChair] = useState<number>(1);
  const [formNotes, setFormNotes] = useState<string>("");

  // Filtering Logic
  const filteredAppointments = appointments.filter((app) => {
    const matchesDate = app.date === selectedDate;
    const matchesDentist = selectedDentist === "all" || app.dentistId === selectedDentist;
    const matchesChair = selectedChair === "all" || app.chairNumber.toString() === selectedChair;
    const matchesSearch = searchQuery === "" || 
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.treatmentType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesDentist && matchesChair && matchesSearch;
  });

  // Time blocks for day timeline rendering (08:00 to 18:00)
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientId || !formDentistId) {
      alert("Iltimos, bemor va shifokorni tanlang!");
      return;
    }

    const selectedPatient = patients.find(p => p.id === formPatientId);
    if (!selectedPatient) return;

    onAddAppointment({
      patientId: formPatientId,
      patientName: selectedPatient.name,
      dentistId: formDentistId,
      date: formDate,
      time: formTime,
      duration: formDuration,
      treatmentType: formTreatment,
      status: "scheduled",
      chairNumber: formChair,
      notes: formNotes,
    });

    // Reset and close
    setShowAddModal(false);
    setFormPatientId("");
    setFormDentistId("");
    setFormNotes("");
  };

  return (
    <div className="space-y-6" id="schedule-container">
      {/* Schedule Filters Header */}
      <div className="sleek-card rounded-2xl p-5 space-y-4" id="schedule-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 font-display">Qabullar Jadvali</h1>
            <p className="text-xs text-slate-400">Kunlik ish vaqti, shifokorlar bandligi va stomatologik kreslolar bo'linishi</p>
          </div>
          <button
            onClick={() => {
              // Pre-fill form values
              if (patients.length > 0) setFormPatientId(patients[0].id);
              if (dentists.length > 0) setFormDentistId(dentists[0].id);
              setShowAddModal(true);
            }}
            className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            id="open-booking-modal"
          >
            <PlusCircle size={16} /> Yangi Qabul Yozish
          </button>
        </div>

        {/* Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2" id="filters-bar">
          {/* Date Picker */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Sana</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
              id="filter-date"
            />
          </div>

          {/* Dentist Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Shifokor</label>
            <select
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
              id="filter-dentist"
            >
              <option value="all" className="bg-slate-900">Barcha shifokorlar</option>
              {dentists.map(d => (
                <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>
              ))}
            </select>
          </div>

          {/* Chair Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Kreslo (Kursi)</label>
            <select
              value={selectedChair}
              onChange={(e) => setSelectedChair(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
              id="filter-chair"
            >
              <option value="all" className="bg-slate-900">Barcha kreslolar</option>
              <option value="1" className="bg-slate-900">1-kreslo (Asosiy)</option>
              <option value="2" className="bg-slate-900">2-kreslo (Terapiya)</option>
              <option value="3" className="bg-slate-900">3-kreslo (Ortodontiya/Bolalar)</option>
            </select>
          </div>

          {/* Search Query */}
          <div className="space-y-1 sm:col-span-2 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Qidirish</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Bemor ismi yoki muolaja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                id="search-schedule"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Split into Two Columns: Left (List / Timeline view), Right (Dentist Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="schedule-main-layout">
        {/* Left Column (Appointments list / timeline layout) */}
        <div className="sleek-card rounded-2xl p-5 shadow-lg lg:col-span-2" id="timeline-panel">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
            <h2 className="text-base font-extrabold text-slate-200 font-display flex items-center gap-2">
              <CalendarDays className="text-sky-400" size={18} />
              Bemorlar qabul varaqalari
            </h2>
            <span className="text-xs bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-1 rounded-full font-bold">
              {filteredAppointments.length} ta yozuv topildi
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <CalendarDays size={48} className="mx-auto text-slate-600 mb-3" />
              <p className="text-xs font-bold text-slate-400">Ushbu kunga muolajalar yozilmagan yoki qidiruvga mos kelmadi.</p>
              <p className="text-[11px] text-slate-500 mt-1">Yangi bemor qabulini yozish uchun tepada "Yangi Qabul Yozish" tugmasini bosing.</p>
            </div>
          ) : (
            <div className="space-y-4" id="timeline-list">
              {filteredAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((app) => {
                  const dentist = dentists.find(d => d.id === app.dentistId);
                  const isCompleted = app.status === "completed";
                  const isCancelled = app.status === "cancelled";

                  return (
                    <div
                      key={app.id}
                      className={`border rounded-xl p-4 transition-all duration-200 ${
                        isCompleted 
                          ? "bg-slate-900/20 border-slate-800/40 opacity-70" 
                          : isCancelled 
                          ? "bg-rose-950/20 border-rose-900/30 opacity-60" 
                          : "bg-slate-800/30 border-slate-700/60 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5"
                      }`}
                      id={`schedule-item-card-${app.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex gap-3">
                          {/* Time tag */}
                          <div className="flex flex-col items-center justify-center bg-sky-500/10 text-sky-400 font-mono rounded-lg px-3 py-2 shrink-0 h-14 w-16 border border-sky-500/20">
                            <Clock size={14} className="mb-0.5 opacity-80" />
                            <span className="text-xs font-bold">{app.time}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-100">{app.patientName}</h3>
                              <span className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded font-medium">
                                {app.chairNumber}-kursi
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                ({app.duration} daqiqa)
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                              <Tag size={12} className="text-[#38bdf8]" />
                              <span>{app.treatmentType}</span>
                            </div>

                            {dentist && (
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold mt-1">
                                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dentist.color }}></span>
                                <span>{dentist.name} ({dentist.specialty})</span>
                              </div>
                            )}

                            {app.notes && (
                              <p className="bg-slate-950/40 text-slate-400 p-2 rounded-lg text-[10px] mt-2 border border-slate-800/40">
                                <strong>Eslatma:</strong> {app.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status & Actions Column */}
                        <div className="flex flex-col sm:items-end justify-between self-stretch shrink-0">
                          <div className="flex items-center gap-1">
                            {isCompleted && (
                              <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                                Davolandi (Yakunlandi)
                              </span>
                            )}
                            {isCancelled && (
                              <span className="text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-1 rounded">
                                Bekor qilindi
                              </span>
                            )}
                            {!isCompleted && !isCancelled && (
                              <span className="text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded animate-pulse">
                                Rejada (Kutilmoqda)
                              </span>
                            )}
                          </div>

                          {/* Action Buttons (Only when scheduled) */}
                          {!isCompleted && !isCancelled && (
                            <div className="flex gap-2 mt-3 sm:mt-0">
                              <button
                                onClick={() => onUpdateAppointmentStatus(app.id, "cancelled")}
                                className="bg-slate-800/60 text-rose-400 hover:bg-rose-950/30 border border-slate-700 hover:border-rose-500/30 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                                id={`cancel-app-btn-${app.id}`}
                              >
                                Bekor qilish
                              </button>
                              <button
                                onClick={() => onUpdateAppointmentStatus(app.id, "completed")}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                                id={`complete-app-btn-${app.id}`}
                              >
                                <CheckCircle size={12} /> Yakunlash
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Right Column (Dentist schedules summary & Clinic Hours) */}
        <div className="space-y-6" id="schedule-sidebar">
          {/* Clinic Hours & Contact Card */}
          <div className="sleek-card rounded-2xl p-5 shadow-lg" id="clinic-hours-card">
            <h3 className="text-base font-extrabold text-slate-200 font-display mb-3">Klinika Ish Tartibi</h3>
            <ul className="space-y-2 text-xs font-medium text-slate-300" id="hours-list">
              <li className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>Dushanba - Shanba</span>
                <span className="font-extrabold text-[#f8fafc]">08:00 - 19:00</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>Yakshanba</span>
                <span className="text-rose-400 font-extrabold">Faqat shoshilinch qabul</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span>Tushlik tanaffusi</span>
                <span className="font-semibold text-slate-300">13:00 - 14:00</span>
              </li>
              <li className="flex justify-between py-1.5">
                <span>Koll-Markaz</span>
                <span className="font-extrabold text-[#38bdf8]">+998 71 200-30-40</span>
              </li>
            </ul>
          </div>

          {/* Dentists workload on selected date */}
          <div className="sleek-card rounded-2xl p-5 shadow-lg" id="dentists-workload-card">
            <h3 className="text-base font-extrabold text-slate-200 font-display mb-3">Shifokorlar bandligi ({selectedDate})</h3>
            <div className="space-y-4" id="workload-list">
              {dentists.map(dentist => {
                const dentistApps = appointments.filter(a => a.date === selectedDate && a.dentistId === dentist.id);
                const activeCount = dentistApps.filter(a => a.status === "scheduled").length;
                const completedCount = dentistApps.filter(a => a.status === "completed").length;
                const totalOnDay = dentistApps.length;

                return (
                  <div key={dentist.id} className="space-y-2" id={`workload-dentist-${dentist.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={dentist.photoUrl}
                          alt={dentist.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{dentist.name}</h4>
                          <p className="text-[10px] text-slate-400">{dentist.specialty}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                        {totalOnDay} qabul
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold pl-10">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                      <span>Kutilmoqda: {activeCount}</span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full ml-2"></span>
                      <span>Yakunlandi: {completedCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="booking-modal-overlay">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-scale-up" id="booking-modal-box">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-base font-extrabold text-slate-100 font-display">Yangi Qabulni Rasmiylashtirish</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                id="close-booking-modal-btn"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" id="booking-form">
              {/* Patient Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Bemor (Mijoz)</label>
                <select
                  value={formPatientId}
                  onChange={(e) => setFormPatientId(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  id="form-patient"
                  required
                >
                  <option value="" disabled className="bg-slate-900">Bemor tanlang...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900">{p.name} ({p.phone})</option>
                  ))}
                </select>
                <p className="text-[10px] text-sky-400 font-medium">Bemor ro'yxatda yo'q bo'lsa, avval Bemorlar bo'limida yarating.</p>
              </div>

              {/* Dentist Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Stomatolog Shifokor</label>
                <select
                  value={formDentistId}
                  onChange={(e) => setFormDentistId(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  id="form-dentist"
                  required
                >
                  <option value="" disabled className="bg-slate-900">Shifokor tanlang...</option>
                  {dentists.map(d => (
                    <option key={d.id} value={d.id} className="bg-slate-900">{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              {/* DateTime and Chair Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Sana</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    id="form-date"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Vaqt (HH:MM)</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    id="form-time"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Kursi (Kreslo)</label>
                  <select
                    value={formChair}
                    onChange={(e) => setFormChair(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    id="form-chair"
                  >
                    <option value={1} className="bg-slate-900">1-kreslo (Asosiy)</option>
                    <option value={2} className="bg-slate-900">2-kreslo (Terapiya)</option>
                    <option value={3} className="bg-slate-900">3-kreslo (Ortodontiya)</option>
                  </select>
                </div>
              </div>

              {/* Treatment Type and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Muolaja Turi</label>
                  <input
                    type="text"
                    placeholder="Masalan: Tish oqartirish, plomba..."
                    value={formTreatment}
                    onChange={(e) => setFormTreatment(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    id="form-treatment"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Davomiyligi (daqiqa)</label>
                  <input
                    type="number"
                    min={10}
                    max={240}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    id="form-duration"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Klinik qaydlar (shifokor uchun)</label>
                <textarea
                  placeholder="Bemor shikoyatlari, anamnez va boshqa maxsus eslatmalar..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 h-20 resize-none focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  id="form-notes"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                  id="cancel-booking-form-btn"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                  id="submit-booking-form-btn"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
