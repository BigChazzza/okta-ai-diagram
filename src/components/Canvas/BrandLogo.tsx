"use client";

import * as simpleIcons from "simple-icons";

interface SimpleIcon {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

interface BrandLogoProps {
  slug?: string;
  fallbackMonogram: string;
  size?: number;
  color?: string;
  monoColor?: string;
}

function lookupIcon(slug?: string): SimpleIcon | null {
  if (!slug) return null;
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icons = simpleIcons as unknown as Record<string, SimpleIcon | undefined>;
  return icons[key] ?? null;
}

export function BrandLogo({
  slug,
  fallbackMonogram,
  size = 28,
  color = "#FFFFFF",
  monoColor,
}: BrandLogoProps) {
  const icon = lookupIcon(slug);
  if (icon) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={icon.title}
      >
        <title>{icon.title}</title>
        <path d={icon.path} fill={color} />
      </svg>
    );
  }
  return (
    <span
      style={{
        fontSize: Math.round(size * 0.42),
        color: monoColor ?? color,
        fontWeight: 700,
        letterSpacing: "-0.02em",
      }}
      className="select-none uppercase"
    >
      {fallbackMonogram}
    </span>
  );
}
