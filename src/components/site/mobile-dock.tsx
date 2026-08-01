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
            className="flex items-center gap-1 rounded-2xl px-2 py-1.5 pb-safe border border-white/8"
            style={{
              background: "rgba(10, 15, 10, 0.88)",
              backdropFilter: "blur(28px) saturate(140%)",
              WebkitBackdropFilter: "blur(28px) saturate(140%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 6px 24px -4px rgba(0,0,0,0.5)",
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
                  className="relative flex flex-col items-center justify-center w-12 h-12 rounded-xl cursor-pointer select-none"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active background — uniform for all tabs including cart */}
                  {isActive && (
                    <motion.span
                      layoutId="dock-active"
                      transition={SPRING.dock}
                      className="absolute inset-0 rounded-xl bg-[#d4a373]/10 border border-[#d4a373]/15"
                    />
                  )}

                  {/* Press ripple */}
                  {isPressed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.15 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE.out }}
                      className="absolute inset-0 rounded-xl bg-[#d4a373]/10"
                    />
                  )}

                  <Icon
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive ? "text-[#d4a373]" : "text-stone-500"
                    }`}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ width: 20, height: 20 }}
                  />

                  {/* Cart badge */}
                  {tab.id === "cart" && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={SPRING.bouncy}
                      className="absolute top-1.5 right-2 bg-[#d4a373] text-[#0a0f0a] text-[9px] font-black min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center border-[1.5px] border-[#0a0f0a] z-20"
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
