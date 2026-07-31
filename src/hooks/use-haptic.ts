"use client";

import { useCallback } from "react";

type HapticStyle = "light" | "medium" | "heavy" | "selection" | "success" | "warning" | "error";

/**
 * Unified haptic feedback hook for mobile.
 * Uses the Vibration API with pattern mapping for different feedback types.
 * Gracefully degrades on unsupported devices.
 */
export function useHaptic() {
  const trigger = useCallback((style: HapticStyle = "light") => {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;

    const patterns: Record<HapticStyle, number | number[]> = {
      light: 8,
      medium: [12, 20, 12],
      heavy: [20, 40, 20],
      selection: 5,
      success: [10, 30, 10, 30, 20],
      warning: [15, 40, 15],
      error: [20, 60, 20, 60, 20],
    };

    try {
      navigator.vibrate(patterns[style]);
    } catch {
      /* noop */
    }
  }, []);

  return trigger;
}
