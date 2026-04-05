import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import ContactForm from "@/components/shared/ContactForm";
import { siteConfig } from "@/data/siteConfig";

export default function TalkToUsA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 md:gap-16">
          <FadeIn>
            <SectionLabel>Get in Touch</SectionLabel>
            <h1 className="mt-4 text-[32px] md:text-[36px] font-light tracking-[-1px] text-near-black leading-tight mb-3">
              Talk to us
            </h1>
            <p className="text-base text-stone leading-relaxed mb-10">
              Have a question or want to learn more? We&rsquo;re happy to help.
            </p>
            <ContactForm />
          </FadeIn>
          <FadeIn delay={150} className="md:pt-20">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-stone mb-2">
                  Email
                </h4>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-near-black hover:text-forest transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-stone mb-2">
                  Phone
                </h4>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-sm text-near-black hover:text-forest transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-stone mb-2">
                  Office
                </h4>
                <p className="text-sm text-near-black">{siteConfig.address}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
