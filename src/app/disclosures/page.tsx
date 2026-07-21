import { siteConfig } from "@/data/siteConfig";

export default function DisclosuresB() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Legal
            </span>
            <h1 className="text-[32px] md:text-[36px] font-light tracking-[-1px] text-white leading-tight">
              Disclosures
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px] space-y-6 text-sm text-stone leading-relaxed">
            <p>{siteConfig.disclosure}</p>
            <p>
              Reciprocal Wealth Management LLC (&ldquo;Reciprocal Wealth&rdquo;)
              is a registered investment advisor. Registration does not imply a
              certain level of skill or training. The information contained
              herein is for informational purposes only and should not be
              considered investment advice or a recommendation to buy or sell any
              particular security.
            </p>
            <p>
              All investing involves risk, including the possible loss of
              principal. There is no guarantee that any investment strategy will
              achieve its objectives. Past performance is not indicative of
              future results.
            </p>
            <p>
              Reciprocal Wealth does not provide legal, tax, or accounting
              advice. Clients should consult with their own legal, tax, or
              accounting advisors before engaging in any transaction.
            </p>
            <p>
              For more information about Reciprocal Wealth, including fees and
              services, please contact us or refer to our Form ADV Part 2A,
              which is available upon request.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
