import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { LoginPage } from "@/pages/LoginPage";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";

function renderLogin(): void {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <LoginPage />
    </MemoryRouter>,
  );
}

const testUser: User = {
  id: "11111111-1111-1111-1111-111111111111",
  firstName: "Aziz",
  lastName: "Karimov",
  phoneNumber: "+998901234567",
  role: "bosh_shifokor",
};

describe("<LoginPage />", () => {
  it("renders phone and password inputs", () => {
    renderLogin();
    expect(screen.getByLabelText(/telefon raqami/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/parol/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /kirish/i })).toBeInTheDocument();
  });

  it("validates required fields via Zod", async () => {
    renderLogin();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /kirish/i }));
    expect(await screen.findByText(/telefon raqamini/i)).toBeInTheDocument();
    expect(screen.getByText(/parolni kiriting/i)).toBeInTheDocument();
  });

  it("calls the auth store on submit and shows submit errors", async () => {
    const failingLogin = vi.fn().mockRejectedValue(
      Object.assign(new Error("nope"), {
        isAxiosError: true,
        response: {
          data: {
            error: { code: "VALIDATION_ERROR", message: "Parol xato." },
          },
        },
      }),
    );
    useAuthStore.setState({ login: failingLogin });

    renderLogin();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/telefon raqami/i), "+998901234567");
    await user.type(screen.getByLabelText(/parol/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /kirish/i }));

    await waitFor(() => {
      expect(failingLogin).toHaveBeenCalledWith("+998901234567", "wrongpass");
    });
    expect(await screen.findByText(/parol xato/i)).toBeInTheDocument();
  });

  it("redirects to role home when already authenticated", () => {
    useAuthStore.setState({
      user: testUser,
      status: "authenticated",
      error: null,
    });
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>,
    );
    // After redirect there is no login form — nothing labelled "Telefon".
    expect(screen.queryByLabelText(/telefon raqami/i)).not.toBeInTheDocument();
  });
});
