"use client";

import { useSyncExternalStore } from "react";

/**
 * useHydrated — returns true only after the component has mounted on the client.
 *
 * Uses useSyncExternalStore (React 18+) — the lint-clean, React-recommended
 * way to detect client-side mounting without hydration mismatches.
 *
 * The server snapshot returns `false`, and the client snapshot returns `true`
 * after mount. This prevents SSR/client DOM mismatches for state that differs
 * (e.g. localStorage-persisted cart counts, dates, random values).
 */
const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot — always true after hydration
    () => false // server snapshot — false during SSR
  );
}
