import { test, expect, type Page } from "@playwright/test";

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

    // Only fill one of the three required name fields.
    await page.getByPlaceholder("First").fill("Jamie");
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByText(/Please enter your.*middle name.*last name/)).toBeVisible();
    // Still on Section 1 - the field the visitor already typed is untouched.
    await expect(page.getByPlaceholder("First")).toHaveValue("Jamie");
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
  test("completing all 7 sections submits successfully with no score or profile shown to the client", async ({
    page,
  }) => {
    await acceptConsent(page);
    await page.getByRole("button", { name: "Begin" }).click();
    await fillRequiredName(page);

    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: "Continue" }).click();
    }

    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Thank you, Jamie.")).toBeVisible();
    await expect(page.getByText("Have Reciprocal Wealth reach out")).toBeVisible();
    await expect(page.getByText("ready — proceed to onboarding")).toBeVisible();

    // The HARD RULE: never render the computed score/profile/archetype.
    const html = await page.content();
    expect(html).not.toMatch(/final_risk_score|risk_profile|psychographic_archetype/i);
    expect(html).not.toContain("Moderately Aggressive");
    expect(html).not.toContain("Conservative");
    expect(html).not.toContain("Engaged Stakeholder");
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
