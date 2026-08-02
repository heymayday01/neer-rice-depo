"use client";

import type { Variants } from "framer-motion";

/**
 * iOS 26 Motion Foundation
 * Spring physics calibrated to Apple's design language —
 * natural deceleration, subtle overshoot, tactile feedback.
 */

export const EASE = {
  /** iOS signature ease-out — smooth deceleration */
  out: [0.16, 1, 0.3, 1] as const,
  /** Soft ease — gentle, almost linear finish */
  soft: [0.33, 1, 0.68, 1] as const,
  /** In-out — symmetric acceleration/deceleration */
  io: [0.65, 0, 0.35, 1] as const,
  /** iOS spring curve — slight overshoot */
  spring: [0.34, 1.56, 0.64, 1] as const,
};

export const SPRING = {
  /** Snappy — buttons, taps, quick UI (responsive, minimal overshoot) */
  snappy: { type: "spring" as const, stiffness: 500, damping: 35, mass: 0.7 },
  /** Gentle — content reveals, section transitions (smooth, natural) */
  gentle: { type: "spring" as const, stiffness: 200, damping: 28, mass: 0.9 },
  /** Bouncy — badges, cart count, playful elements (slight overshoot) */
  bouncy: { type: "spring" as const, stiffness: 400, damping: 20, mass: 0.6 },
  /** Drawer — bottom sheets, cart drawer (heavier, more controlled) */
  drawer: { type: "spring" as const, stiffness: 350, damping: 40, mass: 1 },
  /** Dock — tab bar indicator (fast, precise) */
  dock: { type: "spring" as const, stiffness: 500, damping: 35, mass: 0.6 },
};

export const DURATION = {
  fast: 0.25,
  base: 0.45,
  slow: 0.6,
};

/** Pure fade — overlays, text swaps */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.soft } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } },
};

/** Slide-up swap — tab content, selectors */
export const swapUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE.out } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE.soft } },
};

/** Stagger container */
export const staggerContainer = (stagger = 0.05, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Overlay backdrop */
export const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.soft } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.soft } },
};

/** Hover lift — subtle, iOS-like elevation */
export const hoverLift = {
  y: -4,
  transition: SPRING.snappy,
};

/** Tap press — tactile feedback */
export const tapPress = {
  scale: 0.96,
  transition: SPRING.snappy,
};

/** Blur + rise — hero signature reveal */
export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE.out },
  },
};

/** Clean rise — scroll-triggered section reveals */
export const cleanRise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.out },
  },
};

/** Image crossfade */
export const imageCrossfade: Variants = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE.out },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    transition: { duration: 0.35, ease: EASE.soft },
  },
};
