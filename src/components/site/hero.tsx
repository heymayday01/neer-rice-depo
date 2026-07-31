"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const PILLARS = [
  {
    icon: Sprout,
    title: "100% Farm-Direct",
    desc: "Zero middlemen, supporting smallholder farmers",
  },
  {
    icon: ShieldCheck,
    title: "Naturally Aged",
    desc: "Aged 9–24 months for low moisture & aroma",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    desc: "Fast pan-India doorstep shipping",
  },
  {
    icon: HeartHandshake,
    title: "Bulk Savings",
    desc: "Save up to 10% on 10kg & 25kg bags",
  },
];

export function Hero({
  onOpenAISommelier,
  onSelectCategory,
  onOpenComparison,
}: HeroProps) {
  const [meal, setMeal] = useState<Meal>("biryani");
  const rec = MEALS[meal];

  return (
    <section className="relative overflow-hidden border-b border-[#d4a373]/25">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[#faf8f5]" />
      <div className="absolute inset-0 bg-dotgrid opacity-[0.13] pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-[28rem] h-[28rem] bg-[#d4a373]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-10 w-[26rem] h-[26rem] bg-[#2d5a27]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/90 text-[#1f431e] text-xs font-bold tracking-wide shadow-sm">
                <Sprout className="w-4 h-4 text-[#1f431e]" />
                100% Organically Cultivated · Direct Farm Depo
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c88a4a]/10 border border-[#c88a4a]/30 text-stone-700 text-[11px] font-bold">
                <CloudSun className="w-3.5 h-3.5 text-[#1f431e]" />
                Maval Paddy Field: 27°C · Organic Harvest
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-brand font-black text-[#1f431e] leading-[1.08] tracking-wide uppercase text-3xl sm:text-5xl lg:text-[4.1rem]"
            >
              Neer Rice Depo
              <span className="block font-serif italic text-stone-800 font-semibold text-2xl sm:text-4xl lg:text-5xl tracking-normal normal-case mt-3">
                Pristine Indian Organic
                <span className="text-gold-shimmer"> &amp; Heirloom Grains</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl"
            >
              Authentic, unpolished, single-origin heirloom grains and naturally
              aged Basmati — sourced directly from verified organic farming
              cooperatives across Karnataka, Maharashtra, Bengal, and Tamil Nadu.
              Hand-sorted, pesticide-free, and aged naturally for rich aroma and
              effortless digestion.
            </motion.p>

            {/* Meal selector */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(
                  [
                    { id: "biryani", label: "Biryani / Pulao" },
                    { id: "curry", label: "Daily Curry" },
                    { id: "diabetic", label: "Diabetic Low GI" },
                    { id: "khichdi", label: "Khichdi / Soft" },
                  ] as { id: Meal; label: string }[]
                ).map((m) => (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    key={m.id}
                    onClick={() => setMeal(m.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                      meal === m.id
                        ? "bg-[#1f431e] text-white border-[#1f431e] shadow-sm"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:border-[#1f431e] hover:bg-white"
                    }`}
                  >
                    {m.label}
                  </motion.button>
                ))}
              </div>

              <div className="pt-2.5 border-t border-stone-200/80 min-h-[52px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={meal}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between text-xs gap-3"
                  >
                    <div>
                      <span className="font-serif font-bold text-stone-900 block text-sm">
                        {rec.riceName}
                      </span>
                      <span className="text-stone-500 text-[11px] font-medium">
                        {rec.tagline}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
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
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAISommelier}
                className="px-6 py-3.5 bg-[#1f431e] hover:bg-[#16331a] text-white font-bold rounded-xl text-sm shadow-md shadow-[#1f431e]/15 transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#e9c496] group-hover:rotate-12 transition-transform" />
                Ask AI Grain Sommelier
                <ArrowRight className="w-4 h-4 text-[#e9c496] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
            initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[1.75rem] overflow-hidden shadow-luxe-lg border border-stone-200/90 bg-white group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={rec.image}
                  initial={{ opacity: 0.4, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={rec.image}
                  alt={rec.riceName}
                  className="w-full h-80 sm:h-96 lg:h-[440px] object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/20 to-transparent" />

              {/* Official seal */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 pr-4 rounded-2xl border border-stone-200 shadow-md flex items-center gap-3"
              >
                <img
                  src="/neer-logo.jpg"
                  alt="Neer Rice Depo Official Seal"
                  className="w-10 h-10 rounded-full object-cover border border-[#1f431e]"
                />
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#1f431e] block">
                    Official Seal
                  </span>
                  <p className="text-xs font-bold font-serif text-stone-900">
                    Certified Organic Depo
                  </p>
                </div>
              </motion.div>

              {/* Bottom info */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c88a4a] block">
                      Featured Grain Variety
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 font-serif">
                      {rec.riceName}
                    </h4>
                  </div>
                  <div className="bg-[#1f431e] text-white font-extrabold text-[11px] px-3 py-1 rounded-lg border border-[#1f431e] shadow-sm whitespace-nowrap">
                    {rec.water}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating leaf accent — tucked into bottom-left, away from headline */}
            <motion.div
              animate={{ rotate: [0, 8, 0], y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-5 w-14 h-14 rounded-full bg-[#1f431e] text-white flex items-center justify-center shadow-lg border-4 border-[#faf8f5] hidden sm:flex"
            >
              <Leaf className="w-6 h-6 text-[#e9c496]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Value pillars */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-14 pt-8 border-t border-stone-200"
        >
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm hover:border-[#1f431e]/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="p-2.5 bg-[#1f431e]/10 text-[#1f431e] rounded-xl shrink-0">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">{p.title}</h4>
                <p className="text-[11px] text-stone-500 leading-snug">{p.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
