"use client";

import { motion } from "framer-motion";

interface RadialGaugeProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  color?: string;
}

/**
 * Mini radial progress gauge — visualizes product attributes
 * (aroma level, GI score) as a ring instead of text.
 * 2026 data visualization pattern.
 */
export function RadialGauge({
  value,
  max = 5,
  size = 32,
  label,
  color = "#d4a373",
}: RadialGaugeProps) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex items-center gap-1.5">
      <div className="radial-gauge" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: dashOffset }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span
          className="absolute data-mono text-[8px] font-bold"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      {label && (
        <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
          {label}
        </span>
      )}
    </div>
  );
}
