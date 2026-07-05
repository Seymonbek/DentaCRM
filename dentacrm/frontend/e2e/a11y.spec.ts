import { test, expect, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * T127 — axe-core a11y smoke tests.
 *
 * Runs the axe-core WCAG 2.1 rule set against the login page (public)
 * and one authenticated page (dashboard, after mocked login) to catch
 * regressions on the accessibility criteria referenced in
 * PROJECT_BRIEF §"Zamonaviy CRM dizayn qoidalari" #15 (focus-visible
 * ring, aria-label, keyboard navigable) and the WCAG-alignment goals
 * on colour contrast and semantic structure.
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

const FAKE_ACCESS = "fake.access.token";
const FAKE_REFRESH = "fake.refresh.token";

async function mockAllApi(page: Page): Promise<void> {
  await page.route("**/api/v1/**", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0, next: null, previous: null, results: [] }),
    });
  });
  await page.route("**/api/v1/auth/login/", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access: FAKE_ACCESS,
        refresh: FAKE_REFRESH,
        user: HEAD_DOCTOR,
      }),
    });
  });
  await page.route("**/api/v1/auth/me/", async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(HEAD_DOCTOR),
    });
  });
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

test.describe("axe-core a11y smoke", () => {
  test("login page has no serious or critical a11y violations", async ({ page }) => {
    await mockAllApi(page);
    await page.goto("/login");
    // Wait for the login form to be visible so axe scans a stable DOM.
    await expect(page.getByRole("heading", { name: /kirish|login/i }).first()).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      // Exclude any known-noisy third-party widget selectors here if
      // they appear later. For now the login page is entirely
      // first-party markup.
      .analyze();

    const severe = severeViolations(results);
    if (severe.length > 0) {
      // Emit a helpful debug summary so CI logs show WHICH rules failed.
      // eslint-disable-next-line no-console
      console.log(
        "Serious/critical a11y violations on /login:",
        JSON.stringify(
          severe.map((v) => ({ id: v.id, impact: v.impact, help: v.help })),
          null,
          2,
        ),
      );
    }
    expect(severe, "no serious/critical a11y violations on /login").toEqual([]);
  });

  test("authenticated dashboard has no serious or critical a11y violations", async ({
    page,
  }) => {
    await mockAllApi(page);
    await page.goto("/login");
    await page.getByLabel(/telefon/i).fill("+998900000001");
    await page.getByLabel(/parol/i).fill("StrongPass!123");
    await page
      .getByRole("button", { name: /kirish|login/i })
      .first()
      .click();

    // After login the head-doctor is redirected to /dashboard.
    await page.waitForURL(/\/dashboard$/, { timeout: 10_000 });
    // Give any lazy-loaded chunks a moment to hydrate before scanning.
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const severe = severeViolations(results);
    if (severe.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        "Serious/critical a11y violations on /dashboard:",
        JSON.stringify(
          severe.map((v) => ({ id: v.id, impact: v.impact, help: v.help })),
          null,
          2,
        ),
      );
    }
    expect(severe, "no serious/critical a11y violations on /dashboard").toEqual(
      [],
    );
  });
});
