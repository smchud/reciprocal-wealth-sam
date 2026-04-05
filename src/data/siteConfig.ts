export const siteConfig = {
  name: "Reciprocal Wealth",
  tagline: "Invested Together",
  email: "info@reciprocalwealth.com",
  phone: "617-947-4749",
  address: "3 Edgefield Road, Waban, MA 02468",
  clientPortalUrl: "#",
  disclosure:
    "Reciprocal Wealth Management LLC is a Registered Investment Advisor. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security or investment product. Past performance is not indicative of future results.",
  copyright: `© ${new Date().getFullYear()} Reciprocal Wealth Management LLC. All rights reserved.`,
};

export const navLinks = [
  { label: "Why Reciprocal", href: "/why-reciprocal" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "FAQs", href: "/faqs" },
  { label: "Talk to Us", href: "/talk-to-us" },
] as const;

/** Concept B top nav: Disclosures after FAQs, before Talk to Us */
export const navLinksB = [
  { label: "Why Reciprocal", href: "/why-reciprocal" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Disclosures", href: "/disclosures" },
  { label: "Talk to Us", href: "/talk-to-us" },
] as const;

export const footerLinksB = [
  ...navLinksB,
  { label: "Client Portal", href: "#" },
] as const;

export const utilityLinks = [
  { label: "Client Portal", href: "#" },
  { label: "Disclosures", href: "/disclosures" },
] as const;

export const footerLinks = [
  { label: "Why Reciprocal", href: "/why-reciprocal" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "FAQs", href: "/faqs" },
  { label: "Talk to Us", href: "/talk-to-us" },
  { label: "Disclosures", href: "/disclosures" },
  { label: "Client Portal", href: "#" },
] as const;
