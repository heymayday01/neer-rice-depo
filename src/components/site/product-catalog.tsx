"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Layers,
  Sparkles,
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
  fadeUp,
  fadeRise,
  blurReveal,
  staggerContainer,
  hoverLift,
  tapPress,
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
  aromatic: Sparkles,
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Mobile category strip — uniform pills */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar -mx-4 sm:-mx-6">
        {CATEGORIES.map((cat) => {
          const Icon = CAT_ICONS[cat.id] ?? Sprout;
          const selected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={selected}
              className={`relative px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer overflow-hidden min-h-[40px] ${
                selected
                  ? "text-white"
                  : "bg-white/70 text-stone-600 border border-stone-200/60 hover:bg-white"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="mobile-cat-pill"
                  transition={SPRING.snappy}
                  className="absolute inset-0 bg-gradient-to-br from-[#1f431e] to-[#2d5a27] shadow-md shadow-[#1f431e]/20"
                />
              )}
              <Icon
                className={`relative z-10 w-3.5 h-3.5 ${
                  selected ? "text-[#d4a373]" : "text-stone-400"
                }`}
              />
              <span className="relative z-10">{cat.short}</span>
            </button>
          );
        })}
      </div>

      {/* Filter bar — frosted refractive */}
      <motion.div
        variants={blurReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="glass refract-edge flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl"
      >
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-lg sm:text-xl font-serif text-stone-800 flex items-center gap-2 truncate">
            <Sprout className="w-5 h-5 text-[#1f431e] shrink-0" />
            <span className="truncate">{TITLES[activeCategory] ?? "All Grain Varieties"}</span>
          </h2>
          <span className="text-xs bg-[#1f431e]/10 text-[#1f431e] px-2.5 py-0.5 rounded-full font-bold shrink-0">
            {sorted.length} Items
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenComparison}
            className="pill px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 bg-[#c88a4a]/15 hover:bg-[#c88a4a]/25 text-stone-900 cursor-pointer min-h-[36px]"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#1f431e]" />
            <span className="hidden sm:inline">Compare Matrix</span>
            <span className="sm:hidden">Compare</span>
          </button>

          <button
            onClick={() => setGiFilter(giFilter === "low" ? "all" : "low")}
            aria-pressed={giFilter === "low"}
            className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[36px] transition-all ${
              giFilter === "low"
                ? "bg-gradient-to-br from-[#1f431e] to-[#2d5a27] text-white shadow-md shadow-[#1f431e]/20"
                : "pill text-[#1f431e]"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diabetic Friendly (Low GI)</span>
            <span className="sm:hidden">Low GI</span>
          </button>

          <div className="pill flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 min-h-[36px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#1f431e]" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent font-bold text-[#1f431e] focus:outline-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 glass refract-edge rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1f431e]/10 flex items-center justify-center mx-auto text-[#1f431e]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif text-stone-800">
            No matching rice grains found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try clearing your search query or reset filters to view all available
            organic grains.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2.5 bg-gradient-to-br from-[#1f431e] to-[#2d5a27] text-white rounded-full text-xs font-bold hover:from-[#16331a] cursor-pointer min-h-[40px]"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {sorted.map((product) => (
              <motion.div
                key={product.id}
                layout
                variants={blurReveal}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -16, transition: { duration: DURATION.fast, ease: EASE.io } }}
                transition={SPRING.gentle}
              >
                <ProductCard product={product} onOpenDetail={onOpenDetail} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Promo card — frosted dark glass */}
          <motion.div
            variants={blurReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={SPRING.gentle}
            className="glass-dark refract-edge-gold refract-edge relative overflow-hidden rounded-3xl text-white p-6 flex flex-col justify-between min-h-[420px]"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d4a373]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d4a373]/20 text-[#e9c496] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                The Neer Promise
              </span>
              <h3 className="font-serif text-2xl font-bold leading-tight">
                Every grain, traceable to its farm.
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Lab-tested purity, 12% of proceeds returned to seed-preservation
                vaults, and 82% of every rupee going back to the farmer. This is
                rice, done honorably.
              </p>
            </div>
            <div className="relative z-10 space-y-2">
              {[
                "Pesticide-free certified",
                "Naturally aged 9–24 months",
                "Fair-trade farmer pricing",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs">
                  <Check className="w-3.5 h-3.5 text-[#d4a373] shrink-0" />
                  <span className="text-stone-200 font-medium">{t}</span>
                </div>
              ))}
              <button
                onClick={onOpenComparison}
                className="mt-3 w-full py-2.5 bg-[#d4a373] hover:bg-[#c59464] text-stone-950 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 min-h-[40px]"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Compare All Grains
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
