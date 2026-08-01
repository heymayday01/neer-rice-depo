"use client";

import { useCallback, useRef } from "react";
import { animate } from "framer-motion";

/**
 * useFlyToCart — animates a product image flying to the cart icon.
 *
 * Usage:
 *   const flyToCart = useFlyToCart();
 *   <button onClick={(e) => { flyToCart(e.currentTarget, product.image); add(product); }}>
 *
 * How it works:
 * 1. Gets the source element's bounding rect (the clicked button/card).
 * 2. Finds the cart icon in the DOM (by aria-label or data attribute).
 * 3. Creates a flying clone of the product image.
 * 4. Animates it from source → cart with an arc trajectory.
 * 5. Removes the clone after animation completes.
 */
export function useFlyToCart() {
  const flyingRef = useRef<HTMLImageElement | null>(null);

  const flyToCart = useCallback(
    (sourceEl: HTMLElement, imageSrc?: string, sourceRect?: DOMRect) => {
      if (typeof window === "undefined") return;

      // Find the cart icon — try desktop header first, then mobile dock
      const cartIcon =
        document.querySelector<HTMLElement>('[data-cart-target="true"]') ||
        document.querySelector<HTMLElement>('[aria-label*="Cart"]') ||
        document.querySelector<HTMLElement>('[aria-label*="Basket"]');

      if (!cartIcon) return;

      const source = sourceRect || sourceEl.getBoundingClientRect();
      const target = cartIcon.getBoundingClientRect();

      // Create the flying image clone
      const flyImg = document.createElement("img");
      flyImg.src = imageSrc || "/neer-logo-premium.png";
      flyImg.style.cssText = `
        position: fixed;
        left: ${source.left}px;
        top: ${source.top}px;
        width: 64px;
        height: 64px;
        border-radius: 12px;
        object-fit: cover;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 0 2px rgba(212,163,115,0.4);
        opacity: 1;
      `;
      document.body.appendChild(flyImg);
      flyingRef.current = flyImg;

      // Calculate the mid-point for an arc trajectory
      const dx = target.left + target.width / 2 - source.left - source.width / 2;
      const dy = target.top + target.height / 2 - source.top - source.height / 2;
      const midX = dx / 2;
      const midY = dy / 2 - 80; // arc upward

      // Animate with framer-motion's animate() — arc via keyframes
      const controls = animate(
        0,
        1,
        {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (progress) => {
            // Quadratic Bezier for arc: P0 → P1(mid) → P2(target)
            const t = progress;
            const x = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * midX + t * t * dx;
            const y = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * midY + t * t * dy;
            const scale = 1 - t * 0.5; // shrink as it flies
            const opacity = t > 0.85 ? (1 - t) / 0.15 : 1; // fade out at end

            flyImg.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            flyImg.style.opacity = String(opacity);
          },
          onComplete: () => {
            // Pulse the cart icon
            cartIcon.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
            cartIcon.style.transform = "scale(1.25)";
            setTimeout(() => {
              cartIcon.style.transform = "scale(1)";
            }, 200);

            // Remove the flying image
            if (flyImg.parentNode) {
              flyImg.parentNode.removeChild(flyImg);
            }
            flyingRef.current = null;
          },
        }
      );

      return controls;
    },
    []
  );

  return flyToCart;
}
