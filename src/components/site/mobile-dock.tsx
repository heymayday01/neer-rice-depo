"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, Sparkles, Package, BarChart2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { SPRING, DURATION, EASE } from "@/lib/motion";
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

  const haptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        /* noop */
      }
    }
  }, []);

  const tabs: {
    id: TabId;
    label: string;
    icon: typeof Home;
    action: () => void;
  }[] = [
    { id: "home", label: "Explore", icon: Home, action: onHome },
    { id: "ai", label: "Advisor", icon: Sparkles, action: onOpenAISommelier },
    { id: "matrix", label: "Matrix", icon: BarChart2, action: onOpenComparison },
    { id: "orders", label: "Orders", icon: Package, action: onOpenOrders },
    { id: "cart", label: "Basket", icon: ShoppingBag, action: onOpenCart },
  ];

  const handleTap = (id: TabId, action: () => void) => {
    haptic();
    setPressedId(id);
    // Brief delay so the press animation is visible before the modal opens
    setTimeout(() => {
      action();
      setPressedId(null);
    }, 110);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={{ ...SPRING.drawer, duration: 0.45 }}
          className="sm:hidden fixed bottom-3 left-3 right-3 z-40"
        >
          <div
            className="glass refract-edge px-1.5 py-1.5 rounded-[1.75rem] flex items-center justify-around pb-safe"
            style={{
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
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
                  whileTap={{ scale: 0.82 }}
                  whileHover={{ scale: 1.04 }}
                  transition={SPRING.dock}
                  animate={isPressed ? { scale: 0.82 } : { scale: 1 }}
                  className="relative flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-2xl cursor-pointer min-w-[52px] min-h-[48px] justify-center select-none"
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active background pill — slides between tabs */}
                  {isActive && (
                    <motion.span
                      layoutId="dock-active"
                      transition={SPRING.dock}
                      className="absolute inset-0 bg-gradient-to-br from-[#1f431e]/12 to-[#d4a373]/12 rounded-2xl border border-[#1f431e]/15"
                    />
                  )}

                  {/* Press ripple */}
                  {isPressed && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.4 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE.out }}
                      className="absolute inset-0 rounded-2xl bg-[#1f431e]/15"
                    />
                  )}

                  {/* Active top indicator bar (iOS-style) */}
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scaleX: isActive ? 1 : 0.3,
                    }}
                    transition={SPRING.dock}
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-gradient-to-r from-[#1f431e] to-[#d4a373]"
                  />

                  <div className="relative flex flex-col items-center">
                    <Icon
                      className={`w-[1.15rem] h-[1.15rem] transition-colors duration-200 ${
                        isActive ? "text-[#1f431e]" : "text-stone-500"
                      }`}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                    {tab.id === "cart" && count > 0 && (
                      <motion.span
                        key={count}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={SPRING.bouncy}
                        className="absolute -top-2 -right-2.5 bg-[#d4a373] text-stone-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fdfcfb] shadow-sm"
                      >
                        {count}
                      </motion.span>
                    )}
                  </div>
                  <span
                    className={`relative text-[9px] tracking-tight transition-colors duration-200 ${
                      isActive ? "text-[#1f431e] font-bold" : "text-stone-500 font-semibold"
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
