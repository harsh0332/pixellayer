import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Instrument_Serif } from "next/font/google";
import Script from "next/script";

import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { FEATURED, PROJECTS } from "@/lib/work";
import { SITE_ORIGIN } from "@/lib/studio";
import { STUDIO_SERVICES } from "@/lib/services";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

// Keep these as explicit layout dependencies so preview and production
// both load the studio rules alongside the base stylesheet.
import "@/styles/globals.css";
import "@/styles/ecosystem.css";
import "@/styles/studio.css";
import "@/styles/portfolio-orbit.css";
import "@/styles/studio-craft.css";
import "@/styles/studio-refinement.css";
import "@/styles/studio-choreography.css";
import "@/styles/resolution-hero.css";

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

/* Canonical origin for metadataBase, og:image and JSON-LD. Resolution order:
   NEXT_PUBLIC_SITE_URL (explicit, see .env.example) → Vercel's auto-injected
   production domain → preview deployment URL → production domain (localhost in dev). Social crawlers
   need an ABSOLUTE og:image; if this ever fell back to localhost they would
   ignore it and pull a random image off the page instead. */
const SITE_URL = SITE_ORIGIN;

/* Shared image follows the Pixelcliq ecosystem palette and studio message. */
const OG_IMAGE = {
  url: "/brand-image",
  width: 1200,
  height: 630,
  alt: "PixelLayerr — Good ideas. Built into great websites. A Pixelcliq Media studio.",
};

/* Analytics + Search Console are env-gated: nothing renders until the real
   IDs are set (see .env.example) — no placeholder IDs, no hardcoded keys. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

const DESCRIPTION =
  "PixelLayerr is the design and engineering studio in the Pixelcliq Media ecosystem, based in Indore, India. We engineer systems that sell — premium websites, web apps, SaaS, AI agents and automation, Shopify stores with AI cart recovery, and business systems.";

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
      "We engineer systems that sell — websites, web apps, SaaS, Shopify e-commerce, AI automation, and business systems.",
    siteName: "PixelLayerr",
    type: "website",
    url: "/",
    images: [OG_IMAGE],
  },
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
  twitter: {
    card: "summary_large_image",
    title: "PixelLayerr — Digital Product Engineering Studio",
    description:
      "We engineer systems that sell — websites, web apps, SaaS, Shopify e-commerce, AI automation, and business systems.",
    images: [OG_IMAGE],
  },
};

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
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PixelLayerr",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    ...STUDIO_SERVICES.map((service) => ({
      "@type": "Service",
      name: service.title,
      serviceType: service.title,
      url: `${SITE_URL}/services/${service.slug}`,
      areaServed: "Worldwide",
      provider: { "@id": `${SITE_URL}/#organization` },
    })),
    /* Every portfolio item is a real, live product. */
    ...[
      {
        name: FEATURED.name,
        url: FEATURED.url,
        line: FEATURED.line,
        slug: FEATURED.slug,
      },
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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
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
