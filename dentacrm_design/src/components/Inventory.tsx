import React, { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  ShoppingCart, 
  Minus, 
  Plus, 
  X,
  RefreshCw
} from "lucide-react";
import { InventoryItem } from "../types";

interface InventoryProps {
  inventory: InventoryItem[];
  onAddInventoryItem: (item: Omit<InventoryItem, "id" | "lastRestocked">) => void;
  onUpdateStock: (id: string, newQuantity: number) => void;
  onRestockItem: (id: string, addQuantity: number) => void;
}

export default function Inventory({
  inventory,
  onAddInventoryItem,
  onUpdateStock,
  onRestockItem,
}: InventoryProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick action states
  const [activeRestockId, setActiveRestockId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  // Add Item Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Plomba materiallari");
  const [quantity, setQuantity] = useState(20);
  const [unit, setUnit] = useState("shprits");
  const [minQuantity, setMinQuantity] = useState(5);
  const [pricePerUnit, setPricePerUnit] = useState(50000);
  const [supplier, setSupplier] = useState("");

  // Categories extraction
  const categories = Array.from(new Set(inventory.map((item) => item.category)));

  // Filter logic
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || item.quantity <= item.minQuantity;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockCount = inventory.filter(item => item.quantity <= item.minQuantity).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !supplier) {
      alert("Iltimos, dori/ashyo nomi va yetkazib beruvchini kiriting!");
      return;
    }

    onAddInventoryItem({
      name,
      category,
      quantity: Number(quantity),
      unit,
      minQuantity: Number(minQuantity),
      pricePerUnit: Number(pricePerUnit),
      supplier,
    });

    // Reset Form
    setShowAddModal(false);
    setName("");
    setSupplier("");
    setQuantity(20);
    setMinQuantity(5);
    setPricePerUnit(50000);
  };

  const handleRestockSubmit = (id: string) => {
    if (restockAmount <= 0) return;
    onRestockItem(id, restockAmount);
    setActiveRestockId(null);
    setRestockAmount(10);
  };

  return (
    <div className="space-y-6" id="inventory-container">
      {/* KPI Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="inventory-summary-cards">
        <div className="sleek-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Package size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Umumiy ashyolar</span>
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">{inventory.length} turdagi</h3>
          </div>
        </div>

        <div className="sleek-card rounded-xl p-4 flex items-center gap-3">
          <div className={`p-3 rounded-xl border ${lowStockCount > 0 ? "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tugayotgan zaxira</span>
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">{lowStockCount} ta ashyo</h3>
          </div>
        </div>

        <div className="sleek-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <ShoppingCart size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taminotchilar</span>
            <h3 className="text-xl font-extrabold text-[#f8fafc] font-display">5 ta hamkor</h3>
          </div>
        </div>
      </div>

      {/* Control filters bar */}
      <div className="sleek-card rounded-2xl p-5 space-y-4" id="inventory-controls">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 font-display">Dori-darmonlar va Klinik jihozlar</h1>
            <p className="text-xs text-slate-400 mt-0.5">Plomba materiallari, anestetiklar, endodontik ignalar va tibbiy jihozlar ombori</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            id="open-add-inventory-modal"
          >
            <PlusCircle size={16} /> Yangi Ashyo Qo'shish
          </button>
        </div>

        {/* Input filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1" id="inventory-filters-grid">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Nomi yoki taminotchi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950/60 border border-slate-800 rounded-xl pl-9 p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
              id="search-inventory"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl p-2.5 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
            id="filter-inventory-category"
          >
            <option value="all" className="bg-slate-900 text-slate-200">Barcha toifalar</option>
            {categories.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-slate-200">{c}</option>
            ))}
          </select>

          {/* Low Stock Toggle button */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
              showLowStockOnly
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:text-slate-100"
            }`}
            id="toggle-low-stock"
          >
            {showLowStockOnly ? "Barcha ashyolarni ko'rsatish" : "Faqat kam qolganlarni saralash"}
          </button>

          <div className="flex items-center text-[10px] text-slate-400 font-semibold pl-2">
            <span>Jami saralangan: <strong>{filteredInventory.length} ta</strong></span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="sleek-card rounded-2xl shadow-lg overflow-hidden" id="inventory-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="inventory-table">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Material / Ashyo nomi</th>
                <th className="p-4">Kategoriya</th>
                <th className="p-4">Zaxiradagi soni</th>
                <th className="p-4">Me'yoriy chek (Min)</th>
                <th className="p-4">Oxirgi xarid</th>
                <th className="p-4">Birlik narxi</th>
                <th className="p-4">Yetkazib beruvchi</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-300" id="inventory-table-body">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 font-semibold">
                    Siz qidirgan mezonlar bo'yicha hech qanday klinika ashyosi topilmadi.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.quantity <= item.minQuantity;
                  const percentOfMin = Math.min((item.quantity / (item.minQuantity * 2)) * 100, 100);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/20 transition-colors ${isLow ? "bg-rose-500/5" : ""}`}
                      id={`inventory-row-${item.id}`}
                    >
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-100">{item.name}</p>
                          {isLow && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
                              <AlertTriangle size={10} /> Ogohlantirish: tugamoqda!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <span className={`text-sm font-extrabold ${isLow ? "text-rose-400" : "text-[#38bdf8]"}`}>
                            {item.quantity} {item.unit}
                          </span>
                          <div className="w-20 bg-slate-950 border border-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isLow ? "bg-rose-500" : "bg-[#38bdf8]"}`}
                              style={{ width: `${percentOfMin}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        {item.minQuantity} {item.unit}
                      </td>
                      <td className="p-4 text-slate-400 font-mono">
                        {item.lastRestocked}
                      </td>
                      <td className="p-4 font-mono text-[#f8fafc] font-bold">
                        {item.pricePerUnit.toLocaleString("uz-UZ")} so'm
                      </td>
                      <td className="p-4 text-slate-300">
                        {item.supplier}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Use Stock (Decrement) */}
                          <button
                            onClick={() => onUpdateStock(item.id, Math.max(0, item.quantity - 1))}
                            className="p-1.5 bg-slate-950/40 border border-slate-800 text-slate-400 hover:text-sky-400 hover:bg-slate-800/60 rounded-lg cursor-pointer transition-colors"
                            title="1 dona ishlatildi"
                            disabled={item.quantity === 0}
                            id={`use-one-btn-${item.id}`}
                          >
                            <Minus size={14} />
                          </button>

                          {/* Purchase/Restock Toggle Form */}
                          {activeRestockId === item.id ? (
                            <div className="flex items-center gap-1.5 bg-sky-500/10 p-1 rounded-xl border border-sky-500/20 shadow-lg" id={`restock-box-${item.id}`}>
                              <input
                                type="number"
                                min={1}
                                value={restockAmount}
                                onChange={(e) => setRestockAmount(Math.max(1, Number(e.target.value)))}
                                className="w-12 text-xs font-bold font-mono bg-slate-950 text-slate-200 border border-slate-800 p-1 rounded-lg focus:outline-none"
                              />
                              <button
                                onClick={() => handleRestockSubmit(item.id)}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[10px] px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                                id={`confirm-restock-btn-${item.id}`}
                              >
                                Buyurtma
                              </button>
                              <button
                                onClick={() => setActiveRestockId(null)}
                                className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveRestockId(item.id);
                                setRestockAmount(10);
                              }}
                              className="bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-[#38bdf8] font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                              id={`restock-trigger-btn-${item.id}`}
                            >
                              <ShoppingCart size={12} /> Xarid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplies Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="add-item-modal-overlay">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-scale-up" id="add-item-modal-box">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h2 className="text-base font-extrabold text-slate-100 font-display">Yangi ashyo/material kiritish</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                id="close-add-item-modal"
              >
                Yopish
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4" id="add-inventory-form">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Ashyo / Material nomi</label>
                <input
                  type="text"
                  placeholder="Masalan: Fotopolimer plomba, Karbapulon..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Kategoriya (Toifa)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                  >
                    <option value="Plomba materiallari" className="bg-slate-900">Plomba materiallari</option>
                    <option value="Anesteziya" className="bg-slate-900">Anesteziya</option>
                    <option value="Himoya jihozlari" className="bg-slate-900">Himoya jihozlari</option>
                    <option value="Ortopediya" className="bg-slate-900">Ortopediya</option>
                    <option value="Endodontiya" className="bg-slate-900">Endodontiya</option>
                    <option value="Implantologiya" className="bg-slate-900">Implantologiya</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Birligi (Unit)</label>
                  <input
                    type="text"
                    placeholder="shprits, dona, quti..."
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Dastlabki miqdori (Soni)</label>
                  <input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Minimal ogohlantirish soni</label>
                  <input
                    type="number"
                    min={1}
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Sotib olish narxi (Dona boshiga)</label>
                  <input
                    type="number"
                    min={0}
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Yetkazib beruvchi hamkor</label>
                  <input
                    type="text"
                    placeholder="Masalan: EuroMed LLC"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="bg-[#38bdf8] hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Omborga qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
