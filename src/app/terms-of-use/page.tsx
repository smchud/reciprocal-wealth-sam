import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Terms governing use of the Reciprocal Wealth, LLC website — general information only, not personalized investment advice.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  openGraph: { title: "Terms of Use", description, images: ["/images/og-default.png"] },
};

const heading = "mt-10 text-lg font-medium text-near-black tracking-[-0.2px]";
const firstHeading = "text-lg font-medium text-near-black tracking-[-0.2px]";

export default function TermsOfUse() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Legal
            </span>
            <h1 className="text-[32px] md:text-[36px] font-light tracking-[-1px] text-white leading-tight">
              Terms of Use
            </h1>
            <p className="mt-5 text-sm text-white/55">Effective: July 9, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[720px] px-6 text-sm text-stone leading-relaxed">
          <h2 className={firstHeading}>Acceptance of These Terms</h2>
          <div className="mt-4 space-y-4">
            <p>
              By accessing or using this website (the &ldquo;Site&rdquo;),
              operated by Reciprocal Wealth, LLC (&ldquo;Reciprocal
              Wealth,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;), you agree to be bound by these Terms of Use.
              If you do not agree, please do not use the Site.
            </p>
          </div>

          <h2 className={heading}>General Information Only</h2>
          <div className="mt-4 space-y-4">
            <p>
              The content on this Site — including our description of
              services, brand values, FAQs, and any other commentary or
              educational material — is provided for general informational
              purposes only. It is not, and should not be construed as,
              personalized investment advice or a recommendation to buy,
              sell, or hold any security, fund, or investment product.
            </p>
            <p>
              Reciprocal Wealth provides individualized investment advice
              only to clients with whom we have entered into a written
              advisory agreement, and only after gathering the information
              necessary to understand that client&rsquo;s specific financial
              situation, goals, and risk tolerance. Nothing you read on this
              Site substitutes for that process.
            </p>
          </div>

          <h2 className={heading}>Not an Offer Where We&rsquo;re Not Registered or Exempt</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth, LLC is a registered investment advisor
              located in the Commonwealth of Massachusetts. We render
              individualized advice to residents of other states only after
              complying with that state&rsquo;s registration requirements, or
              pursuant to an applicable state exemption or exclusion. Nothing
              on this Site should be construed as an offer to provide
              advisory services in any jurisdiction where Reciprocal Wealth
              is not registered, or is not otherwise exempt from registration
              requirements.
            </p>
          </div>

          <h2 className={heading}>No Warranty</h2>
          <div className="mt-4 space-y-4">
            <p>
              The Site and its content are provided &ldquo;as is,&rdquo;
              without warranty of any kind. Reciprocal Wealth does not
              guarantee the accuracy, completeness, or timeliness of
              information on the Site, and is not liable for any errors,
              omissions, or your reliance on this content. Investing involves
              risk, including possible loss of principal, and past
              performance is not indicative of future results. See our{" "}
              <Link
                href="/disclosures"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                Disclosures
              </Link>{" "}
              page for our full risk disclosure.
            </p>
          </div>

          <h2 className={heading}>Changes to These Terms</h2>
          <div className="mt-4 space-y-4">
            <p>
              We may revise these Terms of Use at any time by posting an
              updated version on this page. Continued use of the Site after
              changes are posted constitutes your acceptance of the revised
              Terms.
            </p>
          </div>

          <h2 className={heading}>Related Policies</h2>
          <div className="mt-4 space-y-4">
            <p>
              These Terms of Use should be read alongside our{" "}
              <Link
                href="/disclosures"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                Disclosures
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                Privacy Policy
              </Link>
              , which together describe our regulatory status, business
              practices, and how we handle your personal information.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
