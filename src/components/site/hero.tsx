"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Sprout,
  HeartHandshake,
  ArrowRight,
  CloudSun,
  Compass,
  Leaf,
} from "lucide-react";
import {
  EASE,
  DURATION,
  SPRING,
  swapUp,
  staggerContainer,
  hoverLift,
  tapPress,
} from "@/lib/motion";
import { RevealText, StaggerGroup, StaggerItem } from "./reveal";

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
    riceName: "Royal 1121 Extra Long Basmati",
    tagline: "24-Month Natural Aging · 8.3mm Fluffy Grain",
    water: "1 : 2.0",
    catId: "aromatic",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=900",
  },
  curry: {
    riceName: "Single-Origin Unpolished Sona Masoori",
    tagline: "Light Digestible Staple · Karnataka Paddy",
    water: "1 : 2.5",
    catId: "daily",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=900",
  },
  diabetic: {
    riceName: "Karuppu Kavuni Organic Black Rice",
    tagline: "Low GI (42) · 10× Anthocyanin Antioxidants",
    water: "1 : 3.0",
    catId: "superfood",
    image:
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=900",
  },
  khichdi: {
    riceName: "Organic Maval Indrayani Rice",
    tagline: "Naturally Sticky & Fragrant · Gentle Digestion",
    water: "1 : 3.5",
    catId: "heritage",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=900",
  },
};

const MEAL_TABS: { id: Meal; label: string }[] = [
  { id: "biryani", label: "Biryani / Pulao" },
  { id: "curry", label: "Daily Curry" },
  { id: "diabetic", label: "Diabetic Low GI" },
  { id: "khichdi", label: "Khichdi / Soft" },
];

const PILLARS = [
  { icon: Sprout, title: "100% Farm-Direct", desc: "Zero middlemen, supporting smallholder farmers" },
  { icon: ShieldCheck, title: "Naturally Aged", desc: "Aged 9–24 months for low moisture & aroma" },
  { icon: Truck, title: "Express Delivery", desc: "Fast pan-India doorstep shipping" },
  { icon: HeartHandshake, title: "Bulk Savings", desc: "Save up to 10% on 10kg & 25kg bags" },
];

export function Hero({ onOpenAISommelier, onSelectCategory, onOpenComparison }: HeroProps) {
  const [meal, setMeal] = useState<Meal>("biryani");
  const rec = MEALS[meal];
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax — drives ambient layers + image depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-[#d4a373]/25">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#faf8f5]" />
      <div className="absolute inset-0 bg-dotgrid opacity-[0.12] pointer-events-none" />
      <motion.div
        style={{ y: blobY1 }}
        className="absolute -top-24 right-1/4 w-[28rem] h-[28rem] bg-[#d4a373]/12 rounded-full blur-[120px] pointer-events-none animate-gradient-drift"
      />
      <motion.div
        style={{ y: blobY2 }}
        className="absolute bottom-0 -left-10 w-[26rem] h-[26rem] bg-[#2d5a27]/10 rounded-full blur-[120px] pointer-events-none animate-gradient-drift-slow"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7 space-y-6">
            <StaggerGroup
              className="flex flex-wrap items-center gap-2"
              stagger={0.08}
              delayChildren={0.05}
            >
              <StaggerItem>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 text-[#1f431e] text-xs font-bold tracking-wide shadow-sm">
                  <Sprout className="w-4 h-4 text-[#1f431e]" />
                  100% Organically Cultivated · Direct Farm Depo
                </span>
              </StaggerItem>
              <StaggerItem>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c88a4a]/10 border border-[#c88a4a]/30 text-stone-700 text-[11px] font-bold">
                  <CloudSun className="w-3.5 h-3.5 text-[#1f431e]" />
                  Maval Paddy Field: 27°C · Organic Harvest
                </span>
              </StaggerItem>
            </StaggerGroup>

            <h1 className="font-brand font-black text-[#1f431e] leading-[1.05] tracking-wide uppercase text-3xl sm:text-5xl lg:text-[4.1rem]">
              <RevealText text="Neer Rice Depo" delay={0.15} />
              <span className="block font-serif italic text-stone-800 font-semibold text-2xl sm:text-4xl lg:text-5xl tracking-normal normal-case mt-4 mb-2">
                <RevealText text="Pristine Indian Organic" delay={0.4} />{" "}
                <span className="text-gold-shimmer">
                  <RevealText text="& Heirloom Grains" delay={0.6} />
                </span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, delay: 0.8, ease: EASE.out }}
              className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mt-6"
            >
              Authentic, unpolished, single-origin heirloom grains and naturally aged
              Basmati — sourced directly from verified organic farming cooperatives
              across Karnataka, Maharashtra, Bengal, and Tamil Nadu. Hand-sorted,
              pesticide-free, and aged naturally for rich aroma and effortless digestion.
            </motion.p>

            {/* Meal selector */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...SPRING.gentle, delay: 0.95 }}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-luxe space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1f431e] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c88a4a]" />
                  Interactive Quick Grain Selector
                </span>
                <span className="text-[10px] text-stone-500 font-bold hidden sm:block">
                  What are you cooking today?
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MEAL_TABS.map((m) => {
                  const selected = meal === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMeal(m.id)}
                      className={`relative py-2.5 px-2.5 rounded-xl text-xs font-bold text-center border cursor-pointer overflow-hidden ${
                        selected
                          ? "text-white border-[#1f431e]"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:border-[#1f431e]/40 hover:bg-white"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="meal-pill"
                          transition={SPRING.snappy}
                          className="absolute inset-0 bg-[#1f431e] shadow-sm"
                        />
                      )}
                      <span className="relative z-10">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2.5 border-t border-stone-200/80 min-h-[52px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={meal}
                    variants={swapUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center justify-between text-xs gap-3"
                  >
                    <div className="min-w-0">
                      <span className="font-serif font-bold text-stone-900 block text-sm truncate">
                        {rec.riceName}
                      </span>
                      <span className="text-stone-700 text-[11px] font-semibold">
                        {rec.tagline}
                      </span>
                    </div>
                    <motion.button
                      whileHover={hoverLift}
                      whileTap={tapPress}
                      onClick={() => onSelectCategory(rec.catId)}
                      className="px-3.5 py-1.5 bg-[#c88a4a]/15 hover:bg-[#c88a4a]/25 text-stone-900 font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1.5 border border-[#c88a4a]/30 cursor-pointer"
                    >
                      Explore Variety
                      <ArrowRight className="w-3.5 h-3.5 text-[#1f431e]" />
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING.gentle, delay: 1.05 }}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="shine-on-hover px-6 py-3.5 bg-[#1f431e] hover:bg-[#16331a] text-white font-bold rounded-xl text-sm shadow-md shadow-[#1f431e]/15 transition-colors flex items-center gap-2.5 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#e9c496] group-hover:rotate-12 transition-transform duration-300" />
                Ask AI Grain Sommelier
                <ArrowRight className="w-4 h-4 text-[#e9c496] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenComparison}
                className="px-5 py-3.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#1f431e]" />
                Rice Comparison Matrix
              </motion.button>
            </motion.div>
          </div>

          {/* Right feature card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING.gentle, delay: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[1.75rem] overflow-hidden shadow-luxe-lg border border-stone-200/90 bg-white group">
              <motion.div style={{ y: imageY, scale: imageScale }} className="relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={rec.image}
                    initial={{ opacity: 0.3, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.slow, ease: EASE.out }}
                    src={rec.image}
                    alt={rec.riceName}
                    className="w-full h-72 sm:h-96 lg:h-[440px] object-cover"
                  />
                </AnimatePresence>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-900/10 to-transparent pointer-events-none" />

              {/* Official seal */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 pr-4 rounded-2xl border border-white/60 shadow-lg flex items-center gap-3 max-w-[calc(100%-2rem)]"
              >
                <img
                  src="/neer-logo.jpg"
                  alt="Neer Rice Depo Official Seal"
                  className="w-10 h-10 rounded-full object-cover border border-[#1f431e] shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1f431e] block">
                    Official Seal
                  </span>
                  <p className="text-xs font-bold font-serif text-stone-900 truncate">
                    Certified Organic Depo
                  </p>
                </div>
              </motion.div>

              {/* Bottom info */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c88a4a] block">
                      Featured Grain Variety
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 font-serif truncate">
                      {rec.riceName}
                    </h4>
                  </div>
                  <div className="bg-[#1f431e] text-white font-extrabold text-[11px] px-3 py-1 rounded-lg border border-[#1f431e] shadow-sm whitespace-nowrap">
                    {rec.water}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating leaf accent */}
            <motion.div
              animate={{ rotate: [0, 10, 0], y: [0, -7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-3 sm:-left-5 w-14 h-14 rounded-full bg-[#1f431e] text-white flex items-center justify-center shadow-lg border-4 border-[#faf8f5] z-20"
            >
              <Leaf className="w-6 h-6 text-[#e9c496]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Value pillars */}
        <StaggerGroup
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-14 pt-8 border-t border-stone-200"
          stagger={0.07}
        >
          {PILLARS.map((p) => (
            <StaggerItem
              key={p.title}
              className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm hover:border-[#1f431e]/40 hover:-translate-y-1 hover:shadow-luxe transition-all duration-300"
            >
              <div className="p-2.5 bg-[#1f431e]/10 text-[#1f431e] rounded-xl shrink-0">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">{p.title}</h4>
                <p className="text-[11px] text-stone-500 leading-snug">{p.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </motion.div>

      {/* Marquee trust strip */}
      <TrustMarquee />
    </section>
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
      {/* edge fades */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1f431e] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1f431e] to-transparent pointer-events-none" />
    </div>
  );
}
