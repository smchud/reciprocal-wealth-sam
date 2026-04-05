import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import ContactForm from "@/components/shared/ContactForm";
import { values } from "@/data/values";
import { differentiators } from "@/data/differentiators";
import { founders, ourStory } from "@/data/founders";
import { siteConfig } from "@/data/siteConfig";

export default function ConceptBHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-deep-forest py-24 md:py-32 lg:py-40 overflow-hidden">
        <Image
          src="/images/stock/harbor-morning.jpg"
          alt=""
          fill
          className="absolute inset-0 object-cover opacity-35 md:hidden motion-reduce:md:block pointer-events-none"
          sizes="100vw"
          priority
          aria-hidden
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35 hidden md:block motion-reduce:hidden pointer-events-none"
          poster="/images/stock/harbor-morning.jpg"
        >
          <source src="/video/hero-ambient.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-deep-forest/55" />
        <div className="relative mx-auto max-w-[1200px] px-6">
          <div className="max-w-[720px]">
            <h1 className="text-[36px] md:text-[42px] font-light leading-[1.15] tracking-[-1.5px] text-white">
              Spend less time worrying about finances.
              <br />
              More time on what matters most to you.
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/60 leading-relaxed max-w-[540px]">
              Reciprocal Wealth offers personalized wealth management for
              time-pressed working professionals.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={siteConfig.clientPortalUrl}
                className="inline-flex items-center rounded-sm bg-white px-7 py-3 text-sm font-medium text-deep-forest transition-colors hover:bg-warm-gray"
              >
                Client Portal
              </a>
              <Link
                href="/concept-b/why-reciprocal"
                className="inline-flex items-center rounded-sm border border-white/35 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white/55 hover:bg-white/5"
              >
                Why Reciprocal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Ã¢ÂÂ centered */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="max-w-[640px] mx-auto text-center">
            <SectionLabel>Our Mission</SectionLabel>
            <p className="mt-6 text-xl md:text-2xl font-light text-near-black leading-relaxed tracking-[-0.3px]">
              &ldquo;Help you provide for yourself and your loved ones in the
              present while creating a safe and secure future.&rdquo;
            </p>
            <p className="mt-6 text-sm text-stone leading-relaxed">
              Reciprocal Wealth is a fee-only wealth management firm serving
              time-pressed working professionals. We keep our approach
              straightforward, transparent, and focused on what matters to you.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-12">
            <SectionLabel>Our Values</SectionLabel>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <FadeIn
                key={value.title}
                delay={i * 100}
                className="bg-white p-8 md:p-10"
              >
                <h3 className="text-lg font-medium text-near-black tracking-[-0.2px]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-stone leading-relaxed">
                  {value.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Reciprocal */}
      <section className="bg-deep-forest py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <span className="inline-block text-base md:text-lg font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Why Reciprocal
            </span>
            <h2 className="text-3xl md:text-[36px] font-medium tracking-[-0.4px] text-white">
              What makes us different
            </h2>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((diff, i) => (
              <FadeIn
                key={diff.title}
                delay={i * 80}
                className={`border border-white/10 p-8 ${
                  i === differentiators.length - 1 && differentiators.length % 3 !== 0
                    ? "md:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <h3 className="text-base font-medium text-white mb-3">
                  {diff.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {diff.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story + Meet the Founders */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="mx-auto max-w-[40rem]">
            <div className="text-center">
              <SectionLabel>Our Story</SectionLabel>
            </div>
            <div className="mt-8 space-y-5 text-left text-[15px] md:text-base text-near-black/85 leading-[1.65] text-pretty">
              {ourStory.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="mt-16">
            <h2 className="text-center text-3xl md:text-[36px] font-medium tracking-[-0.4px] text-near-black mb-12">
              Meet the Founders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {founders.map((founder, i) => (
                <FadeIn key={founder.name} delay={i * 150}>
                  <div className="bg-warm-gray p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-40 aspect-square relative flex-shrink-0 overflow-hidden">
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-near-black">
                          {founder.name}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-forest mt-1">
                          {founder.title}
                        </p>
                        <p className="mt-4 text-sm text-stone leading-relaxed">
                          {founder.shortBio}
                        </p>
                        <a
                          href={`mailto:${founder.email}`}
                          className="inline-block mt-3 text-sm text-forest hover:text-deep-forest transition-colors"
                        >
                          {founder.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="max-w-[640px] mx-auto">
            <div className="text-center mb-10">
              <SectionLabel>Talk to Us</SectionLabel>
              <h2 className="mt-4 text-3xl md:text-[36px] font-medium tracking-[-0.4px] text-near-black">
                Contact us
              </h2>
              <p className="mt-3 text-sm text-stone">
                If you have a question or would like to learn more, send us a
                message. We will respond as soon as we can.
              </p>
            </div>
            <ContactForm />
            <div className="mt-10 pt-8 border-t border-near-black/8 flex flex-col sm:flex-row justify-center gap-8 text-center">
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
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
