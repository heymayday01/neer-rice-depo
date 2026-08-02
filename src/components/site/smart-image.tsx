"use client";

import { useState, useRef, useEffect } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Load eagerly (above-fold images). Default: false (lazy) */
  priority?: boolean;
}

/**
 * SmartImage — premium image with:
 * - Lazy loading by default (eager only when priority=true)
 * - Smooth fade-in on load (opacity 0→1, 700ms ease-out)
 * - Handles cached images that load before React hydrates
 * - Graceful error fallback with grain emoji
 */
export function SmartImage({
  src,
  alt,
  className = "",
  priority = false,
}: SmartImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Handle cached images: if the image already loaded before React hydrated,
  // onLoad may have already fired. Check img.complete after mount.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className="w-full h-full object-cover transition-opacity duration-700 ease-out"
        style={{ opacity: loaded && !errored ? 1 : 0 }}
      />

      {/* Loading placeholder — subtle shimmer */}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 80%)",
            backgroundSize: "200% 100%",
            animation: "shimmerPlaceholder 1.5s ease-in-out infinite",
          }}
        />
      )}

      {/* Error fallback */}
      {errored && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/[0.03] border border-white/5"
          aria-hidden
        >
          <span className="text-3xl opacity-20">🌾</span>
        </div>
      )}
    </div>
  );
}
