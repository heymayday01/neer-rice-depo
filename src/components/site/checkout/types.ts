/**
 * Checkout — shared types, constants, and utilities
 * Extracted from the monolithic checkout-modal.tsx for maintainability.
 */

export type AddressLabel = "Home" | "Work" | "Other";
export type DeliveryId = "standard" | "express" | "pickup";
export type PaymentId = "UPI" | "CARD" | "NETBANKING" | "COD";

export interface SavedAddress {
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

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const COUPONS: Record<string, number> = {
  NEER10: 0.1,
  ORGANIC15: 0.15,
  FARM20: 0.2,
};

export const COUPON_HINTS = [
  { code: "NEER10", off: "10% off", desc: "First order", minOrder: 0 },
  { code: "ORGANIC15", off: "15% off", desc: "Orders above ₹500", minOrder: 500 },
  { code: "FARM20", off: "20% off", desc: "Bulk orders above ₹1500", minOrder: 1500 },
];

export const FREE_SHIP_THRESHOLD = 999;

export const TIP_OPTIONS = [
  { amount: 0, label: "No tip", emoji: "🙂" },
  { amount: 20, label: "₹20", emoji: "😊" },
  { amount: 30, label: "₹30", emoji: "😍" },
  { amount: 50, label: "₹50", emoji: "🤩" },
];

export const DELIVERY_INSTRUCTIONS = [
  { id: "door", label: "Leave at door", icon: "door" },
  { id: "bell", label: "Ring bell", icon: "bell" },
  { id: "call", label: "Call me", icon: "call" },
  { id: "contactless", label: "Contactless", icon: "contactless" },
];

export const ORDER_BUMP = {
  id: "sample-basmati",
  name: "Royal 1121 Basmati — Sample Pack",
  weight: "250g",
  price: 99,
  originalPrice: 149,
  desc: "Try our flagship aged basmati",
};

export const DELIVERY_OPTIONS: {
  id: DeliveryId;
  label: string;
  desc: string;
  fee: number;
  days: number;
  carbon: string;
}[] = [
  {
    id: "standard",
    label: "Standard",
    desc: "Farm-sealed & shipped",
    fee: 0,
    days: 4,
    carbon: "Lowest carbon",
  },
  {
    id: "express",
    label: "Express",
    desc: "Dispatch in 24 hours",
    fee: 49,
    days: 2,
    carbon: "Priority courier",
  },
  {
    id: "pickup",
    label: "Farm Pickup",
    desc: "Pune depot · free",
    fee: 0,
    days: 1,
    carbon: "Zero emissions",
  },
];

export const PAYMENTS: {
  id: PaymentId;
  label: string;
  desc: string;
}[] = [
  { id: "UPI", label: "UPI", desc: "GPay · PhonePe · Paytm · BHIM" },
  { id: "CARD", label: "Credit / Debit Card", desc: "Visa · Mastercard · RuPay · Amex" },
  { id: "NETBANKING", label: "Net Banking", desc: "All major Indian banks" },
  { id: "COD", label: "Cash on Delivery", desc: "Pay when it arrives" },
];

export const DRAFT_KEY = "neer-checkout-draft";
export const SAVED_ADDR_KEY = "neer-saved-addresses";

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

export function lookupPincode(pin: string): { city: string; state: string } | null {
  if (pin.length < 2) return null;
  return PINCODE_MAP[pin.slice(0, 2)] || null;
}

export function detectCardType(number: string): string | null {
  const n = number.replace(/\s/g, "");
  if (!n) return null;
  if (/^4/.test(n)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^(60|65|81|82)/.test(n)) return "RuPay";
  return null;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", opts)}`;
}

export function formatCardNumber(v: string): string {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
