"use client";
import Image from "next/image";
import Link from "next/link";
import { FEATURED, PROJECTS } from "@/lib/work";
import { useSequence } from "./StudioMotion";

const CASES = [
  {
    slug: "la-vallee-farms",
    name: "La Vallée Farms",
    label: "01 / AN EXPLORABLE DEVELOPMENT",
    title: "From a plot on a map",
    accent: "to a real conversation.",
    copy: "The masterplan becomes part of the buying journey. Visitors explore the layout and ask about a specific plot, with the context already attached.",
    image: "/work/la-vallee-masterplan.webp",
    alt: FEATURED.alt,
    url: FEATURED.masterplanUrl,
    service: "websites",
    steps: [
      ["Explore the layout", "Zoom, pan and find a plot."],
      ["See what’s available", "Plot details and availability in one view."],
      ["Enquire with context", "Take the selected plot into WhatsApp."],
    ],
  },
  {
    slug: "the-sugar-story",
    name: "The Sugar Story",
    label: "02 / A STOREFRONT WITH PERSONALITY",
    title: "A little craving.",
    accent: "A considered shopping journey.",
    copy: "A boutique bakery needs more than a product grid. Everyday treats, celebration cakes and personal gifts each get a clear path of their own.",
    image: "/work/the-sugar-story.webp",
    alt: PROJECTS[0].alt,
    url: PROJECTS[0].url,
    service: "ecommerce-shopify",
    steps: [
      ["Find your favourite", "Browse by product or occasion."],
      ["Make it personal", "Choose options or build a dessert hamper."],
      ["Take the next step", "Order online or request a custom quote."],
    ],
  },
];
function ExperienceCase({
  item,
  index,
}: {
  item: (typeof CASES)[number];
  index: number;
}) {
  const { active, ref, playing, manual, choose, resume, setHover, setFocused } =
    useSequence(3, 5200);
  return (
    <article
      className={`experience-case experience-case-${index}`}
      ref={ref}
      data-step={active}
      data-playing={playing}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="experience-case-visual">
        <div className="experience-caption">
          <span>{item.label}</span>
          <span>BUILT BY PIXELLAYERR</span>
        </div>
        <a
          className="experience-browser"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Explore ${item.name} live website (opens in a new tab)`}
        >
          <span className="experience-browser-bar">
            <span>● ● ●</span>
            <span>{new URL(item.url).hostname}</span>
            <b>↗</b>
          </span>
          <Image
            src={item.image}
            alt={item.alt}
            width={1440}
            height={index ? 790 : 900}
            sizes="(max-width: 850px) 92vw, 56vw"
          />
          <span className="experience-open">
            {index
              ? "Explore the storefront"
              : "Open the interactive masterplan"}{" "}
            <b>↗</b>
          </span>
        </a>
        <div className="experience-route" aria-hidden="true">
          <span>{index ? "DISCOVER" : "EXPLORE"}</span>
          <i />
          <span>{index ? "PERSONALISE" : "UNDERSTAND"}</span>
          <i />
          <span>{index ? "ORDER / ENQUIRE" : "ENQUIRE"}</span>
          <b style={{ left: `${active * 43 + 7}%` }}>●</b>
        </div>
        <p className="experience-observation">
          <span>THE DETAIL THAT MATTERS</span>
          {index
            ? "A direct purchase and a bespoke enquiry don’t need the same journey."
            : "The enquiry starts with a chosen plot, instead of an empty message."}
        </p>
      </div>
      <div className="experience-case-copy">
        <span className="experience-project-label">
          {item.name} / {index ? "E-commerce" : "Real estate"}
        </span>
        <h3>
          {item.title}
          <br />
          <em>{item.accent}</em>
        </h3>
        <p>{item.copy}</p>
        <ol className="experience-steps">
          {item.steps.map(([title, copy], i) => (
            <li key={title} data-active={active === i}>
              <button
                type="button"
                aria-pressed={active === i}
                onClick={() => choose(i)}
              >
                <span>0{i + 1}</span>
                <strong>
                  {title}
                  <small>{copy}</small>
                </strong>
                <i aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <div className="experience-case-actions">
          <Link href={`/work/${item.slug}`}>Inside the build ↗</Link>
          <button
            type="button"
            onClick={manual ? resume : () => choose(active)}
          >
            {manual ? "Play journey ▷" : "Pause journey Ⅱ"}
          </button>
        </div>
        <Link
          className="experience-build-link"
          href={`/contact?service=${item.service}&project=${item.slug}`}
        >
          {index
            ? "Plan a store for your brand"
            : "Discuss your property website"}
          <span>↗</span>
        </Link>
      </div>
    </article>
  );
}
export function SpecialtyShowcase() {
  return (
    <section id="specialty" className="studio-specialty eco-section">
      <div className="eco-container">
        <div className="eco-section-heading" data-reveal>
          <div>
            <p className="eco-label">BEYOND THE BROCHURE</p>
            <h2>
              Beautiful is the beginning.
              <br />
              <em>Useful is the difference.</em>
            </h2>
          </div>
          <p>
            Two different businesses. Two very different journeys. A closer look
            at what the website actually helps people do.
          </p>
        </div>
        <div className="experience-cases">
          {CASES.map((item, i) => (
            <ExperienceCase key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
