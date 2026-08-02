"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Search, X, BrainCircuit, Flower2, Package, BarChart2, Sprout, Layers, HeartHandshake, Wheat } from "lucide-react";
import { CATEGORIES } from "@/lib/rice-products";
import { SPRING, staggerContainer } from "@/lib/motion";


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
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="p-0 rounded-t-[1.75rem] max-h-[88vh] overflow-y-auto bg-[#0f1410] border-white/10 shadow-2xl"
      >
        <SheetHeader className="px-5 pt-5 pb-3">
          <SheetTitle className="font-serif text-lg text-white">Browse Grains</SheetTitle>
          <SheetDescription className="text-xs text-stone-400">
            Search and filter the organic heirloom catalog
          </SheetDescription>
        </SheetHeader>

        <div className="px-5 pb-6 space-y-5">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4">
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
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "AI Sommelier", icon: BrainCircuit, action: () => { onOpenAISommelier(); onClose(); } },
              { label: "Grain Matrix", icon: BarChart2, action: () => { onOpenComparison(); onClose(); } },
              { label: "My Orders", icon: Package, action: () => { onOpenOrders(); onClose(); } },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className="flex flex-col items-center gap-1.5 text-[#d4a373] py-3 cursor-pointer min-h-[64px] justify-center border border-white/10 hover:border-[#d4a373]/30 rounded-2xl transition-colors"
              >
                <a.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-bold">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Categories */}
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {CATEGORIES.map((cat) => {
              const Icon = CAT_ICONS[cat.id] ?? Sprout;
              const selected = activeCategory === cat.id;
              return (
                <motion.div key={cat.id}>
                  <button
                    onClick={() => selectCat(cat.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#d4a373]/10 text-white border-[#d4a373]/40"
                        : "bg-white/[0.03] text-stone-400 border-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl border ${
                          selected
                            ? "border-[#d4a373]/30 text-[#d4a373]"
                            : "border-white/10 text-stone-500"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4`}
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-sm font-bold">{cat.label}</span>
                    </div>
                    {selected && (
                      <motion.span
                        layoutId="mobile-cat-dot"
                        transition={SPRING.bouncy}
                        className="w-2 h-2 rounded-full bg-[#d4a373]"
                      />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
