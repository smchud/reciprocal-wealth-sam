import * as Sentry from "@sentry/nextjs";

/**
 * Loads the Sentry config matching the runtime the server booted into.
 * Both configs are inert unless SENTRY_DSN is set.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

/**
 * Catches server errors that propagate out of a route handler or Server
 * Component. The API routes here catch their own errors and return a
 * friendly response (so they never reach this hook) — those report through
 * reportError() in src/lib/observability.ts instead. This covers everything
 * unhandled: rendering failures, and any future route that throws.
 */
export const onRequestError = Sentry.captureRequestError;
