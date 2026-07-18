'use client';

import { motion, useMotionValue, animate, type HTMLMotionProps } from 'framer-motion';
import { useRef } from 'react';

type Props = HTMLMotionProps<'div'> & { maxTilt?: number; children: React.ReactNode };
const settle = { duration: .78, ease: [.16, .66, .2, 1] as const };
export function DepthCard({ maxTilt = 4, children, onPointerMove, onPointerLeave, style, ...props }: Props) {
  const x = useMotionValue(0), y = useMotionValue(0), lightX = useMotionValue('50%'), lightY = useMotionValue('50%'); const ref = useRef<HTMLDivElement>(null);
  return <motion.div ref={ref} {...props} style={{ ...style, rotateX: x, rotateY: y, '--card-light-x': lightX, '--card-light-y': lightY } as HTMLMotionProps<'div'>['style']} onPointerMove={(event) => { const box = ref.current?.getBoundingClientRect(); if (box) { const nx = (event.clientX - box.left) / box.width - .5, ny = (event.clientY - box.top) / box.height - .5; x.set(ny * -maxTilt); y.set(nx * maxTilt); lightX.set(`${(nx + .5) * 100}%`); lightY.set(`${(ny + .5) * 100}%`); } onPointerMove?.(event); }} onPointerLeave={(event) => { animate(x, 0, settle); animate(y, 0, settle); onPointerLeave?.(event); }}>{children}</motion.div>;
}
