import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("returns null when there are no records", () => {
    const { container } = render(
      <Pagination page={1} pageSize={10} count={0} onPageChange={() => undefined} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders start/end/count summary correctly", () => {
    render(
      <Pagination page={2} pageSize={10} count={45} onPageChange={() => undefined} />,
    );
    expect(screen.getByText("11–20")).toBeInTheDocument();
    expect(screen.getByText(/45/)).toBeInTheDocument();
  });

  it("advances the page on next click", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageSize={10}
        count={30}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByLabelText("Keyingi sahifa"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables next on the last page", () => {
    render(
      <Pagination
        page={3}
        pageSize={10}
        count={30}
        onPageChange={() => undefined}
      />,
    );
    expect(screen.getByLabelText("Keyingi sahifa")).toBeDisabled();
  });
});
