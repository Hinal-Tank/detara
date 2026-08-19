'use client';

import React, { useState, useEffect } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getContentPage, ContentPage } from '@/lib/supabase/contentPageService';

// Static fallback content (shown while loading or if DB unavailable)
const STATIC_SECTIONS = [
  {
    label: 'Design Philosophy',
    heading: 'Restraint as a form of precision.',
    body: 'DETARA embraces restraint and precision in every design. We believe that removing the unnecessary reveals what is essential — and that true luxury is found in what remains. Each piece is refined until only the essential remains.',
  },
  {
    label: 'Diamond Expertise',
    heading: 'Selected for balance.',
    body: 'Every diamond is selected for balance of brilliance, purity, and proportion. We work exclusively with D–G color diamonds and VVS clarity standards to ensure exceptional brilliance and rarity in every piece.',
  },
  {
    label: 'Timeless Design',
    heading: 'Elegant across generations.',
    body: 'Pieces are created to remain elegant across generations. DETARA jewelry is not designed for a season — it is designed for a lifetime, and beyond. Quality and craftsmanship are at the heart of everything we create.',
  },
];

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

// BreadcrumbList schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'About DETARA', item: `${baseUrl}/about` },
  ],
};

export default function AboutPage() {
  const [page, setPage] = React.useState<ContentPage | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getContentPage('about')?.then((data) => {
      setPage(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-44 md:pt-56 lg:pt-64 pb-20 md:pb-24 lg:pb-32 px-5 md:px-8 bg-bg">
          <div className="max-w-[1280px] mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-3 mb-10">
              <Link href="/" className="label-caps text-muted hover:text-foreground transition-colors">Home</Link>
              <span className="text-muted opacity-40 text-xs" aria-hidden="true">—</span>
              <span className="label-caps text-foreground" aria-current="page">About</span>
            </nav>
            <p className="label-caps text-accent mb-6">About DETARA</p>
            <h1 className="heading-display text-[clamp(3rem,6vw,6.5rem)] text-foreground leading-[0.9] mb-12 max-w-3xl">
              Exceptional quality.<br />
              <span className="italic font-light text-muted">Timeless design.</span>
            </h1>
            {loading ? (
              <div className="h-6 bg-[#EEE7DC] rounded animate-pulse max-w-2xl" />
            ) : page?.content ? (
              <div
                className="text-xl text-muted font-light leading-relaxed max-w-2xl prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: page?.content }}
              />
            ) : (
              <p className="text-xl text-muted font-light leading-relaxed max-w-2xl">
                DETARA is a luxury diamond jewelry brand. The brand combines global diamond sourcing, precision polishing in Surat — the world&apos;s leading diamond center — and fine jewelry craftsmanship with a commitment to quality and transparency. Every piece is created to endure, not just for a season, but for a lifetime.
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="text-sm text-accent hover:underline font-light">Browse Collection →</Link>
              <Link href="/custom-jewelry" className="text-sm text-accent hover:underline font-light">Custom Jewellery →</Link>
              <Link href="/diamond-guide" className="text-sm text-accent hover:underline font-light">Diamond Guide →</Link>
            </div>
          </div>
        </section>

        {/* Brand pillars — always shown from static data for visual consistency */}
        <section className="py-24 px-5 md:px-8 bg-bg-warm border-t border-[rgba(28,25,23,0.05)]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid md:grid-cols-3 gap-0 border border-[rgba(28,25,23,0.08)]">
              {STATIC_SECTIONS?.map((pillar, i) => (
                <div
                  key={pillar?.label}
                  className={`p-10 ${i < 2 ? 'border-r border-[rgba(28,25,23,0.08)]' : ''}`}
                >
                  <p className="label-caps text-accent mb-6 tracking-[0.3em]">{pillar?.label}</p>
                  <h2 className="text-2xl font-light text-foreground mb-4">{pillar?.heading}</h2>
                  <p className="text-muted font-light leading-relaxed">{pillar?.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="py-24 px-5 md:px-8 bg-bg border-t border-[rgba(28,25,23,0.05)]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="label-caps text-accent mb-6">Our Commitment</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
                  Quality and trust at every step.
                </h2>
                <p className="text-muted font-light leading-relaxed mb-6">
                  Every DETARA piece comes with full certification from IGI or GIA — the world&apos;s most respected diamond grading laboratories. We believe in complete transparency about the diamonds we use, their origin, and their quality.
                </p>
                <p className="text-muted font-light leading-relaxed">
                  Our customer care team is available Monday through Friday, 9:00 AM to 6:00 PM UK Time, to assist with any questions about your order, custom jewelry, or diamond selection.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '◇', label: 'Certified Diamonds', desc: 'IGI & GIA certified with every purchase' },
                  { icon: '◈', label: 'Insured Shipping', desc: 'Fully insured worldwide delivery' },
                  { icon: '◉', label: 'Easy Returns', desc: 'Hassle-free returns for defects' },
                  { icon: '◆', label: 'Expert Support', desc: 'Dedicated customer care team' },
                ]?.map((item) => (
                  <div key={item?.label} className="border border-[rgba(28,25,23,0.08)] p-6 bg-bg-warm">
                    <span className="block text-accent text-xl mb-3" aria-hidden="true">{item?.icon}</span>
                    <p className="text-sm text-foreground font-light mb-1">{item?.label}</p>
                    <p className="text-xs text-muted font-light leading-relaxed">{item?.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Internal links to key pages */}
        <section className="py-16 px-5 md:px-8 bg-bg-warm border-t border-[rgba(28,25,23,0.05)]">
          <div className="max-w-[1280px] mx-auto">
            <p className="label-caps text-accent mb-8 tracking-[0.3em]">Explore DETARA</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/products', label: 'Diamond Collection', desc: 'Browse all jewellery' },
                { href: '/custom-jewelry', label: 'Custom Jewellery', desc: 'Bespoke design service' },
                { href: '/diamond-guide', label: 'Diamond Guide', desc: 'Education & advice' },
                { href: '/contact', label: 'Contact Us', desc: 'Speak to an advisor' },
              ]?.map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  className="border border-[rgba(28,25,23,0.08)] p-6 bg-bg hover:border-accent/40 transition-colors group"
                >
                  <p className="text-sm text-foreground font-light mb-1 group-hover:text-accent transition-colors">{link?.label}</p>
                  <p className="text-xs text-muted font-light">{link?.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
