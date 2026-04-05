import Image from "next/image";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import { founders, ourStory } from "@/data/founders";

export default function WhoWeAreA() {
  return (
    <>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <SectionLabel>Who We Are</SectionLabel>
            <h1 className="mt-4 text-[32px] md:text-[36px] font-light tracking-[-1px] text-near-black leading-tight">
              Built by two friends with a shared purpose
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-warm-gray py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px] mb-16">
            <SectionLabel>Our Story</SectionLabel>
            <div className="mt-6 space-y-4">
              {ourStory.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm md:text-base text-near-black/80 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          {founders.map((founder, i) => (
            <FadeIn
              key={founder.name}
              delay={i * 150}
              className={`grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 ${
                i > 0 ? "mt-16 pt-16 border-t border-near-black/8" : ""
              }`}
            >
              <div className="aspect-[4/5] relative bg-warm-gray overflow-hidden">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h2 className="text-xl font-medium text-near-black">
                  {founder.name}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-forest mt-1 mb-6">
                  {founder.title}
                </p>
                {founder.bio.split("\n\n").map((p, j) => (
                  <p key={j} className="text-sm text-stone leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
                <a
                  href={`mailto:${founder.email}`}
                  className="text-sm text-forest hover:text-deep-forest transition-colors"
                >
                  {founder.email}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
