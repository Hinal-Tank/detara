'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomepageCollection } from '@/lib/supabase/homepageService';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface FeaturedCollectionsProps {
  section: HomepageSection | null;
  collections: HomepageCollection[];
}

const FALLBACK_COLLECTIONS = [
  {
    id: 'kiss',
    name: 'KISS Collection',
    slug: 'kiss',
    description: 'Keep It Subtle, Keep It Sophisticated. Minimal diamond jewellery for everyday elegance.',
    image_url: '/assets/images/collection_kiss.png',
    is_active: true,
    sort_order: 0,
    href: '/kiss',
  },
  {
    id: 'engagement',
    name: 'Engagement Rings',
    slug: 'engagement-rings',
    description: 'IGI & GIA certified solitaires and halo rings, crafted for the most important moment.',
    image_url: '/assets/images/category_engagement_rings.png',
    is_active: true,
    sort_order: 1,
    href: '/products?category=engagement-rings',
  },
  {
    id: 'tennis',
    name: 'Tennis Bracelets',
    slug: 'tennis-bracelets',
    description: 'Timeless diamond tennis bracelets in white gold and platinum settings.',
    image_url: '/assets/images/category_tennis_bracelet.png',
    is_active: true,
    sort_order: 2,
    href: '/products?category=tennis-bracelets',
  },
  {
    id: 'studs',
    name: 'Diamond Stud Earrings',
    slug: 'diamond-stud-earrings',
    description: 'Classic and modern diamond stud earrings — the essential jewellery wardrobe piece.',
    image_url: '/assets/images/category_diamond_studs.png',
    is_active: true,
    sort_order: 3,
    href: '/products?category=diamond-stud-earrings',
  },
];

function getCollectionHref(col: { slug: string | null; id: string; name: string }): string {
  if (!col.slug) return `/products?collection=${col.id}`;
  if (col.slug === 'kiss' || col.name.toLowerCase().includes('kiss')) return '/kiss';
  if (col.slug === 'engagement-rings' || col.name.toLowerCase().includes('engagement')) return '/products?category=engagement-rings';
  if (col.slug === 'tennis-bracelets' || col.name.toLowerCase().includes('tennis')) return '/products?category=tennis-bracelets';
  if (col.slug === 'diamond-stud-earrings' || col.name.toLowerCase().includes('stud')) return '/products?category=diamond-stud-earrings';
  return `/products?collection=${col.slug}`;
}

interface CollectionImageProps {
  src: string;
  alt: string;
  className?: string;
}

function CollectionImage({ src, alt, className = '' }: CollectionImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const isRemote = imgSrc.startsWith('http');

  if (isRemote) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 80vw, 30vw"
        className={className}
        onError={() => setImgSrc('/assets/images/collection_kiss.png')}
        quality={80}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc('/assets/images/collection_kiss.png')}
    />
  );
}

export default function FeaturedCollections({ section, collections }: FeaturedCollectionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const title = section?.title || 'FEATURED COLLECTIONS';
  const description = section?.description || 'Discover our curated diamond jewellery collections.';
  const ctaText = section?.cta_text || 'VIEW ALL COLLECTIONS';
  const ctaHref = section?.cta_href || '/products';

  const displayCollections = collections.length > 0 ? collections : FALLBACK_COLLECTIONS;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: dir === 'right' ? w * 0.8 : -w * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#F3EEE5]" style={{ maxWidth: '100vw' }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-4">
          <div>
            <p className="label-caps text-[#B9924A] mb-3">Collections</p>
            <h2 className="heading-serif text-2xl md:text-3xl lg:text-4xl font-light text-[#211B18]">{title}</h2>
            {description && <p className="text-sm text-[#766C63] font-light mt-2 max-w-md">{description}</p>}
          </div>
          <Link href={ctaHref} className="label-caps text-[#211B18] hover:text-[#B9924A] transition-colors flex items-center gap-2 self-start md:self-auto">
            {ctaText} <span>→</span>
          </Link>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-5 md:px-8 pb-2"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {displayCollections.map((col) => {
            const href = 'href' in col ? (col as any).href : getCollectionHref(col);
            const imgSrc = col.image_url || '/assets/images/collection_kiss.png';
            return (
              <Link
                key={col.id}
                href={href}
                className="group flex-shrink-0 relative overflow-hidden bg-[#211B18]"
                style={{ width: 'clamp(260px, 30vw, 380px)', scrollSnapAlign: 'start' }}
              >
                <div className="aspect-[3/4] relative">
                  <CollectionImage
                    src={imgSrc}
                    alt={`${col.name} collection — DETARA`}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211B18]/90 via-[#211B18]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="text-white font-light text-base md:text-lg tracking-wider mb-2">{col.name}</h3>
                    {col.description && (
                      <p className="text-white/60 text-xs font-light leading-relaxed mb-3 line-clamp-2">{col.description}</p>
                    )}
                    <span className="label-caps text-[#B9924A] text-[10px] tracking-widest">
                      EXPLORE →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {displayCollections.length > 3 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-[rgba(28,25,23,0.1)] items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-[rgba(28,25,23,0.1)] items-center justify-center hover:bg-white transition-colors"
              aria-label="Next"
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  );
}
