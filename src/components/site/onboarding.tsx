"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  BrainCircuit,
  Truck,
  Check,
  ArrowRight,
  X,
} from "lucide-react";
import { SPRING, EASE, DURATION } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface Step {
  id: number;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  image: string;
  icon: typeof Sprout;
  stat: { value: string; label: string };
}

const STEPS: Step[] = [
  {
    id: 0,
    eyebrow: "Step 01 · Sourcing",
    title: "From cooperatives",
    titleAccent: "to your kitchen",
    description:
      "Single-origin heirloom grains, sourced directly from verified organic farming cooperatives across Karnataka, Maharashtra, Bengal & Tamil Nadu.",
    image: "/rice/rajamudi.jpg",
    icon: Sprout,
    stat: { value: "82%", label: "goes back to farmers" },
  },
  {
    id: 1,
    eyebrow: "Step 02 · Craft",
    title: "Naturally aged",
    titleAccent: "& lab-tested",
    description:
      "Every grain is aged 9–24 months in temperature-controlled granaries, then lab-tested for purity — pesticide-free, unpolished, nutrient-dense.",
    image: "/rice/basmati-1121.jpg",
    icon: BrainCircuit,
    stat: { value: "24mo", label: "maximum aging" },
  },
  {
    id: 2,
    eyebrow: "Step 03 · Delivery",
    title: "Farm-direct",
    titleAccent: "to your doorstep",
    description:
      "Express pan-India shipping with live order tracking. Free delivery above ₹999. Your AI Grain Sommelier helps you pick the perfect variety.",
    image: "/rice/black-kavuni.jpg",
    icon: Truck,
    stat: { value: "24h", label: "express dispatch" },
  },
];

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const reduced = usePrefersReducedMotion();

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const haptic = useCallback((intensity: "light" | "medium" = "light") => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(intensity === "medium" ? [15, 30, 15] : 10);
      } catch {
        /* noop */
      }
    }
  }, []);

  const next = useCallback(() => {
    if (isLast) {
      haptic("medium");
      setCelebrating(true);
      setTimeout(() => onComplete(), 1600);
      return;
    }
    haptic("light");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [isLast, haptic, onComplete]);

  const skip = useCallback(() => {
    haptic("light");
    onSkip();
  }, [haptic, onSkip]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, skip]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.base, ease: EASE.soft }}
      className="fixed inset-0 z-[100] bg-[#0f1410] flex flex-col"
    >
      {/* Skip ghost button (top-right) */}
      <button
        onClick={skip}
        className="absolute top-4 right-4 z-30 px-4 py-2 text-stone-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[40px]"
        aria-label="Skip onboarding"
      >
        Skip
      </button>

      {/* Split-screen: top 60% visual, bottom 40% content */}
      <div className="flex flex-col h-full">
        {/* Visual — 60% */}
        <div className="relative h-[52%] sm:h-[58%] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: EASE.out }}
              className="absolute inset-0"
            >
              <img
                src={current.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f1410]/30 via-transparent to-[#0f1410]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1410] via-[#0f1410]/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Floating stat pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={SPRING.gentle}
              className="absolute top-6 left-6 glass-gold refract-edge rounded-2xl px-4 py-2.5 flex items-center gap-3"
            >
              <div className="text-2xl font-black font-serif text-[#d4a373]">
                {current.stat.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-300 leading-tight max-w-[80px]">
                {current.stat.label}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content — 40% */}
        <div className="flex-1 flex flex-col justify-between px-6 sm:px-10 pt-6 pb-8 max-w-2xl mx-auto w-full">
          <div className="flex-1">
            {/* Eyebrow */}
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE.out }}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a373] mb-3 flex items-center gap-2"
              >
                <current.icon className="w-3.5 h-3.5" />
                {current.eyebrow}
              </motion.p>
            </AnimatePresence>

            {/* Title with gradient text fill */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE.out }}
                className="font-serif font-bold text-3xl sm:text-5xl leading-[1.05] mb-4"
              >
                <span className="block text-white">{current.title}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d4a373] via-[#d4a373] to-[#d4a373]">
                  {current.titleAccent}
                </span>
              </motion.h2>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE.out }}
                className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-md"
              >
                {current.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Segmented progress bar + CTA */}
          <div className="space-y-5 mt-6">
            {/* Segmented progress (3 sections) */}
            <div className="flex gap-2">
              {STEPS.map((s, i) => {
                const active = i <= step;
                return (
                  <div
                    key={s.id}
                    className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scaleX: active ? 1 : 0,
                        opacity: active ? 1 : 0.3,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                        delay: i === step ? 0.1 : 0,
                      }}
                      style={{ originX: 0 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#d4a373] to-[#d4a373]"
                    />
                  </div>
                );
              })}
            </div>

            {/* CTA — fixed at bottom with safe-area */}
            <motion.button
              onClick={next}
              whileTap={{ scale: 0.97 }}
              transition={SPRING.snappy}
              className="relative w-full h-12 rounded-xl bg-gradient-to-br from-[#1f431e] to-[#1f431e] hover:from-[#1f431e] hover:to-[#1f431e] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1f431e]/30 transition-colors cursor-pointer overflow-hidden"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <AnimatePresence mode="wait">
                {celebrating ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <CelebrationCheck />
                    Welcome to Neer
                  </motion.span>
                ) : isLast ? (
                  <motion.span
                    key="start"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 text-[#d4a373]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="next"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 text-[#d4a373]" />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Pulse ring on last step */}
              {isLast && !celebrating && (
                <motion.span
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-xl border-2 border-[#d4a373] pointer-events-none"
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrating && <CelebrationOverlay reduced={reduced} />}
      </AnimatePresence>
    </motion.div>
  );
}

/** Self-drawing checkmark (SVG stroke-dashoffset animation) */
function CelebrationCheck() {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="#d4a373"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.5, ease: EASE.out, delay: 0.1 },
          },
        }}
      />
    </motion.svg>
  );
}

/** Full-screen celebration burst on completion */
function CelebrationOverlay({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
    >
      {!reduced && (
        <>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const distance = 120 + (i % 3) * 40;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: [0, 1, 0.6],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.015,
                  ease: EASE.out,
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 3 === 0 ? "#d4a373" : i % 3 === 1 ? "#d4a373" : "#1f431e",
                }}
              />
            );
          })}
        </>
      )}
    </motion.div>
  );
}
