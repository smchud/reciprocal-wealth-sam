import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import { differentiators } from "@/data/differentiators";

export default function WhyReciprocalA() {
  return (
    <>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <SectionLabel>Why Reciprocal</SectionLabel>
            <h1 className="mt-4 text-[32px] md:text-[36px] font-light tracking-[-1px] text-near-black leading-tight">
              What makes us different
            </h1>
            <p className="mt-5 text-base text-stone leading-relaxed">
              We believe wealth management should be straightforward, honest, and
              built around your interests — not ours. Here&rsquo;s how we put that
              into practice.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="space-y-0 divide-y divide-near-black/8">
            {differentiators.map((diff, i) => (
              <FadeIn
                key={diff.title}
                delay={i * 80}
                className="py-10 first:pt-0 last:pb-0"
              >
                <h3 className="text-lg font-medium text-near-black mb-3">
                  {diff.title}
                </h3>
                <p className="text-sm text-stone leading-relaxed max-w-[600px]">
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
