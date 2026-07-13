import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, User, Stethoscope, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { listPatients } from "@/api/patients";
import { listDoctors } from "@/api/doctors";

interface SearchResult {
  id:       string;
  type:     "patient" | "doctor";
  title:    string;
  subtitle: string;
  href:     string;
}

const TYPE_CONFIG = {
  patient: { icon: User,        color: "text-brand-400",  bg: "bg-brand-500/10",  label: "Bemor"    },
  doctor:  { icon: Stethoscope, color: "text-violet-400", bg: "bg-violet-500/10", label: "Shifokor" },
} as const;

interface GlobalSearchProps {
  open:    boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps): JSX.Element | null {
  const [query,  setQuery]  = useState("");
  const [active, setActive] = useState(0);
  const inputRef            = useRef<HTMLInputElement>(null);
  const navigate            = useNavigate();

  const debouncedQuery = useDebounce(query, 280);
  const enabled        = open && debouncedQuery.trim().length >= 2;

  const patientsQ = useQuery({
    queryKey: ["search", "patients", debouncedQuery],
    queryFn:  () => listPatients({ search: debouncedQuery, pageSize: 6 }),
    enabled,
    staleTime: 30_000,
  });

  const doctorsQ = useQuery({
    queryKey: ["search", "doctors", debouncedQuery],
    queryFn:  () => listDoctors({ search: debouncedQuery, pageSize: 4 }),
    enabled,
    staleTime: 30_000,
  });

  const results: SearchResult[] = [
    ...(patientsQ.data?.results ?? []).map((p) => ({
      id:       p.id,
      type:     "patient" as const,
      title:    `${p.firstName} ${p.lastName}`,
      subtitle: p.phoneNumber,
      href:     `/patients/${p.id}`,
    })),
    ...(doctorsQ.data?.results ?? []).map((d) => ({
      id:       d.id,
      type:     "doctor" as const,
      title:    `${d.user?.firstName ?? ""} ${d.user?.lastName ?? ""}`.trim(),
      subtitle: d.specialization || "Mutaxassislik ko'rsatilmagan",
      href:     `/doctors/${d.id}`,
    })),
  ];

  const isLoading = patientsQ.isLoading || doctorsQ.isLoading;

  function goTo(href: string) {
    navigate(href);
    onClose();
    setQuery("");
    setActive(0);
  }

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  useEffect(() => { setActive(0); }, [results.length]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && results[active]) goTo(results[active].href);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, active]);

  if (!open) return null;

  const showHint  = debouncedQuery.trim().length < 2;
  const showEmpty = !isLoading && !showHint && results.length === 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Global qidiruv"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(4,3,14,0.82)", backdropFilter: "blur(14px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-[640px] mx-4 animate-scale-in"
        style={{
          background:    "hsl(252 28% 7%)",
          border:        "1px solid rgba(255,255,255,0.08)",
          borderRadius:  "22px",
          boxShadow:     "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          animationDuration: "160ms",
        }}
      >
        {/* Specular top */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-[22px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)" }}
          aria-hidden="true"
        />

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-60 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(109,77,255,1) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Search
            className={cn("h-5 w-5 shrink-0 transition-colors duration-300", isLoading ? "text-violet-400 animate-pulse" : "text-white/30")}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bemor yoki shifokor qidiring..."
            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/25 outline-none"
            aria-label="Qidirish"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.06] text-white/40 hover:text-white transition-colors"
                aria-label="Tozalash"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <kbd
              className="hidden sm:inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-mono text-white/25"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              esc
            </kbd>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[380px] overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
          {showHint ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Search className="h-6 w-6 text-white/20" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/50">Qidirish boshlash</p>
                <p className="text-xs text-white/25 mt-1">Kamida 2 ta belgi kiriting</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-white/20 mt-1">
                {["Bemorlar", "Shifokorlar"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : showEmpty ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm font-semibold text-white/50">Natija topilmadi</p>
              <p className="text-xs text-white/25">«{debouncedQuery}» bo'yicha hech narsa chiqmadi</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-1 px-2 py-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-3 animate-pulse">
                  <div className="h-9 w-9 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-36 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-2.5 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-0.5 px-2" role="listbox">
              {results.map((r, i) => {
                const cfg  = TYPE_CONFIG[r.type];
                const Icon = cfg.icon;
                const isActive = active === i;
                return (
                  <li key={r.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => goTo(r.href)}
                      onMouseEnter={() => setActive(i)}
                      className="group w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-100"
                      style={{
                        background: isActive ? "rgba(109,77,255,0.10)" : "transparent",
                        border:     isActive ? "1px solid rgba(109,77,255,0.22)" : "1px solid transparent",
                      }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: isActive ? "rgba(109,77,255,0.15)" : "rgba(255,255,255,0.05)" }}
                      >
                        <Icon
                          className={cn("h-4 w-4 transition-colors", isActive ? cfg.color : "text-white/35")}
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-[13px] font-semibold leading-tight truncate transition-colors", isActive ? "text-white" : "text-white/70")}>
                          {r.title}
                        </p>
                        <p className="text-[11px] text-white/30 truncate mt-0.5">
                          <span className="text-[9px] uppercase tracking-widest font-bold mr-1.5 opacity-60">{cfg.label}</span>
                          {r.subtitle}
                        </p>
                      </div>
                      <ArrowRight
                        className={cn("h-3.5 w-3.5 shrink-0 transition-all duration-150 text-violet-400", isActive ? "opacity-100 translate-x-0.5" : "opacity-0")}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
        >
          <div className="flex items-center gap-3 text-[11px] text-white/20">
            {[
              { key: "↑↓",  label: "Navigatsiya" },
              { key: "↵",   label: "Ochish"      },
              { key: "esc", label: "Yopish"       },
            ].map(({ key, label }) => (
              <span key={key} className="flex items-center gap-1">
                <kbd
                  className="px-1.5 py-0.5 rounded-md font-mono text-[9px]"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {key}
                </kbd>
                {label}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-white/15">DentaCRM</span>
        </div>
      </div>
    </div>
  );
}

/** Global ⌘K / Ctrl+K shortcut hook */
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
