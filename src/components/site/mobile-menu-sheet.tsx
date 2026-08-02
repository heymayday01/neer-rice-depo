"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Search, X, BrainCircuit, Flower2, Package, BarChart2, Sprout, Layers, HeartHandshake, Wheat, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/rice-products";
import { SPRING, staggerContainer, EASE } from "@/lib/motion";


interface Props {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenAISommelier: () => void;
  onOpenOrders: () => void;
  onOpenComparison: () => void;
}

const CAT_ICONS: Record<string, typeof Sprout> = {
  all: Wheat,
  daily: Layers,
  heritage: Sprout,
  aromatic: Flower2,
  superfood: HeartHandshake,
  combos: Package,
};

// Staggered entrance variant for menu items
const itemVariant = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: EASE.out as unknown as number[] },
  },
};

export function MobileMenuSheet({
  open,
  onClose,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenAISommelier,
  onOpenOrders,
  onOpenComparison,
}: Props) {
  const selectCat = (id: string) => {
    setActiveCategory(id);
    onClose();
    // Smooth scroll to catalog after menu closes
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="p-0 rounded-t-[24px] max-h-[88vh] overflow-y-auto bg-[#0f1410] border-white/8"
        style={{
          boxShadow: "0 -8px 40px -8px rgba(0,0,0,0.4)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <SheetHeader className="px-5 pt-3 pb-3">
          <SheetTitle className="font-serif text-lg text-white">Browse Grains</SheetTitle>
          <SheetDescription className="text-xs text-stone-400">
            Search and filter the organic heirloom catalog
          </SheetDescription>
        </SheetHeader>

        <motion.div
          variants={staggerContainer(0.06, 0.1)}
          initial="hidden"
          animate="visible"
          className="px-5 pb-8 space-y-5"
        >
          {/* Search */}
          <motion.div variants={itemVariant} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4">
            <Search className="w-4 h-4 text-stone-500" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search grains, regions, dishes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-3 text-sm font-medium text-white focus:outline-none placeholder-stone-500"
              aria-label="Search grains"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-500 hover:text-white p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Quick actions — staggered */}
          <motion.div variants={itemVariant} className="grid grid-cols-3 gap-2">
            {[
              { label: "AI Sommelier", icon: BrainCircuit, action: () => { onOpenAISommelier(); onClose(); } },
              { label: "Grain Matrix", icon: BarChart2, action: () => { onOpenComparison(); onClose(); } },
              { label: "My Orders", icon: Package, action: () => { onOpenOrders(); onClose(); } },
            ].map((a) => (
              <motion.button
                key={a.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={a.action}
                className="flex flex-col items-center gap-1.5 text-[#d4a373] py-3.5 cursor-pointer min-h-[72px] justify-center border border-white/8 hover:border-[#d4a373]/25 hover:bg-[#d4a373]/5 rounded-[16px] transition-all"
              >
                <a.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-bold">{a.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Categories — staggered entrance with blur+rise */}
          <div className="space-y-2">
            <motion.div variants={itemVariant} className="flex items-center gap-2 mb-1">
              <span className="h-px w-4 bg-[#d4a373]/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Categories</span>
            </motion.div>
            {CATEGORIES.map((cat) => {
              const Icon = CAT_ICONS[cat.id] ?? Sprout;
              const selected = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  variants={itemVariant}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectCat(cat.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-[16px] border transition-all cursor-pointer ${
                    selected
                      ? "bg-[#d4a373]/8 text-white border-[#d4a373]/25"
                      : "bg-white/[0.02] text-stone-400 border-white/6 hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border ${
                        selected
                          ? "border-[#d4a373]/25 text-[#d4a373] bg-[#d4a373]/8"
                          : "border-white/8 text-stone-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-bold">{cat.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selected ? "text-[#d4a373]" : "text-stone-600"}`} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
