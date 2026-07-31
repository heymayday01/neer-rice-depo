"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { ProductCatalog } from "@/components/site/product-catalog";
import { GrainWisdomHub } from "@/components/site/grain-wisdom";
import { Footer } from "@/components/site/footer";
import { MobileDock } from "@/components/site/mobile-dock";
import { ProductDetailModal } from "@/components/site/modals/product-detail-modal";
import { CartDrawer } from "@/components/site/modals/cart-drawer";
import { CheckoutModal } from "@/components/site/modals/checkout-modal";
import { OrderTrackerModal } from "@/components/site/modals/order-tracker-modal";
import { AISommelierModal } from "@/components/site/modals/ai-sommelier-modal";
import { ComparisonModal } from "@/components/site/modals/comparison-modal";
import { RiceProduct } from "@/lib/types";
import { useOrders } from "@/lib/cart-store";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [detailProduct, setDetailProduct] = useState<RiceProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [pendingTrackingId, setPendingTrackingId] = useState<string | null>(null);

  const addOrder = useOrders((s) => s.add);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] font-sans text-stone-900 antialiased">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenCart={() => setCartOpen(true)}
        onOpenAISommelier={() => setAiOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenComparison={() => setCompareOpen(true)}
      />

      <main className="flex-1 max-md:pt-24 md:pt-0">
        <Hero
          onOpenAISommelier={() => setAiOpen(true)}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            document
              .getElementById("catalog")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          onOpenComparison={() => setCompareOpen(true)}
        />

        <div id="catalog">
          <ProductCatalog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onOpenComparison={() => setCompareOpen(true)}
            onOpenDetail={(p) => setDetailProduct(p)}
          />
        </div>

        <GrainWisdomHub />
      </main>

      <Footer onOpenAISommelier={() => setAiOpen(true)} />

      {/* Mobile dock */}
      <MobileDock
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onOpenCart={() => setCartOpen(true)}
        onOpenAISommelier={() => setAiOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenComparison={() => setCompareOpen(true)}
      />

      {/* Modals */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={(c) => {
          setCoupon(c);
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        coupon={coupon}
        onOrderPlaced={(trackingId) => {
          addOrder({
            id: trackingId,
            createdAt: new Date().toISOString(),
            customerName: "",
            total: 0,
            itemsCount: 0,
            status: "placed",
            trackingId,
          });
          setPendingTrackingId(trackingId);
        }}
        onOpenOrderTracker={() => setOrdersOpen(true)}
      />

      <OrderTrackerModal
        open={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        pendingTrackingId={pendingTrackingId}
      />

      <AISommelierModal open={aiOpen} onClose={() => setAiOpen(false)} />
      <ComparisonModal open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  );
}
