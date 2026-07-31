"use client";

import type { Transition, Variants } from "framer-motion";

/**
 * Neer Rice Depo — Motion Foundation
 * 2026-trending: spring physics, snappy easings, no heavy per-frame blur.
 */

/* Easings — modern, slightly overshooting decelerations */
export const EASE = {
  /** Snappy ease-out quintic — primary reveal easing */
  out: [0.22, 1, 0.36, 1] as const,
  /** Soft ease-out cubic — secondary / small elements */
  soft: [0.33, 1, 0.68, 1] as const,
  /** Ease-in-out for symmetric transitions (modals, tabs) */
  io: [0.65, 0, 0.35, 1] as const,
  /** Anticipation — for tactile buttons / cards */
  anticipate: [0.34, 1.56, 0.64, 1] as const,
};

/* Spring presets — physics-based, lively */
export const SPRING = {
  /** Snappy UI spring — buttons, taps, toggles */
  snappy: { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.8 },
  /** Gentle entrance spring — cards, sections */
  gentle: { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.9 },
  /** Bouncy emphasis — badges, highlights */
  bouncy: { type: "spring" as const, stiffness: 360, damping: 18, mass: 0.7 },
  /** Drawer / sheet spring — heavier, smooth (no overshoot) */
  drawer: { type: "spring" as const, stiffness: 300, damping: 38, mass: 1 },
  /** Dock / pill spring — quick, precise, no wobble */
  dock: { type: "spring" as const, stiffness: 500, damping: 38, mass: 0.7 },
};

/* Duration presets (seconds) — for non-spring tweens */
export const DURATION = {
  fast: 0.28,
  base: 0.5,
  slow: 0.7,
};

/* Shared transitions */
export const tReveal = (delay = 0): Transition => ({
  duration: DURATION.base,
  delay,
  ease: EASE.out,
});

export const tSpring = (preset: keyof typeof SPRING = "gentle"): Transition =>
  SPRING[preset];

/* Reusable variants */

/** Fade + rise — the default reveal. Cheap (no blur), modern. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: tReveal() },
};

/** Fade + rise + subtle scale — for cards / images. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: tReveal() },
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

/** Scale-in — for badges, pills, modals accents. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: SPRING.bouncy },
};

/** Dialog / modal content — spring-based, premium. */
export const dialogContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: SPRING.gentle },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: DURATION.fast, ease: EASE.io } },
};

/** Drawer panel — slides from right with spring. */
export const drawerPanel: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: SPRING.drawer },
  exit: { x: "100%", transition: { duration: DURATION.base, ease: EASE.io } },
};

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
   BLUR REVEAL VARIANTS — for hero & signature sections.
   Animated filter:blur is GPU-heavier, so use sparingly and
   only on hero/signature moments (per user request).
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

/** Blur + rise + scale — for hero images / feature cards. */
export const blurRevealScale: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE.out },
  },
};

/** Blur reveal with delay helper */
export const blurRevealAt = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, delay, ease: EASE.out },
  },
});

/** Scroll-triggered blur reveal (whileInView) variant config */
export const scrollBlurReveal = (delay = 0) => ({
  variants: blurRevealAt(delay),
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-80px" },
});
