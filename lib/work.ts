/**
 * Selected Work — real projects only (spec anti-fabrication rule).
 * One-liners are grounded in each live site's own content (scripts/work-meta.json);
 * screenshots captured by scripts/capture-work.mjs at 1440×900 @2x.
 */

export type WorkProject = {
  name: string;
  slug: string;
  category: string;
  url: string;
  line: string;
  alt: string;
};

export const FEATURED = {
  name: "La Vallée Farms",
  slug: "la-vallee-farms",
  imageSlug: "la-vallee-masterplan",
  category: "Real Estate",
  url: "https://lavalleefarms.vercel.app",
  /* CTA lands directly on the interactive masterplan, not the homepage. */
  masterplanUrl: "https://lavalleefarms.vercel.app/#masterplan",
  line: "Premium gated farmhouse plots near Bhopal — with an interactive masterplan as the heart of the buying journey.",
  alt: "Interactive masterplan of La Vallée Farms showing numbered plots color-coded by availability, with search and filter controls",
  /* Feature specifics observed on the live masterplan */
  masterplan: [
    "Every plot clickable, color-coded by live status — available, booked, sold",
    "Search by plot number, filter by availability",
    "Zoom, pan and 3D view of the full layout",
    "Plot details flow straight into a WhatsApp enquiry",
  ],
} as const;

export const PROJECTS: WorkProject[] = [
  {
    name: "The Sugar Story",
    slug: "the-sugar-story",
    category: "E-commerce",
    url: "https://thesugarstory.co.in",
    line: "A boutique bakery storefront with product choices, custom cakes and a build-your-own dessert hamper journey.",
    alt: "The Sugar Story’s current cream-and-burgundy homepage with a Biscoff cheesecake, brownies and tiramisu",
  },
  {
    name: "Baby Steps",
    slug: "baby-steps",
    category: "Healthcare",
    url: "https://babystepsnewbornclinic.com",
    line: "Pediatric clinic site for a two-specialist practice — services, vaccination timeline, and appointment booking.",
    alt: "Homepage of Baby Steps newborn and child clinic, Bhopal",
  },
  {
    name: "AI Buddies",
    slug: "ai-buddies",
    category: "AI & Automation",
    url: "https://aibuddiess.com",
    line: "Cursor-reactive site for an AI automation agency — agents, automations, and AI skills.",
    alt: "Homepage of AI Buddies with a particle-sphere hero",
  },
  {
    name: "Aranyaani Healing Forest",
    slug: "aranyaani",
    category: "Wellness",
    url: "https://aranyaani-brown.vercel.app",
    line: "Immersive site for a 100-acre forest retreat beside the Satpura Tiger Reserve — week-long healing stays.",
    alt: "Homepage of Aranyaani Healing Forest with an illustrated forest scene",
  },
  {
    name: "DPM Entertainment",
    slug: "dpm-entertainment",
    category: "Events",
    url: "https://register.dpmentertainment.com",
    line: "Registration portal for a national pageant — online auditions, live deadline countdown, secured checkout.",
    alt: "Registration portal for DPM Mr/Miss/Mrs/Miss Teen India 2026",
  },
  {
    name: "KliqCraft",
    slug: "kliqcraft",
    category: "Agency",
    url: "https://kliqcraft.netlify.app",
    line: "Editorial site for a growth partner — strategic marketing, creative, and AI-powered systems.",
    alt: "Homepage of KliqCraft Global with serif display typography",
  },
  {
    name: "Apna Dental Clinic",
    slug: "apna-dental",
    category: "Healthcare",
    url: "https://aapnadentalclinic.lovable.app",
    line: "Dental clinic site with treatments, before/after gallery, bilingual copy, and booking.",
    alt: "Homepage of Aapna Dental Clinic, Binaganj",
  },
  {
    name: "8FlowLabs AI",
    slug: "8flowlabs",
    category: "AI & Automation",
    url: "https://8flowlabsai.netlify.app",
    line: "B2B AI automation agency site — WhatsApp agents, AI calling, n8n workflows, and an ROI calculator.",
    alt: "Homepage of 8flow labs .ai with a workflow execution monitor",
  },
  {
    name: "Shoolin Chemicals",
    slug: "shoolin-chemicals",
    category: "Industrial B2B",
    url: "https://www.shoolinchemicals.com",
    line: "Site with shop for a waterproofing and construction chemicals company — catalog, brochure, distributorship.",
    alt: "Homepage of Shoolin Chemicals with waterproofing product range",
  },
  {
    name: "Harsh Traders",
    slug: "harsh-traders",
    category: "Local Business",
    url: "https://harshtraders.lovable.app",
    line: "Building materials dealer site — brands, delivery, and WhatsApp-first quote requests.",
    alt: "Homepage of Harsh Traders cement and building materials, Binaganj",
  },
  {
    name: "Lodhi Interiors",
    slug: "lodhi-interiors",
    category: "Architecture & Interiors",
    url: "https://lodhiinteriors.com",
    line: "Site for a Bhopal interior design and turnkey execution studio — luxury residential and commercial interiors, from concept to final handover.",
    alt: "Homepage of Lodhi Interiors, an interior design and turnkey execution studio in Bhopal, with a serif headline over a concrete-and-water interior",
  },
  {
    name: "The Fitness Headquarters",
    slug: "tfhq",
    category: "Fitness",
    url: "https://thefitnessheadquator.vercel.app",
    line: "Site for Bhopal's premium luxury gym — 15,000+ sq ft floor, world-class equipment, and certified coaches.",
    alt: "Homepage of The Fitness Headquarters gym in Bhopal",
  },
  {
    name: "The Unofficial Studios",
    slug: "unofficial-studios",
    category: "Media & Podcasts",
    url: "https://unofficialhimanshuu.vercel.app",
    line: "Site for Indore's premium broadcast and podcast production company — celebrity interviews, campaigns, video portfolios.",
    alt: "Homepage of The Unofficial Studios cinematic media production company",
  },
  {
    name: "Ivy Estate",
    slug: "ivy-estate",
    category: "Real Estate",
    url: "https://ivyestatebhopal.netlify.app",
    line: "RERA-approved plotted development site — project quick facts, colony explorer, site-visit booking.",
    alt: "Homepage of Ivy Estate Bhopal residential plots",
  },
];
