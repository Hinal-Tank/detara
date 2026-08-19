'use client';

import React from 'react';
import Link from 'next/link';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface FinalCtaSectionProps {
  section: HomepageSection | null;
}

export default function FinalCtaSection({ section }: FinalCtaSectionProps) {
  const title = section?.title || 'FIND YOUR DETARA.';
  const description = section?.description || 'Quietly exceptional diamond jewellery, crafted with precision and designed to last.';
  const ctaText = section?.cta_text || 'SHOP JEWELLERY';
  const ctaHref = section?.cta_href || '/products';
  const secondaryCtaText = section?.secondary_cta_text || 'CONTACT DETARA';
  const secondaryCtaHref = section?.secondary_cta_href || '/contact';
  const imageUrl = section?.image_url;

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 'clamp(400px, 55vh, 650px)', maxWidth: '100vw' }}>
      {imageUrl ? (
        <img src={imageUrl} alt="DETARA diamond jewellery" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: '#5B4636' }} />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(23,24,23,0.55)' }} />

      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-5 md:px-8 py-16 md:py-24"
        style={{ minHeight: 'clamp(400px, 55vh, 650px)' }}
      >
        <div className="w-12 h-[1px] mb-8" style={{ backgroundColor: '#C6A15B' }} />
        <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 md:mb-6 max-w-2xl leading-tight">
          {title}
        </h2>
        <p className="text-sm md:text-base font-light mb-10 md:mb-12 max-w-md leading-relaxed" style={{ color: 'rgba(247,245,241,0.7)' }}>
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={ctaHref}
            className="px-8 py-4 label-caps text-xs tracking-widest transition-colors"
            style={{ backgroundColor: '#C6A15B', color: '#211B18' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9D7840')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C6A15B')}
          >
            {ctaText}
          </Link>
          <Link
            href={secondaryCtaHref}
            className="px-8 py-4 text-white label-caps text-xs tracking-widest transition-colors"
            style={{ border: '1px solid rgba(247,245,241,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(247,245,241,1)'; e.currentTarget.style.backgroundColor = 'rgba(247,245,241,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(247,245,241,0.4)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            {secondaryCtaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
