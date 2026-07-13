import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTable, type DataTableColumn } from "./DataTable";

interface Row {
  id: string;
  name: string;
  count: number;
}

const rows: Row[] = [
  { id: "1", name: "Bir", count: 10 },
  { id: "2", name: "Ikki", count: 20 },
];

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Nomi", cell: (r) => r.name, sortable: true },
  { key: "count", header: "Soni", cell: (r) => r.count, align: "right", sortable: true },
];

describe("DataTable", () => {
  it("renders rows using the cell renderer / fallback", () => {
    render(
      <DataTable<Row>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
      />,
    );
    expect(screen.getByText("Bir")).toBeInTheDocument();
    expect(screen.getByText("Ikki")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("shows skeleton rows while loading", () => {
    const { container } = render(
      <DataTable<Row>
        columns={columns}
        rows={undefined}
        rowKey={(r) => r.id}
        isLoading
        skeletonRows={3}
      />,
    );
    // Each skeleton row renders columns.length skeleton divs. The
    // shared Skeleton primitive uses the ``animate-shimmer`` keyframe
    // (see PROJECT_BRIEF § "Zamonaviy CRM dizayn qoidalari" #9 —
    // shimmer, not pulse).
    const skeletons = container.querySelectorAll(".animate-shimmer");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows empty state when the list is empty", () => {
    render(
      <DataTable<Row>
        columns={columns}
        rows={[]}
        rowKey={(r) => r.id}
        emptyTitle="Ro'yxat bo'sh"
      />,
    );
    expect(screen.getByText("Ro'yxat bo'sh")).toBeInTheDocument();
  });

  it("cycles sort direction on header click", () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      <DataTable<Row>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        sort={null}
        onSortChange={onSortChange}
      />,
    );
    fireEvent.click(screen.getByText("Nomi"));
    expect(onSortChange).toHaveBeenLastCalledWith({ field: "name", direction: "asc" });

    rerender(
      <DataTable<Row>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        sort={{ field: "name", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    );
    fireEvent.click(screen.getByText("Nomi"));
    expect(onSortChange).toHaveBeenLastCalledWith({ field: "name", direction: "desc" });

    rerender(
      <DataTable<Row>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        sort={{ field: "name", direction: "desc" }}
        onSortChange={onSortChange}
      />,
    );
    fireEvent.click(screen.getByText("Nomi"));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it("fires onRowClick when clickable", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable<Row>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByText("Bir"));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it("renders row actions in an isolated cell that does not propagate row click", () => {
    const onRowClick = vi.fn();
    const onEdit = vi.fn();
    render(
      <DataTable<Row>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        onRowClick={onRowClick}
        rowActions={(row) => (
          <button type="button" onClick={() => onEdit(row.id)}>
            Tahrirlash
          </button>
        )}
      />,
    );
    const editButtons = screen.getAllByText("Tahrirlash");
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith("1");
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
