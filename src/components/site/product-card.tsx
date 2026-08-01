"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Eye, Check, ChevronRight } from "lucide-react";
import { RiceProduct } from "@/lib/types";
import { getPriceForWeight } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { SPRING, swapUp, hoverLift, tapPress, cleanRise } from "@/lib/motion";
import { SmartImage } from "./smart-image";
import { RadialGauge } from "./radial-gauge";
import { useHaptic } from "@/hooks/use-haptic";

interface ProductCardProps {
  product: RiceProduct;
  onOpenDetail: (p: RiceProduct) => void;
}

function ProductCardImpl({ product, onOpenDetail }: ProductCardProps) {
  const [weight, setWeight] = useState<number>(product.availableWeights[0] ?? 1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const haptic = useHaptic();

  const { final, original, savings, perKg } = getPriceForWeight(product, weight);
  const discountPct = product.discountedPricePerKg
    ? Math.round(
        ((product.pricePerKg - product.discountedPricePerKg) / product.pricePerKg) * 100
      )
    : 0;

  const handleAdd = () => {
    haptic("success");
    add(product, weight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWeightChange = (w: number) => {
    haptic("selection");
    setWeight(w);
  };

  return (
    <motion.article
      variants={cleanRise}
      whileHover={hoverLift}
      transition={SPRING.gentle}
      className="rounded-3xl flex flex-col justify-between overflow-hidden group relative border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/20 transition-colors"
    >
      <div>
        {/* Image — tappable for details */}
        <div
          className="relative h-48 overflow-hidden bg-[#0a0f0a] cursor-pointer"
          onClick={() => onOpenDetail(product)}
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            className="w-full h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/20 to-transparent pointer-events-none" />

          {/* Discount badge */}
          {discountPct > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="text-[#d4a373] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#d4a373]/40 bg-[#d4a373]/10 uppercase tracking-wider">
                −{discountPct}%
              </span>
            </div>
          )}

          {/* Eye button — 44px tap target */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="absolute top-2.5 right-2.5 w-11 h-11 text-stone-300 hover:text-white rounded-full border border-white/15 hover:border-white/30 backdrop-blur-md bg-black/20 transition-colors cursor-pointer flex items-center justify-center z-10"
            aria-label={`View ${product.name} details`}
          >
            <Eye className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Bottom image meta */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="text-stone-400 text-[10px] font-mono tracking-wide">
              {product.grainType} · {product.agingMonths}m
            </span>
            <span className={`text-[10px] font-mono tracking-wide ${
              product.giIndex.includes("Low") ? "text-[#d4a373]" : "text-stone-500"
            }`}>
              GI {product.giIndex.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2.5">
          {/* Origin + stock */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 truncate">
              {product.originRegion.split(",")[0]}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                {product.stockKg > 1000 ? "In stock" : "Limited"}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-serif font-bold text-base text-white group-hover:text-[#d4a373] transition-colors line-clamp-1 leading-tight">
              {product.name}
            </h3>
            {product.nativeName && (
              <p className="text-[11px] text-stone-400 font-serif italic mt-0.5">
                {product.nativeName}
              </p>
            )}
          </div>

          {/* Tagline — improved contrast */}
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Rating + Aroma */}
          <div className="flex items-center justify-between pt-2 border-t border-white/8">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
              <span className="font-bold text-white font-mono text-xs">{product.rating}</span>
              <span className="text-stone-400 text-[10px] font-mono">({product.reviewsCount})</span>
            </div>
            <RadialGauge value={product.aromaLevel} max={5} size={26} label="Aroma" />
          </div>

          {/* Weight selector */}
          <div className="pt-0.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Weight</span>
              {weight >= 10 && (
                <span className="text-[10px] font-bold text-[#d4a373] uppercase tracking-wider">
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
                    onClick={() => handleWeightChange(w)}
                    className={`relative h-10 rounded-xl text-[11px] font-bold transition-all cursor-pointer overflow-hidden border ${
                      selected
                        ? "text-white border-[#d4a373]/50 bg-[#d4a373]/10"
                        : "text-stone-500 hover:text-white border-white/10 hover:border-white/20"
                    }`}
                    aria-pressed={selected}
                    aria-label={`Select ${w} kg bag`}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`weight-${product.id}`}
                        transition={SPRING.dock}
                        className="absolute inset-0 rounded-xl"
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
      <div className="p-4 pt-0 space-y-2.5">
        {/* Price row — cleaner spacing */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black font-serif text-white">₹{final}</span>
            {savings > 0 && (
              <span className="text-[11px] text-stone-500 line-through font-mono">₹{original}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-stone-500 font-mono">
              ₹{perKg}/kg
            </span>
            <button
              onClick={() => onOpenDetail(product)}
              className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-[#d4a373] transition-colors cursor-pointer shrink-0"
            >
              Guide
              <ChevronRight className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <motion.button
          whileHover={hoverLift}
          whileTap={tapPress}
          onClick={handleAdd}
          className={`btn-primary-glow w-full h-12 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            added
              ? "bg-[#1f431e] text-white"
              : "bg-gradient-to-br from-[#1f431e] to-[#1f431e] hover:from-[#1f431e] hover:to-[#1f431e] text-white"
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
                <Check className="w-4 h-4 text-[#d4a373]" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
                Add {weight}kg · ₹{final}
              </>
            )}
          </motion.span>
        </motion.button>
      </div>
    </motion.article>
  );
}

// Memoized
export const ProductCard = memo(ProductCardImpl);
