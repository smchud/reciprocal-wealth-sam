import type { Metadata } from "next";

const description =
  "How Reciprocal Wealth, LLC collects, uses, shares, and protects your personal information.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  openGraph: { title: "Privacy Policy", description, images: ["/images/og-default.png"] },
};

const heading = "mt-10 text-lg font-medium text-near-black tracking-[-0.2px]";
const firstHeading = "text-lg font-medium text-near-black tracking-[-0.2px]";
const subheading = "mt-8 text-base font-medium text-near-black";

const sharingRows = [
  {
    reason: "Servicing our Clients",
    doWeShare: "Yes",
    canYouLimit: "No",
    description:
      "We may share non-public personal information with non-affiliated third parties (such as administrators, brokers, custodians, regulators, credit agencies, other financial institutions) as necessary for us to provide agreed upon services to you, consistent with applicable law, including but not limited to: processing transactions; general account maintenance; responding to regulators or legal investigations; and credit reporting.",
  },
  {
    reason: "Marketing Purposes",
    doWeShare: "No",
    canYouLimit: "Not Shared",
    description:
      "Reciprocal Wealth does not disclose, and does not intend to disclose, personal information with non-affiliated third parties to offer you services. Certain laws may give us the right to share your personal information with financial institutions where you are a customer and where Reciprocal Wealth or the client has a formal agreement with the financial institution. We will only share information for purposes of servicing your accounts, not for marketing purposes.",
  },
  {
    reason: "Authorized Users",
    doWeShare: "Yes",
    canYouLimit: "Yes",
    description:
      "Your non-public personal information may be disclosed to you and persons that we believe to be your authorized agent[s] or representative[s].",
  },
  {
    reason: "Information About Former Clients",
    doWeShare: "No",
    canYouLimit: "Not Shared",
    description:
      "Reciprocal Wealth does not disclose and does not intend to disclose, nonpublic personal information to non-affiliated third parties with respect to persons who are no longer our Clients.",
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <section className="bg-deep-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="max-w-[640px]">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest-50 mb-4">
              Legal
            </span>
            <h1 className="text-[32px] md:text-[36px] font-light tracking-[-1px] text-white leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-5 text-sm text-white/55">Effective: July 9, 2026</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-[720px] px-6 text-sm text-stone leading-relaxed">
          <h2 className={firstHeading}>Our Commitment to You</h2>
          <div className="mt-4 space-y-4">
            <p>
              Reciprocal Wealth, LLC (&ldquo;Reciprocal Wealth&rdquo; or the
              &ldquo;Advisor&rdquo;) is committed to safeguarding the use of
              personal information of our Clients (also referred to as
              &ldquo;you&rdquo; and &ldquo;your&rdquo;) that we obtain as your
              Investment Advisor, as described here in our Privacy Policy
              (&ldquo;Policy&rdquo;). Our relationship with you is our most
              important asset. We understand that you have entrusted us with
              your private information, and we do everything that we can to
              maintain that trust. Reciprocal Wealth (also referred to as
              &ldquo;we&rdquo;, &ldquo;our&rdquo; and &ldquo;us&rdquo;)
              protects the security and confidentiality of the personal
              information we have and implements controls to ensure that such
              information is used for proper business purposes in connection
              with the management or servicing of our relationship with you.
              Reciprocal Wealth does not sell your non-public personal
              information to anyone. Nor do we provide such information to
              others except for discrete and reasonable business purposes in
              connection with the servicing and management of our
              relationship with you, as discussed below. Details of our
              approach to privacy and how your personal non-public
              information is collected and used are set forth in this Policy.
            </p>
            <p>
              <strong className="text-near-black font-medium">
                Why you need to know?
              </strong>{" "}
              Registered Investment Advisors (&ldquo;RIAs&rdquo;) must share
              some of your personal information in the course of servicing
              your account. Federal and State laws give you the right to
              limit some of this sharing and require RIAs to disclose how we
              collect, share, and protect your personal information.
            </p>
          </div>

          <h2 className={heading}>What information do we collect from you?</h2>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 list-disc pl-5">
            <li>Driver&rsquo;s license number</li>
            <li>Date of birth</li>
            <li>Social security or taxpayer identification number</li>
            <li>Assets and liabilities</li>
            <li>Name, address and phone number[s]</li>
            <li>Income and expenses</li>
            <li>E-mail address[es]</li>
            <li>Investment activity</li>
            <li>Account information (including other institutions)</li>
            <li>Investment experience and goals</li>
          </ul>

          <h2 className={heading}>
            What Information do we collect from other sources?
          </h2>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 list-disc pl-5">
            <li>Custody, brokerage and advisory agreements</li>
            <li>Other advisory agreements and legal documents</li>
            <li>Transactional information with us or others</li>
            <li>Account applications and forms</li>
            <li>Investment questionnaires and suitability documents</li>
            <li>Other information needed to service account</li>
          </ul>

          <h2 className={heading}>How do we protect your information?</h2>
          <div className="mt-4 space-y-4">
            <p>
              To safeguard your personal information from unauthorized access
              and use we maintain physical, procedural and electronic
              security measures. These include such safeguards as secure
              passwords, encrypted file storage and a secure office
              environment. Our technology vendors provide security and access
              control over personal information and have policies over the
              transmission of data. Our associates are trained on their
              responsibilities to protect Client&rsquo;s personal
              information. We require third parties that assist in providing
              our services to you to protect the personal information they
              receive from us.
            </p>
          </div>

          <h2 className={heading}>How do we share your information?</h2>
          <div className="mt-4 space-y-4">
            <p>
              An RIA shares Client personal information to effectively
              implement its services. In the table below, we list some
              reasons we may share your personal information.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-near-black/15 text-left">
                  <th className="py-3 pr-4 font-medium text-near-black">
                    Reasons we can share your information
                  </th>
                  <th className="py-3 pr-4 font-medium text-near-black whitespace-nowrap">
                    Do we share?
                  </th>
                  <th className="py-3 font-medium text-near-black whitespace-nowrap">
                    Can you limit?
                  </th>
                </tr>
              </thead>
              <tbody>
                {sharingRows.map((row) => (
                  <tr key={row.reason} className="border-b border-near-black/8 align-top">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-near-black">{row.reason}</p>
                      <p className="mt-1 text-stone">{row.description}</p>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">{row.doWeShare}</td>
                    <td className="py-4 whitespace-nowrap">{row.canYouLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={subheading}>State-specific Regulations</h3>
          <div className="mt-4 space-y-4">
            <p>
              <strong className="text-near-black font-medium">
                Massachusetts
              </strong>
              <br />
              In response to Massachusetts law, the Client must
              &ldquo;opt-in&rdquo; to share non-public personal information
              with non-affiliated third parties before any personal
              information is disclosed. Client opt-in is obtained through the
              Client&rsquo;s execution of authorization forms provided by the
              third parties, by executing an Information Sharing
              Authorization Form, or by other written consent by the Client,
              as appropriate and consistent with applicable laws and
              regulations.
            </p>
          </div>

          <h2 className={heading}>Changes to our Privacy Policy</h2>
          <div className="mt-4 space-y-4">
            <p>
              We will send you a copy of this Policy annually for as long as
              you maintain an ongoing relationship with us. Periodically we
              may revise this Policy and will provide you with a revised
              Policy if the changes materially alter the previous Privacy
              Policy. We will not, however, revise our Privacy Policy to
              permit the sharing of non-public personal information other
              than as described in this notice unless we first notify you
              and provide you with an opportunity to prevent the information
              sharing.
            </p>
          </div>

          <h2 className={heading}>Any Questions?</h2>
          <div className="mt-4 space-y-4">
            <p>
              You may ask questions or voice any concerns, as well as obtain
              a copy of our current Privacy Policy by contacting us at
              774-403-5105 or via email at info@reciprocalwealth.com.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
