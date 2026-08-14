import { test, expect } from "@playwright/test";
import { redactForSentry } from "../src/lib/observability";

/**
 * Sentry is a third-party processor. Nothing that identifies a client may
 * reach it. These tests guard that boundary — if someone adds a new PII
 * field to an error context, the corresponding key belongs in PII_KEYS and
 * this suite should be extended alongside it.
 */
test.describe("Sentry PII redaction", () => {
  test("identifying fields are redacted, not passed through", () => {
    const redacted = redactForSentry({
      email: "client@example.com",
      firstName: "Jane",
      middleName: "Q",
      lastName: "Client",
      phone: "617-555-0000",
      address: "1 Main St",
      street: "1 Main St",
      city: "Boston",
      zip: "02110",
      dob: "1970-01-01",
      data: { investable_assets: "gt_10M" },
    });

    for (const [key, value] of Object.entries(redacted)) {
      expect(value, `${key} must be redacted`).toBe("[redacted]");
    }
  });

  test("the whole questionnaire payload is redacted, not just scalars", () => {
    const redacted = redactForSentry({ data: { dob: "1970-01-01", income_range: "gt_500" } });
    expect(redacted.data).toBe("[redacted]");
    expect(JSON.stringify(redacted)).not.toContain("1970");
  });

  test("non-identifying operational context is preserved for debugging", () => {
    const redacted = redactForSentry({
      draftId: "1f6950c7-38b3-46e0-ba49-6c23a3f18a6a",
      message: "Error: WEALTHBOX_API_TOKEN is not configured",
      submissionId: 42,
    });

    expect(redacted.draftId).toBe("1f6950c7-38b3-46e0-ba49-6c23a3f18a6a");
    expect(redacted.message).toBe("Error: WEALTHBOX_API_TOKEN is not configured");
    expect(redacted.submissionId).toBe(42);
  });

  test("redaction keeps the key so an on-call reader knows the field was present", () => {
    const redacted = redactForSentry({ email: "client@example.com" });
    expect(Object.keys(redacted)).toEqual(["email"]);
  });

  test("an empty context is handled without throwing", () => {
    expect(redactForSentry({})).toEqual({});
  });
});
