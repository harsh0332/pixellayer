import type { Metadata } from "next";
import { FEATURED, PROJECTS } from "./work";
export const ALL_PROJECTS = [
  {
    ...FEATURED,
    alt: "Homepage of La Vallée Farms, with landscape imagery and an invitation to explore the masterplan",
  },
  ...PROJECTS,
];
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "production"
        ? "https://pixellayerss.com"
        : "http://localhost:3001")
).replace(/\/$/, "");
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — PixelLayerr`,
      description,
      url: path,
      images: [
        {
          url: "/brand-image",
          width: 1200,
          height: 630,
          alt: "PixelLayerr — Design, development and connected growth",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — PixelLayerr`,
      description,
      images: ["/brand-image"],
    },
  };
}
export const PROJECT_DETAILS: Record<
  string,
  { focus: string; features: string[]; journey: [string, string, string] }
> = {
  "la-vallee-farms": {
    focus:
      "Make a plotted development explorable before a buyer starts a conversation.",
    features: [
      "Interactive masterplan with plot-level detail",
      "Search, availability filters and zoom controls",
      "Plot enquiries through WhatsApp",
    ],
    journey: ["Discover the development", "Explore a plot", "Start an enquiry"],
  },
  "the-sugar-story": {
    focus: "Give a homemade dessert brand a clear online shopping experience.",
    features: [
      "Cakes, brownies and cheesecake catalog",
      "Product discovery and online ordering",
      "A distinct visual identity for a premium bakery",
    ],
    journey: ["Explore the menu", "Choose a dessert", "Place an order"],
  },
  "baby-steps": {
    focus: "Help parents understand the practice and find the care they need.",
    features: [
      "Pediatric services and specialist information",
      "Vaccination timeline",
      "Appointment booking journey",
    ],
    journey: [
      "Meet the practice",
      "Find the right service",
      "Book an appointment",
    ],
  },
  "ai-buddies": {
    focus:
      "Explain an AI agency’s offering through a distinctive digital experience.",
    features: [
      "Cursor-reactive particle-sphere hero",
      "AI agents and automation service content",
      "AI skills and capability presentation",
    ],
    journey: [
      "Discover the agency",
      "Explore capabilities",
      "Start a conversation",
    ],
  },
  aranyaani: {
    focus:
      "Introduce the experience of a healing stay in the Satpura landscape.",
    features: [
      "Illustrated forest environment",
      "Retreat and week-long stay information",
      "An immersive introduction to the healing-forest concept",
    ],
    journey: [
      "Enter the forest story",
      "Explore the stay",
      "Enquire about a visit",
    ],
  },
  "dpm-entertainment": {
    focus:
      "Give a national pageant a focused route from interest to registration.",
    features: [
      "Online audition and registration information",
      "Deadline countdown",
      "Checkout-enabled registration flow",
    ],
    journey: [
      "Understand the event",
      "Complete registration",
      "Continue to checkout",
    ],
  },
  kliqcraft: {
    focus: "Present a growth partner through an editorial brand experience.",
    features: [
      "Serif-led editorial typography",
      "Strategic marketing and creative services",
      "AI-powered systems positioning",
    ],
    journey: ["Meet the partner", "Explore services", "Discuss a project"],
  },
  "apna-dental": {
    focus: "Make treatment information and booking easy for local patients.",
    features: [
      "Treatment information",
      "Before-and-after gallery",
      "Bilingual content and booking",
    ],
    journey: ["Find a treatment", "Explore the practice", "Book a visit"],
  },
  "8flowlabs": {
    focus: "Make an automation agency’s technical offering understandable.",
    features: [
      "WhatsApp agents and AI calling services",
      "Workflow execution monitor presentation",
      "ROI calculator",
    ],
    journey: [
      "Understand the offering",
      "Explore automation use cases",
      "Start an enquiry",
    ],
  },
  "shoolin-chemicals": {
    focus:
      "Help buyers explore a construction-chemicals range and contact the business.",
    features: [
      "Product catalog and shop",
      "Downloadable brochure",
      "Distributorship information",
    ],
    journey: ["Find a product", "Review the range", "Enquire or shop"],
  },
  "harsh-traders": {
    focus:
      "Connect local building-material buyers to a practical quote request.",
    features: [
      "Building material brands and product information",
      "Delivery information",
      "WhatsApp-first quote requests",
    ],
    journey: ["Find materials", "Review delivery", "Request a quote"],
  },
  "lodhi-interiors": {
    focus:
      "Introduce a studio’s design point of view and turnkey execution services.",
    features: [
      "Residential and commercial interior services",
      "Architecture-led visual direction",
      "Concept-to-handover positioning",
    ],
    journey: [
      "Explore the studio",
      "Understand the services",
      "Discuss a space",
    ],
  },
  tfhq: {
    focus:
      "Introduce a Bhopal fitness destination and its training environment.",
    features: [
      "Facility and equipment presentation",
      "Coach information",
      "Premium gym positioning",
    ],
    journey: [
      "Explore the space",
      "Meet the training offer",
      "Start an enquiry",
    ],
  },
  "unofficial-studios": {
    focus:
      "Put broadcast and podcast production work at the center of the experience.",
    features: [
      "Cinematic media presentation",
      "Celebrity interviews and campaign work",
      "Video portfolio",
    ],
    journey: ["Discover the studio", "Watch the work", "Discuss a production"],
  },
  "ivy-estate": {
    focus:
      "Help prospective buyers understand a plotted residential development.",
    features: ["Project quick facts", "Colony explorer", "Site-visit booking"],
    journey: [
      "Review the development",
      "Explore the colony",
      "Book a site visit",
    ],
  },
};
