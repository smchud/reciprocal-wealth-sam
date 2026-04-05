import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-gray">
      <div className="mx-auto max-w-[800px] px-6 py-20 text-center">
        <Logo variant="vertical" theme="light" className="mx-auto mb-10" />

        <h1 className="text-2xl md:text-[28px] font-medium tracking-[-0.4px] text-near-black">
          Website Design Review
        </h1>
        <p className="mt-3 text-sm text-stone max-w-[400px] mx-auto">
          Two homepage concepts for Reciprocal Wealth. Click into each to
          explore the full site.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[560px] mx-auto">
          <Link
            href="/concept-a"
            className="group block bg-white p-8 text-left transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-forest">
              Concept A
            </span>
            <h2 className="mt-2 text-lg font-medium text-near-black">
              Classic Trust
            </h2>
            <p className="mt-2 text-xs text-stone leading-relaxed">
              Editorial boutique. White backgrounds, restrained green accents,
              strong typographic hierarchy, formal tone.
            </p>
            <span className="inline-block mt-4 text-sm text-forest font-medium group-hover:translate-x-1 transition-transform">
              View &rarr;
            </span>
          </Link>

          <Link
            href="/concept-b"
            className="group block bg-deep-forest p-8 text-left transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50">
              Concept B
            </span>
            <h2 className="mt-2 text-lg font-medium text-white">
              Modern Relationship
            </h2>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">
              Warmer, more personal. Bold dark sections, prominent founder
              presence, conversational and accessible.
            </p>
            <span className="inline-block mt-4 text-sm text-forest-50 font-medium group-hover:translate-x-1 transition-transform">
              View &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
