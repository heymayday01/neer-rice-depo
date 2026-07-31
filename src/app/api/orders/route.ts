import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeTrackingId() {
  return (
    "NRD" +
    Date.now().toString(36).toUpperCase().slice(-6) +
    Math.random().toString(36).toUpperCase().slice(2, 5)
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, discount, deliveryFee, total, paymentMethod } = body;

    if (!customer?.fullName || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
        itemsJson: JSON.stringify(items),
        subtotal: Number(subtotal) || 0,
        discount: Number(discount) || 0,
        deliveryFee: Number(deliveryFee) || 0,
        total: Number(total) || 0,
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
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Order list error:", err);
    return NextResponse.json({ orders: [] });
  }
}
