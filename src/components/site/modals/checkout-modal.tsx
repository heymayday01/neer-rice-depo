"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Package,
  Lock,
  ShieldCheck,
  Truck,
  Store,
  Zap,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Briefcase,
  MapPin,
  Gift,
  Tag,
  Star,
  Phone,
  Mail,
  User,
  RefreshCw,
  Clock,
  ArrowLeft,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  Heart,
  Leaf,
  Wallet,
  ShoppingBag,
  AlertCircle,
  KeyRound,
  Bell,
  DoorOpen,
  PhoneCall,
  Edit3,
  ChevronRight as ChevronRightIcon,
  Info,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { tapPress, hoverLift, SPRING, EASE } from "@/lib/motion";
import { SmartImage } from "@/components/site/smart-image";

interface Props {
  open: boolean;
  onClose: () => void;
  coupon: string;
  onOrderPlaced: (trackingId: string) => void;
  onOpenOrderTracker: () => void;
}

/* ===== Brand palette (Zomato-inspired light checkout) =====
   Primary:   #1f431e (forest green — brand)
   Savings:   #15803d (brighter green — Zomato veg/savings)
   Accent:    #d4a373 (gold)
   Danger:    #dc2626 (red)
   Bg:        white / stone-50
   Text:      stone-900 / stone-500
*/

const COUPONS: Record<string, number> = {
  NEER10: 0.1,
  ORGANIC15: 0.15,
  FARM20: 0.2,
};

const COUPON_HINTS = [
  { code: "NEER10", off: "10% off", desc: "First order", minOrder: 0 },
  { code: "ORGANIC15", off: "15% off", desc: "Orders above ₹500", minOrder: 500 },
  { code: "FARM20", off: "20% off", desc: "Bulk orders above ₹1500", minOrder: 1500 },
];

const FREE_SHIP_THRESHOLD = 999;

const TIP_OPTIONS = [
  { amount: 0, label: "No tip", emoji: "🙂" },
  { amount: 20, label: "₹20", emoji: "😊" },
  { amount: 30, label: "₹30", emoji: "😍" },
  { amount: 50, label: "₹50", emoji: "🤩" },
];

const DELIVERY_INSTRUCTIONS = [
  { id: "door", label: "Leave at door", icon: DoorOpen },
  { id: "bell", label: "Ring bell", icon: Bell },
  { id: "call", label: "Call me", icon: PhoneCall },
  { id: "contactless", label: "Contactless", icon: ShieldCheck },
];

const ORDER_BUMP = {
  id: "sample-basmati",
  name: "Royal 1121 Basmati — Sample Pack",
  weight: "250g",
  price: 99,
  originalPrice: 149,
  desc: "Try our flagship aged basmati",
};

type AddressLabel = "Home" | "Work" | "Other";
type DeliveryId = "standard" | "express" | "pickup";
type PaymentId = "UPI" | "CARD" | "NETBANKING" | "COD";

const DELIVERY_OPTIONS: {
  id: DeliveryId;
  label: string;
  desc: string;
  fee: number;
  days: number;
  icon: typeof Truck;
  carbon: string;
}[] = [
  {
    id: "standard",
    label: "Standard",
    desc: "Farm-sealed & shipped",
    fee: 0,
    days: 4,
    icon: Truck,
    carbon: "Lowest carbon",
  },
  {
    id: "express",
    label: "Express",
    desc: "Dispatch in 24 hours",
    fee: 49,
    days: 2,
    icon: Zap,
    carbon: "Priority courier",
  },
  {
    id: "pickup",
    label: "Farm Pickup",
    desc: "Pune depot · free",
    fee: 0,
    days: 1,
    icon: Store,
    carbon: "Zero emissions",
  },
];

const PAYMENTS: {
  id: PaymentId;
  label: string;
  desc: string;
  icon: typeof CreditCard;
}[] = [
  { id: "UPI", label: "UPI", desc: "GPay · PhonePe · Paytm · BHIM", icon: Smartphone },
  { id: "CARD", label: "Credit / Debit Card", desc: "Visa · Mastercard · RuPay · Amex", icon: CreditCard },
  { id: "NETBANKING", label: "Net Banking", desc: "All major Indian banks", icon: Building2 },
  { id: "COD", label: "Cash on Delivery", desc: "Pay when it arrives", icon: Banknote },
];

/* ===== India PIN code prefix → city/state lookup ===== */
const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  "11": { city: "Delhi", state: "Delhi" }, "12": { city: "Delhi", state: "Delhi" },
  "13": { city: "Delhi", state: "Delhi" }, "14": { city: "Delhi", state: "Delhi" },
  "15": { city: "Delhi", state: "Delhi" }, "16": { city: "Delhi", state: "Delhi" },
  "17": { city: "Delhi", state: "Delhi" }, "18": { city: "Delhi", state: "Delhi" },
  "19": { city: "Delhi", state: "Delhi" },
  "20": { city: "Lucknow", state: "Uttar Pradesh" }, "21": { city: "Kanpur", state: "Uttar Pradesh" },
  "22": { city: "Varanasi", state: "Uttar Pradesh" }, "23": { city: "Agra", state: "Uttar Pradesh" },
  "24": { city: "Bareilly", state: "Uttar Pradesh" }, "25": { city: "Meerut", state: "Uttar Pradesh" },
  "26": { city: "Gorakhpur", state: "Uttar Pradesh" }, "27": { city: "Mathura", state: "Uttar Pradesh" },
  "28": { city: "Noida", state: "Uttar Pradesh" },
  "30": { city: "Jaipur", state: "Rajasthan" }, "31": { city: "Udaipur", state: "Rajasthan" },
  "32": { city: "Jodhpur", state: "Rajasthan" }, "33": { city: "Bikaner", state: "Rajasthan" },
  "34": { city: "Jaisalmer", state: "Rajasthan" }, "36": { city: "Jaipur", state: "Rajasthan" },
  "38": { city: "Ahmedabad", state: "Gujarat" }, "39": { city: "Surat", state: "Gujarat" },
  "40": { city: "Hyderabad", state: "Telangana" },
  "41": { city: "Pune", state: "Maharashtra" }, "42": { city: "Pune", state: "Maharashtra" },
  "43": { city: "Pune", state: "Maharashtra" }, "44": { city: "Nagpur", state: "Maharashtra" },
  "45": { city: "Indore", state: "Madhya Pradesh" }, "46": { city: "Bhopal", state: "Madhya Pradesh" },
  "47": { city: "Gwalior", state: "Madhya Pradesh" }, "48": { city: "Jabalpur", state: "Madhya Pradesh" },
  "49": { city: "Raipur", state: "Chhattisgarh" },
  "50": { city: "Hyderabad", state: "Telangana" }, "51": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "52": { city: "Tirupati", state: "Andhra Pradesh" }, "53": { city: "Vijayawada", state: "Andhra Pradesh" },
  "56": { city: "Bengaluru", state: "Karnataka" }, "57": { city: "Bengaluru", state: "Karnataka" },
  "58": { city: "Bengaluru", state: "Karnataka" }, "59": { city: "Mysuru", state: "Karnataka" },
  "60": { city: "Chennai", state: "Tamil Nadu" }, "61": { city: "Chennai", state: "Tamil Nadu" },
  "62": { city: "Tiruchirappalli", state: "Tamil Nadu" }, "63": { city: "Madurai", state: "Tamil Nadu" },
  "64": { city: "Coimbatore", state: "Tamil Nadu" },
  "67": { city: "Thiruvananthapuram", state: "Kerala" }, "68": { city: "Kochi", state: "Kerala" },
  "69": { city: "Kottayam", state: "Kerala" },
  "70": { city: "Kolkata", state: "West Bengal" }, "71": { city: "Kolkata", state: "West Bengal" },
  "72": { city: "Kolkata", state: "West Bengal" }, "73": { city: "Siliguri", state: "West Bengal" },
  "74": { city: "Guwahati", state: "Assam" }, "75": { city: "Bhubaneswar", state: "Odisha" },
  "76": { city: "Cuttack", state: "Odisha" }, "78": { city: "Shillong", state: "Meghalaya" },
  "80": { city: "Patna", state: "Bihar" }, "81": { city: "Ranchi", state: "Jharkhand" },
  "82": { city: "Jamshedpur", state: "Jharkhand" }, "84": { city: "Bhagalpur", state: "Bihar" },
  "85": { city: "Patna", state: "Bihar" },
  "90": { city: "Srinagar", state: "Jammu & Kashmir" }, "91": { city: "Srinagar", state: "Jammu & Kashmir" },
  "92": { city: "Shimla", state: "Himachal Pradesh" },
  "93": { city: "Chandigarh", state: "Chandigarh" }, "94": { city: "Chandigarh", state: "Chandigarh" },
  "95": { city: "Chandigarh", state: "Chandigarh" },
  "96": { city: "Imphal", state: "Manipur" }, "98": { city: "Kohima", state: "Nagaland" },
  "99": { city: "Gangtok", state: "Sikkim" },
};

function lookupPincode(pin: string): { city: string; state: string } | null {
  if (pin.length < 2) return null;
  return PINCODE_MAP[pin.slice(0, 2)] || null;
}

function detectCardType(number: string): string | null {
  const n = number.replace(/\s/g, "");
  if (!n) return null;
  if (/^4/.test(n)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^(60|65|81|82)/.test(n)) return "RuPay";
  return null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", opts)}`;
}

const DRAFT_KEY = "neer-checkout-draft";
const SAVED_ADDR_KEY = "neer-saved-addresses";

interface SavedAddress {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export function CheckoutModal({
  open,
  onClose,
  coupon,
  onOrderPlaced,
  onOpenOrderTracker,
}: Props) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const count = useCart((s) => s.count());
  const clear = useCart((s) => s.clear);
  const updateQty = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.remove);

  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentId>("UPI");
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [addressLabel, setAddressLabel] = useState<AddressLabel>("Home");
  const [billingSame, setBillingSame] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [saveInfo, setSaveInfo] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [tip, setTip] = useState(0);
  const [orderBump, setOrderBump] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [couponInput, setCouponInput] = useState(coupon || "");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(coupon || null);
  const [showOffers, setShowOffers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [orderNote, setOrderNote] = useState("");
  const leftColRef = useRef<HTMLDivElement>(null);

  // ===== Auto-save draft =====
  useEffect(() => {
    if (!open || done) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        form, orderNote, payment, delivery, addressLabel, billingSame, newsletter,
        saveInfo, whatsappUpdates, giftWrap, giftMessage, tip, orderBump, agreeTerms,
        couponInput, appliedCoupon, upiId, cardNumber, cardName, cardExpiry, bank, saveCard,
        selectedInstruction,
      }));
    } catch { /* ignore */ }
  }, [open, done, form, orderNote, payment, delivery, addressLabel, billingSame, newsletter,
      saveInfo, whatsappUpdates, giftWrap, giftMessage, tip, orderBump, agreeTerms,
      couponInput, appliedCoupon, upiId, cardNumber, cardName, cardExpiry, bank, saveCard,
      selectedInstruction]);

  // Restore draft + saved addresses on open
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.form) setForm(d.form);
        if (d.orderNote) setOrderNote(d.orderNote);
        if (d.payment) setPayment(d.payment);
        if (d.delivery) setDelivery(d.delivery);
        if (d.addressLabel) setAddressLabel(d.addressLabel);
        if (typeof d.billingSame === "boolean") setBillingSame(d.billingSame);
        if (typeof d.newsletter === "boolean") setNewsletter(d.newsletter);
        if (typeof d.saveInfo === "boolean") setSaveInfo(d.saveInfo);
        if (typeof d.whatsappUpdates === "boolean") setWhatsappUpdates(d.whatsappUpdates);
        if (typeof d.giftWrap === "boolean") setGiftWrap(d.giftWrap);
        if (d.giftMessage) setGiftMessage(d.giftMessage);
        if (typeof d.tip === "number") setTip(d.tip);
        if (typeof d.orderBump === "boolean") setOrderBump(d.orderBump);
        if (typeof d.agreeTerms === "boolean") setAgreeTerms(d.agreeTerms);
        if (d.couponInput) setCouponInput(d.couponInput);
        if (d.appliedCoupon) setAppliedCoupon(d.appliedCoupon);
        if (d.upiId) setUpiId(d.upiId);
        if (d.cardNumber) setCardNumber(d.cardNumber);
        if (d.cardName) setCardName(d.cardName);
        if (d.cardExpiry) setCardExpiry(d.cardExpiry);
        if (d.bank) setBank(d.bank);
        if (typeof d.saveCard === "boolean") setSaveCard(d.saveCard);
        if (d.selectedInstruction) setSelectedInstruction(d.selectedInstruction);
      }
    } catch { /* ignore */ }
    try {
      const addrRaw = localStorage.getItem(SAVED_ADDR_KEY);
      if (addrRaw) setSavedAddresses(JSON.parse(addrRaw));
    } catch { /* ignore */ }
  }, [open]);

  useEffect(() => {
    if (done) {
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    }
  }, [done]);

  useEffect(() => {
    if (coupon) { setCouponInput(coupon); setAppliedCoupon(coupon); }
  }, [coupon]);

  const discountRate = appliedCoupon ? COUPONS[appliedCoupon] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const freeShipMet = subtotal - discount > FREE_SHIP_THRESHOLD || delivery === "pickup";
  const deliveryFee = freeShipMet ? 0 : deliveryOption.fee;
  const giftWrapFee = giftWrap ? 49 : 0;
  const tipFee = tip;
  const orderBumpFee = orderBump ? ORDER_BUMP.price : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee + giftWrapFee + tipFee + orderBumpFee;
  const loyaltyPoints = Math.floor(total / 10);
  const savings = discount + (freeShipMet && delivery !== "pickup" ? 79 : 0) + (orderBump ? ORDER_BUMP.originalPrice - ORDER_BUMP.price : 0);
  const freeShipRemaining = Math.max(0, FREE_SHIP_THRESHOLD - (subtotal - discount));

  const etaStart = useMemo(() => addDays(new Date(), deliveryOption.days), [deliveryOption.days]);
  const etaEnd = useMemo(() => addDays(etaStart, 1), [etaStart]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    if (k === "pincode" && /^\d{6}$/.test(val)) {
      const loc = lookupPincode(val);
      if (loc) {
        setForm((f) => ({ ...f, [k]: val, city: loc.city, state: loc.state }));
        toast.success(`Auto-filled: ${loc.city}, ${loc.state}`, { duration: 2000 });
      }
    }
  };

  const applyCouponInline = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { toast.error("Enter a coupon code"); return; }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      toast.success(`Coupon ${code} applied — ${COUPONS[code] * 100}% off!`);
    } else {
      setAppliedCoupon(null);
      toast.error("Invalid coupon code");
    }
  };

  const applyCouponCode = (code: string) => {
    setCouponInput(code); setAppliedCoupon(code);
    toast.success(`Coupon ${code} applied — ${COUPONS[code] * 100}% off!`);
    setShowOffers(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null); setCouponInput("");
    toast.success("Coupon removed");
  };

  const saveCurrentAddress = useCallback(() => {
    if (!form.fullName || !form.pincode) return;
    const newAddr: SavedAddress = { id: Date.now().toString(), label: addressLabel, ...form };
    const updated = [newAddr, ...savedAddresses.filter(a =>
      !(a.fullName === form.fullName && a.pincode === form.pincode && a.address === form.address)
    )].slice(0, 5);
    setSavedAddresses(updated);
    try { localStorage.setItem(SAVED_ADDR_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }, [form, addressLabel, savedAddresses]);

  const loadSavedAddress = (addr: SavedAddress) => {
    setForm({
      fullName: addr.fullName, email: addr.email, phone: addr.phone,
      address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode,
    });
    setAddressLabel(addr.label);
    setShowSavedAddresses(false);
    toast.success("Address loaded");
  };

  const errors = {
    fullName: !form.fullName.trim(),
    phone: !/^\d{10}$/.test(form.phone),
    email: form.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    address: !form.address.trim(),
    pincode: !/^\d{6}$/.test(form.pincode),
  };
  const addressValid = !errors.fullName && !errors.phone && !errors.email && !errors.address && !errors.pincode;

  const paymentValid = (() => {
    if (payment === "UPI") return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId);
    if (payment === "CARD")
      return cardNumber.replace(/\s/g, "").length >= 15 && cardName.trim().length > 1 &&
        /^\d{2}\/\d{2}$/.test(cardExpiry) && /^\d{3}$/.test(cardCvv);
    if (payment === "NETBANKING") return bank !== "";
    return true;
  })();

  const canPlaceOrder = addressValid && paymentValid && agreeTerms;

  const placeOrder = async () => {
    if (!addressValid) { toast.error("Please complete your delivery address"); return; }
    if (!paymentValid) { toast.error("Please complete payment details"); return; }
    if (!agreeTerms) { toast.error("Please accept the terms to continue"); return; }
    if (saveInfo) saveCurrentAddress();
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form, items, subtotal, discount, deliveryFee, total,
          paymentMethod: payment, deliveryMethod: delivery, orderNote, giftWrap,
          giftMessage: giftWrap ? giftMessage : "", tip,
          orderBump: orderBump ? ORDER_BUMP : null, whatsappUpdates, addressLabel,
          eta: formatDateRange(etaStart, etaEnd),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(data.trackingId);
      clear();
      toast.success("Order placed successfully!");
      const colors = ["#1f431e", "#d4a373", "#1f431e"];
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, gravity: 1.2, colors, scalar: 0.9, disableForReducedMotion: true });
      setTimeout(() => {
        confetti({ particleCount: 30, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, gravity: 1.2, colors, disableForReducedMotion: true });
        confetti({ particleCount: 30, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, gravity: 1.2, colors, disableForReducedMotion: true });
      }, 200);
    } catch {
      toast.error("Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const copyTrackingId = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done);
      setCopied(true); toast.success("Tracking ID copied");
      setTimeout(() => setCopied(false), 1800);
    } catch { toast.error("Could not copy"); }
  };

  const close = () => {
    if (done) {
      setDone(null);
      setForm({ fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
      setUpiId(""); setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv("");
      setBank(""); setOrderNote(""); setAgreeTerms(false); setGiftWrap(false);
      setGiftMessage(""); setTip(0); setOrderBump(false); setSelectedInstruction(null);
    }
    onClose();
  };

  const cardType = detectCardType(cardNumber);
  const hasAddress = form.fullName && form.phone && form.address && form.pincode && addressValid;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent
        className="max-w-5xl sm:max-w-5xl p-0 overflow-hidden max-h-[94vh] gap-0 sm:rounded-[24px] rounded-[20px] bg-[#0a0f0a] text-stone-100 border-white/10"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Secure Checkout</DialogTitle>
        <DialogDescription className="sr-only">
          Complete your order for doorstep delivery
        </DialogDescription>

        {done ? (
          <SuccessScreen
            trackingId={done} copied={copied} onCopy={copyTrackingId}
            eta={formatDateRange(etaStart, etaEnd)} total={total}
            loyaltyPoints={loyaltyPoints} paymentMethod={payment}
            onTrack={() => { onOrderPlaced(done); close(); onOpenOrderTracker(); }}
            onContinue={close}
          />
        ) : items.length === 0 ? (
          <EmptyCartState onClose={close} />
        ) : (
          <div className="flex flex-col max-h-[94vh]">
            {/* ===== Header (Zomato-style clean bar) ===== */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/8 bg-[#0d140d]/80 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back to cart"
                >
                  <ArrowLeft className="h-4 w-4 text-stone-300" strokeWidth={2.5} />
                </button>
                <div>
                  <h2 className="font-serif text-lg font-bold text-stone-100 leading-tight">Secure Checkout</h2>
                  <p className="text-[10px] font-semibold text-stone-500 flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    256-bit SSL · Draft auto-saved
                  </p>
                </div>
              </div>
              {/* ETA pill — Zomato style */}
              <div className="flex items-center gap-2 rounded-full bg-[#1f431e]/15 px-3 py-1.5">
                <Truck className="h-3.5 w-3.5 text-[#a3c4a0]" strokeWidth={2.5} />
                <span className="text-[11px] font-bold text-[#a3c4a0]">
                  {formatDateRange(etaStart, etaEnd)}
                </span>
              </div>
            </div>

            {/* ===== Body: two-column single page ===== */}
            <div className="grid lg:grid-cols-[1fr_360px] flex-1 overflow-hidden">
              {/* LEFT: scrollable sections */}
              <div ref={leftColRef} className="overflow-y-auto bg-[#0a0f0a] order-2 lg:order-1">
                <div className="px-4 sm:px-6 py-5 space-y-3 max-w-2xl mx-auto">

                  {/* Mobile bill summary — collapsible (Zomato mobile pattern) */}
                  <MobileBillSummary
                    items={items} subtotal={subtotal} discount={discount}
                    deliveryFee={deliveryFee} giftWrapFee={giftWrapFee} tipFee={tipFee}
                    orderBumpFee={orderBumpFee} total={total} savings={savings}
                    appliedCoupon={appliedCoupon} couponInput={couponInput}
                    setCouponInput={setCouponInput} onApply={applyCouponInline}
                    onRemove={removeCoupon} onApplyCode={applyCouponCode}
                    showOffers={showOffers} setShowOffers={setShowOffers}
                    eta={formatDateRange(etaStart, etaEnd)} count={count}
                    onUpdateQty={updateQty} onRemoveItem={removeItem}
                    freeShipRemaining={freeShipRemaining} freeShipMet={freeShipMet}
                    orderBump={orderBump} setOrderBump={setOrderBump}
                    loyaltyPoints={loyaltyPoints}
                  />

                  {/* 1. Deliver To — prominent address card */}
                  <SectionCard>
                    <div className="flex items-center justify-between mb-3">
                      <SectionTitle icon={MapPin} text="Deliver To" />
                      {savedAddresses.length > 0 && !editingAddress && (
                        <button
                          onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#a3c4a0] hover:underline cursor-pointer"
                        >
                          <KeyRound className="h-3 w-3" />
                          {savedAddresses.length} saved
                        </button>
                      )}
                    </div>

                    {/* Saved addresses dropdown */}
                    <AnimatePresence initial={false}>
                      {showSavedAddresses && savedAddresses.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE.out }}
                          className="overflow-hidden mb-3"
                        >
                          <div className="space-y-1.5">
                            {savedAddresses.map((addr) => (
                              <button
                                key={addr.id}
                                onClick={() => loadSavedAddress(addr)}
                                className="w-full flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-[#d4a373]/40 hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d4a373]/12 text-[#d4a373]">
                                  {addr.label === "Home" ? <Home className="h-3.5 w-3.5" /> : addr.label === "Work" ? <Briefcase className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-stone-100">{addr.fullName} · {addr.label}</p>
                                  <p className="text-[10px] text-stone-500 mt-0.5 truncate">{addr.address}, {addr.city}, {addr.state} {addr.pincode}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Compact address display when valid + not editing */}
                    {hasAddress && !editingAddress ? (
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4a373]/12 text-[#d4a373]">
                          {addressLabel === "Home" ? <Home className="h-5 w-5" /> : addressLabel === "Work" ? <Briefcase className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-stone-100">{form.fullName}</p>
                            <span className="rounded-full bg-[#d4a373]/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a06d3c]">{addressLabel}</span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{form.address}</p>
                          <p className="text-xs text-stone-400">{form.city}{form.city && ", "}{form.state} {form.pincode}</p>
                          <p className="text-xs text-stone-500 mt-1">+91 {form.phone}{form.email && ` · ${form.email}`}</p>
                        </div>
                        <button
                          onClick={() => setEditingAddress(true)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#a3c4a0] hover:underline cursor-pointer shrink-0"
                        >
                          <Edit3 className="h-3 w-3" />
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Address label pills */}
                        <div className="flex gap-2">
                          {(["Home", "Work", "Other"] as AddressLabel[]).map((l) => {
                            const Icon = l === "Home" ? Home : l === "Work" ? Briefcase : MapPin;
                            const sel = addressLabel === l;
                            return (
                              <button
                                key={l}
                                onClick={() => setAddressLabel(l)}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                                  sel ? "bg-[#1f431e] text-white" : "bg-white/5 text-stone-400 hover:bg-white/10"
                                }`}
                              >
                                <Icon className="h-3 w-3" />
                                {l}
                              </button>
                            );
                          })}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2.5">
                          <Field label="Full Name *" value={form.fullName} onChange={set("fullName")} placeholder="Aarav Sharma" icon={User} error={errors.fullName} errorText="Required" valid={!errors.fullName && form.fullName !== ""} />
                          <Field label="Phone *" value={form.phone} onChange={set("phone")} placeholder="9876543210" type="tel" icon={Phone} error={errors.phone} errorText="10-digit number" valid={!errors.phone && form.phone !== ""} prefix="+91" />
                        </div>
                        <Field label="Email" value={form.email} onChange={set("email")} placeholder="aarav@email.com" type="email" icon={Mail} error={errors.email} errorText="Enter a valid email" />
                        <Field label="Address *" value={form.address} onChange={set("address")} placeholder="Flat 4B, 123 Grain Lane, Near Mill" icon={MapPin} error={errors.address} errorText="Required" valid={!errors.address && form.address !== ""} />
                        <div className="grid sm:grid-cols-3 gap-2.5">
                          <Field label="City" value={form.city} onChange={set("city")} placeholder="Pune" />
                          <Field label="State" value={form.state} onChange={set("state")} placeholder="Maharashtra" />
                          <Field label="Pincode *" value={form.pincode} onChange={set("pincode")} placeholder="411038" type="tel" error={errors.pincode} errorText="6-digit" valid={!errors.pincode && form.pincode !== ""} hint={form.pincode.length === 6 && lookupPincode(form.pincode) ? `✓ ${lookupPincode(form.pincode)!.city}, ${lookupPincode(form.pincode)!.state}` : undefined} />
                        </div>

                        {hasAddress && (
                          <button
                            onClick={() => setEditingAddress(false)}
                            className="w-full rounded-xl bg-[#1f431e] text-white py-2.5 text-xs font-bold hover:bg-[#16321a] transition-colors cursor-pointer"
                          >
                            Save Address
                          </button>
                        )}
                      </div>
                    )}
                  </SectionCard>

                  {/* 2. Delivery Option — radio list */}
                  <SectionCard>
                    <SectionTitle icon={Truck} text="Delivery Option" />
                    <div className="mt-3 space-y-2">
                      {DELIVERY_OPTIONS.map((opt) => {
                        const sel = delivery === opt.id;
                        const Icon = opt.icon;
                        const optEta = formatDateRange(addDays(new Date(), opt.days), addDays(new Date(), opt.days + 1));
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setDelivery(opt.id)}
                            className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                              sel ? "border-[#1f431e] bg-[#1f431e]/[0.03] ring-1 ring-[#1f431e]/20" : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sel ? "bg-[#1f431e] text-white" : "bg-white/5 text-stone-400"}`}>
                              <Icon className="h-4 w-4" strokeWidth={2.2} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-stone-100">{opt.label}</p>
                                {opt.id === "express" && <span className="rounded bg-[#d4a373]/20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#a06d3c]">Fastest</span>}
                                {opt.id === "pickup" && <span className="rounded bg-[#15803d]/15 px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#a3c4a0]">Eco</span>}
                              </div>
                              <p className="text-[10px] text-stone-500 mt-0.5">{opt.desc} · {optEta}</p>
                            </div>
                            <span className="text-xs font-black text-stone-100">{opt.fee === 0 || (opt.id === "standard" && freeShipMet) ? "FREE" : `₹${opt.fee}`}</span>
                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${sel ? "border-[#1f431e] bg-[#1f431e]" : "border-white/15"}`}>
                              {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </SectionCard>

                  {/* 3. Delivery Instructions — Zomato chips */}
                  <SectionCard>
                    <SectionTitle icon={MessageSquare} text="Delivery Instructions" />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {DELIVERY_INSTRUCTIONS.map((inst) => {
                        const Icon = inst.icon;
                        const sel = selectedInstruction === inst.id;
                        return (
                          <button
                            key={inst.id}
                            onClick={() => setSelectedInstruction(sel ? null : inst.id)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                              sel ? "border-[#1f431e] bg-[#1f431e]/5 text-[#a3c4a0]" : "border-white/10 bg-white/[0.03] text-stone-400 hover:border-white/20"
                            }`}
                          >
                            <Icon className="h-3 w-3" />
                            {inst.label}
                          </button>
                        );
                      })}
                    </div>
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      rows={1}
                      placeholder="Add a custom note (optional)…"
                      className="mt-2.5 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[11px] font-medium text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all resize-none"
                    />
                  </SectionCard>

                  {/* 4. Tip — Zomato emoji chips */}
                  <SectionCard>
                    <div className="flex items-center justify-between mb-3">
                      <SectionTitle icon={Heart} text="Delivery Partner Tip" />
                      <span className="text-[10px] text-stone-400">100% goes to them</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {TIP_OPTIONS.map((t) => {
                        const sel = tip === t.amount;
                        return (
                          <button
                            key={t.amount}
                            onClick={() => setTip(t.amount)}
                            className={`flex flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-all cursor-pointer ${
                              sel ? "border-[#1f431e] bg-[#1f431e]/[0.04] ring-1 ring-[#1f431e]/20" : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <span className="text-base leading-none">{t.emoji}</span>
                            <span className={`text-[10px] font-bold ${sel ? "text-[#a3c4a0]" : "text-stone-400"}`}>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </SectionCard>

                  {/* 5. Payment — Zomato vertical radio list with expandable details */}
                  <SectionCard>
                    <SectionTitle icon={Wallet} text="Payment Method" />
                    <div className="mt-3 space-y-2">
                      {PAYMENTS.map((p) => {
                        const sel = payment === p.id;
                        const Icon = p.icon;
                        return (
                          <div key={p.id} className={`rounded-xl border overflow-hidden transition-all ${sel ? "border-[#1f431e] ring-1 ring-[#1f431e]/20" : "border-white/10"}`}>
                            <button
                              onClick={() => setPayment(p.id)}
                              className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                            >
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sel ? "bg-[#1f431e] text-white" : "bg-white/5 text-stone-400"}`}>
                                <Icon className="h-4 w-4" strokeWidth={2.2} />
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-stone-100">{p.label}</p>
                                <p className="text-[10px] text-stone-500 mt-0.5">{p.desc}</p>
                              </div>
                              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${sel ? "border-[#1f431e] bg-[#1f431e]" : "border-white/15"}`}>
                                {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                              </span>
                            </button>
                            {/* Expandable payment details */}
                            <AnimatePresence initial={false}>
                              {sel && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: EASE.out }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 pt-1 border-t border-stone-100 space-y-2">
                                    {p.id === "UPI" && (
                                      <>
                                        <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@okhdfcbank" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all" />
                                        <div className="flex flex-wrap gap-1.5">
                                          {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                                            <span key={app} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-stone-500">{app}</span>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                    {p.id === "CARD" && (
                                      <>
                                        {cardType && (
                                          <span className="inline-flex items-center gap-1 rounded-md bg-[#1f431e]/10 px-2 py-1 text-[9px] font-extrabold text-[#a3c4a0]">{cardType}</span>
                                        )}
                                        <input value={cardNumber} onChange={(e) => setCardNumber((v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())(e.target.value))} placeholder="1234 5678 9012 3456" inputMode="numeric" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all font-mono tracking-wider" />
                                        <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all" />
                                        <div className="grid grid-cols-2 gap-2">
                                          <input value={cardExpiry} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); setCardExpiry(d.length <= 2 ? d : `${d.slice(0,2)}/${d.slice(2)}`); }} placeholder="MM/YY" inputMode="numeric" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all font-mono" />
                                          <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="CVV" type="password" inputMode="numeric" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all font-mono" />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                          <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${saveCard ? "bg-[#1f431e] border-[#1f431e]" : "border-white/15"}`}>
                                            {saveCard && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                          </span>
                                          <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="sr-only" />
                                          <span className="text-[10px] text-stone-500">Save card securely (tokenized · PCI-DSS)</span>
                                        </label>
                                      </>
                                    )}
                                    {p.id === "NETBANKING" && (
                                      <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all cursor-pointer">
                                        <option value="">Choose your bank…</option>
                                        {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda", "Yes Bank"].map(b => <option key={b} value={b}>{b}</option>)}
                                      </select>
                                    )}
                                    {p.id === "COD" && (
                                      <div className="flex items-start gap-2 py-1">
                                        <Banknote className="h-4 w-4 text-[#a3c4a0] mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-stone-400 leading-relaxed">Keep ₹{total} ready. Inspect your package before paying. COD orders may take 1 extra day for verification.</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </SectionCard>

                  {/* 6. Gift Wrap */}
                  <SectionCard>
                    <button onClick={() => setGiftWrap(!giftWrap)} className="w-full flex items-center gap-3 text-left cursor-pointer">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${giftWrap ? "bg-[#d4a373] text-white" : "bg-white/5 text-stone-400"}`}>
                        <Gift className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-100">Heritage Gift Wrap</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">Jute pouch with gold-foil seal</p>
                      </div>
                      <span className="text-xs font-black text-stone-100">₹49</span>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${giftWrap ? "border-[#d4a373] bg-[#d4a373]" : "border-white/15"}`}>
                        {giftWrap && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {giftWrap && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE.out }} className="overflow-hidden">
                          <div className="mt-3 pt-3 border-t border-stone-100">
                            <label className="block">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block mb-1.5">Gift Message <span className="text-stone-400 normal-case font-medium">(optional · {giftMessage.length}/100)</span></span>
                              <textarea value={giftMessage} onChange={(e) => setGiftMessage(e.target.value.slice(0, 100))} rows={2} placeholder="Happy birthday! Enjoy these heritage grains…" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all resize-none" />
                            </label>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SectionCard>

                  {/* 7. Preferences — billing, whatsapp, newsletter */}
                  <SectionCard>
                    <SectionTitle icon={Sparkles} text="Preferences" />
                    <div className="mt-3 space-y-2.5">
                      <ToggleRow checked={billingSame} onChange={setBillingSame} label="Billing address same as shipping" />
                      <ToggleRow checked={whatsappUpdates} onChange={setWhatsappUpdates} label="Order updates via WhatsApp" subtext="Tracking, delivery & ETA" />
                      <ToggleRow checked={newsletter} onChange={setNewsletter} label="Harvest updates & member offers" />
                      <ToggleRow checked={saveInfo} onChange={setSaveInfo} label="Save address for next time" />
                    </div>
                  </SectionCard>

                  {/* 8. Terms */}
                  <label className="flex items-start gap-2.5 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-white/20 transition-colors">
                    <span className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 transition-all ${agreeTerms ? "bg-[#1f431e] border-[#1f431e]" : "border-white/15"}`}>
                      {agreeTerms && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="sr-only" />
                    <span className="text-[11px] text-stone-400 leading-relaxed">
                      I agree to Neer Rice Depo&apos;s{" "}
                      <span className="font-bold text-[#a3c4a0] underline">Terms of Service</span> and{" "}
                      <span className="font-bold text-[#a3c4a0] underline">Refund Policy</span>. Grains are non-returnable once opened unless damaged.
                    </span>
                  </label>
                </div>
              </div>

              {/* RIGHT: sticky Bill card (Zomato-style) */}
              <aside className="hidden lg:flex flex-col border-l border-white/8 bg-[#0d140d]/40 order-1 lg:order-2 overflow-y-auto">
                <BillCard
                  items={items} subtotal={subtotal} discount={discount} deliveryFee={deliveryFee}
                  giftWrapFee={giftWrapFee} tipFee={tipFee} orderBumpFee={orderBumpFee} total={total}
                  savings={savings} loyaltyPoints={loyaltyPoints}
                  appliedCoupon={appliedCoupon} couponInput={couponInput} setCouponInput={setCouponInput}
                  onApply={applyCouponInline} onRemove={removeCoupon} onApplyCode={applyCouponCode}
                  showOffers={showOffers} setShowOffers={setShowOffers}
                  eta={formatDateRange(etaStart, etaEnd)} count={count}
                  onUpdateQty={updateQty} onRemoveItem={removeItem}
                  freeShipRemaining={freeShipRemaining} freeShipMet={freeShipMet}
                  orderBump={orderBump} setOrderBump={setOrderBump}
                />
              </aside>
            </div>

            {/* ===== Sticky bottom pay bar (Zomato-style) ===== */}
            <div className="border-t border-white/8 bg-[#0d140d]/80 backdrop-blur-xl px-4 sm:px-6 py-3.5 shrink-0">
              <div className="flex items-center gap-3 max-w-2xl mx-auto">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">To Pay</span>
                    {savings > 0 && <span className="text-[10px] font-bold text-[#a3c4a0]">Saving ₹{savings}</span>}
                  </div>
                  <p className="text-xl font-black font-serif text-stone-100 leading-tight">₹{total}</p>
                </div>
                <motion.button
                  whileHover={canPlaceOrder ? hoverLift : undefined}
                  whileTap={canPlaceOrder ? tapPress : undefined}
                  onClick={placeOrder}
                  disabled={!canPlaceOrder || placing}
                  className="flex items-center gap-2 rounded-xl px-6 sm:px-10 py-3.5 bg-[#1f431e] text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#1f431e]/20"
                >
                  {placing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Placing…</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Place Order</>
                  )}
                </motion.button>
              </div>
              {!canPlaceOrder && !placing && (
                <p className="text-center text-[10px] text-stone-400 mt-1.5">
                  {!addressValid ? "Complete delivery address" : !paymentValid ? "Complete payment details" : "Accept terms to continue"}
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ============ Section Card (Zomato-style white card) ============ */
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#a3c4a0]" strokeWidth={2.3} />
      <h3 className="text-sm font-bold text-stone-100">{text}</h3>
    </div>
  );
}

function ToggleRow({
  checked, onChange, label, subtext,
}: { checked: boolean; onChange: (b: boolean) => void; label: string; subtext?: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${checked ? "bg-[#1f431e] border-[#1f431e]" : "border-white/15"}`}>
        {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <div>
        <span className="text-[11px] font-semibold text-stone-300">{label}</span>
        {subtext && <span className="text-[10px] text-stone-400 ml-1">· {subtext}</span>}
      </div>
    </label>
  );
}

/* ============ Bill Card (Zomato-style bill details) ============ */
function BillCard({
  items, subtotal, discount, deliveryFee, giftWrapFee, tipFee, orderBumpFee, total,
  savings, loyaltyPoints, appliedCoupon, couponInput, setCouponInput, onApply, onRemove,
  onApplyCode, showOffers, setShowOffers, eta, count, onUpdateQty, onRemoveItem,
  freeShipRemaining, freeShipMet, orderBump, setOrderBump,
}: {
  items: ReturnType<typeof useCart.getState>["items"];
  subtotal: number; discount: number; deliveryFee: number; giftWrapFee: number;
  tipFee: number; orderBumpFee: number; total: number; savings: number; loyaltyPoints: number;
  appliedCoupon: string | null; couponInput: string; setCouponInput: (s: string) => void;
  onApply: () => void; onRemove: () => void; onApplyCode: (c: string) => void;
  showOffers: boolean; setShowOffers: (b: boolean) => void;
  eta: string; count: number;
  onUpdateQty: (productId: string, weightKg: number, qty: number) => void;
  onRemoveItem: (productId: string, weightKg: number) => void;
  freeShipRemaining: number; freeShipMet: boolean;
  orderBump: boolean; setOrderBump: (b: boolean) => void;
}) {
  const [itemsExpanded, setItemsExpanded] = useState(true);
  return (
    <div className="flex flex-col px-5 py-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-base font-bold text-stone-100">Bill Details</h3>
        <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold text-stone-400">{count} {count === 1 ? "item" : "items"}</span>
      </div>

      {/* Free shipping progress */}
      <div className={`rounded-xl p-2.5 mb-3 ${freeShipMet ? "bg-[#1f431e]/12" : "bg-[#d4a373]/10"}`}>
        {freeShipMet ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#a3c4a0] shrink-0" />
            <p className="text-[10px] font-bold text-[#a3c4a0]">FREE delivery unlocked!</p>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-bold text-[#a06d3c] mb-1.5">Add ₹{freeShipRemaining} more for FREE delivery</p>
            <div className="h-1 rounded-full bg-[#d4a373]/20 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((subtotal - discount) / FREE_SHIP_THRESHOLD) * 100)}%` }} transition={{ duration: 0.5, ease: EASE.out }} className="h-full rounded-full bg-[#d4a373]" />
            </div>
          </div>
        )}
      </div>

      {/* Items list — collapsible */}
      <div className="mb-3">
        <button onClick={() => setItemsExpanded(!itemsExpanded)} className="w-full flex items-center justify-between mb-2 cursor-pointer">
          <span className="text-[11px] font-bold text-stone-300">{itemsExpanded ? "Hide items" : `Show ${count} items`}</span>
          <motion.span animate={{ rotate: itemsExpanded ? 180 : 0 }} transition={SPRING.snappy}>
            <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {itemsExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE.out }} className="overflow-hidden">
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {items.map((i) => (
                  <div key={`${i.productId}-${i.selectedWeightKg}`} className="flex items-center gap-2.5">
                    {/* Organic marker — Zomato veg marker style */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                      <SmartImage src={i.product.image} alt={i.product.name} className="h-full w-full" />
                      <span className="absolute -top-1 -right-1 z-10 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#1f431e] px-1 text-[9px] font-black text-white">{i.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {/* Organic green square marker (like Zomato veg marker) */}
                        <span className="flex h-3 w-3 shrink-0 items-center justify-center border-[1.5px] border-[#d4a373] rounded-[2px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#d4a373]" />
                        </span>
                        <p className="text-[11px] font-bold text-stone-100 truncate">{i.product.name}</p>
                      </div>
                      <p className="text-[9px] text-stone-500">{i.selectedWeightKg}kg</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <button onClick={() => onUpdateQty(i.productId, i.selectedWeightKg, i.quantity - 1)} className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 text-stone-500 hover:border-[#d4a373] hover:text-[#a3c4a0] transition-colors cursor-pointer" aria-label="Decrease">
                          <Minus className="h-2 w-2" strokeWidth={3} />
                        </button>
                        <span className="text-[9px] font-bold text-stone-300 min-w-[12px] text-center">{i.quantity}</span>
                        <button onClick={() => onUpdateQty(i.productId, i.selectedWeightKg, i.quantity + 1)} className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 text-stone-500 hover:border-[#d4a373] hover:text-[#a3c4a0] transition-colors cursor-pointer" aria-label="Increase">
                          <Plus className="h-2 w-2" strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] font-black text-stone-100 shrink-0">₹{i.totalPrice}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order bump upsell */}
      <AnimatePresence initial={false}>
        {!orderBump && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: EASE.out }} className="overflow-hidden mb-3">
            <button onClick={() => setOrderBump(true)} className="w-full flex items-center gap-2.5 rounded-xl border border-dashed border-[#d4a373] bg-[#d4a373]/5 p-2.5 text-left cursor-pointer hover:bg-[#d4a373]/10 transition-colors">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4a373] text-white">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-stone-100 truncate">{ORDER_BUMP.name}</p>
                <p className="text-[9px] text-stone-500">{ORDER_BUMP.weight} · {ORDER_BUMP.desc}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-black text-[#a06d3c]">₹{ORDER_BUMP.price}</span>
                  <span className="text-[9px] text-stone-400 line-through">₹{ORDER_BUMP.originalPrice}</span>
                </div>
              </div>
              <span className="text-[9px] font-extrabold uppercase text-[#a06d3c] shrink-0">Add +</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupon strip — Zomato dashed style */}
      <div className="mb-3">
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl border border-[#15803d]/30 bg-[#15803d]/5 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-[#a3c4a0]" />
              <div>
                <p className="text-[11px] font-bold text-[#a3c4a0]">{appliedCoupon} applied</p>
                <p className="text-[9px] text-[#a3c4a0]/70">You saved ₹{discount}</p>
              </div>
            </div>
            <button onClick={onRemove} className="text-[10px] font-bold text-stone-400 hover:text-red-500 cursor-pointer">Remove</button>
          </div>
        ) : (
          <>
            <button onClick={() => setShowOffers(!showOffers)} className="w-full flex items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3 py-2.5 cursor-pointer hover:border-[#d4a373] transition-colors">
              <Tag className="h-4 w-4 text-[#a3c4a0]" />
              <span className="flex-1 text-left text-[11px] font-bold text-stone-300">{couponInput || "Apply coupon / View offers"}</span>
              <ChevronRightIcon className="h-3.5 w-3.5 text-stone-400" />
            </button>
            <AnimatePresence initial={false}>
              {showOffers && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE.out }} className="overflow-hidden">
                  <div className="mt-2 space-y-1.5">
                    {/* Manual coupon input */}
                    <div className="flex gap-1.5">
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && onApply()} placeholder="ENTER CODE" className="flex-1 px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all tracking-wider" />
                      <button onClick={onApply} className="rounded-lg bg-[#1f431e] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#16321a] transition-colors cursor-pointer">Apply</button>
                    </div>
                    {/* Available offers */}
                    {COUPON_HINTS.map((c) => {
                      const eligible = subtotal >= c.minOrder;
                      return (
                        <button key={c.code} onClick={() => eligible && onApplyCode(c.code)} disabled={!eligible} className={`w-full flex items-center gap-2.5 rounded-lg border p-2 text-left transition-all ${eligible ? "border-white/10 hover:border-[#d4a373]/40 cursor-pointer" : "border-stone-100 opacity-50 cursor-not-allowed"}`}>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1f431e]/12 text-[#a3c4a0]">
                            <Sparkles className="h-3 w-3" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-stone-100">{c.code} · {c.off}</p>
                            <p className="text-[9px] text-stone-500">{c.desc}</p>
                          </div>
                          {!eligible && <span className="text-[8px] font-bold text-stone-400">Min ₹{c.minOrder}</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Bill breakdown — Zomato-style right-aligned */}
      <div className="space-y-1.5 py-3 border-t border-dashed border-white/10">
        <BillRow label="Item Total" value={`₹${subtotal}`} />
        {discount > 0 && <BillRow label="Discount" value={`−₹${discount}`} green />}
        <BillRow label="Delivery Fee" value={deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`} green={deliveryFee === 0} />
        {giftWrapFee > 0 && <BillRow label="Gift Wrap" value={`₹${giftWrapFee}`} />}
        {tipFee > 0 && <BillRow label="Delivery Tip" value={`₹${tipFee}`} />}
        {orderBumpFee > 0 && <BillRow label="Sample Pack" value={`₹${orderBumpFee}`} />}
      </div>

      {/* To Pay — bold */}
      <div className="flex items-center justify-between py-3 border-t border-white/10">
        <span className="text-sm font-bold text-stone-100">To Pay</span>
        <span className="text-xl font-black font-serif text-stone-100">₹{total}</span>
      </div>

      {/* Savings + Loyalty */}
      {savings > 0 && (
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1f431e]/12 py-1.5 mb-2">
          <Sparkles className="h-3 w-3 text-[#a3c4a0]" />
          <p className="text-[10px] font-bold text-[#a3c4a0]">You save ₹{savings} on this order</p>
        </div>
      )}
      <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#d4a373]/30 bg-[#d4a373]/5 py-1.5">
        <Star className="h-3 w-3 text-[#d4a373]" />
        <p className="text-[10px] font-bold text-[#a06d3c]">Earn {loyaltyPoints} loyalty points</p>
      </div>

      {/* ETA */}
      <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5">
        <Truck className="h-3.5 w-3.5 text-[#a3c4a0] shrink-0" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500">Arrives by</p>
          <p className="text-[11px] font-bold text-stone-100">{eta}</p>
        </div>
      </div>
    </div>
  );
}

function BillRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-stone-500">{label}</span>
      <span className={`text-[11px] font-bold ${green ? "text-[#a3c4a0]" : "text-stone-100"}`}>{value}</span>
    </div>
  );
}

/* ============ Mobile Bill Summary (collapsible — Zomato mobile pattern) ============ */
function MobileBillSummary({
  items, subtotal, discount, deliveryFee, giftWrapFee, tipFee, orderBumpFee, total,
  savings, loyaltyPoints, appliedCoupon, couponInput, setCouponInput, onApply, onRemove,
  onApplyCode, showOffers, setShowOffers, eta, count, onUpdateQty, onRemoveItem,
  freeShipRemaining, freeShipMet, orderBump, setOrderBump,
}: {
  items: ReturnType<typeof useCart.getState>["items"];
  subtotal: number; discount: number; deliveryFee: number; giftWrapFee: number;
  tipFee: number; orderBumpFee: number; total: number; savings: number; loyaltyPoints: number;
  appliedCoupon: string | null; couponInput: string; setCouponInput: (s: string) => void;
  onApply: () => void; onRemove: () => void; onApplyCode: (c: string) => void;
  showOffers: boolean; setShowOffers: (b: boolean) => void;
  eta: string; count: number;
  onUpdateQty: (productId: string, weightKg: number, qty: number) => void;
  onRemoveItem: (productId: string, weightKg: number) => void;
  freeShipRemaining: number; freeShipMet: boolean;
  orderBump: boolean; setOrderBump: (b: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-[#a3c4a0]" strokeWidth={2.2} />
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              {count} {count === 1 ? "item" : "items"}
              {savings > 0 && <span className="text-[#a3c4a0]"> · Save ₹{savings}</span>}
            </p>
            <p className="text-sm font-black font-serif text-stone-100">₹{total}</p>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING.snappy}>
          <ChevronDown className="h-4 w-4 text-stone-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.out }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-stone-100">
              {/* Free ship progress */}
              <div className={`rounded-lg p-2 my-2.5 ${freeShipMet ? "bg-[#1f431e]/12" : "bg-[#d4a373]/10"}`}>
                {freeShipMet ? (
                  <p className="text-[10px] font-bold text-[#a3c4a0] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> FREE delivery unlocked!
                  </p>
                ) : (
                  <p className="text-[10px] font-bold text-[#a06d3c]">Add ₹{freeShipRemaining} more for FREE delivery</p>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {items.map((i) => (
                  <div key={`${i.productId}-${i.selectedWeightKg}`} className="flex items-center gap-2">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                      <SmartImage src={i.product.image} alt={i.product.name} className="h-full w-full" />
                      <span className="absolute -top-1 -right-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1f431e] px-1 text-[8px] font-black text-white">{i.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center border-[1.5px] border-[#d4a373] rounded-[2px]">
                          <span className="h-1 w-1 rounded-full bg-[#d4a373]" />
                        </span>
                        <p className="text-[10px] font-bold text-stone-100 truncate">{i.product.name}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <button onClick={() => onUpdateQty(i.productId, i.selectedWeightKg, i.quantity - 1)} className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 text-stone-500 hover:border-[#d4a373] hover:text-[#a3c4a0] cursor-pointer"><Minus className="h-2 w-2" strokeWidth={3} /></button>
                        <span className="text-[9px] font-bold text-stone-300 min-w-[10px] text-center">{i.quantity}</span>
                        <button onClick={() => onUpdateQty(i.productId, i.selectedWeightKg, i.quantity + 1)} className="flex h-4 w-4 items-center justify-center rounded-full border border-white/10 text-stone-500 hover:border-[#d4a373] hover:text-[#a3c4a0] cursor-pointer"><Plus className="h-2 w-2" strokeWidth={3} /></button>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-stone-100">₹{i.totalPrice}</p>
                  </div>
                ))}
              </div>

              {/* Order bump */}
              <AnimatePresence initial={false}>
                {!orderBump && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden w-full mt-2"
                    onClick={() => setOrderBump(true)}
                  >
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#d4a373] bg-[#d4a373]/5 p-2 text-left cursor-pointer">
                      <Plus className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-bold text-stone-100 truncate">{ORDER_BUMP.name}</p>
                        <p className="text-[9px]"><span className="font-black text-[#a06d3c]">₹{ORDER_BUMP.price}</span> <span className="text-stone-400 line-through">₹{ORDER_BUMP.originalPrice}</span></p>
                      </div>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Coupon */}
              <div className="mt-2.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#15803d]/30 bg-[#15803d]/5 px-2.5 py-2">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3 text-[#a3c4a0]" />
                      <span className="text-[10px] font-bold text-[#a3c4a0]">{appliedCoupon} · −₹{discount}</span>
                    </div>
                    <button onClick={onRemove} className="text-[9px] font-bold text-stone-400 hover:text-red-500 cursor-pointer">Remove</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setShowOffers(!showOffers)} className="w-full flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-2.5 py-2 cursor-pointer hover:border-[#d4a373]">
                      <Tag className="h-3.5 w-3.5 text-[#a3c4a0]" />
                      <span className="flex-1 text-left text-[10px] font-bold text-stone-300">Apply coupon / View offers</span>
                      <ChevronRightIcon className="h-3 w-3 text-stone-400" />
                    </button>
                    <AnimatePresence initial={false}>
                      {showOffers && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                          <div className="mt-1.5 space-y-1">
                            <div className="flex gap-1">
                              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && onApply()} placeholder="ENTER CODE" className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#1f431e]/20 transition-all tracking-wider" />
                              <button onClick={onApply} className="rounded-md bg-[#1f431e] px-2.5 py-1.5 text-[10px] font-bold text-white cursor-pointer">Apply</button>
                            </div>
                            {COUPON_HINTS.map((c) => {
                              const eligible = subtotal >= c.minOrder;
                              return (
                                <button key={c.code} onClick={() => eligible && onApplyCode(c.code)} disabled={!eligible} className={`w-full flex items-center gap-1.5 rounded-md border p-1.5 text-left ${eligible ? "border-white/10 hover:border-[#d4a373]/40 cursor-pointer" : "border-stone-100 opacity-50 cursor-not-allowed"}`}>
                                  <Sparkles className="h-2.5 w-2.5 text-[#a3c4a0] shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-bold text-stone-100">{c.code} · {c.off}</p>
                                    <p className="text-[8px] text-stone-500">{c.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>

              {/* Breakdown */}
              <div className="mt-2.5 pt-2.5 border-t border-dashed border-white/10 space-y-1">
                <BillRow label="Item Total" value={`₹${subtotal}`} />
                {discount > 0 && <BillRow label="Discount" value={`−₹${discount}`} green />}
                <BillRow label="Delivery" value={deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`} green={deliveryFee === 0} />
                {giftWrapFee > 0 && <BillRow label="Gift Wrap" value={`₹${giftWrapFee}`} />}
                {tipFee > 0 && <BillRow label="Tip" value={`₹${tipFee}`} />}
                {orderBumpFee > 0 && <BillRow label="Sample Pack" value={`₹${orderBumpFee}`} />}
              </div>
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
                <span className="text-xs font-bold text-stone-100">To Pay</span>
                <span className="text-base font-black font-serif text-stone-100">₹{total}</span>
              </div>
              {savings > 0 && (
                <p className="text-center text-[10px] font-bold text-[#a3c4a0] mt-1.5">You save ₹{savings}</p>
              )}
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <Star className="h-2.5 w-2.5 text-[#d4a373]" />
                <span className="text-[9px] font-bold text-[#a06d3c]">Earn {loyaltyPoints} points · Arrives {eta}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ Empty Cart Guard ============ */
function EmptyCartState({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-6 py-16 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING.gentle} className="w-20 h-20 rounded-full bg-[#1f431e]/10 flex items-center justify-center mx-auto mb-5">
        <ShoppingBag className="h-9 w-9 text-[#a3c4a0]" strokeWidth={1.8} />
      </motion.div>
      <h3 className="text-xl font-serif font-bold text-stone-100">Your cart is empty</h3>
      <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto">Add some heritage grains to your basket before checking out.</p>
      <button onClick={onClose} className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white text-xs font-bold transition-colors cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Browse Grains
      </button>
    </div>
  );
}

/* ============ Success screen ============ */
function SuccessScreen({
  trackingId, copied, onCopy, eta, total, loyaltyPoints, paymentMethod, onTrack, onContinue,
}: {
  trackingId: string; copied: boolean; onCopy: () => void; eta: string; total: number;
  loyaltyPoints: number; paymentMethod: PaymentId; onTrack: () => void; onContinue: () => void;
}) {
  const steps = [
    { icon: Package, title: "Order Packed", desc: "Our team packs your grains with care" },
    { icon: Truck, title: "Out for Delivery", desc: `Arrives by ${eta}` },
    { icon: CheckCircle2, title: "Delivered", desc: "Enjoy your heritage grains!" },
  ];
  const payLabel = PAYMENTS.find(p => p.id === paymentMethod)?.label || paymentMethod;

  return (
    <div className="overflow-y-auto max-h-[94vh] bg-white/[0.03]">
      <div className="px-6 sm:px-10 py-8 sm:py-10 text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="w-20 h-20 rounded-full bg-[#1f431e]/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-11 h-11 text-[#a3c4a0]" strokeWidth={2.2} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE.out }} className="mt-5">
          <h3 className="text-2xl font-serif font-bold text-stone-100">Order Confirmed!</h3>
          <p className="text-sm text-stone-500 mt-1.5 max-w-sm mx-auto">Thank you for choosing heritage grains. A confirmation has been sent to your email{paymentMethod === "COD" ? "" : " and WhatsApp"}.</p>
        </motion.div>

        {/* Tracking ID card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5, ease: EASE.out }} className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 backdrop-blur-xl">
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">Tracking ID</p>
            <p className="text-lg font-black font-mono text-[#a3c4a0] tracking-wider">{trackingId}</p>
          </div>
          <button onClick={onCopy} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f431e]/10 hover:bg-[#1f431e]/20 text-[#a3c4a0] transition-colors cursor-pointer" aria-label="Copy tracking ID">
            {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2.2} />}
          </button>
        </motion.div>

        {/* Total + payment + ETA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease: EASE.out }} className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-[#a3c4a0]" />
            <span className="text-stone-400">Paid</span>
            <span className="font-black text-stone-100">₹{total}</span>
            <span className="text-stone-400">· {payLabel}</span>
          </div>
          <span className="hidden sm:inline h-3 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-[#a3c4a0]" />
            <span className="font-bold text-stone-300">Arrives {eta}</span>
          </div>
        </motion.div>

        {/* Loyalty */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5, ease: EASE.out }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d4a373]/30 bg-[#d4a373]/8 px-4 py-2">
          <Star className="h-4 w-4 text-[#d4a373]" />
          <span className="text-xs font-bold text-[#a06d3c]">You earned {loyaltyPoints} loyalty points!</span>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5, ease: EASE.out }} className="mt-8 grid grid-cols-3 gap-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 text-center">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d4a373]/12 text-[#d4a373] mb-2">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <p className="text-[11px] font-bold text-stone-100">{s.title}</p>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5, ease: EASE.out }} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button whileHover={hoverLift} whileTap={tapPress} onClick={onTrack} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-[#1f431e]/20">
            <Package className="w-4 h-4" /> Track My Order
          </motion.button>
          <motion.button whileHover={hoverLift} whileTap={tapPress} onClick={onContinue} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-white/10 text-stone-300 rounded-xl text-xs font-bold hover:bg-white/[0.03] transition-colors cursor-pointer">
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

/* ============ Field atom ============ */
function Field({
  label, value, onChange, placeholder, type = "text", icon: Icon, error, errorText, valid, prefix, hint,
}: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; icon?: typeof Mail; error?: boolean; errorText?: string;
  valid?: boolean; prefix?: string; hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block mb-1 flex items-center gap-1.5">
        {label}
        {valid && <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#a3c4a0]"><Check className="h-2.5 w-2.5 text-white" strokeWidth={3} /></span>}
      </span>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-xs font-bold text-stone-500 pointer-events-none">{prefix}</span>}
        {Icon && <Icon className={`absolute ${prefix ? "left-11" : "left-3"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${error ? "text-red-400" : valid ? "text-[#a3c4a0]" : "text-stone-400"}`} strokeWidth={2.2} />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full ${prefix ? "pl-16" : Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 bg-white/[0.03] border rounded-lg text-xs font-semibold text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 transition-all ${error ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : valid ? "border-[#a3c4a0]/40 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40" : "border-white/10 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40"}`} />
      </div>
      {error && errorText && <span className="mt-0.5 block text-[10px] font-semibold text-red-400">{errorText}</span>}
      {hint && !error && <span className="mt-0.5 block text-[10px] font-semibold text-[#a3c4a0]">{hint}</span>}
    </label>
  );
}
