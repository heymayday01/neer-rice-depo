"use client";

import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Heart,
  ArrowRight,
  Award,
  Sprout,
  Sparkles,
  Leaf,
} from "lucide-react";
import { Reveal } from "./reveal";

interface FooterProps {
  onOpenAISommelier: () => void;
}

export function Footer({ onOpenAISommelier }: FooterProps) {
  return (
    <footer className="bg-[#0a1209] text-stone-400 pt-16 pb-12 relative overflow-hidden mt-auto">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a373]/40 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-[#1f431e]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Upper segment */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800/40">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-0.5 border border-[#d4a373]/50 overflow-hidden shadow-md">
                <img
                  src="/neer-logo.jpg"
                  alt="Neer Rice Depo Official Emblem"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-brand text-2xl font-black tracking-[0.14em] text-white block uppercase leading-none">
                  Neer Rice
                </span>
                <span className="text-[10px] font-black text-[#d4a373] tracking-[0.18em] block uppercase mt-1.5">
                  Direct Farmer Depo Hub
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-300/80 leading-relaxed max-w-md font-medium">
              Sourcing single-origin heritage grains directly from India's rural
              agricultural cooperatives. We bridge traditional paddy farms and
              your dining table — promoting ethical, chemical-free cultivation.
            </p>
            <div className="flex items-center gap-2 text-[#d4a373] font-bold uppercase tracking-[0.18em] text-[10px] bg-[#111f10]/55 px-4 py-2 rounded-2xl border border-[#1f431e]/40 w-fit">
              <Leaf className="w-3.5 h-3.5" />
              Certified Organic Supply Chain
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-[#111f10]/40 border border-stone-800/50 rounded-3xl p-6 md:p-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-[#d4a373]" />
                100% Traceability & Purity Guarantee
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-lg">
                Every grain is laboratory-tested, fully unpolished, and naturally
                aged for optimal nutritional density and authentic sensory aromas.
              </p>
            </div>
            <button
              onClick={onOpenAISommelier}
              className="flex items-center gap-2 px-5 py-3 bg-[#d4a373] hover:bg-[#c59464] text-stone-950 rounded-2xl text-xs font-bold transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
            >
              Consult Sommelier
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-stone-800/40">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#d4a373]" />
              Grain Collections
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Aged 1121 Royal Basmati",
                "Unpolished Sona Masoori",
                "Fragrant Indrayani & Ambemohar",
                "Heritage Karuppu Kavuni Black",
                "Diabetic Low GI Grains",
              ].map((item) => (
                <li key={item}>
                  <span className="text-stone-400 hover:text-white transition-colors duration-200 cursor-pointer block font-medium">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" />
              Digital Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={onOpenAISommelier}
                  className="flex items-center gap-2 text-[#d4a373] hover:text-white font-bold transition-colors text-left cursor-pointer"
                >
                  <span>✨</span>
                  AI Sommelier Advisor
                </button>
              </li>
              <li className="text-stone-500 font-semibold leading-normal">
                Bulk B2B & Family Depo Packaging
              </li>
              <li className="text-stone-500 font-semibold leading-normal">
                Doorstep Delivery Across India
              </li>
              <li className="text-stone-500 font-semibold leading-normal">
                Live Order Tracking
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#d4a373]" />
              Our Hub Coordinates
            </h4>
            <div className="space-y-3.5 text-sm font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                <span className="text-stone-400 leading-relaxed">
                  Neer Rice Depo, Main Grain Market Road, Pune - 411038,
                  Maharashtra, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#d4a373]" />
                <span className="text-stone-200">Hotline: +91 98230 11022</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4a373]" />
                <span className="text-stone-400 hover:text-white transition-colors cursor-pointer">
                  support@neerricedepo.com
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Sustainable Vision
            </h4>
            <p className="text-xs text-stone-400/90 leading-relaxed font-medium">
              We return 12% of net proceeds directly to community seed-preservation
              vaults, helping preserve heirloom paddy varieties that otherwise face
              extinction.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/55 border border-emerald-900/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Verified Farm-to-Table Chain
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4 text-center md:text-left">
          <p className="font-semibold">
            © {new Date().getFullYear()} Neer Rice Depo. Handcrafted with reverence
            for India's farming legacy.
          </p>
          <div className="flex items-center gap-1.5 text-[#d4a373] font-bold uppercase tracking-[0.18em] text-[10px] bg-[#111f10]/55 px-4 py-2 rounded-2xl border border-[#1f431e]/40">
            <span>Uplifting Traditional Paddy Farming</span>
            <Heart className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
