export type RiceCategory =
  | "all"
  | "daily"
  | "heritage"
  | "aromatic"
  | "superfood"
  | "combos";

export type GrainType = "Short" | "Medium" | "Long" | "Extra Long";

export type ProcessingType = "Raw" | "Steamed" | "Parboiled" | "Unpolished";

export type GILevel = "Low (<55)" | "Medium (55-69)" | "High (>70)";

export interface NutritionFacts {
  caloriesPer100g: number;
  carbsGrams: number;
  proteinGrams: number;
  fiberGrams: number;
  glycemicIndexValue: number;
}

export interface RiceProduct {
  id: string;
  name: string;
  nativeName?: string;
  tagline: string;
  category: "daily" | "heritage" | "aromatic" | "superfood" | "combos";
  pricePerKg: number;
  discountedPricePerKg?: number;
  availableWeights: number[];
  grainType: GrainType;
  processing: ProcessingType;
  aromaLevel: number;
  giIndex: GILevel;
  agingMonths: number;
  originRegion: string;
  waterRatio: string;
  description: string;
  bestFor: string[];
  badges: string[];
  stockKg: number;
  rating: number;
  reviewsCount: number;
  image: string;
  nutritionFacts: NutritionFacts;
  farmingMethod: string;
}

export interface CartItem {
  productId: string;
  product: RiceProduct;
  selectedWeightKg: number;
  quantity: number;
  unitPricePerKg: number;
  totalPrice: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "COD";
  paymentStatus: "PAID" | "PENDING";
  orderStatus: "placed" | "processing" | "shipped" | "delivered";
  trackingId: string;
}

export interface AISommelierRecommendation {
  recommendedProductIds: string[];
  summary: string;
  cookingTips: string;
  suggestedDishes: string[];
  healthNote: string;
}
