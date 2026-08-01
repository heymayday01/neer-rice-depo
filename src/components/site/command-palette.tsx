"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft, X } from "lucide-react";
import { RICE_PRODUCTS } from "@/lib/rice-products";
import { SPRING } from "@/lib/motion";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenAISommelier: () => void;
  onOpenComparison: () => void;
}

interface CmdItem {
  id: string;
  label: string;
  hint: string;
  type: "product" | "action" | "category";
  icon?: string;
}

export function CommandPalette({
  open,
  onClose,
  onSelectProduct,
  onSelectCategory,
  onOpenAISommelier,
  onOpenComparison,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevOpen, setPrevOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Render-phase reset when opening (avoids setState-in-effect)
  if (open && !prevOpen) {
    setPrevOpen(true);
    setQuery("");
    setActiveIndex(0);
  } else if (!open && prevOpen) {
    setPrevOpen(false);
  }

  // Build items
  const items: CmdItem[] = [
    { id: "ai-sommelier", label: "Ask AI Grain Sommelier", hint: "Action", type: "action" },
    { id: "compare", label: "Compare All Grains", hint: "Action", type: "action" },
    ...RICE_PRODUCTS.map((p) => ({
      id: p.id,
      label: p.name,
      hint: `₹${p.discountedPricePerKg ?? p.pricePerKg}/kg · ${p.originRegion.split(",")[0]}`,
      type: "product" as const,
    })),
    { id: "all", label: "All Varieties", hint: "Category", type: "category" },
    { id: "daily", label: "Daily Staples", hint: "Category", type: "category" },
    { id: "heritage", label: "Heritage & Unpolished", hint: "Category", type: "category" },
    { id: "aromatic", label: "Aromatic & Basmati", hint: "Category", type: "category" },
    { id: "superfood", label: "Diabetic & Low GI", hint: "Category", type: "category" },
  ];

  const filtered = query.trim()
    ? items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.hint.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  // Focus input on open via rAF
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Execute a selected item
  const executeItem = useCallback(
    (item: CmdItem) => {
      if (item.type === "product") onSelectProduct(item.id);
      else if (item.type === "category") onSelectCategory(item.id);
      else if (item.id === "ai-sommelier") onOpenAISommelier();
      else if (item.id === "compare") onOpenComparison();
      onClose();
    },
    [onSelectProduct, onSelectCategory, onOpenAISommelier, onOpenComparison, onClose]
  );

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) executeItem(item);
      }
    },
    [filtered, activeIndex, executeItem]
  );

  // Scroll active into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 cmdk-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            transition={SPRING.gentle}
            className="w-full max-w-xl glass-float rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
              <Search className="w-4 h-4 text-[#d4a373] shrink-0" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search grains, categories, or actions…"
                className="flex-1 bg-transparent text-sm text-white placeholder-stone-500 focus:outline-none"
              />
              <kbd className="flex items-center gap-1 text-[9px] font-bold text-stone-500 border border-white/10 rounded px-1.5 py-0.5 data-mono">
                <X className="w-2.5 h-2.5" /> ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-stone-500">
                  No results for "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    data-idx={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => executeItem(item)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      idx === activeIndex ? "bg-[#d4a373]/10" : ""
                    }`}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider w-16 shrink-0 ${
                        item.type === "action"
                          ? "text-[#d4a373]"
                          : item.type === "category"
                            ? "text-stone-500"
                            : "text-stone-400"
                      }`}
                    >
                      {item.hint.split(" · ")[0] === item.hint ? item.type : item.hint.split(" · ")[0]}
                    </span>
                    <span className={`flex-1 text-sm ${idx === activeIndex ? "text-white" : "text-stone-300"}`}>
                      {item.label}
                    </span>
                    {idx === activeIndex && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#d4a373] shrink-0" strokeWidth={1.5} />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/8 text-[10px] text-stone-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="data-mono border border-white/10 rounded px-1 py-0.5">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="data-mono border border-white/10 rounded px-1 py-0.5">↵</kbd>
                  select
                </span>
              </div>
              <span className="text-[#d4a373]">Neer Rice Depo</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
