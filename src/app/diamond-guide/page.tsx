import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

export const metadata: Metadata = {
  title: 'Diamond Guide — How to Choose a Diamond | DETARA',
  description:
    'Complete guide to choosing a diamond: shapes, carat sizes, natural vs lab-grown diamonds. Expert advice from DETARA on selecting the perfect diamond for your jewellery.',
  keywords: [
    'diamond guide',
    'how to choose a diamond',
    'diamond shapes',
    'diamond carat',
    'natural vs lab-grown diamonds',
    'diamond quality',
    'diamond education',
    'IGI certified diamonds',
    'GIA certified diamonds',
  ],
  openGraph: {
    title: 'Diamond Guide — How to Choose a Diamond | DETARA',
    description:
      'Complete guide to choosing a diamond: shapes, carat sizes, natural vs lab-grown. Expert advice from DETARA.',
    type: 'article',
    url: `${baseUrl}/diamond-guide`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diamond Guide | DETARA',
    description: 'How to choose the perfect diamond — shapes, carat, and origin explained.',
  },
  alternates: {
    canonical: `${baseUrl}/diamond-guide`,
  },
};

const diamondShapes = [
  {
    name: 'Round Brilliant',
    description:
      'The most popular diamond shape, engineered for maximum light return. 58 precisely angled facets create exceptional brilliance and fire. The round brilliant is the benchmark against which all other shapes are measured.',
    symbol: '○',
  },
  {
    name: 'Princess',
    description:
      'A square or rectangular shape with pointed corners and brilliant-cut facets. The princess cut offers modern geometry with outstanding sparkle — second only to the round brilliant in light performance.',
    symbol: '□',
  },
  {
    name: 'Emerald',
    description:
      'A rectangular step-cut with cropped corners. The emerald cut emphasizes clarity and transparency over brilliance, creating a hall-of-mirrors effect. Preferred by those who value understated elegance.',
    symbol: '▭',
  },
  {
    name: 'Heart',
    description:
      'A romantic silhouette formed by two rounded lobes meeting at a point. The heart shape requires exceptional symmetry and is best appreciated at 0.50 ct and above. A deeply personal choice.',
    symbol: '♡',
  },
];

const caratSizes = [
  { ct: '0.30', mm: '4.3 mm', desc: 'Delicate and refined. Ideal for everyday wear and minimalist settings.' },
  { ct: '0.50', mm: '5.1 mm', desc: 'A classic choice. Noticeable presence without being overstated.' },
  { ct: '0.70', mm: '5.8 mm', desc: 'Balanced and elegant. The most popular choice for solitaire rings.' },
  { ct: '1.00', mm: '6.5 mm', desc: 'A significant stone. Unmistakable brilliance and presence on the hand.' },
  { ct: '1.50', mm: '7.4 mm', desc: 'A statement piece. Exceptional light performance and visual impact.' },
  { ct: '2.00', mm: '8.1 mm', desc: 'Rare and commanding. Reserved for those who seek the extraordinary.' },
];

// FAQ structured data for AEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between natural and lab-grown diamonds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Natural diamonds are formed deep within the Earth over billions of years under extreme heat and pressure. Lab-grown diamonds are created using advanced technology (HPHT or CVD) that replicates this process. Both are chemically, physically, and optically identical — pure crystallised carbon with the same hardness (10 on the Mohs scale), brilliance, and durability. The difference lies only in origin. DETARA offers both options, all certified by IGI or GIA.',
      },
    },
    {
      '@type': 'Question',
      name: 'What carat size should I choose for an engagement ring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no single "correct" carat size — it depends on your budget, the wearer\'s finger size, and personal preference. The most popular choice for solitaire engagement rings is 0.70–1.00 ct, which offers a noticeable presence without being overstated. A 0.70 ct round brilliant measures approximately 5.8 mm in diameter. If budget allows, 1.00 ct (6.5 mm) makes a significant statement. DETARA advisors can help you find the best balance for your specific situation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What diamond shapes does DETARA offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DETARA offers a range of diamond shapes including round brilliant (the most popular, engineered for maximum brilliance), princess cut (modern geometry with outstanding sparkle), emerald cut (step-cut for understated elegance), and heart shape (a romantic, deeply personal choice). Each shape has distinct optical properties and suits different settings and styles.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does diamond certification mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Diamond certification is an independent assessment of a diamond\'s quality by a recognised gemological laboratory. DETARA uses IGI (International Gemological Institute) and GIA (Gemological Institute of America) — the two most respected grading laboratories in the world. A certificate documents the diamond\'s cut, colour, clarity, and carat weight, providing an objective, verifiable record of quality. Every DETARA diamond comes with a certificate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What colour and clarity standards does DETARA use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DETARA works exclusively with D–G colour range diamonds and VVS (Very Very Slightly Included) clarity standards. This ensures exceptional brilliance and rarity in every piece. D–G colour diamonds appear colourless to near-colourless to the naked eye, and VVS clarity means inclusions are extremely difficult to see even under 10x magnification.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are lab-grown diamonds real diamonds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Lab-grown diamonds are real diamonds. They have the same crystal structure, chemical composition (pure carbon), hardness (10 on the Mohs scale), refractive index, and optical properties as natural diamonds. A gemologist cannot distinguish them without specialised equipment. Both natural and lab-grown diamonds in the DETARA collection are certified by IGI or GIA.',
      },
    },
  ],
};

// BreadcrumbList schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Diamond Guide', item: `${baseUrl}/diamond-guide` },
  ],
};

export default function DiamondGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-bg pt-44 md:pt-56">

        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-6 border-b border-[rgba(28,25,23,0.06)]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-3">
            <Link href="/" className="label-caps text-muted hover:text-foreground transition-colors">Home</Link>
            <span className="text-muted opacity-40 text-xs" aria-hidden="true">—</span>
            <span className="label-caps text-foreground" aria-current="page">Diamond Guide</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-b border-[rgba(28,25,23,0.06)]">
          <p className="label-caps text-accent mb-6 tracking-[0.35em]">Education</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-foreground leading-tight mb-8 max-w-2xl">
            Diamond<br />
            <span className="italic text-muted">Guide</span>
          </h1>
          <p className="text-lg text-muted font-light leading-relaxed max-w-xl">
            Understanding the essential qualities of a diamond allows you to make a confident, informed choice. This guide covers shape, carat, and origin — the three decisions that matter most.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="text-sm text-accent hover:underline font-light">Browse Collection →</Link>
            <Link href="/ring-size-guide" className="text-sm text-accent hover:underline font-light">Ring Size Guide →</Link>
            <Link href="/custom-jewelry" className="text-sm text-accent hover:underline font-light">Custom Jewellery →</Link>
          </div>
        </div>

        {/* Section 1: Diamond Shapes */}
        <section className="py-24 px-8 md:px-20 border-b border-[rgba(28,25,23,0.06)]" aria-labelledby="shapes-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 01</p>
              <h2 id="shapes-heading" className="font-serif text-4xl md:text-5xl font-light text-foreground">Diamond Shapes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-[rgba(28,25,23,0.08)]">
              {diamondShapes?.map((shape, i) => (
                <div
                  key={shape?.name}
                  className={`p-10 ${i % 2 === 0 ? 'border-r border-[rgba(28,25,23,0.08)]' : ''} ${i < 2 ? 'border-b border-[rgba(28,25,23,0.08)]' : ''}`}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-4xl text-accent font-light leading-none mt-1 flex-shrink-0" aria-hidden="true">{shape?.symbol}</span>
                    <div>
                      <h3 className="font-serif text-2xl font-light text-foreground mb-4">{shape?.name}</h3>
                      <p className="text-sm text-muted font-light leading-relaxed">{shape?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Carat Size */}
        <section className="py-24 px-8 md:px-20 border-b border-[rgba(28,25,23,0.06)] bg-[#FFFDF8]" aria-labelledby="carat-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 02</p>
              <h2 id="carat-heading" className="font-serif text-4xl md:text-5xl font-light text-foreground">Carat Size</h2>
              <p className="mt-6 text-base text-muted font-light leading-relaxed max-w-lg">
                Carat refers to the weight of a diamond, not its size. However, weight directly correlates to diameter for round brilliant cuts. The visual difference between carat weights is significant.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-[rgba(28,25,23,0.06)]">
              {caratSizes?.map((size) => (
                <div key={size?.ct} className="flex items-center gap-8 py-8">
                  {/* Visual size indicator */}
                  <div className="flex-shrink-0 w-20 flex items-center justify-center" aria-hidden="true">
                    <div
                      className="rounded-full bg-accent/20 border border-accent/40"
                      style={{
                        width: `${parseFloat(size?.mm) * 6}px`,
                        height: `${parseFloat(size?.mm) * 6}px`,
                        minWidth: '24px',
                        minHeight: '24px',
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-2">
                      <span className="font-serif text-2xl font-light text-foreground">{size?.ct} ct</span>
                      <span className="label-caps text-muted">{size?.mm} diameter</span>
                    </div>
                    <p className="text-sm text-muted font-light">{size?.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Diamond Origin */}
        <section className="py-24 px-8 md:px-20" aria-labelledby="origin-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 03</p>
              <h2 id="origin-heading" className="font-serif text-4xl md:text-5xl font-light text-foreground">Diamond Origin</h2>
              <p className="mt-6 text-base text-muted font-light leading-relaxed max-w-lg">
                DETARA offers both lab-grown and natural diamonds. Both are real diamonds — chemically, physically, and optically identical. The difference lies only in how they were formed.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-[rgba(28,25,23,0.08)]">
              <div className="p-12 border-r border-[rgba(28,25,23,0.08)]">
                <p className="label-caps text-foreground mb-6 tracking-[0.3em]">Lab-Grown Diamonds</p>
                <p className="font-serif text-3xl font-light text-foreground mb-8 leading-tight">
                  Created by science.<br />
                  <span className="italic text-muted">Identical in every way.</span>
                </p>
                <div className="space-y-4 text-sm text-muted font-light leading-relaxed">
                  <p>
                    Lab-grown diamonds are produced using advanced technology — either High Pressure High Temperature (HPHT) or Chemical Vapor Deposition (CVD) — that replicates the natural diamond formation process.
                  </p>
                  <p>
                    The result is a diamond with the same crystal structure, hardness (10 on the Mohs scale), refractive index, and optical properties as a mined diamond. A gemologist cannot distinguish them without specialized equipment.
                  </p>
                  <p>
                    Lab-grown diamonds offer the same brilliance and durability at a more accessible price point, making exceptional quality available to more clients.
                  </p>
                </div>
              </div>

              <div className="p-12">
                <p className="label-caps text-foreground mb-6 tracking-[0.3em]">Natural Diamonds</p>
                <p className="font-serif text-3xl font-light text-foreground mb-8 leading-tight">
                  Formed over billions<br />
                  <span className="italic text-muted">of years.</span>
                </p>
                <div className="space-y-4 text-sm text-muted font-light leading-relaxed">
                  <p>
                    Natural diamonds were formed deep within the Earth under extreme heat and pressure over 1 to 3.5 billion years. They were carried to the surface by volcanic activity and have been treasured for millennia.
                  </p>
                  <p>
                    Each natural diamond carries a unique geological history. For many clients, this rarity and heritage carries profound meaning — particularly for engagement rings and heirloom pieces.
                  </p>
                  <p>
                    DETARA sources natural diamonds through verified ethical supply chains, ensuring responsible provenance for every stone.
                  </p>
                </div>
              </div>
            </div>

            {/* Identical quality note */}
            <div className="mt-8 p-8 bg-[#FFFDF8] border border-[rgba(28,25,23,0.06)]">
              <p className="text-sm text-muted font-light leading-relaxed text-center">
                Both lab-grown and natural diamonds in the DETARA collection meet identical quality standards: D–G color range, VVS clarity, and certification by IGI or GIA.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section — AEO */}
        <section className="py-24 px-8 md:px-20 bg-[#FFFDF8] border-t border-[rgba(28,25,23,0.06)]" aria-labelledby="faq-heading">
          <div className="max-w-[760px] mx-auto">
            <p className="label-caps text-accent mb-4 tracking-[0.35em]">Common Questions</p>
            <h2 id="faq-heading" className="font-serif text-4xl font-light text-foreground mb-12">
              Diamond FAQ
            </h2>
            <div className="space-y-0 border border-[rgba(28,25,23,0.08)]">
              {[
                {
                  q: 'What is the difference between natural and lab-grown diamonds?',
                  a: 'Natural diamonds are formed deep within the Earth over billions of years. Lab-grown diamonds are created using advanced technology that replicates this process. Both are chemically, physically, and optically identical — pure crystallised carbon. The difference lies only in origin. DETARA offers both options, all certified by IGI or GIA.',
                },
                {
                  q: 'What carat size should I choose for an engagement ring?',
                  a: 'The most popular choice is 0.70–1.00 ct, which offers a noticeable presence without being overstated. A 0.70 ct round brilliant measures approximately 5.8 mm in diameter. The right size depends on your budget, the wearer\'s finger size, and personal preference. Our advisors can help you find the perfect balance.',
                },
                {
                  q: 'Are lab-grown diamonds real diamonds?',
                  a: 'Yes. Lab-grown diamonds are real diamonds with the same crystal structure, chemical composition, hardness, and optical properties as natural diamonds. A gemologist cannot distinguish them without specialised equipment. Both are certified by IGI or GIA.',
                },
                {
                  q: 'What diamond certification does DETARA use?',
                  a: 'DETARA uses IGI (International Gemological Institute) and GIA (Gemological Institute of America) — the two most respected grading laboratories in the world. Every DETARA diamond comes with a certificate documenting its cut, colour, clarity, and carat weight.',
                },
                {
                  q: 'What colour and clarity standards does DETARA use?',
                  a: 'DETARA works exclusively with D–G colour range diamonds and VVS clarity standards. D–G colour diamonds appear colourless to near-colourless to the naked eye, and VVS clarity means inclusions are extremely difficult to see even under 10x magnification.',
                },
              ].map((item, i) => (
                <div key={i} className={`p-8 ${i < 4 ? 'border-b border-[rgba(28,25,23,0.08)]' : ''}`}>
                  <h3 className="font-serif text-lg font-light text-foreground mb-3">{item.q}</h3>
                  <p className="text-sm text-muted font-light leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-8 bg-[#EAE2D8] border-t border-[rgba(28,25,23,0.08)]">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-serif text-3xl font-light text-foreground mb-3">Ready to choose your diamond?</h3>
              <p className="text-sm text-muted font-light">Our advisors are available to guide you through every decision.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/kiss" className="btn-primary">
                Explore Collection
              </Link>
              <Link href="/ring-size-guide" className="btn-outline">
                Ring Size Guide
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
