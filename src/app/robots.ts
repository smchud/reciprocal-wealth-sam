import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

// Intentional sitewide noindex until compliance review clears the site for
// launch. See the CLAUDE.md warning before reverting this to allow: "/".
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
