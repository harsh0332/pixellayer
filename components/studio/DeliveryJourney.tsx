import Link from "next/link";
const REVIEWS = [
  [
    "01",
    "Before we design",
    "A shared definition of success.",
    "Audience, page map, scope and the action each journey should lead to.",
    "Priorities, content and practical constraints.",
    "An agreed brief and a useful starting point.",
  ],
  [
    "02",
    "Before we build",
    "A direction you can explore.",
    "The visual system, key screens and a prototype of the important flows.",
    "Brand accuracy, content and how the journey feels.",
    "Approved direction and feedback in one place.",
  ],
  [
    "03",
    "Before we launch",
    "A working site, in your hands.",
    "A preview with responsive layouts, integrations and the agreed functionality.",
    "Real content, important user journeys and any remaining changes.",
    "A reviewed release checklist and launch plan.",
  ],
  [
    "04",
    "After the handover",
    "Ownership without guesswork.",
    "The relevant code, accounts, documentation and an agreed walkthrough.",
    "Who maintains the site and what your team needs to manage.",
    "Clear responsibilities and next-step priorities.",
  ],
];
export function DeliveryJourney() {
  return (
    <section className="delivery-journey eco-section">
      <div className="eco-container">
        <div className="eco-section-heading">
          <div>
            <p className="eco-label">REVIEW TOGETHER. MOVE FORWARD.</p>
            <h2>
              You see the decisions.
              <br />
              <em>Not just the finished file.</em>
            </h2>
          </div>
          <p>
            Each stage ends with something useful to review. That keeps feedback
            focused and the next step clear.
          </p>
        </div>
        <div className="delivery-review-grid">
          {REVIEWS.map(([n, when, title, see, bring, leave]) => (
            <article key={n} data-reveal>
              <header>
                <span>{n}</span>
                <small>{when}</small>
                <i>↗</i>
              </header>
              <h3>{title}</h3>
              <dl>
                <div>
                  <dt>WE SHARE</dt>
                  <dd>{see}</dd>
                </div>
                <div>
                  <dt>YOU REVIEW</dt>
                  <dd>{bring}</dd>
                </div>
              </dl>
              <p>
                <b>✓</b>
                {leave}
              </p>
            </article>
          ))}
        </div>
        <div className="delivery-scope-note">
          <span>THE SCHEDULE</span>
          <p>
            Milestones follow the agreed scope, content readiness and feedback.
            We set dates together before work begins, and discuss scope changes
            before they affect the plan.
          </p>
          <Link href="/contact">Talk through your project ↗</Link>
        </div>
      </div>
    </section>
  );
}
