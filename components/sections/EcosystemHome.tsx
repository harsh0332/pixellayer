"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ContactCta } from "@/components/sections/ContactCta";
import { MotionShell } from "@/components/studio/StudioMotion";
import {
  StudioNav,
  StudioFooter,
  StudioLogo,
} from "@/components/studio/StudioChrome";
import { ScrollPortfolio } from "@/components/studio/ScrollPortfolio";
import { SpecialtyShowcase } from "@/components/studio/SpecialtyShowcase";
import { ResolutionHero } from "@/components/studio/ResolutionHero";
import {
  LogoMarquee,
  ProcessExplorer,
  AuditBridge,
} from "@/components/studio/StudioSections";

const BOOKING =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";
const SERVICES = [
  {
    title: "Websites & digital experiences",
    slug: "websites",
    text: "Your brand, translated into a website people remember. Strategy, design and development, built around what your visitors need to do next.",
    tags: [
      "Custom websites",
      "Landing pages",
      "Motion & interaction",
      "Web apps",
    ],
  },
  {
    title: "E-commerce & Shopify",
    slug: "ecommerce-shopify",
    text: "Beautiful storefronts with a clear path to purchase. Thoughtful product pages, smooth checkout and recovery flows that keep the conversation going.",
    tags: [
      "Shopify development",
      "Product pages",
      "Cart recovery",
      "WhatsApp flows",
    ],
  },
  {
    title: "SaaS & product engineering",
    slug: "web-apps-saas",
    text: "Turn the idea in your head into a product people can use. From the first prototype to authentication, billing and a platform ready to grow.",
    tags: [
      "MVP development",
      "Product design",
      "APIs & integrations",
      "Auth & billing",
    ],
  },
  {
    title: "AI agents & automation",
    slug: "ai-automation",
    text: "Give your team time back. Connect lead capture, conversations and daily operations with useful AI and workflows designed for your business.",
    tags: [
      "AI chatbots",
      "Voice & WhatsApp agents",
      "Lead qualification",
      "Workflow automation",
    ],
  },
  {
    title: "Business systems",
    slug: "business-systems",
    text: "Bring scattered operations into one clear view. Custom software that fits how your team actually works, with your data and ownership built in.",
    tags: ["CRM & ERP", "Internal tools", "Dashboards", "Reporting"],
  },
  {
    title: "Redesign, optimization & care",
    slug: "website-redesign",
    text: "Make the website you already have work harder. Refresh the experience, plan an SEO-conscious migration, improve conversions and keep everything maintained.",
    tags: [
      "Website redesign",
      "SEO & migration",
      "Conversion optimization",
      "Maintenance",
    ],
  },
];
const FAQS = [
  [
    "How are PixelLayerr and Pixelcliq Media connected?",
    "We’re part of the same ecosystem. PixelLayerr brings the design, development and automation expertise; Pixelcliq Media brings creative, campaigns and growth. You can start with one focused project and connect the other pieces when you need them.",
  ],
  [
    "Can we start with just a website?",
    "Absolutely. Start with the one thing your business needs now: a website, landing page, store or automation. We scope that project clearly and build it so it can grow with you.",
  ],
  [
    "How long does a build take?",
    "It depends on scope. A focused website is usually a matter of weeks; SaaS and larger platforms run in phased milestones. We agree on a realistic timeline before work begins.",
  ],
  [
    "Do I own the code and data?",
    "Yes. Your code, your data, your infrastructure. You receive a complete handover with no lock-in.",
  ],
  [
    "Can you improve our existing website?",
    "Yes. We can review the experience, rebuild the design, improve speed and conversion paths, and plan redirects and migration around your existing search visibility.",
  ],
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Logo() {
  return <StudioLogo />;
}
function Label({ children, number }: { children: ReactNode; number: string }) {
  return (
    <p className="eco-label">
      <span>{number} /</span> {children}
    </p>
  );
}

export function EcosystemHome() {
  return (
    <MotionShell floating={false}>
      <HomeContent />
    </MotionShell>
  );
}
function HomeContent() {
  const [service, setService] = useState(0);
  const [quote, setQuote] = useState(0);
  const quotes = [
    {
      text: "The interactive masterplan does the selling — buyers explore plots themselves and reach out already convinced. The site feels premium and actually drives enquiries.",
      name: "La Vallée Farms",
      category: "Real estate · Website & interactive masterplan",
    },
    {
      text: "The animated site genuinely stands out — parents notice it, and we've had more appointment enquiries since it went live. It finally feels as modern as the care we give.",
      name: "Dr. Sudarshan Arya",
      category: "Baby Steps · Pediatric Clinic",
    },
    {
      text: "The animations do more than look good — they help visitors actually understand what Aranyaani is about. People stay longer and get the vision immediately.",
      name: "Sanjeev Saxena",
      category: "Aranyaani Healing Forest",
    },
  ];

  return (
    <div className="studio-home studio-resolution-home">
      <StudioNav home />
      <main id="content">
        <ResolutionHero />
        <div className="eco-capability-strip" aria-label="Studio capabilities">
          {[
            "Distinctive websites",
            "Digital products",
            "E-commerce",
            "AI & automation",
          ].map((text) => (
            <span key={text}>
              {text}
              <i aria-hidden="true">✳</i>
            </span>
          ))}
        </div>
        <LogoMarquee />
        <ScrollPortfolio />

        <SpecialtyShowcase />

        <section id="services" className="eco-section eco-services">
          <div className="eco-container eco-services-layout">
            <div className="eco-services-intro" data-reveal>
              <Label number="02">What we do</Label>
              <h2>
                Every layer.
                <br />
                <em>One studio.</em>
              </h2>
              <p>
                From the first “what if” to the thing that works. Design,
                engineering and intelligence, connected from day one.
              </p>
              <div className="eco-layer-graphic" aria-hidden="true">
                <span>STRATEGY</span>
                <span>DESIGN</span>
                <span>ENGINEERING</span>
                <span>GROWTH ↗</span>
              </div>
              <Link className="eco-text-link" href="/services">
                Explore all 10 services <Arrow diagonal />
              </Link>
            </div>
            <div className="eco-service-list">
              {SERVICES.map((item, i) => (
                <div
                  className={`eco-service ${service === i ? "is-open" : ""}`}
                  key={item.title}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={service === i}
                      aria-controls={`service-panel-${i}`}
                      id={`service-button-${i}`}
                      onClick={() => setService(service === i ? -1 : i)}
                    >
                      <span>0{i + 1}</span>
                      {item.title}
                      <b>{service === i ? "−" : "+"}</b>
                    </button>
                  </h3>
                  <div
                    id={`service-panel-${i}`}
                    role="region"
                    aria-labelledby={`service-button-${i}`}
                    hidden={service !== i}
                  >
                    <p>{item.text}</p>
                    <div className="eco-service-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <Link href={`/services/${item.slug}`}>
                      Explore this service <Arrow diagonal />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ecosystem" className="eco-section eco-connected">
          <div className="eco-container">
            <div className="eco-section-heading" data-reveal>
              <div>
                <Label number="03">The bigger picture</Label>
                <h2>
                  Different strengths.
                  <br />
                  <em>One connected world.</em>
                </h2>
              </div>
              <p>
                A great website is just the beginning.
                <br />
                The right creative, campaigns and systems
                <br />
                make everything work harder together.
              </p>
            </div>
            <div className="eco-brand-connection" data-reveal>
              <div className="eco-brand-side">
                <Logo />
                <h3>We build the experience.</h3>
                <p>
                  Websites, products and automation.
                  <br />
                  The digital foundation for your next chapter.
                </p>
                <div>
                  <span>DESIGN</span>
                  <span>DEVELOPMENT</span>
                  <span>AI</span>
                </div>
              </div>
              <span className="eco-connection-symbol" aria-hidden="true">
                ↔
              </span>
              <a
                className="eco-brand-side eco-media-side"
                href="https://pixelcliqmedia.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="eco-media-logo">
                  <span className="eco-cliq-mark" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  pixelcliq<span>.</span>
                  <small>MEDIA / INDEPENDENT GROWTH</small>
                </span>
                <h3>We help it find its people.</h3>
                <p>
                  Creative, performance and brand.
                  <br />
                  The growth engine that takes it further.
                </p>
                <span className="eco-media-link">
                  MEET PIXELCLIQ MEDIA <Arrow diagonal />
                </span>
              </a>
            </div>
            <p className="eco-ecosystem-note">
              One conversation. Connected expertise.{" "}
              <strong>Your brand, all the way through.</strong>
            </p>
          </div>
        </section>

        <section id="process" className="eco-section eco-process">
          <div className="eco-container">
            <div className="eco-section-heading" data-reveal>
              <div>
                <Label number="04">Our approach</Label>
                <h2>
                  Big on possibility.
                  <br />
                  <em>Clear on the process.</em>
                </h2>
              </div>
              <a
                href={BOOKING}
                target="_blank"
                rel="noopener noreferrer"
                className="eco-text-link"
              >
                Start a conversation <Arrow diagonal />
              </a>
            </div>
            <ProcessExplorer />
            <Link
              className="studio-process-link eco-text-link"
              href="/approach"
            >
              How we work together ↗
            </Link>
            <div id="industries" className="eco-industries">
              <span>BUILT AROUND YOUR WORLD</span>
              <p>
                E-commerce <i>·</i> Real estate <i>·</i> Healthcare <i>·</i>{" "}
                SaaS <i>·</i> Hospitality <i>·</i> Local business
              </p>
            </div>
          </div>
        </section>

        <section className="eco-testimonial" aria-label="Client testimonials">
          <div className="eco-container eco-quote-layout">
            <div>
              <Label number="05">In good company</Label>
              <span className="eco-quote-mark" aria-hidden="true">
                “
              </span>
            </div>
            <div>
              <div aria-live="polite">
                <blockquote key={quote}>{quotes[quote].text}</blockquote>
                <div className="eco-quote-person">
                  <span>{quotes[quote].name.slice(0, 1)}</span>
                  <p>
                    <strong>{quotes[quote].name}</strong>
                    <small>{quotes[quote].category}</small>
                  </p>
                </div>
              </div>
              <div className="eco-quote-controls">
                <span>0{quote + 1} / 03</span>
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => setQuote((quote + 2) % 3)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => setQuote((quote + 1) % 3)}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="eco-section eco-faq" id="faq">
          <div className="eco-container eco-faq-layout">
            <div data-reveal>
              <Label number="06">A little clarity</Label>
              <h2>
                Good questions.
                <br />
                <em>Straight answers.</em>
              </h2>
              <p>
                Still curious about something?
                <br />
                <a href="#contact">
                  Let’s talk it through <span>↗</span>
                </a>
              </p>
            </div>
            <div>
              {FAQS.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <AuditBridge />
        <div className="eco-contact-wrap">
          <div className="eco-container eco-contact-banner">
            <span>YOUR NEXT CHAPTER STARTS HERE</span>
            <p>
              Let’s make <em>something matter.</em>
              <span aria-hidden="true">↗</span>
            </p>
          </div>
          <ContactCta />
        </div>
      </main>
      <StudioFooter />
    </div>
  );
}
