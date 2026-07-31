"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, RiceProduct } from "./types";
import { getPriceForWeight } from "./rice-products";

interface CartState {
  items: CartItem[];
  add: (product: RiceProduct, weightKg: number) => void;
  updateQuantity: (productId: string, weightKg: number, qty: number) => void;
  remove: (productId: string, weightKg: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, weightKg) => {
        const { perKg } = getPriceForWeight(product, weightKg);
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.productId === product.id && i.selectedWeightKg === weightKg
          );
          if (idx > -1) {
            const next = [...state.items];
            const item = next[idx];
            const newQty = item.quantity + 1;
            next[idx] = {
              ...item,
              quantity: newQty,
              unitPricePerKg: perKg,
              totalPrice: perKg * weightKg * newQty,
            };
            return { items: next };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                selectedWeightKg: weightKg,
                quantity: 1,
                unitPricePerKg: perKg,
                totalPrice: perKg * weightKg,
              },
            ],
          };
        });
      },
      updateQuantity: (productId, weightKg, qty) => {
        if (qty <= 0) {
          get().remove(productId, weightKg);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.selectedWeightKg === weightKg
              ? { ...i, quantity: qty, totalPrice: i.unitPricePerKg * weightKg * qty }
              : i
          ),
        }));
      },
      remove: (productId, weightKg) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.selectedWeightKg === weightKg)
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((a, i) => a + i.quantity, 0),
      subtotal: () => get().items.reduce((a, i) => a + i.totalPrice, 0),
    }),
    { name: "neer-rice-cart" }
  )
);

/* Order store (local persistence for order tracking demo) */
interface OrderEntry {
  id: string;
  createdAt: string;
  customerName: string;
  total: number;
  itemsCount: number;
  status: "placed" | "processing" | "shipped" | "delivered";
  trackingId: string;
}

interface OrderState {
  orders: OrderEntry[];
  add: (o: OrderEntry) => void;
}

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      add: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    { name: "neer-rice-orders" }
  )
);
