"use client";

import { useSyncExternalStore } from "react";

// Minimal toast store — backs the shadcn Toaster component
let toasts: { id: string; title?: string; description?: string; variant?: string }[] = [];
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export function toast(props: { title?: string; description?: string; variant?: string }) {
  const id = Math.random().toString(36).slice(2);
  toasts = [...toasts, { id, ...props }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);
}

export function useToast() {
  const snapshot = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => toasts,
    () => toasts,
  );
  return { toasts: snapshot, toast };
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export { dismissToast };
