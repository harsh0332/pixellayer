'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { motionValue, type MotionValue } from 'framer-motion';
import styles from './motion.module.css';

type Field = { pointerX: MotionValue<number>; pointerY: MotionValue<number>; lightX: MotionValue<number>; lightY: MotionValue<number>; scrollVelocity: MotionValue<number> };
const MotionField = createContext<Field | null>(null);
export const useMotionField = () => { const field = useContext(MotionField); if (!field) throw new Error('useMotionField must be used inside MotionEnvironment'); return field; };

export function MotionEnvironment({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const values = useMemo<Field>(() => ({ pointerX: motionValue(0), pointerY: motionValue(0), lightX: motionValue(50), lightY: motionValue(46), scrollVelocity: motionValue(0) }), []);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0, scrollFrame = 0, previousScroll = scrollY;
    let px = innerWidth / 2, py = innerHeight / 2, x = px, y = py;
    const draw = () => {
      x += (px - x) * .055; y += (py - y) * .055;
      const lightX = 50 + ((x / innerWidth) - .5) * 5;
      const lightY = 46 + ((y / innerHeight) - .5) * 4;
      values.pointerX.set(x); values.pointerY.set(y); values.lightX.set(lightX); values.lightY.set(lightY);
      host.current?.style.setProperty('--pl-light-x', `${lightX}%`); host.current?.style.setProperty('--pl-light-y', `${lightY}%`);
      frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => { px = event.clientX; py = event.clientY; };
    const scroll = () => { if (scrollFrame) return; scrollFrame = requestAnimationFrame(() => { const velocity = scrollY - previousScroll; previousScroll = scrollY; const speed = Math.min(Math.abs(velocity) / 80, 1); values.scrollVelocity.set(speed); host.current?.style.setProperty('--pl-scroll-speed', `${speed}`); host.current?.style.setProperty('--pl-scroll-blur', `${speed * .5}px`); scrollFrame = 0; }); };
    frame = requestAnimationFrame(draw); addEventListener('pointermove', move, { passive: true }); addEventListener('scroll', scroll, { passive: true });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(scrollFrame); removeEventListener('pointermove', move); removeEventListener('scroll', scroll); };
  }, [values]);
  return <MotionField.Provider value={values}><div ref={host} className={styles.environment}>{children}</div></MotionField.Provider>;
}
