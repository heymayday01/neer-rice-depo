"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, BrainCircuit, Package, BarChart2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { SPRING, EASE } from "@/lib/motion";
import { useHaptic } from "@/hooks/use-haptic";
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
  const count = useCart((s) => s.count());
  const [pressedId, setPressedId] = useState<TabId | null>(null);
  const haptic = useHaptic();

  const tabs: {
    id: TabId;
    label: string;
    icon: typeof Home;
    action: () => void;
  }[] = [
    { id: "home", label: "Home", icon: Home, action: onHome },
    { id: "ai", label: "AI", icon: BrainCircuit, action: onOpenAISommelier },
    { id: "matrix", label: "Compare", icon: BarChart2, action: onOpenComparison },
    { id: "orders", label: "Orders", icon: Package, action: onOpenOrders },
    { id: "cart", label: "Cart", icon: ShoppingBag, action: onOpenCart },
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
          className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div
            className="flex items-center justify-around rounded-full px-3 py-2 pb-safe border border-white/10 refract-edge"
            style={{
              background: "rgba(10, 15, 10, 0.72)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 8px 32px -4px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(212,163,115,0.08)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              const isPressed = pressedId === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTap(tab.id, tab.action)}
                  whileTap={{ scale: 0.9 }}
                  transition={SPRING.dock}
                  animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
                  className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 cursor-pointer select-none"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active background circle */}
                  {isActive && (
                    <motion.span
                      layoutId="dock-active"
                      transition={SPRING.dock}
                      className="absolute top-1.5 w-9 h-9 rounded-full bg-[#d4a373]/12 border border-[#d4a373]/15"
                    />
                  )}

                  {/* Press ripple */}
                  {isPressed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.15 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE.out }}
                      className="absolute top-1.5 w-9 h-9 rounded-full bg-[#d4a373]/10"
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <Icon
                      className={`transition-colors duration-200 ${
                        isActive ? "text-[#d4a373]" : "text-stone-500"
                      }`}
                      strokeWidth={isActive ? 2 : 1.5}
                      style={{ width: 20, height: 20 }}
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
                  {tab.id === "cart" && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={SPRING.bouncy}
                      className="absolute top-0.5 right-1 bg-[#d4a373] text-[#0a0f0a] text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center border-[1.5px] border-[#0a0f0a] z-20"
                    >
                      {count}
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
