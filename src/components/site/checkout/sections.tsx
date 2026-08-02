"use client";

/**
 * Checkout — Terms section, Success screen, Policy modal, Empty cart state.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  Check, CheckCircle2, Copy, Package, Truck, Wallet, ShieldCheck,
  RefreshCw, X, ShoppingBag, ArrowLeft, Star,
} from "lucide-react";
import { SPRING, EASE, hoverLift, tapPress } from "@/lib/motion";
import type { CheckoutState } from "./use-checkout-state";
import type { PaymentId } from "./types";
import { PAYMENTS } from "./types";

/* ============ Terms Section ============ */
export function TermsSection({ s }: { s: CheckoutState }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-white/20 transition-colors">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${s.agreeTerms ? "bg-[#1f431e] border-[#1f431e]" : "border-white/20"}`}>
        {s.agreeTerms && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={s.agreeTerms}
        onChange={(e) => s.setAgreeTerms(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[11px] text-stone-400 leading-relaxed">
        I agree to Neer Rice Depo&apos;s{" "}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); s.setPolicyModal("terms"); }}
          className="font-bold text-[#a3c4a0] underline hover:text-[#d4a373] transition-colors cursor-pointer"
        >
          Terms of Service
        </button>{" "}and{" "}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); s.setPolicyModal("refund"); }}
          className="font-bold text-[#a3c4a0] underline hover:text-[#d4a373] transition-colors cursor-pointer"
        >
          Refund Policy
        </button>. Grains are non-returnable once opened unless damaged.
      </span>
    </label>
  );
}

/* ============ Empty Cart State ============ */
export function EmptyCartState({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING.gentle}
        className="w-20 h-20 rounded-full bg-[#1f431e]/15 flex items-center justify-center mx-auto mb-5"
      >
        <ShoppingBag className="h-9 w-9 text-[#a3c4a0]" strokeWidth={1.8} />
      </motion.div>
      <h3 className="text-xl font-serif font-bold text-stone-100">Your cart is empty</h3>
      <p className="text-sm text-stone-400 mt-2 max-w-xs mx-auto">
        Add some heritage grains to your basket before checking out.
      </p>
      <button
        onClick={onClose}
        className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white text-xs font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Browse Grains
      </button>
    </div>
  );
}

/* ============ Success Screen ============ */
export function SuccessScreen({
  trackingId, copied, onCopy, eta, total, loyaltyPoints, paymentMethod, onTrack, onContinue,
}: {
  trackingId: string;
  copied: boolean;
  onCopy: () => void;
  eta: string;
  total: number;
  loyaltyPoints: number;
  paymentMethod: PaymentId;
  onTrack: () => void;
  onContinue: () => void;
}) {
  const steps = [
    { icon: Package, title: "Order Packed", desc: "Our team packs your grains with care" },
    { icon: Truck, title: "Out for Delivery", desc: `Arrives by ${eta}` },
    { icon: CheckCircle2, title: "Delivered", desc: "Enjoy your heritage grains!" },
  ];
  const payLabel = PAYMENTS.find((p) => p.id === paymentMethod)?.label || paymentMethod;

  return (
    <div className="overflow-y-auto max-h-[94vh] bg-[#0f1410]">
      <div className="px-6 sm:px-10 py-8 sm:py-10 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full bg-[#1f431e]/15 flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-11 h-11 text-[#a3c4a0]" strokeWidth={2.2} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE.out }}
          className="mt-5"
        >
          <h3 className="text-2xl font-serif font-bold text-stone-100">Order Confirmed!</h3>
          <p className="text-sm text-stone-400 mt-1.5 max-w-sm mx-auto">
            Thank you for choosing heritage grains. A confirmation has been sent to your email{paymentMethod === "COD" ? "" : " and WhatsApp"}.
          </p>
        </motion.div>

        {/* Tracking ID card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE.out }}
          className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 backdrop-blur-xl"
        >
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">Tracking ID</p>
            <p className="text-lg font-black font-mono text-[#a3c4a0] tracking-wider">{trackingId}</p>
          </div>
          <button
            onClick={onCopy}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f431e]/12 hover:bg-[#1f431e]/20 text-[#a3c4a0] transition-colors cursor-pointer"
            aria-label="Copy tracking ID"
          >
            {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2.2} />}
          </button>
        </motion.div>

        {/* Total + payment + ETA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE.out }}
          className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs flex-wrap"
        >
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-[#a3c4a0]" />
            <span className="text-stone-400">Paid</span>
            <span className="font-black text-stone-100">₹{total}</span>
            <span className="text-stone-400">· {payLabel}</span>
          </div>
          <span className="hidden sm:inline h-3 w-px bg-white/15" />
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-[#a3c4a0]" />
            <span className="font-bold text-stone-300">Arrives {eta}</span>
          </div>
        </motion.div>

        {/* Loyalty */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE.out }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d4a373]/30 bg-[#d4a373]/8 px-4 py-2"
        >
          <Star className="h-4 w-4 text-[#d4a373]" />
          <span className="text-xs font-bold text-[#a06d3c]">You earned {loyaltyPoints} loyalty points!</span>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: EASE.out }}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 text-center">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f431e]/12 text-[#a3c4a0] mb-2">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <p className="text-[11px] font-bold text-stone-100">{st.title}</p>
                <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: EASE.out }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={hoverLift}
            whileTap={tapPress}
            onClick={onTrack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#1f431e]/20"
          >
            <Package className="w-4 h-4" /> Track My Order
          </motion.button>
          <motion.button
            whileHover={hoverLift}
            whileTap={tapPress}
            onClick={onContinue}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/15 text-stone-300 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

/* ============ Policy Modal ============ */
export function PolicyModal({
  type,
  onClose,
}: {
  type: null | "terms" | "refund";
  onClose: () => void;
}) {
  const isTerms = type === "terms";
  const content = isTerms
    ? {
        title: "Terms of Service",
        icon: ShieldCheck,
        sections: [
          { h: "1. Orders & Acceptance", p: "All orders are subject to availability and confirmation of the product price. Neer Rice Depo reserves the right to refuse or cancel any order at any stage. Pricing on the site is in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise." },
          { h: "2. Product Quality", p: "Our grains are sourced directly from verified organic farming cooperatives. Each batch is cleaned, graded, and vacuum-sealed in food-grade kraft pouches with oxygen absorbers. We guarantee pesticide-free, single-origin heirloom grains as described per product." },
          { h: "3. Packaging & Shelf Life", p: "Products are packaged to retain freshness for up to 6 months when stored in a cool, dry place. Aged basmati varieties may be stored longer. Each pack carries a harvest date, mill date, and best-before date on the seal." },
          { h: "4. Delivery", p: "Standard delivery arrives within 4 business days; express within 2 business days. Farm pickup is available from our Pune depot. We are not liable for delays caused by courier partners, natural disasters, or events beyond our control." },
          { h: "5. Pricing & Payment", p: "Prices listed at checkout are final. We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. Payment authorizations are processed over 256-bit SSL encrypted channels. No hidden charges are added post-checkout." },
          { h: "6. Privacy", p: "Your personal information (name, contact, address) is used solely for order fulfilment and delivery updates. We do not sell or share your data with third parties. WhatsApp updates are opt-in only." },
          { h: "7. Liability", p: "Our maximum liability for any product is limited to the purchase price paid. We are not liable for indirect or consequential damages arising from product use. Grains are non-returnable once the seal is opened unless found damaged or incorrect at delivery." },
        ],
      }
    : {
        title: "Refund & Return Policy",
        icon: RefreshCw,
        sections: [
          { h: "1. 7-Day Return Window", p: "If you receive a damaged, spoiled, or incorrect product, you may request a return within 7 days of delivery. The pack must be unopened and in its original packaging with the seal intact, except in cases of damage at delivery." },
          { h: "2. How to Initiate a Return", p: "Email us at care@neerricedepo.in or call +91 98230 11022 with your tracking ID and a photo of the product. Our team will verify and arrange a reverse pickup within 48 hours. No return shipping fee is charged for verified quality issues." },
          { h: "3. Refund Processing", p: "Approved refunds are processed within 5–7 business days to the original payment method. UPI and card refunds reflect fastest (3–5 days); COD orders are refunded via bank transfer or UPI. You will receive a confirmation email once the refund is initiated." },
          { h: "4. Non-Returnable Items", p: "Opened packs of rice cannot be returned due to food safety regulations — unless the product was damaged, infested, or incorrect upon delivery. Gift-wrapped items and combo bundles are returnable only as complete sets." },
          { h: "5. Damaged at Delivery", p: "If your package arrives torn, wet, or with a broken seal, please refuse acceptance from the courier or notify us within 24 hours with photos. We will ship a replacement at no cost or issue a full refund — your choice." },
          { h: "6. Order Cancellation", p: "Orders can be cancelled free of charge before dispatch (usually within 4 hours of ordering). Once dispatched, cancellation is not possible, but the standard return policy applies after delivery." },
          { h: "7. Quality Guarantee", p: "Every batch is lab-tested for purity and moisture. If you are unsatisfied with the grain quality (aroma, texture, taste), reach out — we stand behind our products and will make it right." },
        ],
      };

  return (
    <AnimatePresence>
      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 8, opacity: 0 }}
            transition={SPRING.snappy}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0f1410] overflow-hidden"
            style={{ boxShadow: "0 24px 64px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f431e]/15 text-[#a3c4a0]">
                  <content.icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-100 leading-tight">{content.title}</h3>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider">Neer Rice Depo</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-5 py-4 space-y-4">
              {content.sections.map((s, i) => (
                <div key={i}>
                  <h4 className="text-xs font-bold text-[#d4a373] mb-1 tracking-tight">{s.h}</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{s.p}</p>
                </div>
              ))}
              <div className="rounded-xl border border-[#1f431e]/15 bg-[#1f431e]/8 px-3 py-2.5 mt-2">
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  <strong className="text-[#a3c4a0]">Need help?</strong> Email{" "}
                  <span className="text-[#d4a373]">care@neerricedepo.in</span> or call{" "}
                  <span className="text-[#d4a373]">+91 98230 11022</span>. Our team responds within 24 hours.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/8 shrink-0">
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-[#1f431e] hover:bg-[#16321a] text-white py-2.5 text-xs font-bold transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
