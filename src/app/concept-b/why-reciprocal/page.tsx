import FadeIn from "@/components/shared/FadeIn";
import { differentiators, clientPool } from "@/data/differentiators";

export default function WhyReciprocalB() {
  const otherDifferentiators = differentiators.filter(
    (diff) => diff.title !== clientPool.label
  );

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

      {/* The Client Pool — dedicated section */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">
            <FadeIn>
              <span className="inline-block text-xl md:text-2xl font-semibold uppercase tracking-[0.1em] text-forest">
                {clientPool.label}
              </span>
              <h2 className="mt-4 text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black">
                {clientPool.heading}
              </h2>
              <p className="mt-4 text-sm md:text-base text-stone leading-relaxed">
                {clientPool.tagline}
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4">
                {clientPool.points.map((point) => (
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
                <p className="text-[64px] md:text-[72px] font-bold tracking-[-2px] text-white leading-none">
                  {clientPool.stat}
                </p>
                <p className="mt-5 text-base font-bold text-white leading-relaxed max-w-[260px] mx-auto">
                  {clientPool.statDescription}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-forest-50">
                  {clientPool.statLabel}
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
            <h2 className="text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black">
              More ways we&rsquo;re different
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherDifferentiators.map((diff, i) => (
              <FadeIn
                key={diff.title}
                delay={i * 80}
                className={`bg-white p-8 md:p-10 ${
                  i === otherDifferentiators.length - 1 &&
                  otherDifferentiators.length % 2 !== 0
                    ? "md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto"
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
