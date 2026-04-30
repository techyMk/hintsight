import { test, expect } from "@playwright/test";
import { setupClerkTestingToken } from "@clerk/testing/playwright";

/**
 * Authed flow tests — gated on real Clerk credentials being set.
 *
 * To run locally or in CI, set:
 *   CLERK_SECRET_KEY=<your test instance secret>
 *   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<test instance publishable>
 *   E2E_CLERK_USER_EMAIL=<a real test user's email in your Clerk instance>
 *   E2E_CLERK_USER_PASSWORD=<that user's password>
 *
 * Without these, the suite is skipped — CI stays green.
 */
const HAS_CREDS =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.E2E_CLERK_USER_EMAIL &&
  !!process.env.E2E_CLERK_USER_PASSWORD;

test.describe("Authed flow", () => {
  test.skip(!HAS_CREDS, "Clerk test credentials not set; skipping authed E2E");

  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
  });

  test("dashboard loads when signed in", async ({ page }) => {
    // Use Clerk's testing token + sign-in via the standard form. With the
    // testing token, Clerk skips bot protection / captcha steps.
    await page.goto("/sign-in");
    await page
      .getByLabel(/email/i)
      .fill(process.env.E2E_CLERK_USER_EMAIL as string);
    await page.getByRole("button", { name: /continue/i }).click();
    await page
      .getByLabel(/password/i)
      .fill(process.env.E2E_CLERK_USER_PASSWORD as string);
    await page.getByRole("button", { name: /continue/i }).click();

    await page.waitForURL(/\/dashboard/);

    // Greeting + the New prediction CTA should be present
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toContainText(/welcome/i);
    await expect(
      page.getByRole("link", { name: /new prediction/i }).first()
    ).toBeVisible();
  });

  test("logging a prediction renders it on the dashboard", async ({ page }) => {
    await page.goto("/sign-in");
    await page
      .getByLabel(/email/i)
      .fill(process.env.E2E_CLERK_USER_EMAIL as string);
    await page.getByRole("button", { name: /continue/i }).click();
    await page
      .getByLabel(/password/i)
      .fill(process.env.E2E_CLERK_USER_PASSWORD as string);
    await page.getByRole("button", { name: /continue/i }).click();

    await page.waitForURL(/\/dashboard/);

    await page.goto("/log");
    const predictionText = `e2e: I will ship a fix by ${Date.now()}.`;
    await page.getByLabel(/your prediction/i).fill(predictionText);
    await page.getByRole("button", { name: /^log prediction$/i }).click();

    // Lands back on dashboard, with the prediction in the recent list.
    await page.waitForURL(/\/dashboard/);
    await expect(
      page.getByText(predictionText, { exact: false })
    ).toBeVisible();
  });
});
