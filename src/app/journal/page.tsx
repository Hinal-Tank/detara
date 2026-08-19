import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Journal | DETARA Diamond Education & Jewelry Guides',
  description: 'Read DETARA\'s journal for expert guides on diamond quality, engagement rings, lab-grown diamonds, and Scandinavian jewelry design principles.',
  keywords: ['diamond guide', 'jewelry education', 'engagement ring guide', 'diamond quality', 'jewelry blog', 'lab-grown diamonds', 'natural diamonds', 'diamond buying guide'],
  openGraph: {
    title: 'Journal | DETARA Diamond Education & Jewelry Guides',
    description: 'Expert guides on diamonds, jewelry, and design from DETARA.',
    type: 'website',
    url: `${baseUrl}/journal`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journal | DETARA',
    description: 'Diamond education and jewelry guides from DETARA.',
  },
  alternates: {
    canonical: `${baseUrl}/journal`,
  },
};

// BreadcrumbList schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Journal', item: `${baseUrl}/journal` },
  ],
};

const articles = [
  {
    id: 1,
    slug: 'how-to-choose-a-diamond-engagement-ring',
    title: 'How to Choose a Diamond Engagement Ring',
    excerpt: 'Selecting an engagement ring is one of the most considered purchases a person makes. Understanding the relationship between cut, clarity, and carat weight allows you to make a decision grounded in knowledge rather than pressure.',
    date: 'March 2026',
    category: 'Buying Guide',
  },
  {
    id: 2,
    slug: 'understanding-diamond-quality',
    title: 'Understanding Diamond Quality',
    excerpt: 'The four characteristics that define a diamond — cut, color, clarity, and carat — each contribute differently to its appearance. Cut is the most critical factor, determining how light moves through the stone and returns to the eye.',
    date: 'February 2026',
    category: 'Diamond Education',
  },
  {
    id: 3,
    slug: 'lab-vs-natural-diamonds',
    title: 'Lab vs Natural Diamonds',
    excerpt: 'Lab-grown diamonds are chemically and optically identical to natural diamonds. Both are pure crystallized carbon. The distinction lies in origin: one formed over billions of years underground, the other produced in weeks using advanced technology.',
    date: 'January 2026',
    category: 'Diamond Education',
  },
  {
    id: 4,
    slug: 'scandinavian-jewelry-design-principles',
    title: 'Scandinavian Jewelry Design Principles',
    excerpt: 'Nordic design philosophy is built on restraint. The principle of removing everything unnecessary until only the essential remains applies as naturally to jewelry as it does to architecture. DETARA draws directly from this tradition.',
    date: 'December 2025',
    category: 'Brand & Design',
  },
];

export default function JournalPage() {
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
              <span className="label-caps text-foreground" aria-current="page">Journal</span>
            </nav>
            <p className="label-caps text-accent mb-6">Journal</p>
            <h1 className="heading-display text-[clamp(3rem,6vw,6.5rem)] text-foreground leading-[0.9] mb-12 max-w-3xl">
              Diamond education.<br />
              <span className="italic font-light text-muted">Jewelry expertise.</span>
            </h1>
            <p className="text-xl text-muted font-light leading-relaxed max-w-2xl">
              Guides and insights on diamond quality, jewelry design, and the DETARA philosophy. Learn how to select diamonds, understand the four Cs, and discover the principles behind our Scandinavian aesthetic.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/diamond-guide" className="text-sm text-accent hover:underline font-light">Diamond Guide →</Link>
              <Link href="/products" className="text-sm text-accent hover:underline font-light">Browse Collection →</Link>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-24 px-5 md:px-8 bg-bg-warm">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
              {articles.map((article) => (
                <article key={article.slug} className="group">
                  <Link href={`/journal/${article.slug}`} className="block">
                    <div className="mb-6">
                      <p className="label-caps text-accent mb-3 tracking-[0.3em]">{article.category}</p>
                      <h2 className="text-2xl md:text-3xl font-light text-foreground group-hover:text-accent transition-colors mb-4">
                        {article.title}
                      </h2>
                      <p className="text-muted font-light leading-relaxed mb-6">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted tracking-widest">{article.date}</span>
                        <span className="text-accent group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
