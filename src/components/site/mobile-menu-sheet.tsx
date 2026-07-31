"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Search, X, Sparkles, Package, BarChart2, Sprout } from "lucide-react";
import { CATEGORIES } from "@/lib/rice-products";
import { SPRING, staggerContainer } from "@/lib/motion";
import { StaggerItem } from "./reveal";

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
  all: Sprout,
  daily: Sprout,
  heritage: Sprout,
  aromatic: Sparkles,
  superfood: Package,
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
        className="p-0 rounded-t-[1.75rem] max-h-[88vh] overflow-y-auto bg-[#fdfcfb] border-stone-200/80 shadow-2xl"
      >
        <SheetHeader className="px-5 pt-5 pb-3">
          <SheetTitle className="font-serif text-lg">Browse Grains</SheetTitle>
          <SheetDescription className="text-xs">
            Search and filter the organic heirloom catalog
          </SheetDescription>
        </SheetHeader>

        <div className="px-5 pb-6 space-y-5">
          {/* Search — pill */}
          <div className="pill flex items-center gap-2 px-4">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search grains, regions, dishes…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-3 text-sm font-semibold focus:outline-none placeholder-stone-400"
              aria-label="Search grains"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-500 hover:text-stone-800 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick actions — frosted pills */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "AI Sommelier", icon: Sparkles, action: () => { onOpenAISommelier(); onClose(); } },
              { label: "Grain Matrix", icon: BarChart2, action: () => { onOpenComparison(); onClose(); } },
              { label: "My Orders", icon: Package, action: () => { onOpenOrders(); onClose(); } },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className="pill flex flex-col items-center gap-1.5 text-[#1f431e] py-3 cursor-pointer min-h-[64px] justify-center"
              >
                <a.icon className="w-5 h-5 text-[#c88a4a]" />
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
                <StaggerItem key={cat.id}>
                  <button
                    onClick={() => selectCat(cat.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#1f431e] text-white border-[#1f431e] shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          selected ? "bg-white/15" : "bg-stone-100"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            selected ? "text-[#d4a373]" : "text-stone-500"
                          }`}
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
                </StaggerItem>
              );
            })}
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
