import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  count: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Compact pagination bar. Renders "1 – 20 of 45" summary + prev/next
 * buttons. Numeric pager omitted intentionally — the DataTable is
 * usually short and page-number badges add noise on mobile.
 */
export function Pagination({
  page,
  pageSize,
  count,
  onPageChange,
  isLoading,
  className,
}: PaginationProps): JSX.Element | null {
  if (count === 0) return null;

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, count);
  const canPrev = safePage > 1 && !isLoading;
  const canNext = safePage < totalPages && !isLoading;

  return (
    <nav
      className={cn(
        "flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600",
        className,
      )}
      aria-label="Sahifalash"
    >
      <div>
        <span className="font-medium text-slate-800">{start.toLocaleString("uz-UZ")}</span>
        <span> – </span>
        <span className="font-medium text-slate-800">{end.toLocaleString("uz-UZ")}</span>
        <span> / {count.toLocaleString("uz-UZ")}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={!canPrev}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-slate-100",
          )}
          aria-label="Oldingi sahifa"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <span
          aria-current="page"
          className="min-w-[3.5rem] rounded-md bg-slate-100 px-2 py-1 text-center font-medium text-slate-800"
        >
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={!canNext}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-slate-100",
          )}
          aria-label="Keyingi sahifa"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
