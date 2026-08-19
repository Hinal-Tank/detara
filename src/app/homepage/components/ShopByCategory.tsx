'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Static master category data ─────────────────────────────────────────────
// Deterministic — same on server and client. No random, no Date, no window.

interface SubLink {
  label: string;
  href: string;
}

interface MasterCategory {
  id: string;
  name: string;
  image: string;
  viewAllHref: string;
  viewAllLabel: string;
  subs: SubLink[];
}

const MASTER_CATEGORIES: MasterCategory[] = [
  {
    id: 'rings',
    name: 'Rings',
    image: '/assets/images/category_rings.png',
    viewAllHref: '/products?category_id=11111111-0001-0001-0001-000000000001',
    viewAllLabel: 'View All Rings',
    subs: [
      { label: 'Engagement Rings', href: '/products?category=engagement-rings' },
      { label: 'Solitaire Rings', href: '/products?category=solitaire-rings' },
      { label: 'Wedding Rings', href: '/products?category=wedding-rings' },
      { label: 'Eternity & Diamond Bands', href: '/products?category=eternity-bands' },
      { label: 'Halo Rings', href: '/products?category=halo-rings' },
      { label: 'Three-Stone Rings', href: '/products?category=three-stone-rings' },
      { label: 'Contemporary Rings', href: '/products?category=contemporary-rings' },
      { label: 'Toi et Moi Rings', href: '/products?category=toi-et-moi-rings' },
    ],
  },
  {
    id: 'earrings',
    name: 'Earrings',
    image: '/assets/images/category_earrings.png',
    viewAllHref: '/products?category_id=11111111-0001-0001-0001-000000000002',
    viewAllLabel: 'View All Earrings',
    subs: [
      { label: 'Stud Earrings', href: '/products?category=stud-earrings' },
      { label: 'Diamond Stud Earrings', href: '/products?category=diamond-stud-earrings' },
      { label: 'Hoop & Huggie Earrings', href: '/products?category=hoop-earrings' },
      { label: 'Drop Earrings', href: '/products?category=drop-earrings' },
      { label: 'Statement Earrings', href: '/products?category=statement-earrings' },
      { label: "Men's Earrings", href: '/products?category=mens-earrings' },
      { label: 'Halo & Cluster Earrings', href: '/products?category=halo-earrings' },
      { label: 'Gemstone Earrings', href: '/products?category=gemstone-earrings' },
    ],
  },
  {
    id: 'necklaces',
    name: 'Necklaces & Pendants',
    image: '/assets/images/category_necklaces.png',
    viewAllHref: '/products?category_id=11111111-0001-0001-0001-000000000003',
    viewAllLabel: 'View All Necklaces',
    subs: [
      { label: 'Necklaces', href: '/products?category=necklaces' },
      { label: 'Pendants', href: '/products?category=pendants' },
      { label: 'Solitaire Pendants', href: '/products?category=solitaire-pendants' },
      { label: 'Halo Pendants', href: '/products?category=halo-pendants' },
      { label: 'Diamond Pendants', href: '/products?category=diamond-pendants' },
      { label: "Men's Necklaces & Chains", href: '/products?category=mens-necklaces' },
      { label: 'Contemporary Necklaces', href: '/products?category=contemporary-necklaces' },
      { label: 'Gemstone Pendants', href: '/products?category=gemstone-pendants' },
    ],
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    image: '/assets/images/category_bracelets.png',
    viewAllHref: '/products?category_id=11111111-0001-0001-0001-000000000004',
    viewAllLabel: 'View All Bracelets',
    subs: [
      { label: 'Tennis Bracelets', href: '/products?category=tennis-bracelets' },
      { label: 'Diamond Bracelets', href: '/products?category=diamond-bracelets' },
      { label: 'Diamond Bangles', href: '/products?category=diamond-bangles' },
      { label: 'Diamond Line Bracelets', href: '/products?category=diamond-line-bracelets' },
      { label: 'Gemstone Bracelets', href: '/products?category=gemstone-bracelets' },
    ],
  },
  {
    id: 'mens',
    name: "Men's Jewellery",
    image: '/assets/images/category_mens_jewellery.png',
    viewAllHref: '/products?category_id=11111111-0001-0001-0001-000000000005',
    viewAllLabel: "View All Men's",
    subs: [
      { label: "Men's Rings", href: '/products?category=mens-rings' },
      { label: "Men's Earrings", href: '/products?category=mens-earrings' },
      { label: "Men's Necklaces & Chains", href: '/products?category=mens-necklaces' },
      { label: "Men's Cufflinks", href: '/products?category=mens-cufflinks' },
      { label: "Men's Jewellery", href: '/products?category_id=11111111-0001-0001-0001-000000000005' },
    ],
  },
  {
    id: 'fine',
    name: 'Gemstone Jewellery',
    image: '/assets/images/category_fine_jewellery.png',
    viewAllHref: '/products?category_id=11111111-0001-0001-0001-000000000006',
    viewAllLabel: 'View All Gemstones',
    subs: [
      { label: 'Gemstone Jewellery', href: '/products?category=gemstone-jewellery' },
      { label: 'Gemstone Earrings', href: '/products?category=gemstone-earrings' },
      { label: 'Gemstone Pendants', href: '/products?category=gemstone-pendants' },
      { label: 'Diamond Bands', href: '/products?category=diamond-bands' },
      { label: 'Fine Jewellery', href: '/products?category_id=11111111-0001-0001-0001-000000000006' },
    ],
  },
];

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      width="12" height="9" viewBox="0 0 13 9" fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M1 4.5H12M8.5 1L12 4.5L8.5 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Desktop editorial card ───────────────────────────────────────────────────

function DesktopCard({ cat }: { cat: MasterCategory }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image block — 3:4 portrait */}
      <Link
        href={cat.viewAllHref}
        className="relative block overflow-hidden"
        style={{ aspectRatio: '3/4' }}
        aria-label={`Explore ${cat.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.image}
          alt={`${cat.name} — DETARA fine jewellery`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />
        {/* Gradient overlay — stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211B18]/75 via-[#211B18]/15 to-transparent transition-opacity duration-500 group-hover:from-[#211B18]/85" />

        {/* "Explore" pill — appears on hover */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 transition-all duration-400 ease-out"
          style={{
            opacity: hovered ? 1 : 0,
            transform: `translateX(-50%) translateY(${hovered ? '0px' : '6px'})`,
          }}
        >
          <span
            className="inline-flex items-center gap-2 backdrop-blur-sm px-4 py-[6px] tracking-[0.2em] uppercase"
            style={{ fontSize: '8px', letterSpacing: '0.22em', border: '1px solid rgba(212,176,122,0.7)', color: '#C6A15B', backgroundColor: 'rgba(23,24,23,0.3)' }}
          >
            Explore
            <ChevronRight className="text-[#C6A15B]" />
          </span>
        </div>

        {/* Category name overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-14 pt-4">
          <h3
            className="text-white font-light tracking-[0.14em] uppercase leading-tight"
            style={{ fontSize: '13px' }}
          >
            {cat.name}
          </h3>
        </div>
      </Link>

      {/* Sub-links — text only, minimal */}
      <div className="pt-4 pb-1 flex flex-col mt-0" style={{ borderTop: '1px solid rgba(212,176,122,0.25)' }}>
        {cat.subs.map((sub) => (
          <Link
            key={sub.label}
            href={sub.href}
            className="group/sub flex items-center justify-between py-[5px] transition-colors duration-200"
            style={{ fontSize: '10.5px', letterSpacing: '0.025em', color: '#5B4636', borderBottom: '1px solid rgba(247,245,241,0.8)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#211B18')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5B4636')}
          >
            <span className="font-light relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C6A15B] group-hover/sub:after:w-full after:transition-all after:duration-300">
              {sub.label}
            </span>
            <ChevronRight className="opacity-0 group-hover/sub:opacity-100 transition-opacity duration-200 flex-shrink-0" style={{ color: '#C6A15B' }} />
          </Link>
        ))}
        <Link
          href={cat.viewAllHref}
          className="group/all inline-flex items-center gap-2 mt-4 transition-colors duration-200"
          style={{ fontSize: '8.5px', letterSpacing: '0.22em', color: '#C6A15B' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#211B18')}
          onMouseLeave={e => (e.currentTarget.style.color = '#C6A15B')}
        >
          <span className="uppercase font-light tracking-[0.22em]">{cat.viewAllLabel}</span>
          <ChevronRight className="transition-transform duration-300 group-hover/all:translate-x-1 flex-shrink-0" />
        </Link>
      </div>
    </div>
  );
}

// ─── Mobile accordion item ────────────────────────────────────────────────────

function MobileAccordion({ cat }: { cat: MasterCategory }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid rgba(47,74,90,0.2)' }}>
      {/* Header row — image + name + chevron toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 py-4 text-left"
        aria-expanded={open}
      >
        {/* Thumbnail — taller portrait crop */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: 64, height: 80, backgroundColor: '#F6F1E8' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cat.image}
            alt={cat.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <span
          className="flex-1 font-light tracking-[0.12em] uppercase"
          style={{ fontSize: '12px', color: '#211B18' }}
        >
          {cat.name}
        </span>

        {/* Animated chevron — no large "+" */}
        <span
          className="flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', color: '#C6A15B' }}
          aria-hidden="true"
        >
          <ChevronRight />
        </span>
      </button>

      {/* Expandable sub-links */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? '600px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="pb-5 pl-[80px] pr-4 flex flex-col">
          {cat.subs.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className="py-[8px] transition-colors last:border-0"
              style={{ fontSize: '12px', letterSpacing: '0.02em', color: '#5B4636', borderBottom: '1px solid rgba(247,245,241,0.8)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#211B18')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5B4636')}
            >
              {sub.label}
            </Link>
          ))}
          <Link
            href={cat.viewAllHref}
            className="mt-4 inline-flex items-center gap-2 transition-colors"
            style={{ fontSize: '9px', letterSpacing: '0.22em', color: '#C6A15B' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#211B18')}
            onMouseLeave={e => (e.currentTarget.style.color = '#C6A15B')}
          >
            <span className="uppercase font-light tracking-[0.22em]">{cat.viewAllLabel}</span>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ShopByCategory() {
  return (
    <section className="py-16 md:py-24 lg:py-32" style={{ maxWidth: '100vw', backgroundColor: '#F6F1E8' }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">

        {/* Section header */}
        <div className="mb-10 md:mb-16">
          <p
            className="mb-3 tracking-[0.35em] uppercase font-light"
            style={{ fontSize: '9px', color: '#C6A15B' }}
          >
            Collections
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="font-light tracking-[0.04em] uppercase"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontFamily: 'Georgia, "Times New Roman", serif', color: '#211B18' }}
            >
              SHOP BY CATEGORY
            </h2>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 transition-colors duration-200 self-start md:self-auto"
              style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#211B18' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C6A15B')}
              onMouseLeave={e => (e.currentTarget.style.color = '#211B18')}
            >
              <span className="uppercase tracking-[0.2em] font-light">View All Jewellery</span>
              <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          {/* Gold accent divider */}
          <div className="w-10 h-[1px] mt-5 opacity-70" style={{ backgroundColor: '#C6A15B' }} />
        </div>

        {/* Desktop: 3×2 editorial grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {MASTER_CATEGORIES.map((cat) => (
            <DesktopCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* Mobile: premium accordion list */}
        <div className="md:hidden">
          {MASTER_CATEGORIES.map((cat) => (
            <MobileAccordion key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
