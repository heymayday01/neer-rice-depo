"use client";

import { useId } from "react";

/**
 * Neer Rice Depo — Premium SVG Logo Mark
 * A stylized rice panicle (grain stalk with drooping grains) in a circular badge.
 * Razor-sharp at any size. Uses brand colors: forest green + gold.
 *
 * IMPORTANT: Uses useId() for unique gradient IDs so multiple instances
 * on the same page don't conflict (SVG ID collisions break gradients).
 */
interface LogoMarkProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export function LogoMark({ size = 40, className = "", withGlow = false }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const goldId = `lg-${uid}`;
  const forestId = `lf-${uid}`;
  const grainId = `lgm-${uid}`;
  const glowId = `lgw-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Neer Rice Depo logo"
    >
      <defs>
        {/* Gold gradient for the badge ring */}
        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9c89a" />
          <stop offset="50%" stopColor="#d4a373" />
          <stop offset="100%" stopColor="#b8884f" />
        </linearGradient>
        {/* Forest gradient for the interior */}
        <radialGradient id={forestId} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1a3a18" />
          <stop offset="100%" stopColor="#0a1408" />
        </radialGradient>
        {/* Grain gradient — vertical for realistic rice grain shading */}
        <linearGradient id={grainId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0d4a8" />
          <stop offset="100%" stopColor="#c9974f" />
        </linearGradient>
        {withGlow && (
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* Outer badge ring — gold */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke={`url(#${goldId})`}
        strokeWidth="2"
      />
      {/* Inner badge — forest gradient */}
      <circle cx="32" cy="32" r="27" fill={`url(#${forestId})`} />

      {/* Rice panicle — central stalk + drooping grain pairs */}
      <g filter={withGlow ? `url(#${glowId})` : undefined}>
        {/* Central stalk — gentle S-curve */}
        <path
          d="M32 51 C 31.2 43, 31.2 34, 32.4 21"
          stroke="#d4a373"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rice grains — elongated ellipses with pointed tips (use path for grain shape) */}
        {/* Top terminal grain */}
        <Grain cx={32} cy={19.5} angle={0} fill={`url(#${grainId})`} />

        {/* Grain pairs — symmetric, drooping outward, getting longer toward bottom */}
        <Grain cx={29} cy={24} angle={-22} fill={`url(#${grainId})`} />
        <Grain cx={35} cy={24} angle={22} fill={`url(#${grainId})`} />

        <Grain cx={28} cy={29} angle={-28} fill={`url(#${grainId})`} />
        <Grain cx={36} cy={29} angle={28} fill={`url(#${grainId})`} />

        <Grain cx={27.5} cy={34} angle={-32} fill={`url(#${grainId})`} />
        <Grain cx={36.5} cy={34} angle={32} fill={`url(#${grainId})`} />

        <Grain cx={27} cy={39} angle={-36} fill={`url(#${grainId})`} />
        <Grain cx={37} cy={39} angle={36} fill={`url(#${grainId})`} />

        <Grain cx={27.5} cy={44} angle={-38} fill={`url(#${grainId})`} />
        <Grain cx={36.5} cy={44} angle={38} fill={`url(#${grainId})`} />
      </g>

      {/* Subtle bottom highlight — water reference (Neer = water) */}
      <path
        d="M22 53 Q 27 51, 32 53 T 42 53"
        stroke="#d4a373"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}

/** A single rice grain — elongated pointed ellipse (path-based for realistic shape) */
function Grain({
  cx,
  cy,
  angle,
  fill,
}: {
  cx: number;
  cy: number;
  angle: number;
  fill: string;
}) {
  // Rice grain shape: pointed top + bottom, ~1.6 wide × 3.4 tall
  // Drawn as a path so it looks like an actual grain, not a blob
  return (
    <path
      d="M0 -3.4 C 0.8 -2.8, 0.9 -1, 0.7 0 C 0.9 1, 0.8 2.8, 0 3.4 C -0.8 2.8, -0.9 1, -0.7 0 C -0.9 -1, -0.8 -2.8, 0 -3.4 Z"
      fill={fill}
      transform={`translate(${cx} ${cy}) rotate(${angle})`}
    />
  );
}

/** Full logo lockup — mark + wordmark */
export function LogoFull({
  size = 40,
  className = "",
  showTagline = true,
}: {
  size?: number;
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <div className="text-left leading-none">
        <span className="font-serif font-bold text-white tracking-tight block">
          Neer Rice Depo
        </span>
        {showTagline && (
          <span className="text-[9px] text-[#d4a373] font-medium uppercase tracking-[0.2em] block mt-1">
            Farm Direct · Heirloom
          </span>
        )}
      </div>
    </div>
  );
}
