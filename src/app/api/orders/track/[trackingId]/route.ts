import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params;
    const order = await db.order.findUnique({
      where: { trackingId },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: order.id,
      trackingId: order.trackingId,
      createdAt: order.createdAt,
      customerName: order.customerName,
      total: order.total,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      items: JSON.parse(order.itemsJson || "[]"),
    });
  } catch (err) {
    console.error("Track order error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
