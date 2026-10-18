import { PageFrame, PageIntro } from "@/components/studio/StudioPages";
import { ProjectGallery, PageCTA } from "@/components/studio/StudioSections";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Selected work",
  "Explore real PixelLayerr websites, storefronts and digital experiences, with project details and direct links to each website.",
  "/work",
);
export default function Work() {
  return (
    <PageFrame>
      <PageIntro
        eyebrow="SELECTED WORK"
        title="Different businesses."
        accent="Distinctly their own."
        copy="A closer look at the websites and experiences we’ve built. Filter by industry, explore the project, then see the original website."
      />
      <section className="eco-section eco-container">
        <ProjectGallery />
      </section>
      <PageCTA
        title="Your business belongs in its own category."
        copy="Let’s create a digital experience that reflects what makes it different."
      />
    </PageFrame>
  );
}
