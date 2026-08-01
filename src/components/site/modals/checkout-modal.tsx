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
  CheckCircle2,
  Loader2,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Package,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { SPRING, hoverLift, tapPress } from "@/lib/motion";

interface Props {
  open: boolean;
  onClose: () => void;
  coupon: string;
  onOrderPlaced: (trackingId: string) => void;
  onOpenOrderTracker: () => void;
}

const COUPONS: Record<string, number> = {
  NEER10: 0.1,
  ORGANIC15: 0.15,
  FARM20: 0.2,
};

const PAYMENTS = [
  { id: "UPI", label: "UPI", icon: Smartphone },
  { id: "CARD", label: "Card", icon: CreditCard },
  { id: "NETBANKING", label: "Net Banking", icon: Building2 },
  { id: "COD", label: "Cash on Delivery", icon: Banknote },
];

export function CheckoutModal({
  open,
  onClose,
  coupon,
  onOrderPlaced,
  onOpenOrderTracker,
}: Props) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [payment, setPayment] = useState("UPI");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const discountRate = coupon ? COUPONS[coupon] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryFee = subtotal > 999 ? 0 : 79;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items,
          subtotal,
          discount,
          deliveryFee,
          total,
          paymentMethod: payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(data.trackingId);
      clear();
      toast.success("Order placed successfully!");
      // Celebration confetti burst — 60 particles, gravity 1.2, 800ms
      const colors = ["#1f431e", "#d4a373", "#d4a373", "#1f431e"];
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        gravity: 1.2,
        colors,
        scalar: 0.9,
        disableForReducedMotion: true,
      });
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          gravity: 1.2,
          colors,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          gravity: 1.2,
          colors,
          disableForReducedMotion: true,
        });
      }, 200);
    } catch {
      toast.error("Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const close = () => {
    if (done) {
      setDone(null);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[92vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="font-serif text-xl">
            {done ? "Order Confirmed" : "Secure Checkout"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {done
              ? "Your farm-direct grains are on the way"
              : "Complete your order for doorstep delivery"}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="px-6 pb-8 text-center space-y-5">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="w-20 h-20 rounded-full bg-[#1f431e]/10 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-11 h-11 text-[#1f431e]" />
            </motion.div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">
                Thank you for your order!
              </h3>
              <p className="text-sm text-stone-500 mt-1">
                A confirmation has been sent. Track your grains below.
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/8 inline-block">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block">
                Tracking ID
              </span>
              <span className="text-lg font-black font-mono text-[#1f431e] tracking-wider">
                {done}
              </span>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onOrderPlaced(done);
                  close();
                  onOpenOrderTracker();
                }}
                className="px-5 py-2.5 bg-[#1f431e] text-white rounded-xl text-xs font-bold hover:bg-[#1f431e] cursor-pointer flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Track Order
              </button>
              <button
                onClick={close}
                className="px-5 py-2.5 bg-white border border-white/10 text-stone-400 rounded-xl text-xs font-bold hover:bg-white/5 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-5">
            {/* Items summary */}
            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/8 space-y-2">
              {items.map((i) => (
                <div
                  key={`${i.productId}-${i.selectedWeightKg}`}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-stone-600">
                    {i.quantity}× {i.product.name} ({i.selectedWeightKg}kg)
                  </span>
                  <span className="font-bold text-white">₹{i.totalPrice}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total</span>
                <span className="text-xl font-black font-serif text-[#1f431e]">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Full Name *"
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Aarav Sharma"
                full
              />
              <Field
                label="Phone *"
                value={form.phone}
                onChange={set("phone")}
                placeholder="9876543210"
              />
              <Field
                label="Email"
                value={form.email}
                onChange={set("email")}
                placeholder="aarav@email.com"
                type="email"
              />
              <Field
                label="Address *"
                value={form.address}
                onChange={set("address")}
                placeholder="123 Grain Lane, Apt 4B"
                full
              />
              <Field
                label="City"
                value={form.city}
                onChange={set("city")}
                placeholder="Pune"
              />
              <Field
                label="State"
                value={form.state}
                onChange={set("state")}
                placeholder="Maharashtra"
              />
              <Field
                label="Pincode *"
                value={form.pincode}
                onChange={set("pincode")}
                placeholder="411038"
              />
            </div>

            {/* Payment */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block mb-2">
                Payment Method
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PAYMENTS.map((p) => {
                  const Icon = p.icon;
                  const sel = payment === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPayment(p.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        sel
                          ? "bg-[#1f431e] text-white border-[#1f431e] shadow-sm"
                          : "bg-white text-stone-600 border-white/10 hover:border-white/25"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileHover={hoverLift}
              whileTap={tapPress}
              onClick={placeOrder}
              disabled={placing}
              className="btn-primary-glow w-full py-3.5 bg-gradient-to-br from-[#1f431e] to-[#1f431e] hover:from-[#1f431e] hover:to-[#1f431e] disabled:opacity-[0.38] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {placing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing Order…
                </>
              ) : (
                <>Place Order · ₹{total}</>
              )}
            </motion.button>
            <p className="text-[10px] text-stone-400 text-center">
              By placing this order you agree to Neer Rice Depo's terms. Payments
              are secured & encrypted.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  full,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 focus:bg-white/10 transition-all"
      />
    </label>
  );
}
