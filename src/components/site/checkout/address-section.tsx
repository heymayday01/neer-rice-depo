"use client";

/**
 * AddressSection — "Deliver To" card with saved-addresses quick-pick,
 * compact display, and edit form.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  Home, Briefcase, MapPin, Mail, Phone, User, KeyRound, Edit3,
} from "lucide-react";
import { SPRING, EASE } from "@/lib/motion";
import type { CheckoutState } from "./use-checkout-state";
import type { SavedAddress, AddressLabel } from "./types";
import { SectionCard, SectionTitle, Field } from "./atoms";

export function AddressSection({ s }: { s: CheckoutState }) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle icon={MapPin} text="Deliver To" />
        {s.savedAddresses.length > 0 && !s.editingAddress && (
          <button
            onClick={() => s.setShowSavedAddresses(!s.showSavedAddresses)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#a3c4a0] hover:underline cursor-pointer"
          >
            <KeyRound className="h-3 w-3" />
            {s.savedAddresses.length} saved
          </button>
        )}
      </div>

      {/* Saved addresses dropdown */}
      <AnimatePresence initial={false}>
        {s.showSavedAddresses && s.savedAddresses.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.out }}
            className="overflow-hidden mb-3"
          >
            <div className="space-y-1.5">
              {s.savedAddresses.map((addr: SavedAddress) => (
                <SavedAddressRow key={addr.id} addr={addr} onLoad={s.loadSavedAddress} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact display when valid + not editing */}
      {s.hasAddress && !s.editingAddress ? (
        <CompactAddress s={s} />
      ) : (
        <AddressForm s={s} />
      )}
    </SectionCard>
  );
}

function SavedAddressRow({ addr, onLoad }: { addr: SavedAddress; onLoad: (a: SavedAddress) => void }) {
  const Icon = addr.label === "Home" ? Home : addr.label === "Work" ? Briefcase : MapPin;
  return (
    <button
      onClick={() => onLoad(addr)}
      className="w-full flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-[#d4a373]/40 hover:bg-white/5 transition-colors cursor-pointer"
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d4a373]/12 text-[#d4a373]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-stone-100">{addr.fullName} · {addr.label}</p>
        <p className="text-[10px] text-stone-400 mt-0.5 truncate">
          {addr.address}, {addr.city}, {addr.state} {addr.pincode}
        </p>
      </div>
    </button>
  );
}

function CompactAddress({ s }: { s: CheckoutState }) {
  const Icon = s.addressLabel === "Home" ? Home : s.addressLabel === "Work" ? Briefcase : MapPin;
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4a373]/12 text-[#d4a373]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-stone-100">{s.form.fullName}</p>
          <span className="rounded-full bg-[#d4a373]/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a06d3c]">
            {s.addressLabel}
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{s.form.address}</p>
        <p className="text-xs text-stone-400">
          {s.form.city}{s.form.city && ", "}{s.form.state} {s.form.pincode}
        </p>
        <p className="text-xs text-stone-500 mt-1">
          +91 {s.form.phone}{s.form.email && ` · ${s.form.email}`}
        </p>
      </div>
      <button
        onClick={() => s.setEditingAddress(true)}
        className="flex items-center gap-1 text-[11px] font-bold text-[#a3c4a0] hover:underline cursor-pointer shrink-0"
      >
        <Edit3 className="h-3 w-3" />
        Change
      </button>
    </div>
  );
}

function AddressForm({ s }: { s: CheckoutState }) {
  const labels: AddressLabel[] = ["Home", "Work", "Other"];
  const pincodeLookup = s.form.pincode.length === 6 ? lookupPincodeLocal(s.form.pincode) : null;

  return (
    <div className="space-y-3">
      {/* Address label pills */}
      <div className="flex gap-2">
        {labels.map((l) => {
          const Icon = l === "Home" ? Home : l === "Work" ? Briefcase : MapPin;
          const sel = s.addressLabel === l;
          return (
            <button
              key={l}
              onClick={() => s.setAddressLabel(l)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                sel ? "bg-[#1f431e] text-white" : "bg-white/5 text-stone-400 hover:bg-white/10"
              }`}
            >
              <Icon className="h-3 w-3" />
              {l}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5">
        <Field label="Full Name *" value={s.form.fullName} onChange={s.set("fullName")} placeholder="Aarav Sharma" icon={User} error={s.errors.fullName} errorText="Required" valid={!s.errors.fullName && s.form.fullName !== ""} />
        <Field label="Phone *" value={s.form.phone} onChange={s.set("phone")} placeholder="9876543210" type="tel" icon={Phone} error={s.errors.phone} errorText="10-digit number" valid={!s.errors.phone && s.form.phone !== ""} prefix="+91" />
      </div>
      <Field label="Email" value={s.form.email} onChange={s.set("email")} placeholder="aarav@email.com" type="email" icon={Mail} error={s.errors.email} errorText="Enter a valid email" />
      <Field label="Address *" value={s.form.address} onChange={s.set("address")} placeholder="Flat 4B, 123 Grain Lane, Near Mill" icon={MapPin} error={s.errors.address} errorText="Required" valid={!s.errors.address && s.form.address !== ""} />
      <div className="grid sm:grid-cols-3 gap-2.5">
        <Field label="City" value={s.form.city} onChange={s.set("city")} placeholder="Pune" />
        <Field label="State" value={s.form.state} onChange={s.set("state")} placeholder="Maharashtra" />
        <Field
          label="Pincode *"
          value={s.form.pincode}
          onChange={s.set("pincode")}
          placeholder="411038"
          type="tel"
          error={s.errors.pincode}
          errorText="6-digit"
          valid={!s.errors.pincode && s.form.pincode !== ""}
          hint={pincodeLookup ? `✓ ${pincodeLookup.city}, ${pincodeLookup.state}` : undefined}
        />
      </div>

      {s.hasAddress && (
        <button
          onClick={() => s.setEditingAddress(false)}
          className="w-full rounded-xl bg-[#1f431e] text-white py-2.5 text-xs font-bold hover:bg-[#16321a] transition-colors cursor-pointer"
        >
          Save Address
        </button>
      )}
    </div>
  );
}

// Local import to avoid circular dependency
import { lookupPincode } from "./types";
function lookupPincodeLocal(pin: string) {
  return lookupPincode(pin);
}
