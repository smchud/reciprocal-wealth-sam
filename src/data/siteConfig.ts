export const siteConfig = {
  name: "Reciprocal Wealth",
  tagline: "Invested Together",
  email: "info@reciprocalwealth.com",
  phone: "774-403-5105",
  address: "Medfield, MA | Waban, MA",
  // Altruist client portal login - white-labeled with Reciprocal Wealth
  // branding. Signing and account opening happen entirely on Altruist's
  // side; this is only the existing-client login link (the "Client Login"
  // button in the header and footer, per PRD 6.4's existing-client path).
  altruistPortalUrl: "https://app.altruist.com/login?client",
  bookingsUrl:
    "https://outlook.office.com/book/ReciprocalWealth1@reciprocalwealth.com/?ismsaljsauthenabled",
  disclosure:
    "Reciprocal Wealth, LLC is a Registered Investment Adviser. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security or investment product. Past performance is not indicative of future results.",
  copyright: `© ${new Date().getFullYear()} Reciprocal Wealth, LLC. All rights reserved.`,
};

/** Top nav: Disclosures after FAQs, before Talk to Us */
export const navLinks = [
  { label: "Our Offering", href: "" },
  { label: "Why Reciprocal", href: "/why-reciprocal" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "FAQs", href: "/faqs" },
  { label: "Disclosures", href: "/disclosures" },
  { label: "Talk to Us", href: "/talk-to-us" },
] as const;

export const footerLinks = [
  ...navLinks,
  { label: "Become a Client", href: "/get-started" },
  { label: "Client Login", href: siteConfig.altruistPortalUrl },
  { label: "Fee Schedule", href: "/fee-schedule" },
] as const;
