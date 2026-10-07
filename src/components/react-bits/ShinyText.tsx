"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`relative inline-block bg-clip-text ${
        disabled
          ? "text-emerald-300"
          : "bg-gradient-to-r from-emerald-100 via-amber-200 to-emerald-100 bg-[length:200%_auto] text-transparent animate-shimmer"
      } ${className}`}
      style={{
        animationDuration: disabled ? undefined : animationDuration,
      }}
    >
      {text}
    </span>
  );
}
