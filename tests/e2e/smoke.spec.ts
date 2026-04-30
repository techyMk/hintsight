import { test, expect } from "@playwright/test";

test.describe("Public smoke tests", () => {
  test("landing page renders headline + interactive demo", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /scoreboard/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Make a prediction/i })
    ).toBeVisible();
    await expect(page.getByLabel(/What do you think will happen/i)).toBeVisible();
  });

  test("/docs renders all major sections", async ({ page }) => {
    await page.goto("/docs");
    await expect(
      page.getByRole("heading", { level: 1, name: /How Hintsight/i })
    ).toBeVisible();
    for (const section of [
      "What it is",
      "The four-step loop",
      "Logging a useful prediction",
      "Picking a confidence",
      "What calibration actually means",
      "Memory chat",
      "Privacy & data",
      "FAQ",
    ]) {
      await expect(
        page.getByRole("heading", { name: section })
      ).toBeVisible();
    }
  });

  test("/changelog renders bug-fight entries", async ({ page }) => {
    await page.goto("/changelog");
    await expect(
      page.getByRole("heading", { level: 1, name: /What shipped/i })
    ).toBeVisible();
    await expect(page.getByText(/ERR_INVALID_URL/i).first()).toBeVisible();
    await expect(page.getByText(/redirect loop/i).first()).toBeVisible();
  });

  test("404 page renders branded not-found", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: /calibration curve/i })
    ).toBeVisible();
  });

  test("sitemap.xml lists public routes", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toMatch(/<loc>.*\/<\/loc>/);
    expect(body).toMatch(/<loc>.*\/docs<\/loc>/);
    expect(body).toMatch(/<loc>.*\/changelog<\/loc>/);
  });

  test("robots.txt disallows authed routes", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/Disallow: \/dashboard/);
    expect(body).toMatch(/Disallow: \/log/);
    expect(body).toMatch(/Sitemap:/);
  });

  test("interactive demo persists to localStorage on save", async ({
    page,
  }) => {
    await page.goto("/");
    const textarea = page.getByLabel(/What do you think will happen/i);
    await textarea.fill("I will finish this prediction by next month.");
    await page
      .getByRole("button", { name: /Save this prediction/i })
      .click();
    await expect(
      page.getByText(/Locked in/i)
    ).toBeVisible();
    await expect(
      page.getByText("I will finish this prediction by next month.", {
        exact: false,
      })
    ).toBeVisible();
  });
});
