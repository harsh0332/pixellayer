import { NoiseOverlay } from "@/components/motion/NoiseOverlay";
import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Industries } from "@/components/sections/Industries";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteNav } from "@/components/sections/SiteNav";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhatWeDo } from "@/components/sections/WhatWeDo";

export default function Home() {
  return (
    <>
      <NoiseOverlay />
      <SiteNav />
      <main id="content">
        <Hero />
        <TrustedBy />
        <WhatWeDo />
        <SelectedWork />
        <Industries />
        <HowWeWork />
        <Testimonials />
        <ContactCta />
      </main>
      <SiteFooter />
    </>
  );
}
