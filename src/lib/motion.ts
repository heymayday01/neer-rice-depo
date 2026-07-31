"use client";

import type { Transition, Variants } from "framer-motion";

/**
 * Neer Rice Depo — Motion Foundation
 * 2026-trending: spring physics, snappy easings, no heavy per-frame blur.
 * Deep-cleaned: only exports that are actually used across the app.
 */

/* Easings — modern, slightly overshooting decelerations */
export const EASE = {
  out: [0.22, 1, 0.36, 1] as const,
  soft: [0.33, 1, 0.68, 1] as const,
  io: [0.65, 0, 0.35, 1] as const,
  anticipate: [0.34, 1.56, 0.64, 1] as const,
};

/* Spring presets — physics-based, lively */
export const SPRING = {
  snappy: { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.8 },
  gentle: { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.9 },
  bouncy: { type: "spring" as const, stiffness: 360, damping: 18, mass: 0.7 },
  drawer: { type: "spring" as const, stiffness: 300, damping: 38, mass: 1 },
  dock: { type: "spring" as const, stiffness: 500, damping: 38, mass: 0.7 },
};

/* Duration presets (seconds) */
export const DURATION = {
  fast: 0.28,
  base: 0.5,
  slow: 0.7,
};

/* Reusable variants — only the ones used in the app */

/** Fade + rise — default reveal. Cheap (no blur), modern. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.out } },
};

/** Fade + rise + subtle scale — for cards / images. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE.out } },
};

/** Pure fade — for overlays / text swaps. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.soft } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } },
};

/** Slide-up swap — for tab content / meal selector. */
export const swapUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.out } },
  exit: { opacity: 0, y: -10, transition: { duration: DURATION.fast, ease: EASE.soft } },
};

/** Stagger container — children orchestration */
export const staggerContainer = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Overlay backdrop. */
export const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.soft } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } },
};

/** Hover lift — for cards (use with whileHover). */
export const hoverLift = {
  y: -6,
  transition: SPRING.snappy,
};

/** Tap press — tactile feedback. */
export const tapPress = {
  scale: 0.97,
  transition: SPRING.snappy,
};

/* ============================================================
   SIGNATURE REVEAL VARIANTS — used sparingly for impact.
   ============================================================ */

/** Blur + rise — the signature hero reveal. */
export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE.out },
  },
};

/** Clean rise — opacity + translateY only (no blur). */
export const cleanRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.out },
  },
};

/** Image crossfade — smooth opacity + scale, no blur, no shimmer. */
export const imageCrossfade: Variants = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE.out },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    transition: { duration: 0.4, ease: EASE.soft },
  },
};
