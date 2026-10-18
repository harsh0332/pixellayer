"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ALL_PROJECTS, PROJECT_DETAILS } from "@/lib/studio";
import { revealPose, revealPosition } from "@/lib/portfolio-reveal";
import { MotionToggle, useStudioMotion } from "./StudioMotion";

/** All portfolio projects, in a dedicated scroll chapter below the hero. */
export function ScrollPortfolio() {
  const region = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);
  const [linkFocused, setLinkFocused] = useState(false);
  const { paused, reduced } = useStudioMotion();

  useEffect(() => {
    const root = region.current;
    const canvas = scene.current;
    const sticky = stage.current;
    if (!root || !canvas || !sticky || paused || reduced || linkFocused) return;
    let frame = 0;
    let previous = -1;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = parseFloat(getComputedStyle(sticky).top) || 0;
      const distance = Math.max(1, rect.height - sticky.offsetHeight);
      const progress = Math.max(0, Math.min(1, (offset - rect.top) / distance));
      if (previous === progress) return;
      previous = progress;
      const position = revealPosition(progress, ALL_PROJECTS.length);
      setActive(Math.round(position));
      root.style.setProperty("--reel-progress", String(progress));
      cards.current.forEach((card, i) => {
        if (!card) return;
        const pose = revealPose(i, position);
        if (!pose.visible) {
          card.style.visibility = "hidden";
          return;
        }
        card.style.visibility = "visible";
        card.style.transform = `translateY(${pose.y}px) scale(${pose.scale})`;
        card.style.clipPath = `inset(${pose.inset}% 0 0 0)`;
        card.style.zIndex = String(pose.zIndex);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      previous = -1;
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [paused, reduced, linkFocused]);

  const project = ALL_PROJECTS[active];
  return (
    <section id="work" ref={region} className="portfolio-reel" aria-labelledby="portfolio-reel-title" data-paused={paused || reduced} data-reduced={reduced} style={{ "--project-count": ALL_PROJECTS.length } as CSSProperties}>
      <div className="portfolio-reel-stage" ref={stage}>
        <div className="eco-container portfolio-reel-heading">
          <div><span>01 / OUR WORK, IN MOTION</span><h2 id="portfolio-reel-title">Different worlds.<br /><em>Every one, considered.</em></h2></div>
          <div className="portfolio-reel-intro"><p>{ALL_PROJECTS.length} websites. Real brands.<br />Scroll through every one.</p><a href="#specialty">Skip to our specialty ↓</a></div>
        </div>
        <div className="portfolio-reel-scene" ref={scene}>
          <div className="portfolio-reel-frame" aria-hidden="true" />
          {ALL_PROJECTS.map((item, i) => (
            <div key={item.slug} className="portfolio-reel-card" data-active={i === active} data-project={item.slug} aria-hidden={i !== active} inert={i !== active} ref={(element) => { cards.current[i] = element; }}>
              <a className="portfolio-live-link" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${item.name} website (opens in a new tab)`} tabIndex={i === active ? 0 : -1} onFocus={() => setLinkFocused(true)} onBlur={() => setLinkFocused(false)}>
              <div className="portfolio-reel-browser"><span>● ● ●</span><span>{new URL(item.url).hostname}</span><span>↗</span></div>
              <Image src={`/work/${item.slug}.webp`} alt="" width={1440} height={900} loading={Math.abs(i - active) <= 2 ? "eager" : "lazy"} sizes="(max-width: 600px) 86vw, (max-width: 999px) 70vw, 720px" style={{ width: "100%", height: "auto" }} />
              <div className="portfolio-reel-card-label"><strong>{item.name}</strong><span>Visit website ↗</span></div>
              </a>
            </div>
          ))}
        </div>
        <div className="eco-container portfolio-reel-details">
          <div className="portfolio-reel-index"><strong>{String(active + 1).padStart(2, "0")}</strong><span>/ {ALL_PROJECTS.length}</span></div>
          <div className="portfolio-reel-copy" key={project.slug}><span>{project.category}</span><h3>{project.name}</h3><p>{PROJECT_DETAILS[project.slug]?.focus ?? project.line}</p></div>
          <Link href={`/work/${project.slug}`} className="portfolio-reel-link" onFocus={() => setLinkFocused(true)} onBlur={() => setLinkFocused(false)}>Explore project <span>↗</span><span className="sr-only"> — {project.name}</span></Link>
        </div>
        <div className="eco-container portfolio-reel-bottom">
          <div className="portfolio-chapters" aria-hidden="true">{ALL_PROJECTS.map((item, i) => <i key={item.slug} data-complete={i < active} data-current={i === active} />)}</div>
          <div className="portfolio-reel-progress" aria-hidden="true"><span /></div>
          <div><span>{paused || reduced ? "MOTION PAUSED · EXPLORE ALL PROJECTS" : "SCROLL TO REVEAL THE NEXT WEBSITE"}</span><MotionToggle /><Link href="/work">Browse projects ↗</Link></div>
        </div>
      </div>
    </section>
  );
}
