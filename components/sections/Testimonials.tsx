"use client";

import {
  AnimatedEyebrow,
  SectionHeadingMotion,
  TestimonialDeckMotion,
} from "@/components/motion/v2";

/* Five REAL testimonials, provided by the client. No invented quotes; no
   AI Buddies card. If a name is later cleared, keep a {{}} slot rather than
   inventing one. */
const TESTIMONIALS = [
  {
    quote:
      "The animated site genuinely stands out — parents notice it, and we've had more appointment enquiries since it went live. It finally feels as modern as the care we give.",
    name: "Dr. Sudarshan Arya",
    role: "Baby Steps · Pediatric Clinic",
  },
  {
    quote:
      "The animations do more than look good — they help visitors actually understand what Aranyaani is about. People stay longer and get the vision immediately.",
    name: "Sanjeev Saxena",
    role: "Aranyaani Healing Forest",
  },
  {
    quote:
      "Since the new site, our registrations and conversions have clearly improved. It's fast, clean, and does the selling for us.",
    name: "DPM Entertainment",
    role: "Events & Entertainment",
  },
  {
    quote:
      "Really impressed with how it turned out — polished, professional, and easy for patients to book. Exactly what we wanted.",
    name: "Prince",
    role: "Apna Dental Clinic",
  },
  {
    quote:
      "They built us a genuinely premium website — it makes our business look as serious as it is. Great work start to finish.",
    name: "Sandeep",
    role: "Shoolin Chemicals",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="border-y border-hairline bg-elevated"
    >
      <div className="container-site section-y">
        <AnimatedEyebrow index="07" label="Testimonials" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion text="In their *words*." fontSize={42} />
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <TestimonialDeckMotion
            testimonials={TESTIMONIALS}
            maxWidth={760}
            height={400}
          />
        </div>
      </div>
    </section>
  );
}
