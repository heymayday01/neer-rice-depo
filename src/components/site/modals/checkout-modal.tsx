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
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { tapPress, hoverLift, SPRING, swapUp, EASE } from "@/lib/motion";
import { SmartImage } from "@/components/site/smart-image";

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

const COUPON_HINTS = [
  { code: "NEER10", off: "10% off", minOrder: 0 },
  { code: "ORGANIC15", off: "15% off", minOrder: 500 },
  { code: "FARM20", off: "20% off", minOrder: 1500 },
];

const FREE_SHIP_THRESHOLD = 999;

const TIP_OPTIONS = [0, 20, 30, 50];

const ORDER_BUMP = {
  id: "sample-basmati",
  name: "Royal 1121 Basmati — Sample Pack",
  weight: "250g",
  price: 99,
  originalPrice: 149,
  desc: "Try our flagship aged basmati at half price",
};

const STEPS = [
  { id: 1, label: "Information", icon: User },
  { id: 2, label: "Delivery", icon: Truck },
  { id: 3, label: "Payment", icon: Lock },
  { id: 4, label: "Review", icon: CheckCircle2 },
];

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
    label: "Standard Delivery",
    desc: "Carefully packed at our farm facility",
    fee: 0,
    days: 4,
    icon: Truck,
    carbon: "Lowest carbon — consolidated routes",
  },
  {
    id: "express",
    label: "Express Delivery",
    desc: "Priority dispatch within 24 hours",
    fee: 49,
    days: 2,
    icon: Zap,
    carbon: "Express courier — slightly higher emissions",
  },
  {
    id: "pickup",
    label: "Farm Pickup",
    desc: "Collect from our Pune depot — free",
    fee: 0,
    days: 1,
    icon: Store,
    carbon: "Zero delivery emissions",
  },
];

const PAYMENTS: {
  id: PaymentId;
  label: string;
  desc: string;
  icon: typeof CreditCard;
}[] = [
  { id: "UPI", label: "UPI", desc: "GPay / PhonePe / Paytm", icon: Smartphone },
  { id: "CARD", label: "Card", desc: "Visa / Mastercard / RuPay", icon: CreditCard },
  { id: "NETBANKING", label: "Net Banking", desc: "All major banks", icon: Building2 },
  { id: "COD", label: "Cash on Delivery", desc: "Pay when it arrives", icon: Banknote },
];

/* ===== India PIN code prefix → city/state lookup ===== */
const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  "11": { city: "Delhi", state: "Delhi" },
  "12": { city: "Delhi", state: "Delhi" },
  "13": { city: "Delhi", state: "Delhi" },
  "14": { city: "Delhi", state: "Delhi" },
  "15": { city: "Delhi", state: "Delhi" },
  "16": { city: "Delhi", state: "Delhi" },
  "17": { city: "Delhi", state: "Delhi" },
  "18": { city: "Delhi", state: "Delhi" },
  "19": { city: "Delhi", state: "Delhi" },
  "20": { city: "Lucknow", state: "Uttar Pradesh" },
  "21": { city: "Kanpur", state: "Uttar Pradesh" },
  "22": { city: "Varanasi", state: "Uttar Pradesh" },
  "23": { city: "Agra", state: "Uttar Pradesh" },
  "24": { city: "Bareilly", state: "Uttar Pradesh" },
  "25": { city: "Meerut", state: "Uttar Pradesh" },
  "26": { city: "Gorakhpur", state: "Uttar Pradesh" },
  "27": { city: "Mathura", state: "Uttar Pradesh" },
  "28": { city: "Noida", state: "Uttar Pradesh" },
  "30": { city: "Jaipur", state: "Rajasthan" },
  "31": { city: "Udaipur", state: "Rajasthan" },
  "32": { city: "Jodhpur", state: "Rajasthan" },
  "33": { city: "Bikaner", state: "Rajasthan" },
  "34": { city: "Jaisalmer", state: "Rajasthan" },
  "36": { city: "Jaipur", state: "Rajasthan" },
  "38": { city: "Ahmedabad", state: "Gujarat" },
  "39": { city: "Surat", state: "Gujarat" },
  "40": { city: "Hyderabad", state: "Telangana" },
  "41": { city: "Pune", state: "Maharashtra" },
  "42": { city: "Pune", state: "Maharashtra" },
  "43": { city: "Pune", state: "Maharashtra" },
  "44": { city: "Nagpur", state: "Maharashtra" },
  "45": { city: "Indore", state: "Madhya Pradesh" },
  "46": { city: "Bhopal", state: "Madhya Pradesh" },
  "47": { city: "Gwalior", state: "Madhya Pradesh" },
  "48": { city: "Jabalpur", state: "Madhya Pradesh" },
  "49": { city: "Raipur", state: "Chhattisgarh" },
  "50": { city: "Hyderabad", state: "Telangana" },
  "51": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "52": { city: "Tirupati", state: "Andhra Pradesh" },
  "53": { city: "Vijayawada", state: "Andhra Pradesh" },
  "56": { city: "Bengaluru", state: "Karnataka" },
  "57": { city: "Bengaluru", state: "Karnataka" },
  "58": { city: "Bengaluru", state: "Karnataka" },
  "59": { city: "Mysuru", state: "Karnataka" },
  "60": { city: "Chennai", state: "Tamil Nadu" },
  "61": { city: "Chennai", state: "Tamil Nadu" },
  "62": { city: "Tiruchirappalli", state: "Tamil Nadu" },
  "63": { city: "Madurai", state: "Tamil Nadu" },
  "64": { city: "Coimbatore", state: "Tamil Nadu" },
  "67": { city: "Thiruvananthapuram", state: "Kerala" },
  "68": { city: "Kochi", state: "Kerala" },
  "69": { city: "Kottayam", state: "Kerala" },
  "70": { city: "Kolkata", state: "West Bengal" },
  "71": { city: "Kolkata", state: "West Bengal" },
  "72": { city: "Kolkata", state: "West Bengal" },
  "73": { city: "Siliguri", state: "West Bengal" },
  "74": { city: "Guwahati", state: "Assam" },
  "75": { city: "Bhubaneswar", state: "Odisha" },
  "76": { city: "Cuttack", state: "Odisha" },
  "77": { city: "Itanagar", state: "Arunachal Pradesh" },
  "78": { city: "Shillong", state: "Meghalaya" },
  "79": { city: "Aizawl", state: "Mizoram" },
  "80": { city: "Patna", state: "Bihar" },
  "81": { city: "Ranchi", state: "Jharkhand" },
  "82": { city: "Jamshedpur", state: "Jharkhand" },
  "83": { city: "Ranchi", state: "Jharkhand" },
  "84": { city: "Bhagalpur", state: "Bihar" },
  "85": { city: "Patna", state: "Bihar" },
  "90": { city: "Srinagar", state: "Jammu & Kashmir" },
  "91": { city: "Srinagar", state: "Jammu & Kashmir" },
  "92": { city: "Shimla", state: "Himachal Pradesh" },
  "93": { city: "Chandigarh", state: "Chandigarh" },
  "94": { city: "Chandigarh", state: "Chandigarh" },
  "95": { city: "Chandigarh", state: "Chandigarh" },
  "96": { city: "Imphal", state: "Manipur" },
  "97": { city: "Imphal", state: "Manipur" },
  "98": { city: "Kohima", state: "Nagaland" },
  "99": { city: "Gangtok", state: "Sikkim" },
};

function lookupPincode(pin: string): { city: string; state: string } | null {
  if (pin.length < 2) return null;
  const prefix = pin.slice(0, 2);
  return PINCODE_MAP[prefix] || null;
}

/* ===== Card type detection ===== */
function detectCardType(number: string): string | null {
  const n = number.replace(/\s/g, "");
  if (!n) return null;
  if (/^4/.test(n)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^(60|65|81|82)/.test(n)) return "RuPay";
  if (/^(6011|65|64[4-9])/.test(n)) return "Discover";
  return null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString(
    "en-IN",
    opts
  )}`;
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

  const [step, setStep] = useState(1);
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
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [couponInput, setCouponInput] = useState(coupon || "");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(
    coupon || null
  );
  const [copied, setCopied] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  // Payment-method-specific mock fields
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [orderNote, setOrderNote] = useState("");

  const bodyRef = useRef<HTMLDivElement>(null);

  // ===== Auto-save draft to localStorage =====
  const draft = {
    step, form, orderNote, payment, delivery, addressLabel, billingSame,
    newsletter, saveInfo, whatsappUpdates, giftWrap, giftMessage, tip,
    orderBump, agreeTerms, couponInput, appliedCoupon, upiId, cardNumber,
    cardName, cardExpiry, bank, saveCard,
  };

  useEffect(() => {
    if (!open || done) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* ignore quota errors */
    }
  }, [
    step, form, orderNote, payment, delivery, addressLabel, billingSame,
    newsletter, saveInfo, whatsappUpdates, giftWrap, giftMessage, tip,
    orderBump, agreeTerms, couponInput, appliedCoupon, upiId, cardNumber,
    cardExpiry, bank, saveCard, open, done,
  ]);

  // Restore draft on first open
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
      }
    } catch {
      /* ignore parse errors */
    }
    // Load saved addresses
    try {
      const addrRaw = localStorage.getItem(SAVED_ADDR_KEY);
      if (addrRaw) setSavedAddresses(JSON.parse(addrRaw));
    } catch {
      /* ignore */
    }
  }, [open]);

  // Clear draft on successful order
  useEffect(() => {
    if (done) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [done]);

  // Sync incoming coupon prop
  useEffect(() => {
    if (coupon) {
      setCouponInput(coupon);
      setAppliedCoupon(coupon);
    }
  }, [coupon]);

  // Reset to step 1 when reopened after success
  useEffect(() => {
    if (open && done === null) {
      setStep(1);
    }
  }, [open, done]);

  const discountRate = appliedCoupon ? COUPONS[appliedCoupon] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const deliveryBaseFee = deliveryOption.fee;
  const freeShipThresholdMet = subtotal - discount > FREE_SHIP_THRESHOLD || delivery === "pickup";
  const deliveryFee = freeShipThresholdMet ? 0 : deliveryBaseFee;
  const giftWrapFee = giftWrap ? 49 : 0;
  const tipFee = tip;
  const orderBumpFee = orderBump ? ORDER_BUMP.price : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee + giftWrapFee + tipFee + orderBumpFee;
  const loyaltyPoints = Math.floor(total / 10);
  const savings = discount + (freeShipThresholdMet && delivery !== "pickup" ? 79 : 0) + (orderBump ? ORDER_BUMP.originalPrice - ORDER_BUMP.price : 0);
  const freeShipRemaining = Math.max(0, FREE_SHIP_THRESHOLD - (subtotal - discount));
  const freeShipProgress = Math.min(100, ((subtotal - discount) / FREE_SHIP_THRESHOLD) * 100);

  const etaStart = useMemo(() => addDays(new Date(), deliveryOption.days), [deliveryOption.days]);
  const etaEnd = useMemo(() => addDays(etaStart, 1), [etaStart]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
    // Auto-fill city/state from pincode
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
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      toast.success(`Coupon ${code} applied — ${COUPONS[code] * 100}% off!`);
    } else {
      setAppliedCoupon(null);
      toast.error("Invalid coupon code");
    }
  };

  const applyCouponCode = (code: string) => {
    setCouponInput(code);
    setAppliedCoupon(code);
    toast.success(`Coupon ${code} applied — ${COUPONS[code] * 100}% off!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.success("Coupon removed");
  };

  const saveCurrentAddress = useCallback(() => {
    if (!form.fullName || !form.pincode) return;
    const newAddr: SavedAddress = {
      id: Date.now().toString(),
      label: addressLabel,
      ...form,
    };
    const updated = [newAddr, ...savedAddresses.filter(a =>
      !(a.fullName === form.fullName && a.pincode === form.pincode && a.address === form.address)
    )].slice(0, 5);
    setSavedAddresses(updated);
    try {
      localStorage.setItem(SAVED_ADDR_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  }, [form, addressLabel, savedAddresses]);

  const loadSavedAddress = (addr: SavedAddress) => {
    setForm({
      fullName: addr.fullName,
      email: addr.email,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setAddressLabel(addr.label);
    setShowSavedAddresses(false);
    toast.success("Address loaded");
  };

  // Field-level validation for step 1
  const errors = {
    fullName: !form.fullName.trim(),
    phone: !/^\d{10}$/.test(form.phone),
    email: form.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    address: !form.address.trim(),
    pincode: !/^\d{6}$/.test(form.pincode),
  };
  const step1Valid =
    !errors.fullName &&
    !errors.phone &&
    !errors.email &&
    !errors.address &&
    !errors.pincode;

  const step3Valid = (() => {
    if (payment === "UPI") return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId);
    if (payment === "CARD")
      return (
        cardNumber.replace(/\s/g, "").length >= 15 &&
        cardName.trim().length > 1 &&
        /^\d{2}\/\d{2}$/.test(cardExpiry) &&
        /^\d{3}$/.test(cardCvv)
      );
    if (payment === "NETBANKING") return bank !== "";
    return true; // COD
  })();

  const next = () => {
    if (step === 1 && !step1Valid) {
      toast.error("Please complete all required fields correctly");
      return;
    }
    if (step === 1 && saveInfo) saveCurrentAddress();
    if (step === 3 && !step3Valid) {
      toast.error("Please complete payment details");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
    // Scroll to top of body on step change
    setTimeout(() => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };
  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    setTimeout(() => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  // Enter key to advance on step 1
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step < 4 && step1Valid) {
      e.preventDefault();
      next();
    }
  };

  const placeOrder = async () => {
    if (!agreeTerms) {
      toast.error("Please accept the terms to continue");
      return;
    }
    if (!step1Valid) {
      setStep(1);
      toast.error("Please complete your information");
      return;
    }
    if (!step3Valid) {
      setStep(3);
      toast.error("Please complete payment details");
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
          deliveryMethod: delivery,
          orderNote,
          giftWrap,
          giftMessage: giftWrap ? giftMessage : "",
          tip,
          orderBump: orderBump ? ORDER_BUMP : null,
          whatsappUpdates,
          addressLabel,
          eta: formatDateRange(etaStart, etaEnd),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(data.trackingId);
      clear();
      toast.success("Order placed successfully!");
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

  const copyTrackingId = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done);
      setCopied(true);
      toast.success("Tracking ID copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };

  const close = () => {
    if (done) {
      setDone(null);
      setStep(1);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
      setUpiId("");
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");
      setBank("");
      setOrderNote("");
      setAgreeTerms(false);
      setGiftWrap(false);
      setGiftMessage("");
      setTip(0);
      setOrderBump(false);
    }
    onClose();
  };

  const cardType = detectCardType(cardNumber);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden max-h-[94vh] gap-0 sm:rounded-[28px] rounded-[20px]">
        <DialogTitle className="sr-only">Secure Checkout</DialogTitle>
        <DialogDescription className="sr-only">
          Complete your order for doorstep delivery
        </DialogDescription>

        {/* ===== Top secure bar + stepper ===== */}
        <div className="flex flex-col border-b border-white/8 bg-[#0d140d]/60">
          <div className="flex items-center justify-between px-5 sm:px-7 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#1f431e]/15">
                <Lock className="h-4 w-4 text-[#1f431e]" strokeWidth={2.2} />
              </span>
              <div className="leading-tight">
                <p className="text-[13px] font-bold text-stone-900 dark:text-white">
                  Secure Checkout
                </p>
                <p className="text-[10px] font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  256-bit SSL · Draft auto-saved
                </p>
              </div>
            </div>
            <button
              onClick={close}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to cart</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>

          {/* Stepper — hidden on success screen */}
          {!done && (
            <div className="px-5 sm:px-7 pb-4">
              <div className="flex items-center">
                {STEPS.map((s, idx) => {
                  const active = step === s.id;
                  const complete = step > s.id;
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="flex flex-1 items-center last:flex-none">
                      <button
                        type="button"
                        onClick={() => {
                          if (s.id < step) setStep(s.id);
                          else if (s.id === step + 1 && step === 1 && step1Valid)
                            setStep(s.id);
                          else if (s.id === step + 1 && step === 2) setStep(s.id);
                          else if (s.id === step + 1 && step === 3 && step3Valid)
                            setStep(s.id);
                        }}
                        disabled={s.id > step}
                        className="flex items-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span
                          className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            active
                              ? "border-[#1f431e] bg-[#1f431e] text-white shadow-[0_4px_14px_-4px_rgba(31,67,30,0.6)]"
                              : complete
                                ? "border-[#1f431e] bg-[#1f431e]/12 text-[#1f431e]"
                                : "border-stone-300 bg-transparent text-stone-400 dark:border-white/15"
                          }`}
                        >
                          {complete ? (
                            <Check className="h-4 w-4" strokeWidth={2.6} />
                          ) : (
                            <Icon className="h-4 w-4" strokeWidth={2.2} />
                          )}
                        </span>
                        <span
                          className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline transition-colors ${
                            active
                              ? "text-stone-900 dark:text-white"
                              : complete
                                ? "text-[#1f431e] dark:text-[#a3c4a0]"
                                : "text-stone-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                      {idx < STEPS.length - 1 && (
                        <div className="mx-2 sm:mx-3 h-px flex-1 bg-stone-200 dark:bg-white/10 relative overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ scaleX: step > s.id ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: EASE.out }}
                            className="absolute inset-0 origin-left bg-[#1f431e]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ===== Body: two-column on desktop, stacked on mobile ===== */}
        {done ? (
          <SuccessScreen
            trackingId={done}
            copied={copied}
            onCopy={copyTrackingId}
            eta={formatDateRange(etaStart, etaEnd)}
            total={total}
            loyaltyPoints={loyaltyPoints}
            paymentMethod={payment}
            onTrack={() => {
              onOrderPlaced(done);
              close();
              onOpenOrderTracker();
            }}
            onContinue={close}
          />
        ) : items.length === 0 ? (
          <EmptyCartState onClose={close} />
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] max-h-[calc(94vh-130px)]">
            {/* Left: step content (scrollable) */}
            <div
              ref={bodyRef}
              onKeyDown={handleKeyDown}
              className="overflow-y-auto px-5 sm:px-7 py-6 lg:py-7 order-2 lg:order-1"
            >
              {/* Mobile collapsible order summary */}
              <div className="lg:hidden mb-5">
                <button
                  onClick={() => setMobileSummaryOpen((o) => !o)}
                  className="w-full flex items-center justify-between rounded-2xl border border-stone-200 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 px-4 py-3 cursor-pointer transition-colors hover:bg-black/[0.04] dark:hover:bg-white/8"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="h-4 w-4 text-[#1f431e]" strokeWidth={2.2} />
                    <div className="text-left">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
                        {count} {count === 1 ? "item" : "items"} ·{" "}
                        <span className="text-[#1f431e]">
                          {savings > 0 ? `Save ₹${savings}` : "View"}
                        </span>
                      </p>
                      <p className="text-sm font-black font-serif text-stone-900 dark:text-white">
                        ₹{total}
                      </p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: mobileSummaryOpen ? 180 : 0 }}
                    transition={SPRING.snappy}
                    className="text-stone-400"
                  >
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {mobileSummaryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE.out }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0d140d]/40">
                        <OrderSummary
                          items={items}
                          subtotal={subtotal}
                          discount={discount}
                          deliveryFee={deliveryFee}
                          giftWrapFee={giftWrapFee}
                          tipFee={tipFee}
                          orderBumpFee={orderBumpFee}
                          total={total}
                          savings={savings}
                          loyaltyPoints={loyaltyPoints}
                          appliedCoupon={appliedCoupon}
                          couponInput={couponInput}
                          setCouponInput={setCouponInput}
                          onApply={applyCouponInline}
                          onRemove={removeCoupon}
                          onApplyCode={applyCouponCode}
                          eta={formatDateRange(etaStart, etaEnd)}
                          count={count}
                          onUpdateQty={updateQty}
                          onRemoveItem={removeItem}
                          freeShipRemaining={freeShipRemaining}
                          freeShipProgress={freeShipProgress}
                          freeShipMet={freeShipThresholdMet}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  variants={swapUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={SPRING.gentle}
                >
                  {step === 1 && (
                    <StepInformation
                      form={form}
                      set={set}
                      errors={errors}
                      addressLabel={addressLabel}
                      setAddressLabel={setAddressLabel}
                      saveInfo={saveInfo}
                      setSaveInfo={setSaveInfo}
                      orderNote={orderNote}
                      setOrderNote={setOrderNote}
                      savedAddresses={savedAddresses}
                      showSavedAddresses={showSavedAddresses}
                      setShowSavedAddresses={setShowSavedAddresses}
                      onLoadAddress={loadSavedAddress}
                      onPincodeLookup={lookupPincode}
                    />
                  )}
                  {step === 2 && (
                    <StepDelivery
                      delivery={delivery}
                      setDelivery={setDelivery}
                      etaStart={etaStart}
                      etaEnd={etaEnd}
                      giftWrap={giftWrap}
                      setGiftWrap={setGiftWrap}
                      giftMessage={giftMessage}
                      setGiftMessage={setGiftMessage}
                      freeShipThresholdMet={freeShipThresholdMet}
                      tip={tip}
                      setTip={setTip}
                    />
                  )}
                  {step === 3 && (
                    <StepPayment
                      payment={payment}
                      setPayment={setPayment}
                      billingSame={billingSame}
                      setBillingSame={setBillingSame}
                      newsletter={newsletter}
                      setNewsletter={setNewsletter}
                      whatsappUpdates={whatsappUpdates}
                      setWhatsappUpdates={setWhatsappUpdates}
                      upiId={upiId}
                      setUpiId={setUpiId}
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      cardName={cardName}
                      setCardName={setCardName}
                      cardExpiry={cardExpiry}
                      setCardExpiry={setCardExpiry}
                      cardCvv={cardCvv}
                      setCardCvv={setCardCvv}
                      bank={bank}
                      setBank={setBank}
                      saveCard={saveCard}
                      setSaveCard={setSaveCard}
                      cardType={cardType}
                      total={total}
                    />
                  )}
                  {step === 4 && (
                    <StepReview
                      form={form}
                      addressLabel={addressLabel}
                      delivery={delivery}
                      etaStart={etaStart}
                      etaEnd={etaEnd}
                      payment={payment}
                      upiId={upiId}
                      cardNumber={cardNumber}
                      cardType={cardType}
                      bank={bank}
                      orderNote={orderNote}
                      giftWrap={giftWrap}
                      giftMessage={giftMessage}
                      tip={tip}
                      orderBump={orderBump}
                      setOrderBump={setOrderBump}
                      newsletter={newsletter}
                      whatsappUpdates={whatsappUpdates}
                      agreeTerms={agreeTerms}
                      setAgreeTerms={setAgreeTerms}
                      onEdit={(s) => setStep(s)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: sticky order summary (desktop) */}
            <aside className="hidden lg:flex flex-col border-l border-white/8 bg-[#0d140d]/40 order-1 lg:order-2 overflow-y-auto">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                discount={discount}
                deliveryFee={deliveryFee}
                giftWrapFee={giftWrapFee}
                tipFee={tipFee}
                orderBumpFee={orderBumpFee}
                total={total}
                savings={savings}
                loyaltyPoints={loyaltyPoints}
                appliedCoupon={appliedCoupon}
                couponInput={couponInput}
                setCouponInput={setCouponInput}
                onApply={applyCouponInline}
                onRemove={removeCoupon}
                onApplyCode={applyCouponCode}
                eta={formatDateRange(etaStart, etaEnd)}
                count={count}
                onUpdateQty={updateQty}
                onRemoveItem={removeItem}
                freeShipRemaining={freeShipRemaining}
                freeShipProgress={freeShipProgress}
                freeShipMet={freeShipThresholdMet}
              />
            </aside>
          </div>
        )}

        {/* ===== Bottom sticky nav bar ===== */}
        {!done && items.length > 0 && (
          <div className="border-t border-white/8 bg-white/60 dark:bg-[#0d140d]/70 backdrop-blur-xl px-5 sm:px-7 py-4">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <motion.button
                  whileTap={tapPress}
                  onClick={back}
                  className="flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-3 text-xs font-bold text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </motion.button>
              )}

              <div className="flex-1 lg:hidden">
                <div className="flex items-center justify-between">
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Total
                    </p>
                    <p className="text-lg font-black font-serif text-stone-900 dark:text-white">
                      ₹{total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 hidden lg:block">
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1f431e]" />
                  <span>
                    {step < 4
                      ? "Your details are safe & encrypted"
                      : "Final step — review & confirm"}
                  </span>
                  {step === 1 && step1Valid && (
                    <span className="ml-2 text-[#1f431e] font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" /> Ready · press Enter ↵
                    </span>
                  )}
                </div>
              </div>

              {step < 4 ? (
                <motion.button
                  whileHover={hoverLift}
                  whileTap={tapPress}
                  onClick={next}
                  className="flex items-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white text-xs font-bold transition-colors cursor-pointer shadow-[0_8px_24px_-8px_rgba(31,67,30,0.7)]"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={hoverLift}
                  whileTap={tapPress}
                  onClick={placeOrder}
                  disabled={placing || !agreeTerms}
                  className="flex items-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-br from-[#1f431e] to-[#16321a] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_24px_-8px_rgba(31,67,30,0.7)]"
                >
                  {placing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Place Order · ₹{total}
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Trust badges row */}
            <div className="mt-3 flex items-center justify-center gap-4 sm:gap-6 text-[10px] font-semibold text-stone-400">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-[#1f431e]" />
                SSL Secured
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-[#1f431e]" />
                7-Day Returns
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3 text-[#1f431e]" />
                100% Refund
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-[#d4a373]" />
                Farm-Direct
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ============ Empty Cart Guard ============ */
function EmptyCartState({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING.gentle}
        className="w-20 h-20 rounded-full bg-[#1f431e]/10 flex items-center justify-center mx-auto mb-5"
      >
        <ShoppingBag className="h-9 w-9 text-[#1f431e]" strokeWidth={1.8} />
      </motion.div>
      <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
        Your cart is empty
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-xs mx-auto">
        Add some heritage grains to your basket before checking out.
      </p>
      <button
        onClick={onClose}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white text-xs font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse Grains
      </button>
    </div>
  );
}

/* ============ Step 1: Information ============ */
function StepInformation({
  form,
  set,
  errors,
  addressLabel,
  setAddressLabel,
  saveInfo,
  setSaveInfo,
  orderNote,
  setOrderNote,
  savedAddresses,
  showSavedAddresses,
  setShowSavedAddresses,
  onLoadAddress,
  onPincodeLookup,
}: {
  form: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  set: (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, boolean>;
  addressLabel: AddressLabel;
  setAddressLabel: (l: AddressLabel) => void;
  saveInfo: boolean;
  setSaveInfo: (b: boolean) => void;
  orderNote: string;
  setOrderNote: (s: string) => void;
  savedAddresses: SavedAddress[];
  showSavedAddresses: boolean;
  setShowSavedAddresses: (b: boolean) => void;
  onLoadAddress: (a: SavedAddress) => void;
  onPincodeLookup: (pin: string) => { city: string; state: string } | null;
}) {
  const pincodeLookup = form.pincode.length === 6 ? onPincodeLookup(form.pincode) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
          Contact & Shipping
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Where should we send your heritage grains?
        </p>
      </div>

      {/* Saved addresses quick-pick */}
      {savedAddresses.length > 0 && (
        <div className="rounded-2xl border border-[#d4a373]/30 bg-[#d4a373]/[0.05] p-4">
          <button
            onClick={() => setShowSavedAddresses(!showSavedAddresses)}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-[#a06d3c]" />
              <span className="text-xs font-bold text-stone-900 dark:text-white">
                {savedAddresses.length} saved {savedAddresses.length === 1 ? "address" : "addresses"}
              </span>
            </div>
            <motion.span animate={{ rotate: showSavedAddresses ? 180 : 0 }} transition={SPRING.snappy}>
              <ChevronRight className="h-4 w-4 rotate-90 text-stone-400" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {showSavedAddresses && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE.out }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => onLoadAddress(addr)}
                      className="w-full flex items-start gap-3 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-left hover:border-[#1f431e]/40 transition-colors cursor-pointer"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1f431e]/10 text-[#1f431e]">
                        {addr.label === "Home" ? (
                          <Home className="h-3.5 w-3.5" />
                        ) : addr.label === "Work" ? (
                          <Briefcase className="h-3.5 w-3.5" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-white">
                          {addr.fullName} · {addr.label}
                        </p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                          {addr.address}, {addr.city}, {addr.state} {addr.pincode}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Contact */}
      <div className="space-y-3">
        <SectionLabel icon={Mail} text="Contact" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field
            label="Email"
            value={form.email}
            onChange={set("email")}
            placeholder="aarav@email.com"
            type="email"
            icon={Mail}
            error={errors.email}
            errorText="Enter a valid email"
          />
          <Field
            label="Phone *"
            value={form.phone}
            onChange={set("phone")}
            placeholder="9876543210"
            type="tel"
            icon={Phone}
            error={errors.phone}
            errorText="10-digit number"
            valid={!errors.phone && form.phone !== ""}
            prefix="+91"
          />
        </div>
      </div>

      {/* Shipping address */}
      <div className="space-y-3">
        <SectionLabel icon={MapPin} text="Shipping Address" />

        {/* Address label selector */}
        <div className="flex gap-2">
          {(["Home", "Work", "Other"] as AddressLabel[]).map((l) => {
            const Icon = l === "Home" ? Home : l === "Work" ? Briefcase : MapPin;
            const sel = addressLabel === l;
            return (
              <button
                key={l}
                onClick={() => setAddressLabel(l)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all cursor-pointer ${
                  sel
                    ? "bg-[#1f431e] text-white border border-[#1f431e]"
                    : "bg-transparent text-stone-500 border border-stone-200 dark:border-white/12 hover:border-stone-300 dark:hover:border-white/25"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {l}
              </button>
            );
          })}
        </div>

        <Field
          label="Full Name *"
          value={form.fullName}
          onChange={set("fullName")}
          placeholder="Aarav Sharma"
          icon={User}
          error={errors.fullName}
          errorText="Required"
          valid={!errors.fullName && form.fullName !== ""}
        />
        <Field
          label="Address *"
          value={form.address}
          onChange={set("address")}
          placeholder="Flat 4B, 123 Grain Lane, Near Mill"
          icon={MapPin}
          error={errors.address}
          errorText="Required"
          valid={!errors.address && form.address !== ""}
        />
        <div className="grid sm:grid-cols-3 gap-3">
          <Field
            label="City"
            value={form.city}
            onChange={set("city")}
            placeholder="Pune"
            valid={pincodeLookup !== null && form.city === pincodeLookup.city}
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
            type="tel"
            error={errors.pincode}
            errorText="6-digit"
            valid={!errors.pincode && form.pincode !== ""}
            hint={pincodeLookup ? `✓ ${pincodeLookup.city}, ${pincodeLookup.state}` : undefined}
          />
        </div>

        {/* Delivery instructions */}
        <label className="block">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block mb-1.5">
            Delivery Instructions <span className="text-stone-400 normal-case font-medium">(optional)</span>
          </span>
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            rows={2}
            placeholder="e.g. Leave at the door, call before delivery…"
            className="w-full px-3.5 py-2.5 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all resize-none"
          />
        </label>

        {/* Save info */}
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
              saveInfo
                ? "bg-[#1f431e] border-[#1f431e]"
                : "border-stone-300 dark:border-white/20 group-hover:border-stone-400"
            }`}
          >
            {saveInfo && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </span>
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={(e) => setSaveInfo(e.target.checked)}
            className="sr-only"
          />
          <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
            Save this address for faster checkout next time
          </span>
        </label>
      </div>
    </div>
  );
}

/* ============ Step 2: Delivery ============ */
function StepDelivery({
  delivery,
  setDelivery,
  etaStart,
  etaEnd,
  giftWrap,
  setGiftWrap,
  giftMessage,
  setGiftMessage,
  freeShipThresholdMet,
  tip,
  setTip,
}: {
  delivery: DeliveryId;
  setDelivery: (d: DeliveryId) => void;
  etaStart: Date;
  etaEnd: Date;
  giftWrap: boolean;
  setGiftWrap: (b: boolean) => void;
  giftMessage: string;
  setGiftMessage: (s: string) => void;
  freeShipThresholdMet: boolean;
  tip: number;
  setTip: (n: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
          Choose Delivery
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Pick how your grains arrive — packed with care from our farm.
        </p>
      </div>

      <div className="space-y-2.5">
        {DELIVERY_OPTIONS.map((opt) => {
          const sel = delivery === opt.id;
          const Icon = opt.icon;
          const optEtaStart = addDays(new Date(), opt.days);
          const optEtaEnd = addDays(optEtaStart, 1);
          return (
            <button
              key={opt.id}
              onClick={() => setDelivery(opt.id)}
              className={`w-full flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                sel
                  ? "border-[#1f431e] bg-[#1f431e]/[0.04] dark:bg-[#1f431e]/10 shadow-[0_4px_18px_-8px_rgba(31,67,30,0.4)]"
                  : "border-stone-200 dark:border-white/10 hover:border-stone-300 dark:hover:border-white/20"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  sel
                    ? "bg-[#1f431e] text-white"
                    : "bg-black/[0.04] dark:bg-white/5 text-stone-500"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-stone-900 dark:text-white">
                    {opt.label}
                  </p>
                  {opt.id === "express" && (
                    <span className="rounded-full bg-[#d4a373]/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a06d3c]">
                      Fastest
                    </span>
                  )}
                  {opt.id === "pickup" && (
                    <span className="rounded-full bg-[#1f431e]/12 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#1f431e]">
                      Eco
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {opt.desc}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="flex items-center gap-1 text-[10px] font-semibold text-[#1f431e] dark:text-[#a3c4a0]">
                    <Clock className="h-3 w-3" />
                    Arrives {formatDateRange(optEtaStart, optEtaEnd)}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-stone-400">
                    <Leaf className="h-3 w-3" />
                    {opt.carbon}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-black ${
                    opt.id === "standard" && freeShipThresholdMet
                      ? "text-[#1f431e]"
                      : "text-stone-900 dark:text-white"
                  }`}
                >
                  {opt.id === "standard" && freeShipThresholdMet
                    ? "FREE"
                    : opt.fee === 0
                      ? "FREE"
                      : `₹${opt.fee}`}
                </p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  sel
                    ? "border-[#1f431e] bg-[#1f431e]"
                    : "border-stone-300 dark:border-white/20"
                }`}
              >
                {sel && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Delivery partner tip */}
      <div className="rounded-2xl border border-stone-200 dark:border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-[#d4a373]" />
          <p className="text-xs font-bold text-stone-900 dark:text-white">
            Tip your delivery partner
          </p>
          <span className="text-[10px] text-stone-400">100% goes to them</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIP_OPTIONS.map((amount) => (
            <button
              key={amount}
              onClick={() => setTip(amount)}
              className={`flex-1 min-w-[60px] rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                tip === amount
                  ? "border-[#1f431e] bg-[#1f431e]/[0.06] dark:bg-[#1f431e]/12 text-[#1f431e]"
                  : "border-stone-200 dark:border-white/10 text-stone-500 hover:border-stone-300 dark:hover:border-white/20"
              }`}
            >
              {amount === 0 ? "No tip" : `₹${amount}`}
            </button>
          ))}
        </div>
      </div>

      {/* Gift wrap */}
      <div
        className={`rounded-2xl border p-4 cursor-pointer transition-all ${
          giftWrap
            ? "border-[#d4a373] bg-[#d4a373]/[0.06]"
            : "border-stone-200 dark:border-white/10 hover:border-stone-300 dark:hover:border-white/20"
        }`}
        onClick={() => setGiftWrap(!giftWrap)}
      >
        <div className="flex items-center gap-3.5">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              giftWrap
                ? "bg-[#d4a373] text-white"
                : "bg-black/[0.04] dark:bg-white/5 text-stone-500"
            }`}
          >
            <Gift className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              Heritage Gift Wrap
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              Handwoven jute pouch with gold-foil seal — perfect for gifting
            </p>
          </div>
          <p className="text-sm font-black text-stone-900 dark:text-white">₹49</p>
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
              giftWrap
                ? "border-[#d4a373] bg-[#d4a373]"
                : "border-stone-300 dark:border-white/20"
            }`}
          >
            {giftWrap && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </span>
        </div>

        {/* Gift message — only when gift wrap selected */}
        <AnimatePresence initial={false}>
          {giftWrap && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE.out }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-[#d4a373]/20" onClick={(e) => e.stopPropagation()}>
                <label className="block">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    Gift Message <span className="text-stone-400 normal-case font-medium">(optional · max 100 chars)</span>
                  </span>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value.slice(0, 100))}
                    rows={2}
                    placeholder="Happy birthday, Aarav! Enjoy these heritage grains…"
                    className="w-full px-3.5 py-2.5 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373]/40 transition-all resize-none"
                  />
                  <span className="text-[9px] text-stone-400 mt-0.5 block text-right">
                    {giftMessage.length}/100
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-[#1f431e]/[0.05] dark:bg-[#1f431e]/10 p-3.5">
        <Sparkles className="h-4 w-4 text-[#1f431e] mt-0.5 shrink-0" />
        <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
          Every order is vacuum-sealed in food-grade kraft pouches with oxygen
          absorbers to lock in freshness for up to 6 months.
        </p>
      </div>
    </div>
  );
}

/* ============ Step 3: Payment ============ */
function StepPayment({
  payment,
  setPayment,
  billingSame,
  setBillingSame,
  newsletter,
  setNewsletter,
  whatsappUpdates,
  setWhatsappUpdates,
  upiId,
  setUpiId,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  bank,
  setBank,
  saveCard,
  setSaveCard,
  cardType,
  total,
}: {
  payment: PaymentId;
  setPayment: (p: PaymentId) => void;
  billingSame: boolean;
  setBillingSame: (b: boolean) => void;
  newsletter: boolean;
  setNewsletter: (b: boolean) => void;
  whatsappUpdates: boolean;
  setWhatsappUpdates: (b: boolean) => void;
  upiId: string;
  setUpiId: (s: string) => void;
  cardNumber: string;
  setCardNumber: (s: string) => void;
  cardName: string;
  setCardName: (s: string) => void;
  cardExpiry: string;
  setCardExpiry: (s: string) => void;
  cardCvv: string;
  setCardCvv: (s: string) => void;
  bank: string;
  setBank: (s: string) => void;
  saveCard: boolean;
  setSaveCard: (b: boolean) => void;
  cardType: string | null;
  total: number;
}) {
  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
          Payment Method
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          All transactions are encrypted & secure.
        </p>
      </div>

      {/* Express pay — recommended for UPI */}
      <div className="rounded-2xl border border-[#1f431e]/25 bg-[#1f431e]/[0.04] dark:bg-[#1f431e]/8 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-[#1f431e]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1f431e]">
            Express Pay · Instant
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {["GPay", "PhonePe"].map((app) => (
            <button
              key={app}
              onClick={() => {
                setPayment("UPI");
                toast.success(`${app} selected — complete via UPI ID below`);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-white/90 px-4 py-3 text-xs font-bold text-stone-900 hover:shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="h-4 w-4 text-[#1f431e]" />
              {app}
            </button>
          ))}
        </div>
      </div>

      {/* Payment options */}
      <div className="grid grid-cols-2 gap-2.5">
        {PAYMENTS.map((p) => {
          const sel = payment === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setPayment(p.id)}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                sel
                  ? "border-[#1f431e] bg-[#1f431e]/[0.04] dark:bg-[#1f431e]/10 shadow-[0_4px_18px_-8px_rgba(31,67,30,0.4)]"
                  : "border-stone-200 dark:border-white/10 hover:border-stone-300 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    sel
                      ? "bg-[#1f431e] text-white"
                      : "bg-black/[0.04] dark:bg-white/5 text-stone-500"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                    sel
                      ? "border-[#1f431e] bg-[#1f431e]"
                      : "border-stone-300 dark:border-white/20"
                  }`}
                >
                  {sel && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-white">
                  {p.label}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {p.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Method-specific fields */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={payment}
          variants={swapUp}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={SPRING.gentle}
          className="rounded-2xl border border-stone-200 dark:border-white/10 p-4 space-y-3"
        >
          {payment === "UPI" && (
            <>
              <SectionLabel icon={Smartphone} text="UPI ID" />
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okhdfcbank"
                className="w-full px-3.5 py-3 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all"
              />
              <div className="flex flex-wrap gap-1.5">
                {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                  <span
                    key={app}
                    className="rounded-full bg-black/[0.04] dark:bg-white/5 px-2.5 py-1 text-[10px] font-bold text-stone-500"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </>
          )}
          {payment === "CARD" && (
            <>
              <div className="flex items-center justify-between">
                <SectionLabel icon={CreditCard} text="Card Details" />
                {cardType && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={SPRING.snappy}
                    className="rounded-md bg-[#1f431e]/10 px-2 py-1 text-[10px] font-extrabold text-[#1f431e]"
                  >
                    {cardType}
                  </motion.span>
                )}
              </div>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCard(e.target.value))}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                className="w-full px-3.5 py-3 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all font-mono tracking-wider"
              />
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full px-3.5 py-3 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="w-full px-3.5 py-3 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all font-mono"
                />
                <input
                  value={cardCvv}
                  onChange={(e) =>
                    setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  placeholder="CVV"
                  type="password"
                  inputMode="numeric"
                  className="w-full px-3.5 py-3 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-sm font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all font-mono"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    saveCard
                      ? "bg-[#1f431e] border-[#1f431e]"
                      : "border-stone-300 dark:border-white/20"
                  }`}
                >
                  {saveCard && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </span>
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-[11px] text-stone-500">
                  Save card securely for next time <span className="text-stone-400">(tokenized · PCI-DSS)</span>
                </span>
              </label>
            </>
          )}
          {payment === "NETBANKING" && (
            <>
              <SectionLabel icon={Building2} text="Select Bank" />
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3.5 py-3 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all cursor-pointer"
              >
                <option value="">Choose your bank…</option>
                {[
                  "State Bank of India",
                  "HDFC Bank",
                  "ICICI Bank",
                  "Axis Bank",
                  "Kotak Mahindra",
                  "Punjab National Bank",
                  "Bank of Baroda",
                  "Yes Bank",
                ].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-stone-400 flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                You'll be redirected to your bank's secure portal
              </p>
            </>
          )}
          {payment === "COD" && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 py-1">
                <Banknote className="h-5 w-5 text-[#1f431e] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">
                    Pay with cash on delivery
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Keep ₹{total} ready. Inspect your package before paying.
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-[#d4a373]/[0.06] dark:bg-[#d4a373]/10 px-3 py-2 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3 text-[#a06d3c] shrink-0" />
                <span className="text-[10px] text-[#a06d3c] font-semibold">
                  COD orders may take 1 extra day for verification
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Billing same as shipping */}
      <label className="flex items-start gap-2.5 cursor-pointer group">
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
            billingSame
              ? "bg-[#1f431e] border-[#1f431e]"
              : "border-stone-300 dark:border-white/20 group-hover:border-stone-400"
          }`}
        >
          {billingSame && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
        <input
          type="checkbox"
          checked={billingSame}
          onChange={(e) => setBillingSame(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
          Billing address same as shipping address
        </span>
      </label>

      {/* WhatsApp updates */}
      <label className="flex items-start gap-2.5 cursor-pointer group rounded-xl border border-stone-200 dark:border-white/10 p-3 hover:border-stone-300 dark:hover:border-white/20 transition-colors">
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
            whatsappUpdates
              ? "bg-[#1f431e] border-[#1f431e]"
              : "border-stone-300 dark:border-white/20 group-hover:border-stone-400"
          }`}
        >
          {whatsappUpdates && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
        <input
          type="checkbox"
          checked={whatsappUpdates}
          onChange={(e) => setWhatsappUpdates(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
          Send order updates via WhatsApp <span className="text-stone-400">(tracking, delivery, ETA)</span>
        </span>
      </label>

      {/* Newsletter */}
      <label className="flex items-start gap-2.5 cursor-pointer group">
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
            newsletter
              ? "bg-[#1f431e] border-[#1f431e]"
              : "border-stone-300 dark:border-white/20 group-hover:border-stone-400"
          }`}
        >
          {newsletter && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
          Send me harvest updates, recipes & member-only offers
        </span>
      </label>
    </div>
  );
}

/* ============ Step 4: Review ============ */
function StepReview({
  form,
  addressLabel,
  delivery,
  etaStart,
  etaEnd,
  payment,
  upiId,
  cardNumber,
  cardType,
  bank,
  orderNote,
  giftWrap,
  giftMessage,
  tip,
  orderBump,
  setOrderBump,
  newsletter,
  whatsappUpdates,
  agreeTerms,
  setAgreeTerms,
  onEdit,
}: {
  form: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  addressLabel: AddressLabel;
  delivery: DeliveryId;
  etaStart: Date;
  etaEnd: Date;
  payment: PaymentId;
  upiId: string;
  cardNumber: string;
  cardType: string | null;
  bank: string;
  orderNote: string;
  giftWrap: boolean;
  giftMessage: string;
  tip: number;
  orderBump: boolean;
  setOrderBump: (b: boolean) => void;
  newsletter: boolean;
  whatsappUpdates: boolean;
  agreeTerms: boolean;
  setAgreeTerms: (b: boolean) => void;
  onEdit: (step: number) => void;
}) {
  const deliveryOpt = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const payLabel = PAYMENTS.find((p) => p.id === payment)!;
  const maskedCard =
    payment === "CARD" && cardNumber
      ? `${cardType ? cardType + " " : ""}•••• ${cardNumber.replace(/\s/g, "").slice(-4)}`
      : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
          Review Your Order
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Quick check before we pack your grains.
        </p>
      </div>

      {/* Order bump upsell */}
      <AnimatePresence initial={false}>
        {!orderBump && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE.out }}
            className="overflow-hidden"
          >
            <motion.button
              onClick={() => setOrderBump(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center gap-3.5 rounded-2xl border-2 border-dashed border-[#d4a373]/50 bg-[#d4a373]/[0.06] p-4 text-left cursor-pointer transition-all hover:border-[#d4a373]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d4a373] text-white">
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-stone-900 dark:text-white">
                    {ORDER_BUMP.name}
                  </p>
                  <span className="rounded-full bg-[#d4a373] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white">
                    33% off
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {ORDER_BUMP.desc} · {ORDER_BUMP.weight}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-black text-[#a06d3c]">₹{ORDER_BUMP.price}</span>
                  <span className="text-[11px] text-stone-400 line-through">₹{ORDER_BUMP.originalPrice}</span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a06d3c] shrink-0">
                Add →
              </span>
            </motion.button>
          </motion.div>
        )}
        {orderBump && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING.snappy}
            className="flex items-center gap-3.5 rounded-2xl border border-[#d4a373] bg-[#d4a373]/[0.08] p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4a373] text-white">
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-stone-900 dark:text-white">
                {ORDER_BUMP.name} added
              </p>
              <p className="text-[11px] text-[#a06d3c] font-semibold">
                You saved ₹{ORDER_BUMP.originalPrice - ORDER_BUMP.price}!
              </p>
            </div>
            <button
              onClick={() => setOrderBump(false)}
              className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-red-500 cursor-pointer"
            >
              Remove
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delivery to */}
      <ReviewCard
        title="Deliver To"
        step={1}
        onEdit={onEdit}
        icon={MapPin}
        lines={[
          `${form.fullName} · +91 ${form.phone}`,
          form.address,
          `${form.city ? form.city + ", " : ""}${form.state} ${form.pincode}`.trim(),
          form.email,
        ].filter(Boolean)}
        badge={addressLabel}
      />

      {/* Delivery method */}
      <ReviewCard
        title="Delivery Method"
        step={2}
        onEdit={onEdit}
        icon={deliveryOpt.icon}
        lines={[
          deliveryOpt.label,
          `Arrives ${formatDateRange(etaStart, etaEnd)}`,
          ...(giftWrap ? [`Heritage gift wrap${giftMessage ? ` · "${giftMessage.slice(0, 30)}${giftMessage.length > 30 ? "…" : ""}"` : ""}`] : []),
          ...(tip > 0 ? [`Delivery tip: ₹${tip}`] : []),
        ]}
      />

      {/* Payment */}
      <ReviewCard
        title="Payment"
        step={3}
        onEdit={onEdit}
        icon={payLabel.icon}
        lines={[
          payLabel.label,
          ...(payment === "UPI" && upiId ? [upiId] : []),
          ...(maskedCard ? [maskedCard] : []),
          ...(payment === "NETBANKING" && bank ? [bank] : []),
          ...(payment === "COD" ? ["Pay when it arrives"] : []),
          ...(whatsappUpdates ? ["WhatsApp updates enabled"] : []),
        ]}
      />

      {orderNote && (
        <div className="rounded-2xl border border-stone-200 dark:border-white/10 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5">
            Delivery Note
          </p>
          <p className="text-xs text-stone-700 dark:text-stone-300 italic">
            &ldquo;{orderNote}&rdquo;
          </p>
        </div>
      )}

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer group rounded-2xl border border-stone-200 dark:border-white/10 p-4 hover:border-stone-300 dark:hover:border-white/20 transition-colors">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
            agreeTerms
              ? "bg-[#1f431e] border-[#1f431e]"
              : "border-stone-300 dark:border-white/20 group-hover:border-stone-400"
          }`}
        >
          {agreeTerms && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
          I agree to Neer Rice Depo&apos;s{" "}
          <span className="font-bold text-[#1f431e] underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="font-bold text-[#1f431e] underline cursor-pointer">
            Refund Policy
          </span>
          . I understand that grains are non-returnable once opened unless
          damaged.
        </span>
      </label>
    </div>
  );
}

function ReviewCard({
  title,
  step,
  onEdit,
  icon: Icon,
  lines,
  badge,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  icon: typeof MapPin;
  lines: string[];
  badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 dark:border-white/10 p-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1f431e]/10 text-[#1f431e]">
        <Icon className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
            {title}
          </p>
          {badge && (
            <span className="rounded-full bg-[#d4a373]/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a06d3c]">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-1 space-y-0.5">
          {lines.map((l, i) => (
            <p
              key={i}
              className={`text-xs ${
                i === 0
                  ? "font-bold text-stone-900 dark:text-white"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              {l}
            </p>
          ))}
        </div>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="text-[10px] font-bold uppercase tracking-wider text-[#1f431e] hover:underline cursor-pointer shrink-0"
      >
        Edit
      </button>
    </div>
  );
}

/* ============ Order Summary (sidebar) ============ */
function OrderSummary({
  items,
  subtotal,
  discount,
  deliveryFee,
  giftWrapFee,
  tipFee,
  orderBumpFee,
  total,
  savings,
  loyaltyPoints,
  appliedCoupon,
  couponInput,
  setCouponInput,
  onApply,
  onRemove,
  onApplyCode,
  eta,
  count,
  onUpdateQty,
  onRemoveItem,
  freeShipRemaining,
  freeShipProgress,
  freeShipMet,
}: {
  items: ReturnType<typeof useCart.getState>["items"];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  giftWrapFee: number;
  tipFee: number;
  orderBumpFee: number;
  total: number;
  savings: number;
  loyaltyPoints: number;
  appliedCoupon: string | null;
  couponInput: string;
  setCouponInput: (s: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onApplyCode: (code: string) => void;
  eta: string;
  count: number;
  onUpdateQty: (productId: string, weightKg: number, qty: number) => void;
  onRemoveItem: (productId: string, weightKg: number) => void;
  freeShipRemaining: number;
  freeShipProgress: number;
  freeShipMet: boolean;
}) {
  return (
    <div className="flex flex-col px-5 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
          Order Summary
        </h3>
        <span className="rounded-full bg-black/[0.04] dark:bg-white/8 px-2.5 py-1 text-[10px] font-bold text-stone-500">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Free shipping progress bar */}
      <div className={`rounded-xl p-3 mb-4 ${
        freeShipMet
          ? "bg-[#1f431e]/[0.08] dark:bg-[#1f431e]/15"
          : "bg-[#d4a373]/[0.08] dark:bg-[#d4a373]/12"
      }`}>
        {freeShipMet ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#1f431e] shrink-0" />
            <p className="text-[11px] font-bold text-[#1f431e]">
              You&apos;ve unlocked FREE delivery!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Truck className="h-3.5 w-3.5 text-[#a06d3c] shrink-0" />
              <p className="text-[11px] font-bold text-[#a06d3c]">
                Add ₹{freeShipRemaining} more for FREE delivery
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-[#d4a373]/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${freeShipProgress}%` }}
                transition={{ duration: 0.5, ease: EASE.out }}
                className="h-full rounded-full bg-gradient-to-r from-[#d4a373] to-[#a06d3c]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Items with thumbnails + qty editing */}
      <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 -mr-1">
        {items.map((i) => (
          <div
            key={`${i.productId}-${i.selectedWeightKg}`}
            className="flex items-center gap-3"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-white/5">
              <SmartImage
                src={i.product.image}
                alt={i.product.name}
                className="h-full w-full"
              />
              <span className="absolute -top-1.5 -right-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1f431e] px-1 text-[10px] font-black text-white">
                {i.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                {i.product.name}
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                {i.selectedWeightKg}kg pack
              </p>
              {/* Inline qty controls */}
              <div className="flex items-center gap-1.5 mt-1">
                <button
                  onClick={() => onUpdateQty(i.productId, i.selectedWeightKg, i.quantity - 1)}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-200 dark:border-white/15 text-stone-500 hover:border-[#1f431e] hover:text-[#1f431e] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-2.5 w-2.5" strokeWidth={2.5} />
                </button>
                <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 min-w-[14px] text-center">
                  {i.quantity}
                </span>
                <button
                  onClick={() => onUpdateQty(i.productId, i.selectedWeightKg, i.quantity + 1)}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-200 dark:border-white/15 text-stone-500 hover:border-[#1f431e] hover:text-[#1f431e] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-2.5 w-2.5" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => onRemoveItem(i.productId, i.selectedWeightKg)}
                  className="ml-1 flex h-5 w-5 items-center justify-center rounded-full text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="text-xs font-black text-stone-900 dark:text-white shrink-0">
              ₹{i.totalPrice}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10">
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl bg-[#1f431e]/[0.06] dark:bg-[#1f431e]/12 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-[#1f431e]" />
              <span className="text-xs font-bold text-[#1f431e]">
                {appliedCoupon}
              </span>
            </div>
            <button
              onClick={onRemove}
              className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-red-500 cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && onApply()}
                  placeholder="Coupon code"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/[0.03] dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40 transition-all tracking-wider"
                />
              </div>
              <button
                onClick={onApply}
                className="rounded-xl bg-[#1f431e] hover:bg-[#16321a] px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {/* Coupon suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COUPON_HINTS.map((c) => {
                const eligible = subtotal >= c.minOrder;
                return (
                  <button
                    key={c.code}
                    onClick={() => eligible && onApplyCode(c.code)}
                    disabled={!eligible}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold transition-all cursor-pointer ${
                      eligible
                        ? "bg-[#d4a373]/12 text-[#a06d3c] hover:bg-[#d4a373]/20"
                        : "bg-stone-100 dark:bg-white/5 text-stone-400 cursor-not-allowed"
                    }`}
                    title={eligible ? `Apply ${c.code}` : `Min order ₹${c.minOrder}`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {c.code} · {c.off}
                    {!eligible && ` · ₹${c.minOrder}+`}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Breakdown */}
      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10 space-y-2">
        <Row label="Subtotal" value={`₹${subtotal}`} />
        {discount > 0 && (
          <Row label="Discount" value={`−₹${discount}`} accent="green" />
        )}
        <Row
          label="Delivery"
          value={deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          accent={deliveryFee === 0 ? "green" : undefined}
        />
        {giftWrapFee > 0 && <Row label="Gift wrap" value={`₹${giftWrapFee}`} />}
        {tipFee > 0 && <Row label="Delivery tip" value={`₹${tipFee}`} />}
        {orderBumpFee > 0 && <Row label="Sample pack" value={`₹${orderBumpFee}`} />}
        <div className="pt-2 border-t border-stone-200 dark:border-white/10 flex items-baseline justify-between">
          <span className="text-sm font-bold text-stone-900 dark:text-white">
            Total
          </span>
          <div className="text-right">
            <p className="text-xl font-black font-serif text-stone-900 dark:text-white">
              ₹{total}
            </p>
            <p className="text-[10px] text-stone-400">incl. all taxes</p>
          </div>
        </div>
      </div>

      {/* Savings + loyalty */}
      {savings > 0 && (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[#d4a373]/12 py-2">
          <Sparkles className="h-3.5 w-3.5 text-[#a06d3c]" />
          <p className="text-[11px] font-bold text-[#a06d3c]">
            You save ₹{savings} on this order
          </p>
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-[#d4a373]/30 bg-[#d4a373]/[0.06] py-2">
        <Star className="h-3.5 w-3.5 text-[#d4a373]" />
        <p className="text-[11px] font-bold text-[#a06d3c]">
          Earn {loyaltyPoints} loyalty points
        </p>
      </div>

      {/* ETA */}
      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#1f431e]/[0.05] dark:bg-[#1f431e]/10 p-3">
        <Truck className="h-4 w-4 text-[#1f431e] mt-0.5 shrink-0" />
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
            Estimated arrival
          </p>
          <p className="text-xs font-bold text-stone-900 dark:text-white">{eta}</p>
        </div>
      </div>

      {/* Trust footer */}
      <div className="mt-auto pt-4 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-wider text-stone-400">
        <Lock className="h-3 w-3" />
        Encrypted
        <span className="text-stone-300">·</span>
        <ShieldCheck className="h-3 w-3" />
        Verified
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "green";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-stone-500 dark:text-stone-400">{label}</span>
      <span
        className={`text-xs font-bold ${
          accent === "green"
            ? "text-[#1f431e]"
            : "text-stone-900 dark:text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ============ Success screen ============ */
function SuccessScreen({
  trackingId,
  copied,
  onCopy,
  eta,
  total,
  loyaltyPoints,
  paymentMethod,
  onTrack,
  onContinue,
}: {
  trackingId: string;
  copied: boolean;
  onCopy: () => void;
  eta: string;
  total: number;
  loyaltyPoints: number;
  paymentMethod: PaymentId;
  onTrack: () => void;
  onContinue: () => void;
}) {
  const steps = [
    {
      icon: Package,
      title: "Order Packed",
      desc: "Our team packs your grains with care",
    },
    {
      icon: Truck,
      title: "Out for Delivery",
      desc: `Arrives by ${eta}`,
    },
    {
      icon: CheckCircle2,
      title: "Delivered",
      desc: "Enjoy your heritage grains!",
    },
  ];

  const payLabel = PAYMENTS.find((p) => p.id === paymentMethod)?.label || paymentMethod;

  return (
    <div className="overflow-y-auto max-h-[calc(94vh-60px)]">
      <div className="px-6 sm:px-10 py-8 sm:py-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="w-20 h-20 rounded-full bg-[#1f431e]/12 flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-11 h-11 text-[#1f431e]" strokeWidth={2.2} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE.out }}
          className="mt-5"
        >
          <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
            Order Confirmed!
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 max-w-sm mx-auto">
            Thank you for choosing heritage grains. A confirmation has been sent
            to your email{paymentMethod === "COD" ? "" : " and WhatsApp"}.
          </p>
        </motion.div>

        {/* Tracking ID card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE.out }}
          className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-stone-200 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 px-5 py-3.5"
        >
          <div className="text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
              Tracking ID
            </p>
            <p className="text-lg font-black font-mono text-[#1f431e] tracking-wider">
              {trackingId}
            </p>
          </div>
          <button
            onClick={onCopy}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f431e]/10 hover:bg-[#1f431e]/20 text-[#1f431e] transition-colors cursor-pointer"
            aria-label="Copy tracking ID"
          >
            {copied ? (
              <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <Copy className="h-4 w-4" strokeWidth={2.2} />
            )}
          </button>
        </motion.div>

        {/* Total + ETA + payment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE.out }}
          className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs flex-wrap"
        >
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-[#1f431e]" />
            <span className="text-stone-400">Paid</span>
            <span className="font-black text-stone-900 dark:text-white">₹{total}</span>
            <span className="text-stone-400">· {payLabel}</span>
          </div>
          <span className="hidden sm:inline h-3 w-px bg-stone-300 dark:bg-white/15" />
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-[#1f431e]" />
            <span className="font-bold text-stone-700 dark:text-stone-300">
              Arrives {eta}
            </span>
          </div>
        </motion.div>

        {/* Loyalty points earned */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE.out }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d4a373]/30 bg-[#d4a373]/[0.08] px-4 py-2"
        >
          <Star className="h-4 w-4 text-[#d4a373]" />
          <span className="text-xs font-bold text-[#a06d3c]">
            You earned {loyaltyPoints} loyalty points!
          </span>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: EASE.out }}
          className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto"
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-stone-200 dark:border-white/10 p-3.5 text-center"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1f431e]/10 text-[#1f431e] mb-2">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <p className="text-[11px] font-bold text-stone-900 dark:text-white">
                  {s.title}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: EASE.out }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={hoverLift}
            whileTap={tapPress}
            onClick={onTrack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f431e] hover:bg-[#16321a] text-white rounded-full text-xs font-bold transition-colors cursor-pointer shadow-[0_8px_24px_-8px_rgba(31,67,30,0.7)]"
          >
            <Package className="w-4 h-4" />
            Track My Order
          </motion.button>
          <motion.button
            whileHover={hoverLift}
            whileTap={tapPress}
            onClick={onContinue}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-stone-200 dark:border-white/15 text-stone-700 dark:text-stone-300 rounded-full text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

/* ============ Shared atoms ============ */
function SectionLabel({
  icon: Icon,
  text,
}: {
  icon: typeof Mail;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-[#1f431e]" strokeWidth={2.2} />
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
        {text}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  errorText,
  valid,
  prefix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  icon?: typeof Mail;
  error?: boolean;
  errorText?: string;
  valid?: boolean;
  prefix?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 block mb-1.5 flex items-center gap-1.5">
        {label}
        {valid && (
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1f431e]">
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </span>
        )}
      </span>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-xs font-bold text-stone-400 pointer-events-none">
            {prefix}
          </span>
        )}
        {Icon && (
          <Icon
            className={`absolute ${prefix ? "left-11" : "left-3"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${
              error
                ? "text-red-400"
                : valid
                  ? "text-[#1f431e]"
                  : "text-stone-400"
            }`}
            strokeWidth={2.2}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            prefix ? "pl-16" : Icon ? "pl-9" : "pl-3.5"
          } pr-3.5 py-2.5 bg-black/[0.03] dark:bg-white/5 border rounded-xl text-xs font-semibold text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-300 dark:border-red-500/40 focus:ring-red-400/20 focus:border-red-400"
              : valid
                ? "border-[#1f431e]/40 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/60"
                : "border-stone-200 dark:border-white/10 focus:ring-[#1f431e]/20 focus:border-[#1f431e]/40"
          }`}
        />
      </div>
      {error && errorText && (
        <span className="mt-1 block text-[10px] font-semibold text-red-500">
          {errorText}
        </span>
      )}
      {hint && !error && (
        <span className="mt-1 block text-[10px] font-semibold text-[#1f431e]">
          {hint}
        </span>
      )}
    </label>
  );
}
