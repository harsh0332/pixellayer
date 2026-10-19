"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

const MotionContext = createContext<{
  paused: boolean;
  setPaused: (value: boolean) => void;
  reduced: boolean;
}>({
  paused: false,
  setPaused: () => {},
  reduced: false,
});
export const useStudioMotion = () => useContext(MotionContext);
export function MotionShell({
  children,
  floating = true,
}: {
  children: ReactNode;
  floating?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("eco-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    const loops = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.inView = String(
            entry.isIntersecting,
          );
        }),
      { rootMargin: "100px" },
    );
    root.current
      ?.querySelectorAll(".studio-loop")
      .forEach((el) => loops.observe(el));
    return () => {
      observer.disconnect();
      loops.disconnect();
    };
  }, [children]);
  return (
    <MotionContext.Provider value={{ paused, setPaused, reduced }}>
      <div
        ref={root}
        className="ecosystem studio-enhanced"
        data-motion-paused={paused || reduced}
      >
        {children}
        {floating && (
          <div className="studio-motion-dock">
            <MotionToggle />
          </div>
        )}
      </div>
    </MotionContext.Provider>
  );
}
export function MotionToggle() {
  const { paused, setPaused, reduced } = useStudioMotion();
  return (
    <button
      className="studio-motion-toggle"
      type="button"
      aria-pressed={paused || reduced}
      aria-label={
        reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"
      }
      title={
        reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"
      }
      disabled={reduced}
      onClick={() => setPaused(!paused)}
    >
      <span className="studio-motion-icon" aria-hidden="true">
        {paused || reduced ? "▷" : "Ⅱ"}
      </span>
      <span className="studio-motion-label">
        {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
      </span>
    </button>
  );
}
export function useSequence(count: number, delay = 4500, initialStage = 0) {
  const { paused, reduced } = useStudioMotion();
  const [active, setActive] = useState(initialStage),
    [manual, setManual] = useState(false),
    [visible, setVisible] = useState(false),
    [hover, setHover] = useState(false),
    [focused, setFocused] = useState(false),
    [documentVisible, setDocumentVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (ref.current) io.observe(ref.current);
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const motionAllowed = !paused && !reduced && visible && documentVisible;
  const playing = motionAllowed && !manual && !hover && !focused;
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % count), delay);
    return () => clearInterval(timer);
  }, [playing, count, delay]);
  return {
    active,
    playing,
    motionAllowed,
    ref,
    manual,
    choose: (index: number) => {
      setActive(index);
      setManual(true);
    },
    resume: () => setManual(false),
    setHover,
    setFocused,
  };
}
