"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, BrainCircuit, Package, BarChart2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { SPRING, EASE } from "@/lib/motion";
import { useHaptic } from "@/hooks/use-haptic";
import { useCallback, useState } from "react";

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
    isCart?: boolean;
  }[] = [
    { id: "home", label: "Home", icon: Home, action: onHome },
    { id: "ai", label: "AI", icon: BrainCircuit, action: onOpenAISommelier },
    { id: "matrix", label: "Compare", icon: BarChart2, action: onOpenComparison },
    { id: "orders", label: "Orders", icon: Package, action: onOpenOrders },
    { id: "cart", label: "Cart", icon: ShoppingBag, action: onOpenCart, isCart: true },
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
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ ...SPRING.drawer, duration: 0.4 }}
          className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div
            className="flex items-center gap-0.5 rounded-full px-1.5 py-1.5 pb-safe border border-white/8"
            style={{
              background: "rgba(10, 15, 10, 0.85)",
              backdropFilter: "blur(32px) saturate(150%)",
              WebkitBackdropFilter: "blur(32px) saturate(150%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.04), 0 8px 32px -4px rgba(0,0,0,0.5)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              const isPressed = pressedId === tab.id;
              const isCart = tab.isCart;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTap(tab.id, tab.action)}
                  whileTap={{ scale: 0.88 }}
                  transition={SPRING.dock}
                  animate={isPressed ? { scale: 0.88 } : { scale: 1 }}
                  className={`relative flex items-center justify-center rounded-full cursor-pointer select-none transition-colors ${
                    isCart
                      ? "w-11 h-11 bg-gradient-to-br from-[#1f431e] to-[#1f431e] border border-[#d4a373]/15"
                      : "w-10 h-10"
                  }`}
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active indicator */}
                  {isActive && !isCart && (
                    <motion.span
                      layoutId="dock-active"
                      transition={SPRING.dock}
                      className="absolute inset-0 rounded-full bg-[#d4a373]/8 border border-[#d4a373]/15"
                    />
                  )}

                  {/* Press ripple */}
                  {isPressed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.2 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE.out }}
                      className="absolute inset-0 rounded-full bg-[#d4a373]/12"
                    />
                  )}

                  <Icon
                    className={`relative z-10 transition-colors duration-200 ${
                      isCart
                        ? "w-[18px] h-[18px] text-[#d4a373]"
                        : isActive
                          ? "w-[18px] h-[18px] text-[#d4a373]"
                          : "w-[17px] h-[17px] text-stone-500"
                    }`}
                    strokeWidth={isActive || isCart ? 2 : 1.5}
                  />

                  {/* Cart badge */}
                  {isCart && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={SPRING.bouncy}
                      className="absolute -top-1 -right-1 bg-[#d4a373] text-[#0a0f0a] text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-[#0a0f0a]"
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
