import * as Sentry from "@sentry/nextjs";

// Error tracking for the Node.js server runtime. Entirely inert unless
// SENTRY_DSN is set, so local dev, Playwright runs, and any deploy without
// the env var behave exactly as they did before Sentry was added.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,

  // Errors only. Performance tracing would sample real client sessions
  // through the questionnaire, which is not worth the data exposure here.
  tracesSampleRate: 0,

  // This is a registered investment adviser's site. Never let the SDK
  // attach IPs, cookies, or user identifiers on its own.
  sendDefaultPii: false,

  /**
   * Second line of defence behind reportError()'s key redaction: strip the
   * parts of the request Sentry attaches automatically. A questionnaire
   * autosave body contains a client's finances; none of it belongs in a
   * third-party error tracker.
   */
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
      delete event.request.query_string;
      // Keep the path for debugging, drop any query string carrying tokens.
      if (event.request.url) {
        event.request.url = event.request.url.split("?")[0];
      }
    }
    delete event.user;
    return event;
  },
});
