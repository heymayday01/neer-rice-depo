"use client";

/**
 * CheckoutModal — thin orchestrator
 * 
 * Refactored from a 1741-line monolith into a clean composition of:
 * - useCheckoutState hook (all state + logic)
 * - AddressSection, DeliverySection, PaymentSection (left column sections)
 * - BillCard, MobileBillSummary (bill details)
 * - TermsSection, SuccessScreen, PolicyModal, EmptyCartState
 * - Shared atoms (SectionCard, Field, etc.)
 * 
 * This file now only handles: Dialog shell, header, layout, sticky pay bar,
 * and order placement. ~200 lines vs 1741.
 */

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Lock, Truck, ArrowLeft, Loader2, ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { tapPress, hoverLift, SPRING } from "@/lib/motion";
import {
  useCheckoutState,
  AddressSection,
  DeliverySection,
  PaymentSection,
  BillCard,
  MobileBillSummary,
  EmptyCartState,
  SuccessScreen,
  PolicyModal,
} from "@/components/site/checkout";

interface Props {
  open: boolean;
  onClose: () => void;
  coupon: string;
  onOrderPlaced: (trackingId: string) => void;
  onOpenOrderTracker: () => void;
}

export function CheckoutModal({
  open,
  onClose,
  coupon,
  onOrderPlaced,
  onOpenOrderTracker,
}: Props) {
  const s = useCheckoutState(open, coupon);
  const leftColRef = useRef<HTMLDivElement>(null);

  const placeOrder = async () => {
    if (!s.addressValid) { toast.error("Please complete your delivery address"); return; }
    if (!s.paymentValid) { toast.error("Please complete payment details"); return; }
  
    if (s.saveInfo) s.saveCurrentAddress();
    s.setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: s.form, items: s.items,
          paymentMethod: s.payment, deliveryMethod: s.delivery, orderNote: s.orderNote,
          giftWrap: s.giftWrap, giftMessage: s.giftWrap ? s.giftMessage : "",
          tip: s.tip, whatsappUpdates: s.whatsappUpdates,
          addressLabel: s.addressLabel, eta: s.eta,
          couponCode: s.appliedCoupon,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      s.setDone(data.trackingId);
      s.clear();
      toast.success("Order placed successfully!");
      const colors = ["#1f431e", "#d4a373", "#1f431e"];
      confetti({
        particleCount: 60, spread: 70, origin: { y: 0.6 }, gravity: 1.2,
        colors, scalar: 0.9, disableForReducedMotion: true,
      });
      setTimeout(() => {
        confetti({ particleCount: 30, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, gravity: 1.2, colors, disableForReducedMotion: true });
        confetti({ particleCount: 30, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, gravity: 1.2, colors, disableForReducedMotion: true });
      }, 200);
    } catch {
      toast.error("Could not place order. Please try again.");
    } finally {
      s.setPlacing(false);
    }
  };

  const close = () => {
    if (s.done) s.resetState();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent
        className="max-w-5xl sm:max-w-5xl p-0 overflow-hidden max-h-[94vh] gap-0 sm:rounded-[24px] rounded-[20px] bg-[#0a0f0a] text-stone-100 border-white/10"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Secure Checkout</DialogTitle>
        <DialogDescription className="sr-only">
          Complete your order for doorstep delivery
        </DialogDescription>

        {s.done ? (
          <SuccessScreen
            trackingId={s.done}
            copied={s.copied}
            onCopy={() => s.copyTrackingId(s.done!)}
            eta={s.eta}
            total={s.total}
            loyaltyPoints={s.loyaltyPoints}
            paymentMethod={s.payment}
            onTrack={() => {
              onOrderPlaced(s.done!);
              close();
              onOpenOrderTracker();
            }}
            onContinue={close}
          />
        ) : s.items.length === 0 ? (
          <EmptyCartState onClose={close} />
        ) : (
          <div className="flex flex-col max-h-[94vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/8 bg-[#0d140d]/80 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back to cart"
                >
                  <ArrowLeft className="h-4 w-4 text-stone-300" strokeWidth={2.5} />
                </button>
                <div>
                  <h2 className="font-serif text-lg font-bold text-stone-100 leading-tight">Secure Checkout</h2>
                  <p className="text-[10px] font-semibold text-stone-400 flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    256-bit SSL · Draft auto-saved
                  </p>
                </div>
              </div>
              {/* ETA pill */}
              <div className="flex items-center gap-2 rounded-full bg-[#1f431e]/15 px-3 py-1.5">
                <Truck className="h-3.5 w-3.5 text-[#a3c4a0]" strokeWidth={2.5} />
                <span className="text-[11px] font-bold text-[#a3c4a0]">{s.eta}</span>
              </div>
            </div>

            {/* Body: two-column */}
            <div className="grid lg:grid-cols-[1fr_360px] flex-1 overflow-hidden">
              {/* Left: scrollable sections */}
              <div
                ref={leftColRef}
                className="overflow-y-auto bg-[#0a0f0a] order-2 lg:order-1"
              >
                <div className="px-4 sm:px-6 py-5 space-y-3 max-w-2xl mx-auto">
                  {/* Mobile bill summary */}
                  <MobileBillSummary s={s} />

                  {/* Sections */}
                  <AddressSection s={s} />
                  <DeliverySection s={s} />
                  <PaymentSection s={s} />
                </div>
              </div>

              {/* Right: sticky bill card */}
              <aside className="hidden lg:flex flex-col border-l border-white/8 bg-[#0d140d]/40 order-1 lg:order-2 overflow-y-auto">
                <BillCard s={s} />
              </aside>
            </div>

            {/* Sticky bottom pay bar */}
            <div className="border-t border-white/8 bg-[#0d140d]/80 backdrop-blur-xl px-4 sm:px-6 py-3.5 shrink-0">
              <div className="flex items-center gap-3 max-w-2xl mx-auto">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">To Pay</span>
                    {s.savings > 0 && <span className="text-[10px] font-bold text-[#a3c4a0]">Saving ₹{s.savings}</span>}
                  </div>
                  <p className="text-xl font-black font-serif text-stone-100 leading-tight">₹{s.total}</p>
                </div>
                <motion.button
                  whileHover={s.canPlaceOrder ? hoverLift : undefined}
                  whileTap={s.canPlaceOrder ? tapPress : undefined}
                  onClick={placeOrder}
                  disabled={!s.canPlaceOrder || s.placing}
                  className="flex items-center gap-2 rounded-xl px-6 sm:px-10 py-3.5 bg-[#1f431e] text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#1f431e]/20"
                >
                  {s.placing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Placing…</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Place Order</>
                  )}
                </motion.button>
              </div>
              {!s.canPlaceOrder && !s.placing && (
                <p className="text-center text-[10px] mt-1.5">
                  {!s.addressValid ? (
                    <span className="text-[#d4a373] font-bold flex items-center justify-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
                      Complete your delivery address above to continue
                    </span>
                  ) : !s.paymentValid ? (
                    <span className="text-[#d4a373] font-bold flex items-center justify-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
                      {s.payment === "UPI" ? "Enter your UPI ID" : s.payment === "CARD" ? "Enter card details" : s.payment === "NETBANKING" ? "Select your bank" : "Complete payment details"} to continue
                    </span>
                  ) : null}
                </p>
              )}
              {/* Trust badges + terms links */}
              <div className="mt-3 flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-[10px] font-semibold text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-[#a3c4a0]" /> SSL Secured
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-[#a3c4a0]" /> 7-Day Returns
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Truck className="h-3 w-3 text-[#a3c4a0]" /> Farm-Direct
                  </span>
                </div>
                <p className="text-[9px] text-stone-500 text-center">
                  By placing this order you agree to our{" "}
                  <button type="button" onClick={() => s.setPolicyModal("terms")} className="text-[#a3c4a0] underline hover:text-[#d4a373] cursor-pointer">Terms</button>
                  {" "}and{" "}
                  <button type="button" onClick={() => s.setPolicyModal("refund")} className="text-[#a3c4a0] underline hover:text-[#d4a373] cursor-pointer">Refund Policy</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Policy modal — Terms / Refund */}
        <PolicyModal type={s.policyModal} onClose={() => s.setPolicyModal(null)} />
      </DialogContent>
    </Dialog>
  );
}
