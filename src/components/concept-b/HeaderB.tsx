"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { navLinksB, siteConfig } from "@/data/siteConfig";

export default function HeaderB() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-deep-forest/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-[72px]">
        <Logo variant="horizontal" theme="dark" href="/concept-b" />

        <nav className="hidden md:flex items-center gap-8">
          {navLinksB.map((link) => (
            <Link
              key={link.href}
              href={`/concept-b${link.href}`}
              className="text-sm font-medium text-white/65 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={siteConfig.clientPortalUrl}
            className="text-sm font-medium bg-forest text-white px-5 py-2 rounded-sm hover:bg-forest-75 transition-colors"
          >
            Client Portal
          </a>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-white transition-transform ${
              mobileOpen ? "rotate-45 translate-y-[4.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white transition-opacity ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-white transition-transform ${
              mobileOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
            }`}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-deep-forest">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinksB.map((link) => (
              <Link
                key={link.href}
                href={`/concept-b${link.href}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/65 py-2.5 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.clientPortalUrl}
              onClick={() => setMobileOpen(false)}
              className="mt-2 text-sm font-medium text-center bg-forest text-white px-5 py-2.5 rounded-sm hover:bg-forest-75 transition-colors"
            >
              Client Portal
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
