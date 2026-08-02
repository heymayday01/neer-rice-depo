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
  MapPin,
  Clock,
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
  { riceName: string; origin: string; water: string; catId: string; image: string; grain: string; cookTime: string }
> = {
  biryani: {
    riceName: "Royal 1121 Basmati",
    origin: "Punjab",
    water: "1 : 2.0",
    catId: "aromatic",
    image: "/rice/basmati-1121.jpg",
    grain: "Extra Long",
    cookTime: "12 min",
  },
  curry: {
    riceName: "Sona Masoori",
    origin: "Karnataka",
    water: "1 : 2.5",
    catId: "daily",
    image: "/rice/sona-masoori.jpg",
    grain: "Medium",
    cookTime: "15 min",
  },
  diabetic: {
    riceName: "Black Kavuni",
    origin: "Tamil Nadu",
    water: "1 : 3.0",
    catId: "superfood",
    image: "/rice/black-kavuni.jpg",
    grain: "Short",
    cookTime: "35 min",
  },
  khichdi: {
    riceName: "Indrayani",
    origin: "Maharashtra",
    water: "1 : 3.5",
    catId: "heritage",
    image: "/rice/indrayani.jpg",
    grain: "Medium",
    cookTime: "18 min",
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
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero section"
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
    >
      {/* ===== Immersive photography — full-bleed, parallax + scale ===== */}
      <motion.div
        style={{ y: reduced ? 0 : imageY, scale: reduced ? 1 : imageScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/hero-bg-clean.jpg"
          alt="Organic rice grains from Indian farming cooperatives"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient — dark at top (for navbar + headline readability) and bottom (for card) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1410] via-[#0f1410]/50 to-[#0f1410]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1410]/70 via-transparent to-transparent" />
      </motion.div>

      {/* ===== Content — editorial layout, top-anchored ===== */}
      <motion.div
        style={{ opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8"
      >
        {/* Top section — headline + intro */}
        <div className="flex flex-col max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.out as unknown as number[], delay: 0.1 }}
            className="flex items-center gap-2.5 mb-4 sm:mb-6"
          >
            <span className="h-px w-6 bg-[#d4a373]/60" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] text-[#d4a373]">
              Farm-Direct · Heirloom · Aged
            </span>
          </motion.div>

          {/* Headline — bold + light italic contrast */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE.out as unknown as number[], delay: 0.2 }}
            className="font-serif font-bold leading-[1.08] tracking-tight text-white text-[2.25rem] sm:text-[3.5rem] lg:text-[4.5rem] mb-4 sm:mb-6"
          >
            Heritage grains,
            <br />
            <span className="text-[#d4a373] font-light italic">delivered direct.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.out as unknown as number[], delay: 0.35 }}
            className="text-sm sm:text-lg text-stone-300/70 leading-relaxed max-w-md font-light mb-6 sm:mb-8"
          >
            Unpolished, single-origin rice from verified organic cooperatives.
            No middlemen. No polish. Just grain.
          </motion.p>

          {/* Stats row — trust signals inline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.out as unknown as number[], delay: 0.45 }}
            className="flex items-center gap-5 sm:gap-7 mb-8"
          >
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl text-white block leading-none">10+</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">Grain varieties</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl text-white block leading-none">4</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">Indian states</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#d4a373] block leading-none">100%</span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">Organic</span>
            </div>
          </motion.div>
        </div>

        {/* ===== Bottom section — featured grain card + selector ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE.out as unknown as number[], delay: 0.55 }}
        >
          {/* Meal selector — minimal pills */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 shrink-0 mr-1 hidden sm:block">
              Cook for:
            </span>
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
                      : "text-stone-400 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Featured grain card — liquid glass, integrated */}
          <div
            className="rounded-[20px] overflow-hidden border border-white/8"
            style={{
              background: "rgba(20, 26, 21, 0.5)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 8px 32px -4px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex gap-4 p-3 sm:p-4">
              {/* Image — rounded, medium */}
              <div className="relative w-24 sm:w-32 h-24 sm:h-32 shrink-0 rounded-[14px] overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1410]/40 to-transparent pointer-events-none" />
              </div>

              {/* Info — editorial */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={rec.riceName}
                      variants={swapUp}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {/* Origin badge */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MapPin className="w-3 h-3 text-[#d4a373]" strokeWidth={2} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#d4a373]">
                          {rec.origin}
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[9px] font-medium uppercase tracking-wider text-stone-500">
                          {rec.grain}
                        </span>
                      </div>

                      {/* Rice name */}
                      <h3 className="font-serif font-bold text-white text-base sm:text-xl leading-tight">
                        {rec.riceName}
                      </h3>

                      {/* Specs — water + cook time */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-[#d4a373]" />
                          <span className="font-mono">{rec.water}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#d4a373]" />
                          {rec.cookTime}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Explore link */}
                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectCategory(rec.catId)}
                  className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#d4a373] transition-colors cursor-pointer mt-2 min-h-[32px]"
                >
                  Explore this grain
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Actions — text links, separated by border */}
          <div className="flex items-center gap-5 sm:gap-6 mt-5 pt-5 border-t border-white/8">
            <motion.button
              whileHover={hoverLift}
              whileTap={tapPress}
              onClick={onOpenAISommelier}
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#d4a373] transition-colors cursor-pointer min-h-[44px]"
            >
              <Leaf className="w-4 h-4 text-[#d4a373]" />
              <span className="hidden sm:inline">AI Grain Sommelier</span>
              <span className="sm:hidden">Sommelier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileHover={hoverLift}
              whileTap={tapPress}
              onClick={onOpenComparison}
              className="flex items-center gap-2 text-sm font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer min-h-[44px]"
            >
              <span className="hidden sm:inline">Compare Grains</span>
              <span className="sm:hidden">Compare</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
