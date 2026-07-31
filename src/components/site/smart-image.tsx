"use client";

import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  hoverScale?: number;
}

/**
 * Reliable image with loading placeholder.
 * Image is always rendered (no opacity-0) to ensure browsers load it.
 * Simple fade-in on load, no shine/shimmer effects.
 */
export function SmartImage({
  src,
  alt,
  className = "",
  hoverScale,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image — always visible so browser loads it */}
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded && !errored ? "opacity-100" : "opacity-0"
        } ${hoverScale ? "transition-transform duration-700 hover:scale-110" : ""}`}
      />

      {/* Loading placeholder — solid dark, no shimmer */}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 bg-white/[0.03] pointer-events-none"
          aria-hidden
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
