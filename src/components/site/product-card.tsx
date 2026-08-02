"use client";

import { useState, memo, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Eye, Check, ChevronRight, Plus, Clock, MapPin, Flame } from "lucide-react";
import { RiceProduct } from "@/lib/types";
import { getPriceForWeight } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { SPRING, swapUp, hoverLift, tapPress, cleanRise } from "@/lib/motion";
import { SmartImage } from "./smart-image";
import { RadialGauge } from "./radial-gauge";
import { useHaptic } from "@/hooks/use-haptic";
import { useFlyToCart } from "@/hooks/use-fly-to-cart";

/* Calculate days since harvest for freshness badge */
function getFreshnessDays(harvestDate: string): number {
  const harvest = new Date(harvestDate);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - harvest.getTime()) / (1000 * 60 * 60 * 24)));
}

function getHarvestMonth(harvestDate: string): string {
  return new Date(harvestDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

interface ProductCardProps {
  product: RiceProduct;
  onOpenDetail: (p: RiceProduct) => void;
}

function ProductCardImpl({ product, onOpenDetail }: ProductCardProps) {
  const [weight, setWeight] = useState<number>(product.availableWeights[0] ?? 1);
  const [added, setAdded] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const add = useCart((s) => s.add);
  const haptic = useHaptic();
  const flyToCart = useFlyToCart();
  const cardRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Only enable 3D tilt on desktop (mouse), not mobile (touch causes jank)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Tilt-on-press physics (desktop only)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useTransform(tiltX, [-50, 50], [2, -2]);
  const rotateY = useTransform(tiltY, [-50, 50], [-2, 2]);

  const { final, original, savings, perKg } = getPriceForWeight(product, weight);
  const discountPct = product.discountedPricePerKg
    ? Math.round(
        ((product.pricePerKg - product.discountedPricePerKg) / product.pricePerKg) * 100
      )
    : 0;

  const handleAdd = () => {
    haptic("success");
    // Fly the product image to the cart icon
    if (imgRef.current) {
      flyToCart(imgRef.current, product.image);
    }
    add(product, weight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic("medium");
    // Fly the product image to the cart icon
    if (imgRef.current) {
      flyToCart(imgRef.current, product.image);
    }
    add(product, product.availableWeights[0] ?? 1);
    setShowQuickAdd(true);
    setTimeout(() => setShowQuickAdd(false), 1200);
  };

  const handleWeightChange = (w: number) => {
    haptic("selection");
    setWeight(w);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    tiltX.set(e.clientX - cx);
    tiltY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    animate(tiltX, 0, { duration: 0.4 });
    animate(tiltY, 0, { duration: 0.4 });
  };

  return (
    <motion.article
      ref={cardRef}
      variants={cleanRise}
      whileHover={hoverLift}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
      style={isDesktop ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
      className="rounded-3xl flex flex-col justify-between overflow-hidden group relative border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-white/20 transition-colors duration-300"
    >
      <div>
        {/* Image — tappable + long-press quick-add */}
        <div
          ref={imgRef}
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

          {/* Eye button — 44px */}
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

          {/* Quick-add FAB — appears on hover/tap (innovation: instant add without scrolling) */}
          <motion.button
            onClick={handleQuickAdd}
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-[#d4a373] text-[#0a0f0a] flex items-center justify-center shadow-lg cursor-pointer z-10 md:opacity-0 md:group-hover:opacity-100"
            style={{ boxShadow: "0 4px 16px rgba(212,163,115,0.3)" }}
            aria-label={`Quick add ${product.name}`}
          >
            <AnimatePresence mode="wait">
              {showQuickAdd ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Bottom image meta */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#a3c4a0] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#a3c4a0]/25 bg-[#1f431e]/30 backdrop-blur-sm uppercase tracking-wider">
              <span className="live-dot" style={{ width: 3, height: 3 }} />
              Fresh
            </span>
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
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 truncate">
              <MapPin className="h-2.5 w-2.5 text-[#d4a373] shrink-0" />
              {product.originState}
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

          {/* Tagline */}
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Cooking chips — cook time + water ratio */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[9px] font-bold text-stone-300">
              <Clock className="h-2.5 w-2.5 text-[#d4a373]" />
              {product.cookTimeMins} min
            </span>
            <span className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[9px] font-bold text-stone-300">
              <Flame className="h-2.5 w-2.5 text-[#d4a373]" />
              {product.waterRatio}
            </span>
            <span className="flex items-center gap-1 rounded-full border border-[#a3c4a0]/15 bg-[#1f431e]/8 px-2 py-0.5 text-[9px] font-bold text-[#a3c4a0]">
              <span className="live-dot" style={{ width: 3, height: 3 }} />
              {getHarvestMonth(product.harvestDate)}
            </span>
          </div>

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
                    className={`relative h-11 rounded-xl text-[11px] font-bold transition-all cursor-pointer overflow-hidden border ${
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
              className="flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-[#d4a373] transition-colors cursor-pointer shrink-0 min-h-[36px] px-1"
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
