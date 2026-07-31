"use client";

import { motion } from "framer-motion";
import { Home, ShoppingBag, Sparkles, Package, BarChart2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { SPRING, tapPress } from "@/lib/motion";

interface MobileDockProps {
  active: "home" | "ai" | "matrix" | "orders" | "cart";
  onOpenCart: () => void;
  onOpenAISommelier: () => void;
  onOpenOrders: () => void;
  onOpenComparison: () => void;
  onHome: () => void;
}

export function MobileDock({
  active,
  onOpenCart,
  onOpenAISommelier,
  onOpenOrders,
  onOpenComparison,
  onHome,
}: MobileDockProps) {
  const count = useCart((s) => s.count());

  const tabs = [
    { id: "home", label: "Explore", icon: Home, action: onHome },
    { id: "ai", label: "Advisor", icon: Sparkles, action: onOpenAISommelier },
    { id: "matrix", label: "Matrix", icon: BarChart2, action: onOpenComparison },
    { id: "orders", label: "Orders", icon: Package, action: onOpenOrders },
    { id: "cart", label: "Basket", icon: ShoppingBag, action: onOpenCart },
  ] as const;

  return (
    <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40">
      <div
        className="glass refract-edge px-2 py-1.5 rounded-[1.75rem] flex items-center justify-around pb-safe"
        style={{
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={tapPress}
              onClick={tab.action}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-2xl cursor-pointer min-w-[52px] min-h-[48px] justify-center"
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="dock-active"
                  transition={SPRING.snappy}
                  className="absolute inset-0 bg-gradient-to-br from-[#1f431e]/10 to-[#d4a373]/10 rounded-2xl border border-[#1f431e]/15"
                />
              )}
              <div className="relative flex flex-col items-center">
                <Icon
                  className={`w-[1.15rem] h-[1.15rem] transition-colors ${
                    isActive ? "text-[#1f431e]" : "text-stone-500"
                  }`}
                />
                {tab.id === "cart" && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING.bouncy}
                    className="absolute -top-2 -right-2.5 bg-[#d4a373] text-stone-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fdfcfb]"
                  >
                    {count}
                  </motion.span>
                )}
              </div>
              <span
                className={`relative text-[9px] tracking-tight transition-colors ${
                  isActive ? "text-[#1f431e] font-bold" : "text-stone-500 font-semibold"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
