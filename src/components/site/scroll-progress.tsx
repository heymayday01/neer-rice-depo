"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Scroll progress indicator — a thin gradient line fixed at the very top
 * of the viewport that fills as the user scrolls. App-like, premium 2026.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.5,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-[#1f431e] via-[#d4a373] to-[#f5d9b0] pointer-events-none"
      aria-hidden
    />
  );
}
