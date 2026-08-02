import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RICE_PRODUCTS } from "@/lib/rice-products";
import type { CartItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Server-side coupon whitelist (don't trust client)
const COUPONS: Record<string, number> = {
  NEER10: 0.1,
  ORGANIC15: 0.15,
  FARM20: 0.2,
};

const FREE_SHIP_THRESHOLD = 999;

function makeTrackingId() {
  return (
    "NRD" +
    Date.now().toString(36).toUpperCase().slice(-6) +
    Math.random().toString(36).toUpperCase().slice(2, 5)
  );
}

interface OrderItem {
  productId: string;
  selectedWeightKg: number;
  quantity: number;
}

/**
 * Recompute prices server-side — NEVER trust client-supplied prices.
 * Looks up the actual product price from the server-side product list.
 */
function recomputeOrder(items: OrderItem[], couponCode?: string | null) {
  let subtotal = 0;
  const validatedItems: CartItem[] = [];

  for (const item of items) {
    const product = RICE_PRODUCTS.find((p) => p.id === item.productId);
    if (!product) continue; // skip unknown products

    const weight = item.selectedWeightKg;
    if (!product.availableWeights.includes(weight)) continue; // invalid weight

    const qty = Math.max(1, Math.min(99, Math.floor(item.quantity))); // clamp 1-99
    const perKg = product.discountedPricePerKg ?? product.pricePerKg;
    const multiplier = weight === 10 ? 0.95 : weight === 25 ? 0.88 : 1;
    const unitPricePerKg = Math.round(perKg * multiplier);
    const totalPrice = unitPricePerKg * weight * qty;

    subtotal += totalPrice;
    validatedItems.push({
      productId: product.id,
      product,
      selectedWeightKg: weight,
      quantity: qty,
      unitPricePerKg,
      totalPrice,
    });
  }

  const discountRate = couponCode ? COUPONS[couponCode] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryFee = subtotal - discount > FREE_SHIP_THRESHOLD ? 0 : 79;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  return { validatedItems, subtotal, discount, deliveryFee, total };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, paymentMethod, couponCode } = body;

    if (!customer?.fullName || !customer?.phone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone
    if (!/^\d{10}$/.test(customer.phone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Recompute prices server-side (don't trust client)
    const { validatedItems, subtotal, discount, deliveryFee, total } =
      recomputeOrder(items, couponCode);

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items in order" },
        { status: 400 }
      );
    }

    const trackingId = makeTrackingId();
    const order = await db.order.create({
      data: {
        trackingId,
        customerName: customer.fullName,
        email: customer.email || "",
        phone: customer.phone,
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        pincode: customer.pincode || "",
        itemsJson: JSON.stringify(validatedItems),
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod: paymentMethod || "UPI",
        paymentStatus: "PENDING",
        orderStatus: "placed",
      },
    });

    return NextResponse.json({
      id: order.id,
      trackingId: order.trackingId,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      total: order.total,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET removed — was exposing PII without auth. Use track/[trackingId] for lookups.
