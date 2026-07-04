import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DataTableColumn<T> {
  /** Stable key — used as React key + sort field. */
  key: string;
  /** Column header label. */
  header: ReactNode;
  /** Custom cell renderer. Falls back to ``row[key]`` when omitted. */
  cell?: (row: T, index: number) => ReactNode;
  /** Optional column width override (Tailwind class or CSS length). */
  width?: string;
  /** Right-align numeric columns. */
  align?: "left" | "right" | "center";
  /** Enable header click to sort by ``sortField ?? key``. */
  sortable?: boolean;
  /** Explicit ordering field name sent to the backend. */
  sortField?: string;
  /** Hide on mobile-first screens (Tailwind ``hidden md:table-cell``). */
  hideBelow?: "sm" | "md" | "lg";
}

export interface DataTableSort {
  field: string;
  direction: "asc" | "desc";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  rowKey: (row: T, index: number) => string;
  isLoading?: boolean;
  error?: unknown;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Optional right-side action column renderer. */
  rowActions?: (row: T) => ReactNode;
  className?: string;
  /** Rows rendered by the skeleton placeholder. */
  skeletonRows?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function alignClass(align: DataTableColumn<unknown>["align"]): string {
  switch (align) {
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    default:
      return "text-left";
  }
}

function hideClass(hide: DataTableColumn<unknown>["hideBelow"]): string {
  switch (hide) {
    case "sm":
      return "hidden sm:table-cell";
    case "md":
      return "hidden md:table-cell";
    case "lg":
      return "hidden lg:table-cell";
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  error,
  emptyTitle = "Ma'lumot topilmadi",
  emptyDescription,
  emptyAction,
  onRowClick,
  sort,
  onSortChange,
  rowActions,
  className,
  skeletonRows = 5,
}: DataTableProps<T>): JSX.Element {
  const handleHeaderClick = (col: DataTableColumn<T>): void => {
    if (!col.sortable || !onSortChange) return;
    const field = col.sortField ?? col.key;
    if (!sort || sort.field !== field) {
      onSortChange({ field, direction: "asc" });
      return;
    }
    onSortChange(
      sort.direction === "asc"
        ? { field, direction: "desc" }
        : null,
    );
  };

  const showEmpty = !isLoading && !error && Array.isArray(rows) && rows.length === 0;
  const showRows = !isLoading && !error && Array.isArray(rows) && rows.length > 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => {
                const field = col.sortField ?? col.key;
                const isSorted = sort?.field === field;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "border-b border-slate-200 px-4 py-3 font-semibold",
                      alignClass(col.align),
                      hideClass(col.hideBelow),
                      col.sortable ? "cursor-pointer select-none" : "",
                    )}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={() => handleHeaderClick(col)}
                    aria-sort={
                      isSorted
                        ? sort?.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable ? (
                        <SortIndicator
                          active={isSorted}
                          direction={isSorted ? sort?.direction : undefined}
                        />
                      ) : null}
                    </span>
                  </th>
                );
              })}
              {rowActions ? (
                <th
                  scope="col"
                  className="border-b border-slate-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                  aria-label="Amallar"
                >
                  Amallar
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-b border-slate-100">
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3", hideClass(col.hideBelow))}>
                        <Skeleton className="h-4 w-full max-w-[10rem]" />
                      </td>
                    ))}
                    {rowActions ? (
                      <td className="px-4 py-3">
                        <Skeleton className="ml-auto h-4 w-16" />
                      </td>
                    ) : null}
                  </tr>
                ))
              : null}

            {showRows
              ? rows!.map((row, index) => {
                  const key = rowKey(row, index);
                  const clickable = Boolean(onRowClick);
                  return (
                    <tr
                      key={key}
                      className={cn(
                        "border-b border-slate-100 transition-colors",
                        index % 2 === 1 ? "bg-slate-50/40" : "bg-white",
                        clickable ? "cursor-pointer hover:bg-brand-50/60" : "hover:bg-slate-50",
                      )}
                      onClick={clickable ? () => onRowClick!(row) : undefined}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-4 py-3 text-slate-800",
                            alignClass(col.align),
                            hideClass(col.hideBelow),
                          )}
                        >
                          {col.cell
                            ? col.cell(row, index)
                            : String((row as Record<string, unknown>)[col.key] ?? "—")}
                        </td>
                      ))}
                      {rowActions ? (
                        <td
                          className="px-4 py-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rowActions(row)}
                        </td>
                      ) : null}
                    </tr>
                  );
                })
              : null}

            {error && !isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-red-600"
                >
                  Ma'lumotlarni yuklashda xatolik yuz berdi.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {showEmpty ? (
        <div className="border-t border-slate-100 bg-white p-6">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      ) : null}
    </div>
  );
}

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction?: "asc" | "desc";
}): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex flex-col text-[0.55rem] leading-none text-slate-400",
        active ? "text-brand-600" : "",
      )}
    >
      <span className={cn(direction === "asc" && active ? "text-brand-600" : "")}>▲</span>
      <span className={cn(direction === "desc" && active ? "text-brand-600" : "")}>▼</span>
    </span>
  );
}
