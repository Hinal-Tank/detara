'use client';

import React from 'react';
import Link from 'next/link';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface DiamondEducationProps {
  section: HomepageSection | null;
}

const EDUCATION_CARDS = [
  { label: 'Cut', value: 'Excellent', icon: '◇', desc: 'The most important factor — determines brilliance and light performance.' },
  { label: 'Colour', value: 'D–G', icon: '◈', desc: 'We work exclusively with D–G colour grades for exceptional whiteness.' },
  { label: 'Clarity', value: 'VVS', icon: '◉', desc: 'VVS clarity ensures diamonds are visually flawless to the naked eye.' },
  { label: 'Carat', value: '0.30–3.00ct', icon: '◆', desc: 'Available across a wide carat range to suit every preference and budget.' },
  { label: 'Certification', value: 'IGI / GIA', icon: '◎', desc: 'Every diamond is certified by the world\'s most respected grading labs.' },
  { label: 'Origin', value: 'Natural / Lab', icon: '◐', desc: 'Both natural and lab-grown diamonds — clearly specified for every product.' },
];

export default function DiamondEducation({ section }: DiamondEducationProps) {
  const title = section?.title || 'UNDERSTANDING DIAMONDS';
  const description = section?.description || 'The four Cs and beyond — everything you need to know about diamond quality.';
  const ctaText = section?.cta_text || 'EXPLORE DIAMOND EDUCATION';
  const ctaHref = section?.cta_href || '/diamond-guide';

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#FFFDF8]" style={{ maxWidth: '100vw' }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="label-caps text-[#B9924A] mb-3">Education</p>
          <h2 className="heading-serif text-2xl md:text-3xl lg:text-4xl font-light text-[#211B18]">{title}</h2>
          {description && <p className="text-sm text-[#766C63] font-light mt-3 max-w-lg mx-auto">{description}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-[rgba(28,25,23,0.08)]">
          {EDUCATION_CARDS.map((card, i) => (
            <div
              key={card.label}
              className={`p-5 md:p-6 lg:p-8 flex flex-col items-center text-center border-r border-b border-[rgba(28,25,23,0.06)] last:border-r-0 ${i >= 3 ? 'border-b-0' : ''} group hover:bg-[#F3EEE5] transition-colors`}
            >
              <span className="text-[#B9924A] text-xl mb-3">{card.icon}</span>
              <p className="text-base md:text-lg font-light text-[#211B18] mb-1">{card.value}</p>
              <p className="label-caps text-[#766C63] text-[9px] tracking-widest mb-3">{card.label}</p>
              <p className="text-[11px] text-[#766C63] font-light leading-relaxed hidden lg:block">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 px-8 py-3.5 border border-[#211B18] text-[#211B18] label-caps text-xs tracking-widest hover:bg-[#211B18] hover:text-white transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
