"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState } from "react";

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

  const discountRate = applied ? COUPONS[applied] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) setApplied(code);
    else setApplied(null);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b border-stone-200 bg-white">
          <SheetTitle className="font-serif text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1f431e]" />
            Your Grain Basket
          </SheetTitle>
          <SheetDescription className="text-xs">
            {items.length} {items.length === 1 ? "item" : "items"} ready for
            farm-direct delivery
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#1f431e]/8 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-[#1f431e]/50" />
            </div>
            <div>
              <h3 className="text-lg font-serif text-stone-800">
                Your basket is empty
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-[16rem]">
                Add some organic heirloom grains to get started on your wellness
                journey.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1f431e] text-white rounded-xl text-xs font-bold hover:bg-[#16331a] cursor-pointer"
            >
              Browse Grains
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#faf8f5]">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.selectedWeightKg}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="bg-white rounded-2xl border border-stone-200/90 p-3 flex gap-3 shadow-sm"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium">
                        {item.selectedWeightKg}kg bag · ₹{item.unitPricePerKg}/kg
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
                          <button
                            onClick={() =>
                              update(
                                item.productId,
                                item.selectedWeightKg,
                                item.quantity - 1
                              )
                            }
                            className="p-1 rounded-md hover:bg-white cursor-pointer"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3 text-stone-600" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              update(
                                item.productId,
                                item.selectedWeightKg,
                                item.quantity + 1
                              )
                            }
                            className="p-1 rounded-md hover:bg-white cursor-pointer"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3 text-stone-600" />
                          </button>
                        </div>
                        <span className="text-sm font-black font-serif text-[#1f431e]">
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(item.productId, item.selectedWeightKg)}
                      className="self-start p-1.5 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="border-t border-stone-200 bg-white px-5 py-4 space-y-3">
              {/* Coupon */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon (try NEER10)"
                    className="flex-1 bg-transparent py-2 text-xs font-semibold focus:outline-none placeholder-stone-400 uppercase"
                  />
                  {applied && (
                    <span className="text-[10px] font-bold text-[#1f431e] bg-[#1f431e]/10 px-2 py-0.5 rounded-md">
                      -{Math.round(COUPONS[applied] * 100)}%
                    </span>
                  )}
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-3 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 cursor-pointer"
                >
                  Apply
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#1f431e]">
                    <span>Discount ({applied})</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {subtotal < 999 && subtotal > 0 && (
                  <p className="text-[10px] text-stone-400">
                    Add ₹{999 - subtotal} more for free delivery
                  </p>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
                <span className="text-sm font-bold text-stone-900">Total</span>
                <span className="text-2xl font-black font-serif text-[#1f431e]">
                  ₹{total}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCheckout(applied ?? "")}
                className="w-full py-3 bg-[#1f431e] hover:bg-[#16331a] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
