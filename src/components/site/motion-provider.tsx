"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global motion provider:
 * - MotionConfig reducedMotion="user" (accessibility — respects OS setting)
 * - Lenis smooth scroll (DESKTOP ONLY — mobile uses native iOS momentum)
 * - GSAP ScrollTrigger synced with Lenis rAF
 * - Respects prefers-reduced-motion
 * - Locks scroll when body overflow is hidden (modals)
 *
 * Mobile: native -webkit-overflow-scrolling: touch + overscroll-behavior
 * gives buttery smooth scroll without JS interference. Adding Lenis on
 * mobile creates touch-event conflicts with pull-to-refresh and other
 * touch handlers, causing jank.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    // Desktop only — mobile has native buttery smooth scroll
    const isMobile =
      window.innerWidth < 768 ||
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.0,
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

    // Single scroll-lock observer — watches body style changes for modal lock
    const checkLocked = () => {
      const locked =
        document.body.style.overflow === "hidden" ||
        document.body.hasAttribute("data-scroll-locked");
      if (locked) lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(checkLocked);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 30 }}>
      {children}
    </MotionConfig>
  );
}
