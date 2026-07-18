const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

/* Email/socials remain editable tokens — not provided, not invented. */
const CONTACT_PLACEHOLDERS = [
  "{{CONTACT_EMAIL}}",
  "{{LINKEDIN_URL}}",
  "{{INSTAGRAM_URL}}",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="container-site section-y-compact grid gap-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div className="max-w-sm">
          <p className="font-display text-title font-semibold tracking-tight text-text">
            PixelLayerr
          </p>
          <p className="mt-3 text-small text-muted">
            Digital product engineering studio. We design and build premium
            websites, web apps, SaaS, AI agents, and industry software.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-micro uppercase tracking-[0.08em] text-muted">
            Site
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-underline text-small text-muted transition-colors duration-200 ease-out-expo hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-micro uppercase tracking-[0.08em] text-muted">
            Contact
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <a
                href="tel:+917024332332"
                className="link-underline text-small text-muted transition-colors duration-200 ease-out-expo hover:text-text"
              >
                +91 70243 32332
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/917024332332"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-small text-muted transition-colors duration-200 ease-out-expo hover:text-text"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-small text-muted transition-colors duration-200 ease-out-expo hover:text-text"
              >
                Book a call
              </a>
            </li>
            <li className="text-small text-muted">
              Indore, Madhya Pradesh, India
            </li>
            {CONTACT_PLACEHOLDERS.map((token) => (
              <li key={token} className="font-mono text-small text-muted">
                {token}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-site flex h-16 items-center">
          <p className="text-small text-muted">© 2026 PixelLayerr</p>
        </div>
      </div>
    </footer>
  );
}
