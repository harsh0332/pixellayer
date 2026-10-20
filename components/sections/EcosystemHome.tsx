"use client";

import Link from "next/link";
import { type ReactNode } from "react";
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
import { ServiceDirectory } from "@/components/studio/ServiceDirectory";
import { ConversionJourney } from "@/components/studio/ConversionJourney";
import {
  LogoMarquee,
  ProcessExplorer,
  AuditBridge,
} from "@/components/studio/StudioSections";

const BOOKING =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";
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
    <MotionShell>
      <HomeContent />
    </MotionShell>
  );
}
function HomeContent() {
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

        <section id="services" className="eco-section home-service-experiences">
          <div className="eco-container">
            <div className="eco-section-heading" data-reveal>
              <div>
                <Label number="02">What we do</Label>
                <h2>
                  Different challenges.
                  <br />
                  <em>One connected studio.</em>
                </h2>
              </div>
              <p>
                A distinctive website. A useful product. A smoother operation.
                Start with what your business needs next.
              </p>
            </div>
            <ServiceDirectory home />
            <div className="home-services-foot">
              <span>
                Need a landing page, chatbot, conversion review or ongoing care?
              </span>
              <Link href="/services">
                Explore all 10 services <Arrow diagonal />
              </Link>
            </div>
          </div>
        </section>
        <ConversionJourney />

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

        <section className="home-handover eco-section">
          <div className="eco-container">
            <div className="eco-section-heading">
              <div>
                <Label number="05">Built to be yours</Label>
                <h2>
                  The launch is a milestone.
                  <br />
                  <em>Ownership is the standard.</em>
                </h2>
              </div>
              <p>
                We agree the handover before the build begins, so you know what
                you’re getting and how to run it.
              </p>
            </div>
            <div className="home-handover-grid">
              {[
                [
                  "01",
                  "Your foundation",
                  "Code, content and account ownership, with the relevant access handed to your team.",
                ],
                [
                  "02",
                  "A clear handover",
                  "A walkthrough of the agreed tools, content controls and important customer journeys.",
                ],
                [
                  "03",
                  "A practical next step",
                  "A list of follow-up priorities, with maintenance and improvements scoped clearly.",
                ],
              ].map(([n, title, copy]) => (
                <article key={n} data-reveal>
                  <span>
                    {n}
                    <b>↗</b>
                  </span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <Link className="eco-text-link" href="/approach">
              See how we work together ↗
            </Link>
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
