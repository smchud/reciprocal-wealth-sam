"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { navLinks } from "@/data/siteConfig";

export default function HeaderA() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="h-[1px] bg-forest w-full" />
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-near-black/5">
        <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-[72px]">
          <Logo variant="horizontal" theme="light" href="/concept-a" />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/concept-a${link.href}`}
                className="text-sm font-medium text-near-black/70 hover:text-near-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/concept-a/talk-to-us"
              className="text-sm font-medium border border-forest text-forest px-5 py-2 rounded-sm hover:bg-forest hover:text-white transition-colors"
            >
              Talk to Us
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.5px] bg-near-black transition-transform ${
                mobileOpen ? "rotate-45 translate-y-[4.5px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-near-black transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-near-black transition-transform ${
                mobileOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
              }`}
            />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-near-black/5 bg-white">
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/concept-a${link.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-near-black/70 py-2.5 hover:text-near-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/concept-a/talk-to-us"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-sm font-medium text-center border border-forest text-forest px-5 py-2.5 rounded-sm hover:bg-forest hover:text-white transition-colors"
              >
                Talk to Us
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
