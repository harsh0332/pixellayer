import { SectionReveal } from "@/components/motion/v2";
import { Button } from "@/components/ui/Button";

/* Exact copy per spec — a single conversion block routing to WhatsApp /
   Calendly (no form backend). */
const WHATSAPP_AUDIT_URL =
  "https://wa.me/917024332332?text=Hi%20PixelLayerr%2C%20I%20want%20a%20free%20website%20audit%20for%3A%20%5Byour%20site%5D";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

export function AuditOffer() {
  return (
    <section id="audit" aria-label="Free website audit">
      <div className="container-site section-y-compact">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-2xl border border-hairline bg-surface px-6 py-14 sm:px-12 sm:py-16">
            {/* Soft lime glow — ambient, restrained */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-1/3 left-1/2 h-[60vh] w-[46rem] max-w-full -translate-x-1/2 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(198,255,90,0.12), rgba(135,194,255,0.05) 55%, transparent 78%)",
              }}
            />
            <div className="relative mx-auto max-w-2xl text-center">
              <p className="font-mono text-micro uppercase tracking-[0.22em] text-accent-text">
                Free Website Audit
              </p>
              <h2 className="mt-4 font-display text-heading text-text">
                Find out what&rsquo;s costing you customers.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-body-lg text-muted">
                Send us your current website. We&rsquo;ll show you exactly what&rsquo;s
                losing you leads — speed, SEO, and conversion gaps — with clear
                fixes. Free, no obligation.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  href={WHATSAPP_AUDIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                >
                  Get my free audit on WhatsApp →
                </Button>
                <Button
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                >
                  Book a call instead →
                </Button>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
