'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface CraftsmanshipSectionProps {
  section: HomepageSection | null;
}

const STEPS = [
  { label: 'Diamond Selection', icon: '◇', desc: 'Each diamond is individually selected for cut, colour, clarity and proportion.' },
  { label: 'Precision Cutting', icon: '◈', desc: 'Diamonds are precision-cut in Surat, the world\'s leading diamond centre.' },
  { label: 'Jewellery Setting', icon: '◉', desc: 'Master craftsmen set each stone with precision tools and expert technique.' },
  { label: 'Final Inspection', icon: '◆', desc: 'Every piece undergoes rigorous quality inspection before certification.' },
];

export default function CraftsmanshipSection({ section }: CraftsmanshipSectionProps) {
  const title = section?.title || 'THE ART OF PRECISION';
  const description = section?.description || 'From diamond selection to final inspection — every step crafted with intention.';
  const ctaText = section?.cta_text || 'LEARN MORE';
  const ctaHref = section?.cta_href || '/about';
  const imageUrl = section?.image_url;

  const isRemote = imageUrl?.startsWith('http');

  return (
    <section className="py-16 md:py-24 lg:py-32" style={{ maxWidth: '100vw', backgroundColor: '#5B4636' }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: image */}
          <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#3F3029' }}>
            {imageUrl ? (
              isRemote ? (
                <Image
                  src={imageUrl}
                  alt="DETARA jewellery craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  quality={80}
                />
              ) : (
                <img src={imageUrl} alt="DETARA jewellery craftsmanship" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-30" style={{ color: '#C6A15B' }}>◇</span>
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(23,24,23,0.4), transparent)' }} />
          </div>

          {/* Right: content */}
          <div>
            <p className="label-caps mb-4" style={{ color: '#C6A15B' }}>Craftsmanship</p>
            <h2 className="heading-serif text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6" style={{ color: '#F6F1E8' }}>{title}</h2>
            <p className="text-sm font-light leading-relaxed mb-10 md:mb-12" style={{ color: 'rgba(247,245,241,0.7)' }}>{description}</p>

            <div className="space-y-6 md:space-y-8">
              {STEPS.map((step) => (
                <div key={step.label} className="flex items-start gap-4 md:gap-6">
                  <div
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm"
                    style={{ border: '1px solid rgba(212,176,122,0.3)', color: '#C6A15B' }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-light text-sm tracking-wider mb-1" style={{ color: '#F6F1E8' }}>{step.label}</h3>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(247,245,241,0.5)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 md:mt-12">
              <Link
                href={ctaHref}
                className="label-caps transition-colors flex items-center gap-2"
                style={{ color: '#C6A15B' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F6F1E8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#C6A15B')}
              >
                {ctaText} <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
