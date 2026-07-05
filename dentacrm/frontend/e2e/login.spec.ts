import { test, expect, type Page, type Route } from "@playwright/test";

/**
 * Playwright login-flow e2e (Task 104, criteria #18/#19/#26).
 *
 * The whole test intercepts /api/v1/auth/login/ and /api/v1/auth/me/
 * via `page.route()` — no real backend is contacted. Each role we
 * exercise is a plain fake fixture; the assertion is on the URL after
 * a successful login, mirroring the redirects in
 * ``src/app/RoleGuard.tsx``'s ``homeForRole``.
 */

type Role = "bosh_shifokor" | "doctor" | "administrator";

interface FakeUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
}

const USERS: Record<Role, FakeUser> = {
  bosh_shifokor: {
    id: "11111111-1111-4111-8111-111111111111",
    firstName: "Aziz",
    lastName: "Karimov",
    phoneNumber: "+998900000001",
    role: "bosh_shifokor",
  },
  doctor: {
    id: "22222222-2222-4222-8222-222222222222",
    firstName: "Doc",
    lastName: "Tor",
    phoneNumber: "+998900000002",
    role: "doctor",
  },
  administrator: {
    id: "33333333-3333-4333-8333-333333333333",
    firstName: "Malika",
    lastName: "Sobirova",
    phoneNumber: "+998900000003",
    role: "administrator",
  },
};

// Any signed-looking JWT will do — the frontend never verifies it.
const FAKE_ACCESS = "fake.access.token";
const FAKE_REFRESH = "fake.refresh.token";

async function mockAuth(page: Page, user: FakeUser): Promise<void> {
  // Playwright evaluates routes in reverse-registration order, so the
  // catch-all must be registered FIRST — the specific handlers below
  // take precedence and short-circuit anything more specific.
  await page.route("**/api/v1/**", async (route: Route) => {
    // Empty paginated envelope keeps every dashboard/list happy without
    // coupling this test to any specific endpoint's data shape.
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0, next: null, previous: null, results: [] }),
    });
  });

  await page.route("**/api/v1/auth/login/", async (route: Route) => {
    // Loose validation — reject empty passwords so we can also assert
    // the login error path later if we choose.
    const body =
      typeof route.request().postData() === "string"
        ? JSON.parse(route.request().postData() as string)
        : {};
    if (!body.password) {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: { code: "VALIDATION_ERROR", message: "Parol majburiy.", details: {} },
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access: FAKE_ACCESS,
        refresh: FAKE_REFRESH,
        user,
      }),
    });
  });

  await page.route("**/api/v1/auth/me/", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(user),
    });
  });
}

async function fillLoginForm(page: Page, user: FakeUser): Promise<void> {
  await page.goto("/login");
  // The form fields are rendered by ``src/pages/LoginPage.tsx``. Labels
  // are Uzbek but React Hook Form registers them via ``id`` too, so we
  // rely on the ``name`` attribute set by the register() call.
  await page.getByLabel("Telefon raqami").fill(user.phoneNumber);
  await page.getByLabel("Parol").fill("StrongPass!123");
  await page.getByRole("button", { name: /kirish/i }).click();
}

test.describe("Login → role-based home redirect", () => {
  test("bosh_shifokor lands on /dashboard", async ({ page }) => {
    await mockAuth(page, USERS.bosh_shifokor);
    await fillLoginForm(page, USERS.bosh_shifokor);
    await page.waitForURL(/\/dashboard$/, { timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe("/dashboard");
  });

  test("doctor lands on /my-appointments", async ({ page }) => {
    await mockAuth(page, USERS.doctor);
    await fillLoginForm(page, USERS.doctor);
    await page.waitForURL(/\/my-appointments$/, { timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe("/my-appointments");
  });

  test("administrator lands on /schedule", async ({ page }) => {
    await mockAuth(page, USERS.administrator);
    await fillLoginForm(page, USERS.administrator);
    await page.waitForURL(/\/schedule$/, { timeout: 10_000 });
    expect(new URL(page.url()).pathname).toBe("/schedule");
  });
});
