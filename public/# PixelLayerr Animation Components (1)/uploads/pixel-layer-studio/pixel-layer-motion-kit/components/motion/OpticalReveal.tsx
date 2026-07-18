'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function OpticalReveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true, amount: .65 });
  return <motion.span ref={ref} className={className} initial={{ clipPath: 'inset(0 0 104% 0)', filter: 'blur(7px)' }} animate={inView ? { clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)' } : undefined} transition={{ duration: .88, delay, ease: [.16, .66, .2, 1] }}>{children}</motion.span>;
}
