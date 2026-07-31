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
  Sparkles,
  Loader2,
  Send,
  ShoppingBag,
  Check,
  ChefHat,
  HeartPulse,
  Lightbulb,
} from "lucide-react";
import { RICE_PRODUCTS } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { SPRING, hoverLift, tapPress } from "@/lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Rec {
  recommendedProductIds: string[];
  summary: string;
  cookingTips: string;
  suggestedDishes: string[];
  healthNote: string;
}

const SUGGESTIONS = [
  "I want fluffy biryani for a dinner party",
  "Diabetic-friendly daily rice",
  "Best rice for kheer and sweets",
  "Something aromatic and light on digestion",
];

export function AISommelierModal({ open, onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState<Rec | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const add = useCart((s) => s.add);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setLoading(true);
    setRec(null);
    setAddedIds(new Set());
    try {
      const res = await fetch("/api/ai-sommelier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });
      const data = await res.json();
      setRec(data);
    } catch {
      toast.error("The sommelier is busy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const recommended = rec
    ? RICE_PRODUCTS.filter((p) => rec.recommendedProductIds.includes(p.id))
    : [];

  const handleAdd = (productId: string) => {
    const p = RICE_PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    add(p, p.availableWeights[0] ?? 1);
    setAddedIds((s) => new Set(s).add(productId));
    toast.success(`${p.name} added to cart`);
    setTimeout(() => {
      setAddedIds((s) => {
        const n = new Set(s);
        n.delete(productId);
        return n;
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[92vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="px-6 pt-6 pb-3 bg-gradient-to-br from-[#1f431e] to-[#0a1209] text-white">
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e9c496]" />
            AI Grain Sommelier
          </DialogTitle>
          <DialogDescription className="text-stone-300 text-xs">
            Tell our sommelier your dish, diet, or craving — get a curated grain
            pairing in seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3">
              <Sparkles className="w-4 h-4 text-[#c88a4a]" />
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask(prompt)}
                placeholder="What are you cooking today?"
                className="flex-1 bg-transparent py-3 text-sm font-medium focus:outline-none placeholder-stone-400"
              />
            </div>
            <button
              onClick={() => ask(prompt)}
              disabled={loading || !prompt.trim()}
              className="px-4 py-3 bg-[#1f431e] text-white rounded-xl text-xs font-bold hover:bg-[#16331a] disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Ask
            </button>
          </div>

          {/* Suggestions */}
          {!rec && !loading && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setPrompt(s);
                    ask(s);
                  }}
                  className="px-3 py-1.5 bg-[#c88a4a]/10 hover:bg-[#c88a4a]/20 text-[#1f431e] border border-[#c88a4a]/30 rounded-full text-[11px] font-bold transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-10 flex flex-col items-center gap-3 text-center">
              <Loader2 className="w-8 h-8 text-[#1f431e] animate-spin" />
              <p className="text-xs text-stone-500 font-medium">
                The sommelier is studying the grains…
              </p>
            </div>
          )}

          {/* Result */}
          {rec && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: SPRING.gentle }}
              className="space-y-4"
            >
              <div className="bg-[#faf8f5] rounded-2xl p-4 border border-stone-200/80">
                <p className="text-sm text-stone-700 leading-relaxed font-serif italic">
                  &ldquo;{rec.summary}&rdquo;
                </p>
              </div>

              {recommended.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block">
                    Recommended Grains
                  </span>
                  {recommended.map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-3 bg-white rounded-2xl border border-stone-200/90 p-3 items-center shadow-sm"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-stone-500">
                          ₹{p.discountedPricePerKg ?? p.pricePerKg}/kg ·{" "}
                          {p.giIndex}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAdd(p.id)}
                        className={`px-3 py-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                          addedIds.has(p.id)
                            ? "bg-[#2d5a27] text-white"
                            : "bg-[#1f431e] text-white hover:bg-[#16331a]"
                        }`}
                      >
                        {addedIds.has(p.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <InfoCard
                  icon={ChefHat}
                  title="Cooking Tip"
                  text={rec.cookingTips}
                />
                <InfoCard
                  icon={Lightbulb}
                  title="Suggested Dishes"
                  text={rec.suggestedDishes.join(", ")}
                />
                <InfoCard
                  icon={HeartPulse}
                  title="Health Note"
                  text={rec.healthNote}
                />
              </div>

              <button
                onClick={() => {
                  setRec(null);
                  setPrompt("");
                }}
                className="w-full py-2.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50 cursor-pointer"
              >
                Ask Another Question
              </button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ChefHat;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-[#faf8f5] rounded-2xl p-3.5 border border-stone-200/80 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[#1f431e]">
        <Icon className="w-3.5 h-3.5 text-[#c88a4a]" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest">
          {title}
        </span>
      </div>
      <p className="text-[11px] text-stone-600 leading-relaxed">{text}</p>
    </div>
  );
}
