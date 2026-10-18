import { PageFrame, PageIntro } from "@/components/studio/StudioPages";
import { ProcessExplorer, PageCTA } from "@/components/studio/StudioSections";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Our approach",
  "Discover how PixelLayerr connects strategy, design, development and launch through clear scopes and reviewable milestones.",
  "/approach",
);
export default function Approach() {
  return (
    <PageFrame>
      <PageIntro
        eyebrow="OUR APPROACH"
        title="Creative ambition."
        accent="A clear way forward."
        copy="Great work needs room for exploration and a process you can follow. We make decisions visible, connect design with engineering and keep the next step clear."
      />
      <section className="eco-section eco-container">
        <ProcessExplorer />
      </section>
      <section className="eco-section studio-standards">
        <div className="eco-container">
          <p className="eco-label">WHAT YOU CAN EXPECT</p>
          <h2>
            Clarity at every
            <br />
            <em>working stage.</em>
          </h2>
          <div className="studio-deliverable-grid">
            {[
              [
                "One connected team",
                "Design choices and engineering constraints are discussed together, so the handoff is part of the work.",
              ],
              [
                "Scope before promises",
                "Deliverables, dependencies and milestones are agreed before implementation. Larger changes are discussed explicitly.",
              ],
              [
                "Work you can review",
                "Key decisions and working milestones are shared for feedback. You can see how the project is taking shape.",
              ],
              [
                "Ownership from the outset",
                "Your code, data and infrastructure remain yours. Handover and ongoing responsibilities are part of the conversation.",
              ],
            ].map(([title, copy], i) => (
              <article key={title} data-reveal>
                <span>
                  0{i + 1}
                  <b>↗</b>
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="eco-section studio-expectations">
        <div className="eco-container">
          <div>
            <p className="eco-label">BEFORE THE FIRST CALL</p>
            <h2>
              You don’t need
              <br />
              <em>a perfect brief.</em>
            </h2>
          </div>
          <ul>
            {[
              "Tell us what your business does and who you want to reach.",
              "Bring your current website or any useful references.",
              "Share the problem, deadline and constraints you already know.",
              "We’ll use the conversation to identify what needs defining next.",
            ].map((x) => (
              <li key={x}>
                ✓ <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PageCTA />
    </PageFrame>
  );
}
