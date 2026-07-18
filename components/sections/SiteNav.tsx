"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AnimatedLogo, NavBarMotion } from "@/components/motion/v2";
import { Button } from "@/components/ui/Button";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];
/* NavBarMotion wants {label, href}. */
const NB_LINKS = LINKS.map((l) => ({ label: l.label, href: l.href }));

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

const HIDE_AFTER = 120;
const CONDENSE_AFTER = 24;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > CONDENSE_AFTER);
      setHidden(y > HIDE_AFTER && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside
  useEffect(() => {
    if (!open) return;

    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusables = menuRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out-expo focus-within:translate-y-0",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        {/* Desktop bar — NavBarMotion (own condense/glass, sliding underline,
            magnetic CTA, cascade-in). Logo = AnimatedLogo wordmark. */}
        <div className="hidden md:block">
          <NavBarMotion
            links={NB_LINKS}
            ctaLabel="Book a call"
            ctaHref={BOOKING_URL}
            maxWidth={1240}
            logo={
              <Link href="/" aria-label="PixelLayerr — home">
                <AnimatedLogo variant="wordmark" size={22} />
              </Link>
            }
          />
        </div>

        {/* Mobile bar — hamburger + AnimatedLogo; keeps my full-screen menu. */}
        <div
          className={cn(
            "border-b transition-colors duration-300 ease-out-expo md:hidden",
            scrolled || open
              ? "border-hairline bg-base/70 backdrop-blur-md"
              : "border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Main"
            className="container-site flex h-16 items-center justify-between"
          >
            <Link href="/" aria-label="PixelLayerr — home">
              <AnimatedLogo variant="wordmark" size={20} />
            </Link>
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-sm text-text"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                {open ? (
                  <path d="M4 4l12 12M16 4L4 16" />
                ) : (
                  <path d="M2 6.5h16M2 13.5h16" />
                )}
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Overlay lives OUTSIDE <header>: the header's translate transform would
          otherwise become the containing block for this fixed element. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-deep md:hidden"
          >
            <nav aria-label="Mobile" className="container-site flex-1 pt-28">
              <ul className="flex flex-col gap-2 border-t border-hairline pt-8">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="block py-3 font-display text-heading text-text transition-colors duration-200 ease-out-expo hover:text-accent-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pb-12">
                <Button
                  size="lg"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  Book a call
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
