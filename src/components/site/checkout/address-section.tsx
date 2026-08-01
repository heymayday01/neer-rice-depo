"use client";

/**
 * AddressSection — "Deliver To" card
 * Improved UX: contact group, address group, location group with clear sections,
 * better validation feedback, pincode auto-fill indicator.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  Home, Briefcase, MapPin, Mail, Phone, User, KeyRound, Edit3,
  Check, Building2, Navigation,
} from "lucide-react";
import { SPRING, EASE } from "@/lib/motion";
import type { CheckoutState } from "./use-checkout-state";
import type { SavedAddress, AddressLabel } from "./types";
import { lookupPincode } from "./types";
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
      className="w-full flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-[#d4a373]/40 hover:bg-white/5 transition-colors cursor-pointer group"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4a373]/12 text-[#d4a373] group-hover:bg-[#d4a373] group-hover:text-white transition-colors">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-stone-100">{addr.fullName}</p>
          <span className="rounded-full bg-[#d4a373]/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#a06d3c]">
            {addr.label}
          </span>
        </div>
        <p className="text-[10px] text-stone-400 mt-0.5 truncate">
          {addr.address}, {addr.city}, {addr.state} {addr.pincode}
        </p>
        <p className="text-[9px] text-stone-500 mt-0.5">+91 {addr.phone}</p>
      </div>
      <span className="text-[9px] font-bold text-[#a3c4a0] shrink-0 self-center">Use →</span>
    </button>
  );
}

function CompactAddress({ s }: { s: CheckoutState }) {
  const Icon = s.addressLabel === "Home" ? Home : s.addressLabel === "Work" ? Briefcase : MapPin;
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4a373]/12 text-[#d4a373]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-stone-100">{s.form.fullName}</p>
          <span className="rounded-full bg-[#d4a373]/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a06d3c]">
            {s.addressLabel}
          </span>
          <span className="flex items-center gap-1 text-[9px] font-bold text-[#a3c4a0]">
            <Check className="h-2.5 w-2.5" /> Verified
          </span>
        </div>
        <p className="text-xs text-stone-300 mt-1 leading-relaxed">{s.form.address}</p>
        <p className="text-xs text-stone-400 mt-0.5">
          {s.form.city}{s.form.city && ", "}{s.form.state} {s.form.pincode}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <p className="text-[11px] text-stone-400 flex items-center gap-1">
            <Phone className="h-2.5 w-2.5 text-[#a3c4a0]" /> +91 {s.form.phone}
          </p>
          {s.form.email && (
            <p className="text-[11px] text-stone-400 flex items-center gap-1">
              <Mail className="h-2.5 w-2.5 text-[#a3c4a0]" /> {s.form.email}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => s.setEditingAddress(true)}
        className="flex items-center gap-1 text-[11px] font-bold text-[#a3c4a0] hover:text-[#d4a373] hover:underline cursor-pointer shrink-0"
      >
        <Edit3 className="h-3 w-3" />
        Change
      </button>
    </div>
  );
}

function AddressForm({ s }: { s: CheckoutState }) {
  const labels: AddressLabel[] = ["Home", "Work", "Other"];
  const pincodeLookup = s.form.pincode.length === 6 ? lookupPincode(s.form.pincode) : null;
  const completedFields = [
    s.form.fullName, s.form.phone, s.form.address, s.form.pincode,
  ].filter(Boolean).length;
  const progress = Math.round((completedFields / 4) * 100);

  return (
    <div className="space-y-4">
      {/* Address type selector — larger, clearer */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-2">
          Address Type
        </p>
        <div className="grid grid-cols-3 gap-2">
          {labels.map((l) => {
            const Icon = l === "Home" ? Home : l === "Work" ? Briefcase : Building2;
            const sel = s.addressLabel === l;
            return (
              <button
                key={l}
                onClick={() => s.setAddressLabel(l)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 text-[11px] font-bold transition-all cursor-pointer ${
                  sel
                    ? "border-[#1f431e] bg-[#1f431e]/10 text-white ring-1 ring-[#1f431e]/20"
                    : "border-white/10 bg-white/[0.03] text-stone-400 hover:border-white/20 hover:text-stone-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${sel ? "text-[#a3c4a0]" : "text-stone-500"}`} strokeWidth={2} />
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact group */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <User className="h-3 w-3 text-[#a3c4a0]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
            Contact Details
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          <Field
            label="Full Name *"
            value={s.form.fullName}
            onChange={s.set("fullName")}
            placeholder="Aarav Sharma"
            icon={User}
            error={s.errors.fullName}
            errorText="Required"
            valid={!s.errors.fullName && s.form.fullName !== ""}
          />
          <Field
            label="Phone *"
            value={s.form.phone}
            onChange={s.set("phone")}
            placeholder="9876543210"
            type="tel"
            icon={Phone}
            error={s.errors.phone}
            errorText="10-digit number"
            valid={!s.errors.phone && s.form.phone !== ""}
            prefix="+91"
          />
        </div>
        <div className="mt-2.5">
          <Field
            label="Email (optional)"
            value={s.form.email}
            onChange={s.set("email")}
            placeholder="aarav@email.com"
            type="email"
            icon={Mail}
            error={s.errors.email}
            errorText="Enter a valid email"
          />
        </div>
      </div>

      {/* Address group */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="h-3 w-3 text-[#a3c4a0]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
            Shipping Address
          </p>
        </div>
        <Field
          label="Street Address *"
          value={s.form.address}
          onChange={s.set("address")}
          placeholder="Flat 4B, 123 Grain Lane, Near Mill"
          icon={MapPin}
          error={s.errors.address}
          errorText="Required"
          valid={!s.errors.address && s.form.address !== ""}
        />
      </div>

      {/* Location group — with pincode autofill */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Navigation className="h-3 w-3 text-[#a3c4a0]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
            Location
          </p>
          {pincodeLookup && (
            <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-[#a3c4a0]">
              <Check className="h-2.5 w-2.5" /> Auto-filled
            </span>
          )}
        </div>
        <div className="grid sm:grid-cols-3 gap-2.5">
          <Field
            label="City"
            value={s.form.city}
            onChange={s.set("city")}
            placeholder="Pune"
            valid={pincodeLookup !== null && s.form.city === pincodeLookup.city}
          />
          <Field
            label="State"
            value={s.form.state}
            onChange={s.set("state")}
            placeholder="Maharashtra"
            valid={pincodeLookup !== null && s.form.state === pincodeLookup.state}
          />
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
        <p className="text-[9px] text-stone-500 mt-1.5 flex items-center gap-1">
          <MapPin className="h-2.5 w-2.5" />
          Enter pincode to auto-fill city & state
        </p>
      </div>

      {/* Save button with progress */}
      {s.hasAddress ? (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => s.setEditingAddress(false)}
          className="w-full rounded-xl bg-[#1f431e] text-white py-3 text-xs font-bold hover:bg-[#16321a] transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4 text-[#a3c4a0]" />
          Save Address & Continue
        </motion.button>
      ) : (
        <div>
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: EASE.out }}
                className={`h-full rounded-full ${progress === 100 ? "bg-[#a3c4a0]" : "bg-[#d4a373]"}`}
              />
            </div>
            <span className="text-[9px] font-bold text-stone-400">{completedFields}/4</span>
          </div>
        </div>
      )}
    </div>
  );
}
