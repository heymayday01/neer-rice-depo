"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import {
  EASE,
  DURATION,
  SPRING,
  fadeUp,
  fadeRise,
  staggerContainer,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  /** Use scale-aware rise (cards/images). Defaults to plain fadeUp. */
  variant?: "fadeUp" | "fadeRise";
}

/**
 * Single-element scroll reveal. Cheap (opacity + transform, no blur).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  once = true,
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const base = variant === "fadeRise" ? fadeRise : fadeUp;

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: DURATION.fast } },
      }
    : {
        hidden: base.hidden,
        visible: { ...base.visible, transition: { ...base.visible.transition, delay } },
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

/**
 * Stagger orchestrator. Wrap <StaggerItem> children inside.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0,
  once = true,
}: StaggerGroupProps) {
  const variants = staggerContainer(stagger, delayChildren);
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: "fadeUp" | "fadeRise";
}

export function StaggerItem({ children, className, variant = "fadeUp" }: StaggerItemProps) {
  const reduced = usePrefersReducedMotion();
  const base = variant === "fadeRise" ? fadeRise : fadeUp;
  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: DURATION.fast } } }
    : base;
  return <motion.div className={className} variants={variants}>{children}</motion.div>;
}

/**
 * Word-by-word headline reveal — a 2026 signature.
 * Splits text on spaces and staggers each word with a spring.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: { y: 0, opacity: 1, transition: SPRING.gentle },
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Convenience motion span for inline animated text. */
export function MotionText({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: DURATION.base, delay, ease: EASE.out } }}
      viewport={{ once: true }}
    >
      {children}
    </motion.span>
  );
}
