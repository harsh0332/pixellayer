import Link from "next/link";
import { PageFrame, PageIntro } from "@/components/studio/StudioPages";
import { ContactCta } from "@/components/sections/ContactCta";
import { getService } from "@/lib/services";
import { pageMetadata, BOOKING_URL } from "@/lib/studio";
export const metadata = pageMetadata(
  "Start a project",
  "Tell PixelLayerr what you want to build. Book a discovery call, share a project brief or start with a website audit.",
  "/contact",
);
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const service =
    typeof params.service === "string" ? getService(params.service) : undefined;
  return (
    <PageFrame>
      <PageIntro
        eyebrow="LET’S MAKE IT REAL"
        title="A good project starts"
        accent="with a conversation."
        copy="Tell us where you are and what you want to change. We’ll help clarify the right scope, the important constraints and a practical next step."
      />
      <section className="studio-contact-options eco-container">
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          <span>01 / TALK IT THROUGH</span>
          <h2>Book a discovery call ↗</h2>
          <p>Explore the idea and ask the questions on your mind.</p>
        </a>
        <a href="#contact">
          <span>02 / SHARE THE CONTEXT</span>
          <h2>Send a project brief ↓</h2>
          <p>Four short steps. No need for a polished specification.</p>
        </a>
        <Link href="/website-audit">
          <span>03 / START WITH A REVIEW</span>
          <h2>Get a free website audit ↗</h2>
          <p>A useful starting point when you already have a site.</p>
        </Link>
      </section>
      <div className="eco-contact-wrap">
        {service && (
          <p className="studio-contact-selection eco-container">
            LET’S TALK ABOUT <strong>{service.title}</strong>
            <Link href="/contact">Clear selection ×</Link>
          </p>
        )}
        <ContactCta
          key={service?.slug ?? "general"}
          initialNeed={service?.need}
        />
      </div>
    </PageFrame>
  );
}
