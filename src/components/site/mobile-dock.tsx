"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, BrainCircuit, Package, BarChart2, Sprout } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { SPRING, EASE } from "@/lib/motion";
import { useHaptic } from "@/hooks/use-haptic";
import { useHydrated } from "@/hooks/use-hydrated";
import { useState } from "react";

interface MobileDockProps {
  active: "home" | "ai" | "matrix" | "orders" | "cart";
  visible: boolean;
  onOpenCart: () => void;
  onOpenAISommelier: () => void;
  onOpenOrders: () => void;
  onOpenComparison: () => void;
  onHome: () => void;
}

type TabId = "home" | "ai" | "matrix" | "orders" | "cart";

export function MobileDock({
  active,
  visible,
  onOpenCart,
  onOpenAISommelier,
  onOpenOrders,
  onOpenComparison,
  onHome,
}: MobileDockProps) {
  const hydrated = useHydrated();
  const count = useCart((s) => s.count());
  const displayCount = hydrated ? count : 0;
  const [pressedId, setPressedId] = useState<TabId | null>(null);
  const haptic = useHaptic();

  const tabs: {
    id: TabId;
    label: string;
    icon: typeof Sprout;
    action: () => void;
  }[] = [
    { id: "home", label: "Harvest", icon: Sprout, action: onHome },
    { id: "ai", label: "Sommelier", icon: BrainCircuit, action: onOpenAISommelier },
    { id: "matrix", label: "Compare", icon: BarChart2, action: onOpenComparison },
    { id: "orders", label: "Orders", icon: Package, action: onOpenOrders },
    { id: "cart", label: "Basket", icon: ShoppingBag, action: onOpenCart },
  ];

  const handleTap = (id: TabId, action: () => void) => {
    haptic(id === "cart" ? "medium" : "light");
    setPressedId(id);
    setTimeout(() => {
      action();
      setPressedId(null);
    }, 110);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ ...SPRING.drawer, duration: 0.35 }}
          className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-2"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div
            className="flex items-center justify-around rounded-[28px] px-4 py-2.5 pb-safe relative"
            style={{
              background: "rgba(8, 12, 8, 0.72)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              boxShadow: [
                "inset 0 1px 0 0 rgba(255,255,255,0.06)",
                "inset 0 -0.5px 0 0 rgba(0,0,0,0.3)",
                "0 1px 2px rgba(0,0,0,0.2)",
                "0 12px 40px -4px rgba(0,0,0,0.4)",
                "0 0 0 0.5px rgba(255,255,255,0.06)",
              ].join(", "),
            }}
          >
            {/* Specular top edge — light catch */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-px rounded-full pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
            {/* Fresh harvest pulse — subtle living indicator */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full pointer-events-none"
              style={{
                background: "rgba(31,67,30,0.6)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <span className="live-dot" style={{ width: 4, height: 4 }} />
              <span className="text-[7px] font-bold uppercase tracking-wider text-[#a3c4a0]">Fresh</span>
            </div>

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              const isPressed = pressedId === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTap(tab.id, tab.action)}
                  whileTap={{ scale: 0.88 }}
                  transition={SPRING.dock}
                  className="relative flex flex-col items-center justify-center gap-0.5 w-[56px] h-[56px] cursor-pointer select-none"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active background — pill capsule with glow */}
                  {isActive && (
                    <motion.span
                      layoutId="dock-active"
                      transition={SPRING.dock}
                      className="absolute inset-y-1 inset-x-1 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(212,163,115,0.12), rgba(212,163,115,0.04))",
                        boxShadow: [
                          "inset 0 1px 0 0 rgba(212,163,115,0.15)",
                          "inset 0 -1px 0 0 rgba(0,0,0,0.15)",
                          "0 0 12px rgba(212,163,115,0.08)",
                        ].join(", "),
                      }}
                    />
                  )}

                  {/* Press ripple */}
                  {isPressed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.2 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE.out }}
                      className="absolute inset-1 rounded-2xl bg-[#d4a373]/10"
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Icon
                      className={`transition-colors duration-200 ${
                        isActive ? "text-[#d4a373]" : "text-stone-500"
                      }`}
                      strokeWidth={isActive ? 2.2 : 1.5}
                      style={{ width: 21, height: 21 }}
                    />
                    <span
                      className={`text-[9px] font-bold tracking-tight transition-colors duration-200 ${
                        isActive ? "text-[#d4a373]" : "text-stone-500"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>

                  {/* Cart badge */}
                  {tab.id === "cart" && displayCount > 0 && (
                    <motion.span
                      key={displayCount}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={SPRING.bouncy}
                      className="absolute top-0.5 right-1 bg-[#d4a373] text-[#080c08] text-[9px] font-black min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center z-20"
                      style={{
                        boxShadow: "0 0 0 1.5px #080c08, 0 2px 6px rgba(212,163,115,0.4)",
                      }}
                    >
                      {displayCount}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
