import FadeIn from "@/components/shared/FadeIn";
import ContactForm from "@/components/shared/ContactForm";
import { siteConfig } from "@/data/siteConfig";

export default function TalkToUsB() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Get in Touch
            </span>
            <h1 className="text-[32px] md:text-[36px] font-light tracking-[-1px] text-white leading-tight">
              Contact us
            </h1>
            <p className="mt-5 text-base text-white/55 leading-relaxed">
              If you have a question or would like to learn more, send us a
              message. We will respond as soon as we can.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px] mx-auto">
            <FadeIn>
              <ContactForm />
            </FadeIn>
            <FadeIn delay={100} className="mt-10 pt-8 border-t border-near-black/8 flex flex-col sm:flex-row justify-center gap-8 text-center">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-stone mb-1">
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
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-stone mb-1">
                  Phone
                </h4>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-sm text-near-black hover:text-forest transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
