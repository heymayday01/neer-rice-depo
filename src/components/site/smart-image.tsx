"use client";

import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  hoverScale?: number;
}

/**
 * Reliable image with shimmer-skeleton placeholder.
 * Image is always rendered (no opacity-0) to ensure browsers load it.
 * Shimmer overlay sits on top and fades out when loaded.
 * Hover zoom via CSS transition.
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
        className={`w-full h-full object-cover transition-transform duration-700 ${
          hoverScale ? "hover:scale-110" : ""
        }`}
      />

      {/* Shimmer overlay — sits on top, fades out when loaded */}
      {!loaded && !errored && (
        <div
          className="absolute inset-0 shimmer-skeleton transition-opacity duration-500 pointer-events-none"
          style={{ opacity: 1 }}
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
