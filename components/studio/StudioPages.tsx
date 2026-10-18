import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { StudioService } from "@/lib/services";
import { STUDIO_SERVICES } from "@/lib/services";
import { ALL_PROJECTS, PROJECT_DETAILS } from "@/lib/studio";
import { StudioNav, StudioFooter } from "./StudioChrome";
import { MotionShell } from "./StudioMotion";
import { ServiceScene } from "./ServiceScene";
import { PageCTA, RelatedWork } from "./StudioSections";

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
                : "Explore the project context and the original website. Every preview comes from our existing portfolio."}
            </p>
          </div>
          <RelatedWork slugs={s.projects} />
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
          <div className="studio-project-cover">
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
          </div>
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
      <PageCTA
        title="Have a different challenge in mind?"
        copy="Your business has its own audience, story and next step. Let’s build the right experience for it."
      />
    </PageFrame>
  );
}
