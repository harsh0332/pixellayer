'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './motion.module.css';

export function ProcessEnergy({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null); const active = useInView(ref, { amount: .35 });
  return <div ref={ref} className={`${styles.process} ${active ? styles.processActive : ''}`}>{children}<i className={styles.energyPulse} aria-hidden="true" /></div>;
}
