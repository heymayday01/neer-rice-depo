"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { ProductCatalog } from "@/components/site/product-catalog";
import { GrainWisdomHub } from "@/components/site/grain-wisdom";
import { Footer } from "@/components/site/footer";
import { MobileDock } from "@/components/site/mobile-dock";
import { MobileMenuSheet } from "@/components/site/mobile-menu-sheet";
import { Onboarding } from "@/components/site/onboarding";
import { ProductDetailModal } from "@/components/site/modals/product-detail-modal";
import { CartDrawer } from "@/components/site/modals/cart-drawer";
import { CheckoutModal } from "@/components/site/modals/checkout-modal";
import { OrderTrackerModal } from "@/components/site/modals/order-tracker-modal";
import { AISommelierModal } from "@/components/site/modals/ai-sommelier-modal";
import { ComparisonModal } from "@/components/site/modals/comparison-modal";
import { RiceProduct } from "@/lib/types";
import { useOrders } from "@/lib/cart-store";

type DockTab = "home" | "ai" | "matrix" | "orders" | "cart";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingTrackingId, setPendingTrackingId] = useState<string | null>(null);

  // Onboarding — show on first visit (localStorage flag). Lazy init avoids
  // setState-in-effect; SSR-safe via typeof guard.
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !localStorage.getItem("neer-onboarding-seen");
    } catch {
      return false;
    }
  });

  const dismissOnboarding = () => {
    try {
      localStorage.setItem("neer-onboarding-seen", "1");
    } catch {
      /* noop */
    }
    setShowOnboarding(false);
  };

  const addOrder = useOrders((s) => s.add);

  const dockActive: DockTab = aiOpen
    ? "ai"
    : compareOpen
      ? "matrix"
      : ordersOpen
        ? "orders"
        : cartOpen
          ? "cart"
          : "home";

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
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <main className="flex-1">
        <Hero
          onOpenAISommelier={() => setAiOpen(true)}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
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

      {/* Mobile dock — animates out when a modal/sheet is open to avoid overlap */}
      <MobileDock
        active={dockActive}
        visible={!detailProduct && !aiOpen && !compareOpen && !ordersOpen && !cartOpen && !checkoutOpen && !mobileMenuOpen}
        onHome={() => {
          setActiveCategory("all");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenCart={() => setCartOpen(true)}
        onOpenAISommelier={() => setAiOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenComparison={() => setCompareOpen(true)}
      />

      {/* Spacer so content isn't hidden behind the mobile dock */}
      <div className="sm:hidden h-28" aria-hidden />

      {/* Mobile menu */}
      <MobileMenuSheet
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenAISommelier={() => setAiOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenComparison={() => setCompareOpen(true)}
      />

      {/* Modals */}
      <ProductDetailModal product={detailProduct} onClose={() => setDetailProduct(null)} />
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

      {/* Onboarding overlay — first visit only */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={dismissOnboarding} onSkip={dismissOnboarding} />
        )}
      </AnimatePresence>
    </div>
  );
}
