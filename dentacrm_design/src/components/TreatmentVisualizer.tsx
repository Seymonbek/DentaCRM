import React, { useState } from "react";
import { ToothStatus } from "../types";
import { Hammer, RotateCcw, AlertTriangle, ShieldCheck, Heart, Info } from "lucide-react";

interface TreatmentVisualizerProps {
  toothStates: Record<number, ToothStatus>;
  onToothStatusChange: (toothNumber: number, status: ToothStatus) => void;
}

export default function TreatmentVisualizer({
  toothStates,
  onToothStatusChange,
}: TreatmentVisualizerProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  // Group teeth into Upper (1-16) and Lower (17-32)
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 17 + i).reverse(); // Reversed to match anatomical arches (left-right mirrored alignment)

  const getToothStatusDetails = (status: ToothStatus) => {
    switch (status) {
      case ToothStatus.HEALTHY:
        return { label: "Sog'lom", color: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200", bgLight: "bg-emerald-50" };
      case ToothStatus.CAVITY:
        return { label: "Karies (Chirik)", color: "bg-red-500", text: "text-red-700", border: "border-red-200", bgLight: "bg-red-50" };
      case ToothStatus.FILLING:
        return { label: "Plomba bor", color: "bg-blue-400", text: "text-blue-700", border: "border-blue-200", bgLight: "bg-blue-50" };
      case ToothStatus.CROWN:
        return { label: "Toj (Crown)", color: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", bgLight: "bg-amber-50" };
      case ToothStatus.MISSING:
        return { label: "Tish yo'q", color: "bg-slate-300", text: "text-slate-600", border: "border-slate-200", bgLight: "bg-slate-50" };
      case ToothStatus.IMPLANT:
        return { label: "Implantat", color: "bg-teal-500", text: "text-teal-700", border: "border-teal-200", bgLight: "bg-teal-50" };
      case ToothStatus.ROOT_CANAL:
        return { label: "Kanal tozalangan", color: "bg-purple-500", text: "text-purple-700", border: "border-purple-200", bgLight: "bg-purple-50" };
      default:
        return { label: "Sog'lom", color: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200", bgLight: "bg-emerald-50" };
    }
  };

  // Stats calculation
  const stats = React.useMemo(() => {
    const counts = {
      [ToothStatus.HEALTHY]: 0,
      [ToothStatus.CAVITY]: 0,
      [ToothStatus.FILLING]: 0,
      [ToothStatus.CROWN]: 0,
      [ToothStatus.MISSING]: 0,
      [ToothStatus.IMPLANT]: 0,
      [ToothStatus.ROOT_CANAL]: 0,
    };
    Object.values(toothStates).forEach(status => {
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [toothStates]);

  const handleStatusSelect = (status: ToothStatus) => {
    if (selectedTooth !== null) {
      onToothStatusChange(selectedTooth, status);
      setSelectedTooth(null); // Close popover
    }
  };

  // Helper tooth SVG graphic nodes
  const ToothGraphic = ({ num, status, isSelected }: { num: number; status: ToothStatus; isSelected: boolean; key?: any }) => {
    const details = getToothStatusDetails(status);
    
    // Tooth visual outline based on status
    let toothFill = "#ffffff";
    let toothStroke = "#cbd5e1";
    let strokeWidth = "1.5";
    let pulseClass = "";

    if (status === ToothStatus.HEALTHY) {
      toothFill = "#f0fdf4";
      toothStroke = "#10b981";
    } else if (status === ToothStatus.CAVITY) {
      toothFill = "#fee2e2";
      toothStroke = "#ef4444";
      pulseClass = "animate-pulse";
    } else if (status === ToothStatus.FILLING) {
      toothFill = "#dbeafe";
      toothStroke = "#3b82f6";
    } else if (status === ToothStatus.CROWN) {
      toothFill = "#fef3c7";
      toothStroke = "#f59e0b";
    } else if (status === ToothStatus.MISSING) {
      toothFill = "transparent";
      toothStroke = "#94a3b8";
      strokeWidth = "1";
    } else if (status === ToothStatus.IMPLANT) {
      toothFill = "#ccfbf1";
      toothStroke = "#0d9488";
    } else if (status === ToothStatus.ROOT_CANAL) {
      toothFill = "#f3e8ff";
      toothStroke = "#a855f7";
    }

    if (isSelected) {
      toothStroke = "#4f46e5";
      strokeWidth = "3";
    }

    return (
      <button
        type="button"
        onClick={() => setSelectedTooth(selectedTooth === num ? null : num)}
        className={`relative p-1.5 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
          isSelected 
            ? "border-indigo-600 bg-indigo-50 shadow-md scale-110 z-10" 
            : "border-slate-100 hover:border-slate-300 bg-white hover:shadow-xs"
        }`}
        id={`tooth-item-${num}`}
      >
        {/* Tooth SVG */}
        <svg viewBox="0 0 40 50" className={`w-8 h-10 ${pulseClass}`}>
          {/* Crown of the tooth */}
          <path
            d="M 8 10 C 12 4, 15 4, 20 8 C 25 4, 28 4, 32 10 C 35 18, 33 26, 31 30 C 29 32, 27 34, 25 34 C 23 34, 22 32, 20 32 C 18 32, 17 34, 15 34 C 13 34, 11 32, 9 30 C 7 26, 5 18, 8 10 Z"
            fill={toothFill}
            stroke={toothStroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Roots (Drawn unless missing) */}
          {status !== ToothStatus.MISSING && (
            <path
              d="M 11 32 C 11 40, 14 48, 15 48 C 16 48, 17 42, 18 36 C 19 32, 21 32, 22 36 C 23 42, 24 48, 25 48 C 26 48, 29 40, 29 32"
              fill={status === ToothStatus.IMPLANT ? "#cbd5e1" : "transparent"}
              stroke={toothStroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          )}

          {/* Implant center screw indicator */}
          {status === ToothStatus.IMPLANT && (
            <path
              d="M 18 32 L 22 32 M 19 36 L 21 36 M 19 40 L 21 40 M 20 28 L 20 44"
              stroke="#0d9488"
              strokeWidth="1.5"
            />
          )}

          {/* Root canal channel indicator */}
          {status === ToothStatus.ROOT_CANAL && (
            <path
              d="M 20 16 L 20 32 M 15 32 L 15 42 M 25 32 L 25 42"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeDasharray="1 1"
            />
          )}

          {/* Cavity spot indicator */}
          {status === ToothStatus.CAVITY && (
            <circle cx="20" cy="18" r="4" fill="#ef4444" />
          )}

          {/* Filling spot indicator */}
          {status === ToothStatus.FILLING && (
            <rect x="16" y="14" width="8" height="8" rx="1.5" fill="#3b82f6" opacity="0.8" />
          )}
        </svg>

        {/* Tooth number labels */}
        <span className="text-[10px] font-extrabold text-slate-500 mt-1 font-mono">{num}</span>
      </button>
    );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-6" id="odontogram-panel">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Interaktiv Tish Xaritasi (Odontogramma)</h2>
          <p className="text-xs text-slate-400">Har bir tishning holatini aniqlash va o'zgartirish uchun tish ustiga bosing</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(ToothStatus).map(status => {
            const detail = getToothStatusDetails(status);
            const count = stats[status] || 0;
            return (
              <span 
                key={status} 
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border ${detail.border} ${detail.bgLight}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${detail.color}`}></span>
                <span className={detail.text}>{detail.label} ({count})</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* 32 Teeth Layout Container (Mirrored for Dental Standard Arch layout) */}
      <div className="space-y-8 py-4 select-none relative" id="arch-layout">
        {/* UPPER ARCH (Tish 1 - 16) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Yuqori Jag' (Upper Arch)</span>
            <span className="text-[10px] font-semibold text-slate-400 font-mono">1 ------------------ o'ngdan chapga ------------------ 16</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-2" id="upper-arch-grid">
            {upperTeeth.map((num) => (
              <ToothGraphic
                key={num}
                num={num}
                status={toothStates[num] || ToothStatus.HEALTHY}
                isSelected={selectedTooth === num}
              />
            ))}
          </div>
        </div>

        {/* LOWER ARCH (Tish 17 - 32) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Pastki Jag' (Lower Arch)</span>
            <span className="text-[10px] font-semibold text-slate-400 font-mono">32 ------------------ o'ngdan chapga ------------------ 17</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-2" id="lower-arch-grid">
            {lowerTeeth.map((num) => (
              <ToothGraphic
                key={num}
                num={num}
                status={toothStates[num] || ToothStatus.HEALTHY}
                isSelected={selectedTooth === num}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status Editor Floating Box (Triggered when tooth selected) */}
      {selectedTooth !== null && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-slide-up" id="tooth-editor-box">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                {selectedTooth}
              </span>
              <h3 className="text-xs font-bold text-slate-700">
                - tish holatini tanlang (Hozirgi holati: <strong className="text-indigo-700 uppercase">{toothStates[selectedTooth]}</strong>)
              </h3>
            </div>
            <button
              onClick={() => setSelectedTooth(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              id="close-tooth-editor-btn"
            >
              Yopish
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2" id="status-selection-options">
            {Object.values(ToothStatus).map((status) => {
              const detail = getToothStatusDetails(status);
              const isActive = toothStates[selectedTooth] === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusSelect(status)}
                  className={`px-3 py-2 rounded-xl text-left border text-[11px] font-bold transition-all cursor-pointer flex flex-col justify-between h-14 ${
                    isActive
                      ? `border-indigo-600 ${detail.bgLight} ring-2 ring-indigo-50`
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  id={`option-${status}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${detail.color}`}></span>
                  <span className={isActive ? "text-indigo-900" : "text-slate-700"}>{detail.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Notice Box */}
      <div className="p-3 bg-indigo-50/50 rounded-xl flex gap-3 text-xs text-indigo-700" id="odontogram-help">
        <Info size={16} className="mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="font-bold">Klinik Amaliyot (FDI standarti):</p>
          <p>
            Ushbu xaritada tishlar xalqaro stomatologik tasnif asosida tartiblangan. Karies yoki boshqa nuqsonlarni tanlaganingizda u bemor tibbiy varaqasining davolanishlar tarixi sahifasida ham aks etadi.
          </p>
        </div>
      </div>
    </div>
  );
}
