'use client';

import React from 'react';
import Link from 'next/link';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface CustomJewellerySectionProps {
  section: HomepageSection | null;
}

export default function CustomJewellerySection({ section }: CustomJewellerySectionProps) {
  const title = section?.title || 'DESIGNED FOR YOU.';
  const description = section?.description || 'From a first sketch to the finished piece, create jewellery around your exact vision.';
  const ctaText = section?.cta_text || 'DESIGN YOUR JEWELLERY';
  const ctaHref = section?.cta_href || '/custom-jewelry';
  const imageUrl = section?.image_url || '/assets/images/category_custom_jewellery.png';

  return (
    <section className="relative overflow-hidden" style={{ maxWidth: '100vw', backgroundColor: '#5B4636' }}>
      <div className="grid lg:grid-cols-2 min-h-[500px] md:min-h-[600px]">
        {/* Image */}
        <div className="relative min-h-[300px] lg:min-h-0 order-2 lg:order-1">
          <img
            src={imageUrl}
            alt="DETARA custom jewellery craftsmanship — bespoke diamond jewellery design"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(47,74,90,0.3), transparent)' }} />
        </div>

        {/* Content */}
        <div className="flex items-center px-8 md:px-12 lg:px-16 xl:px-20 py-16 md:py-20 order-1 lg:order-2">
          <div className="max-w-lg">
            <p className="label-caps mb-4" style={{ color: '#C6A15B' }}>Custom Jewellery</p>
            <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight" style={{ color: '#F6F1E8' }}>{title}</h2>
            <p className="text-sm md:text-base font-light leading-relaxed mb-8 md:mb-10" style={{ color: 'rgba(247,245,241,0.75)' }}>{description}</p>

            <div className="space-y-3 mb-10">
              {[
                'Choose your diamond shape and carat weight',
                'Select your metal — 18K Gold or Platinum 950',
                'Specify your setting style and design details',
                'Receive a personalised design proposal',
              ].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 text-xs" style={{ color: '#C6A15B' }}>◇</span>
                  <p className="text-sm font-light" style={{ color: 'rgba(247,245,241,0.75)' }}>{step}</p>
                </div>
              ))}
            </div>

            <Link
              href={ctaHref}
              className="inline-flex items-center gap-3 px-8 py-4 label-caps text-xs tracking-widest transition-colors"
              style={{ backgroundColor: '#C6A15B', color: '#211B18' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9D7840')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C6A15B')}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
