import { PageFrame, PageIntro } from "@/components/studio/StudioPages";
import { AuditRequest } from "@/components/studio/AuditRequest";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Free website audit",
  "Request a human review of your website’s clarity, user journey and technical basics. Start with what to improve before a rebuild.",
  "/website-audit",
);
export default function Audit() {
  return (
    <PageFrame>
      <PageIntro
        eyebrow="FREE WEBSITE AUDIT"
        title="A clearer view of"
        accent="what needs to work better."
        copy="Before you rebuild, understand the friction. Send us your website for a human review of the experience, message and technical basics. Free, with no obligation to start a project."
      />
      <section className="eco-section eco-container studio-audit-layout">
        <div>
          <p className="eco-label">WHAT WE’LL LOOK AT</p>
          <h2>
            The journey.
            <br />
            <em>Not just the homepage.</em>
          </h2>
          {[
            [
              "First-impression clarity",
              "Can visitors understand the offer and who it is for?",
            ],
            [
              "The path to action",
              "Are enquiries, bookings or purchases easy to find and complete?",
            ],
            [
              "Mobile usability",
              "Do content, navigation and controls hold together on smaller screens?",
            ],
            [
              "Technical basics",
              "Where do speed, structure or search signals need closer attention?",
            ],
          ].map(([title, copy], i) => (
            <article key={title} data-reveal>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
          <p className="studio-audit-boundary">
            Share your main goal and the pages that matter most. We’ll use
            that context to identify practical improvements and discuss
            which ones to tackle first.
          </p>
        </div>
        <AuditRequest />
      </section>
    </PageFrame>
  );
}
