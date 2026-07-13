import type { ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  sortField?: string;
  align?: "left" | "center" | "right";
  hideBelow?: "sm" | "md" | "lg";
  width?: string;
}

export interface DataTableSort {
  field: string;
  direction: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  skeletonRows?: number;
  error?: Error | unknown;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  /** Optional per-row action cell rendered as the last column */
  rowActions?: (row: T) => ReactNode;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  className?: string;
}

const HIDE: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

const ALIGN: Record<string, string> = {
  left:   "text-left",
  center: "text-center",
  right:  "text-right",
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  skeletonRows = 5,
  error,
  emptyTitle = "Ma'lumot topilmadi",
  emptyDescription,
  emptyAction,
  onRowClick,
  rowActions,
  sort,
  onSortChange,
  className,
}: DataTableProps<T>): JSX.Element {

  const allColumns = rowActions
    ? [...columns, { key: "__actions", header: "", align: "right" as const }]
    : columns;

  function handleSort(col: DataTableColumn<T>) {
    if (!col.sortable || !onSortChange) return;
    const field = col.sortField ?? col.key;
    if (sort?.field === field) {
      if (sort.direction === "asc") onSortChange({ field, direction: "desc" });
      else onSortChange(null);
    } else {
      onSortChange({ field, direction: "asc" });
    }
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-border bg-surface", className)}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Head */}
          <thead>
            <tr className="border-b border-border" style={{ background: "hsl(var(--color-surface-2) / 0.6)" }}>
              {allColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.10em] text-fg-3 whitespace-nowrap",
                    ALIGN[col.align ?? "left"],
                    col.hideBelow ? HIDE[col.hideBelow] : "",
                    col.key !== "__actions" && col.sortable
                      ? "cursor-pointer select-none hover:text-fg transition-colors duration-150"
                      : "",
                    col.width ?? "",
                  )}
                  onClick={() => col.key !== "__actions" && handleSort(col)}
                  aria-sort={
                    col.key !== "__actions" && sort?.field === (col.sortField ?? col.key)
                      ? sort.direction === "asc" ? "ascending" : "descending"
                      : col.sortable ? "none" : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.header}
                    {col.key !== "__actions" && col.sortable && (
                      <SortIcon
                        active={sort?.field === (col.sortField ?? col.key)}
                        direction={sort?.field === (col.sortField ?? col.key) ? sort.direction : null}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b border-border-2 last:border-none">
                  {allColumns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-5 py-3.5", col.hideBelow ? HIDE[col.hideBelow] : "")}
                    >
                      <div className="skeleton h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={allColumns.length} className="px-5 py-12 text-center">
                  <div className="inline-flex flex-col items-center gap-3 text-danger">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-bg">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Ma'lumot yuklanmadi</p>
                      <p className="text-xs text-fg-3 mt-0.5">
                        {error instanceof Error ? error.message : "Kutilmagan xatolik"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : !rows || rows.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-border-2 last:border-none",
                    "transition-all duration-150",
                    onRowClick
                      ? "cursor-pointer hover:bg-surface-2/60 hover:shadow-[inset_3px_0_0_hsl(var(--color-primary)/0.5)]"
                      : "",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-3.5 text-fg-2",
                        ALIGN[col.align ?? "left"],
                        col.hideBelow ? HIDE[col.hideBelow] : "",
                      )}
                    >
                      {col.cell ? col.cell(row) : null}
                    </td>
                  ))}
                  {rowActions ? (
                    <td
                      className="px-5 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActions(row)}
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc" | null;
}): JSX.Element {
  if (!active) return <ChevronsUpDown className="h-3 w-3 opacity-35" />;
  return direction === "asc"
    ? <ChevronUp className="h-3 w-3 text-brand-500" />
    : <ChevronDown className="h-3 w-3 text-brand-500" />;
}
