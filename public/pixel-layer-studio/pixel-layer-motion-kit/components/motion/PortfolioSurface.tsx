'use client';

import { motion, useMotionValue, animate } from 'framer-motion';
import { DepthCard } from './DepthCard';
import styles from './motion.module.css';

export function PortfolioSurface({ children, className }: { children: React.ReactNode; className?: string }) {
  const imageX = useMotionValue(0), imageY = useMotionValue(0);
  return <DepthCard maxTilt={0} className={`${styles.portfolioSurface} ${className ?? ''}`} onPointerMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); imageX.set(((event.clientX - box.left) / box.width - .5) * 5); imageY.set(((event.clientY - box.top) / box.height - .5) * 4); }} onPointerLeave={() => { animate(imageX, 0, { duration: .75, ease: [.16, .66, .2, 1] }); animate(imageY, 0, { duration: .75, ease: [.16, .66, .2, 1] }); }}>
    <motion.div className={styles.portfolioVisual} style={{ x: imageX, y: imageY }}>{children}</motion.div><span className={styles.borderTravel} aria-hidden="true" />
  </DepthCard>;
}
