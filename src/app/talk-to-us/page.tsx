import type { Metadata } from "next";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import ContactForm from "@/components/shared/ContactForm";
import { siteConfig } from "@/data/siteConfig";

const BOOKINGS_URL =
  "https://outlook.office.com/book/ReciprocalWealth1@reciprocalwealth.com/?ismsaljsauthenabled";

const description =
  "Have a question or want to learn more? Send Reciprocal Wealth a message and we'll respond as soon as we can.";

export const metadata: Metadata = {
  title: "Talk to Us",
  description,
  openGraph: { title: "Talk to Us", description, images: ["/images/og-default.png"] },
};

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
                  className="inline-flex items-center min-h-11 text-sm text-near-black hover:text-forest transition-colors"
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
                  className="inline-flex items-center min-h-11 text-sm text-near-black hover:text-forest transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[640px] px-6 text-center">
          <FadeIn>
            <SectionLabel>Schedule a Time</SectionLabel>
            <p className="mt-3 text-sm text-stone max-w-[480px] mx-auto">
              Prefer to pick a time directly? Book a call at a time that
              works for you.
            </p>
            <a
              href={BOOKINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-11 mt-8 rounded-sm bg-forest px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-forest"
            >
              Schedule a Call
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
