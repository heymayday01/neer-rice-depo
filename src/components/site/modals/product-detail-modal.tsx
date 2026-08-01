"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Check,
  Flower2,
  Droplets,
  MapPin,
  Timer,
  Award,
  Sprout,
  X,
} from "lucide-react";
import { RiceProduct } from "@/lib/types";
import { getPriceForWeight } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { SPRING, swapUp, hoverLift, tapPress, staggerContainer } from "@/lib/motion";


interface Props {
  product: RiceProduct | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: Props) {
  const [weight, setWeight] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const [prevId, setPrevId] = useState<string | null>(null);

  // Reset weight when product changes (render-phase state adjustment)
  if (product && product.id !== prevId) {
    setPrevId(product.id);
    setWeight(product.availableWeights[0] ?? 1);
  }

  if (!product) return null;

  const { final, original, savings, perKg } = getPriceForWeight(product, weight);
  const n = product.nutritionFacts;

  const handleAdd = () => {
    add(product, weight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0 max-h-[92vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.tagline}</DialogDescription>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#0a0f0a]/90 hover:bg-[#0a0f0a] rounded-full border border-white/10 shadow-sm cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image side */}
          <div className="relative h-64 md:h-full min-h-[320px] bg-[#0a0f0a]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent md:bg-gradient-to-r" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
              {product.badges.map((b) => (
                <span
                  key={b}
                  className="bg-white/[0.06] backdrop-blur-sm text-[#a3c4a0] font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider border border-[#1f431e]/15"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Details side */}
          <motion.div
            variants={staggerContainer(0.05, 0.05)}
            initial="hidden"
            animate="visible"
            className="p-6 sm:p-7 space-y-5"
          >
          <motion.div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4a373]">
                {product.originRegion}
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                {product.name}
              </h2>
              {product.nativeName && (
                <p className="text-sm text-stone-500 font-serif italic">
                  {product.nativeName}
                </p>
              )}
            </div>
          </motion.div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-[#d4a373]">
                <Star className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount})</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <Flower2 className="w-3.5 h-3.5 text-[#d4a373]" strokeWidth={1.5} /> Aroma{" "}
                <strong className="text-white">{product.aromaLevel}/5</strong>
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-medium">
                {product.giIndex}
              </span>
            </div>

            <p className="text-sm text-stone-500 leading-relaxed">
              {product.description}
            </p>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { icon: Droplets, label: "Water Ratio", value: product.waterRatio },
                { icon: Timer, label: "Aged", value: `${product.agingMonths} mo` },
                { icon: Sprout, label: "Grain", value: product.grainType },
                { icon: MapPin, label: "Process", value: product.processing },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.03] rounded-xl p-3 border border-white/10 text-center"
                >
                  <s.icon className="w-4 h-4 text-[#a3c4a0] mx-auto mb-1" />
                  <div className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">
                    {s.label}
                  </div>
                  <div className="text-xs font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Best for */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-2">
                Best For
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.bestFor.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 rounded-full bg-[#1f431e]/8 text-[#a3c4a0] text-[11px] font-bold border border-[#1f431e]/12"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/10">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#d4a373]" />
                Nutrition Facts (per 100g)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Calories</span>
                  <span className="font-bold text-white">{n.caloriesPer100g}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Carbs</span>
                  <span className="font-bold text-white">{n.carbsGrams}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Protein</span>
                  <span className="font-bold text-white">{n.proteinGrams}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Fiber</span>
                  <span className="font-bold text-white">{n.fiberGrams}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">GI Value</span>
                  <span className="font-bold text-white">{n.glycemicIndexValue}</span>
                </div>
              </div>
            </div>

            {/* Weight + add */}
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-stone-400">
                  Select Bag Weight
                </span>
                {weight >= 10 && (
                  <span className="text-[10px] font-bold text-[#a3c4a0] bg-[#1f431e]/10 px-2 py-0.5 rounded-md">
                    Bulk Savings Applied
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.availableWeights.map((w) => {
                  const selected = weight === w;
                  return (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`relative py-2 rounded-lg text-xs font-bold transition-colors border cursor-pointer overflow-hidden ${
                        selected
                          ? "text-white border-[#1f431e]"
                          : "bg-white/5 text-stone-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="detail-weight"
                          transition={SPRING.snappy}
                          className="absolute inset-0 bg-[#1f431e] shadow-sm"
                        />
                      )}
                      <span className="relative z-10">{w} kg</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-serif text-[#a3c4a0]">
                      ₹{final}
                    </span>
                    {savings > 0 && (
                      <span className="text-sm text-stone-400 line-through">
                        ₹{original}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-500 font-medium">
                    ₹{perKg}/kg · Incl. all taxes
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={hoverLift}
                whileTap={tapPress}
                onClick={handleAdd}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  added
                    ? "bg-[#1f431e] text-white"
                    : "bg-[#1f431e] hover:bg-[#1f431e] text-white shadow-sm"
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
                      Added {weight}kg to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
                      Add {weight}kg Bag · ₹{final}
                    </>
                  )}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
