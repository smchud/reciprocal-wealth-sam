"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { navLinks, siteConfig } from "@/data/siteConfig";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-deep-forest/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between gap-8 h-[72px]">
        <Logo variant="horizontal" theme="dark" href="/" />

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href || "/"}
              className="flex items-center min-h-11 whitespace-nowrap text-sm font-medium text-white/65 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href={siteConfig.altruistPortalUrl}
              className="flex items-center min-h-11 whitespace-nowrap text-sm font-medium border border-white/30 text-white px-5 rounded-sm hover:border-white/55 hover:bg-white/5 transition-colors"
            >
              Client Portal
            </a>
            <Link
              href="/get-started"
              className="flex items-center min-h-11 whitespace-nowrap text-sm font-medium bg-forest text-white px-5 rounded-sm hover:bg-forest-75 transition-colors"
            >
              Become a Client
            </Link>
          </div>
        </nav>

        <button
          ref={toggleRef}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 cursor-pointer w-11 h-11 -mr-2.5"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
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
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden border-t border-white/10 bg-deep-forest"
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href || "/"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center text-sm font-medium text-white/65 min-h-11 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.altruistPortalUrl}
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center justify-center text-sm font-medium text-center min-h-11 border border-white/30 text-white px-5 rounded-sm hover:border-white/55 hover:bg-white/5 transition-colors"
            >
              Client Portal
            </a>
            <Link
              href="/get-started"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center text-sm font-medium text-center min-h-11 bg-forest text-white px-5 rounded-sm hover:bg-forest-75 transition-colors"
            >
              Become a Client
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
