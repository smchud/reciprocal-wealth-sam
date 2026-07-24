import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import { founders } from "@/data/founders";

const description =
  "Built by operators, not salesmen. Meet the founders of Reciprocal Wealth.";

export const metadata: Metadata = {
  title: "Who We Are",
  description,
  openGraph: { title: "Who We Are", description, images: ["/images/og-default.png"] },
};

export default function WhoWeAreB() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <SectionLabel className="text-forest-50 text-[11px] md:text-[11px]">
              Who We Are
            </SectionLabel>
            <h1 className="mt-4 font-serif text-[32px] md:text-[36px] tracking-[-0.5px] text-white leading-tight">
              Built by <span className="italic">operators,</span> not salesmen.
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, i) => (
              <FadeIn key={founder.name} delay={i * 150} className="h-full">
                <div className="bg-warm-gray p-6 md:p-8 h-full">
                  <div className="w-60 md:w-72 aspect-[540/615] relative overflow-hidden mb-6 bg-white">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      sizes="(min-width: 768px) 288px, 240px"
                      quality={95}
                      className="object-cover object-center"
                    />
                  </div>
                  <h2 className="text-xl font-medium text-near-black">
                    {founder.name}
                  </h2>
                  <p className="text-sm text-stone italic mt-1">
                    &ldquo;{founder.nickname}&rdquo; &middot; {founder.title}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-forest mt-2 mb-5">
                    {founder.focus}
                  </p>
                  <p className="text-sm text-stone leading-relaxed mb-4">
                    {founder.bio}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {founder.education.map((line) => (
                      <li key={line} className="text-xs text-stone/80 leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:${founder.email}`}
                    className="inline-flex items-center min-h-11 mt-2 text-sm text-forest hover:text-deep-forest transition-colors"
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
