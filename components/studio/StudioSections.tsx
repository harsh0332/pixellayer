"use client";
import Image from "next/image";
import { ProcessDiagram } from "./ProcessDiagram";
import Link from "next/link";
import { useId, useState } from "react";
import { ALL_PROJECTS, BOOKING_URL } from "@/lib/studio";
import { STUDIO_SERVICES } from "@/lib/services";
import { useSequence } from "./StudioMotion";

export function WorkRibbon() {
  const [active, setActive] = useState(0);
  const id = useId();
  const picks = ["la-vallee-farms", "the-sugar-story", "aranyaani", "lodhi-interiors"].flatMap((slug) => {
    const project = ALL_PROJECTS.find((item) => item.slug === slug);
    return project ? [project] : [];
  });
  const project = picks[active];
  return (
    <section id="selected-work" className="work-inspector" aria-labelledby={`${id}-heading`}>
      <div className="eco-container">
        <div className="work-inspector-heading"><div><span>SELECTED WORK / A CLOSER LOOK</span><h2 id={`${id}-heading`}>Good design. <em>Real businesses.</em></h2></div><Link href="/work">Explore all projects ↗</Link></div>
        <div className="work-inspector-layout">
          <div className="work-inspector-screen" key={project.slug}>
            <div className="work-inspector-chrome"><span>● ● ●</span><span>{new URL(project.url).hostname}</span><span>LIVE PROJECT</span></div>
            <Link href={`/work/${project.slug}`} aria-label={`Explore ${project.name}`}><Image src={`/work/${project.slug}.webp`} alt={project.alt} width={1440} height={900} sizes="(max-width: 849px) 100vw, 65vw" style={{ width: "100%", height: "auto" }} /></Link>
          </div>
          <div className="work-inspector-info">
            <div className="work-inspector-count"><span>0{active + 1} / 0{picks.length}</span><span>TAKE YOUR TIME</span></div>
            <div className="work-inspector-description" aria-live="polite" aria-atomic="true"><span>{project.category}</span><h3>{project.name}</h3><p>{project.line}</p></div>
            <Link className="work-inspector-link" href={`/work/${project.slug}`}>Explore the project <span>↗</span></Link>
            <div className="work-inspector-arrows"><button type="button" aria-label="Previous featured project" onClick={() => setActive((active + picks.length - 1) % picks.length)}>←</button><span>You set the pace.</span><button type="button" aria-label="Next featured project" onClick={() => setActive((active + 1) % picks.length)}>→</button></div>
          </div>
        </div>
        <div className="work-inspector-selectors" aria-label="Choose a featured project">{picks.map((item, index) => <button type="button" key={item.slug} aria-pressed={index === active} onClick={() => setActive(index)}><span>0{index + 1}</span><strong>{item.name}</strong><span aria-hidden="true">↗</span></button>)}</div>
      </div>
    </section>
  );
}

export function LogoMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className="eco-trusted eco-container studio-client-row"
      aria-label="Selected clients"
    >
      <div>
        <p>
          GOOD COMPANY.
          <br />
          <strong>GREAT COLLABORATIONS.</strong>
        </p>
        <button
          className="studio-logo-pause"
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Play logos ▷" : "Pause logos Ⅱ"}
        </button>
      </div>
      <div
        className="studio-marquee studio-logo-marquee studio-loop"
        data-local-paused={paused}
      >
        <div className="studio-logo-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="studio-logo-group"
              aria-hidden={copy ? true : undefined}
            >
              <span className="client-vallee">
                La Vallée <small>FARMS</small>
              </span>
              <span className="client-sugar">
                the sugar story<span>®</span>
              </span>
              <span className="client-baby">
                baby steps<span>✳</span>
              </span>
              <span className="client-forest">
                aranyaani<small>HEALING FOREST</small>
              </span>
              <span className="client-shoolin">
                SHOOLIN<small>CHEMICALS</small>
              </span>
              <span className="client-vallee">
                Lodhi <small>INTERIORS</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FILTERS = [
  "All work",
  "Websites",
  "E-commerce",
  "AI & Automation",
  "Healthcare",
  "Real Estate",
];
export function ProjectGallery({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState("All work"),
    [search, setSearch] = useState("");
  const filtered = ALL_PROJECTS.filter(
    (p) =>
      (filter === "All work" ||
        (filter === "Websites"
          ? !["E-commerce", "AI & Automation"].includes(p.category)
          : p.category === filter)) &&
      `${p.name} ${p.category} ${p.line}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  const visible = compact ? filtered.slice(0, 4) : filtered;
  return (
    <div className="studio-gallery">
      <div className="eco-work-toolbar">
        <div className="eco-filters" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              type="button"
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        {!compact && (
          <label className="studio-project-search">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a project…"
            />
          </label>
        )}
      </div>
      <p className="studio-results" aria-live="polite">
        {filtered.length === 0
          ? "No projects match this search."
          : `Showing ${visible.length} of ${filtered.length} projects`}
      </p>
      {visible.length === 0 && (
        <div className="studio-empty">
          <p>Try another industry or project name.</p>
          <button
            className="eco-outline-button"
            onClick={() => {
              setFilter("All work");
              setSearch("");
            }}
          >
            Reset filters ↗
          </button>
        </div>
      )}
      <div className="eco-project-grid">
        {visible.map((p, i) => (
          <article
            className="eco-project studio-project-card"
            key={`${filter}-${p.slug}`}
            style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}
          >
            <Link href={`/work/${p.slug}`} aria-label={`Explore ${p.name}`}>
              <div className={`eco-project-image eco-project-color-${i % 4}`}>
                <div className="eco-project-browser">
                  <div>
                    <i />
                    <i />
                    <i />
                    <span>{new URL(p.url).hostname}</span>
                  </div>
                  <div className="eco-project-screenshot">
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
                      sizes="(max-width:700px) 92vw, 44vw"
                      className="eco-work-image"
                    />
                  </div>
                </div>
                <span className="eco-project-open" aria-hidden="true">
                  ↗
                </span>
                <span className="studio-project-view">Explore project ↗</span>
              </div>
              <div className="eco-project-info">
                <h3>{p.name}</h3>
                <span>{p.category}</span>
              </div>
              <p>{p.line}</p>
            </Link>
            <a
              className="studio-project-live"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit website <span>↗</span>
              <span className="sr-only"> — {p.name} (opens in a new tab)</span>
            </a>
          </article>
        ))}
      </div>
      {compact && (
        <div className="eco-work-more">
          <Link className="eco-outline-button" href="/work">
            Explore all {ALL_PROJECTS.length} projects <span>↗</span>
          </Link>
          <span>
            Real work. Project context. A direct link to every website.
          </span>
        </div>
      )}
    </div>
  );
}

const PROCESS = [
  {
    name: "Discover",
    headline: "The right questions before the first pixel.",
    copy: "We talk through your business, audience and current constraints. Together we define what this project needs to achieve—and what it can leave for later.",
    outputs: ["Project brief", "Audience & goals", "Scope & milestones"],
    label: "A SHARED DIRECTION",
    nodes: ["Your business", "Your audience", "The right problem"],
  },
  {
    name: "Design",
    headline: "Make the journey feel obvious.",
    copy: "Content, layout and interaction take shape together. You review the direction and key journeys before engineering moves into full production.",
    outputs: ["Page & flow map", "Visual direction", "Interactive prototype"],
    label: "A REVIEWABLE EXPERIENCE",
    nodes: ["Information", "Interface", "Interaction"],
  },
  {
    name: "Develop",
    headline: "Bring the details into the real world.",
    copy: "We build the agreed experience, connect the integrations and check the important states. Reviewable milestones keep the work visible as it develops.",
    outputs: ["Working build", "Integrations", "Device & flow checks"],
    label: "A WORKING PRODUCT",
    nodes: ["Components", "Connections", "Quality checks"],
  },
  {
    name: "Launch & grow",
    headline: "Own the work. Know what comes next.",
    copy: "We review launch readiness, hand over the code and agree on the next priorities. Care, experimentation and connected growth can follow as separate scopes.",
    outputs: ["Launch checklist", "Code & handover", "Next-step priorities"],
    label: "A CLEAR HANDOVER",
    nodes: ["Launch", "Ownership", "Next chapter"],
  },
];
export function ProcessExplorer() {
  const { active, ref, choose, playing, manual, resume, setHover, setFocused } =
    useSequence(PROCESS.length, 6500);
  const id = useId();
  const item = PROCESS[active];
  return (
    <div
      className="studio-process-explorer"
      data-stage={active}
      data-playing={playing}
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div
        className="studio-process-tabs"
        role="tablist"
        aria-label="Explore our process"
      >
        {PROCESS.map((step, i) => (
          <button
            type="button"
            role="tab"
            key={step.name}
            id={`${id}-${i}`}
            aria-controls={`${id}-panel`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % 4;
              else if (e.key === "ArrowLeft") next = (i + 3) % 4;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = 3;
              else return;
              e.preventDefault();
              choose(next);
              document.getElementById(`${id}-${next}`)?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {step.name}
            <i
              key={`${active}-${i}`}
              style={{ animationPlayState: playing ? "running" : "paused" }}
            />
          </button>
        ))}
      </div>
      <div className="process-journey" aria-hidden="true">
        <span className="process-journey-label">ONE CONNECTED BUILD</span>
        <div className="process-journey-track">
          {PROCESS.map((step, i) => <span key={step.name} data-reached={i <= active} data-current={i === active}><i>{i < active ? "✓" : `0${i + 1}`}</i><b>{step.name}</b></span>)}
          <div className="process-journey-line"><i style={{ transform: `scaleX(${active / (PROCESS.length - 1)})` }} /></div>
        </div>
      </div>
      <div
        className="studio-process-panel"
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${active}`}
      >
        <div key={`copy-${active}`} className="studio-process-copy">
          <small>{item.label}</small>
          <h3>{item.headline}</h3>
          <p>{item.copy}</p>
          <div className="studio-process-outputs">
            <span>YOU LEAVE WITH</span>
            {item.outputs.map((output) => (
              <b key={output}>✓ {output}</b>
            ))}
          </div>
        </div>
        <ProcessDiagram key={active} stage={active} playing={playing} />
      </div>
      <div className="studio-process-foot">
        <span>Clear scope. Reviewable milestones. Full ownership.</span>
        <button type="button" onClick={manual ? resume : () => choose(active)}>{manual ? "Play walkthrough ▷" : "Pause walkthrough Ⅱ"}</button>
      </div>
    </div>
  );
}

export function ServiceFinder() {
  const [goal, setGoal] = useState("website");
  const choices = [
    {
      id: "website",
      name: "Build something new",
      title: "Start with the experience.",
      copy: "A distinctive website or product, scoped around what your visitors need to do.",
      slugs: ["websites", "web-apps-saas", "landing-pages"],
    },
    {
      id: "sell",
      name: "Sell online",
      title: "Make it easier to choose and buy.",
      copy: "A storefront and customer journey shaped around your products and operations.",
      slugs: ["ecommerce-shopify", "conversion-optimization"],
    },
    {
      id: "improve",
      name: "Improve what we have",
      title: "Find the friction. Fix the right things.",
      copy: "A focused review, redesign or care plan for the website you already own.",
      slugs: ["website-redesign", "conversion-optimization", "website-care"],
    },
    {
      id: "automate",
      name: "Connect our operations",
      title: "Give your team time back.",
      copy: "Connect conversations, data and repetitive work with practical software and AI.",
      slugs: ["ai-automation", "ai-chatbots", "business-systems"],
    },
  ];
  const current = choices.find((c) => c.id === goal)!;
  return (
    <div className="studio-finder">
      <div>
        <p className="eco-label">FIND YOUR STARTING POINT</p>
        <h2>
          What needs to
          <br />
          <em>work better?</em>
        </h2>
        <div
          className="studio-goal-options"
          aria-label="Choose your project goal"
        >
          {choices.map((c) => (
            <button
              type="button"
              key={c.id}
              aria-pressed={goal === c.id}
              onClick={() => setGoal(c.id)}
            >
              {c.name}
              <span>↗</span>
            </button>
          ))}
        </div>
      </div>
      <div className="studio-finder-result" aria-live="polite" key={goal}>
        <span className="studio-finder-symbol" aria-hidden="true">
          {goal === "automate"
            ? "⌘"
            : goal === "sell"
              ? "↗"
              : goal === "improve"
                ? "✳"
                : "▱"}
        </span>
        <h3>{current.title}</h3>
        <p>{current.copy}</p>
        <div>
          {current.slugs.map((slug) => {
            const s = STUDIO_SERVICES.find((s) => s.slug === slug)!;
            return (
              <Link href={`/services/${slug}`} key={slug}>
                {s.title}
                <span>↗</span>
              </Link>
            );
          })}
        </div>
        <Link className="studio-subtle-link" href="/contact">
          Not sure yet? Talk it through with us →
        </Link>
      </div>
    </div>
  );
}

export function AuditBridge() {
  return (
    <section className="studio-audit-bridge">
      <div className="eco-container">
        <div className="studio-audit-icon" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>↗</span>
        </div>
        <div>
          <p className="eco-label">ALREADY HAVE A WEBSITE?</p>
          <h2>Start with a clearer view.</h2>
          <p>
            Get a human review of the journey, clarity and technical basics.
            <br />
            See what to improve before committing to a rebuild.
          </p>
        </div>
        <Link className="eco-action" href="/website-audit">
          Get a free website audit <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
export function PageCTA({
  title = "What’s your next chapter?",
  copy = "Tell us what you’re building. We’ll help you find a practical starting point.",
  service,
}: {
  title?: string;
  copy?: string;
  service?: string;
}) {
  return (
    <section className="studio-page-cta">
      <div className="eco-container">
        <p className="eco-label">LET’S MAKE IT REAL</p>
        <h2>{title}</h2>
        <p>{copy}</p>
        <div>
          <Link
            className="eco-action"
            href={service ? `/contact?service=${service}` : "/contact"}
          >
            Discuss your project <span>↗</span>
          </Link>
          <a
            className="eco-text-link"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a discovery call ↗
          </a>
        </div>
        <small>A conversation first. A clear scope before work begins.</small>
      </div>
    </section>
  );
}
export function RelatedWork({ slugs }: { slugs: string[] }) {
  const projects = slugs
    .map((slug) => ALL_PROJECTS.find((p) => p.slug === slug))
    .filter((p) => !!p);
  if (!projects.length)
    return (
      <div className="studio-scope-note">
        <h3>Your workflow deserves its own blueprint.</h3>
        <p>
          We’ll scope your product around the actual users, tools and
          constraints. Explore our public website work to see our approach to
          visual design and interaction.
        </p>
        <Link href="/work" className="eco-text-link">
          Explore studio work ↗
        </Link>
      </div>
    );
  return (
    <div className="studio-related-grid">
      {projects.map((p) => (
        <Link key={p.slug} href={`/work/${p.slug}`}>
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
              sizes="(max-width:700px) 90vw, 30vw"
            />
          </div>
          <span>{p.category}</span>
          <h3>{p.name} ↗</h3>
          <p>{p.line}</p>
        </Link>
      ))}
    </div>
  );
}
