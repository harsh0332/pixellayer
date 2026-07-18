"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

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
    menuRef.current
      ?.querySelector<HTMLElement>("a, button")
      ?.focus();

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
      <div
        className={cn(
          "border-b transition-colors duration-300 ease-out-expo",
          scrolled || open
            ? "border-hairline bg-base/70 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main"
          className={cn(
            "container-site flex items-center justify-between transition-[height] duration-300 ease-out-expo",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Link
            href="/"
            className="font-display text-title font-semibold tracking-tight text-text"
          >
            PixelLayerr
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
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

          <div className="hidden md:block">
            <Magnetic>
              <Button
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a call
              </Button>
            </Magnetic>
          </div>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-sm text-text md:hidden"
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
