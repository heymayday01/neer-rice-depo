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
      <div className="bg-[#fdfcfb]/90 backdrop-blur-xl border border-stone-200/70 px-2 py-2 rounded-[1.4rem] shadow-[0_12px_36px_rgba(45,90,39,0.16)] flex items-center justify-around pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={tapPress}
              onClick={tab.action}
              className="relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl cursor-pointer min-w-[56px] min-h-[48px] justify-center"
              aria-label={tab.label}
            >
              {isActive && (
                <motion.span
                  layoutId="dock-active"
                  transition={SPRING.snappy}
                  className="absolute inset-0 bg-[#1f431e]/8 rounded-2xl"
                />
              )}
              <div className="relative flex flex-col items-center">
                <Icon
                  className={`w-[1.15rem] h-[1.15rem] transition-colors ${
                    isActive ? "text-[#1f431e]" : "text-stone-400"
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
                className={`relative text-[9px] tracking-tight font-semibold transition-colors ${
                  isActive ? "text-[#1f431e] font-bold" : "text-stone-500"
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
