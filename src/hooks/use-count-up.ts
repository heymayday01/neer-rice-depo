"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * Animates a number from 0 → target when `active` is true.
 * Uses requestAnimationFrame with easeOutExpo for a premium count-up.
 * Respects prefers-reduced-motion (instant snap via rAF with 0 duration).
 */
export function useCountUp(target: number, active: boolean, duration = 1400): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const effectiveDuration = reduced ? 0 : duration;
    let start: number | null = null;
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const progress = effectiveDuration === 0 ? 1 : Math.min(elapsed / effectiveDuration, 1);
      setValue(Math.round(target * easeOutExpo(progress)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, active, duration, reduced]);

  return value;
}
