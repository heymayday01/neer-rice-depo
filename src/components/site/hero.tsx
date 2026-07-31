"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  Wheat, BrainCircuit,
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
  EASE,
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

export function Hero({ onOpenAISommelier, onSelectCategory, onOpenComparison }: HeroProps) {
  const [meal, setMeal] = useState<Meal>("biryani");
  const rec = MEALS[meal];
  const sectionRef = useRef<HTMLElement>(null);
  const heroRootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // GSAP timeline — staggered, breathing entrance
  useLayoutEffect(() => {
    if (reduced || !heroRootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.6 })
        .from(".hero-headline-line", { y: 30, opacity: 0, stagger: 0.12, duration: 0.9 }, "-=0.3")
        .from(".hero-desc", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-image-card", { y: 24, opacity: 0, scale: 0.98, duration: 1.0 }, "-=0.9")
        .from(".hero-selector", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-cta", { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.4")
        .from(".hero-pillar", { y: 18, opacity: 0, stagger: 0.06, duration: 0.5 }, "-=0.3");
    }, heroRootRef);
    return () => ctx.revert();
  }, [reduced]);

  // Scroll-linked content fade (lightweight — no parallax transforms to avoid jank)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[100svh]">
      {/* ===== Static cinematic background (no parallax — prevents jello jank) ===== */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg-clean.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Strong depth gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1209]/85 via-[#0a1209]/65 to-[#0a1209]/97" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1209]/90 via-[#0a1209]/50 to-[#0a1209]/70" />
      </div>

      {/* ===== Content layer ===== */}
      <motion.div
        ref={heroRootRef}
        style={{ opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 pb-12 lg:pb-20 min-h-[100svh] flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left — editorial content */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8">
            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center gap-3">
              <span className="h-px w-10 bg-[#d4a373]/60" />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                Farm-Direct · Heirloom · Aged
              </span>
            </div>

            {/* Headline — single serif voice, refined */}
            <h1 className="font-serif font-bold leading-[0.95] tracking-tight text-white text-[2.5rem] xs:text-[3rem] sm:text-[4.5rem] lg:text-[5.5rem]">
              <span className="hero-headline-line block">Pristine Indian</span>
              <span className="hero-headline-line block italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#d4a373] via-[#f5d9b0] to-[#d4a373]">
                Organic Grains
              </span>
            </h1>

            {/* Description — generous letter spacing, warm grey */}
            <p className="hero-desc text-sm sm:text-base text-stone-300/90 leading-relaxed max-w-xl tracking-wide font-light">
              Unpolished, single-origin heirloom rice and naturally aged Basmati —
              sourced directly from verified organic cooperatives across Karnataka,
              Maharashtra, Bengal &amp; Tamil Nadu.
            </p>

            {/* Meal selector — minimal, jewelry-like */}
            <div className="hero-selector space-y-3">
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
                      className={`relative py-2.5 px-4 rounded-full text-xs font-bold cursor-pointer transition-all min-h-[40px] ${
                        selected
                          ? "text-white border border-[#d4a373]/60 bg-[#d4a373]/10"
                          : "text-stone-400 hover:text-white border border-white/12 hover:border-white/25"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="meal-pill"
                          transition={SPRING.dock}
                          className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(212,163,115,0.25)]"
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

              {/* Selected grain — minimal text, no heavy badge */}
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
                    {/* Water ratio — minimal text, no background */}
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#d4a373]">
                      <Droplets className="w-3 h-3" />
                      {rec.water}
                    </span>
                    <motion.button
                      whileHover={hoverLift}
                      whileTap={tapPress}
                      onClick={() => onSelectCategory(rec.catId)}
                      className="text-[11px] font-bold uppercase tracking-wider text-white hover:text-[#d4a373] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTAs — primary glow + ghost secondary */}
            <div className="hero-cta flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="btn-primary-glow px-6 sm:px-7 py-4 bg-gradient-to-br from-[#1f431e] to-[#2d5a27] hover:from-[#16331a] hover:to-[#1f431e] text-white font-bold rounded-full text-sm tracking-wide transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4 text-[#e9c496] group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
                Ask AI Grain Sommelier
                <ArrowRight className="w-4 h-4 text-[#e9c496] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenComparison}
                className="px-6 py-4 text-white font-bold rounded-full text-sm tracking-wide border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Compare Grains
              </motion.button>
            </div>
          </div>

          {/* Right — floating glass info card (desktop) */}
          <div className="hidden lg:block lg:col-span-5">
            <HeroGlassPanel rec={rec} reduced={reduced} />
          </div>
        </div>

        {/* ===== Value pillars — minimal, hairline dividers ===== */}
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-4 gap-4 sm:gap-8 mt-14 sm:mt-20 pt-8 border-t border-white/10"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.title}
              variants={cleanRise}
              className="hero-pillar flex flex-col gap-2"
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
        animate={reduced ? {} : { y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
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
    <div className="hero-image-card relative">
      <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/15 backdrop-blur-2xl bg-white/5">
        {/* Image */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1209]/80 via-transparent to-[#0a1209]/20" />

          {/* Floating official seal — dark glass sticker */}
          <div className="absolute top-5 left-5 flex items-center gap-2.5 bg-[#0a1209]/80 backdrop-blur-md rounded-full pl-1.5 pr-4 py-1.5 border border-[#d4a373]/20 shadow-lg">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#1a2818] to-[#0a1209] border border-[#d4a373]/15">
              <img
                src="/neer-logo-premium.png"
                alt="Neer Rice Depo certified seal"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#d4a373] block leading-none">
                Certified
              </span>
              <p className="text-[11px] font-bold font-serif text-white leading-tight">
                Organic Depo
              </p>
            </div>
          </div>

          {/* Bottom — grain name, minimal */}
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

      {/* Floating leaf accent */}
      <motion.div
        animate={reduced ? {} : { rotate: [0, 8, 0], y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-5 -right-3 w-14 h-14 rounded-full bg-gradient-to-br from-[#1f431e] to-[#2d5a27] text-white flex items-center justify-center shadow-xl border-4 border-[#0a1209] z-20"
      >
        <Leaf className="w-6 h-6 text-[#e9c496]" />
      </motion.div>
    </div>
  );
}

function TrustMarquee() {
  const items = [
    "100% Organic Certified",
    "Naturally Aged 9–24 Months",
    "Zero Pesticide Residue",
    "Direct from Farmer Cooperatives",
    "GI-Tagged Heritage Grains",
    "Lab-Tested Purity",
    "Pan-India Express Delivery",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="relative border-t border-[#d4a373]/20 bg-[#1f431e] py-3 overflow-hidden">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e9c496]"
          >
            <Leaf className="w-3 h-3 text-[#d4a373]" />
            {item}
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1f431e] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1f431e] to-transparent pointer-events-none" />
    </div>
  );
}
