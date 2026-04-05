import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import { differentiators } from "@/data/differentiators";

export default function WhyReciprocalB() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Why Reciprocal
            </span>
            <h1 className="text-[32px] md:text-[36px] font-light tracking-[-1px] text-white leading-tight">
              What makes us different
            </h1>
            <p className="mt-5 text-base text-white/55 leading-relaxed">
              We believe wealth management should be straightforward, honest,
              and centered on your goals and priorities.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((diff, i) => (
              <FadeIn
                key={diff.title}
                delay={i * 80}
                className={`bg-warm-gray p-8 md:p-10 ${
                  i === differentiators.length - 1 && differentiators.length % 2 !== 0
                    ? "md:col-span-2 md:max-w-[calc(50%-12px)]"
                    : ""
                }`}
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
