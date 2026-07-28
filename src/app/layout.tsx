import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = localFont({
  src: "../fonts/Inter-Variable-latin.woff2",
  weight: "300 700",
  variable: "--font-sans",
  display: "swap",
});

// Gelasio: metrically compatible with Georgia (which can't be redistributed
// as a webfont), so it's the self-hosted fallback when Georgia isn't
// installed on the reader's device. Georgia leads the CSS stack in
// globals.css; this only ever renders for visitors without it.
const gelasio = localFont({
  src: [
    { path: "../fonts/Gelasio-Regular-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Gelasio-Italic-latin.woff2", weight: "400", style: "italic" },
    { path: "../fonts/Gelasio-Bold-latin.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Gelasio-BoldItalic-latin.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-gelasio",
  display: "swap",
});

const defaultTitle = "Reciprocal Wealth | Invested Together.";
const defaultDescription =
  "An independent, fee-only investment adviser for affluent individuals and families.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: "%s | Reciprocal Wealth",
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    siteName: "Reciprocal Wealth",
    type: "website",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/og-default.png"],
  },
  // Intentional sitewide noindex until compliance review clears the site for
  // launch. See the CLAUDE.md warning before removing this.
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${gelasio.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
