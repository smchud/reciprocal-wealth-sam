import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import FAQAccordion from "@/components/shared/FAQAccordion";
import ContactForm from "@/components/shared/ContactForm";
import { values } from "@/data/values";
import { differentiators, reciprocityByContract } from "@/data/differentiators";
import { founders } from "@/data/founders";
import { faqs } from "@/data/faqs";
import { siteConfig } from "@/data/siteConfig";

const investmentPillars = [
  {
    number: "01",
    title: "Asset Allocation",
    description:
      "Bespoke risk-weighted portfolios of low-cost ETFs. Diversified across proven asset classes to mirror your risk tolerance and stated investment objectives.",
  },
  {
    number: "02",
    title: "Regular Rebalancing",
    description:
      "Disciplined. Scheduled. We hold steady when the markets are not, rather than wagering on a fund manager's ability to predict the optimal points of entry and exit.",
  },
  {
    number: "03",
    title: "Tactical Taxation",
    description:
      "Strategic asset location across all of your accounts. Enhanced with opportunistic tax-loss capture. Lower fees and trading costs, so your return survives the tax bill.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-deep-forest py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="relative mx-auto max-w-[1200px] px-6">
          <div className="flex items-center gap-12">
            <div className="flex-1 max-w-[720px]">
              <h1 className="font-serif text-[40px] md:text-[56px] leading-[1.1] tracking-[-1px] text-white">
                Invested <span className="italic">Together.</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/60 leading-relaxed max-w-[540px]">
                An independent, fee-only investment adviser for affluent
                individuals and families.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={siteConfig.bookingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-sm bg-white px-7 py-3 text-sm font-medium text-deep-forest transition-colors hover:bg-warm-gray"
                >
                  Schedule A Call
                </a>
                <Link
                  href="/get-started"
                  className="inline-flex items-center rounded-sm border border-white/35 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-white/55 hover:bg-white/5"
                >
                  Become a Client
                </Link>
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <Image
                src="/images/logo-vertical-dark-transparent.png"
                alt="Reciprocal Wealth"
                width={1418}
                height={1898}
                className="h-64 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="max-w-[640px] mx-auto text-center">
            <SectionLabel>What We Do</SectionLabel>
            <h2 className="mt-4 font-serif text-2xl md:text-[32px] tracking-[-0.3px] text-near-black">
              An independent, <span className="italic">fee-only</span> adviser.
            </h2>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Fiduciary, First",
                description:
                  "Reciprocal Wealth is a fiduciary, electing to be held to the highest regulatory standard in financial services. We are legally obligated to prioritize clients' financial interests ahead of our own — without exception.",
              },
              {
                title: "Who We Help",
                description:
                  "We provide holistic investment advice and financial-planning services to affluent individuals and families. Planning is scaled to each client's need. Working professional or retiree, we'll craft a plan for you.",
              },
              {
                title: "Single Stream",
                description:
                  "We do not accept commissions. We do not sell product. We do not engage in any transactional business. We derive 100% of our revenue from a single, monthly fee on the assets that we manage for you.",
              },
            ].map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 100} className="border-t-2 border-forest pt-5 h-full flex flex-col">
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-forest">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-stone leading-relaxed min-h-[130px] md:min-h-[110px]">
                  {pillar.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-forest-10 py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="max-w-[900px] mx-auto text-center">
            <SectionLabel>Our Mission</SectionLabel>
            <p className="mt-6 font-serif text-xl md:text-2xl text-near-black leading-relaxed tracking-[-0.3px]">
              Relentlessly aspire to deliver the best for our clients.
              <br />
              <span className="md:whitespace-nowrap">
                Innovate fearlessly, learn constantly, and persevere
                tenaciously.
              </span>
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
                className="bg-white border border-near-black/8 shadow-sm p-8 md:p-10"
              >
                <h2 className="text-lg font-medium text-near-black tracking-[-0.2px]">
                  {value.title}
                </h2>
                <p className="mt-3 text-sm text-stone leading-relaxed">
                  {value.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How We Invest */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="max-w-[640px] mx-auto text-center">
            <SectionLabel>How We Invest</SectionLabel>
            <h2 className="mt-4 font-serif text-2xl md:text-[32px] tracking-[-0.3px] text-near-black">
              <span className="italic">Simple,</span> by design.
            </h2>
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {investmentPillars.map((pillar, i) => (
              <FadeIn
                key={pillar.number}
                delay={i * 100}
                className={
                  i > 0 ? "md:border-l md:border-near-black/10 md:pl-8" : ""
                }
              >
                <span className="font-serif text-xl font-bold text-forest">
                  {pillar.number}
                </span>
                <h3 className="mt-2 text-base font-medium text-near-black">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-stone leading-relaxed">
                  {pillar.description}
                </p>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-14 pt-10 border-t border-near-black/10 text-center">
            <p className="text-lg md:text-xl text-near-black leading-relaxed max-w-[720px] mx-auto">
              Investing, though rarely easy,{" "}
              <strong className="font-semibold text-deep-forest">
                does not need to be complicated.
              </strong>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center max-w-[640px] mx-auto">
            <SectionLabel>Who We Are</SectionLabel>
            <h2 className="mt-4 font-serif text-2xl md:text-[32px] tracking-[-0.3px] text-near-black">
              Built by <span className="italic">operators,</span> not salesmen.
            </h2>
          </FadeIn>
          <div className="mt-12 space-y-8">
            {[...founders].reverse().map((founder, i) => (
              <FadeIn key={founder.name} delay={i * 150}>
                <div className="bg-white p-6 md:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-8">
                    <div className="w-full sm:w-64 md:w-72 aspect-[540/615] relative flex-shrink-0 overflow-hidden bg-warm-gray">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        sizes="(min-width: 768px) 288px, (min-width: 640px) 256px, 100vw"
                        quality={95}
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-near-black">
                        {founder.name}
                      </h3>
                      <p className="text-sm text-stone italic mt-0.5">
                        &ldquo;{founder.nickname}&rdquo; &middot; {founder.title}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-forest mt-2">
                        {founder.focus}
                      </p>
                      <p className="mt-4 text-sm text-stone leading-relaxed max-w-[65ch]">
                        {founder.bio}
                      </p>
                      <ul className="mt-4 space-y-1">
                        {founder.education.map((line) => (
                          <li key={line} className="text-xs text-stone/80 leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`mailto:${founder.email}`}
                        className="flex items-center min-h-11 w-full mt-3 text-sm text-forest hover:text-deep-forest transition-colors break-words"
                      >
                        {founder.email}
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How We Differ */}
      <section className="bg-deep-forest py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Reciprocity For All — lead differentiator */}
          <FadeIn>
            <SectionLabel className="text-forest-50">How We Differ</SectionLabel>
            <h2 className="mt-4 font-serif text-2xl md:text-[32px] tracking-[-0.3px] text-white">
              {reciprocityByContract.label}
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/55 leading-relaxed max-w-[640px]">
              {reciprocityByContract.tagline}
            </p>
          </FadeIn>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-14 items-center">
            <FadeIn>
              <div className="space-y-4">
                {reciprocityByContract.points.map((point) => (
                  <div key={point.title} className="border border-white/10 bg-white/[0.04] p-6">
                    <h4 className="text-base font-medium text-white">
                      {point.title}
                    </h4>
                    <p className="mt-1.5 text-sm text-white/55 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="bg-forest-10 p-10 md:p-12 text-center">
                <p className="font-serif lining-nums text-[64px] md:text-[72px] font-bold tracking-[-2px] text-deep-forest leading-none">
                  {reciprocityByContract.stat}
                </p>
                <p className="mt-5 text-base font-bold text-deep-forest leading-relaxed max-w-[240px] mx-auto">
                  {reciprocityByContract.statDescription}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-forest">
                  {reciprocityByContract.statLabel}
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="mt-14 pt-12 border-t border-white/10">
            <FadeIn className="text-center mb-10">
              <h3 className="font-serif text-2xl md:text-[28px] tracking-[-0.4px] text-white">
                More ways we&rsquo;re different
              </h3>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {differentiators.map((diff, i) => (
                <FadeIn
                  key={diff.title}
                  delay={i * 80}
                  className="border border-white/10 p-8"
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
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[720px] mx-auto">
            <FadeIn className="text-center">
              <SectionLabel>Frequently Asked Questions</SectionLabel>
            </FadeIn>
            <FadeIn className="mt-10">
              <FAQAccordion faqs={faqs.slice(0, 6)} />
            </FadeIn>
            <FadeIn className="mt-8 text-center">
              <Link
                href="/faqs"
                className="inline-flex items-center min-h-11 text-sm text-forest font-medium hover:text-deep-forest transition-colors"
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
          <FadeIn className="max-w-[640px] mx-auto">
            <div className="text-center mb-10">
              <SectionLabel>Talk to Us</SectionLabel>
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
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
