'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_NAME, LOGO_SRC, LOGO_NATIVE_WIDTH, LOGO_NATIVE_HEIGHT } from '@/lib/brand';

interface BrandLogoProps {
  /** Rendered height in px at the smallest breakpoint (mobile). Width auto-scales. */
  heightClass?: string;
  /** If true, wraps in a <Link href="/homepage"> */
  asLink?: boolean;
  /** Override the aria label (e.g. "DETARA Home") */
  ariaLabel?: string;
  /** Priority=true for above-the-fold usage (header) */
  priority?: boolean;
  className?: string;
}

/**
 * The DETARA wordmark. Single source of truth for the brand logo.
 *
 * Renders identically on server and client (no state, no window access) — safe
 * from hydration mismatches. Uses next/image so it is served in AVIF/WebP with
 * a proper srcset, and preloaded when `priority` is true.
 *
 * IMPORTANT: does NOT apply `mix-blend-mode` — the previous implementation
 * multiplied the logo against the scrolled nav-glass background which caused
 * the wordmark to fade/wash-out on every scroll change.
 */
export default function BrandLogo({
  heightClass = 'h-[60px] sm:h-[68px] md:h-[78px] lg:h-[108px] xl:h-[120px]',
  asLink = true,
  ariaLabel = `${BRAND_NAME} Home`,
  priority = false,
  className = '',
}: BrandLogoProps) {
  const img = (
    <Image
      src={LOGO_SRC}
      alt={BRAND_NAME}
      width={LOGO_NATIVE_WIDTH}
      height={LOGO_NATIVE_HEIGHT}
      priority={priority}
      sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 420px"
      className={`object-contain w-auto select-none ${heightClass} ${className}`}
      draggable={false}
    />
  );

  if (!asLink) return img;
  return (
    <Link
      href="/homepage"
      aria-label={ariaLabel}
      className="inline-flex items-center"
      style={{ touchAction: 'manipulation' }}
    >
      {img}
    </Link>
  );
}
