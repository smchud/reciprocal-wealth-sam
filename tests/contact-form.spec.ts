import { test, expect } from "@playwright/test";

const VALID_PAYLOAD = {
  name: "Jamie Prospect",
  email: "jamie@example.com",
  phone: "617-555-0100",
  message: "I'd like to learn more about your services.",
};

/**
 * These tests mock the /api/contact fetch response to verify the form's
 * rendering of each outcome, independent of whether Wealthbox/Resend
 * credentials are configured in this environment.
 */
test.describe("Talk to Us form UI", () => {
  test("successful submission shows the branded success state", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({ status: 200, json: { ok: true } });
    });

    await page.goto("/talk-to-us");
    await page.getByLabel("Name").fill(VALID_PAYLOAD.name);
    await page.getByLabel("Email").fill(VALID_PAYLOAD.email);
    await page.getByLabel("Question or Comment").fill(VALID_PAYLOAD.message);

    // Clear the render-timestamp timing trap so a fast Playwright submission
    // isn't itself flagged as a bot.
    await page.waitForTimeout(1600);

    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Thank you — your message has been sent.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send another message" })).toBeVisible();
  });

  test("server validation error is shown to the visitor", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 400,
        json: { ok: false, error: "Please enter a valid email address." },
      });
    });

    await page.goto("/talk-to-us");
    await page.getByLabel("Name").fill(VALID_PAYLOAD.name);
    await page.getByLabel("Email").fill(VALID_PAYLOAD.email);
    await page.getByLabel("Question or Comment").fill(VALID_PAYLOAD.message);
    await page.waitForTimeout(1600);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByTestId("form-error")).toHaveText("Please enter a valid email address.");
    // The form must still be usable for a retry - no silent failure.
    await expect(page.getByRole("button", { name: "Send Message" })).toBeVisible();
  });

  test("rate-limited (429) submission visibly shows a clear, non-accusatory message with a direct-contact path", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({ status: 429, body: "" }); // Vercel Firewall's block isn't JSON
    });

    await page.goto("/talk-to-us");
    await page.getByLabel("Name").fill(VALID_PAYLOAD.name);
    await page.getByLabel("Email").fill(VALID_PAYLOAD.email);
    await page.getByLabel("Question or Comment").fill(VALID_PAYLOAD.message);
    await page.waitForTimeout(1600);
    await page.getByRole("button", { name: "Send Message" }).click();

    const banner = page.getByTestId("form-error");
    await expect(banner).toBeVisible();
    // Must make clear the message did NOT go through, not read as an accusation.
    await expect(banner).toHaveText(
      "We weren't able to submit your message just now. Please email us directly at sam@reciprocalwealth.com or jake@reciprocalwealth.com and we'll get right back to you."
    );
    await expect(banner).not.toContainText("submitted a few times");
    // The two emails must be joined by "or", never "and" - this isn't asking
    // the visitor to email both founders, just giving two valid options.
    await expect(banner).toContainText("sam@reciprocalwealth.com or jake@reciprocalwealth.com");
  });

  test("both Wealthbox and email failing shows a direct-contact fallback, never a silent failure", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 502,
        json: {
          ok: false,
          error:
            "Something went wrong sending your message. Please email us directly at sam@reciprocalwealth.com or jake@reciprocalwealth.com.",
        },
      });
    });

    await page.goto("/talk-to-us");
    await page.getByLabel("Name").fill(VALID_PAYLOAD.name);
    await page.getByLabel("Email").fill(VALID_PAYLOAD.email);
    await page.getByLabel("Question or Comment").fill(VALID_PAYLOAD.message);
    await page.waitForTimeout(1600);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByTestId("form-error")).toContainText("sam@reciprocalwealth.com or jake@reciprocalwealth.com");
  });

  test("honeypot-filled submission still shows success to avoid tipping off bots", async ({ page }) => {
    await page.goto("/talk-to-us");
    await page.getByLabel("Name").fill("Bot Name");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Question or Comment").fill("spam");
    // The honeypot field is off-screen and excluded from the accessible
    // name/label lookup, so it's targeted directly by id.
    await page.locator("#contact-company").fill("I am a bot");
    await page.waitForTimeout(1600);
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Thank you — your message has been sent.")).toBeVisible();
  });
});

/**
 * These hit the real local /api/contact endpoint directly (no mocking) to
 * verify actual server behavior: validation, the honeypot/timing spam trap,
 * and what happens with neither WEALTHBOX_API_TOKEN nor RESEND_API_KEY
 * configured in this environment - which is exactly the "Wealthbox API
 * failure" scenario, since it fails the same way whether Wealthbox itself
 * errors or is simply unreachable/unconfigured.
 */
test.describe("/api/contact server behavior", () => {
  test("rejects an invalid email with 400 and a clear message", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test User",
        email: "not-an-email",
        message: "hello",
        renderedAt: Date.now() - 2000,
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/valid email/i);
  });

  test("rejects a missing name with 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { email: "test@example.com", message: "hello", renderedAt: Date.now() - 2000 },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects a missing message with 400", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { name: "Test User", email: "test@example.com", renderedAt: Date.now() - 2000 },
    });
    expect(res.status()).toBe(400);
  });

  test("honeypot submission returns 200 (looks like success) without validation errors", async ({
    request,
  }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Bot",
        email: "bot@example.com",
        message: "spam",
        company: "I filled this in",
        renderedAt: Date.now() - 2000,
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("instant submission (timing trap) is rejected the same way as the honeypot", async ({
    request,
  }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Fast Bot",
        email: "fastbot@example.com",
        message: "spam",
        renderedAt: Date.now(), // submitted the instant it "rendered"
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("a legitimate submission with Wealthbox/email unavailable still yields a clear, non-silent response", async ({
    request,
  }) => {
    // In this environment neither WEALTHBOX_API_TOKEN nor RESEND_API_KEY is
    // configured, so this exercises the real failure path end-to-end: the
    // route must never hang or return an ambiguous/empty response.
    const res = await request.post("/api/contact", {
      data: {
        name: "Real Visitor",
        email: "visitor@example.com",
        message: "Interested in learning more about your services.",
        renderedAt: Date.now() - 2000,
      },
    });
    const body = await res.json().catch(() => null);
    expect(body).not.toBeNull();
    expect(typeof body.ok).toBe("boolean");
    if (!body.ok) {
      // Both integrations failed - the visitor must be told exactly how to
      // reach the firm directly instead of being left in the dark.
      expect(res.status()).toBe(502);
      expect(body.error).toContain("sam@reciprocalwealth.com");
      expect(body.error).toContain("jake@reciprocalwealth.com");
    }
  });
});
