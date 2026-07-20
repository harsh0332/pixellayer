import { AnimatedLogo, SectionReveal } from "@/components/motion/v2";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

const linkClass =
  "link-underline text-small text-muted transition-colors duration-200 ease-out-expo hover:text-text";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <SectionReveal>
        {/* ---- Brand row: animated wordmark + promise + CTA ---- */}
        <div className="container-site flex flex-col gap-8 pt-16 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <AnimatedLogo variant="wordmark" size={30} />
            <p className="mt-5 text-small text-muted">
              Digital product engineering studio. Design, engineering, AI and
              automation — built to turn visitors into customers.
            </p>
          </div>
          <Button
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            Book a call
            <span aria-hidden>↗</span>
          </Button>
        </div>
      </SectionReveal>

      {/* ---- Link columns ---- */}
      <div className="border-t border-hairline">
        <div className="container-site grid gap-10 py-12 sm:grid-cols-2 md:gap-16">
          <nav aria-label="Footer">
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
              Site
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
              Contact
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a href="tel:+917024332332" className={linkClass}>
                  +91 70243 32332
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917024332332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Book a call
                </a>
              </li>
              <li className="text-small text-muted">
                Indore, Madhya Pradesh, India
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ---- Legal bar ---- */}
      <div className="border-t border-hairline">
        <div className="container-site flex h-16 items-center justify-between">
          <p className="text-small text-muted">© 2026 PixelLayerr</p>
          <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
            Designed &amp; engineered as one
          </p>
        </div>
      </div>
    </footer>
  );
}
