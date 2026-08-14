import * as Sentry from "@sentry/nextjs";

// Edge runtime (middleware and any edge routes). Same policy as the Node
// config: inert without SENTRY_DSN, errors only, no PII.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
      delete event.request.query_string;
      if (event.request.url) {
        event.request.url = event.request.url.split("?")[0];
      }
    }
    delete event.user;
    return event;
  },
});
