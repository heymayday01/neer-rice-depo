"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RICE_PRODUCTS } from "@/lib/rice-products";
import { useCart } from "@/lib/cart-store";
import { ShoppingBag, Check, BarChart2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ComparisonModal({ open, onClose }: Props) {
  const add = useCart((s) => s.add);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = (id: string) => {
    const p = RICE_PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    add(p, p.availableWeights[0] ?? 1);
    setAddedIds((s) => new Set(s).add(id));
    toast.success(`${p.name} added to cart`);
    setTimeout(() => {
      setAddedIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden max-h-[92vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#1f431e]" />
            Rice Comparison Matrix
          </DialogTitle>
          <DialogDescription className="text-xs">
            Compare grain type, GI index, aroma, aging & price across the full
            catalog
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#1f431e] text-white">
                <th className="text-left p-3 font-bold rounded-tl-xl">Grain</th>
                <th className="text-center p-3 font-bold">Type</th>
                <th className="text-center p-3 font-bold">Process</th>
                <th className="text-center p-3 font-bold">GI</th>
                <th className="text-center p-3 font-bold">Aroma</th>
                <th className="text-center p-3 font-bold">Aged</th>
                <th className="text-center p-3 font-bold">Water</th>
                <th className="text-right p-3 font-bold">₹/kg</th>
                <th className="text-center p-3 font-bold rounded-tr-xl">Add</th>
              </tr>
            </thead>
            <tbody>
              {RICE_PRODUCTS.map((p, i) => (
                <tr
                  key={p.id}
                  className={`${
                    i % 2 ? "bg-white/[0.03]" : "bg-white"
                  } hover:bg-[#d4a373]/8 transition-colors border-b border-white/8`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-stone-500 line-clamp-1">
                          {p.originRegion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-3 text-stone-500 font-medium">
                    {p.grainType}
                  </td>
                  <td className="text-center p-3 text-stone-500 font-medium">
                    {p.processing}
                  </td>
                  <td className="text-center p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        p.giIndex.includes("Low")
                          ? "bg-[#1f431e]/10 text-[#1f431e]"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {p.giIndex.split(" ")[0]}
                    </span>
                  </td>
                  <td className="text-center p-3">
                    <div className="flex justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            idx < p.aromaLevel ? "bg-[#d4a373]" : "bg-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="text-center p-3 text-stone-500 font-medium">
                    {p.agingMonths}m
                  </td>
                  <td className="text-center p-3 text-stone-500 font-medium font-mono">
                    {p.waterRatio}
                  </td>
                  <td className="text-right p-3">
                    <span className="font-black font-serif text-[#1f431e]">
                      ₹{p.discountedPricePerKg ?? p.pricePerKg}
                    </span>
                  </td>
                  <td className="text-center p-3">
                    <button
                      onClick={() => handleAdd(p.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                        addedIds.has(p.id)
                          ? "bg-[#1f431e] text-white"
                          : "bg-[#1f431e] text-white hover:bg-[#1f431e]"
                      }`}
                    >
                      {addedIds.has(p.id) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <ShoppingBag className="w-3 h-3" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
