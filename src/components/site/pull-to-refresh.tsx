"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  children: React.ReactNode;
}

/**
 * Pull-to-refresh with elastic physics and a custom grain-bowl indicator.
 * Only activates when scrollTop === 0 and user drags down.
 * Uses touch events for native-feeling elastic resistance.
 */
export function PullToRefresh({
  onRefresh,
  threshold = 80,
  children,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    },
    [refreshing]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }
      // Elastic resistance — diminishes as you pull more
      const elastic = Math.min(delta * 0.4, threshold * 1.5);
      setPullDistance(elastic);
    },
    [refreshing, threshold]
  );

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= threshold) {
      setRefreshing(true);
      setPullDistance(threshold);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, onRefresh]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      pulling.current = false;
    };
  }, []);

  const progress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 0 || refreshing;

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative"
    >
      {/* Pull-to-refresh indicator — grain bowl fill */}
      {showIndicator && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center transition-opacity"
          style={{
            height: `${pullDistance}px`,
            opacity: progress,
          }}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Bowl outline */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              className={refreshing ? "animate-spin" : ""}
              style={{ animationDuration: "0.8s" }}
            >
              <path
                d="M4 14h20a10 10 0 01-20 0z"
                stroke="#d4a373"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Grain fill — rises with pull progress */}
              <clipPath id="bowl-clip">
                <path d="M4 14h20a10 10 0 01-20 0z" />
              </clipPath>
              <rect
                x="4"
                y={24 - progress * 16}
                width="20"
                height="16"
                fill="#d4a373"
                opacity="0.4"
                clipPath="url(#bowl-clip)"
              />
            </svg>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#d4a373] mt-1">
            {refreshing ? "Refreshing…" : progress >= 1 ? "Release" : "Pull"}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
