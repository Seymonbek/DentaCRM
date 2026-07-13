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

export function Pagination({
  page,
  pageSize,
  count,
  onPageChange,
  isLoading,
  className,
}: PaginationProps): JSX.Element | null {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);

  const pageNums = buildPageNums(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:justify-between pt-5 border-t border-border",
        className,
      )}
    >
      {/* Count info */}
      <p className="text-xs text-fg-3 select-none">
        <span className="font-semibold text-fg-2">{from}–{to}</span>
        {" "}/ {count.toLocaleString("uz-UZ")} ta natija
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <PageBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          aria-label="Oldingi sahifa"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </PageBtn>

        {pageNums.map((n, i) =>
          n === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-fg-3 select-none"
            >
              …
            </span>
          ) : (
            <PageBtn
              key={n}
              onClick={() => onPageChange(n as number)}
              disabled={isLoading}
              active={n === page}
              aria-label={`${n}-sahifa`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </PageBtn>
          ),
        )}

        <PageBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          aria-label="Keyingi sahifa"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </PageBtn>
      </div>
    </div>
  );
}

// Build page number array with ellipsis
function buildPageNums(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function PageBtn({
  children,
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold",
        "transition-all duration-150 ease-spring select-none",
        "disabled:opacity-35 disabled:cursor-not-allowed",
        active
          ? "btn-gradient text-white shadow-glow-sm"
          : "text-fg-2 hover:bg-surface-2 hover:text-fg border border-transparent hover:border-border",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
