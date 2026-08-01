"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Layers,
  Flower2,
  HeartHandshake,
  Package,
  Filter,
  ArrowUpDown,
  BarChart2,
  Search,
  Check,
} from "lucide-react";
import { RICE_PRODUCTS, CATEGORIES } from "@/lib/rice-products";
import { ProductCard } from "./product-card";
import { RiceProduct } from "@/lib/types";
import {
  EASE,
  DURATION,
  SPRING,
  cleanRise,
} from "@/lib/motion";

interface ProductCatalogProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenComparison: () => void;
  onOpenDetail: (p: RiceProduct) => void;
}

type SortKey = "featured" | "price-low" | "price-high" | "rating";

const CAT_ICONS: Record<string, typeof Sprout> = {
  all: Sprout,
  daily: Layers,
  heritage: Sprout,
  aromatic: Flower2,
  superfood: HeartHandshake,
  combos: Package,
};

const TITLES: Record<string, string> = {
  all: "All Grain Varieties",
  daily: "Daily Staple Grains",
  heritage: "Heritage & Unpolished Grains",
  aromatic: "Aromatic & Basmati",
  superfood: "Low GI & Superfood Grains",
  combos: "Value Bundle Combos",
};

export function ProductCatalog({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenComparison,
  onOpenDetail,
}: ProductCatalogProps) {
  const [giFilter, setGiFilter] = useState<"all" | "low">("all");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const filtered = RICE_PRODUCTS.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (giFilter === "low" && !p.giIndex.includes("Low")) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const ok =
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.originRegion.toLowerCase().includes(q) ||
          p.bestFor.some((d) => d.toLowerCase().includes(q));
        if (!ok) return false;
      }
      return true;
    });

    const priceOf = (p: RiceProduct) =>
      p.discountedPricePerKg ?? p.pricePerKg;

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return priceOf(a) - priceOf(b);
      if (sortBy === "price-high") return priceOf(b) - priceOf(a);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, giFilter, searchQuery, sortBy]);

  const reset = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setGiFilter("all");
    setSortBy("featured");
  };

  return (
    <section className="relative bg-[#0a0f0a] py-8 sm:py-14">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-[#1f431e]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[26rem] h-[26rem] bg-[#d4a373]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section eyebrow + title */}
        <motion.div
          variants={cleanRise}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#d4a373]/50" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
              The Collection
            </span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="font-serif font-bold text-white text-2xl sm:text-4xl tracking-tight">
              {TITLES[activeCategory] ?? "All Grain Varieties"}
            </h2>
            <span className="text-[11px] font-mono text-stone-400 tracking-wide">
              {sorted.length} {sorted.length === 1 ? "variety" : "varieties"}
            </span>
          </div>
        </motion.div>

        {/* Mobile category strip — ghost pills */}
        <nav aria-label="Product categories" className="md:hidden flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
          {CATEGORIES.map((cat) => {
            const Icon = CAT_ICONS[cat.id] ?? Sprout;
            const selected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={selected}
                className={`relative px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer transition-all min-h-[40px] ${
                  selected
                    ? "text-white border border-[#d4a373]/60 bg-[#d4a373]/10"
                    : "text-stone-400 hover:text-white border border-white/12 hover:border-white/25"
                }`}
              >
                {selected && <span className="w-1 h-1 rounded-full bg-[#d4a373]" />}
                <Icon className={`w-3.5 h-3.5 ${selected ? "text-[#d4a373]" : "text-stone-500"}`} />
                <span>{cat.short}</span>
              </button>
            );
          })}
        </nav>

        {/* Filter bar — minimal, jewelry-like */}
        <motion.div
          variants={cleanRise}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="hidden md:flex items-center gap-3 flex-wrap"
        >
          <button
            onClick={onOpenComparison}
            className="px-4 py-2 rounded-full text-xs font-bold text-stone-300 hover:text-white border border-white/12 hover:border-white/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Compare
          </button>
          <button
            onClick={() => setGiFilter(giFilter === "low" ? "all" : "low")}
            aria-pressed={giFilter === "low"}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              giFilter === "low"
                ? "text-white border border-[#d4a373]/60 bg-[#d4a373]/10"
                : "text-stone-300 hover:text-white border border-white/12 hover:border-white/25"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Low GI
          </button>
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-stone-300 border border-white/12">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#d4a373]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured" className="bg-[#0a0f0a]">Featured</option>
              <option value="price-low" className="bg-[#0a0f0a]">Price: Low → High</option>
              <option value="price-high" className="bg-[#0a0f0a]">Price: High → Low</option>
              <option value="rating" className="bg-[#0a0f0a]">Customer Rating</option>
            </select>
          </div>
        </motion.div>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-white/10 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full border border-[#d4a373]/30 flex items-center justify-center mx-auto text-[#d4a373]">
              <Search className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-serif text-white">No matching grains found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try clearing your search or reset filters to view all available organic grains.
            </p>
            <button
              onClick={reset}
              className="px-5 py-2.5 bg-gradient-to-br from-[#1f431e] to-[#1f431e] text-white rounded-full text-xs font-bold hover:from-[#1f431e] cursor-pointer min-h-[40px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {sorted.map((product) => (
                <motion.div
                  key={product.id}
                  variants={cleanRise}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -16, transition: { duration: DURATION.fast, ease: EASE.io } }}
                >
                  <ProductCard product={product} onOpenDetail={onOpenDetail} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Promo card — cinematic dark */}
            <motion.div
              variants={cleanRise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative overflow-hidden rounded-3xl border border-white/10 text-white p-7 flex flex-col justify-between min-h-[420px] bg-gradient-to-br from-[#1f431e]/40 to-[#0a0f0a]"
            >
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#d4a373]/12 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#d4a373]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
                    The Neer Promise
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold leading-tight">
                  Every grain, traceable to its farm.
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Lab-tested purity, 12% of proceeds returned to seed-preservation
                  vaults, and 82% of every rupee going back to the farmer.
                </p>
              </div>
              <div className="relative z-10 space-y-2.5">
                {[
                  "Pesticide-free certified",
                  "Naturally aged 9–24 months",
                  "Fair-trade farmer pricing",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-[#d4a373] shrink-0" strokeWidth={2} />
                    <span className="text-stone-300 font-light tracking-wide">{t}</span>
                  </div>
                ))}
                <button
                  onClick={onOpenComparison}
                  className="mt-4 w-full py-3 border border-[#d4a373]/40 hover:bg-[#d4a373]/10 text-[#d4a373] rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Compare All Grains
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
