import Image from "next/image";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import { founders, ourStory } from "@/data/founders";

export default function WhoWeAreB() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Who We Are
            </span>
            <h1 className="text-[32px] md:text-[36px] font-light tracking-[-1px] text-white leading-tight">
              Built by two friends with a shared purpose
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <SectionLabel>Our Story</SectionLabel>
            <div className="mt-6 space-y-4 text-left">
              {ourStory.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm md:text-base text-near-black/80 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <h2 className="text-center text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black mb-12">
            Meet the Founders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, i) => (
              <FadeIn key={founder.name} delay={i * 150}>
                <div className="bg-warm-gray p-6 md:p-8">
                  <div className="aspect-[3/2] relative overflow-hidden mb-6">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <h2 className="text-xl font-medium text-near-black">
                    {founder.name}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-forest mt-1 mb-5">
                    {founder.title}
                  </p>
                  {founder.bio.split("\n\n").map((p, j) => (
                    <p key={j} className="text-sm text-stone leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                  <a
                    href={`mailto:${founder.email}`}
                    className="inline-block mt-2 text-sm text-forest hover:text-deep-forest transition-colors"
                  >
                    {founder.email}
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
