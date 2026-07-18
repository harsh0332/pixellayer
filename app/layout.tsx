import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Instrument_Serif } from "next/font/google";

import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

import "@/styles/globals.css";

const sans = DM_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

const mono = DM_Mono({
  variable: "--font-mono-face",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

/* Set NEXT_PUBLIC_SITE_URL (see .env.example) — never hardcoded. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DESCRIPTION =
  "PixelLayerr is a digital product engineering studio. We design and build premium websites, web apps, SaaS, AI agents, and industry software.";

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
      "We design and build premium websites, web apps, SaaS, AI agents, and industry software.",
    siteName: "PixelLayerr",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelLayerr — Digital Product Engineering Studio",
    description:
      "We design and build premium websites, web apps, SaaS, AI agents, and industry software.",
  },
};

/* Real data only: the studio, its site, and its actual five services. */
const SERVICES = [
  "Websites & Web Apps",
  "SaaS & Product Engineering",
  "AI Agents, Chatbots & Automation",
  "Business Systems — CRM, ERP & Dashboards",
  "Growth & Platform",
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
      provider: { "@id": `${SITE_URL}/#organization` },
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
