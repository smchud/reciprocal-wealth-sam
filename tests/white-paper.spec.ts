import { test, expect } from "@playwright/test";

// The dev server under test runs with RW_E2E_EXPOSE_WP_TOKEN=1 (see
// playwright.config.ts), so the request endpoint returns the raw
// verification token instead of sending a real email.

// Spam-timing check: the API rejects submissions faster than 1.5s after the
// form rendered, so an honest renderedAt must be backdated in API-level tests.
function humanRenderedAt() {
  return Date.now() - 5_000;
}

test.describe("/api/white-paper server behavior", () => {
  test("rejects a missing or malformed email", async ({ request }) => {
    for (const email of ["", "not-an-email", "a@b"]) {
      const res = await request.post("/api/white-paper/request", {
        data: { email, renderedAt: humanRenderedAt() },
      });
      expect(res.status(), `email: ${JSON.stringify(email)}`).toBe(400);
    }
  });

  test("honeypot and instant submissions get a fake success and no token", async ({ request }) => {
    const honeypot = await request.post("/api/white-paper/request", {
      data: { email: "bot@example.com", company: "SpamCo", renderedAt: humanRenderedAt() },
    });
    expect(honeypot.status()).toBe(200);
    expect((await honeypot.json()).token).toBeUndefined();

    const instant = await request.post("/api/white-paper/request", {
      data: { email: "fast@example.com", renderedAt: Date.now() },
    });
    expect(instant.status()).toBe(200);
    expect((await instant.json()).token).toBeUndefined();
  });

  test("a valid request issues a token that downloads the PDF, and stays valid for a re-download", async ({
    request,
  }) => {
    const email = `wp-test-${Date.now()}@example.com`;
    const res = await request.post("/api/white-paper/request", {
      data: { email, renderedAt: humanRenderedAt() },
    });
    expect(res.status()).toBe(200);
    const { token } = await res.json();
    expect(typeof token).toBe("string");

    const download = await request.get(
      `/api/white-paper/download?token=${encodeURIComponent(token)}`
    );
    expect(download.status()).toBe(200);
    expect(download.headers()["content-type"]).toBe("application/pdf");
    expect(download.headers()["content-disposition"]).toContain("attachment");
    const body = await download.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");

    // An interrupted download must be retryable within the 72h window.
    const again = await request.get(
      `/api/white-paper/download?token=${encodeURIComponent(token)}`
    );
    expect(again.status()).toBe(200);
  });

  test("an unknown or missing token cannot download anything", async ({ request }) => {
    const missing = await request.get("/api/white-paper/download");
    expect(missing.status()).toBe(400);

    const bogus = await request.get("/api/white-paper/download?token=not-a-real-token");
    expect(bogus.status()).toBe(410);
  });

  test("rapid duplicate requests for the same email are swallowed without a second token", async ({
    request,
  }) => {
    const email = `wp-dup-${Date.now()}@example.com`;
    const first = await request.post("/api/white-paper/request", {
      data: { email, renderedAt: humanRenderedAt() },
    });
    expect((await first.json()).token).toBeTruthy();

    const second = await request.post("/api/white-paper/request", {
      data: { email, renderedAt: humanRenderedAt() },
    });
    expect(second.status()).toBe(200);
    expect((await second.json()).token).toBeUndefined();
  });
});

test.describe("white paper form UI", () => {
  test("the Why Reciprocal page shows the form and a submission reaches the confirmation state", async ({
    page,
  }) => {
    await page.goto("/why-reciprocal#white-paper");
    await expect(
      page.getByText(
        "Enter your email address to download a copy of our white paper explaining Reciprocity For All in detail."
      )
    ).toBeVisible();

    await page.getByPlaceholder("you@example.com").fill(`wp-ui-${Date.now()}@example.com`);
    // The API rejects submissions younger than 1.5s as bots; a real visitor
    // takes longer than that to type an email anyway.
    await page.waitForTimeout(1600);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Check your inbox")).toBeVisible();
  });

  test("the home page white paper button links to the Why Reciprocal section", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("link", {
      name: "Click here to download a copy of our white paper",
    });
    await expect(button).toHaveAttribute("href", "/why-reciprocal#white-paper");
  });
});
