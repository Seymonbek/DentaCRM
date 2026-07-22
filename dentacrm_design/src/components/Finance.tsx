import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle, 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Check, 
  Printer, 
  Trash2,
  Stethoscope,
  XCircle,
  BriefcaseMedical
} from "lucide-react";
import { Transaction, Patient, Dentist } from "../types";

interface FinanceProps {
  transactions: Transaction[];
  patients: Patient[];
  dentists: Dentist[];
  onAddTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
}

export default function Finance({
  transactions,
  patients,
  dentists,
  onAddTransaction,
}: FinanceProps) {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Manual Transaction Form state
  const [amount, setAmount] = useState(250000);
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Terapiya");
  const [description, setDescription] = useState("");
  const [patientId, setPatientId] = useState("");

  // Invoice creator state
  const [invoicePatientId, setInvoicePatientId] = useState("");
  const [invoiceDentistName, setInvoiceDentistName] = useState(dentists[0]?.name || "");
  const [invoiceTreatment, setInvoiceTreatment] = useState("Plomba qo'yish (FDI 14-tish)");
  const [invoiceAmount, setInvoiceAmount] = useState(350000);
  const [generatedInvoice, setGeneratedInvoice] = useState<{
    invoiceNo: string;
    patientName: string;
    phone: string;
    dentistName: string;
    treatment: string;
    amount: number;
    date: string;
  } | null>(null);

  // Stats
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.patientName && t.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || t.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      alert("Iltimos, tavsif/mahsulot nomini kiriting!");
      return;
    }

    const linkedPatient = patients.find(p => p.id === patientId);

    onAddTransaction({
      type,
      amount: Number(amount),
      category,
      description,
      patientId: patientId ? patientId : undefined,
      patientName: linkedPatient ? linkedPatient.name : undefined,
    });

    setShowAddForm(false);
    setDescription("");
    setAmount(250000);
    setPatientId("");
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoicePatientId) {
      alert("Iltimos, bemor tanlang!");
      return;
    }

    const p = patients.find(patient => patient.id === invoicePatientId);
    if (!p) return;

    const invoiceNo = "INV-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toISOString().split('T')[0];

    // 1. Generate local state invoice for printer modal preview
    setGeneratedInvoice({
      invoiceNo,
      patientName: p.name,
      phone: p.phone,
      dentistName: invoiceDentistName,
      treatment: invoiceTreatment,
      amount: Number(invoiceAmount),
      date: dateStr,
    });

    // 2. Add as an income transaction to the main list
    onAddTransaction({
      type: "income",
      amount: Number(invoiceAmount),
      category: "Klinika xizmati (Invoys)",
      description: `${invoiceTreatment} - Kassa kirimi`,
      patientId: p.id,
      patientName: p.name,
    });

    // Reset Form
    setInvoicePatientId("");
    setInvoiceAmount(350000);
    setShowInvoiceModal(true);
  };

  return (
    <div className="space-y-6" id="finance-container">
      {/* Visual Cashflow index cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="finance-stat-cards">
        {/* Income Card */}
        <div className="sleek-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Umumiy Kirim (Tushum)</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-100 font-display">+{totalIncome.toLocaleString("uz-UZ")} so'm</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Barcha karies davolash, jarrohlik va implant tushumlari</p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="sleek-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Umumiy Chiqim (Xarajatlar)</span>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-100 font-display">-{totalExpense.toLocaleString("uz-UZ")} so'm</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Omborni to'ldirish, dori xarid qilish va maishiy chiqimlar</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="sleek-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kassa qoldig'i (Klinika balansi)</span>
            <div className={`p-2.5 rounded-xl border ${balance >= 0 ? 'bg-[#38bdf8]/10 text-[#38bdf8] border-sky-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-extrabold ${balance >= 0 ? 'text-[#38bdf8]' : 'text-rose-400'}`}>
              {balance.toLocaleString("uz-UZ")} so'm
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Sof foyda va unumdorlik me'yori</p>
          </div>
        </div>
      </div>

      {/* Finance Action Controls and Form sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="finance-actions-grid">
        
        {/* Left Columns (Ledgers List) */}
        <div className="sleek-card rounded-2xl p-5 lg:col-span-2 space-y-4" id="transaction-ledger">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 font-display">Kassa amaliyotlari jurnali</h2>
              <p className="text-xs text-slate-400">Kiruvchi va chiquvchi to'lovlar, invoyslar ro'yxati</p>
            </div>
            {/* Type buttons */}
            <div className="bg-slate-950/60 border border-slate-800 p-1 rounded-xl flex self-start sm:self-auto" id="type-selector">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${selectedType === "all" ? 'bg-slate-800 text-slate-100 border border-slate-700/50 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Hammasi
              </button>
              <button
                onClick={() => setSelectedType("income")}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${selectedType === "income" ? 'bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Kirimlar
              </button>
              <button
                onClick={() => setSelectedType("expense")}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${selectedType === "expense" ? 'bg-slate-800 text-rose-400 border border-slate-700/50 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Chiqimlar
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Jurnal bo'yicha qidirish (Tavsif, bemor ismi, toifa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800 rounded-xl pl-9 p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
              id="search-transactions"
            />
          </div>

          {/* Table list */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1" id="transactions-scroll-list">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-semibold">Moliya jurnalida hech qanday yozuv topilmadi.</div>
            ) : (
              filteredTransactions
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((t) => {
                  const isIncome = t.type === "income";
                  return (
                    <div
                      key={t.id}
                      className="p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl flex items-center justify-between gap-4"
                      id={`transaction-item-${t.id}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 border ${isIncome ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{t.description}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-semibold">
                            <span className="bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-bold">{t.category}</span>
                            <span>•</span>
                            <span className="font-mono">{t.date}</span>
                            {t.patientName && (
                              <>
                                <span>•</span>
                                <span className="text-[#38bdf8]">Bemor: {t.patientName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={`text-xs font-mono font-extrabold text-right shrink-0 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncome ? "+" : "-"}{t.amount.toLocaleString("uz-UZ")} so'm
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Right Column: Invoice Receipt Generator & Manual Add Form */}
        <div className="space-y-6" id="finance-sidebar">
          
          {/* Form 1: Generate Invoice Receipt */}
          <div className="sleek-card rounded-2xl p-5 space-y-4" id="invoice-generator-card">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 font-display">Tezkor Invoys (Chek) Yaratish</h3>
              <p className="text-xs text-slate-400">Bemor to'lovi uchun kvitansiya hisoboti</p>
            </div>

            <form onSubmit={handleGenerateInvoice} className="space-y-3" id="invoice-generator-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Bemor tanlang</label>
                <select
                  value={invoicePatientId}
                  onChange={(e) => setInvoicePatientId(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  required
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">Bemor tanlang...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Shifokor</label>
                <select
                  value={invoiceDentistName}
                  onChange={(e) => setInvoiceDentistName(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  required
                >
                  {dentists.map(d => (
                    <option key={d.id} value={d.name} className="bg-slate-900 text-slate-200">{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Bajarilgan muolaja ta'rifi</label>
                <input
                  type="text"
                  placeholder="Masalan: 14-tish sirkoniy toj qo'yish"
                  value={invoiceTreatment}
                  onChange={(e) => setInvoiceTreatment(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">To'lov summasi</label>
                <input
                  type="number"
                  min={1000}
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="generate-invoice-btn"
              >
                <FileText size={14} /> Invoys yaratish va hisoblash
              </button>
            </form>
          </div>

          {/* Form 2: Manual Incomes/Expenses */}
          <div className="sleek-card rounded-2xl p-5 space-y-4" id="manual-ledger-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-100 font-display">Manual Xarajat / Kirim</h3>
                <p className="text-xs text-slate-400">Boshqa xo'jalik yoki maishiy xarajatlarni kiritish</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs text-[#38bdf8] hover:text-sky-300 font-bold cursor-pointer transition-colors"
              >
                {showAddForm ? "Yopish" : "Ochish"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleManualSubmit} className="space-y-3 animate-slide-up" id="manual-transaction-form">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Turi</label>
                    <select
                      value={type}
                      onChange={(e) => {
                        const t = e.target.value as "income" | "expense";
                        setType(t);
                        setCategory(t === "income" ? "Terapiya" : "Maishiy xarajatlar");
                      }}
                      className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    >
                      <option value="income" className="bg-slate-900 text-slate-200">Kirim</option>
                      <option value="expense" className="bg-slate-900 text-slate-200">Chiqim</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Kategoriya</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    >
                      {type === "income" ? (
                        <>
                          <option value="Terapiya" className="bg-slate-900 text-slate-200">Terapiya</option>
                          <option value="Ortopediya" className="bg-slate-900 text-slate-200">Ortopediya</option>
                          <option value="Xirurgiya" className="bg-slate-900 text-slate-200">Xirurgiya</option>
                          <option value="Implantologiya" className="bg-slate-900 text-slate-200">Implantologiya</option>
                          <option value="Ortodontiya" className="bg-slate-900 text-slate-200">Ortodontiya</option>
                        </>
                      ) : (
                        <>
                          <option value="Maishiy xarajatlar" className="bg-slate-900 text-slate-200">Maishiy xarajatlar</option>
                          <option value="Klinika jihozlari / Materiallar" className="bg-slate-900 text-slate-200">Jihozlar & Materiallar</option>
                          <option value="Ijara to'lovi" className="bg-slate-900 text-slate-200">Ijara to'lovi</option>
                          <option value="Kommunal xizmatlar" className="bg-slate-900 text-slate-200">Kommunal xizmatlar</option>
                          <option value="Xodimlar maoshi" className="bg-slate-900 text-slate-200">Xodimlar maoshi</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Mablag' (UZS)</label>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bemorga bog'lash (Ixtiyoriy)</label>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Hech kimga bog'lamaslik</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Amaliyot tavsifi</label>
                  <input
                    type="text"
                    placeholder="Masalan: Klinikaga kofe va suv sotib olindi"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs py-2.5 rounded-xl border border-slate-700/50 shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                  id="add-transaction-btn"
                >
                  <PlusCircle size={14} /> Jurnalga yozish
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Generated Invoice Printer Preview Modal */}
      {showInvoiceModal && generatedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="invoice-modal-overlay">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up space-y-4" id="invoice-modal-box">
            
            <div className="flex justify-end p-1 absolute right-4 top-4">
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setGeneratedInvoice(null);
                }}
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                id="close-invoice-modal-btn"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Print Area content */}
            <div className="p-4 border-2 border-dashed border-slate-800 rounded-xl space-y-5 bg-slate-950/40" id="printable-invoice">
              
              {/* Header */}
              <div className="text-center space-y-1 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-center gap-1.5 text-sky-400 font-extrabold text-base font-display">
                  <BriefcaseMedical size={20} />
                  <span>DentaCRM kvitansiyasi</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Toshkent stomatologiya klinikasi</p>
                <p className="text-[9px] text-slate-500">Tel: +998 71 200-30-40 | Yunusobod tumani</p>
              </div>

              {/* Invoice info */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-medium text-slate-400 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <p><strong>Bemor:</strong> {generatedInvoice.patientName}</p>
                  <p><strong>Tel:</strong> {generatedInvoice.phone}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p><strong>Invoys:</strong> #{generatedInvoice.invoiceNo}</p>
                  <p><strong>Sana:</strong> {generatedInvoice.date}</p>
                  <p><strong>Shifokor:</strong> {generatedInvoice.dentistName}</p>
                </div>
              </div>

              {/* Treatment Table receipt representation */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Xizmat ta'rifi</span>
                  <span>Jami</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span className="truncate max-w-[250px]">{generatedInvoice.treatment}</span>
                  <span className="font-mono">{generatedInvoice.amount.toLocaleString("uz-UZ")} so'm</span>
                </div>
              </div>

              {/* Total & Footer */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-extrabold text-slate-200">
                  <span>JAMI TO'LANDI:</span>
                  <span className="font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                    {generatedInvoice.amount.toLocaleString("uz-UZ")} so'm
                  </span>
                </div>

                <div className="text-center text-[9px] text-slate-400 font-semibold space-y-1 pt-2 border-t border-slate-800">
                  <p className="flex items-center justify-center gap-1 text-emerald-400">
                    <Check size={12} /> To'lov muvaffaqiyatli qabul qilindi. Rahmat!
                  </p>
                  <p className="text-slate-500">Sog'ligingizni asrang! Klinikamiz sizga tabassum ulashadi.</p>
                </div>
              </div>

            </div>

            {/* Print and Save Trigger Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700"
                id="print-invoice-btn"
              >
                <Printer size={14} /> Chop etish
              </button>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setGeneratedInvoice(null);
                }}
                className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-lg shadow-sm cursor-pointer"
                id="close-success-btn"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
