"use client";

import { useState, type ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  /** Framer Motion whileHover prop (for zoom on hover) */
  hoverScale?: number;
}

/**
 * Image with a shimmer-skeleton placeholder while loading,
 * and a graceful fade-in on load. Falls back to a neutral
 * placeholder if the image errors (e.g. still generating).
 */
export function SmartImage({
  src,
  alt,
  className = "",
  hoverScale,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const MotionTag = hoverScale ? motion.img : "img";
  const motionProps = hoverScale
    ? {
        whileHover: { scale: hoverScale },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {};

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder */}
      {!loaded && !errored && (
        <div className="absolute inset-0 shimmer-skeleton" aria-hidden />
      )}
      {/* Error fallback */}
      {errored && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f5f2ed] to-[#e7e5e4]"
          aria-hidden
        >
          <span className="text-3xl opacity-30">🌾</span>
        </div>
      )}
      <MotionTag
        {...(motionProps as object)}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`relative w-full h-full object-cover transition-opacity duration-500 ${
          loaded && !errored ? "opacity-100" : "opacity-0"
        }`}
        {...rest}
      />
    </div>
  );
}
