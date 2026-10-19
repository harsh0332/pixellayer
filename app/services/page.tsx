import { PageFrame, PageIntro } from "@/components/studio/StudioPages";
import { PageCTA, ServiceFinder } from "@/components/studio/StudioSections";
import { ServiceDirectory } from "@/components/studio/ServiceDirectory";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Services",
  "Website design, e-commerce, SaaS, AI automation and business systems. Explore the right starting point for your project.",
  "/services",
);
export default function Services() {
  return (
    <PageFrame>
      <PageIntro
        eyebrow="OUR EXPERTISE"
        title="Every layer of your"
        accent="next digital chapter."
        copy="Start with the problem you need to solve. Explore a focused service, or connect design, development and automation into one clearly scoped project."
      />
      <section className="eco-section eco-container">
        <ServiceFinder />
      </section>
      <section className="eco-section studio-all-services" id="all-services">
        <div className="eco-container">
          <p className="eco-label">EXPLORE ALL SERVICES</p>
          <h2>
            Good thinking.
            <br />
            <em>Made tangible.</em>
          </h2>
          <ServiceDirectory />
        </div>
      </section>
      <PageCTA
        title="One service or several. Let’s start with you."
        copy="We’ll understand the business first, then help you choose a useful scope."
      />
    </PageFrame>
  );
}
