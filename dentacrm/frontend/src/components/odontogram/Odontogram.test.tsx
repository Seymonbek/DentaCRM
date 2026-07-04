import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Odontogram } from "./Odontogram";
import type { PatientOdontogramTooth } from "@/api/patients";

const teeth: PatientOdontogramTooth[] = [
  { toothNumber: 11, status: "treated", procedure: "filling" },
  { toothNumber: 26, status: "missing" },
  { toothNumber: 36, status: "planned" },
];

describe("Odontogram", () => {
  it("renders all 32 FDI teeth", () => {
    render(<Odontogram teeth={teeth} />);
    // Sample a few tooth numbers to prove the full arch is rendered.
    for (const n of [11, 18, 21, 28, 31, 38, 41, 48]) {
      expect(screen.getByText(String(n))).toBeInTheDocument();
    }
  });

  it("invokes onSelectTooth when a tooth is clicked", async () => {
    const onSelect = vi.fn();
    render(<Odontogram teeth={teeth} onSelectTooth={onSelect} />);
    await userEvent.click(screen.getByLabelText(/Tish 11/i));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].toothNumber).toBe(11);
  });

  it("shows a legend for the four statuses", () => {
    render(<Odontogram teeth={teeth} />);
    expect(screen.getByText("Sog'lom")).toBeInTheDocument();
    expect(screen.getByText("Rejalashtirilgan")).toBeInTheDocument();
    expect(screen.getByText("Davolangan")).toBeInTheDocument();
    expect(screen.getByText("Yo'q")).toBeInTheDocument();
  });
});
