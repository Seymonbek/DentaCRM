import { test, expect, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * T127 + T132 — axe-core a11y smoke tests.
 *
 * Runs the axe-core WCAG 2.1 rule set against:
 *   1. /login (public entry point)                       — T127
 *   2. /dashboard (post-login role home for head doctor) — T127
 *   3. /patients/:id (odontogram + tabs)                 — T132
 *   4. /appointments/new (slot picker form)              — T132
 *   5. /schedule (calendar grid)                         — T132
 *
 * The pass bar is: zero serious/critical violations. Minor / moderate
 * findings are allowed to bubble up as ``console.log`` for developer
 * awareness but do not fail the build — this keeps the smoke test a
 * regression guard rather than a full audit tool.
 */

type Role = "bosh_shifokor" | "doctor" | "administrator";

const HEAD_DOCTOR = {
  id: "11111111-1111-4111-8111-111111111111",
  firstName: "Aziz",
  lastName: "Karimov",
  phoneNumber: "+998900000001",
  role: "bosh_shifokor" as Role,
};

const ADMIN = {
  id: "22222222-2222-4222-8222-222222222222",
  firstName: "Admin",
  lastName: "User",
  phoneNumber: "+998900000002",
  role: "administrator" as Role,
};

const FAKE_ACCESS = "fake.access.token";
const FAKE_REFRESH = "fake.refresh.token";

const PATIENT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATIENT = {
  id: PATIENT_ID,
  firstName: "Ali",
  lastName: "Valiyev",
  phoneNumber: "+998901111111",
  fullName: "Ali Valiyev",
  gender: "male",
  address: "",
  notes: "",
  isActive: true,
  createdAt: "2026-07-01T08:00:00Z",
  updatedAt: "2026-07-01T08:00:00Z",
};

const DOCTOR_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const DOCTOR = {
  id: DOCTOR_ID,
  user: {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    firstName: "Ali",
    lastName: "Doktorov",
    phoneNumber: "+998900000010",
  },
  specialization: "Terapevt",
  departments: [
    { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", name: "Terapiya" },
  ],
  commissionBasis: "from_total",
  defaultCommissionRate: "30.00",
};

const DEPARTMENT = {
  id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  name: "Terapiya",
  description: "",
  isActive: true,
};

/** Default paginated envelope, empty. */
const EMPTY_PAGE = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

async function mockAllApi(
  page: Page,
  user: typeof HEAD_DOCTOR | typeof ADMIN = HEAD_DOCTOR,
): Promise<void> {
  // Fallback handler for any /api/v1/** — empty page envelope.
  await page.route("**/api/v1/**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(EMPTY_PAGE),
    });
  });
  await page.route("**/api/v1/auth/login/", async (route: Route) => {
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

async function mockPatientDetail(page: Page): Promise<void> {
  // Patient record.
  await page.route(
    `**/api/v1/patients/${PATIENT_ID}/`,
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(PATIENT),
      });
    },
  );
  // History timeline — empty is fine, we only need the shell to render.
  await page.route(
    `**/api/v1/patients/${PATIENT_ID}/history/`,
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    },
  );
  // Odontogram — return one healthy tooth so the SVG renders with data.
  await page.route(
    `**/api/v1/patients/${PATIENT_ID}/odontogram/`,
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { toothNumber: 11, status: "healthy", procedure: null, notes: "" },
          { toothNumber: 21, status: "treated", procedure: "filling", notes: "" },
        ]),
      });
    },
  );
  await page.route(
    `**/api/v1/patients/${PATIENT_ID}/balance/`,
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          patientId: PATIENT_ID,
          totalBilled: "0.00",
          totalPaid: "0.00",
          balance: "0.00",
        }),
      });
    },
  );
}

async function mockSchedulingLookups(page: Page): Promise<void> {
  await page.route("**/api/v1/doctors/*", async (route: Route) => {
    // Detail vs list — check the URL suffix.
    const url = route.request().url();
    if (/\/doctors\/[a-f0-9-]{36}\/?$/u.test(url)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(DOCTOR),
      });
    } else {
      await route.continue();
    }
  });
  await page.route("**/api/v1/doctors/?**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...EMPTY_PAGE, results: [DOCTOR], count: 1 }),
    });
  });
  await page.route("**/api/v1/doctors/", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...EMPTY_PAGE, results: [DOCTOR], count: 1 }),
    });
  });
  await page.route("**/api/v1/departments/**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...EMPTY_PAGE, results: [DEPARTMENT], count: 1 }),
    });
  });
  // Available-slots — return two clickable slots.
  await page.route(
    "**/api/v1/doctors/*/available-slots/**",
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { start: "2026-07-06T09:00:00Z", end: "2026-07-06T09:30:00Z" },
          { start: "2026-07-06T10:00:00Z", end: "2026-07-06T10:30:00Z" },
        ]),
      });
    },
  );
  // Patients list for the appointment form's patient picker.
  await page.route("**/api/v1/patients/**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...EMPTY_PAGE, results: [PATIENT], count: 1 }),
    });
  });
  // Appointments list for the schedule page.
  await page.route("**/api/v1/appointments/**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(EMPTY_PAGE),
    });
  });
}

/**
 * Log into the app as ``user`` and wait for the role-specific home.
 */
async function login(page: Page, user: typeof HEAD_DOCTOR | typeof ADMIN) {
  await page.goto("/login");
  await page.getByLabel(/telefon/i).fill(user.phoneNumber);
  await page.getByLabel(/parol/i).fill("StrongPass!123");
  await page
    .getByRole("button", { name: /kirish|login/i })
    .first()
    .click();
  const targetPattern =
    user.role === "bosh_shifokor"
      ? /\/dashboard$/
      : user.role === "administrator"
        ? /\/schedule$/
        : /\/my-appointments$/;
  await page.waitForURL(targetPattern, { timeout: 10_000 });
  await page.waitForLoadState("networkidle");
}

/** WCAG 2.1 A + AA rule set — the industry-standard smoke scope. */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/**
 * Returns violations judged as ``serious`` or ``critical`` by axe-core.
 * These are the pass-bar for the smoke test.
 */
function severeViolations(results: Awaited<ReturnType<AxeBuilder["analyze"]>>) {
  return results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
}

function reportViolations(label: string, severe: ReturnType<typeof severeViolations>) {
  if (severe.length === 0) return;
  // eslint-disable-next-line no-console
  console.log(
    `Serious/critical a11y violations on ${label}:`,
    JSON.stringify(
      severe.map((v) => ({ id: v.id, impact: v.impact, help: v.help })),
      null,
      2,
    ),
  );
}

test.describe("axe-core a11y smoke", () => {
  test("login page has no serious or critical a11y violations", async ({ page }) => {
    await mockAllApi(page);
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /kirish|login/i }).first(),
    ).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const severe = severeViolations(results);
    reportViolations("/login", severe);
    expect(severe, "no serious/critical a11y violations on /login").toEqual([]);
  });

  test("authenticated dashboard has no serious or critical a11y violations", async ({
    page,
  }) => {
    await mockAllApi(page);
    await login(page, HEAD_DOCTOR);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const severe = severeViolations(results);
    reportViolations("/dashboard", severe);
    expect(severe, "no serious/critical a11y violations on /dashboard").toEqual([]);
  });

  test("patient detail page (odontogram + tabs) has no serious a11y issues", async ({
    page,
  }) => {
    await mockAllApi(page, ADMIN);
    await mockPatientDetail(page);
    await login(page, ADMIN);

    await page.goto(`/patients/${PATIENT_ID}`);
    // Wait for the tab strip to be interactive so axe scans a stable DOM.
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const severe = severeViolations(results);
    reportViolations(`/patients/${PATIENT_ID}`, severe);
    expect(
      severe,
      "no serious/critical a11y violations on patient detail page",
    ).toEqual([]);
  });

  test("new appointment page (slot picker) has no serious a11y issues", async ({
    page,
  }) => {
    await mockAllApi(page, ADMIN);
    await mockSchedulingLookups(page);
    await login(page, ADMIN);

    await page.goto("/appointments/new");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const severe = severeViolations(results);
    reportViolations("/appointments/new", severe);
    expect(
      severe,
      "no serious/critical a11y violations on new-appointment page",
    ).toEqual([]);
  });

  test("schedule page (calendar grid) has no serious a11y issues", async ({
    page,
  }) => {
    await mockAllApi(page, ADMIN);
    await mockSchedulingLookups(page);
    await login(page, ADMIN);

    // login() already landed the admin on /schedule; do a hard nav to
    // guarantee state.
    await page.goto("/schedule");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const severe = severeViolations(results);
    reportViolations("/schedule", severe);
    expect(
      severe,
      "no serious/critical a11y violations on /schedule",
    ).toEqual([]);
  });
});
