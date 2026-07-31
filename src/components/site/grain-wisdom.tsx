"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Droplets,
  HeartHandshake,
  ChevronRight,
  Award,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Reveal } from "./reveal";
import { SPRING, DURATION, EASE } from "@/lib/motion";

const TOPICS = [
  {
    id: "aging",
    title: "The Science of Natural Aging",
    shortLabel: "Grain Aging",
    icon: Timer,
    color: "#1f431e",
    quote: '"Time is the finest ingredient in traditional rice cultivation."',
    bullets: [
      {
        title: "Moisture Reduction",
        desc: "Our grains are aged for 12 to 24 months in temperature-controlled granaries. This naturally cures the grains, lowering moisture levels so they cook fluffy, long, and non-sticky.",
      },
      {
        title: "Starch Stabilization",
        desc: "During aging, the amylase enzyme stabilizes, letting cooked rice maintain a lower starch hydration index — easier digestion and a cleaner bite.",
      },
      {
        title: "Expanded Fluffiness",
        desc: "Aged grains — especially our Royal 1121 Basmati — expand up to twice their raw length, absorbing optimal moisture without collapsing into mush.",
      },
    ],
    didYouKnow:
      "Naturally aged rice has a significantly lower glycemic response than freshly harvested paddy, making it far gentler on your pancreas and digestive tract.",
  },
  {
    id: "gi",
    title: "Glycemic Index & Metabolic Health",
    shortLabel: "Glycemic Index",
    icon: Scale,
    color: "#c88a4a",
    quote: '"Stable blood sugar is built on unpolished, complex carbohydrates."',
    bullets: [
      {
        title: "Slow Glucose Release",
        desc: "Low Glycemic Index (GI < 55) grains like our Karuppu Kavuni Black Rice (GI 42) and Rajamudi Heritage Rice (GI 52) release energy gradually, preventing harmful insulin spikes.",
      },
      {
        title: "Bran Layer Integrity",
        desc: "We offer unpolished or single-polished options. Keeping the outer bran intact preserves natural dietary fibers, trace minerals (zinc, iron), and protective B-vitamins.",
      },
      {
        title: "Anthocyanin Power",
        desc: "Our black rice is rich in anthocyanins — the same heart-healthy antioxidants found in wild blueberries — helping combat cellular oxidation.",
      },
    ],
    didYouKnow:
      "Switching from highly polished white rice to unpolished grains can lower everyday post-meal sugar levels by up to 22%.",
  },
  {
    id: "cooking",
    title: "Precision Water-to-Rice Calibration",
    shortLabel: "Cooking Guide",
    icon: Droplets,
    color: "#1f431e",
    quote: '"Every grain has a secret ratio. Honor it for the perfect plate."',
    bullets: [
      {
        title: "Basmati & Aromatic Grains (1 : 2.0)",
        desc: "Aged Basmati needs less water. Soak for 20–30 minutes, then cook in a heavy-bottomed pot or steamer. Never over-agitate hot grains to prevent breaking.",
      },
      {
        title: "Daily Staples & Sona Masoori (1 : 2.5)",
        desc: "Ideal for daily meals. Pressure cook for 3 whistles or cook open-lid on a medium flame for tender, separate grains.",
      },
      {
        title: "Heirloom & Red/Black Grains (1 : 2.8 – 3.5)",
        desc: "Because the nutrient-dense unpolished bran is fully intact, these grains require thorough soaking (1–2 hours) and a higher water ratio for deep, soft kernel cooking.",
      },
    ],
    didYouKnow:
      "Always wash rice in cold water 2–3 times to rinse superficial starches. Soaking aged grains hydrates the inner core for uniform heat distribution without cracking.",
  },
  {
    id: "farming",
    title: "Ethical Sourcing & Organic Integrity",
    shortLabel: "Traceability",
    icon: HeartHandshake,
    color: "#c88a4a",
    quote: '"By supporting pesticide-free farming, we support our collective future."',
    bullets: [
      {
        title: "Supporting Indian Farmers",
        desc: "We work directly with smallholder cooperatives in Maharashtra (Maval), Karnataka (Hassan/Koppal), and Bengal (Burdwan), bypassing corporate middlemen.",
      },
      {
        title: "Zero-Chemical Cultivation",
        desc: "Our partnered farms employ Zero-Budget Natural Farming (ZBNF) — organic bio-pesticides, neem cakes, and composted manure. No synthetic urea or glyphosate touches our soil.",
      },
      {
        title: "Fair-Trade Pricing",
        desc: "Over 82% of the consumer purchase price returns directly to farmers, providing stable, honorable livelihoods to sustain ancient heirloom seeds.",
      },
    ],
    didYouKnow:
      "Heirloom grains like Rajamudi and Karuppu Kavuni are climate-resilient and require up to 40% less water to grow than heavily hybridized modern white rice strains.",
  },
] as const;

export function GrainWisdomHub() {
  const [active, setActive] = useState<(typeof TOPICS)[number]["id"]>("aging");
  const current = TOPICS.find((t) => t.id === active) ?? TOPICS[0];
  const TopicIcon = current.icon;

  return (
    <section className="relative bg-[#0a1209] border-t border-white/5 py-12 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 right-1/3 w-[28rem] h-[28rem] bg-[#d4a373]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <Reveal className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#d4a373]/50" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
              Grain Science & Culinary Wisdom
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.05]">
            The Heritage Hub
          </h2>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-2xl font-light">
            Explore the nutritional blueprints, ancient histories, and culinary
            principles of unpolished, organically harvested, and naturally aged
            Indian grains.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          {/* Tabs — ghost pills */}
          <Reveal className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-1 lg:pb-0 w-full" delay={0.1}>
            {TOPICS.map((topic, idx) => {
              const Icon = topic.icon;
              const selected = active === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActive(topic.id)}
                  aria-pressed={selected}
                  className={`relative p-4 rounded-2xl text-left cursor-pointer flex items-center justify-between shrink-0 lg:w-full min-h-[56px] transition-all border ${
                    selected
                      ? "border-[#d4a373]/40 bg-[#d4a373]/8 text-white"
                      : "border-white/8 hover:border-white/20 text-stone-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      selected
                        ? "border-[#d4a373]/40 text-[#d4a373]"
                        : "border-white/10 text-stone-500"
                    }`}>
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] text-stone-500 block font-bold uppercase tracking-[0.2em]">
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-semibold block tracking-tight whitespace-nowrap lg:whitespace-normal">
                        {topic.shortLabel}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform shrink-0 ${
                      selected ? "text-[#d4a373] translate-x-0.5" : "text-stone-600"
                    }`}
                  />
                </button>
              );
            })}
          </Reveal>

          {/* Content — cinematic dark panel */}
          <Reveal className="lg:col-span-8" delay={0.18}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0, transition: SPRING.gentle }}
                exit={{ opacity: 0, y: -14, transition: { duration: DURATION.fast, ease: EASE.io } }}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-9 space-y-6"
              >
                <div className="flex items-center gap-4 border-b border-white/8 pb-5">
                  <div className="p-3.5 rounded-2xl text-[#d4a373] flex items-center justify-center border border-[#d4a373]/30 bg-[#d4a373]/8 shrink-0">
                    <TopicIcon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                      Deep-Dive
                    </span>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mt-0.5 leading-tight">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm font-serif italic text-stone-400 border-l-2 border-[#d4a373]/50 pl-4 py-0.5">
                  {current.quote}
                </p>

                <div className="space-y-5 pt-2">
                  {current.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="text-[#d4a373] font-mono text-xs font-bold shrink-0 mt-0.5 tabular-nums">
                        0{i + 1}
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          {b.title}
                        </h4>
                        <p className="text-xs text-stone-400 leading-relaxed font-light">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-[#d4a373]/20 bg-[#d4a373]/5 p-4 sm:p-5 flex items-start gap-3">
                  <div className="p-2 rounded-xl text-[#d4a373] border border-[#d4a373]/30 shrink-0 mt-0.5">
                    <Award className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a373] block">
                      Did You Know?
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed font-light">
                      {current.didYouKnow}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-500 text-[11px] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#d4a373]" strokeWidth={1.5} />
                  <span className="tracking-wide">Lab-Tested & Certified Organic at Neer Depo Labs</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
