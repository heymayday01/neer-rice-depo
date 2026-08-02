"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Wheat,
  BrainCircuit,
  ArrowRight,
  Compass,
  Droplets,
  Leaf,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Sprout,
} from "lucide-react";
import {
  SPRING,
  swapUp,
  hoverLift,
  tapPress,
  cleanRise,
  imageCrossfade,
  staggerContainer,
  EASE,
} from "@/lib/motion";
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
  { riceName: string; tagline: string; water: string; catId: string; image: string }
> = {
  biryani: {
    riceName: "Royal 1121 Basmati",
    tagline: "24-Month Aging · 8.3mm Grain",
    water: "1 : 2.0",
    catId: "aromatic",
    image: "/rice/basmati-1121.jpg",
  },
  curry: {
    riceName: "Sona Masoori",
    tagline: "Light Staple · Karnataka Paddy",
    water: "1 : 2.5",
    catId: "daily",
    image: "/rice/sona-masoori.jpg",
  },
  diabetic: {
    riceName: "Black Kavuni Rice",
    tagline: "Low GI (42) · 10× Antioxidants",
    water: "1 : 3.0",
    catId: "superfood",
    image: "/rice/black-kavuni.jpg",
  },
  khichdi: {
    riceName: "Indrayani Rice",
    tagline: "Sticky & Fragrant · Gentle",
    water: "1 : 3.5",
    catId: "heritage",
    image: "/rice/indrayani.jpg",
  },
};

const MEAL_TABS: { id: Meal; label: string }[] = [
  { id: "biryani", label: "Biryani" },
  { id: "curry", label: "Curry" },
  { id: "diabetic", label: "Low GI" },
  { id: "khichdi", label: "Khichdi" },
];

const PILLARS = [
  { icon: Sprout, title: "Farm-Direct", desc: "Zero middlemen" },
  { icon: ShieldCheck, title: "Naturally Aged", desc: "9–24 months" },
  { icon: Truck, title: "Express Delivery", desc: "Pan-India" },
  { icon: HeartHandshake, title: "Bulk Savings", desc: "Up to 10% off" },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE.out as unknown as number[] },
  },
};

const headlineItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.out as unknown as number[] },
  },
};

export function Hero({ onOpenAISommelier, onSelectCategory, onOpenComparison }: HeroProps) {
  const [meal, setMeal] = useState<Meal>("biryani");
  const rec = MEALS[meal];
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero section"
      className="relative overflow-hidden min-h-[100svh] flex flex-col"
    >
      {/* Background — immersive grain photography with depth gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg-clean.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Depth gradients — darker on edges for content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1410]/90 via-[#0f1410]/70 to-[#0f1410]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1410]/80 via-transparent to-[#0f1410]/40" />
      </div>

      {/* Content — vertically centered, proper spacing */}
      <motion.div
        style={{ opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10"
      >
        <motion.div
          variants={container}
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left — content */}
          <div className="space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <motion.div variants={fadeUpItem} className="flex items-center gap-3">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE.out as unknown as number[] }}
                className="h-px w-8 bg-[#d4a373]/60 origin-left"
              />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#d4a373]">
                Farm-Direct · Heirloom · Aged
              </span>
            </motion.div>

            {/* Headline — responsive, no overlap */}
            <h1 className="font-serif font-bold leading-[1.05] tracking-tight text-white text-[2rem] sm:text-[3.5rem] lg:text-[4.5rem]">
              <motion.span variants={headlineItem} className="block">
                Pristine Indian
              </motion.span>
              <motion.span
                variants={headlineItem}
                className="block italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#d4a373] to-[#e9c89a]"
              >
                Organic Grains
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              variants={fadeUpItem}
              className="text-sm sm:text-lg text-stone-300/80 leading-relaxed max-w-lg font-light"
            >
              Unpolished, single-origin heirloom rice and naturally aged Basmati —
              sourced directly from verified organic cooperatives across India.
            </motion.p>

            {/* CTAs — full-width on mobile, inline on desktop */}
            <motion.div
              variants={fadeUpItem}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="btn-primary-glow px-6 py-4 bg-gradient-to-br from-[#1f431e] to-[#142a12] text-white font-bold rounded-full text-sm flex items-center justify-center gap-2.5 cursor-pointer min-h-[52px]"
              >
                <BrainCircuit className="w-4 h-4 text-[#d4a373]" strokeWidth={1.5} />
                <span>Ask AI Sommelier</span>
                <ArrowRight className="w-4 h-4 text-[#d4a373]" />
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenComparison}
                className="px-6 py-4 text-white font-bold rounded-full text-sm border border-white/15 hover:border-white/30 hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer min-h-[52px] transition-all"
              >
                <Compass className="w-4 h-4" />
                Compare Grains
              </motion.button>
            </motion.div>
          </div>

          {/* Right — featured grain card (mobile + desktop) */}
          <motion.div
            variants={fadeUpItem}
            className="relative"
          >
            {/* Glass card with featured rice */}
            <div className="relative rounded-[24px] overflow-hidden border border-white/8 shadow-2xl" style={{
              background: "rgba(20, 26, 21, 0.4)",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
            }}>
              {/* Image */}
              <div className="relative h-[280px] sm:h-[340px] lg:h-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={rec.image}
                    variants={imageCrossfade}
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1410] via-[#0f1410]/30 to-transparent pointer-events-none" />
              </div>

              {/* Card content */}
              <div className="p-5 space-y-4">
                {/* Rice name + tagline */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a373] block mb-1">
                    Featured Grain
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={rec.riceName}
                      variants={swapUp}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="font-serif font-bold text-white text-xl sm:text-2xl leading-tight">
                        {rec.riceName}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1">{rec.tagline}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Meal selector — compact pills */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wheat className="w-3.5 h-3.5 text-[#d4a373]" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Select your grain
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MEAL_TABS.map((m) => {
                      const selected = meal === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setMeal(m.id)}
                          aria-pressed={selected}
                          aria-label={`Select ${m.label} grain type`}
                          className={`relative py-2 px-3.5 rounded-full text-[11px] font-bold cursor-pointer transition-all min-h-[40px] ${
                            selected
                              ? "text-white bg-[#1f431e] border border-[#d4a373]/30"
                              : "text-stone-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.03]"
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Water ratio + explore */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/8">
                  <span className="flex items-center gap-1.5 text-xs font-mono text-[#d4a373]">
                    <Droplets className="w-3.5 h-3.5" />
                    Water {rec.water}
                  </span>
                  <motion.button
                    whileHover={hoverLift}
                    whileTap={tapPress}
                    onClick={() => onSelectCategory(rec.catId)}
                    className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#d4a373] flex items-center gap-1.5 cursor-pointer min-h-[36px] py-1 transition-colors"
                  >
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Floating leaf badge */}
            <motion.div
              animate={reduced ? {} : { rotate: [0, 8, 0], y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-[#1f431e] to-[#142a12] text-white flex items-center justify-center shadow-xl border-2 border-[#0f1410] z-20"
            >
              <Leaf className="w-5 h-5 text-[#d4a373]" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Value pillars — bottom strip */}
        <motion.div
          variants={staggerContainer(0.07, 0.6)}
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 sm:mt-16 pt-6 border-t border-white/8"
        >
          {PILLARS.map((p) => (
            <motion.div key={p.title} variants={cleanRise} className="flex flex-col gap-1.5">
              <p.icon className="w-4 h-4 text-[#d4a373] mb-0.5" strokeWidth={1.5} />
              <h4 className="text-xs font-bold text-white tracking-wide">{p.title}</h4>
              <p className="text-[10px] text-stone-400 tracking-wide">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={reduced ? {} : { y: [0, 6, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
