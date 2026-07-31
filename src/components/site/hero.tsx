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
  blurReveal,
  blurRevealScale,
  blurRevealAt,
  swapUp,
  staggerContainer,
  hoverLift,
  tapPress,
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
    riceName: "Royal 1121 Extra Long Basmati",
    tagline: "24-Month Natural Aging · 8.3mm Fluffy Grain",
    water: "1 : 2.0",
    catId: "aromatic",
    image:
      "/rice/basmati-1121.jpg",
  },
  curry: {
    riceName: "Single-Origin Unpolished Sona Masoori",
    tagline: "Light Digestible Staple · Karnataka Paddy",
    water: "1 : 2.5",
    catId: "daily",
    image:
      "/rice/sona-masoori.jpg",
  },
  diabetic: {
    riceName: "Karuppu Kavuni Organic Black Rice",
    tagline: "Low GI (42) · 10× Anthocyanin Antioxidants",
    water: "1 : 3.0",
    catId: "superfood",
    image:
      "/rice/black-kavuni.jpg",
  },
  khichdi: {
    riceName: "Organic Maval Indrayani Rice",
    tagline: "Naturally Sticky & Fragrant · Gentle Digestion",
    water: "1 : 3.5",
    catId: "heritage",
    image:
      "/rice/indrayani.jpg",
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
  const reduced = usePrefersReducedMotion();

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

  // Reduced-motion: disable parallax transforms
  const parallax = (mv: typeof imageY) => (reduced ? 0 : mv);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#faf8f5] bg-aurora" />
      <div className="absolute inset-0 bg-dotgrid opacity-[0.1] pointer-events-none" />
      <motion.div
        style={{ y: parallax(blobY1) }}
        className="absolute -top-24 right-1/4 w-[28rem] h-[28rem] bg-[#d4a373]/12 rounded-full blur-[120px] pointer-events-none animate-gradient-drift"
      />
      <motion.div
        style={{ y: parallax(blobY2) }}
        className="absolute bottom-0 -left-10 w-[26rem] h-[26rem] bg-[#2d5a27]/10 rounded-full blur-[120px] pointer-events-none animate-gradient-drift-slow"
      />

      <motion.div
        style={{ y: reduced ? 0 : contentY, opacity: reduced ? 1 : contentOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-20 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Badge pills — blur reveal stagger */}
            <motion.div
              variants={staggerContainer(0.08, 0.05)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-2"
            >
              <motion.span
                variants={blurRevealAt(0.05)}
                className="pill inline-flex items-center gap-2 px-3.5 py-1.5 text-[#1f431e] text-[11px] sm:text-xs font-bold tracking-wide"
              >
                <Sprout className="w-4 h-4 text-[#1f431e]" />
                100% Organically Cultivated
              </motion.span>
              <motion.span
                variants={blurRevealAt(0.15)}
                className="pill inline-flex items-center gap-2 px-3 py-1.5 bg-[#c88a4a]/10 border-[#c88a4a]/30 text-stone-700 text-[10px] sm:text-[11px] font-bold"
              >
                <CloudSun className="w-3.5 h-3.5 text-[#1f431e]" />
                <span className="hidden xs:inline">Maval Paddy: 27°C · Organic Harvest</span>
                <span className="xs:hidden">27°C · Organic Harvest</span>
              </motion.span>
            </motion.div>

            {/* Headline — blur reveal */}
            <motion.h1
              variants={blurRevealAt(0.2)}
              initial="hidden"
              animate="visible"
              className="font-brand font-black text-[#1f431e] leading-[1.05] tracking-wide uppercase text-[1.95rem] xs:text-3xl sm:text-5xl lg:text-[4.1rem]"
            >
              Neer Rice Depo
              <span className="block font-serif italic text-stone-800 font-semibold text-xl xs:text-2xl sm:text-4xl lg:text-5xl tracking-normal normal-case mt-3 sm:mt-4 mb-1">
                Pristine Indian Organic{" "}
                <span className="text-gold-shimmer">&amp; Heirloom Grains</span>
              </span>
            </motion.h1>

            {/* Description — blur reveal */}
            <motion.p
              variants={blurRevealAt(0.35)}
              initial="hidden"
              animate="visible"
              className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl"
            >
              Authentic, unpolished, single-origin heirloom grains and naturally aged
              Basmati — sourced directly from verified organic farming cooperatives
              across Karnataka, Maharashtra, Bengal, and Tamil Nadu.
            </motion.p>

            {/* Meal selector — frosted refractive card */}
            <motion.div
              variants={blurRevealScale}
              initial="hidden"
              animate="visible"
              transition={{ ...SPRING.gentle, delay: 0.5 }}
              className="glass refract-edge p-4 sm:p-5 rounded-3xl space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#1f431e] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c88a4a]" />
                  Quick Grain Selector
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
                      className={`relative py-2.5 px-2.5 rounded-full text-xs font-bold text-center cursor-pointer overflow-hidden min-h-[40px] ${
                        selected
                          ? "text-white"
                          : "bg-white/70 text-stone-700 border border-stone-200/80 hover:bg-white hover:border-[#1f431e]/30"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="meal-pill"
                          transition={SPRING.snappy}
                          className="absolute inset-0 bg-gradient-to-br from-[#1f431e] to-[#2d5a27] shadow-md shadow-[#1f431e]/20"
                        />
                      )}
                      <span className="relative z-10">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2.5 border-t border-stone-200/60 min-h-[52px]">
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
                      className="pill px-3.5 py-1.5 bg-[#c88a4a]/15 hover:bg-[#c88a4a]/25 text-stone-900 font-bold text-xs shrink-0 flex items-center gap-1.5 border-[#c88a4a]/30 cursor-pointer"
                    >
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 text-[#1f431e]" />
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* CTAs — blur reveal */}
            <motion.div
              variants={blurRevealAt(0.65)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-3"
            >
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="shine-on-hover px-5 sm:px-6 py-3.5 bg-gradient-to-br from-[#1f431e] to-[#2d5a27] hover:from-[#16331a] hover:to-[#1f431e] text-white font-bold rounded-full text-sm shadow-md shadow-[#1f431e]/15 transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#e9c496] group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden xs:inline">Ask AI Grain Sommelier</span>
                <span className="xs:hidden">AI Sommelier</span>
                <ArrowRight className="w-4 h-4 text-[#e9c496] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenComparison}
                className="pill px-5 py-3.5 text-stone-800 font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#1f431e]" />
                <span className="hidden sm:inline">Rice Comparison Matrix</span>
                <span className="sm:hidden">Compare</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right feature card — frosted refractive + parallax image */}
          <motion.div
            variants={blurRevealScale}
            initial="hidden"
            animate="visible"
            transition={{ ...SPRING.gentle, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[1.75rem] overflow-hidden shadow-luxe-lg group refract-edge bg-white">
              <motion.div
                style={{ y: parallax(imageY), scale: reduced ? 1 : imageScale }}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={rec.image}
                    initial={{ opacity: 0.3, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.slow, ease: EASE.out }}
                    className="w-full h-72 sm:h-96 lg:h-[440px]"
                  >
                    <img
                      src={rec.image}
                      alt={rec.riceName}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-900/10 to-transparent pointer-events-none" />

              {/* Official seal — frosted glass pill */}
              <motion.div
                animate={reduced ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 glass refract-edge p-2 pr-4 rounded-2xl flex items-center gap-3 max-w-[calc(100%-2rem)]"
              >
                <img
                  src="/neer-logo.jpg"
                  alt=""
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

              {/* Bottom info — frosted glass */}
              <div className="absolute bottom-4 left-4 right-4 glass refract-edge p-4 rounded-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c88a4a] block">
                      Featured Grain Variety
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 font-serif truncate">
                      {rec.riceName}
                    </h4>
                  </div>
                  <div className="bg-gradient-to-br from-[#1f431e] to-[#2d5a27] text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                    {rec.water}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating leaf accent */}
            <motion.div
              animate={reduced ? {} : { rotate: [0, 10, 0], y: [0, -7, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-3 sm:-left-5 w-14 h-14 rounded-full bg-gradient-to-br from-[#1f431e] to-[#2d5a27] text-white flex items-center justify-center shadow-lg border-4 border-[#faf8f5] z-20"
            >
              <Leaf className="w-6 h-6 text-[#e9c496]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Value pillars — scroll blur reveal stagger */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-14 pt-8 border-t border-stone-200"
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.title}
              variants={blurReveal}
              className="flex items-start gap-3 glass refract-edge p-3.5 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="p-2.5 bg-[#1f431e]/10 text-[#1f431e] rounded-xl shrink-0">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">{p.title}</h4>
                <p className="text-[11px] text-stone-500 leading-snug">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1f431e] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1f431e] to-transparent pointer-events-none" />
    </div>
  );
}
