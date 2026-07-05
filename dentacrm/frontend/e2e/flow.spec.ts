import {
  test,
  expect,
  type BrowserContext,
  type Page,
  type Route,
} from "@playwright/test";

/**
 * End-to-end clinic flow (Task 105, criteria #21/#22/#24/#25/#26/#38/#42).
 *
 * The suite drives a single automated flow that spans multiple roles
 * and multiple pages, proving that the pieces integrate:
 *
 *   1. Administrator logs in → schedule page renders.
 *   2. Administrator visits /patients/new, fills the form, and is
 *      redirected to /patients/{id} with a success toast.
 *   3. A doctor logs in in a **second browser context** and lands on
 *      /my-appointments, which fetches the appointments list.
 *
 * The whole /api/v1/ surface is intercepted with ``page.route()`` so
 * the test needs no backend. Handlers below cover exactly the calls
 * these pages make; anything else falls through the catch-all which
 * returns an empty paginated envelope.
 */

// ---------------------------------------------------------------------------
// Fake data
// ---------------------------------------------------------------------------
const ADMIN = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  firstName: "Malika",
  lastName: "Sobirova",
  phoneNumber: "+998900000001",
  role: "administrator" as const,
};

const DOCTOR = {
  id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  firstName: "Doc",
  lastName: "Tor",
  phoneNumber: "+998900000002",
  role: "doctor" as const,
};

const CREATED_PATIENT_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const APPOINTMENT_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

// ---------------------------------------------------------------------------
// Mocking helpers
// ---------------------------------------------------------------------------
async function installBaseRoutes(
  page: Page,
  user: typeof ADMIN | typeof DOCTOR,
): Promise<void> {
  // 1. Catch-all — MUST be registered first so specific handlers below
  //    take precedence (Playwright evaluates routes newest-first).
  await page.route("**/api/v1/**", async (route: Route) => {
    // Sensible defaults for GET list endpoints.
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
      });
      return;
    }
    // Anything else — success with an empty object.
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });

  await page.route("**/api/v1/auth/login/", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access: "fake.access.token",
        refresh: "fake.refresh.token",
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

async function login(page: Page, user: typeof ADMIN | typeof DOCTOR): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Telefon raqami").fill(user.phoneNumber);
  await page.getByLabel("Parol").fill("StrongPass!123");
  await page.getByRole("button", { name: /kirish/i }).click();
}

// ---------------------------------------------------------------------------
// The flow
// ---------------------------------------------------------------------------
test("clinic flow — admin creates patient, doctor sees appointments dashboard", async ({
  browser,
}) => {
  // -- Context 1: Administrator ------------------------------------------
  const adminCtx: BrowserContext = await browser.newContext();
  const adminPage: Page = await adminCtx.newPage();
  await installBaseRoutes(adminPage, ADMIN);

  // The administrator lands on /schedule after login.
  await login(adminPage, ADMIN);
  await adminPage.waitForURL(/\/schedule$/, { timeout: 10_000 });

  // Navigate to /patients/new by clicking the sidebar link — this keeps
  // the auth store alive across the transition (a hard reload would
  // reset it because the frontend uses in-memory tokens by default).
  await adminPage.getByRole("link", { name: /bemor qo'shish/i }).click();
  await adminPage.waitForURL(/\/patients\/new$/, { timeout: 10_000 });
  await expect(
    adminPage.getByRole("heading", { name: /yangi bemor/i }),
  ).toBeVisible();

  // Stand in a specific handler for POST /patients/ so the redirect
  // target ID is deterministic.
  await adminPage.route("**/api/v1/patients/", async (route: Route) => {
    if (route.request().method() === "POST") {
      const body = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: CREATED_PATIENT_ID,
          firstName: body.firstName ?? "",
          lastName: body.lastName ?? "",
          phoneNumber: body.phoneNumber ?? "",
          gender: body.gender ?? null,
          address: body.address ?? "",
          notes: body.notes ?? "",
          fullName: `${body.firstName ?? ""} ${body.lastName ?? ""}`.trim(),
          telegramChatId: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: 0,
        next: null,
        previous: null,
        results: [],
      }),
    });
  });

  // GET /patients/{id}/ so the detail page can render after redirect.
  await adminPage.route(`**/api/v1/patients/${CREATED_PATIENT_ID}/`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: CREATED_PATIENT_ID,
        firstName: "Ali",
        lastName: "Valiyev",
        phoneNumber: "+998901112233",
        gender: "male",
        address: "",
        notes: "",
        fullName: "Ali Valiyev",
        isActive: true,
        createdAt: new Date().toISOString(),
      }),
    });
  });

  // GET history + odontogram default → empty
  await adminPage.route(
    `**/api/v1/patients/${CREATED_PATIENT_ID}/**`,
    async (route: Route) => {
      const url = route.request().url();
      if (url.includes("/balance/")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            patientId: CREATED_PATIENT_ID,
            totalBilled: "0.00",
            totalPaid: "0.00",
            balance: "0.00",
          }),
        });
        return;
      }
      if (url.endsWith("/history/")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
        return;
      }
      if (url.endsWith("/odontogram/")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([]),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          count: 0,
          next: null,
          previous: null,
          results: [],
        }),
      });
    },
  );

  // Fill the patient form.
  await adminPage.getByLabel("Ism *").fill("Ali");
  await adminPage.getByLabel("Familiya *").fill("Valiyev");
  await adminPage.getByLabel("Telefon raqami *").fill("+998901112233");
  await adminPage.getByRole("button", { name: /bemorni saqlash/i }).click();

  // Success = URL flipped to the newly-created patient's detail page.
  await adminPage.waitForURL(new RegExp(`/patients/${CREATED_PATIENT_ID}$`), {
    timeout: 10_000,
  });
  // And the success toast is on screen.
  await expect(
    adminPage.getByText(/bemor qo'shildi/i).first(),
  ).toBeVisible({ timeout: 5_000 });

  // -- Context 2: Doctor -------------------------------------------------
  const doctorCtx: BrowserContext = await browser.newContext();
  const doctorPage: Page = await doctorCtx.newPage();
  await installBaseRoutes(doctorPage, DOCTOR);

  // Doctor's appointments — return one row so the list renders content.
  await doctorPage.route("**/api/v1/appointments/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: APPOINTMENT_ID,
            patientId: CREATED_PATIENT_ID,
            doctorId: DOCTOR.id,
            departmentId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
            scheduledStart: new Date(Date.now() + 3600_000).toISOString(),
            scheduledEnd: new Date(Date.now() + 5400_000).toISOString(),
            status: "scheduled",
            statusLabel: "Rejalashtirilgan",
            notes: "",
            patient: {
              id: CREATED_PATIENT_ID,
              firstName: "Ali",
              lastName: "Valiyev",
              phoneNumber: "+998901112233",
              fullName: "Ali Valiyev",
            },
            doctor: {
              id: DOCTOR.id,
              specialization: "Terapevt",
              user: {
                id: DOCTOR.id,
                firstName: DOCTOR.firstName,
                lastName: DOCTOR.lastName,
                phoneNumber: DOCTOR.phoneNumber,
              },
            },
            department: {
              id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
              name: "Terapiya",
            },
          },
        ],
      }),
    });
  });

  await login(doctorPage, DOCTOR);
  await doctorPage.waitForURL(/\/my-appointments$/, { timeout: 10_000 });

  // The appointment row we mocked shows up in the doctor's dashboard.
  await expect(doctorPage.getByText(/ali valiyev/i).first()).toBeVisible({
    timeout: 5_000,
  });

  await adminCtx.close();
  await doctorCtx.close();
});
