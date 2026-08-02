"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Droplets,
  Leaf,
  Wheat,
  ChevronRight,
} from "lucide-react";
import { SPRING, swapUp, hoverLift, tapPress, EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SmartImage } from "./smart-image";

interface HeroProps {
  onOpenAISommelier: () => void;
  onSelectCategory: (cat: string) => void;
  onOpenComparison: () => void;
}

type Meal = "biryani" | "curry" | "diabetic" | "khichdi";

const MEALS: Record<
  Meal,
  { riceName: string; origin: string; water: string; catId: string; image: string; grain: string }
> = {
  biryani: {
    riceName: "Royal 1121 Basmati",
    origin: "Punjab foothills",
    water: "1 : 2.0",
    catId: "aromatic",
    image: "/rice/basmati-1121.jpg",
    grain: "Extra Long",
  },
  curry: {
    riceName: "Sona Masoori",
    origin: "Karnataka",
    water: "1 : 2.5",
    catId: "daily",
    image: "/rice/sona-masoori.jpg",
    grain: "Medium",
  },
  diabetic: {
    riceName: "Black Kavuni",
    origin: "Tamil Nadu",
    water: "1 : 3.0",
    catId: "superfood",
    image: "/rice/black-kavuni.jpg",
    grain: "Short",
  },
  khichdi: {
    riceName: "Indrayani",
    origin: "Maharashtra",
    water: "1 : 3.5",
    catId: "heritage",
    image: "/rice/indrayani.jpg",
    grain: "Medium",
  },
};

const MEAL_TABS: { id: Meal; label: string }[] = [
  { id: "biryani", label: "Biryani" },
  { id: "curry", label: "Curry" },
  { id: "diabetic", label: "Low GI" },
  { id: "khichdi", label: "Khichdi" },
];

export function Hero({ onOpenAISommelier, onSelectCategory, onOpenComparison }: HeroProps) {
  const [meal, setMeal] = useState<Meal>("biryani");
  const rec = MEALS[meal];
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero section"
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
    >
      {/* ===== Immersive photography — full-bleed, parallax ===== */}
      <motion.div
        style={{ y: reduced ? 0 : imageY }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/hero-bg-clean.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Warm gradient — not a harsh dark overlay, but a soft fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1410]/60 via-[#0f1410]/40 to-[#0f1410]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1410]/50 via-transparent to-transparent" />
      </motion.div>

      {/* ===== Content — editorial layout ===== */}
      <motion.div
        style={{ opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6"
      >
        {/* Top section — headline + intro (left-aligned, editorial) */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          {/* Eyebrow — minimal, just text + line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.out as unknown as number[], delay: 0.1 }}
            className="flex items-center gap-2.5 mb-5"
          >
            <span className="h-px w-6 bg-[#d4a373]/50" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.3em] text-[#d4a373]/80">
              Farm-Direct · Heirloom · Aged
            </span>
          </motion.div>

          {/* Headline — large, confident, no gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE.out as unknown as number[], delay: 0.2 }}
            className="font-serif font-bold leading-[1.1] tracking-tight text-white text-[2.25rem] sm:text-[3.5rem] lg:text-[4.5rem] mb-5"
          >
            Heritage grains,
            <br />
            <span className="text-stone-300/70 font-light italic">delivered direct.</span>
          </motion.h1>

          {/* Description — short, punchy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.out as unknown as number[], delay: 0.35 }}
            className="text-sm sm:text-base text-stone-300/60 leading-relaxed max-w-md font-light mb-8"
          >
            Unpolished, single-origin rice from verified organic cooperatives.
            No middlemen. No polish. Just grain.
          </motion.p>
        </div>

        {/* ===== Bottom section — featured grain card + selector ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE.out as unknown as number[], delay: 0.5 }}
        >
          {/* Meal selector — horizontal scroll, minimal pills */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4">
            {MEAL_TABS.map((m) => {
              const selected = meal === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMeal(m.id)}
                  aria-pressed={selected}
                  className={`shrink-0 py-2 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[40px] ${
                    selected
                      ? "bg-white text-[#0f1410]"
                      : "text-stone-400 hover:text-white border border-white/10"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Featured grain card — editorial, not boxy */}
          <div className="flex gap-4 items-stretch">
            {/* Image — rounded, tall */}
            <div className="relative w-28 sm:w-36 shrink-0 rounded-[16px] overflow-hidden border border-white/8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={rec.image}
                  variants={swapUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <SmartImage
                    src={rec.image}
                    alt={rec.riceName}
                    className="w-full h-full"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1410]/60 to-transparent pointer-events-none" />
            </div>

            {/* Info — clean, editorial */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={rec.riceName}
                    variants={swapUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4a373]">
                        {rec.grain}
                      </span>
                      <span className="text-stone-600">·</span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-stone-500">
                        {rec.origin}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-white text-lg sm:text-xl leading-tight">
                      {rec.riceName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-stone-400">
                      <Droplets className="w-3 h-3 text-[#d4a373]" />
                      <span className="font-mono">{rec.water}</span>
                      <span className="text-stone-600 mx-1">·</span>
                      <Wheat className="w-3 h-3 text-[#d4a373]" />
                      <span>Cook 15 min</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Explore link — text link, not a button */}
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategory(rec.catId)}
                className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#d4a373] transition-colors cursor-pointer mt-2 min-h-[36px]"
              >
                Explore this grain
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Actions — two clean links, not boxy buttons */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/8">
            <motion.button
              whileHover={hoverLift}
              whileTap={tapPress}
              onClick={onOpenAISommelier}
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#d4a373] transition-colors cursor-pointer min-h-[44px]"
            >
              <Leaf className="w-4 h-4 text-[#d4a373]" />
              AI Grain Sommelier
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileHover={hoverLift}
              whileTap={tapPress}
              onClick={onOpenComparison}
              className="flex items-center gap-2 text-sm font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer min-h-[44px]"
            >
              Compare
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
