"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ShoppingBag,
  Search,
  BrainCircuit, Flower2,
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
  aromatic: BrainCircuit, Flower2,
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
    setScrolled(y > 8);
    if (y > 140 && y > lastY.current) setVisible(false);
    else setVisible(true);
    lastY.current = y;
  });

  return (
    <header
      className={`sticky top-0 z-40 transition-transform duration-300 pt-safe ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top micro-banner (desktop only) */}
      <div className="hidden md:block bg-[#0a0f0a] text-stone-300 text-[11px] py-1.5 px-6 border-b border-[#1f431e]/30">
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

      {/* Main bar — cinematic dark glass */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0f0a]/85 border-white/8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
            : "bg-[#0a0f0a]/60 border-white/5"
        }`}
        style={{
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem] gap-2 sm:gap-3">
            {/* Brand */}
            <button
              onClick={() => {
                setActiveCategory("all");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0 cursor-pointer min-h-[44px]"
              aria-label="Neer Rice Depo home"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border border-[#d4a373]/20 group-hover:border-[#d4a373]/50 transition-all duration-300 shrink-0 bg-gradient-to-br from-[#0f1a0d] to-[#0a0f0a] shadow-sm">
                <img
                  src="/neer-logo-premium.png"
                  alt="Neer Rice Depo"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-1"
                />
              </div>
              <div className="text-left">
                <span className="text-sm md:text-lg font-serif font-bold text-white tracking-tight block leading-none">
                  <span className="md:hidden">Neer Rice</span>
                  <span className="hidden md:inline">Neer Rice Depo</span>
                </span>
                <span className="text-[9px] text-[#d4a373] font-bold uppercase tracking-[0.2em] hidden md:block mt-1">
                  Farm Direct · Heirloom
                </span>
              </div>
            </button>

            {/* Desktop search — pill shape with Cmd+K hint */}
            <div className="hidden sm:block flex-1 max-w-xs md:max-w-md relative">
              <input
                type="text"
                placeholder="Search grains, regions, dishes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-2.5 bg-white/5 border border-white/10 focus:border-[#d4a373]/40 rounded-full text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#d4a373]/20 transition-all font-medium"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" strokeWidth={1.5} />
              {!searchQuery && (
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-stone-500 border border-white/10 rounded px-1.5 py-0.5 data-mono pointer-events-none">
                  ⌘K
                </kbd>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-stone-500 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"
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
                className="p-2.5 text-stone-300 hover:text-white border border-white/10 hover:border-white/25 rounded-full cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </motion.button>
              <motion.button
                whileTap={tapPress}
                onClick={onOpenCart}
                className="relative p-2.5 bg-[#d4a373]/10 border border-[#d4a373]/30 text-[#d4a373] rounded-full cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors hover:bg-[#d4a373]/20"
                aria-label={`Cart with ${count} items`}
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING.bouncy}
                    className="absolute -top-1 -right-1 bg-[#d4a373] text-[#0a0f0a] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0f0a]"
                  >
                    {count}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Desktop actions — ghost pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onOpenComparison}
                title="Compare Grains"
                className="px-3.5 py-2.5 text-stone-400 hover:text-white border border-white/10 hover:border-white/25 text-xs font-bold cursor-pointer hidden lg:flex items-center gap-2 rounded-full transition-colors"
              >
                <BarChart2 className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden xl:inline tracking-tight">Matrix</span>
              </button>

              <button
                onClick={onOpenOrders}
                title="Track Orders"
                className="px-3.5 py-2.5 text-stone-400 hover:text-white border border-white/10 hover:border-white/25 text-xs font-bold cursor-pointer hidden md:flex items-center gap-2 rounded-full transition-colors"
              >
                <Package className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden lg:inline tracking-tight">Orders</span>
              </button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenAISommelier}
                className="px-4 py-2.5 text-[#d4a373] border border-[#d4a373]/30 hover:bg-[#d4a373]/10 text-xs font-bold tracking-tight cursor-pointer flex items-center gap-2 rounded-full transition-colors"
              >
                <BrainCircuit className="w-4 h-4" strokeWidth={1.5} />
                <span>AI Sommelier</span>
              </motion.button>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-[#1f431e] to-[#1f431e] hover:from-[#1f431e] hover:to-[#1f431e] text-white rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4a373]" strokeWidth={1.5} />
                <span className="hidden md:inline">Cart</span>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING.bouncy}
                    className="bg-[#d4a373] text-[#0a0f0a] text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  >
                    {count}
                  </motion.span>
                )}
                {subtotal > 0 && (
                  <span className="text-[11px] font-bold text-[#d4a373] border-l border-white/20 pl-1.5 ml-0.5">
                    ₹{subtotal}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop category bar — ghost pills */}
          <nav className="hidden md:flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-white/5">
            {CATEGORIES.map((cat) => {
              const Icon = CAT_ICONS[cat.id] ?? Sprout;
              const selected = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  whileTap={{ scale: 0.94 }}
                  transition={SPRING.dock}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selected
                      ? "text-white border border-[#d4a373]/50 bg-[#d4a373]/10"
                      : "text-stone-400 hover:text-white border border-white/10 hover:border-white/25"
                  }`}
                >
                  {selected && <span className="w-1 h-1 rounded-full bg-[#d4a373]" />}
                  <Icon
                    className={`w-3.5 h-3.5 ${selected ? "text-[#d4a373]" : "text-stone-500"}`}
                    strokeWidth={1.5}
                  />
                  <span className="tracking-tight">{cat.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
