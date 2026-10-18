import Link from "next/link";
import { PageFrame, PageIntro } from "@/components/studio/StudioPages";
import { PageCTA, LogoMarquee } from "@/components/studio/StudioSections";
import { StudioLogo } from "@/components/studio/StudioChrome";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "The studio & ecosystem",
  "Meet PixelLayerr, the design and engineering studio in the Pixelcliq Media ecosystem. Based in Indore, building for businesses everywhere.",
  "/studio",
);
export default function Studio() {
  return (
    <PageFrame>
      <PageIntro
        eyebrow="THE STUDIO"
        title="Independent minds."
        accent="Connected possibilities."
        copy="PixelLayerr is a design and engineering studio based in Indore, India. We build websites, products and systems that connect a business’s ideas to the people who need them."
      />
      <LogoMarquee />
      <section className="eco-section studio-story">
        <div className="eco-container">
          <p className="eco-label">WHY THE LAYERS MATTER</p>
          <h2>
            A digital experience is
            <br />
            <em>never just one thing.</em>
          </h2>
          <div>
            <p>
              It is the story someone understands, the interface they can
              navigate, the code that keeps it running and the next step that
              makes sense. We bring those decisions into the same conversation.
            </p>
            <p>
              Our work spans distinctive websites, commerce, product
              engineering, AI and internal systems. The starting point is the
              same: understand the problem, design the right experience and
              build it with care.
            </p>
          </div>
        </div>
      </section>
      <section className="eco-section eco-connected">
        <div className="eco-container">
          <p className="eco-label">THE PIXELCLIQ MEDIA ECOSYSTEM</p>
          <h2>
            Build the experience.
            <br />
            <em>Connect the growth.</em>
          </h2>
          <div className="eco-brand-connection">
            <div className="eco-brand-side">
              <StudioLogo />
              <h3>Design & engineering.</h3>
              <p>
                Websites, stores, products and automation.
                <br />
                The digital foundation for what comes next.
              </p>
              <Link href="/services" className="eco-media-link">
                EXPLORE OUR SERVICES ↗
              </Link>
            </div>
            <span className="eco-connection-symbol" aria-hidden="true">
              ↔
            </span>
            <a
              className="eco-brand-side eco-media-side"
              href="https://pixelcliqmedia.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="eco-media-logo">
                pixelcliq<span>.</span>
                <small>MEDIA / INDEPENDENT GROWTH</small>
              </span>
              <h3>Creative & performance.</h3>
              <p>
                Brand, campaigns and content.
                <br />
                The work that brings the right people to the experience.
              </p>
              <span className="eco-media-link">MEET PIXELCLIQ MEDIA ↗</span>
            </a>
          </div>
          <p className="eco-ecosystem-note">
            Start with one focused project. Connect the next layer when it makes
            sense.
          </p>
        </div>
      </section>
      <section className="eco-section eco-container studio-principles">
        <p className="eco-label">HOW WE THINK</p>
        {[
          [
            "Purpose before polish.",
            "A distinctive visual direction should still help someone understand, decide or act.",
          ],
          [
            "The details are the experience.",
            "Responsive states, loading, forms and handoffs deserve the same care as the hero.",
          ],
          [
            "Keep the work connected.",
            "Design, development and growth work better when they share a clear goal.",
          ],
        ].map(([title, text], i) => (
          <article key={title} data-reveal>
            <span>0{i + 1}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <PageCTA title="Tell us what you see ahead." />
    </PageFrame>
  );
}
