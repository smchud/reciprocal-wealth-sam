import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import FAQAccordion from "@/components/shared/FAQAccordion";
import ContactForm from "@/components/shared/ContactForm";
import { values } from "@/data/values";
import { differentiators } from "@/data/differentiators";
import { founders, ourStory } from "@/data/founders";
import { faqs } from "@/data/faqs";
import { siteConfig } from "@/data/siteConfig";

export default function ConceptAHome() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[720px]">
            <h1 className="text-[36px] md:text-[42px] font-light leading-[1.15] tracking-[-1.5px] text-near-black">
              Spend less time worrying about money.
              <br />
              <span className="text-forest">
                More time on what matters.
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-stone leading-relaxed max-w-[540px]">
              Wealth management for time-pressed working professionals.
              Clear guidance, honest advice, and a plan built around your life.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/concept-a/talk-to-us"
                className="inline-flex items-center rounded-sm bg-forest px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-forest"
              >
                Talk to Us
              </Link>
              <Link
                href="/concept-a/why-reciprocal"
                className="inline-flex items-center rounded-sm border border-near-black/15 px-7 py-3 text-sm font-medium text-near-black transition-colors hover:border-near-black/30"
              >
                Why Reciprocal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Landscape divider */}
      <FadeIn>
        <div className="relative h-[280px] md:h-[360px] overflow-hidden">
          <Image
            src="/images/stock/autumn-lake.jpg"
            alt="Autumn landscape"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-deep-forest/20" />
        </div>
      </FadeIn>

      {/* Intro */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="max-w-[640px] mx-auto text-center">
            <SectionLabel>Who We Are</SectionLabel>
            <p className="mt-5 text-lg md:text-xl font-light text-near-black leading-relaxed">
              Reciprocal Wealth is a boutique, fee-only wealth management firm
              built for busy professionals and families. Our mission is to help
              you provide for yourself and your loved ones in the present while
              creating a safe and secure future.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <SectionLabel>Our Values</SectionLabel>
          </FadeIn>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-near-black/8">
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
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <SectionLabel>Why Reciprocal</SectionLabel>
            <h2 className="mt-4 text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black">
              What makes us different
            </h2>
          </FadeIn>
          <div className="mt-12 space-y-0 divide-y divide-near-black/8">
            {differentiators.map((diff, i) => (
              <FadeIn
                key={diff.title}
                delay={i * 80}
                className="py-8 first:pt-0 last:pb-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-3 md:gap-8">
                  <h3 className="text-base font-medium text-near-black">
                    {diff.title}
                  </h3>
                  <p className="text-sm text-stone leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <SectionLabel>Meet the Founders</SectionLabel>
            <h2 className="mt-4 text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black">
              Who we are
            </h2>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {founders.map((founder, i) => (
              <FadeIn key={founder.name} delay={i * 150}>
                <div className="aspect-[4/5] relative bg-warm-gray overflow-hidden mb-6">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12 items-start">
            <FadeIn>
              <SectionLabel>Our Story</SectionLabel>
              <div className="mt-6 space-y-4">
                {ourStory.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm md:text-base text-near-black/80 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={200} className="hidden md:block">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src="/images/stock/path-autumn.jpg"
                  alt="Autumn path"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[720px]">
            <FadeIn>
              <SectionLabel>Frequently Asked Questions</SectionLabel>
              <h2 className="mt-4 text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black">
                Common questions
              </h2>
            </FadeIn>
            <FadeIn className="mt-10">
              <FAQAccordion faqs={faqs.slice(0, 6)} />
            </FadeIn>
            <FadeIn className="mt-8">
              <Link
                href="/concept-a/faqs"
                className="text-sm text-forest font-medium hover:text-deep-forest transition-colors"
              >
                View all FAQs &rarr;
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 md:gap-16">
            <FadeIn>
              <SectionLabel>Get in Touch</SectionLabel>
              <h2 className="mt-4 text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black mb-8">
                Talk to us
              </h2>
              <ContactForm />
            </FadeIn>
            <FadeIn delay={150} className="md:pt-16">
              <div className="aspect-[4/3] relative overflow-hidden mb-8 hidden md:block">
                <Image
                  src="/images/stock/coffee-morning.jpg"
                  alt="Morning coffee"
                  fill
                  className="object-cover"
                />
              </div>
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
                  <p className="text-sm text-near-black">
                    {siteConfig.address}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
