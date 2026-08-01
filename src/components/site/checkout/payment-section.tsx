"use client";

/**
 * PaymentSection — payment method radio list with expandable details +
 * preferences (billing, WhatsApp, newsletter, save address).
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  Smartphone, CreditCard, Building2, Banknote, Check, Wallet,
  Lock, Sparkles, ShieldCheck, Heart,
} from "lucide-react";
import { SPRING, EASE } from "@/lib/motion";
import type { CheckoutState } from "./use-checkout-state";
import { PAYMENTS, formatCardNumber, formatExpiry } from "./types";
import { SectionCard, SectionTitle, ToggleRow } from "./atoms";

const PAYMENT_ICONS = { UPI: Smartphone, CARD: CreditCard, NETBANKING: Building2, COD: Banknote };

export function PaymentSection({ s }: { s: CheckoutState }) {
  return (
    <>
      <SectionCard>
        <SectionTitle icon={Wallet} text="Payment Method" />
        <div className="mt-3 space-y-2">
          {PAYMENTS.map((p) => {
            const sel = s.payment === p.id;
            const Icon = PAYMENT_ICONS[p.id];
            return (
              <div
                key={p.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  sel ? "border-[#1f431e] ring-1 ring-[#1f431e]/20" : "border-white/10"
                }`}
              >
                <button
                  onClick={() => s.setPayment(p.id)}
                  className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sel ? "bg-[#1f431e] text-white" : "bg-white/5 text-stone-400"}`}>
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-100">{p.label}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{p.desc}</p>
                  </div>
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${sel ? "border-[#1f431e] bg-[#1f431e]" : "border-white/20"}`}>
                    {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </span>
                </button>

                {/* Expandable payment details */}
                <AnimatePresence initial={false}>
                  {sel && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE.out }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-1 border-t border-white/8 space-y-2">
                        <PaymentFields s={s} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Preferences */}
      <SectionCard>
        <SectionTitle icon={Sparkles} text="Preferences" />
        <div className="mt-3 space-y-2.5">
          <ToggleRow checked={s.billingSame} onChange={s.setBillingSame} label="Billing address same as shipping" />
          <ToggleRow checked={s.whatsappUpdates} onChange={s.setWhatsappUpdates} label="Order updates via WhatsApp" subtext="Tracking, delivery & ETA" />
          <ToggleRow checked={s.newsletter} onChange={s.setNewsletter} label="Harvest updates & member offers" />
          <ToggleRow checked={s.saveInfo} onChange={s.setSaveInfo} label="Save address for next time" />
        </div>
      </SectionCard>
    </>
  );
}

function PaymentFields({ s }: { s: CheckoutState }) {
  if (s.payment === "UPI") {
    return (
      <>
        <input
          value={s.upiId}
          onChange={(e) => s.setUpiId(e.target.value)}
          placeholder="yourname@okhdfcbank"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all"
        />
        <div className="flex flex-wrap gap-1.5">
          {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
            <span key={app} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-stone-500">
              {app}
            </span>
          ))}
        </div>
      </>
    );
  }
  if (s.payment === "CARD") {
    return (
      <>
        {s.cardType && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#1f431e]/10 px-2 py-1 text-[9px] font-extrabold text-[#a3c4a0]">
            {s.cardType}
          </span>
        )}
        <input
          value={s.cardNumber}
          onChange={(e) => s.setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all font-mono tracking-wider"
        />
        <input
          value={s.cardName}
          onChange={(e) => s.setCardName(e.target.value)}
          placeholder="Name on card"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={s.cardExpiry}
            onChange={(e) => s.setCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            inputMode="numeric"
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all font-mono"
          />
          <input
            value={s.cardCvv}
            onChange={(e) => s.setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
            placeholder="CVV"
            type="password"
            inputMode="numeric"
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all font-mono"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${s.saveCard ? "bg-[#1f431e] border-[#1f431e]" : "border-white/20"}`}>
            {s.saveCard && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
          </span>
          <input type="checkbox" checked={s.saveCard} onChange={(e) => s.setSaveCard(e.target.checked)} className="sr-only" />
          <span className="text-[10px] text-stone-400">Save card securely (tokenized · PCI-DSS)</span>
        </label>
      </>
    );
  }
  if (s.payment === "NETBANKING") {
    return (
      <>
        <select
          value={s.bank}
          onChange={(e) => s.setBank(e.target.value)}
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all cursor-pointer"
        >
          <option value="">Choose your bank…</option>
          {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda", "Yes Bank"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <p className="text-[10px] text-stone-500 flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          You'll be redirected to your bank's secure portal
        </p>
      </>
    );
  }
  // COD
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 py-1">
        <Banknote className="h-4 w-4 text-[#a3c4a0] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-stone-100">Pay with cash on delivery</p>
          <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
            Keep ₹{s.total} ready. Inspect your package before paying. COD orders may take 1 extra day for verification.
          </p>
        </div>
      </div>
    </div>
  );
}
