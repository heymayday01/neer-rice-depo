"use client";

/**
 * BillCard — sticky desktop sidebar with items, coupon, breakdown, savings, ETA.
 * MobileBillSummary — collapsible mobile version of the same.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Package, CheckCircle2, Tag, ChevronDown, ChevronRight as ChevronRightIcon,
  Sparkles, Star, Truck, Plus, Minus,
} from "lucide-react";
import { SPRING, EASE } from "@/lib/motion";
import { useCart } from "@/lib/cart-store";
import { SmartImage } from "@/components/site/smart-image";
import type { CheckoutState } from "./use-checkout-state";
import {
  COUPON_HINTS, ORDER_BUMP, FREE_SHIP_THRESHOLD,
} from "./types";
import { BillRow } from "./atoms";

interface BillCardProps {
  s: CheckoutState;
}

export function BillCard({ s }: BillCardProps) {
  const [itemsExpanded, setItemsExpanded] = useState(true);
  return (
    <div className="flex flex-col px-5 py-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-base font-bold text-stone-100">Bill Details</h3>
        <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold text-stone-400">
          {s.count} {s.count === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Free shipping progress */}
      <FreeShipProgress s={s} />

      {/* Items list — collapsible */}
      <div className="mb-3">
        <button
          onClick={() => setItemsExpanded(!itemsExpanded)}
          className="w-full flex items-center justify-between mb-2 cursor-pointer"
        >
          <span className="text-[11px] font-bold text-stone-300">
            {itemsExpanded ? "Hide items" : `Show ${s.count} items`}
          </span>
          <motion.span animate={{ rotate: itemsExpanded ? 180 : 0 }} transition={SPRING.snappy}>
            <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {itemsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE.out }}
              className="overflow-hidden"
            >
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {s.items.map((i) => (
                  <BillItem key={`${i.productId}-${i.selectedWeightKg}`} item={i} onUpdateQty={s.updateQty} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order bump upsell */}
      <OrderBump s={s} />

      {/* Coupon strip */}
      <CouponStrip s={s} />

      {/* Bill breakdown */}
      <div className="space-y-1.5 py-3 border-t border-dashed border-white/10">
        <BillRow label="Item Total" value={`₹${s.subtotal}`} />
        {s.discount > 0 && <BillRow label="Discount" value={`−₹${s.discount}`} green />}
        <BillRow label="Delivery Fee" value={s.deliveryFee === 0 ? "FREE" : `₹${s.deliveryFee}`} green={s.deliveryFee === 0} />
        {s.giftWrapFee > 0 && <BillRow label="Gift Wrap" value={`₹${s.giftWrapFee}`} />}
        {s.tipFee > 0 && <BillRow label="Delivery Tip" value={`₹${s.tipFee}`} />}
        {s.orderBumpFee > 0 && <BillRow label="Sample Pack" value={`₹${s.orderBumpFee}`} />}
      </div>

      {/* To Pay */}
      <div className="flex items-center justify-between py-3 border-t border-white/10">
        <span className="text-sm font-bold text-stone-100">To Pay</span>
        <span className="text-xl font-black font-serif text-stone-100">₹{s.total}</span>
      </div>

      {/* Savings + Loyalty */}
      {s.savings > 0 && (
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1f431e]/12 py-1.5 mb-2">
          <Sparkles className="h-3 w-3 text-[#a3c4a0]" />
          <p className="text-[10px] font-bold text-[#a3c4a0]">You save ₹{s.savings} on this order</p>
        </div>
      )}
      <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#d4a373]/30 bg-[#d4a373]/5 py-1.5">
        <Star className="h-3 w-3 text-[#d4a373]" />
        <p className="text-[10px] font-bold text-[#a06d3c]">Earn {s.loyaltyPoints} loyalty points</p>
      </div>

      {/* ETA */}
      <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5">
        <Truck className="h-3.5 w-3.5 text-[#a3c4a0] shrink-0" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Arrives by</p>
          <p className="text-[11px] font-bold text-stone-100">{s.eta}</p>
        </div>
      </div>
    </div>
  );
}

function FreeShipProgress({ s }: { s: CheckoutState }) {
  return (
    <div className={`rounded-xl p-2.5 mb-3 ${s.freeShipMet ? "bg-[#1f431e]/12" : "bg-[#d4a373]/10"}`}>
      {s.freeShipMet ? (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#a3c4a0] shrink-0" />
          <p className="text-[10px] font-bold text-[#a3c4a0]">FREE delivery unlocked!</p>
        </div>
      ) : (
        <div>
          <p className="text-[10px] font-bold text-[#a06d3c] mb-1.5">Add ₹{s.freeShipRemaining} more for FREE delivery</p>
          <div className="h-1 rounded-full bg-[#d4a373]/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((s.subtotal - s.discount) / FREE_SHIP_THRESHOLD) * 100)}%` }}
              transition={{ duration: 0.5, ease: EASE.out }}
              className="h-full rounded-full bg-[#d4a373]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BillItem({
  item,
  onUpdateQty,
}: {
  item: ReturnType<typeof useCart.getState>["items"][number];
  onUpdateQty: (productId: string, weightKg: number, qty: number) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
        <SmartImage src={item.product.image} alt={item.product.name} className="h-full w-full" />
        <span className="absolute -top-1 -right-1 z-10 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#1f431e] px-1 text-[9px] font-black text-white">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {/* Organic marker — gold square (brand consistency) */}
          <span className="flex h-3 w-3 shrink-0 items-center justify-center border-[1.5px] border-[#d4a373] rounded-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a373]" />
          </span>
          <p className="text-[11px] font-bold text-stone-100 truncate">{item.product.name}</p>
        </div>
        <p className="text-[9px] text-stone-500">{item.selectedWeightKg}kg</p>
        <div className="flex items-center gap-1 mt-0.5">
          <button
            onClick={() => onUpdateQty(item.productId, item.selectedWeightKg, item.quantity - 1)}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 text-stone-400 hover:border-[#d4a373] hover:text-[#d4a373] transition-colors cursor-pointer"
            aria-label="Decrease"
          >
            <Minus className="h-2 w-2" strokeWidth={3} />
          </button>
          <span className="text-[9px] font-bold text-stone-300 min-w-[12px] text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQty(item.productId, item.selectedWeightKg, item.quantity + 1)}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 text-stone-400 hover:border-[#d4a373] hover:text-[#d4a373] transition-colors cursor-pointer"
            aria-label="Increase"
          >
            <Plus className="h-2 w-2" strokeWidth={3} />
          </button>
        </div>
      </div>
      <p className="text-[11px] font-black text-stone-100 shrink-0">₹{item.totalPrice}</p>
    </div>
  );
}

function OrderBump({ s }: { s: CheckoutState }) {
  return (
    <AnimatePresence initial={false}>
      {!s.orderBump && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: EASE.out }}
          className="overflow-hidden mb-3"
        >
          <button
            onClick={() => s.setOrderBump(true)}
            className="w-full flex items-center gap-2.5 rounded-xl border border-dashed border-[#d4a373] bg-[#d4a373]/5 p-2.5 text-left cursor-pointer hover:bg-[#d4a373]/10 transition-colors"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4a373] text-white">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-stone-100 truncate">{ORDER_BUMP.name}</p>
              <p className="text-[9px] text-stone-400">{ORDER_BUMP.weight} · {ORDER_BUMP.desc}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] font-black text-[#a06d3c]">₹{ORDER_BUMP.price}</span>
                <span className="text-[9px] text-stone-500 line-through">₹{ORDER_BUMP.originalPrice}</span>
              </div>
            </div>
            <span className="text-[9px] font-extrabold uppercase text-[#a06d3c] shrink-0">Add +</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CouponStrip({ s }: { s: CheckoutState }) {
  return (
    <div className="mb-3">
      {s.appliedCoupon ? (
        <div className="flex items-center justify-between rounded-xl border border-[#1f431e]/30 bg-[#1f431e]/8 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-[#a3c4a0]" />
            <div>
              <p className="text-[11px] font-bold text-[#a3c4a0]">{s.appliedCoupon} applied</p>
              <p className="text-[9px] text-[#a3c4a0]/70">You saved ₹{s.discount}</p>
            </div>
          </div>
          <button
            onClick={s.removeCoupon}
            className="text-[10px] font-bold text-stone-400 hover:text-red-400 cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => s.setShowOffers(!s.showOffers)}
            className="w-full flex items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3 py-2.5 cursor-pointer hover:border-[#d4a373] transition-colors"
          >
            <Tag className="h-4 w-4 text-[#a3c4a0]" />
            <span className="flex-1 text-left text-[11px] font-bold text-stone-300">
              {s.couponInput || "Apply coupon / View offers"}
            </span>
            <ChevronRightIcon className="h-3.5 w-3.5 text-stone-500" />
          </button>
          <AnimatePresence initial={false}>
            {s.showOffers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE.out }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1.5">
                    <input
                      value={s.couponInput}
                      onChange={(e) => s.setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && s.applyCouponInline()}
                      placeholder="ENTER CODE"
                      className="flex-1 px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/30 transition-all tracking-wider"
                    />
                    <button
                      onClick={s.applyCouponInline}
                      className="rounded-lg bg-[#1f431e] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#16321a] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {COUPON_HINTS.map((c) => {
                    const eligible = s.subtotal >= c.minOrder;
                    return (
                      <button
                        key={c.code}
                        onClick={() => eligible && s.applyCouponCode(c.code)}
                        disabled={!eligible}
                        className={`w-full flex items-center gap-2.5 rounded-lg border p-2 text-left transition-all ${
                          eligible
                            ? "border-white/10 hover:border-[#d4a373]/40 cursor-pointer"
                            : "border-white/5 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1f431e]/12 text-[#a3c4a0]">
                          <Sparkles className="h-3 w-3" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-stone-100">{c.code} · {c.off}</p>
                          <p className="text-[9px] text-stone-400">{c.desc}</p>
                        </div>
                        {!eligible && <span className="text-[8px] font-bold text-stone-500">Min ₹{c.minOrder}</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

/* ============ Mobile Bill Summary (collapsible) ============ */
export function MobileBillSummary({ s }: { s: CheckoutState }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-[#a3c4a0]" strokeWidth={2.2} />
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {s.count} {s.count === 1 ? "item" : "items"}
              {s.savings > 0 && <span className="text-[#a3c4a0]"> · Save ₹{s.savings}</span>}
            </p>
            <p className="text-sm font-black font-serif text-stone-100">₹{s.total}</p>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING.snappy}>
          <ChevronDown className="h-4 w-4 text-stone-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.out }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-white/8">
              <FreeShipProgress s={s} />
              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {s.items.map((i) => (
                  <BillItem key={`${i.productId}-${i.selectedWeightKg}`} item={i} onUpdateQty={s.updateQty} />
                ))}
              </div>
              <OrderBump s={s} />
              <CouponStrip s={s} />
              <div className="mt-2.5 pt-2.5 border-t border-dashed border-white/10 space-y-1">
                <BillRow label="Item Total" value={`₹${s.subtotal}`} />
                {s.discount > 0 && <BillRow label="Discount" value={`−₹${s.discount}`} green />}
                <BillRow label="Delivery" value={s.deliveryFee === 0 ? "FREE" : `₹${s.deliveryFee}`} green={s.deliveryFee === 0} />
                {s.giftWrapFee > 0 && <BillRow label="Gift Wrap" value={`₹${s.giftWrapFee}`} />}
                {s.tipFee > 0 && <BillRow label="Tip" value={`₹${s.tipFee}`} />}
                {s.orderBumpFee > 0 && <BillRow label="Sample Pack" value={`₹${s.orderBumpFee}`} />}
              </div>
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
                <span className="text-xs font-bold text-stone-100">To Pay</span>
                <span className="text-base font-black font-serif text-stone-100">₹{s.total}</span>
              </div>
              {s.savings > 0 && (
                <p className="text-center text-[10px] font-bold text-[#a3c4a0] mt-1.5">You save ₹{s.savings}</p>
              )}
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <Star className="h-2.5 w-2.5 text-[#d4a373]" />
                <span className="text-[9px] font-bold text-[#a06d3c]">Earn {s.loyaltyPoints} points · Arrives {s.eta}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
