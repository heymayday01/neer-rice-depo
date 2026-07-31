"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Eye, Check, Sparkles } from "lucide-react";
import { RiceProduct } from "@/lib/types";
import { getPriceForWeight } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { SPRING, swapUp, hoverLift, tapPress, fadeRise } from "@/lib/motion";

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
      variants={fadeRise}
      whileHover={hoverLift}
      transition={SPRING.gentle}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-luxe hover:shadow-luxe-lg flex flex-col justify-between overflow-hidden group relative"
    >
      <div>
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#f5f2ed]">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[70%]">
            {discountPct > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={SPRING.bouncy}
                className="bg-[#c88a4a] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider"
              >
                Save {discountPct}%
              </motion.span>
            )}
            {product.badges[0] && (
              <span className="bg-[#1f431e] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                {product.badges[0]}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={tapPress}
            onClick={() => onOpenDetail(product)}
            className="absolute top-3 right-3 p-2.5 bg-white/95 hover:bg-white text-stone-800 rounded-full shadow-sm transition-colors cursor-pointer border border-stone-200"
            title="View cooking ratio & heritage details"
            aria-label="View details"
          >
            <Eye className="w-4 h-4 text-[#1f431e]" />
          </motion.button>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="bg-stone-900/80 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-white/20 backdrop-blur-sm">
              {product.grainType} Grain
            </span>
            <span className="bg-[#1f431e] px-2.5 py-1 rounded-md text-[11px] font-extrabold border border-[#1f431e] shadow-sm">
              {product.agingMonths}m Aged
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c88a4a] font-extrabold uppercase tracking-wider text-[10px] truncate">
              {product.originRegion.split(",")[0]}
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded-md text-[10px] shrink-0 ${
                product.giIndex.includes("Low")
                  ? "bg-[#1f431e]/10 text-[#1f431e] border border-[#1f431e]/20"
                  : "bg-stone-100 text-stone-700 border border-stone-200"
              }`}
            >
              GI: {product.giIndex.split(" ")[0]}
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#1f431e] transition-colors line-clamp-1">
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

          <div className="flex items-center justify-between pt-1 text-xs border-t border-stone-200/80">
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
                  className="text-[10px] font-bold text-[#1f431e] bg-[#1f431e]/10 px-2 py-0.5 rounded-md"
                >
                  Bulk Savings Applied
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
                    className={`relative py-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer overflow-hidden ${
                      selected
                        ? "text-white border-[#1f431e]"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`weight-${product.id}`}
                        transition={SPRING.snappy}
                        className="absolute inset-0 bg-[#1f431e] shadow-sm"
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
      <div className="p-4 bg-stone-50/80 border-t border-stone-200/80 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
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
            className="text-xs text-[#1f431e] font-bold hover:underline cursor-pointer"
          >
            Cooking Guide
          </button>
        </div>

        <motion.button
          whileHover={hoverLift}
          whileTap={tapPress}
          onClick={handleAdd}
          className={`shine-on-hover w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            added
              ? "bg-[#2d5a27] text-white"
              : "bg-[#1f431e] hover:bg-[#16331a] text-white shadow-sm"
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
                Add {weight}kg Bag · ₹{final}
              </>
            )}
          </motion.span>
        </motion.button>
      </div>
    </motion.article>
  );
}
