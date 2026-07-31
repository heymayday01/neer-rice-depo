"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Eye, Check, Sparkles } from "lucide-react";
import { RiceProduct } from "@/lib/types";
import { getPriceForWeight } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { SPRING, swapUp, hoverLift, tapPress, blurReveal } from "@/lib/motion";
import { SmartImage } from "./smart-image";

interface ProductCardProps {
  product: RiceProduct;
  onOpenDetail: (p: RiceProduct) => void;
}

export function ProductCard({ product, onOpenDetail }: ProductCardProps) {
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
      variants={blurReveal}
      whileHover={hoverLift}
      transition={SPRING.gentle}
      className="glass refract-edge rounded-3xl flex flex-col justify-between overflow-hidden group relative"
    >
      <div>
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#f5f2ed]">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="w-full h-52"
            hoverScale={1.08}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[70%]">
            {discountPct > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={SPRING.bouncy}
                className="bg-[#c88a4a] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider"
              >
                Save {discountPct}%
              </motion.span>
            )}
            {product.badges[0] && (
              <span className="bg-gradient-to-br from-[#1f431e] to-[#2d5a27] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                {product.badges[0]}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={tapPress}
            onClick={() => onOpenDetail(product)}
            className="absolute top-3 right-3 p-2.5 glass text-stone-800 rounded-full transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="View cooking ratio & heritage details"
            aria-label={`View ${product.name} details`}
          >
            <Eye className="w-4 h-4 text-[#1f431e]" />
          </motion.button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs gap-2">
            <span className="bg-stone-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/15">
              {product.grainType} Grain
            </span>
            <span className="bg-gradient-to-br from-[#1f431e] to-[#2d5a27] px-2.5 py-1 rounded-full text-[11px] font-extrabold border border-[#1f431e]/40 shadow-sm">
              {product.agingMonths}m Aged
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="text-[#c88a4a] font-extrabold uppercase tracking-wider text-[10px] truncate">
              {product.originRegion.split(",")[0]}
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0 ${
                product.giIndex.includes("Low")
                  ? "bg-[#1f431e]/10 text-[#1f431e] border border-[#1f431e]/20"
                  : "bg-stone-100 text-stone-700 border border-stone-200"
              }`}
            >
              GI: {product.giIndex.split(" ")[0]}
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#1f431e] transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.nativeName && (
              <p className="text-xs text-stone-500 font-serif italic">
                {product.nativeName}
              </p>
            )}
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          <div className="flex items-center justify-between pt-1 text-xs border-t border-stone-200/60">
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-stone-900">{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
              <Sparkles className="w-3 h-3 text-[#c88a4a]" />
              <span>
                Aroma: <strong className="text-stone-900">{product.aromaLevel}/5</strong>
              </span>
            </div>
          </div>

          {/* Weight selector with sliding pill */}
          <div className="pt-1">
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="font-extrabold text-[11px] text-stone-700">Bag Weight:</span>
              {weight >= 10 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING.bouncy}
                  className="text-[10px] font-bold text-[#1f431e] bg-[#1f431e]/10 px-2 py-0.5 rounded-full"
                >
                  Bulk Savings
                </motion.span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.availableWeights.map((w) => {
                const selected = weight === w;
                return (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`relative py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer overflow-hidden min-h-[36px] ${
                      selected
                        ? "text-white"
                        : "bg-white/70 text-stone-700 border border-stone-200/80 hover:bg-white"
                    }`}
                    aria-pressed={selected}
                    aria-label={`Select ${w} kg bag`}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`weight-${product.id}`}
                        transition={SPRING.snappy}
                        className="absolute inset-0 bg-gradient-to-br from-[#1f431e] to-[#2d5a27] shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{w} kg</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/40 border-t border-stone-200/60 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-serif text-[#1f431e]">₹{final}</span>
              {savings > 0 && (
                <span className="text-xs text-stone-400 line-through">₹{original}</span>
              )}
            </div>
            <p className="text-[10px] text-stone-500 font-medium">
              ₹{perKg}/kg · Incl. all taxes
            </p>
          </div>
          <button
            onClick={() => onOpenDetail(product)}
            className="text-xs text-[#1f431e] font-bold hover:underline cursor-pointer shrink-0 min-h-[36px] px-1"
          >
            Cooking Guide
          </button>
        </div>

        <motion.button
          whileHover={hoverLift}
          whileTap={tapPress}
          onClick={handleAdd}
          className={`btn-primary-glow shine-on-hover w-full py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px] ${
            added
              ? "bg-[#2d5a27] text-white"
              : "bg-gradient-to-br from-[#1f431e] to-[#2d5a27] hover:from-[#16331a] hover:to-[#1f431e] text-white shadow-md shadow-[#1f431e]/15"
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
                Added {weight}kg to Cart!
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
