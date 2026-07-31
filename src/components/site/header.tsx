"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Sparkles,
  Package,
  Sprout,
  Layers,
  HeartHandshake,
  PhoneCall,
  BarChart2,
  X,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { CATEGORIES } from "@/lib/rice-products";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenCart: () => void;
  onOpenAISommelier: () => void;
  onOpenOrders: () => void;
  onOpenComparison: () => void;
}

const CAT_ICONS: Record<string, typeof Sprout> = {
  all: Sprout,
  daily: Layers,
  heritage: Sprout,
  aromatic: Sparkles,
  superfood: HeartHandshake,
  combos: Package,
};

export function Header({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenCart,
  onOpenAISommelier,
  onOpenOrders,
  onOpenComparison,
}: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotal());

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 120 && y > lastY) setVisible(false);
      else setVisible(true);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 max-md:fixed max-md:top-3 max-md:left-3 max-md:right-3 max-md:z-50 max-md:rounded-3xl max-md:bg-white/95 max-md:backdrop-blur-xl max-md:border max-md:border-stone-200/80 max-md:shadow-[0_12px_36px_rgba(45,90,39,0.10)] max-md:overflow-hidden ${
        visible
          ? "max-md:translate-y-0 max-md:opacity-100"
          : "max-md:-translate-y-28 max-md:opacity-0 pointer-events-none"
      }`}
    >
      {/* Top micro-banner */}
      <div className="hidden md:block bg-[#0a1209] text-stone-300 text-[11px] py-1.5 px-6 border-b border-[#1f431e]/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
            <span className="font-semibold uppercase tracking-[0.2em] text-[9px] text-stone-200">
              Direct-Sourced Organic Rice
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">
              Free Express Delivery Above ₹999
            </span>
          </div>
          <div className="flex items-center gap-5 text-stone-400 text-[11px]">
            <a
              href="tel:+919823011022"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#d4a373]" />
              <span className="font-semibold tracking-tight">+91 98230 11022</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-stone-200/60 shadow-[0_2px_18px_-6px_rgba(45,90,39,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-3">
            {/* Brand */}
            <button
              onClick={() => {
                setActiveCategory("all");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
            >
              <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-full bg-stone-100 flex items-center justify-center p-0.5 shadow-sm overflow-hidden border border-stone-200 group-hover:border-[#d4a373] transition-all duration-300">
                <img
                  src="/neer-logo.jpg"
                  alt="Neer Rice Depo"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-left">
                <span className="text-sm md:text-xl font-brand font-black tracking-[0.12em] text-[#1f431e] uppercase block leading-none">
                  <span className="md:hidden">Neer Rice</span>
                  <span className="hidden md:inline">Neer Rice Depo</span>
                </span>
                <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-[0.18em] hidden md:block mt-1">
                  Farm Direct · Heirloom Grains
                </span>
              </div>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-[160px] xs:max-w-[200px] sm:max-w-xs md:max-w-md relative">
              <input
                type="text"
                placeholder="Search grains…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-2 md:pl-10 md:pr-9 md:py-2.5 bg-stone-100 hover:bg-stone-200/50 focus:bg-white border border-transparent focus:border-[#1f431e]/20 rounded-full md:rounded-xl text-[11px] md:text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/10 transition-all font-semibold"
              />
              <Search className="absolute left-3 top-2.5 md:left-3.5 md:top-3.5 w-3.5 h-3.5 md:w-4 md:h-4 text-stone-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1.5 md:top-2.5 text-stone-500 hover:text-stone-800 bg-stone-200/70 hover:bg-stone-200 px-1.5 py-0.5 rounded-full cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onOpenComparison}
                title="Compare Grains"
                className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 text-stone-600 hover:text-[#1f431e] hover:bg-stone-50 rounded-xl text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-stone-200/60"
              >
                <BarChart2 className="w-4 h-4 text-[#1f431e]" />
                <span className="hidden xl:inline tracking-tight">Grain Matrix</span>
              </button>

              <button
                onClick={onOpenOrders}
                title="Track Orders"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 text-stone-600 hover:text-[#1f431e] hover:bg-stone-50 rounded-xl text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-stone-200/60"
              >
                <Package className="w-4 h-4 text-[#1f431e]" />
                <span className="hidden md:inline tracking-tight">Orders</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAISommelier}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1f431e]/8 hover:bg-[#1f431e]/12 text-[#1f431e] border border-[#1f431e]/15 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#c88a4a]" />
                <span>AI Sommelier</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-[#1f431e] hover:bg-[#16331a] text-white rounded-xl text-xs font-bold shadow-md shadow-[#1f431e]/12 hover:shadow-lg hover:shadow-[#1f431e]/18 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#e9c496]" />
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="bg-[#d4a373] text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                    {count}
                  </span>
                )}
                {subtotal > 0 && (
                  <span className="text-[11px] font-bold text-[#e9c496] border-l border-white/20 pl-1.5 ml-0.5">
                    ₹{subtotal}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop category bar */}
          <nav className="hidden md:flex items-center gap-1 py-2.5 overflow-x-auto no-scrollbar border-t border-stone-100">
            {CATEGORIES.map((cat) => {
              const Icon = CAT_ICONS[cat.id] ?? Sprout;
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selected
                      ? "bg-[#1f431e] text-white font-extrabold shadow-sm"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-50 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      selected ? "text-[#d4a373]" : "text-stone-400"
                    }`}
                  />
                  <span className="tracking-tight">{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
