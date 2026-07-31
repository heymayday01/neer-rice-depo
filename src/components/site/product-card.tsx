"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Eye, Check } from "lucide-react";
import { RiceProduct } from "@/lib/types";
import { getPriceForWeight } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { SPRING, swapUp, hoverLift, tapPress, cleanRise } from "@/lib/motion";
import { SmartImage } from "./smart-image";
import { RadialGauge } from "./radial-gauge";

interface ProductCardProps {
  product: RiceProduct;
  onOpenDetail: (p: RiceProduct) => void;
}

function ProductCardImpl({ product, onOpenDetail }: ProductCardProps) {
  const [weight, setWeight] = useState<number>(product.availableWeights[0] ?? 1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const { final, original, savings, perKg } = getPriceForWeight(product, weight);
  const discountPct = product.discountedPricePerKg
    ? Math.round(
        ((product.pricePerKg - product.discountedPricePerKg) / product.pricePerKg) * 100
      )
    : 0;

  const handleAdd = () => {
    add(product, weight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      variants={cleanRise}
      whileHover={hoverLift}
      transition={SPRING.gentle}
      className="rounded-3xl flex flex-col justify-between overflow-hidden group relative border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/20 transition-colors"
    >
      <div>
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-[#0a1209]">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="w-full h-56"
            hoverScale={1.08}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1209] via-[#0a1209]/20 to-transparent pointer-events-none" />

          {/* Minimal top labels — hairline borders */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[70%]">
            {discountPct > 0 && (
              <span className="text-[#d4a373] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#d4a373]/40 bg-[#d4a373]/10 uppercase tracking-wider">
                −{discountPct}%
              </span>
            )}
          </div>

          {/* Eye button — ghost */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={tapPress}
            onClick={() => onOpenDetail(product)}
            className="absolute top-3 right-3 p-2.5 text-stone-300 hover:text-white rounded-full border border-white/15 hover:border-white/30 backdrop-blur-md bg-black/20 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label={`View ${product.name} details`}
          >
            <Eye className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>

          {/* Bottom image meta — minimal text */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs gap-2">
            <span className="text-stone-300 text-[10px] font-mono tracking-wide">
              {product.grainType} · {product.agingMonths}m
            </span>
            <span className={`text-[10px] font-mono tracking-wide ${
              product.giIndex.includes("Low") ? "text-[#d4a373]" : "text-stone-400"
            }`}>
              GI {product.giIndex.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#d4a373]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500 truncate">
                {product.originRegion.split(",")[0]}
              </span>
            </div>
            {/* Live stock indicator */}
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-stone-500 data-mono">
                {product.stockKg > 1000 ? "In stock" : "Limited"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-[#d4a373] transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.nativeName && (
              <p className="text-xs text-stone-500 font-serif italic mt-0.5">
                {product.nativeName}
              </p>
            )}
          </div>

          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-light">
            {product.tagline}
          </p>

          {/* Data viz: radial gauge for aroma + rating + GI */}
          <div className="flex items-center justify-between pt-2 border-t border-white/8">
            <div className="flex items-center gap-1 text-[#d4a373]">
              <Star className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
              <span className="font-bold text-white data-mono text-xs">{product.rating}</span>
              <span className="text-stone-500 text-[10px] data-mono">({product.reviewsCount})</span>
            </div>
            <RadialGauge value={product.aromaLevel} max={5} size={28} label="Aroma" />
          </div>

          {/* Weight selector — ghost pills */}
          <div className="pt-1">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Weight</span>
              {weight >= 10 && (
                <span className="text-[9px] font-bold text-[#d4a373] uppercase tracking-wider">
                  Bulk savings
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.availableWeights.map((w) => {
                const selected = weight === w;
                return (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`relative py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[34px] ${
                      selected
                        ? "text-white border border-[#d4a373]/60 bg-[#d4a373]/10"
                        : "text-stone-400 hover:text-white border border-white/12 hover:border-white/25"
                    }`}
                    aria-pressed={selected}
                    aria-label={`Select ${w} kg bag`}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`weight-${product.id}`}
                        transition={SPRING.dock}
                        className="absolute inset-0 rounded-full"
                        style={{ boxShadow: "inset 0 0 0 1px rgba(212,163,115,0.4)" }}
                      />
                    )}
                    <span className="relative z-10">{w}kg</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-serif text-white">₹{final}</span>
              {savings > 0 && (
                <span className="text-xs text-stone-600 line-through data-mono">₹{original}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-stone-500 data-mono tracking-wide">
                ₹{perKg}/kg
              </p>
              {savings > 0 && (
                <span className="eco-badge">Save ₹{savings}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenDetail(product)}
            className="text-[11px] font-bold uppercase tracking-wider text-stone-400 hover:text-[#d4a373] transition-colors cursor-pointer shrink-0"
          >
            Guide
          </button>
        </div>

        <motion.button
          whileHover={hoverLift}
          whileTap={tapPress}
          onClick={handleAdd}
          className={`btn-primary-glow shine-on-hover w-full py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] ${
            added
              ? "bg-[#2d5a27] text-white"
              : "bg-gradient-to-br from-[#1f431e] to-[#2d5a27] hover:from-[#16331a] hover:to-[#1f431e] text-white"
          }`}
        >
          <motion.span
            key={added ? "added" : "add"}
            variants={swapUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-[#e9c496]" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#e9c496]" />
                Add {weight}kg · ₹{final}
              </>
            )}
          </motion.span>
        </motion.button>
      </div>
    </motion.article>
  );
}

// Memoized — prevents re-render of all cards when cart/state updates elsewhere
export const ProductCard = memo(ProductCardImpl);
