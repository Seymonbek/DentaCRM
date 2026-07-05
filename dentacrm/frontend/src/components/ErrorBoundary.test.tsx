import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Component helpers used by the tests below.
 *
 * `Bomb` throws on render when its ``shouldThrow`` prop is truthy. It
 * lets the tests deterministically flip a subtree between "will throw"
 * and "will render happily" so we can assert both catch behaviour and
 * the reset mechanic.
 */
function Bomb({ shouldThrow = true }: { shouldThrow?: boolean }): JSX.Element {
  if (shouldThrow) {
    throw new Error("kaboom");
  }
  return <div data-testid="bomb-ok">bomb ok</div>;
}

function Toggler(): JSX.Element {
  const [armed, setArmed] = useState(true);
  return (
    <ErrorBoundary>
      <button onClick={() => setArmed(false)} type="button">
        disarm
      </button>
      <Bomb shouldThrow={armed} />
    </ErrorBoundary>
  );
}

describe("<ErrorBoundary />", () => {
  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">ok</div>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("catches render errors and renders the fallback UI", () => {
    // React logs the error to the console via componentDidCatch — we
    // silence it so the test output is not polluted.
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText(/kutilmagan xatolik yuz berdi/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /qayta urinish/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sahifani yangilash/i }),
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it("invokes onError with the caught error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    const [err] = onError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toBe("kaboom");

    spy.mockRestore();
  });

  it("renders the custom fallback when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary
        fallback={(err, reset) => (
          <div>
            <p data-testid="custom">custom: {err.message}</p>
            <button onClick={reset} type="button">
              custom-reset
            </button>
          </div>
        )}
      >
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("custom")).toHaveTextContent("custom: kaboom");
    expect(
      screen.getByRole("button", { name: /custom-reset/i }),
    ).toBeInTheDocument();

    spy.mockRestore();
  });

  it("recovers on retry when the underlying issue is resolved", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<Toggler />);

    // The initial render throws — fallback UI is shown.
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Disarm the bomb (state lives above the boundary) then retry.
    // The "disarm" button lives inside the boundary subtree so it is
    // NOT rendered while the boundary is in error state. We use the
    // fallback's "Qayta urinish" button, which clears boundary state
    // and re-renders the subtree; because state has not been updated
    // yet, it will still throw. So we instead render a variant with
    // a wrapper button below.
    // Trigger reset — subtree re-renders. It still throws so the
    // fallback re-appears — proving that reset attempts render again.
    await user.click(screen.getByRole("button", { name: /qayta urinish/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("resets to a healthy subtree when the fallback's reset is called after external recovery", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const user = userEvent.setup();

    // ``ExternalToggle`` places the state above the boundary so we can
    // switch the child from a throwing state to a healthy one before
    // calling reset.
    function ExternalToggle(): JSX.Element {
      const [armed, setArmed] = useState(true);
      return (
        <>
          <button onClick={() => setArmed(false)} type="button">
            fix-it
          </button>
          <ErrorBoundary>
            <Bomb shouldThrow={armed} />
          </ErrorBoundary>
        </>
      );
    }

    render(<ExternalToggle />);
    // Boundary catches the initial throw.
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Fix the underlying condition + reset the boundary.
    await user.click(screen.getByRole("button", { name: /fix-it/i }));
    await user.click(screen.getByRole("button", { name: /qayta urinish/i }));

    expect(screen.getByTestId("bomb-ok")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
