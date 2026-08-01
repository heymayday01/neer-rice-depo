"use client";

/**
 * useCheckoutState — central checkout state + business logic
 * Extracts ~35 useState hooks + effects + handlers from the monolithic component.
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import {
  type AddressLabel,
  type DeliveryId,
  type PaymentId,
  type SavedAddress,
  type CheckoutForm,
  COUPONS,
  DELIVERY_OPTIONS,
  DRAFT_KEY,
  SAVED_ADDR_KEY,
  FREE_SHIP_THRESHOLD,
  lookupPincode,
  detectCardType,
  addDays,
  formatDateRange,
} from "./types";

export function useCheckoutState(open: boolean, coupon: string) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const count = useCart((s) => s.count());
  const clear = useCart((s) => s.clear);
  const updateQty = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.remove);

  // ===== Lazy draft restore (reads localStorage once at init — no effect setState) =====
  const draft = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentId>(draft?.payment ?? "UPI");
  const [delivery, setDelivery] = useState<DeliveryId>(draft?.delivery ?? "standard");
  const [addressLabel, setAddressLabel] = useState<AddressLabel>(draft?.addressLabel ?? "Home");
  const [billingSame, setBillingSame] = useState(draft?.billingSame ?? true);
  const [newsletter, setNewsletter] = useState(draft?.newsletter ?? true);
  const [saveInfo, setSaveInfo] = useState(draft?.saveInfo ?? true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(draft?.whatsappUpdates ?? true);
  const [giftWrap, setGiftWrap] = useState(draft?.giftWrap ?? false);
  const [giftMessage, setGiftMessage] = useState(draft?.giftMessage ?? "");
  const [tip, setTip] = useState(draft?.tip ?? 0);
  const [orderBump, setOrderBump] = useState(draft?.orderBump ?? false);
  const [agreeTerms, setAgreeTerms] = useState(draft?.agreeTerms ?? false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [couponInput, setCouponInput] = useState(coupon || draft?.couponInput || "");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(coupon || draft?.appliedCoupon || null);
  const [showOffers, setShowOffers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [policyModal, setPolicyModal] = useState<null | "terms" | "refund">(null);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const addrRaw = localStorage.getItem(SAVED_ADDR_KEY);
      return addrRaw ? JSON.parse(addrRaw) : [];
    } catch {
      return [];
    }
  });
  const [selectedInstruction, setSelectedInstruction] = useState<string | null>(draft?.selectedInstruction ?? null);

  const [upiId, setUpiId] = useState(draft?.upiId ?? "");
  const [cardNumber, setCardNumber] = useState(draft?.cardNumber ?? "");
  const [cardName, setCardName] = useState(draft?.cardName ?? "");
  const [cardExpiry, setCardExpiry] = useState(draft?.cardExpiry ?? "");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState(draft?.bank ?? "");
  const [saveCard, setSaveCard] = useState(draft?.saveCard ?? false);

  const [form, setForm] = useState<CheckoutForm>(
    draft?.form ?? { fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" }
  );
  const [orderNote, setOrderNote] = useState(draft?.orderNote ?? "");

  // ===== Auto-save draft (writes to localStorage — external system sync) =====
  useEffect(() => {
    if (!open || done) return;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          form, orderNote, payment, delivery, addressLabel, billingSame, newsletter,
          saveInfo, whatsappUpdates, giftWrap, giftMessage, tip, orderBump, agreeTerms,
          couponInput, appliedCoupon, upiId, cardNumber, cardName, cardExpiry, bank, saveCard,
          selectedInstruction,
        })
      );
    } catch {
      /* ignore quota errors */
    }
  }, [
    open, done, form, orderNote, payment, delivery, addressLabel, billingSame, newsletter,
    saveInfo, whatsappUpdates, giftWrap, giftMessage, tip, orderBump, agreeTerms,
    couponInput, appliedCoupon, upiId, cardNumber, cardName, cardExpiry, bank, saveCard,
    selectedInstruction,
  ]);

  // Clear draft on successful order (external system sync — allowed)
  useEffect(() => {
    if (done) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    }
  }, [done]);

  // ===== Derived values =====
  const discountRate = appliedCoupon ? COUPONS[appliedCoupon] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const freeShipMet = subtotal - discount > FREE_SHIP_THRESHOLD || delivery === "pickup";
  const deliveryFee = freeShipMet ? 0 : deliveryOption.fee;
  const giftWrapFee = giftWrap ? 49 : 0;
  const tipFee = tip;
  const orderBumpFee = orderBump ? 99 : 0;
  const total =
    Math.max(0, subtotal - discount) + deliveryFee + giftWrapFee + tipFee + orderBumpFee;
  const loyaltyPoints = Math.floor(total / 10);
  const savings =
    discount +
    (freeShipMet && delivery !== "pickup" ? 79 : 0) +
    (orderBump ? 50 : 0);
  const freeShipRemaining = Math.max(0, FREE_SHIP_THRESHOLD - (subtotal - discount));

  const etaStart = useMemo(
    () => addDays(new Date(), deliveryOption.days),
    [deliveryOption.days]
  );
  const etaEnd = useMemo(() => addDays(etaStart, 1), [etaStart]);
  const eta = formatDateRange(etaStart, etaEnd);

  const cardType = detectCardType(cardNumber);

  // ===== Validation =====
  const errors = {
    fullName: !form.fullName.trim(),
    phone: !/^\d{10}$/.test(form.phone),
    email: form.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    address: !form.address.trim(),
    pincode: !/^\d{6}$/.test(form.pincode),
  };
  const addressValid =
    !errors.fullName && !errors.phone && !errors.email && !errors.address && !errors.pincode;

  const paymentValid = (() => {
    if (payment === "UPI") return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId);
    if (payment === "CARD")
      return (
        cardNumber.replace(/\s/g, "").length >= 15 &&
        cardName.trim().length > 1 &&
        /^\d{2}\/\d{2}$/.test(cardExpiry) &&
        /^\d{3}$/.test(cardCvv)
      );
    if (payment === "NETBANKING") return bank !== "";
    return true;
  })();

  const canPlaceOrder = addressValid && paymentValid && agreeTerms;
  const hasAddress = form.fullName && form.phone && form.address && form.pincode && addressValid;

  // ===== Handlers =====
  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setShowOffers(false);
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
    const updated = [
      newAddr,
      ...savedAddresses.filter(
        (a) =>
          !(
            a.fullName === form.fullName &&
            a.pincode === form.pincode &&
            a.address === form.address
          )
      ),
    ].slice(0, 5);
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

  const copyTrackingId = async (trackingId: string) => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      toast.success("Tracking ID copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };

  const resetState = () => {
    setDone(null);
    setForm({ fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
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
    setSelectedInstruction(null);
  };

  return {
    // cart
    items, subtotal, count, clear, updateQty, removeItem,
    // state
    placing, setPlacing, done, setDone,
    payment, setPayment, delivery, setDelivery,
    addressLabel, setAddressLabel,
    billingSame, setBillingSame, newsletter, setNewsletter,
    saveInfo, setSaveInfo, whatsappUpdates, setWhatsappUpdates,
    giftWrap, setGiftWrap, giftMessage, setGiftMessage,
    tip, setTip, orderBump, setOrderBump,
    agreeTerms, setAgreeTerms, editingAddress, setEditingAddress,
    couponInput, setCouponInput, appliedCoupon, setAppliedCoupon,
    showOffers, setShowOffers, copied,
    policyModal, setPolicyModal,
    showSavedAddresses, setShowSavedAddresses,
    savedAddresses, setSavedAddresses,
    selectedInstruction, setSelectedInstruction,
    upiId, setUpiId, cardNumber, setCardNumber, cardName, setCardName,
    cardExpiry, setCardExpiry, cardCvv, setCardCvv, bank, setBank, saveCard, setSaveCard,
    form, setForm, orderNote, setOrderNote,
    // derived
    discount, deliveryFee, giftWrapFee, tipFee, orderBumpFee, total,
    loyaltyPoints, savings, freeShipRemaining, freeShipMet,
    eta, etaStart, etaEnd, cardType,
    // validation
    errors, addressValid, paymentValid, canPlaceOrder, hasAddress,
    // handlers
    set, applyCouponInline, applyCouponCode, removeCoupon,
    saveCurrentAddress, loadSavedAddress, copyTrackingId, resetState,
  };
}

export type CheckoutState = ReturnType<typeof useCheckoutState>;
