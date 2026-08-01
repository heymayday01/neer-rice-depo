"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ShoppingBag,
  Search,
  BrainCircuit,
  Package,
  Sprout,
  Layers,
  HeartHandshake,
  PhoneCall,
  BarChart2,
  X,
  Menu,
  Flower2,
  Wheat,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { CATEGORIES } from "@/lib/rice-products";
import { SPRING, hoverLift, tapPress } from "@/lib/motion";
import { LogoMark } from "./logo";

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
  all: Wheat,
  daily: Layers,
  heritage: Sprout,
  aromatic: Flower2,
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

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    // Only update state when the threshold actually changes — avoids re-renders
    setScrolled((prev) => (prev !== (y > 8) ? y > 8 : prev));
    if (y > 140 && y > lastY.current) setVisible((prev) => (prev !== false ? false : prev));
    else setVisible((prev) => (prev !== true ? true : prev));
    lastY.current = y;
  });

  const goHome = () => {
    setActiveCategory("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      role="banner"
      aria-label="Site header"
      className={`sticky top-0 z-40 transition-transform duration-300 pt-safe ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top micro-banner (desktop only) — harvest info strip */}
      <div className="hidden md:block bg-[#0a0f0a] text-stone-400 text-[11px] py-1.5 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a3c4a0] animate-pulse" />
            <span className="font-medium uppercase tracking-[0.2em] text-[9px] text-stone-300">
              Direct-Sourced Organic Rice
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Free Express Delivery Above ₹999</span>
          </div>
          <a
            href="tel:+919823011022"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#d4a373]" strokeWidth={1.5} />
            <span className="font-medium tracking-tight">+91 98230 11022</span>
          </a>
        </div>
      </div>

      {/* === MOBILE: Floating pill navbar === */}
      <div className="sm:hidden px-3 pt-2">
        <div
          className="flex items-center justify-between rounded-full px-3 py-2 relative"
          style={{
            background: "rgba(10, 15, 10, 0.72)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            boxShadow: [
              "inset 0 1px 0 0 rgba(255,255,255,0.08)",
              "inset 0 -1px 0 0 rgba(0,0,0,0.2)",
              "inset 1px 0 0 0 rgba(255,255,255,0.03)",
              "0 1px 3px rgba(0,0,0,0.3)",
              "0 8px 28px -4px rgba(0,0,0,0.5)",
              "0 0 0 0.5px rgba(212,163,115,0.15)",
            ].join(", "),
          }}
        >
          {/* Refractive top edge */}
          <div
            className="absolute top-0 left-1/4 right-1/4 h-px rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,163,115,0.3), transparent)",
            }}
          />

          {/* Brand — SVG logo mark */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
            aria-label="Neer Rice Depo home"
          >
            <div className="shrink-0">
              <LogoMark size={32} />
            </div>
            <span className="text-xs font-serif font-bold text-white tracking-tight">
              Neer Rice
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={tapPress}
              onClick={onOpenMobileMenu}
              className="p-2 text-stone-400 hover:text-white rounded-full cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </motion.button>
            <motion.button
              whileTap={tapPress}
              onClick={onOpenCart}
              className="relative p-2 text-[#d4a373] rounded-full cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors hover:bg-[#d4a373]/8"
              aria-label={`Cart with ${count} items`}
              style={{
                background: "rgba(212,163,115,0.08)",
                boxShadow: "inset 0 0 0 1px rgba(212,163,115,0.2)",
              }}
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={SPRING.bouncy}
                  className="absolute -top-0.5 -right-0.5 bg-[#d4a373] text-[#0a0f0a] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center z-20"
                  style={{
                    boxShadow: "0 0 0 1.5px #0a0f0a, 0 2px 4px rgba(212,163,115,0.3)",
                  }}
                >
                  {count}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* === DESKTOP: Full-width glass bar === */}
      <div
        className={`hidden sm:block border-b transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0f0a]/92 border-white/8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]"
            : "bg-[#0a0f0a]/75 border-white/5"
        }`}
        style={{
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16 gap-3">
            {/* Brand — SVG logo + wordmark */}
            <button
              onClick={goHome}
              className="flex items-center gap-2.5 group shrink-0 cursor-pointer min-h-[44px]"
              aria-label="Neer Rice Depo home"
            >
              <div className="transition-transform duration-500 group-hover:scale-105 shrink-0">
                <LogoMark size={44} withGlow={scrolled} />
              </div>
              <div className="text-left">
                <span className="text-sm md:text-base font-serif font-bold text-white tracking-tight block leading-none">
                  <span className="md:hidden">Neer Rice</span>
                  <span className="hidden md:inline">Neer Rice Depo</span>
                </span>
                <span className="text-[9px] text-[#d4a373] font-medium uppercase tracking-[0.2em] hidden md:block mt-1">
                  Farm Direct · Heirloom
                </span>
              </div>
            </button>

            {/* Desktop search */}
            <div className="hidden sm:block flex-1 max-w-xs md:max-w-sm relative">
              <input
                type="text"
                placeholder="Search grains, regions, dishes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 h-10 bg-white/5 border border-white/10 focus:border-[#d4a373]/40 rounded-full text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#d4a373]/20 transition-all font-medium"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" strokeWidth={1.5} />
              {!searchQuery && (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-stone-500 border border-white/10 rounded px-1.5 py-0.5 data-mono pointer-events-none">
                  ⌘K
                </kbd>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Desktop actions — consolidated: Compare + Orders as icon group, AI Sommelier as pill, Cart as primary */}
            <div className="hidden sm:flex items-center gap-1.5">
              {/* Secondary actions — icon group with divider */}
              <div className="hidden md:flex items-center gap-0.5 mr-1 pr-2 border-r border-white/8">
                <button
                  onClick={onOpenComparison}
                  title="Compare Grains"
                  aria-label="Compare grains"
                  className="p-2 text-stone-400 hover:text-[#d4a373] cursor-pointer flex items-center justify-center rounded-lg transition-colors"
                >
                  <BarChart2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={onOpenOrders}
                  title="Track Orders"
                  aria-label="Track orders"
                  className="p-2 text-stone-400 hover:text-[#d4a373] cursor-pointer flex items-center justify-center rounded-lg transition-colors"
                >
                  <Package className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>

              {/* AI Sommelier — accent pill */}
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                aria-label="Ask AI grain sommelier"
                className="flex items-center gap-2 px-3.5 h-10 text-[#d4a373] border border-[#d4a373]/25 hover:bg-[#d4a373]/8 text-xs font-bold tracking-tight cursor-pointer rounded-full transition-colors"
              >
                <BrainCircuit className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden lg:inline">Sommelier</span>
              </motion.button>

              {/* Cart — primary gold button */}
              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenCart}
                aria-label={`Cart with ${count} items`}
                className="relative flex items-center gap-2 px-3.5 h-10 bg-[#d4a373] hover:bg-[#c4956a] text-[#0a0f0a] rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                <span className="hidden md:inline">Cart</span>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING.bouncy}
                    className="bg-[#0a0f0a] text-[#d4a373] text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  >
                    {count}
                  </motion.span>
                )}
                {subtotal > 0 && (
                  <span className="text-[11px] font-bold text-[#0a0f0a]/70 border-l border-[#0a0f0a]/20 pl-1.5 ml-0.5 hidden xl:inline">
                    ₹{subtotal}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop category bar — compact, with active sliding indicator */}
          <nav aria-label="Product categories" className="hidden md:flex items-center gap-0.5 py-2 overflow-x-auto no-scrollbar border-t border-white/5">
            {CATEGORIES.map((cat) => {
              const Icon = CAT_ICONS[cat.id] ?? Sprout;
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    selected
                      ? "text-[#d4a373]"
                      : "text-stone-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="nav-active-cat"
                      transition={SPRING.dock}
                      className="absolute inset-0 rounded-full bg-[#d4a373]/10"
                      style={{ boxShadow: "inset 0 0 0 1px rgba(212,163,115,0.25)" }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 w-3.5 h-3.5 ${selected ? "text-[#d4a373]" : "text-stone-500"}`}
                    strokeWidth={selected ? 2 : 1.5}
                  />
                  <span className="relative z-10 tracking-tight">{cat.short ?? cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
