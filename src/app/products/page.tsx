'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsClient from './components/ProductsClient';
import WhatsAppFloat from '../homepage/components/WhatsAppFloat';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

export default function ProductsPage() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main className="pt-[88px] sm:pt-[100px] md:pt-[112px] lg:pt-[124px] pb-0">
        {/* SEO H1 — visually hidden for crawlers */}
        <h1 className="sr-only">Diamond Jewellery Collection — Engagement Rings, Diamond Studs, Tennis Bracelets | DETARA</h1>
        {/* BreadcrumbList structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'Diamond Jewellery Collection', item: `${baseUrl}/products` },
              ],
            }),
          }}
        />
        {/* CollectionPage structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              '@id': `${baseUrl}/products#collection`,
              name: 'DETARA Diamond Jewellery Collection',
              description: 'Certified diamond engagement rings, stud earrings, tennis bracelets, pendants and more. Natural and lab-grown diamonds.',
              url: `${baseUrl}/products`,
              publisher: {
                '@type': 'Organization',
                '@id': `${baseUrl}/#organization`,
                name: 'DETARA LTD',
              },
            }),
          }}
        />
        <Suspense fallback={
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ProductsClient />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}