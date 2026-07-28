import { test, expect, request as apiRequest, type Page } from "@playwright/test";

async function acceptConsent(page: Page) {
  await page.goto("/get-started");
  await page.getByLabel(/I have read the above/).check();
  await page.getByRole("button", { name: "I agree, continue" }).click();
  await expect(page.getByRole("heading", { name: "About You" })).toBeVisible();
}

async function fillRequiredName(page: Page) {
  await page.getByPlaceholder("First").fill("Jamie");
  await page.getByPlaceholder("Middle").fill("Q");
  await page.getByPlaceholder("Last").fill("Prospect");
}

test.describe("/get-started consent and validation", () => {
  test("the agree button stays disabled until the consent checkbox is checked", async ({ page }) => {
    await page.goto("/get-started");
    await expect(page.getByRole("button", { name: "I agree, continue" })).toBeDisabled();
    await page.getByLabel(/I have read the above/).check();
    await expect(page.getByRole("button", { name: "I agree, continue" })).toBeEnabled();
  });

  test("required-name validation blocks advancing past Section 1 and preserves entered data", async ({ page }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await expect(page.getByText("Your Details")).toBeVisible();

    // First and last name are required; middle name is not, so it's left blank here.
    await page.getByPlaceholder("First").fill("Jamie");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText(/Please enter your.*last name/)).toBeVisible();
    // Still on Section 1 - the field the visitor already typed is untouched.
    await expect(page.getByPlaceholder("First")).toHaveValue("Jamie");
  });

  test("middle name is optional - leaving it blank does not block advancing past Section 1", async ({ page }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await page.getByPlaceholder("First").fill("Jamie");
    await page.getByPlaceholder("Last").fill("Prospect");
    await page.getByRole("button", { name: "Continue" }).click();

    // Advanced to Section 2 - no validation error blocked it.
    await expect(page.getByText("Section 2 of 7")).toBeVisible();
  });

  test("an invalid or expired resume link shows a clear message instead of a silent failure", async ({ page }) => {
    await page.goto("/get-started?resume_error=1");
    await expect(page.getByText("That link is invalid or has expired.")).toBeVisible();
    // The visitor can still start the questionnaire from here.
    await expect(page.getByRole("button", { name: "I agree, continue" })).toBeVisible();
  });
});

test.describe("/get-started save & resume (UI)", () => {
  test("requesting a resume link shows a confirmation", async ({ page }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await fillRequiredName(page);
    await page.getByLabel("Email").fill("jamie@example.com");

    await page.route("**/api/get-started/resume-link", async (route) => {
      await route.fulfill({ status: 200, json: { ok: true } });
    });

    await page.getByRole("button", { name: "Save & finish later" }).click();
    await page.getByRole("button", { name: "Email me a link" }).click();

    await expect(page.getByText("Check your inbox")).toBeVisible();
    await expect(page.getByText(/sent a link to jamie@example\.com/)).toBeVisible();
  });
});

test.describe("/get-started save & resume (server enforcement)", () => {
  test("a resume token can only be redeemed once - reuse from a second, independent context is rejected", async () => {
    // Three independent cookie jars, standing in for: the device that
    // requests the link, the device that first opens it, and a third party
    // who gets hold of the same URL afterward (forwarded email, shared
    // inbox, a security scanner, etc).
    const requester = await apiRequest.newContext({ baseURL: "http://localhost:3000" });
    const firstOpener = await apiRequest.newContext({ baseURL: "http://localhost:3000" });
    const secondOpener = await apiRequest.newContext({ baseURL: "http://localhost:3000" });

    try {
      const created = await requester.post("/api/get-started/session", { data: { consent: true } });
      expect(created.ok()).toBe(true);

      const saved = await requester.patch("/api/get-started/session", {
        data: {
          step: "1",
          data: { first_name: "Once", middle_name: "T", last_name: "Person", email: "once-only@example.com" },
        },
      });
      expect(saved.ok()).toBe(true);

      const linkRes = await requester.post("/api/get-started/resume-link", {
        data: { email: "once-only@example.com" },
      });
      expect(linkRes.ok()).toBe(true);
      const linkBody = await linkRes.json();
      expect(linkBody.ok).toBe(true);

      // Only present because RW_E2E_EXPOSE_RESUME_TOKEN=1 in this test run
      // (see playwright.config.ts) - never present in production or preview.
      const token: string = linkBody.token;
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(20);

      // First redemption succeeds and grants access to the saved draft.
      const first = await firstOpener.get(`/api/get-started/resume?token=${encodeURIComponent(token)}`, {
        maxRedirects: 0,
      });
      expect([301, 302, 303, 307, 308]).toContain(first.status());
      expect(first.headers()["location"]).toContain("resumed=1");

      const firstOpenerSession = await firstOpener.get("/api/get-started/session");
      const firstOpenerBody = await firstOpenerSession.json();
      expect(firstOpenerBody.draft?.data?.first_name).toBe("Once");

      // Reusing the exact same token from a second, cookie-isolated context
      // must fail outright - this is the actual "single use" guarantee.
      const second = await secondOpener.get(`/api/get-started/resume?token=${encodeURIComponent(token)}`, {
        maxRedirects: 0,
      });
      expect(second.headers()["location"]).toContain("resume_error=1");

      // And it must not have granted the second context any access at all.
      const secondOpenerSession = await secondOpener.get("/api/get-started/session");
      const secondOpenerBody = await secondOpenerSession.json();
      expect(secondOpenerBody.draft).toBeNull();
    } finally {
      await requester.dispose();
      await firstOpener.dispose();
      await secondOpener.dispose();
    }
  });

  test("re-clicking an already-used link in the same browser shows a clear message, not a silent success", async ({
    page,
  }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await fillRequiredName(page);
    await page.getByLabel("Email").fill("reclick@example.com");

    // Let the debounced autosave flush before requesting a resume link, so
    // the draft it points at actually contains what was just typed.
    await expect(page.getByText("Saved", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Save & finish later" }).click();
    const [linkRes] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/get-started/resume-link") && res.request().method() === "POST"
      ),
      page.getByRole("button", { name: "Email me a link" }).click(),
    ]);
    const linkBody = await linkRes.json();
    expect(linkBody.ok).toBe(true);
    const token: string = linkBody.token;
    expect(typeof token).toBe("string");
    await page.getByRole("button", { name: "Done" }).click();

    // First click: redeems the token and shows the normal welcome-back state.
    await page.goto(`/api/get-started/resume?token=${encodeURIComponent(token)}`);
    await expect(page.getByText("Welcome back")).toBeVisible();

    // Second click of the identical link, same browser: the token is
    // already spent, but this browser still has a valid session from the
    // first click. It must not silently look like nothing happened.
    await page.goto(`/api/get-started/resume?token=${encodeURIComponent(token)}`);
    await expect(page.getByText("That link has already been used.")).toBeVisible();
    // Their progress is still right there, not lost.
    await expect(page.getByPlaceholder("First")).toHaveValue("Jamie");
  });
});

test.describe("/get-started submission failure handling", () => {
  test("a failed submission shows a sensible message and never clears the visitor's answers", async ({ page }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await fillRequiredName(page);

    // Skip through the remaining sections - only Section 1 enforces required fields.
    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: "Continue" }).click();
    }

    await page.route("**/api/get-started/submit", async (route) => {
      await route.fulfill({
        status: 500,
        json: {
          ok: false,
          error: "Something went wrong submitting your questionnaire. Your progress is saved - please try again in a moment.",
        },
      });
    });

    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByTestId("form-error")).toContainText("Your progress is saved");

    // The visitor is still on the form, not bounced back to the start.
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    // Walk back from Section 7 to Section 1 (6 steps) and confirm the
    // originally entered name is intact.
    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: "Back" }).click();
    }
    await expect(page.getByPlaceholder("First")).toHaveValue("Jamie");
  });
});

test.describe("/get-started full completion (real local server)", () => {
  test("completing all 7 sections submits successfully with no score, profile, or priority matrix shown to the client", async ({
    page,
  }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await fillRequiredName(page);
    await page.getByRole("button", { name: "Continue" }).click(); // -> Section 2
    await page.getByRole("button", { name: "Continue" }).click(); // -> Section 3

    // Deliberately pick the highest AUM bucket, so this submission computes
    // to High-AUM - the most sensitive case for the leak check below.
    await page.locator('input[name="investable_assets"][value="gt_10M"]').check();
    await page.getByRole("button", { name: "Continue" }).click(); // -> Section 4
    await page.getByRole("button", { name: "Continue" }).click(); // -> Section 5

    // Deliberately pick the highest-effort involvement level and
    // account-checking frequency too.
    await page.locator('input[name="involvement"][value="hands_on"]').check();
    await page.locator('input[name="checking_frequency"][value="multi_daily"]').check();
    await page.getByRole("button", { name: "Continue" }).click(); // -> Section 6
    await page.getByRole("button", { name: "Continue" }).click(); // -> Section 7

    // Every service plus the highest-effort contact frequency, so this
    // submission is unambiguously High-AUM, High-Effort for the leak
    // check below.
    for (const value of [
      "investment_management",
      "financial_planning",
      "tax_planning",
      "retirement_planning",
      "estate_planning",
    ]) {
      await page.locator(`input[name="services_desired"][value="${value}"]`).check();
    }
    await page.locator('input[name="contact_frequency"][value="frequent"]').check();

    const submitRes = page.waitForResponse(
      (res) => res.url().includes("/api/get-started/submit") && res.request().method() === "POST"
    );
    await page.getByRole("button", { name: "Submit" }).click();
    const submitResponse = await submitRes;

    await expect(page.getByText("Thank you, Jamie.")).toBeVisible();
    await expect(page.getByText("Have Reciprocal Wealth reach out")).toBeVisible();
    await expect(page.getByText("ready — proceed to onboarding")).toBeVisible();

    // The HARD RULE: never render the computed score/profile/archetype, and
    // never render the priority matrix (quadrant, effort tier, AUM tier) -
    // same treatment, client-facing surfaces only ever see this page.
    const html = await page.content();
    expect(html).not.toMatch(/final_risk_score|risk_profile|psychographic_archetype/i);
    expect(html).not.toContain("Moderately Aggressive");
    expect(html).not.toContain("Conservative");
    expect(html).not.toContain("Engaged Stakeholder");
    expect(html).not.toMatch(/priority_quadrant|effort_score|aum_score|aum_range|aum_bucket|effortTier|aumTier/i);
    expect(html).not.toContain("High-Effort");
    expect(html).not.toContain("Low-Effort");
    expect(html).not.toContain("High-AUM");
    expect(html).not.toContain("Low-AUM");

    // And never in the submit API response body either.
    const submitBody = await submitResponse.json();
    expect(Object.keys(submitBody).sort()).toEqual(["firstName", "ok"]);
  });
});

test.describe("/api/get-started server behavior", () => {
  test("creating a draft requires explicit consent", async ({ request }) => {
    const res = await request.post("/api/get-started/session", { data: { consent: false } });
    expect(res.status()).toBe(400);
  });

  test("autosave without an active session is rejected", async ({ request }) => {
    const res = await request.patch("/api/get-started/session", {
      data: { step: "1", data: { first_name: "Test" } },
    });
    expect(res.status()).toBe(401);
  });

  test("submit without a session is rejected", async ({ request }) => {
    const res = await request.post("/api/get-started/submit");
    expect(res.status()).toBe(401);
  });

  test(
    "a legitimate submission with Wealthbox/PDF-email unavailable still succeeds and the data isn't lost",
    async ({ request }) => {
      // This environment has neither WEALTHBOX_API_TOKEN nor RESEND_API_KEY
      // configured, so this exercises the real best-effort failure path:
      // the core submission must still succeed and be durably stored.
      const created = await request.post("/api/get-started/session", { data: { consent: true } });
      expect(created.ok()).toBe(true);

      const saved = await request.patch("/api/get-started/session", {
        data: {
          step: "7",
          data: { first_name: "Real", middle_name: "M", last_name: "Visitor", email: "real.visitor@example.com" },
        },
      });
      expect(saved.ok()).toBe(true);

      const submitted = await request.post("/api/get-started/submit");
      expect(submitted.ok()).toBe(true);
      const body = await submitted.json();
      expect(body.ok).toBe(true);
      expect(body.firstName).toBe("Real");

      // Data wasn't lost: re-fetching the session still returns everything,
      // and the draft is durably marked submitted.
      const refetched = await request.get("/api/get-started/session");
      const refetchedBody = await refetched.json();
      expect(refetchedBody.draft.data.first_name).toBe("Real");
      expect(refetchedBody.draft.submittedAt).not.toBeNull();
    }
  );
});
