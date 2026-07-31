"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Loader2,
  CheckCircle2,
  Truck,
  PackageCheck,
  Clock,
} from "lucide-react";
import { useOrders } from "@/lib/cart-store";

interface Props {
  open: boolean;
  onClose: () => void;
  pendingTrackingId?: string | null;
}

const STEPS = [
  { id: "placed", label: "Order Placed", icon: CheckCircle2 },
  { id: "processing", label: "Processing", icon: Clock },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: PackageCheck },
];

interface TrackedOrder {
  trackingId: string;
  createdAt: string;
  customerName: string;
  total: number;
  orderStatus: string;
  items: { product: { name: string }; selectedWeightKg: number; quantity: number }[];
}

export function OrderTrackerModal({ open, onClose, pendingTrackingId }: Props) {
  const orders = useOrders((s) => s.orders);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/orders/track/${id.trim()}`);
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Not found");
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("No order found with that tracking ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && pendingTrackingId) {
      setQuery(pendingTrackingId);
      lookup(pendingTrackingId);
    }
  }, [open, pendingTrackingId]);

  const currentStepIdx = result
    ? STEPS.findIndex((s) => s.id === result.orderStatus)
    : -1;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[92vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <Package className="w-5 h-5 text-[#1f431e]" />
            Track Your Order
          </DialogTitle>
          <DialogDescription className="text-xs">
            Enter your tracking ID to see live delivery status
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup(query)}
                placeholder="e.g. NRDABC123"
                className="flex-1 bg-transparent py-2.5 text-xs font-semibold focus:outline-none placeholder-stone-400 uppercase tracking-wider"
              />
            </div>
            <button
              onClick={() => lookup(query)}
              disabled={loading}
              className="px-4 py-2.5 bg-[#1f431e] text-white rounded-xl text-xs font-bold hover:bg-[#16331a] disabled:opacity-70 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              Track
            </button>
          </div>

          {error && (
            <div className="text-center py-6">
              <p className="text-sm text-stone-500">{error}</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/8">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block">
                      Tracking ID
                    </span>
                    <span className="text-base font-black font-mono text-[#1f431e]">
                      {result.trackingId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block">
                      Total
                    </span>
                    <span className="text-lg font-black font-serif text-white">
                      ₹{result.total}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Placed {new Date(result.createdAt).toLocaleString()} ·{" "}
                  {result.customerName}
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-1">
                {STEPS.map((step, i) => {
                  const done = i <= currentStepIdx;
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                            done
                              ? "bg-[#1f431e] border-[#1f431e] text-white"
                              : "bg-white border-white/10 text-stone-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-6 ${
                              i < currentStepIdx ? "bg-[#1f431e]" : "bg-stone-200"
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          done ? "text-white" : "text-stone-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {result.items?.length > 0 && (
                <div className="bg-white/[0.03] rounded-2xl border border-white/8 p-3 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
                    Items
                  </span>
                  {result.items.map((it, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-[11px] text-stone-600"
                    >
                      <span>
                        {it.quantity}× {it.product?.name} ({it.selectedWeightKg}kg)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!result && !error && !loading && orders.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block">
                Recent Orders
              </span>
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setQuery(o.trackingId);
                    lookup(o.trackingId);
                  }}
                  className="w-full flex justify-between items-center bg-stone-50 hover:bg-stone-100 rounded-xl p-3 text-left cursor-pointer transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-[#1f431e]">
                    {o.trackingId}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    ₹{o.total} · {o.itemsCount} items
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
