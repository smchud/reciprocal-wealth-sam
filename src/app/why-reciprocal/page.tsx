import type { Metadata } from "next";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import { differentiators, reciprocityByContract } from "@/data/differentiators";

const description =
  "Reciprocity For All is our unique way of sharing in the firm's success with clients — plus the other ways we believe wealth management should work.";

export const metadata: Metadata = {
  title: "Why Reciprocal",
  description,
  openGraph: { title: "Why Reciprocal", description, images: ["/images/og-default.png"] },
};

export default function WhyReciprocalB() {
  return (
    <>
      {/* Reciprocity For All — dedicated section, page lead */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <SectionLabel className="text-[11px] md:text-[11px]">How We Differ</SectionLabel>
            <h1 className="mt-4 font-serif text-[32px] md:text-[36px] tracking-[-0.5px] text-near-black leading-tight">
              {reciprocityByContract.label}
            </h1>
            <p className="mt-4 text-sm md:text-base text-stone leading-relaxed max-w-[640px]">
              {reciprocityByContract.tagline}
            </p>
          </FadeIn>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">
            <FadeIn>
              <div className="grid grid-cols-1 gap-4">
                {reciprocityByContract.points.map((point) => (
                  <div key={point.title} className="bg-forest-10 p-6">
                    <h3 className="text-base font-medium text-deep-forest">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-near-black/70 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="bg-deep-forest p-10 md:p-14 text-center">
                <p className="font-serif lining-nums text-[64px] md:text-[72px] font-bold tracking-[-2px] text-white leading-none">
                  {reciprocityByContract.stat}
                </p>
                <p className="mt-5 text-base font-bold text-white leading-relaxed max-w-[260px] mx-auto">
                  {reciprocityByContract.statDescription}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-forest-50">
                  {reciprocityByContract.statLabel}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Remaining differentiators */}
      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-[28px] tracking-[-0.4px] text-near-black">
              More ways we&rsquo;re different
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((diff, i) => (
              <FadeIn
                key={diff.title}
                delay={i * 80}
                className="bg-white border border-near-black/8 shadow-sm p-8 md:p-10"
              >
                <h3 className="text-lg font-medium text-near-black mb-3">
                  {diff.title}
                </h3>
                <p className="text-sm text-stone leading-relaxed">
                  {diff.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
