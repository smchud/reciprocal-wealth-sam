export const siteConfig = {
  name: "Reciprocal Wealth",
  tagline: "Invested Together",
  email: "info@reciprocalwealth.com",
  phone: "617-947-4749",
  address: "Medfield, MA | Waban, MA",
  // TODO(altruist): placeholder until Sam provides the real Altruist client-portal
  // login / onboarding-invite URL. Used by the "Already a client?" nav link and
  // the post-questionnaire onboarding handoff on /get-started.
  altruistPortalUrl: "#altruist-portal-todo",
  bookingsUrl:
    "https://outlook.office.com/book/ReciprocalWealth1@reciprocalwealth.com/?ismsaljsauthenabled",
  disclosure:
    "Reciprocal Wealth, LLC is a Registered Investment Advisor. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security or investment product. Past performance is not indicative of future results.",
  copyright: `© ${new Date().getFullYear()} Reciprocal Wealth, LLC. All rights reserved.`,
};

/** Top nav: Disclosures after FAQs, before Talk to Us */
export const navLinks = [
  { label: "Home", href: "" },
  { label: "Why Reciprocal", href: "/why-reciprocal" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "FAQs", href: "/faqs" },
  { label: "Disclosures", href: "/disclosures" },
  { label: "Talk to Us", href: "/talk-to-us" },
] as const;

export const footerLinks = [
  ...navLinks,
  { label: "Become a Client", href: "/get-started" },
  { label: "Already a client? Access your portal", href: siteConfig.altruistPortalUrl },
] as const;
