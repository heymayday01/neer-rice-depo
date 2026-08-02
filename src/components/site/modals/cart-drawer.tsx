"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState } from "react";
import { SPRING, hoverLift, tapPress } from "@/lib/motion";
import { useHaptic } from "@/hooks/use-haptic";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: (coupon: string) => void;
}

const COUPONS: Record<string, number> = {
  NEER10: 0.1,
  ORGANIC15: 0.15,
  FARM20: 0.2,
};

export function CartDrawer({ open, onClose, onCheckout }: Props) {
  const items = useCart((s) => s.items);
  const update = useCart((s) => s.updateQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const haptic = useHaptic();

  const discountRate = applied ? COUPONS[applied] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setApplied(code);
      haptic("success");
    } else {
      setApplied(null);
      haptic("warning");
    }
  };

  const handleUpdateQty = (productId: string, weightKg: number, newQty: number) => {
    haptic("light");
    update(productId, weightKg, newQty);
  };

  const handleRemove = (productId: string, weightKg: number) => {
    haptic("medium");
    remove(productId, weightKg);
  };

  const handleCheckout = () => {
    haptic("medium");
    onCheckout(applied ?? "");
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="bg-[#080c08] border-t border-white/10 max-h-[88vh] rounded-t-3xl">
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-1 w-10 h-1 rounded-full bg-white/15 shrink-0" />

        <DrawerHeader className="px-5 pb-3">
          <DrawerTitle className="font-serif text-lg text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d4a373]" strokeWidth={1.5} />
            Your Grain Basket
          </DrawerTitle>
          <DrawerDescription className="text-xs text-stone-400">
            {items.length} {items.length === 1 ? "item" : "items"} ready for farm-direct delivery
          </DrawerDescription>
        </DrawerHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-20 h-20 rounded-full border border-[#d4a373]/20 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-[#d4a373]/40" strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-lg font-serif text-white">Your basket is empty</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-[16rem]">
                Add some organic heirloom grains to get started on your wellness journey.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.selectedWeightKg}`}
                    layout
                    initial={{ opacity: 0, x: 40, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1, transition: SPRING.gentle }}
                    exit={{ opacity: 0, x: 60, scale: 0.96, transition: { duration: 0.28 } }}
                    className="bg-white/[0.03] rounded-2xl border border-white/8 p-3 flex gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium data-mono">
                        {item.selectedWeightKg}kg · ₹{item.unitPricePerKg}/kg
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            transition={SPRING.dock}
                            onClick={() => handleUpdateQty(item.productId, item.selectedWeightKg, item.quantity - 1)}
                            className="p-2 rounded-full hover:bg-white/10 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5 text-stone-400" />
                          </motion.button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={SPRING.bouncy}
                            className="text-xs font-bold w-5 text-center text-white data-mono"
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            transition={SPRING.dock}
                            onClick={() => handleUpdateQty(item.productId, item.selectedWeightKg, item.quantity + 1)}
                            className="p-2 rounded-full hover:bg-white/10 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 text-stone-400" />
                          </motion.button>
                        </div>
                        <span className="text-sm font-black font-serif text-[#d4a373]">
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      transition={SPRING.dock}
                      onClick={() => handleRemove(item.productId, item.selectedWeightKg)}
                      className="self-start p-1.5 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="border-t border-white/8 px-5 py-4 space-y-3">
              {/* Coupon */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 border border-white/8">
                  <Tag className="w-3.5 h-3.5 text-stone-500" strokeWidth={1.5} />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon (try NEER10)"
                    className="flex-1 bg-transparent py-2 text-xs font-semibold text-white focus:outline-none placeholder-stone-500 uppercase"
                  />
                  {applied && (
                    <span className="text-[10px] font-bold text-[#d4a373] bg-[#d4a373]/10 px-2 py-0.5 rounded-full">
                      -{Math.round(COUPONS[applied] * 100)}%
                    </span>
                  )}
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors min-h-[44px]"
                >
                  Apply
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white data-mono">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#d4a373]">
                    <span>Discount ({applied})</span>
                    <span className="font-semibold data-mono">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Delivery</span>
                  <span className="font-semibold text-white data-mono">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {subtotal < 999 && subtotal > 0 && (
                  <p className="text-[10px] text-stone-500">
                    Add ₹{999 - subtotal} more for free delivery
                  </p>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                <span className="text-sm font-bold text-white">Total</span>
                <span className="text-2xl font-black font-serif text-[#d4a373] data-mono">
                  ₹{total}
                </span>
              </div>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={handleCheckout}
                className="btn-primary-glow w-full py-3.5 bg-gradient-to-br from-[#1f431e] to-[#1f431e] hover:from-[#1f431e] hover:to-[#1f431e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 text-[#d4a373]" />
              </motion.button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
