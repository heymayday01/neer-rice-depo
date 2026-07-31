"use client";

import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { ProductCatalog } from "@/components/site/product-catalog";
import { GrainWisdomHub } from "@/components/site/grain-wisdom";
import { Footer } from "@/components/site/footer";
import { MobileDock } from "@/components/site/mobile-dock";
import { MobileMenuSheet } from "@/components/site/mobile-menu-sheet";
import { Onboarding } from "@/components/site/onboarding";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { RiceProduct } from "@/lib/types";
import { useOrders } from "@/lib/cart-store";

// Lazy-load modals — they only enter the bundle when opened (code-splitting)
const ProductDetailModal = lazy(() =>
  import("@/components/site/modals/product-detail-modal").then((m) => ({
    default: m.ProductDetailModal,
  }))
);
const CartDrawer = lazy(() =>
  import("@/components/site/modals/cart-drawer").then((m) => ({ default: m.CartDrawer }))
);
const CheckoutModal = lazy(() =>
  import("@/components/site/modals/checkout-modal").then((m) => ({
    default: m.CheckoutModal,
  }))
);
const OrderTrackerModal = lazy(() =>
  import("@/components/site/modals/order-tracker-modal").then((m) => ({
    default: m.OrderTrackerModal,
  }))
);
const AISommelierModal = lazy(() =>
  import("@/components/site/modals/ai-sommelier-modal").then((m) => ({
    default: m.AISommelierModal,
  }))
);
const ComparisonModal = lazy(() =>
  import("@/components/site/modals/comparison-modal").then((m) => ({
    default: m.ComparisonModal,
  }))
);

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

  const dismissOnboarding = useCallback(() => {
    try {
      localStorage.setItem("neer-onboarding-seen", "1");
    } catch {
      /* noop */
    }
    setShowOnboarding(false);
  }, []);

  const addOrder = useOrders((s) => s.add);

  // Dock active state — memoized to avoid recompute on every render
  const dockActive: DockTab = useMemo(
    () =>
      aiOpen
        ? "ai"
        : compareOpen
          ? "matrix"
          : ordersOpen
            ? "orders"
            : cartOpen
              ? "cart"
              : "home",
    [aiOpen, compareOpen, ordersOpen, cartOpen]
  );

  // Dock visibility — memoized
  const dockVisible = useMemo(
    () =>
      !detailProduct &&
      !aiOpen &&
      !compareOpen &&
      !ordersOpen &&
      !cartOpen &&
      !checkoutOpen &&
      !mobileMenuOpen,
    [detailProduct, aiOpen, compareOpen, ordersOpen, cartOpen, checkoutOpen, mobileMenuOpen]
  );

  // Stable callbacks to avoid child re-renders
  const handleSelectCategory = useCallback(
    (cat: string) => {
      setActiveCategory(cat);
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  const handleOrderPlaced = useCallback(
    (trackingId: string) => {
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
    },
    [addOrder]
  );

  const handleCheckout = useCallback((c: string) => {
    setCoupon(c);
    setCartOpen(false);
    setCheckoutOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1209] font-sans text-stone-100 antialiased">
      <ScrollProgress />
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
          onSelectCategory={handleSelectCategory}
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

      {/* Mobile dock — animates out when a modal/sheet is open */}
      <MobileDock
        active={dockActive}
        visible={dockVisible}
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

      {/* Modals — lazy-loaded, only render when opened to keep DOM light */}
      <Suspense fallback={null}>
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      </Suspense>
      {cartOpen && (
        <Suspense fallback={null}>
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            onCheckout={handleCheckout}
          />
        </Suspense>
      )}
      {checkoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            coupon={coupon}
            onOrderPlaced={handleOrderPlaced}
            onOpenOrderTracker={() => setOrdersOpen(true)}
          />
        </Suspense>
      )}
      {ordersOpen && (
        <Suspense fallback={null}>
          <OrderTrackerModal
            open={ordersOpen}
            onClose={() => setOrdersOpen(false)}
            pendingTrackingId={pendingTrackingId}
          />
        </Suspense>
      )}
      {aiOpen && (
        <Suspense fallback={null}>
          <AISommelierModal open={aiOpen} onClose={() => setAiOpen(false)} />
        </Suspense>
      )}
      {compareOpen && (
        <Suspense fallback={null}>
          <ComparisonModal open={compareOpen} onClose={() => setCompareOpen(false)} />
        </Suspense>
      )}

      {/* Onboarding overlay — first visit only */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={dismissOnboarding} onSkip={dismissOnboarding} />
        )}
      </AnimatePresence>
    </div>
  );
}
