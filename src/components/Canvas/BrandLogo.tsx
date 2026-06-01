"use client";

import { User, Users, type LucideIcon } from "lucide-react";
import * as simpleIcons from "simple-icons";
import type { LucideIconName } from "@/lib/types";

interface SimpleIcon {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

interface BrandLogoProps {
  slug?: string;
  lucideIcon?: LucideIconName;
  fallbackMonogram: string;
  size?: number;
  color?: string;
  monoColor?: string;
}

const LUCIDE_MAP: Record<LucideIconName, LucideIcon> = {
  user: User,
  users: Users,
};

function lookupIcon(slug?: string): SimpleIcon | null {
  if (!slug) return null;
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icons = simpleIcons as unknown as Record<string, SimpleIcon | undefined>;
  return icons[key] ?? null;
}

export function BrandLogo({
  slug,
  lucideIcon,
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
  if (lucideIcon) {
    const LucideComp = LUCIDE_MAP[lucideIcon];
    return <LucideComp size={size} color={color} strokeWidth={2} />;
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
