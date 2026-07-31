"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Scale,
  Droplets,
  HeartHandshake,
  ChevronRight,
  Award,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Reveal } from "./reveal";

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
    <section className="bg-gradient-to-b from-[#f5f2ed] to-[#faf8f5] border-t border-stone-200/60 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <Reveal className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f431e]/10 text-[#1f431e] text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            Grain Science & Culinary Wisdom
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            The Neer Rice Depo Heritage Hub
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Explore the nutritional blueprints, ancient histories, and culinary
            principles of unpolished, organically harvested, and naturally aged
            Indian grains.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabs */}
          <Reveal className="lg:col-span-4 space-y-2.5 flex flex-col w-full" delay={0.1}>
            {TOPICS.map((topic, idx) => {
              const Icon = topic.icon;
              const selected = active === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActive(topic.id)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                    selected
                      ? "bg-white border-[#2d5a27] text-[#2d5a27] shadow-luxe font-bold"
                      : "bg-white/40 hover:bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border ${
                        selected
                          ? "bg-[#2d5a27]/10 border-[#2d5a27]/30 text-[#2d5a27]"
                          : "bg-stone-200/50 border-stone-300/80 text-stone-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-stone-400 block font-bold uppercase tracking-wider text-[9px]">
                        Topic {idx + 1}
                      </span>
                      <span className="text-sm font-semibold block tracking-tight">
                        {topic.shortLabel}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      selected
                        ? "text-[#2d5a27] translate-x-0.5"
                        : "text-stone-400"
                    }`}
                  />
                </button>
              );
            })}
          </Reveal>

          {/* Content */}
          <Reveal className="lg:col-span-8" delay={0.18}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-luxe p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center gap-4 border-b border-stone-100 pb-5">
                  <div
                    className="p-3.5 rounded-2xl text-white flex items-center justify-center border shadow-sm"
                    style={{
                      backgroundColor: current.color,
                      borderColor: current.color,
                    }}
                  >
                    <TopicIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c88a4a]">
                      Deep-Dive Exploration
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-serif italic text-stone-600 border-l-2 border-[#d4a373] pl-4 py-0.5">
                  {current.quote}
                </p>

                <div className="space-y-4 pt-2">
                  {current.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#1f431e]/10 text-[#1f431e] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                          {b.title}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#faf8f5] rounded-2xl p-4 sm:p-5 border border-stone-200/80 flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl border border-stone-200 text-[#1f431e] shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-[#c88a4a]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1f431e] block">
                      Did You Know? (Grain Fact)
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {current.didYouKnow}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-400 text-[11px] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#2d5a27]" />
                  <span>Lab-Tested and Certified Organic at Neer Depo Labs</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
