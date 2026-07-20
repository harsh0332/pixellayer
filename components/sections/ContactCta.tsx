"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { AmbientGlow } from "@/components/motion/AmbientGlow";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { AnimatedEyebrow, SectionHeadingMotion } from "@/components/motion/v2";
import { Button } from "@/components/ui/Button";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Env overrides win; public studio contact details are the code defaults. */
const WEBHOOK = process.env.NEXT_PUBLIC_FORM_WEBHOOK;
const BOOKING =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "917024332332";
const PHONE_DISPLAY = "+91 70243 32332";
const PHONE_TEL = "tel:+917024332332";
const ADDRESS = "Indore, Madhya Pradesh, India";

const NEEDS = [
  "Website",
  "Web app",
  "SaaS product",
  "AI agents & automation",
  "Business system (CRM/ERP/dashboard)",
  "Something else",
];

/* Qualitative bands — the site shows no pricing anywhere. */
const BUDGETS = ["Lean", "Standard", "Ambitious", "Not sure yet"];
const TIMELINES = ["ASAP", "1–3 months", "3+ months", "Just exploring"];

const STEP_LEGENDS = [
  "What do you need?",
  "Budget & timeline",
  "Project details",
  "Your contact details",
];

type Fields = {
  need: string;
  budget: string;
  timeline: string;
  details: string;
  link: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

const EMPTY: Fields = {
  need: "",
  budget: "",
  timeline: "",
  details: "",
  link: "",
  name: "",
  email: "",
  phone: "",
  company: "",
};

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "unconfigured";

function validateStep(step: number, f: Fields): Partial<Fields> {
  const errors: Partial<Fields> = {};
  if (step === 0 && !f.need) errors.need = "Choose the closest fit.";
  if (step === 1) {
    if (!f.budget) errors.budget = "Pick a band — “Not sure yet” is fine.";
    if (!f.timeline) errors.timeline = "Pick a timeline.";
  }
  if (step === 2 && f.details.trim().length < 10)
    errors.details = "A couple of sentences helps us reply usefully.";
  if (step === 3) {
    if (!f.name.trim()) errors.name = "We need a name to reply to.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      errors.email = "That email doesn't look complete.";
  }
  return errors;
}

const inputClass =
  "h-12 w-full rounded-md border border-hairline bg-surface px-4 text-body text-text " +
  "transition-colors duration-200 ease-out-expo placeholder:text-muted/60 " +
  "hover:border-hairline-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "aria-[invalid=true]:border-warn";

function RadioCards({
  name,
  options,
  value,
  onChange,
  describedBy,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  describedBy?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const checked = value === option;
        return (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              aria-describedby={describedBy}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex min-h-11 items-center rounded-md border px-4 py-2.5 text-small",
                "transition-colors duration-200 ease-out-expo",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                checked
                  ? "border-accent bg-accent-glow/40 text-text"
                  : "border-hairline bg-surface text-muted hover:border-hairline-strong hover:text-text",
              )}
            >
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-small text-warn">
      {message}
    </p>
  );
}

export function ContactCta() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<Status>("idle");
  const stepRef = useRef<HTMLFieldSetElement>(null);
  const visited = useRef(false);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* Move focus to the new step's first field (not on initial mount). */
  useEffect(() => {
    if (!visited.current) {
      visited.current = true;
      return;
    }
    stepRef.current
      ?.querySelector<HTMLElement>("input, textarea")
      ?.focus();
  }, [step]);

  const next = () => {
    const stepErrors = validateStep(step, fields);
    setErrors(stepErrors);
    if (Object.values(stepErrors).some(Boolean)) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const submit = async () => {
    const stepErrors = validateStep(3, fields);
    setErrors(stepErrors);
    if (Object.values(stepErrors).some(Boolean)) return;

    if (!WEBHOOK) {
      setStatus("unconfigured");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "project-brief",
          ...fields,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  /* Enter-only step transition: the old step unmounts instantly so the
     focus-management effect always targets the newly mounted fieldset. */
  const stepMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
      };

  const whatsappHref = WHATSAPP
    ? `https://wa.me/${WHATSAPP.replace(/\D/g, "")}`
    : null;

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden"
    >
      <AmbientGlow intensity={0.6} />
      <div className="container-site section-y relative">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* ---- Left rail ---- */}
          <div className="lg:col-span-5">
            <AnimatedEyebrow index="08" label="Contact" />
            <div className="mt-4">
              <SectionHeadingMotion
                text="Tell us what you're *building*."
                fontSize="clamp(27px, 6.5vw, 40px)"
              />
            </div>
            <p className="mt-6 max-w-md text-body-lg text-muted">
              Four short steps — we’ll reply with a clear next step.
            </p>

            <div className="mt-10 flex flex-col gap-2 border-t border-hairline pt-8">
              <a
                href={PHONE_TEL}
                className="link-underline w-fit text-body text-text"
              >
                {PHONE_DISPLAY}
              </a>
              <p className="text-small text-muted">{ADDRESS}</p>
            </div>

            {(whatsappHref || BOOKING) && (
              <div className="mt-8">
                {whatsappHref && (
                  <Button
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                  >
                    Chat on WhatsApp
                    <span aria-hidden>↗</span>
                  </Button>
                )}
                {BOOKING && (
                  <div className={cn(whatsappHref && "mt-8")}>
                    <p className="text-small font-medium text-text">
                      Prefer to talk?
                    </p>
                    <iframe
                      src={BOOKING}
                      title="Book a call"
                      loading="lazy"
                      className="mt-4 h-105 w-full rounded-lg border border-hairline bg-surface"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---- Form card ---- */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-hairline bg-surface p-6 sm:p-10">
              {status === "success" ? (
                <motion.div
                  {...(reducedMotion
                    ? {}
                    : {
                        initial: { opacity: 0, y: 8 },
                        animate: { opacity: 1, y: 0 },
                        transition: {
                          duration: DURATION.slow,
                          ease: EASE_OUT_EXPO,
                        },
                      })}
                  role="status"
                  className="flex min-h-96 flex-col items-start justify-center"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="20" cy="20" r="17" opacity="0.35" />
                    <motion.path
                      d="M13 20.5l5 5 9.5-10"
                      {...(reducedMotion
                        ? {}
                        : {
                            initial: { pathLength: 0 },
                            animate: { pathLength: 1 },
                            transition: {
                              duration: DURATION.slow,
                              ease: EASE_OUT_EXPO,
                              delay: 0.15,
                            },
                          })}
                    />
                  </svg>
                  <h3 className="mt-6 font-display text-heading">
                    Brief received.
                  </h3>
                  <p className="mt-3 max-w-md text-body text-muted">
                    Thanks — we’ll come back to you with a clear next step.
                  </p>
                  {BOOKING && (
                    <div className="mt-8">
                      <Button
                        href={BOOKING}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                      >
                        Or book a call now
                        <span aria-hidden>↗</span>
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (step < 3) next();
                    else submit();
                  }}
                >
                  {/* Progress */}
                  <div className="flex items-center justify-between">
                    <p className="text-micro uppercase tracking-[0.08em] text-muted">
                      Step {step + 1} of 4
                    </p>
                    <div className="flex gap-2" aria-hidden>
                      {STEP_LEGENDS.map((legend, i) => (
                        <span
                          key={legend}
                          className={cn(
                            "h-1 w-8 rounded-full transition-colors duration-300 ease-out-expo",
                            i <= step ? "bg-accent" : "bg-surface-hover",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                    <motion.fieldset
                      key={step}
                      ref={stepRef}
                      {...stepMotion}
                      className="mt-8 border-0 p-0"
                    >
                      <legend className="text-title text-text">
                        {STEP_LEGENDS[step]}
                      </legend>

                      <div aria-live="polite" className="mt-6 flex flex-col gap-6">
                        {step === 0 && (
                          <div>
                            <RadioCards
                              name="need"
                              options={NEEDS}
                              value={fields.need}
                              onChange={set("need")}
                              describedBy={errors.need ? "err-need" : undefined}
                            />
                            <FieldError id="err-need" message={errors.need} />
                          </div>
                        )}

                        {step === 1 && (
                          <>
                            <div>
                              <p className="mb-3 text-small font-medium text-text">
                                Budget band
                              </p>
                              <RadioCards
                                name="budget"
                                options={BUDGETS}
                                value={fields.budget}
                                onChange={set("budget")}
                                describedBy={
                                  errors.budget ? "err-budget" : undefined
                                }
                              />
                              <FieldError
                                id="err-budget"
                                message={errors.budget}
                              />
                            </div>
                            <div>
                              <p className="mb-3 text-small font-medium text-text">
                                Timeline
                              </p>
                              <RadioCards
                                name="timeline"
                                options={TIMELINES}
                                value={fields.timeline}
                                onChange={set("timeline")}
                                describedBy={
                                  errors.timeline ? "err-timeline" : undefined
                                }
                              />
                              <FieldError
                                id="err-timeline"
                                message={errors.timeline}
                              />
                            </div>
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <div>
                              <label
                                htmlFor="contact-details"
                                className="mb-2 block text-small font-medium text-text"
                              >
                                About the project
                              </label>
                              <textarea
                                id="contact-details"
                                rows={5}
                                value={fields.details}
                                onChange={(e) => set("details")(e.target.value)}
                                aria-invalid={!!errors.details || undefined}
                                aria-describedby={
                                  errors.details ? "err-details" : undefined
                                }
                                placeholder="What are you building, for whom, and what should it achieve?"
                                className={cn(
                                  inputClass,
                                  "h-auto min-h-32 py-3.5",
                                )}
                              />
                              <FieldError
                                id="err-details"
                                message={errors.details}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="contact-link"
                                className="mb-2 block text-small font-medium text-text"
                              >
                                Current site or product{" "}
                                <span className="font-normal text-muted">
                                  (optional)
                                </span>
                              </label>
                              <input
                                id="contact-link"
                                type="url"
                                value={fields.link}
                                onChange={(e) => set("link")(e.target.value)}
                                placeholder="https://"
                                className={inputClass}
                              />
                            </div>
                          </>
                        )}

                        {step === 3 && (
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="contact-name"
                                className="mb-2 block text-small font-medium text-text"
                              >
                                Name
                              </label>
                              <input
                                id="contact-name"
                                type="text"
                                autoComplete="name"
                                value={fields.name}
                                onChange={(e) => set("name")(e.target.value)}
                                aria-invalid={!!errors.name || undefined}
                                aria-describedby={
                                  errors.name ? "err-name" : undefined
                                }
                                className={inputClass}
                              />
                              <FieldError id="err-name" message={errors.name} />
                            </div>
                            <div>
                              <label
                                htmlFor="contact-email"
                                className="mb-2 block text-small font-medium text-text"
                              >
                                Email
                              </label>
                              <input
                                id="contact-email"
                                type="email"
                                autoComplete="email"
                                value={fields.email}
                                onChange={(e) => set("email")(e.target.value)}
                                aria-invalid={!!errors.email || undefined}
                                aria-describedby={
                                  errors.email ? "err-email" : undefined
                                }
                                className={inputClass}
                              />
                              <FieldError
                                id="err-email"
                                message={errors.email}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="contact-phone"
                                className="mb-2 block text-small font-medium text-text"
                              >
                                WhatsApp / phone{" "}
                                <span className="font-normal text-muted">
                                  (optional)
                                </span>
                              </label>
                              <input
                                id="contact-phone"
                                type="tel"
                                autoComplete="tel"
                                value={fields.phone}
                                onChange={(e) => set("phone")(e.target.value)}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="contact-company"
                                className="mb-2 block text-small font-medium text-text"
                              >
                                Company{" "}
                                <span className="font-normal text-muted">
                                  (optional)
                                </span>
                              </label>
                              <input
                                id="contact-company"
                                type="text"
                                autoComplete="organization"
                                value={fields.company}
                                onChange={(e) => set("company")(e.target.value)}
                                className={inputClass}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.fieldset>

                  {/* Submission status */}
                  <div aria-live="polite">
                    {status === "unconfigured" && (
                      <p className="mt-6 rounded-md border border-warn/30 bg-warn/5 px-4 py-3 text-small text-warn">
                        Direct submission isn’t configured yet
                        (NEXT_PUBLIC_FORM_WEBHOOK is unset) — please reach us
                        via the contact links on this page instead.
                      </p>
                    )}
                    {status === "error" && (
                      <p className="mt-6 rounded-md border border-warn/30 bg-warn/5 px-4 py-3 text-small text-warn">
                        Something went wrong sending your brief — please try
                        again.
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="mt-10 flex items-center justify-between gap-4">
                    <div>
                      {step > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="lg"
                          onClick={() => setStep((s) => s - 1)}
                        >
                          ← Back
                        </Button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === "submitting"}
                    >
                      {step < 3
                        ? "Continue"
                        : status === "submitting"
                          ? "Sending…"
                          : status === "error"
                            ? "Try again"
                            : "Send brief"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
