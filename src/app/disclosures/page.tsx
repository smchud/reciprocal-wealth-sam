import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Legal disclosures and important information about Reciprocal Wealth, LLC.";

export const metadata: Metadata = {
  title: "Disclosures",
  description,
  openGraph: { title: "Disclosures", description, images: ["/images/og-default.png"] },
};

const heading = "mt-10 text-lg font-medium text-near-black tracking-[-0.2px]";
const firstHeading = "text-lg font-medium text-near-black tracking-[-0.2px]";

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
        <div className="mx-auto max-w-[720px] px-6 text-sm text-stone leading-relaxed">
          <h2 className={firstHeading}>Important Disclaimers</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth, LLC (&ldquo;Reciprocal Wealth&rdquo;) is a
              Registered Investment Advisor (&ldquo;RIA&rdquo;), located in the
              Commonwealth of Massachusetts. Reciprocal Wealth provides
              investment advisory and related services for clients nationally.
              Reciprocal Wealth will maintain all applicable registration and
              licenses as required by the various states in which Reciprocal
              Wealth conducts business, as applicable. Reciprocal Wealth
              renders individualized responses to persons in a particular
              state only after complying with all regulatory requirements, or
              pursuant to an applicable state exemption or exclusion.
            </p>
          </div>

          <h2 className={heading}>Terms of Use</h2>
          <div className="mt-4 space-y-4">
            <p>
              Please read these terms and conditions of use (&ldquo;Terms&rdquo;)
              carefully before using the website located at
              http://www.reciprocalwealth.com (&ldquo;Website&rdquo;) or any of
              the information or services provided by Reciprocal Wealth, LLC
              (collectively &ldquo;Reciprocal Wealth&rdquo;, &ldquo;we&rdquo;,
              &ldquo;our&rdquo;, &ldquo;us&rdquo;) in connection with the
              Website. By using the Website, you acknowledge that you have
              read and understood these Terms and accept to be legally bound
              by them. If you do not accept and agree to these Terms, you are
              not an authorized user of the Website or any of the information
              or services provided by Reciprocal Wealth in connection with the
              Website and should promptly terminate all use thereof. The terms
              &ldquo;you&rdquo; and &ldquo;your&rdquo; mean you and any entity
              you may represent in connection with the use of the Website. You
              may use your browser to download or print a copy of these Terms
              for your records.
            </p>
            <p>
              Reciprocal Wealth reserves the right to change, modify, add or
              remove portions of these Terms at any time for any reason. We
              suggest that you review these Terms periodically for changes.
              Such changes shall be effective immediately upon posting. You
              acknowledge that by accessing our Website after we have posted
              changes to these Terms, you are agreeing to these Terms as
              modified.
            </p>
            <p>These Terms were last updated on July 9, 2026.</p>
          </div>

          <h2 className={heading}>Risk Disclosure</h2>
          <div className="mt-4 space-y-4">
            <p>
              Different types of investments involve varying degrees of risk.
              Therefore, it should not be assumed that future performance of
              any specific investment or investment strategy will be
              profitable.
            </p>
            <p>
              Asset allocation may be used in an effort to manage risk and
              enhance returns. It does not, however, guarantee a profit or
              protect against loss. Performance of the asset allocation
              strategies depends on the underlying investments.
            </p>
            <p>
              This website is intended to provide general information about
              Reciprocal Wealth and its services. It is not intended to offer
              or deliver investment advice in any way. Information regarding
              investment services are provided solely to gain an
              understanding of our investment philosophy, our strategies and
              to be able to contact us for further information.
            </p>
            <p>
              Market data, articles and other content on this website are
              based on generally available information and are believed to be
              reliable. Reciprocal Wealth does not guarantee the accuracy of
              the information contained in this website. The information is
              of a general nature and should not be construed as investment
              advice.
            </p>
            <p>
              Please remember that it remains your responsibility to advise
              Reciprocal Wealth, in writing, if there are any changes in your
              personal/financial situation or investment objectives for the
              purpose of reviewing/evaluating/revising our previous
              recommendations and/or services, if you would like to impose,
              add, or to modify any reasonable restrictions to our investment
              advisory services.
            </p>
            <p>
              Reciprocal Wealth will provide all prospective clients with a
              copy of our current Form ADV, Part 2A (&ldquo;Disclosure
              Brochure&rdquo;), Form ADV Part 2B, which is the Brochure
              Supplement for each advisory person supporting a particular
              client. You may obtain a copy of these disclosures on the SEC
              website at{" "}
              <a
                href="http://adviserinfo.sec.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                adviserinfo.sec.gov
              </a>{" "}
              or you may{" "}
              <Link
                href="/talk-to-us"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                Contact Us
              </Link>{" "}
              to request a free copy via .pdf or hardcopy.
            </p>
          </div>

          <h2 className={heading}>Privacy Disclosures</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth is committed to safeguarding the use of
              personal information of our Clients (also referred to as
              &ldquo;you&rdquo; and &ldquo;your&rdquo;) that we obtain as your
              Investment Advisor, as described in our Privacy Policy.
            </p>
            <p>
              Reciprocal Wealth does not collect personal non-public
              information through this website; however, the Advisor may
              collect information from you on application forms, agreements,
              profile or investment policy statements, and other documents
              received or processed in relation to services we provide. We
              also may collect information from other sources.
            </p>
            <p>
              We do not respond to &ldquo;do not track&rdquo; requests because
              we do not track you over time or across third party websites to
              provide targeted advertising. We may track you across our
              website to help us improve our content.
            </p>
            <p>
              We may use &ldquo;cookies&rdquo; and similar online technologies
              to keep, and sometimes track, information about you regarding
              your usage of our website. Cookies are small data files that are
              sent to your browser or related software from a Web server and
              stored on your device. Cookies help us to collect information
              about your usage of our website, including date and time of
              visits, pages viewed, amount of time spent on our sites, or
              general information about the device used to access the site,
              such as the browser used. You can refuse to store or delete
              cookies by configuring your web browser settings. Most browsers
              and mobile devices have their own settings to manage cookies. If
              you refuse a cookie when on our website, or if you delete
              cookies, you may experience some inconvenience in your use of
              our website, such as having to re-configure preferences.
            </p>
            <p>
              When you are on this website you may have the opportunity to
              click-through to other websites, including websites operated by
              unaffiliated third parties. These sites may collect nonpublic
              personal Information about you. We do not control sites
              operated by these entities and are not responsible for the
              information practices of these sites. This Privacy Policy does
              not address the information practices of other websites. The
              privacy policies of websites operated third parties are located
              on those sites.
            </p>
            <p>
              For a copy of the Reciprocal Wealth Privacy Policy, please click
              here.
            </p>
          </div>

          <h2 className={heading}>Email Disclosures</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth often communicates with its clients and
              prospective clients through electronic mail (&ldquo;email&rdquo;)
              and other electronic means. Your privacy and security are very
              important to us. Reciprocal Wealth makes every effort to ensure
              that email communications do not contain sensitive information.
              We remind our clients and others not to send Reciprocal Wealth
              private information over email. If you have sensitive data to
              deliver, we can provide secure means for such delivery.
            </p>
            <p>
              Please note: Reciprocal Wealth does not accept trading or money
              movement instructions via email.
            </p>
            <p>
              As a registered investment advisor, Reciprocal Wealth emails may
              be subject to inspection by the Chief Compliance Officer
              (&ldquo;CCO&rdquo;) of Reciprocal Wealth or the securities
              regulators.
            </p>
            <p>
              If you have received an email from Reciprocal Wealth in error,
              we ask that you contact the sender and destroy the email and its
              contents.
            </p>
            <p>
              If you have any questions regarding our email policies, please{" "}
              <Link
                href="/talk-to-us"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                Contact Us
              </Link>
              .
            </p>
          </div>

          <h2 className={heading}>Social Websites</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth may utilize third-party websites, including
              social media websites, blogs and other interactive content.
              Reciprocal Wealth considers all interactions with clients,
              prospective clients and the general public on these sites to be
              advertisements under the securities regulations. As such,
              Reciprocal Wealth generally retains copies of information that
              Reciprocal Wealth or third-parties may contribute to such
              sites. This information is subject to review and inspection by
              the CCO of Reciprocal Wealth or the securities regulators.
            </p>
            <p>
              Information provided on these sites is for informational and/or
              educational purposes only and is not, in any way, to be
              considered investment advice nor a recommendation of any
              investment product. Advice may only be provided by Reciprocal
              Wealth&rsquo;s advisory persons after entering into an advisory
              agreement and provided Reciprocal Wealth with all requested
              background and account information.
            </p>
            <p>
              If you have any questions regarding our policies, please{" "}
              <Link
                href="/talk-to-us"
                className="text-forest hover:text-deep-forest transition-colors underline"
              >
                Contact Us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
