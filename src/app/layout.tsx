import type { Metadata } from "next";
import localFont from "next/font/local";
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

const defaultTitle = "Reciprocal Wealth | Personalized Wealth Management";
const defaultDescription =
  "Reciprocal Wealth offers personalized wealth management for affluent individuals and families.";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
