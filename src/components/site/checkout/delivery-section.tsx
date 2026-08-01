"use client";

/**
 * DeliverySection — delivery option radio list + instructions chips +
 * tip selector + gift wrap.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  Truck, Zap, Store, Clock, Leaf, Heart, Gift, Check, MessageSquare,
  DoorOpen, Bell, PhoneCall, ShieldCheck, Sparkles,
} from "lucide-react";
import { SPRING, EASE } from "@/lib/motion";
import type { CheckoutState } from "./use-checkout-state";
import {
  DELIVERY_OPTIONS,
  DELIVERY_INSTRUCTIONS,
  TIP_OPTIONS,
  ORDER_BUMP,
  addDays,
  formatDateRange,
} from "./types";
import { SectionCard, SectionTitle } from "./atoms";

const INSTRUCTION_ICONS: Record<string, typeof DoorOpen> = {
  door: DoorOpen, bell: Bell, call: PhoneCall, contactless: ShieldCheck,
};

export function DeliverySection({ s }: { s: CheckoutState }) {
  return (
    <>
      {/* Delivery Option */}
      <SectionCard>
        <SectionTitle icon={Truck} text="Delivery Option" />
        <div className="mt-3 space-y-2">
          {DELIVERY_OPTIONS.map((opt) => {
            const sel = s.delivery === opt.id;
            const Icon = opt.id === "standard" ? Truck : opt.id === "express" ? Zap : Store;
            const optEta = formatDateRange(addDays(new Date(), opt.days), addDays(new Date(), opt.days + 1));
            const isFree = opt.fee === 0 || (opt.id === "standard" && s.freeShipMet);
            return (
              <button
                key={opt.id}
                onClick={() => s.setDelivery(opt.id)}
                className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  sel
                    ? "border-[#1f431e] bg-[#1f431e]/[0.04] ring-1 ring-[#1f431e]/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sel ? "bg-[#1f431e] text-white" : "bg-white/5 text-stone-400"}`}>
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-stone-100">{opt.label}</p>
                    {opt.id === "express" && <span className="rounded bg-[#d4a373]/20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#a06d3c]">Fastest</span>}
                    {opt.id === "pickup" && <span className="rounded bg-[#1f431e]/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#a3c4a0]">Eco</span>}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">{opt.desc} · {optEta}</p>
                  <p className="flex items-center gap-1 text-[9px] text-stone-500 mt-0.5">
                    <Leaf className="h-2.5 w-2.5" />{opt.carbon}
                  </p>
                </div>
                <span className="text-xs font-black text-stone-100">{isFree ? "FREE" : `₹${opt.fee}`}</span>
                <RadioDot sel={sel} />
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Delivery Instructions */}
      <SectionCard>
        <SectionTitle icon={MessageSquare} text="Delivery Instructions" />
        <div className="mt-3 flex flex-wrap gap-2">
          {DELIVERY_INSTRUCTIONS.map((inst) => {
            const Icon = INSTRUCTION_ICONS[inst.icon] || DoorOpen;
            const sel = s.selectedInstruction === inst.id;
            return (
              <button
                key={inst.id}
                onClick={() => s.setSelectedInstruction(sel ? null : inst.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                  sel ? "border-[#1f431e] bg-[#1f431e]/5 text-[#a3c4a0]" : "border-white/10 bg-white/[0.03] text-stone-400 hover:border-white/20"
                }`}
              >
                <Icon className="h-3 w-3" />
                {inst.label}
              </button>
            );
          })}
        </div>
        <textarea
          value={s.orderNote}
          onChange={(e) => s.setOrderNote(e.target.value)}
          rows={1}
          placeholder="Add a custom note (optional)…"
          className="mt-2.5 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[11px] font-medium text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all resize-none"
        />
      </SectionCard>

      {/* Tip */}
      <SectionCard>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle icon={Heart} text="Delivery Partner Tip" />
          <span className="text-[10px] text-stone-500">100% goes to them</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TIP_OPTIONS.map((t) => {
            const sel = s.tip === t.amount;
            return (
              <button
                key={t.amount}
                onClick={() => s.setTip(t.amount)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-all cursor-pointer ${
                  sel ? "border-[#1f431e] bg-[#1f431e]/[0.04] ring-1 ring-[#1f431e]/20" : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <span className={`text-[10px] font-bold ${sel ? "text-[#a3c4a0]" : "text-stone-400"}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Gift Wrap */}
      <SectionCard>
        <button onClick={() => s.setGiftWrap(!s.giftWrap)} className="w-full flex items-center gap-3 text-left cursor-pointer">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.giftWrap ? "bg-[#d4a373] text-white" : "bg-white/5 text-stone-400"}`}>
            <Gift className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold text-stone-100">Heritage Gift Wrap</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Jute pouch with gold-foil seal</p>
          </div>
          <span className="text-xs font-black text-stone-100">₹49</span>
          <RadioDot sel={s.giftWrap} gold />
        </button>
        <AnimatePresence initial={false}>
          {s.giftWrap && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE.out }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/8">
                <label className="block">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block mb-1.5">
                    Gift Message <span className="text-stone-500 normal-case font-medium">(optional · {s.giftMessage.length}/100)</span>
                  </span>
                  <textarea
                    value={s.giftMessage}
                    onChange={(e) => s.setGiftMessage(e.target.value.slice(0, 100))}
                    rows={2}
                    placeholder="Happy birthday! Enjoy these heritage grains…"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all resize-none"
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Freshness info */}
      <div className="flex items-start gap-2.5 rounded-xl bg-[#1f431e]/8 p-3.5">
        <Sparkles className="h-4 w-4 text-[#a3c4a0] mt-0.5 shrink-0" />
        <p className="text-[11px] text-stone-300 leading-relaxed">
          Every order is vacuum-sealed in food-grade kraft pouches with oxygen absorbers to lock in freshness for up to 6 months.
        </p>
      </div>
    </>
  );
}

function RadioDot({ sel, gold }: { sel: boolean; gold?: boolean }) {
  const activeColor = gold ? "#d4a373" : "#1f431e";
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all`}
      style={{ borderColor: sel ? activeColor : "rgba(255,255,255,0.2)", backgroundColor: sel ? activeColor : "transparent" }}
    >
      {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
    </span>
  );
}
