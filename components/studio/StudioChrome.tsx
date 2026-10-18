"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { STUDIO_SERVICES } from "@/lib/services";
import { MotionToggle } from "./StudioMotion";

export function StudioLogo() {
  return (
    <span className="eco-logo">
      <svg
        className="eco-mark"
        width="33"
        height="36"
        viewBox="0 0 36 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="studio-logo-top"
          d="m18 2 16 9-16 9L2 11 18 2Z"
          fill="currentColor"
        />
        <path
          className="studio-logo-middle"
          d="m2 20 16 9 16-9"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          className="studio-logo-bottom"
          d="m2 29 16 9 16-9"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        pixellayerr<span className="eco-dot">.</span>
        <small>DESIGN / BUILD / CONNECT</small>
      </span>
    </span>
  );
}
export function StudioNav({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLDivElement>(null),
    services = useRef<HTMLDetailsElement>(null);
  const links = [
    ["/work", "Our work"],
    ["/services", "Services"],
    ["/approach", "Our approach"],
    ["/studio", "The studio"],
  ];
  useEffect(() => {
    if (!open) return;
    const old = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key !== "Tab") return;
      const all = panel.current?.querySelectorAll<HTMLElement>("a,button");
      if (!all?.length) return;
      const first = all[0],
        last = all[all.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = matchMedia("(min-width:850px)");
    const resize = () => {
      if (mq.matches) setOpen(false);
    };
    document.addEventListener("keydown", key);
    mq.addEventListener("change", resize);
    return () => {
      document.documentElement.style.overflow = old;
      document.removeEventListener("keydown", key);
      mq.removeEventListener("change", resize);
    };
  }, [open]);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (services.current && !services.current.contains(e.target as Node))
        services.current.open = false;
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && services.current?.open) {
        services.current.open = false;
        services.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);
  return (
    <>
      <header
        className={`eco-header studio-nav-header ${home ? "" : "studio-nav-inner"}`}
      >
        <div className="eco-container eco-nav">
          <Link href="/" aria-label="PixelLayerr home">
            <StudioLogo />
          </Link>
          <nav className="eco-desktop-links" aria-label="Main navigation">
            <Link href="/work">Our work</Link>
            <details className="studio-nav-services" ref={services}>
              <summary>
                Services <span>⌄</span>
              </summary>
              <div className="studio-mega">
                <div>
                  <small>EVERY LAYER, CONNECTED</small>
                  <h2>
                    Find your
                    <br />
                    <em>starting point.</em>
                  </h2>
                  <Link
                    href="/services"
                    onClick={() => {
                      if (services.current) services.current.open = false;
                    }}
                  >
                    Explore all services ↗
                  </Link>
                </div>
                <ul>
                  {STUDIO_SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        onClick={() => {
                          if (services.current) services.current.open = false;
                        }}
                      >
                        {s.title}
                        <span>↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
            <Link href="/approach">Our approach</Link>
            <Link href="/studio">The studio</Link>
          </nav>
          <Link className="eco-nav-cta" href="/contact">
            Let’s talk <span>↗</span>
          </Link>
          {!home && <div className="studio-nav-motion"><MotionToggle /></div>}
          <button
            className="eco-menu-toggle"
            type="button"
            ref={trigger}
            aria-expanded={open}
            aria-controls="studio-mobile-nav"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      {open && (
        <div
          className="eco-mobile-menu"
          id="studio-mobile-nav"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            Close <span>×</span>
          </button>
          <nav>
            {[
              ...links,
              ["/website-audit", "Website audit"],
              ["/contact", "Let’s talk"],
            ].map(([href, label]) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                {label}
                <span>↗</span>
              </Link>
            ))}
          </nav>
          <p>GOOD IDEAS. CONNECTED POSSIBILITIES.</p>
        </div>
      )}
    </>
  );
}
export function StudioFooter() {
  return (
    <footer className="eco-footer studio-footer">
      <div className="eco-container">
        <div className="studio-footer-grid">
          <div>
            <Link href="/" aria-label="PixelLayerr home">
              <StudioLogo />
            </Link>
            <p>
              Independent minds.
              <br />
              <em>Connected possibilities.</em>
            </p>
            <a
              href="https://pixelcliqmedia.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Part of the Pixelcliq Media ecosystem ↗
            </a>
          </div>
          <nav aria-label="Explore the studio">
            <h2>THE STUDIO</h2>
            {[
              ["/work", "Selected work"],
              ["/approach", "Our approach"],
              ["/studio", "About & ecosystem"],
              ["/website-audit", "Free website audit"],
              ["/contact", "Start a project"],
            ].map(([href, name]) => (
              <Link href={href} key={href}>
                {name}
              </Link>
            ))}
          </nav>
          <nav aria-label="Explore services">
            <h2>OUR EXPERTISE</h2>
            {STUDIO_SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </Link>
            ))}
          </nav>
          <div>
            <h2>LET’S CONNECT</h2>
            <a href="tel:+917024332332">+91 70243 32332</a>
            <a
              href="https://wa.me/917024332332"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp ↗
            </a>
            <span>
              Indore, India.
              <br />
              Working with businesses everywhere.
            </span>
          </div>
        </div>
        <div className="eco-footer-bottom">
          <span>
            © {new Date().getFullYear()} PixelLayerr. Design, engineering and
            connected growth.
          </span>
          <span>MADE WITH INTENTION, IN INDIA.</span>
          <a href="#content">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
