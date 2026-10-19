import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ServiceMode, StudioService } from "@/lib/services";
import { STUDIO_SERVICES } from "@/lib/services";
import { ALL_PROJECTS, PROJECT_DETAILS } from "@/lib/studio";
import { StudioNav, StudioFooter } from "./StudioChrome";
import { MotionShell } from "./StudioMotion";
import { ServiceScene } from "./ServiceScene";
import { PageCTA, RelatedWork } from "./StudioSections";

const SERVICE_CHECKPOINTS: Record<
  ServiceMode,
  [string, string, string, string]
> = {
  design: [
    "Audience & page map",
    "A direction to approve",
    "A working preview",
    "Launch checklist & handover",
  ],
  store: [
    "Catalog & store requirements",
    "A complete buying journey",
    "Connected store operations",
    "Test orders & handover",
  ],
  product: [
    "The essential first release",
    "A testable product flow",
    "Reviewable build milestones",
    "A release & iteration plan",
  ],
  workflow: [
    "One workflow worth improving",
    "Triggers, rules & exceptions",
    "A controlled test run",
    "Ownership & monitoring",
  ],
  chat: [
    "Questions & approved sources",
    "Conversation & escalation rules",
    "Test conversations",
    "A handover to your team",
  ],
  system: [
    "People, roles & data sources",
    "A workspace prototype",
    "Connected data & permissions",
    "A team rollout plan",
  ],
  campaign: [
    "One audience & one action",
    "Message & page hierarchy",
    "A working campaign page",
    "Form & tracking checks",
  ],
  redesign: [
    "What to keep & what to change",
    "A revised visitor journey",
    "A reviewable replacement",
    "Redirect & launch checks",
  ],
  experiment: [
    "A measurable question",
    "A prioritized hypothesis",
    "An agreed experiment",
    "Evidence for the next decision",
  ],
  care: [
    "Current stack & access",
    "Coverage & responsibilities",
    "An approved change log",
    "The next improvement priorities",
  ],
};

const SERVICE_DISCOVERY: Record<ServiceMode, [string, string]> = {
  design: [
    "Your offer, audience and existing content",
    "The pages and enquiry path your first release needs",
  ],
  store: [
    "Your catalog, fulfilment setup and current store",
    "The storefront, checkout and integrations to scope",
  ],
  product: [
    "The user problem and your must-have workflow",
    "What belongs in the first release—and what can wait",
  ],
  workflow: [
    "A repetitive task and the tools involved",
    "The trigger, exceptions and human approval points",
  ],
  chat: [
    "Recurring customer questions and approved answers",
    "What the assistant can answer and when a person takes over",
  ],
  system: [
    "A sample workflow and the people who use it",
    "The roles, data and reporting views to design first",
  ],
  campaign: [
    "Your offer, audience and traffic source",
    "The message, proof and action the page should prioritize",
  ],
  redesign: [
    "Your current URL and the friction you notice",
    "What to preserve, improve and migrate safely",
  ],
  experiment: [
    "Your main conversion goal and available analytics",
    "Which friction to investigate and how to measure a change",
  ],
  care: [
    "Your website URL, stack and recurring issues",
    "The access review, maintenance scope and support boundaries",
  ],
};

export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <MotionShell>
      <StudioNav />
      <main id="content" className="studio-inner-content">
        {children}
      </main>
      <StudioFooter />
    </MotionShell>
  );
}
export function PageIntro({
  eyebrow,
  title,
  accent,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  copy: string;
  children?: ReactNode;
}) {
  return (
    <section className="studio-page-intro">
      <div className="eco-container">
        <Link className="studio-breadcrumb" href="/">
          THE STUDIO <span>/</span> {eyebrow}
        </Link>
        <h1>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h1>
        <p>{copy}</p>
        {children}
      </div>
      <span className="studio-intro-orbit" aria-hidden="true" />
    </section>
  );
}
export function ServiceDetail({ service: s }: { service: StudioService }) {
  const related = STUDIO_SERVICES.filter((x) => x.slug !== s.slug)
    .filter(
      (x) =>
        x.mode === s.mode || x.projects.some((p) => s.projects.includes(p)),
    )
    .slice(0, 3);
  const next = related.length
    ? related
    : STUDIO_SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  return (
    <PageFrame>
      <section className={`studio-service-hero service-hero-${s.mode}`}>
        <div className="eco-container">
          <div>
            <Link className="studio-breadcrumb" href="/services">
              SERVICES <span>/</span> {s.title}
            </Link>
            <h1>
              {s.heading}
              <br />
              <em>{s.accent}</em>
            </h1>
            <p>{s.intro}</p>
            <div className="studio-hero-actions">
              <Link href={`/contact?service=${s.slug}`} className="eco-action">
                Discuss this project <span>↗</span>
              </Link>
              <a href="#deliverables" className="eco-text-link">
                See what’s included ↓
              </a>
            </div>
            <small>
              Clear scope. Thoughtful execution. Your code and data.
            </small>
          </div>
          <ServiceScene mode={s.mode} />
        </div>
      </section>
      <section className="eco-section studio-fit">
        <div className="eco-container">
          <div>
            <p className="eco-label">IS THIS YOUR NEXT STEP?</p>
            <h2>
              A good fit
              <br />
              <em>when this sounds familiar.</em>
            </h2>
          </div>
          <ul>
            {s.fit.map((x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="eco-section studio-deliverables" id="deliverables">
        <div className="eco-container">
          <div className="eco-section-heading" data-reveal>
            <div>
              <p className="eco-label">WHAT WE BUILD TOGETHER</p>
              <h2>
                The details that
                <br />
                <em>make the difference.</em>
              </h2>
            </div>
            <p>
              Final deliverables are agreed around your requirements. Here’s the
              kind of work we can scope together.
            </p>
          </div>
          <div className="studio-deliverable-grid">
            {s.deliverables.map(([title, text], i) => (
              <article key={title} data-reveal>
                <span>
                  0{i + 1}
                  <b>{["◇", "▱", "⌘", "↗"][i]}</b>
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="eco-section studio-service-process">
        <div className="eco-container">
          <p className="eco-label">HOW THIS COMES TOGETHER</p>
          <h2>
            A clear path.
            <br />
            <em>Room for the details.</em>
          </h2>
          <ol>
            {s.steps.map(([title, text], i) => (
              <li key={title} data-reveal>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <small className="service-review-output">
                    <i aria-hidden="true">✓</i> REVIEW POINT /{" "}
                    {SERVICE_CHECKPOINTS[s.mode][i]}
                  </small>
                </div>
                <b aria-hidden="true">↗</b>
              </li>
            ))}
          </ol>
          <Link className="eco-text-link" href="/approach">
            Explore the studio process ↗
          </Link>
        </div>
      </section>
      <section className="eco-section studio-proof">
        <div className="eco-container">
          <div className="eco-section-heading">
            <div>
              <p className="eco-label">THE WORK BEHIND THE WORDS</p>
              <h2>
                {s.projects.length
                  ? "Related studio work."
                  : "Built around your reality."}
              </h2>
            </div>
            <p>
              {s.mode === "workflow" || s.mode === "chat"
                ? "Public websites for businesses in this space. These previews demonstrate our web work, not evidence of undisclosed client automation systems."
                : s.projects.length
                  ? "Explore the project context and the original website. Every preview comes from our existing portfolio."
                  : "A real example from your business helps us define the right scope, responsibilities and first milestone."}
            </p>
          </div>
          {s.projects.length ? (
            <RelatedWork slugs={s.projects} />
          ) : (
            <div className="service-first-conversation">
              <article>
                <span>BRING THE CONTEXT</span>
                <h3>{SERVICE_DISCOVERY[s.mode][0]}</h3>
                <p>
                  No finished specification needed. A real example is a useful
                  place to start.
                </p>
              </article>
              <article>
                <span>LEAVE WITH DIRECTION</span>
                <h3>{SERVICE_DISCOVERY[s.mode][1]}</h3>
                <Link href={`/contact?service=${s.slug}`}>
                  Discuss this starting point ↗
                </Link>
              </article>
            </div>
          )}
        </div>
      </section>
      <section className="eco-section eco-faq">
        <div className="eco-container eco-faq-layout">
          <div>
            <p className="eco-label">BEFORE WE BEGIN</p>
            <h2>
              A few useful
              <br />
              <em>answers.</em>
            </h2>
          </div>
          <div>
            {s.questions.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="studio-related-services eco-container">
        <p className="eco-label">THE NEXT LAYER</p>
        <div>
          {next.map((item) => (
            <Link key={item.slug} href={`/services/${item.slug}`}>
              <span>{item.title}</span>
              <small>{item.short}</small>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>
      <PageCTA
        service={s.slug}
        title="Let’s find your starting point."
        copy={`Tell us where you are with ${s.title.toLowerCase()}. We’ll help define a useful next step.`}
      />
    </PageFrame>
  );
}

export function ProjectDetail({ slug }: { slug: string }) {
  const p = ALL_PROJECTS.find((x) => x.slug === slug)!;
  const d = PROJECT_DETAILS[slug];
  const index = ALL_PROJECTS.findIndex((x) => x.slug === slug);
  const next = ALL_PROJECTS[(index + 1) % ALL_PROJECTS.length];
  return (
    <PageFrame>
      <section className="studio-project-hero">
        <div className="eco-container">
          <Link href="/work" className="studio-breadcrumb">
            ← ALL WORK <span>/</span> {p.category}
          </Link>
          <div className="eco-section-heading">
            <div>
              <h1>
                {p.name}
                <span>.</span>
              </h1>
              <p>{p.line}</p>
            </div>
            <a
              href={p.url}
              className="eco-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit the website <span>↗</span>
            </a>
          </div>
          <a
            className="studio-project-cover"
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${p.name} live website (opens in a new tab)`}
          >
            <div>
              <span>● ● ●</span>
              <small>{new URL(p.url).hostname}</small>
              <span>↗</span>
            </div>
            <div>
              <Image
                src={`/work/${p.slug}.webp`}
                alt={p.alt}
                width={1440}
                height={900}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
                sizes="(max-width:700px) 92vw, 1200px"
                preload
              />
            </div>
          </a>
        </div>
      </section>
      <section className="eco-section studio-project-story">
        <div className="eco-container">
          <div>
            <p className="eco-label">THE EXPERIENCE</p>
            <h2>{d.focus}</h2>
            <p>
              Project notes below describe the features represented in our
              portfolio. Explore the website to see the experience in context.
            </p>
          </div>
          <div>
            <p className="eco-label">WHAT TO LOOK FOR</p>
            {d.features.map((feature, i) => (
              <div className="studio-project-feature" key={feature}>
                <span>0{i + 1}</span>
                <h3>{feature}</h3>
                <b>↗</b>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="studio-project-journey">
        <div className="eco-container">
          <p className="eco-label">THE VISITOR JOURNEY</p>
          <div>
            {d.journey.map((step, i) => (
              <article key={step} data-reveal>
                <span>0{i + 1}</span>
                <h3>{step}</h3>
                <b aria-hidden="true">{i === 2 ? "✓" : "→"}</b>
              </article>
            ))}
          </div>
        </div>
      </section>
      {slug === "the-sugar-story" && (
        <section className="eco-section sugar-project-paths">
          <div className="eco-container">
            <div className="eco-section-heading">
              <div>
                <p className="eco-label">TWO WAYS TO FIND SOMETHING SWEET</p>
                <h2>
                  Ready to order.
                  <br />
                  <em>Or made for you.</em>
                </h2>
              </div>
              <p>
                Some customers know what they want. Others need something
                personal. The storefront gives both a useful route.
              </p>
            </div>
            <div className="sugar-path-grid">
              <a
                href="https://thesugarstory.co.in/shop/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>01 / EVERYDAY DISCOVERY</span>
                <h3>
                  Explore the menu.
                  <br />
                  <em>Choose your favourite.</em>
                </h3>
                <p>
                  Product categories, sizes and basket actions bring the
                  standard ordering journey together.
                </p>
                <b>Explore the shop ↗</b>
              </a>
              <a
                href="https://thesugarstory.co.in/dessert-hampers-gifting-bhopal/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>02 / SOMETHING PERSONAL</span>
                <h3>
                  Build a hamper.
                  <br />
                  <em>Make it their own.</em>
                </h3>
                <p>
                  Choose treats and carry the selection into a WhatsApp enquiry
                  for the kitchen to quote.
                </p>
                <b>Explore the hamper builder ↗</b>
              </a>
            </div>
          </div>
        </section>
      )}
      {slug === "la-vallee-farms" && (
        <section className="eco-section studio-masterplan">
          <div className="eco-container">
            <div className="eco-section-heading">
              <div>
                <p className="eco-label">GO DEEPER</p>
                <h2>
                  A place you can
                  <br />
                  <em>actually explore.</em>
                </h2>
              </div>
              <p>
                Plot-level exploration brings the development into the buying
                journey: search, filter, zoom and enquire about a specific plot.
              </p>
            </div>
            <a
              href="https://lavalleefarms.vercel.app/#masterplan"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <Image
                  src="/work/la-vallee-masterplan.webp"
                  alt="La Vallée interactive masterplan with plot numbers and availability controls"
                  width={1440}
                  height={900}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                  sizes="90vw"
                />
              </div>
              <span>Open the interactive masterplan ↗</span>
            </a>
          </div>
        </section>
      )}
      <section className="studio-project-next eco-container">
        <div>
          <p className="eco-label">KEEP EXPLORING</p>
          <Link href={`/work/${next.slug}`}>
            <h2>{next.name}</h2>
            <span>Next project ↗</span>
          </Link>
        </div>
        <Link href="/work" className="eco-text-link">
          Back to the full portfolio ↗
        </Link>
      </section>
      <section className="project-context-cta eco-section">
        <div className="eco-container">
          <div>
            <p className="eco-label">A STARTING POINT FOR YOUR OWN PROJECT</p>
            <h2>
              Different business.
              <br />
              <em>The same attention to detail.</em>
            </h2>
            <p>
              Tell us what caught your eye and what your customers need to do.
              We’ll shape the right experience around your business.
            </p>
          </div>
          <Link
            className="eco-action"
            href={`/contact?service=${slug === "the-sugar-story" ? "ecommerce-shopify" : "websites"}&project=${p.slug}`}
          >
            Discuss a project like this <span>↗</span>
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}
