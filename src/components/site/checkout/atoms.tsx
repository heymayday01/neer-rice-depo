"use client";

/**
 * Checkout — shared UI atoms
 * Small, reusable building blocks for the checkout layout.
 */

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* Frosted-glass section card */
export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
      {children}
    </div>
  );
}

/* Section title with icon */
export function SectionTitle({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#a3c4a0]" strokeWidth={2.3} />
      <h3 className="text-sm font-bold text-stone-100">{text}</h3>
    </div>
  );
}

/* Toggle row — checkbox with label + optional subtext */
export function ToggleRow({
  checked,
  onChange,
  label,
  subtext,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
  subtext?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
          checked ? "bg-[#1f431e] border-[#1f431e]" : "border-white/20"
        }`}
      >
        {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div>
        <span className="text-[11px] font-semibold text-stone-300">{label}</span>
        {subtext && <span className="text-[10px] text-stone-500 ml-1">· {subtext}</span>}
      </div>
    </label>
  );
}

/* Bill row — label + right-aligned value */
export function BillRow({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-stone-400">{label}</span>
      <span className={`text-[11px] font-bold ${green ? "text-[#a3c4a0]" : "text-stone-100"}`}>
        {value}
      </span>
    </div>
  );
}

/* Input field with label, icon, validation states, prefix, hint */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  errorText,
  valid,
  prefix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  icon?: LucideIcon;
  error?: boolean;
  errorText?: string;
  valid?: boolean;
  prefix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block mb-1 flex items-center gap-1.5">
        {label}
        {valid && (
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#a3c4a0]">
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </span>
        )}
      </span>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-xs font-bold text-stone-500 pointer-events-none">
            {prefix}
          </span>
        )}
        {Icon && (
          <Icon
            className={`absolute ${prefix ? "left-11" : "left-3"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${
              error ? "text-red-400" : valid ? "text-[#a3c4a0]" : "text-stone-500"
            }`}
            strokeWidth={2.2}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            prefix ? "pl-16" : Icon ? "pl-9" : "pl-3.5"
          } pr-3.5 py-2.5 bg-white/5 border rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500/40 focus:ring-red-500/20 focus:border-red-500"
              : valid
                ? "border-[#a3c4a0]/40 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40"
                : "border-white/10 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/30"
          }`}
        />
      </div>
      {error && errorText && (
        <span className="mt-0.5 block text-[10px] font-semibold text-red-400">{errorText}</span>
      )}
      {hint && !error && (
        <span className="mt-0.5 block text-[10px] font-semibold text-[#a3c4a0]">{hint}</span>
      )}
    </label>
  );
}
