import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Instrument_Serif } from "next/font/google";

import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { FEATURED, PROJECTS } from "@/lib/work";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

import "@/styles/globals.css";

/* display: "optional" keeps text-LCP off the webfont critical path: the
   preloaded font is used when it arrives inside the block window (warm
   cache / normal connections); metric-adjusted fallbacks otherwise. */
const sans = DM_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "optional",
});

const mono = DM_Mono({
  variable: "--font-mono-face",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "optional",
});

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "optional",
});

/* Set NEXT_PUBLIC_SITE_URL (see .env.example) — never hardcoded. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DESCRIPTION =
  "PixelLayerr is a digital product engineering studio in Indore, India. We build sales systems that convert — premium websites, web apps, SaaS, AI agents and automation, Shopify stores with AI cart recovery, and business systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PixelLayerr — Digital Product Engineering Studio",
    template: "%s — PixelLayerr",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "PixelLayerr — Digital Product Engineering Studio",
    description:
      "Design, engineering, AI and automation — websites, web apps, SaaS, Shopify e-commerce, and business systems, built to turn visitors into customers.",
    siteName: "PixelLayerr",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelLayerr — Digital Product Engineering Studio",
    description:
      "Design, engineering, AI and automation — websites, web apps, SaaS, Shopify e-commerce, and business systems, built to turn visitors into customers.",
  },
};

/* Real data only: the studio, its site, and its actual services. */
const SERVICES = [
  "Websites & Web Apps",
  "SaaS & Product Engineering",
  "AI Agents, Chatbots & Automation",
  "E-commerce & Shopify — AI cart recovery, omnichannel automation",
  "Business Systems — CRM, ERP & Dashboards",
  "Growth & Platform",
];

/* Real client words only — no invented ratings, so no AggregateRating. */
const REVIEWS = [
  {
    author: "La Vallée Farms",
    body: "The interactive masterplan does the selling — buyers explore plots themselves and reach out already convinced. The site feels premium and actually drives enquiries.",
  },
  {
    author: "Dr. Sudarshan Arya, Baby Steps Pediatric Clinic",
    body: "The animated site genuinely stands out — parents notice it, and we've had more appointment enquiries since it went live. It finally feels as modern as the care we give.",
  },
  {
    author: "Sanjeev Saxena, Aranyaani Healing Forest",
    body: "The animations do more than look good — they help visitors actually understand what Aranyaani is about. People stay longer and get the vision immediately.",
  },
  {
    author: "DPM Entertainment",
    body: "Since the new site, our registrations and conversions have clearly improved. It's fast, clean, and does the selling for us.",
  },
  {
    author: "Prince, Apna Dental Clinic",
    body: "Really impressed with how it turned out — polished, professional, and easy for patients to book. Exactly what we wanted.",
  },
  {
    author: "Sandeep, Shoolin Chemicals",
    body: "They built us a genuinely premium website — it makes our business look as serious as it is. Great work start to finish.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PixelLayerr",
      url: SITE_URL,
      description: DESCRIPTION,
      telephone: "+917024332332",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Indore",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
      review: REVIEWS.map((review) => ({
        "@type": "Review",
        reviewBody: review.body,
        author: { "@type": "Organization", name: review.author },
        itemReviewed: { "@id": `${SITE_URL}/#organization` },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PixelLayerr",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    ...SERVICES.map((name) => ({
      "@type": "Service",
      name,
      serviceType: name,
      areaServed: "Worldwide",
      provider: { "@id": `${SITE_URL}/#organization` },
    })),
    /* Every portfolio item is a real, live product. */
    ...[
      { name: FEATURED.name, url: FEATURED.url, line: FEATURED.line, slug: FEATURED.slug },
      ...PROJECTS.map((project) => ({
        name: project.name,
        url: project.url,
        line: project.line,
        slug: project.slug,
      })),
    ].map((work) => ({
      "@type": "CreativeWork",
      name: work.name,
      url: work.url,
      description: work.line,
      image: `${SITE_URL}/work/${work.slug}.webp`,
      creator: { "@id": `${SITE_URL}/#organization` },
    })),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-sm focus:bg-accent-fill focus:px-4 focus:py-2 focus:text-small focus:text-on-accent"
        >
          Skip to content
        </a>
        <ReducedMotionProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
