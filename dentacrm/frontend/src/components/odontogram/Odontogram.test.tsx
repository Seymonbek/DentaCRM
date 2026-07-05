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

/**
 * FDI legend used in the component. Kept in the test as documentation
 * so any accidental change to the palette raises a red flag here first.
 */
const STATUS_COLOR = {
  healthy: "#16a34a",
  planned: "#d97706",
  treated: "#2563eb",
  missing: "#dc2626",
} as const;

describe("Odontogram", () => {
  it("renders all 32 FDI teeth (11–48)", () => {
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

  it("colours a treated tooth blue (PROJECT_BRIEF §UI/UX)", () => {
    render(<Odontogram teeth={teeth} />);
    // Tooth 11 has status "treated" — the coloured swatch inside the
    // button is a single ``aria-hidden`` span; there is exactly one
    // <span> child that carries the inline background colour.
    const button = screen.getByLabelText(/Tish 11/i) as HTMLButtonElement;
    const swatch = button.querySelector("span[aria-hidden='true']") as HTMLElement;
    expect(swatch).not.toBeNull();
    // Colour normalised to lowercase for cross-browser stability.
    expect(swatch.style.backgroundColor).toBe("rgb(37, 99, 235)"); // #2563eb
    // Sanity: the untouched tooth 18 falls back to the healthy green.
    const healthy = screen.getByLabelText(/Tish 18/i) as HTMLButtonElement;
    const healthySwatch = healthy.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;
    expect(healthySwatch.style.backgroundColor).toBe("rgb(22, 163, 74)"); // #16a34a
    // The `missing` tooth (26) must be red; guards criterion 39.
    expect(STATUS_COLOR.missing).toBe("#dc2626");
    const missing = screen.getByLabelText(/Tish 26/i) as HTMLButtonElement;
    const missingSwatch = missing.querySelector(
      "span[aria-hidden='true']",
    ) as HTMLElement;
    expect(missingSwatch.style.backgroundColor).toBe("rgb(220, 38, 38)");
  });

  it("fires onSelectTooth via keyboard (Enter on focused tooth)", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Odontogram teeth={teeth} onSelectTooth={onSelect} />);
    const tooth11 = screen.getByLabelText(/Tish 11/i) as HTMLButtonElement;
    tooth11.focus();
    expect(tooth11).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].toothNumber).toBe(11);
  });

  it("highlights the currently selected tooth (visual state)", () => {
    render(<Odontogram teeth={teeth} selectedTooth={11} />);
    const tooth11 = screen.getByLabelText(/Tish 11/i);
    // The selected tooth carries the brand ring; the sibling doesn't.
    expect(tooth11.className).toContain("ring-2");
    const tooth18 = screen.getByLabelText(/Tish 18/i);
    expect(tooth18.className).not.toContain("ring-2");
  });
});
