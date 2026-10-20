"use client";
import Link from "next/link";
import { useSequence } from "./StudioMotion";
const STEPS = [
  [
    "Arrive",
    "Make the right first impression.",
    "A clear offer, a recognisable brand and a page that fits the reason someone clicked.",
  ],
  [
    "Understand",
    "Answer the next question.",
    "Useful service details, real work and the information people need before they decide.",
  ],
  [
    "Act",
    "Make the next step obvious.",
    "An enquiry, a booking or a purchase. One primary action for each journey, with less friction around it.",
  ],
  [
    "Connect",
    "Keep the context moving.",
    "The right information reaches your team through a form, WhatsApp or the integrations we agree to build.",
  ],
];
export function ConversionJourney() {
  const { active, ref, playing, choose, setHover, setFocused } =
    useSequence(4, 6000);
  return (
    <section
      className="conversion-story eco-section"
      aria-labelledby="conversion-heading"
    >
      <div
        className="eco-container"
        ref={ref}
        data-playing={playing}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        <div className="eco-section-heading">
          <div>
            <p className="eco-label">DESIGNED AROUND THE NEXT STEP</p>
            <h2 id="conversion-heading">
              Attention is a start.
              <br />
              <em>Give it somewhere to go.</em>
            </h2>
          </div>
          <p>
            We connect the first impression to the moment someone is ready to
            talk, book or buy.
          </p>
        </div>
        <div className="conversion-map">
          <div className="conversion-rail" aria-hidden="true">
            <i style={{ transform: `scaleX(${(active + 1) / 4})` }} />
          </div>
          {STEPS.map(([title], i) => (
            <button
              key={title}
              type="button"
              aria-pressed={active === i}
              onClick={() => choose(i)}
            >
              <span className="conversion-node">{["↗", "◎", "↵", "✳"][i]}</span>
              <span>
                <small>0{i + 1}</small>
                {title}
              </span>
            </button>
          ))}
        </div>
        <div className="conversion-explanation">
          <div key={active}>
            <span>
              0{active + 1} / {STEPS[active][0].toUpperCase()}
            </span>
            <h3>{STEPS[active][1]}</h3>
            <p>{STEPS[active][2]}</p>
          </div>
          <div className="conversion-next">
            <Link href="/website-audit">
              Where does your website lose people?{" "}
              <span>Get a free review ↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
