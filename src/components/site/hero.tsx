"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Wheat,
  BrainCircuit,
  ShieldCheck,
  Truck,
  Sprout,
  HeartHandshake,
  ArrowRight,
  Compass,
  Leaf,
  Droplets,
} from "lucide-react";
import {
  SPRING,
  swapUp,
  hoverLift,
  tapPress,
  cleanRise,
  imageCrossfade,
  staggerContainer,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

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

// Framer Motion entrance variants — precisely timed, no GSAP needed
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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const headlineItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const imageItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 },
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
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero section"
      className="relative overflow-hidden min-h-[100svh]"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg-clean.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c08]/85 via-[#080c08]/65 to-[#080c08]/97" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c08]/90 via-[#080c08]/50 to-[#080c08]/70" />
      </div>

      {/* Rice-grain ambient particles — atmospheric depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => {
          const left = (i * 7.3 + 5) % 95;
          const delay = (i * 1.7) % 9;
          const dur = 9 + (i % 5) * 2.5;
          const dx = ((i % 3) - 1) * 30;
          const dy = -80 - (i % 4) * 25;
          const size = 2 + (i % 3);
          return (
            <span
              key={i}
              className="grain-particle"
              style={{
                left: `${left}%`,
                bottom: "10%",
                width: size,
                height: size * 1.6,
                borderRadius: "50%",
                background: i % 4 === 0 ? "rgba(212,163,115,0.6)" : "rgba(163,196,160,0.4)",
                ["--dx" as string]: `${dx}px`,
                ["--dy" as string]: `${dy}px`,
                ["--dur" as string]: `${dur}s`,
                ["--delay" as string]: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-16 min-h-[100svh] flex flex-col justify-center"
      >
        <motion.div
          variants={container}
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
        >
          {/* Left */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Eyebrow */}
            <motion.div
              variants={fadeUpItem}
              className="flex items-center gap-3"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-10 bg-[#d4a373]/60 origin-left"
              />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                Farm-Direct · Heirloom · Aged
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-serif font-bold leading-[0.95] tracking-tight text-white text-[2.5rem] xs:text-[3rem] sm:text-[4.5rem] lg:text-[5.5rem]">
              <motion.span variants={headlineItem} className="block">
                Pristine Indian
              </motion.span>
              <motion.span
                variants={headlineItem}
                className="block italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#d4a373] via-[#d4a373] to-[#d4a373]"
              >
                Organic Grains
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              variants={fadeUpItem}
              className="text-sm sm:text-base text-stone-300/90 leading-relaxed max-w-xl tracking-wide font-light"
            >
              Unpolished, single-origin heirloom rice and naturally aged Basmati —
              sourced directly from verified organic cooperatives across Karnataka,
              Maharashtra, Bengal &amp; Tamil Nadu.
            </motion.p>

            {/* Meal selector */}
            <motion.div variants={fadeUpItem} className="space-y-3">
              <div className="flex items-center gap-3">
                <Wheat className="w-3.5 h-3.5 text-[#d4a373]" strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
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
                      className={`relative py-2.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-all min-h-[44px] ${
                        selected
                          ? "text-white border border-[#d4a373]/60 bg-[#d4a373]/10"
                          : "text-stone-400 hover:text-white border border-white/12 hover:border-white/25"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="meal-pill"
                          transition={SPRING.dock}
                          className="absolute inset-0 rounded-full"
                          style={{ boxShadow: "inset 0 0 0 1px rgba(212,163,115,0.4)" }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {selected && <span className="w-1 h-1 rounded-full bg-[#d4a373]" />}
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={meal}
                  variants={swapUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-between gap-4 pt-3 border-t border-white/10"
                >
                  <div className="min-w-0">
                    <span className="font-serif font-bold text-white block text-base sm:text-lg truncate">
                      {rec.riceName}
                    </span>
                    <span className="text-stone-400 text-[11px] tracking-wide">
                      {rec.tagline}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#d4a373]">
                      <Droplets className="w-3 h-3" />
                      {rec.water}
                    </span>
                    <motion.button
                      whileHover={hoverLift}
                      whileTap={tapPress}
                      onClick={() => onSelectCategory(rec.catId)}
                      className="text-[11px] font-bold uppercase tracking-wider text-white hover:text-[#d4a373] transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px] py-1"
                    >
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUpItem} className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="btn-primary-glow px-5 sm:px-7 py-3.5 bg-gradient-to-br from-[#1f431e] to-[#1f431e] hover:from-[#1f431e] hover:to-[#1f431e] text-white font-bold rounded-full text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4 text-[#d4a373] group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
                <span className="sm:hidden">Ask AI Sommelier</span>
                <span className="hidden sm:inline">Ask AI Grain Sommelier</span>
                <ArrowRight className="w-4 h-4 text-[#d4a373] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenComparison}
                className="px-5 py-3.5 text-white font-bold rounded-full text-sm tracking-wide border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Compare Grains
              </motion.button>
            </motion.div>
          </div>

          {/* Right — desktop glass panel */}
          <motion.div variants={imageItem} className="hidden lg:block lg:col-span-5">
            <HeroGlassPanel rec={rec} reduced={reduced} />
          </motion.div>
        </motion.div>

        {/* Value pillars */}
        <motion.div
          variants={staggerContainer(0.07, 0.8)}
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-8 sm:mt-14 pt-6 border-t border-white/10"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.title}
              variants={cleanRise}
              className="flex flex-col gap-2"
            >
              <p.icon className="w-5 h-5 text-[#d4a373] mb-1" strokeWidth={1.5} />
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">{p.title}</h4>
              <p className="text-[10px] sm:text-[11px] text-stone-400 tracking-wide">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={reduced ? {} : { y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ===== Floating glass panel — desktop right side ===== */
function HeroGlassPanel({
  rec,
  reduced,
}: {
  rec: { riceName: string; tagline: string; water: string; image: string };
  reduced: boolean;
}) {
  return (
    <div className="relative">
      <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/15 backdrop-blur-2xl bg-white/5">
        <div className="relative h-[420px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={rec.image}
              src={rec.image}
              alt={rec.riceName}
              variants={imageCrossfade}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c08]/80 via-transparent to-[#080c08]/20" />

          {/* Seal */}
          <div className="absolute top-5 left-5 flex items-center gap-2.5 bg-[#080c08]/80 backdrop-blur-md rounded-full pl-1.5 pr-4 py-1.5 border border-[#d4a373]/20 shadow-lg">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#0f1a0d] to-[#080c08] border border-[#d4a373]/15">
              <img
                src="/neer-logo-premium.png"
                alt="Neer Rice Depo certified seal"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d4a373] block leading-none">
                Certified
              </span>
              <p className="text-[11px] font-bold font-serif text-white leading-tight">
                Organic Depo
              </p>
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4a373] block mb-1">
              Featured
            </span>
            <h3 className="font-serif font-bold text-white text-2xl leading-tight">
              {rec.riceName}
            </h3>
            <p className="text-[11px] text-stone-300 tracking-wide mt-0.5">{rec.tagline}</p>
          </div>
        </div>
      </div>

      {/* Floating leaf */}
      <motion.div
        animate={reduced ? {} : { rotate: [0, 8, 0], y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-5 -right-3 w-14 h-14 rounded-full bg-gradient-to-br from-[#1f431e] to-[#1f431e] text-white flex items-center justify-center shadow-xl border-4 border-[#080c08] z-20"
      >
        <Leaf className="w-6 h-6 text-[#d4a373]" />
      </motion.div>
    </div>
  );
}
