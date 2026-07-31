"use client";

import { motion } from "framer-motion";
import { Home, ShoppingBag, Sparkles, Package, BarChart2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";

interface MobileDockProps {
  onOpenCart: () => void;
  onOpenAISommelier: () => void;
  onOpenOrders: () => void;
  onOpenComparison: () => void;
  onHome: () => void;
}

export function MobileDock({
  onOpenCart,
  onOpenAISommelier,
  onOpenOrders,
  onOpenComparison,
  onHome,
}: MobileDockProps) {
  const count = useCart((s) => s.count());

  const tabs = [
    { id: "home", label: "Explore", icon: Home, action: onHome },
    { id: "ai", label: "AI Advisor", icon: Sparkles, action: onOpenAISommelier },
    { id: "matrix", label: "Matrix", icon: BarChart2, action: onOpenComparison },
    { id: "orders", label: "Orders", icon: Package, action: onOpenOrders },
    {
      id: "cart",
      label: "Basket",
      icon: ShoppingBag,
      action: onOpenCart,
      badge: count,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 bg-[#fdfcfb]/95 backdrop-blur-xl border border-stone-200/80 px-2 py-2.5 rounded-3xl shadow-[0_12px_36px_rgba(45,90,39,0.16)] flex items-center justify-around pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={tab.action}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer min-w-[60px] relative text-stone-400 hover:text-[#2d5a27]"
          >
            <div className="relative flex flex-col items-center">
              <Icon className="w-5 h-5" />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-[#d4a373] text-stone-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fdfcfb]">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[9px] tracking-tight font-semibold">
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
