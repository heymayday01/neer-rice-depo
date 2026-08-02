"use client";

import { useEffect, useRef } from "react";

/**
 * useModalBackHandler — intercepts the browser back button / mobile swipe-back
 * gesture to close a modal instead of navigating away from the page.
 *
 * SIMPLE ROBUST APPROACH (race-condition-free):
 * - One global popstate listener that re-pushes state and closes the topmost modal
 * - Each modal pushes/removes from a shared stack
 * - NO history.back() on cleanup → no race conditions when modals transition
 *   (e.g. cart → checkout closes one and opens another simultaneously)
 *
 * Trade-off: if a user closes a modal via UI (not back), there may be an orphan
 * sentinel in history — the next back press does nothing (pops sentinel, no modal).
 * This is standard PWA behavior and much better than navigating away unexpectedly.
 */

// Module-level shared stack
const modalStack: string[] = [];
const listeners = new Map<string, () => void>();
let sentinelPushed = false;
let listenerInstalled = false;

function ensureListener() {
  if (listenerInstalled || typeof window === "undefined") return;
  listenerInstalled = true;

  window.addEventListener("popstate", () => {
    if (modalStack.length > 0) {
      // A modal is open — re-push sentinel so page doesn't navigate away
      history.pushState({ modal: true }, "");
      // Close the topmost modal
      const topId = modalStack[modalStack.length - 1];
      const fn = listeners.get(topId);
      if (fn) fn();
    }
  });
}

export function useModalBackHandler(open: boolean, onClose: () => void) {
  const idRef = useRef<string>();
  if (!idRef.current) {
    idRef.current = Math.random().toString(36).slice(2);
  }
  const id = idRef.current;

  useEffect(() => {
    if (onClose) listeners.set(id, onClose);
    return () => { listeners.delete(id); };
  }, [id, onClose]);

  useEffect(() => {
    ensureListener();
    if (open) {
      modalStack.push(id);
      if (!sentinelPushed) {
        history.pushState({ modal: true }, "");
        sentinelPushed = true;
      }
      return () => {
        const idx = modalStack.lastIndexOf(id);
        if (idx !== -1) modalStack.splice(idx, 1);
        // Don't call history.back() — avoids race conditions.
        // The orphan sentinel will be consumed on next back press (harmless).
      };
    }
  }, [open, id]);
}
