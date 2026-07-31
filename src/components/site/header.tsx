"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
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
  Menu,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { CATEGORIES } from "@/lib/rice-products";
import { SPRING, hoverLift, tapPress } from "@/lib/motion";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenCart: () => void;
  onOpenAISommelier: () => void;
  onOpenOrders: () => void;
  onOpenComparison: () => void;
  onOpenMobileMenu: () => void;
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
  onOpenMobileMenu,
}: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const count = useCart((s) => s.count());
  const subtotal = useCart((s) => s.subtotal());

  // Scroll listener using framer-motion's useScroll — single subscription, no re-register
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
    if (y > 140 && y > lastY.current) setVisible(false);
    else setVisible(true);
    lastY.current = y;
  });

  return (
    <header
      className={`sticky top-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top micro-banner (desktop) */}
      <div className="hidden md:block bg-[#0a1209] text-stone-300 text-[11px] py-1.5 px-6 border-b border-[#1f431e]/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
            <span className="font-semibold uppercase tracking-[0.2em] text-[9px] text-stone-200">
              Direct-Sourced Organic Rice
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Free Express Delivery Above ₹999</span>
          </div>
          <a
            href="tel:+919823011022"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#d4a373]" />
            <span className="font-semibold tracking-tight">+91 98230 11022</span>
          </a>
        </div>
      </div>

      {/* Main row */}
      <div
        className={`backdrop-blur-xl border-b transition-all duration-300 ${
          scrolled
            ? "bg-white/85 border-stone-200/70 shadow-[0_8px_30px_-12px_rgba(45,90,39,0.12)]"
            : "bg-white/70 border-stone-200/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem] gap-3">
            {/* Brand */}
            <button
              onClick={() => {
                setActiveCategory("all");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
              aria-label="Neer Rice Depo home"
            >
              <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-full bg-stone-100 flex items-center justify-center p-0.5 shadow-sm overflow-hidden border border-stone-200 group-hover:border-[#d4a373] transition-colors duration-300">
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

            {/* Search (desktop) */}
            <div className="hidden sm:block flex-1 max-w-xs md:max-w-md relative">
              <input
                type="text"
                placeholder="Search grains, regions, dishes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-stone-100 hover:bg-stone-200/50 focus:bg-white border border-transparent focus:border-[#1f431e]/20 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/10 transition-all font-semibold"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-stone-500 hover:text-stone-800 bg-stone-200/70 hover:bg-stone-200 p-1 rounded-full cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Mobile: menu + cart */}
            <div className="flex sm:hidden items-center gap-2">
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenMobileMenu}
                className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 shadow-sm cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={tapPress}
                onClick={onOpenCart}
                className="relative p-2.5 bg-[#1f431e] text-white rounded-xl shadow-sm cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#e9c496]" />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING.bouncy}
                    className="absolute -top-1.5 -right-1.5 bg-[#d4a373] text-stone-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {count}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onOpenComparison}
                title="Compare Grains"
                className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 text-stone-600 hover:text-[#1f431e] hover:bg-stone-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <BarChart2 className="w-4 h-4 text-[#1f431e]" />
                <span className="hidden xl:inline tracking-tight">Grain Matrix</span>
              </button>

              <button
                onClick={onOpenOrders}
                title="Track Orders"
                className="hidden md:flex items-center gap-2 px-3.5 py-2.5 text-stone-600 hover:text-[#1f431e] hover:bg-stone-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#1f431e]" />
                <span className="hidden lg:inline tracking-tight">Orders</span>
              </button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1f431e]/8 hover:bg-[#1f431e]/12 text-[#1f431e] border border-[#1f431e]/15 rounded-xl text-xs font-bold tracking-tight transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#c88a4a]" />
                <span>AI Sommelier</span>
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-[#1f431e] hover:bg-[#16331a] text-white rounded-xl text-xs font-bold shadow-md shadow-[#1f431e]/12 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#e9c496]" />
                <span className="hidden md:inline">Cart</span>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING.bouncy}
                    className="bg-[#d4a373] text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center"
                  >
                    {count}
                  </motion.span>
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
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selected
                      ? "text-white"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="cat-pill"
                      transition={SPRING.snappy}
                      className="absolute inset-0 bg-[#1f431e] rounded-xl shadow-sm"
                    />
                  )}
                  <Icon
                    className={`relative z-10 w-3.5 h-3.5 ${
                      selected ? "text-[#d4a373]" : "text-stone-400"
                    }`}
                  />
                  <span className="relative z-10 tracking-tight">{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
