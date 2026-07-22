import type { NextConfig } from "next";

// Everything on this site is first-party: self-hosted Inter, same-origin
// images/video, and Vercel Analytics (served from /_vercel/insights/ on our
// own origin). 'unsafe-inline' for script/style is required by Next.js's
// hydration scripts and inline style props (e.g. FadeIn) absent a nonce setup.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // 2 years. Deliberately no includeSubDomains: the reciprocalwealth.com zone
  // also carries Microsoft 365 service subdomains (autodiscover, etc.) that
  // this site does not control.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Canonical host: www and the vercel.app production alias both 308 to
      // the apex domain. Preview deployments (distinct *.vercel.app hosts)
      // are unaffected.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.reciprocalwealth.com" }],
        destination: "https://reciprocalwealth.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "reciprocal-wealth-sam.vercel.app" }],
        destination: "https://reciprocalwealth.com/:path*",
        permanent: true,
      },
      { source: "/concept-b", destination: "/", permanent: true },
      { source: "/concept-b/:path*", destination: "/:path*", permanent: true },
      { source: "/concept-a/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
