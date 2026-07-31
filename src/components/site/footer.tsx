"use client";

import { PhoneCall, Mail, MapPin, ArrowRight, Leaf } from "lucide-react";
import { Reveal } from "./reveal";

interface FooterProps {
  onOpenAISommelier: () => void;
}

export function Footer({ onOpenAISommelier }: FooterProps) {
  return (
    <footer className="relative bg-[#0a1209] border-t border-white/8 overflow-hidden mt-auto">
      {/* Top hairline accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a373]/40 to-transparent" />
      {/* Ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-[#1f431e]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
        {/* ===== Top: brand + CTA ===== */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-14 border-b border-white/8">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/5 p-0.5 border border-[#d4a373]/30 overflow-hidden">
                <img
                  src="/neer-logo-premium.png"
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight block leading-none">
                  Neer Rice Depo
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4a373] block mt-1.5">
                  Direct Farmer Depo Hub
                </span>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md font-light">
              Sourcing single-origin heritage grains directly from India's rural
              agricultural cooperatives — bridging traditional paddy farms and
              your dining table with ethical, chemical-free cultivation.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
            <p className="text-xs text-stone-500 leading-relaxed font-light">
              Not sure which grain suits you? Our AI Sommelier curates the perfect
              pairing for your dish, diet, or health goal.
            </p>
            <button
              onClick={onOpenAISommelier}
              className="group flex items-center justify-between gap-3 px-5 py-4 border border-[#d4a373]/30 hover:border-[#d4a373]/60 hover:bg-[#d4a373]/8 text-white rounded-2xl transition-all cursor-pointer"
            >
              <span className="text-sm font-bold tracking-wide">Consult the Sommelier</span>
              <ArrowRight className="w-4 h-4 text-[#d4a373] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Reveal>

        {/* ===== Middle: 3 clean columns ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-14 border-b border-white/8">
          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Aged Basmati",
                "Sona Masoori",
                "Heritage Black Rice",
                "Low GI Grains",
                "Value Bundles",
              ].map((item) => (
                <li key={item}>
                  <span className="text-stone-400 hover:text-white transition-colors cursor-pointer font-light tracking-wide">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+919823011022"
                className="flex items-center gap-2.5 text-stone-400 hover:text-white transition-colors font-light"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#d4a373] shrink-0" strokeWidth={1.5} />
                +91 98230 11022
              </a>
              <a
                href="mailto:support@neerricedepo.com"
                className="flex items-center gap-2.5 text-stone-400 hover:text-white transition-colors font-light"
              >
                <Mail className="w-3.5 h-3.5 text-[#d4a373] shrink-0" strokeWidth={1.5} />
                support@neerricedepo.com
              </a>
              <div className="flex items-start gap-2.5 text-stone-400 font-light">
                <MapPin className="w-3.5 h-3.5 text-[#d4a373] shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="leading-relaxed">
                  Main Grain Market Road,<br />Pune - 411038, Maharashtra
                </span>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4a373]">
              Our Vision
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              We return 12% of net proceeds to community seed-preservation vaults,
              protecting heirloom paddy varieties from extinction.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a373]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse" />
              Verified Farm-to-Table
            </div>
          </div>
        </div>

        {/* ===== Bottom: minimal ===== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-stone-600 font-light tracking-wide">
            © {new Date().getFullYear()} Neer Rice Depo · Handcrafted with reverence for India's farming legacy
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            <Leaf className="w-3 h-3 text-[#d4a373]" strokeWidth={1.5} />
            <span>Uplifting Traditional Paddy Farming</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
