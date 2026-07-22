import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { siteConfig, footerLinks } from "@/data/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-deep-forest text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Logo variant="horizontal" theme="dark" showTagline />
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 mb-4">
              Navigation
            </h4>
            <nav className="flex flex-col">
              {footerLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href.startsWith("/") || link.href === "" ? link.href || "/" : link.href}
                  className="flex items-center min-h-11 text-sm text-white/65 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 mb-4">
              Contact
            </h4>
            <div className="text-sm text-white/65">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center min-h-11 hover:text-white transition-colors"
              >
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center min-h-11 hover:text-white transition-colors"
              >
                {siteConfig.phone}
              </a>
              <p className="py-2.5">{siteConfig.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10">
          <p className="text-xs text-white/30 leading-relaxed">
            {siteConfig.disclosure}
          </p>
          <p className="mt-3 text-xs text-white/25">{siteConfig.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
