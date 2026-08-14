import * as Sentry from "@sentry/nextjs";

/**
 * Error reporting for API routes.
 *
 * Two destinations with deliberately different contents:
 *
 * 1. `console.error` — the structured JSON line this codebase has always
 *    emitted. Stays in Vercel's own logs (first-party, already covered by
 *    our privacy policy) and keeps the full context, including the email
 *    address, so a failure can actually be traced to a visitor.
 *
 * 2. Sentry — a third-party processor. This is a registered investment
 *    adviser's site, so client data must not leave our infrastructure just
 *    because something threw. Everything routed to Sentry is filtered
 *    through PII_KEYS below, and `sentry.server.config.ts` additionally
 *    strips request bodies, headers, cookies, and query strings.
 *
 * Sentry is a no-op when SENTRY_DSN is unset (local dev, CI, and any
 * deploy where it hasn't been configured), so this is always safe to call.
 */

/**
 * Context keys that must never reach the third-party error tracker. Values
 * are replaced with "[redacted]" rather than dropped, so an on-call reader
 * can still tell the field was present.
 */
const PII_KEYS = new Set([
  "email",
  "name",
  "firstName",
  "middleName",
  "lastName",
  "phone",
  "address",
  "street",
  "city",
  "zip",
  "dob",
  "data",
]);

/** Exported for tests — this redaction is a compliance guarantee, not an implementation detail. */
export function redactForSentry(data: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    safe[key] = PII_KEYS.has(key) ? "[redacted]" : value;
  }
  return safe;
}

/**
 * Logs a structured error line and reports it to Sentry.
 *
 * Pass the caught value as `err` wherever one exists — Sentry groups and
 * de-duplicates issues by stack trace, so a real Error object produces a
 * far more useful alert than a stringified message.
 */
export function reportError(
  event: string,
  data: Record<string, unknown> = {},
  err?: unknown
): void {
  console.error(JSON.stringify({ event, ts: new Date().toISOString(), ...data }));

  Sentry.withScope((scope) => {
    scope.setTag("event", event);
    scope.setContext("details", redactForSentry(data));
    if (err !== undefined) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage(event, "error");
    }
  });
}
