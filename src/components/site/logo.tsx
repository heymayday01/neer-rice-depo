"use client";

/**
 * Neer Rice Depo — Premium SVG Logo Mark
 * A stylized rice panicle (grain stalk with drooping grains) in a circular badge.
 * Razor-sharp at any size. Uses brand colors: forest green + gold.
 */
interface LogoMarkProps {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export function LogoMark({ size = 40, className = "", withGlow = false }: LogoMarkProps) {
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
        <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9c89a" />
          <stop offset="50%" stopColor="#d4a373" />
          <stop offset="100%" stopColor="#b8884f" />
        </linearGradient>
        {/* Forest gradient for the interior */}
        <radialGradient id="logo-forest" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1a3a18" />
          <stop offset="100%" stopColor="#0a1408" />
        </radialGradient>
        {/* Grain gradient */}
        <linearGradient id="logo-grain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0d4a8" />
          <stop offset="100%" stopColor="#c9974f" />
        </linearGradient>
        {withGlow && (
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
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
        stroke="url(#logo-gold)"
        strokeWidth="2"
      />
      {/* Inner badge — forest gradient */}
      <circle cx="32" cy="32" r="27" fill="url(#logo-forest)" />

      {/* Rice panicle — central stalk + drooping grain pairs */}
      <g filter={withGlow ? "url(#logo-glow)" : undefined}>
        {/* Central stalk — gentle curve */}
        <path
          d="M32 50 C 31 42, 31 34, 32 22"
          stroke="#d4a373"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Top grain (terminal) */}
        <ellipse cx="32" cy="20" rx="1.8" ry="3.2" fill="url(#logo-grain)" />

        {/* Grain pairs — drooping outward from stalk, getting longer toward bottom */}
        {/* Pair 1 (top, smallest) */}
        <g>
          <ellipse cx="29" cy="24" rx="1.4" ry="2.8" fill="url(#logo-grain)" transform="rotate(-22 29 24)" />
          <ellipse cx="35" cy="24" rx="1.4" ry="2.8" fill="url(#logo-grain)" transform="rotate(22 35 24)" />
        </g>
        {/* Pair 2 */}
        <g>
          <ellipse cx="28" cy="29" rx="1.5" ry="3" fill="url(#logo-grain)" transform="rotate(-28 28 29)" />
          <ellipse cx="36" cy="29" rx="1.5" ry="3" fill="url(#logo-grain)" transform="rotate(28 36 29)" />
        </g>
        {/* Pair 3 */}
        <g>
          <ellipse cx="27.5" cy="34" rx="1.6" ry="3.2" fill="url(#logo-grain)" transform="rotate(-32 27.5 34)" />
          <ellipse cx="36.5" cy="34" rx="1.6" ry="3.2" fill="url(#logo-grain)" transform="rotate(32 36.5 34)" />
        </g>
        {/* Pair 4 (longest, mid-bottom) */}
        <g>
          <ellipse cx="27" cy="39" rx="1.6" ry="3.2" fill="url(#logo-grain)" transform="rotate(-36 27 39)" />
          <ellipse cx="37" cy="39" rx="1.6" ry="3.2" fill="url(#logo-grain)" transform="rotate(36 37 39)" />
        </g>
        {/* Pair 5 (bottom) */}
        <g>
          <ellipse cx="27.5" cy="44" rx="1.5" ry="3" fill="url(#logo-grain)" transform="rotate(-38 27.5 44)" />
          <ellipse cx="36.5" cy="44" rx="1.5" ry="3" fill="url(#logo-grain)" transform="rotate(38 36.5 44)" />
        </g>
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
