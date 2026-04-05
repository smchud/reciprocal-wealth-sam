import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { siteConfig, footerLinks } from "@/data/siteConfig";

export default function FooterA() {
  return (
    <footer className="bg-deep-forest text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Logo variant="horizontal" theme="dark" />
            <p className="mt-4 text-sm text-white/50 italic">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 mb-4">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/concept-a${link.href}`}
                  className="text-sm text-white/65 hover:text-white transition-colors"
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
            <div className="space-y-2.5 text-sm text-white/65">
              <p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>{siteConfig.address}</p>
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
