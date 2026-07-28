export interface Founder {
  name: string;
  nickname: string;
  title: string;
  focus: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  education: string[];
}

/**
 * Content pulled verbatim from "2026.07.15 - RW - Firm Overview -
 * Introduction - Finalized.pdf" (Who We Are). Order matches the site's
 * existing founder-card convention (Sam, then Jake).
 */
export const founders: Founder[] = [
  {
    name: "Samuel M. Chud",
    nickname: "Sam",
    title: "Founder & Principal",
    focus: "Strategy & Marketing",
    email: "sam@reciprocalwealth.com",
    phone: "774-403-5105",
    image: "/images/sam-chud-portrait.png",
    bio: "Brings an outside perspective and major brand experience — from a regional quick-service restaurant to the New England Patriots. Spent a decade plus at Keurig Dr. Pepper, rising from Analyst to Manager to Director across Commercialization, Innovation, Product Management and Sales Strategy. Most recently, joined KDP's Enterprise Strategy & Transformation team, reporting directly to the Chief Strategy Officer.",
    education: [
      "Northwestern University, Kellogg — Executive MBA, Finance",
      "Emory University, Goizueta — BBA with Distinction, Marketing",
      "Noble & Greenough — Secondary Education",
    ],
  },
  {
    name: "John E. Lynch, III",
    nickname: "Jake",
    title: "Founder & Principal",
    focus: "Investments & Planning",
    email: "jake@reciprocalwealth.com",
    phone: "774-403-5105",
    image: "/images/jake-lynch-portrait.png",
    bio: "A decade plus in (or around) wealth management. Most recently, the Operating Partner at TRIA Capital, a niche private-equity firm backing fee-only wealth platforms — including Barron's Top 100 firms Modera, Pathstone and Plancorp. Previously, Partner and Chief Business Officer at RWA Wealth (~$20B AUM), leading strategy, analytics and M&A. Unitholder Representative in RWA's 2020 sale to Summit Partners.",
    education: [
      "University of Virginia, Darden — MBA, Asset Management",
      "Bowdoin College — BA, Government & Legal Studies",
      "Noble & Greenough — Secondary Education",
    ],
  },
];
