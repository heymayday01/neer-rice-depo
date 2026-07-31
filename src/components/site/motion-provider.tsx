"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global motion provider:
 * - Lenis smooth scroll (desktop only; mobile uses native momentum)
 * - GSAP ScrollTrigger synced with Lenis rAF
 * - Respects prefers-reduced-motion
 * - Locks scroll when [data-scroll-locked] is set on <body> (modals)
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    // Mobile devices have native smooth momentum scroll — skip Lenis to avoid conflicts
    const isMobile =
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Scroll-lock observer for modals
    const observer = new MutationObserver(() => {
      if (document.body.hasAttribute("data-scroll-locked")) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    // Also react to overflow style changes (shadcn sets body overflow hidden)
    const checkLocked = () => {
      const locked = document.body.style.overflow === "hidden";
      if (locked) lenis.stop();
      else lenis.start();
    };
    const overflowObserver = new MutationObserver(checkLocked);
    overflowObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      observer.disconnect();
      overflowObserver.disconnect();
    };
  }, [reduced]);

  return <>{children}</>;
}
