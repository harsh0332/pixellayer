import Link from "next/link";
import { STUDIO_SERVICES, type ServiceMode } from "@/lib/services";

/** Small, decorative explanations. All actual service information stays in HTML. */
export function ServiceGlyph({
  mode,
  className = "",
}: {
  mode: ServiceMode;
  className?: string;
}) {
  return (
    <div
      className={`service-glyph glyph-${mode} studio-loop ${className}`}
      aria-hidden="true"
    >
      <div className="glyph-grid" />
      {(mode === "design" || mode === "redesign") && (
        <div className="glyph-browser">
          <div className="glyph-browser-bar">
            <i />
            <i />
            <i />
            <span>YOUR NEXT CHAPTER</span>
          </div>
          <div className="glyph-website">
            <span className="glyph-type">
              {mode === "redesign" ? "Re:" : "Aa"}
              <em>
                {mode === "redesign" ? "imagined." : "a little different."}
              </em>
            </span>
            <div className="glyph-art">
              <i />
              <i />
              <i />
            </div>
            <span className="glyph-lines">
              <i />
              <i />
            </span>
            <b>Let’s begin ↗</b>
            <span className="glyph-cursor">↖</span>
          </div>
          <span className="glyph-badge">
            {mode === "redesign"
              ? "KEEP THE EQUITY. IMPROVE THE EXPERIENCE."
              : "STRATEGY → A DISTINCTIVE WEBSITE"}
          </span>
        </div>
      )}
      {mode === "store" && (
        <div className="glyph-shop">
          <div className="glyph-bag">
            <svg viewBox="0 0 120 140" fill="none">
              <path d="M28 48H92L102 127H18L28 48Z" fill="currentColor" />
              <path
                d="M43 55V35A17 17 0 0 1 77 35V55"
                stroke="currentColor"
                strokeWidth="6"
              />
              <path d="M49 82L60 93L77 71" stroke="#d6f06e" strokeWidth="5" />
            </svg>
          </div>
          <div>
            <small>THE EVERYDAY EDIT</small>
            <strong>
              Find it.
              <br />
              <em>Make it yours.</em>
            </strong>
            <span className="glyph-swatches">
              <i />
              <i />
              <i />
            </span>
            <b>
              Add to bag <span>+</span>
            </b>
          </div>
          <span className="glyph-toast">
            ✓ Clear product. Confident choice.
          </span>
        </div>
      )}
      {(mode === "product" || mode === "system") && (
        <div className="glyph-workspace">
          <div>
            <b>workroom.</b>
            <span>Overview</span>
            <span>Projects</span>
            <span>People</span>
          </div>
          <section>
            <small>
              {mode === "system" ? "ONE SHARED VIEW" : "THE NEXT RELEASE"}
            </small>
            <div className="glyph-board">
              {["Plan", "Build", "Review"].map((x, i) => (
                <div key={x}>
                  <b>{x}</b>
                  <i style={{ animationDelay: `${i * 0.5}s` }} />
                  <i />
                </div>
              ))}
            </div>
            <span className="glyph-sync">
              <i />{" "}
              {mode === "system"
                ? "People + data + decisions"
                : "From idea to working product"}
            </span>
          </section>
        </div>
      )}
      {mode === "workflow" && (
        <div className="glyph-flow">
          <span>LESS COPYING. MORE CONTEXT.</span>
          {["Enquiry", "Qualify", "CRM", "Your team"].map((x, i) => (
            <div key={x}>
              <b style={{ animationDelay: `${i * 0.8}s` }}>
                {["↗", "✳", "▦", "✓"][i]}
              </b>
              <small>{x}</small>
            </div>
          ))}
          <svg viewBox="0 0 400 40" preserveAspectRatio="none">
            <path d="M25 20H375" />
          </svg>
        </div>
      )}
      {mode === "chat" && (
        <div className="glyph-chat">
          <div>
            <i>✳</i>
            <span>Always a helpful next step.</span>
          </div>
          <p>Which option is right for me?</p>
          <p>
            Let’s find the right fit.
            <br />
            <span>Explore options ↗</span>
            <span>Speak to the team ↗</span>
          </p>
          <span className="glyph-typing">
            <i />
            <i />
            <i />
          </span>
        </div>
      )}
      {mode === "campaign" && (
        <div className="glyph-campaign">
          <div>
            <small>THE AD</small>
            <b>
              Make room
              <br />
              <em>for what’s next.</em>
            </b>
            <i />
          </div>
          <span>→</span>
          <div>
            <small>THE LANDING PAGE</small>
            <b>
              Your next
              <br />
              <em>chapter.</em>
            </b>
            <i />
            <span>One clear action ↗</span>
          </div>
        </div>
      )}
      {mode === "experiment" && (
        <div className="glyph-experiment">
          <small>MAKE THE NEXT STEP EASIER</small>
          <strong>Let’s talk.</strong>
          <div>
            <span>Your name</span>
            <span>Work email</span>
            <span className="glyph-extra">Company size</span>
            <span>What are you building?</span>
          </div>
          <b>Start a conversation ↗</b>
          <em>Observe → improve → validate</em>
        </div>
      )}
      {mode === "care" && (
        <div className="glyph-care">
          <div>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="49" />
              <circle cx="60" cy="60" r="49" />
            </svg>
            <span>✓</span>
          </div>
          <section>
            <strong>
              Ready for
              <br />
              <em>what comes next.</em>
            </strong>
            {["Updates", "Backups", "Journey checks"].map((x, i) => (
              <span key={x} style={{ animationDelay: `${i * 0.6}s` }}>
                <i>✓</i>
                {x}
              </span>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
export function ServiceDirectory({ home = false }: { home?: boolean }) {
  const slugs = [
    "websites",
    "ecommerce-shopify",
    "web-apps-saas",
    "ai-automation",
    "business-systems",
    "website-redesign",
  ];
  const services = home
    ? slugs.map((slug) => STUDIO_SERVICES.find((s) => s.slug === slug)!)
    : STUDIO_SERVICES;
  return (
    <div className={`service-visual-directory ${home ? "directory-home" : ""}`}>
      {services.map((s, i) => (
        <article className="service-visual-card" key={s.slug} data-reveal>
          <Link href={`/services/${s.slug}`} aria-label={`Explore ${s.title}`}>
            <ServiceGlyph mode={s.mode} />
            <div className="service-visual-copy">
              <span className="service-visual-number">
                {String(i + 1).padStart(2, "0")} /{" "}
                {home ? "OUR EXPERTISE" : s.mode.toUpperCase()}
              </span>
              <h3>
                {s.title}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>{s.short}</p>
              <span className="service-visual-delivery">
                {s.deliverables.slice(0, 2).map(([t]) => (
                  <small key={t}>{t}</small>
                ))}
              </span>
              <span className="service-visual-link">
                Explore the service <b aria-hidden="true">→</b>
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
