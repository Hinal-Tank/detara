'use client';

import React, { useEffect, useState, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
// NOTE: MobileBottomNav is rendered once from the root layout (src/app/layout.tsx).
// Do NOT render it here — a duplicate render caused a second identical <nav>
// in the DOM and contributed to hydration-mismatch signatures.

// Above-the-fold sections — loaded eagerly
import HeroSection from './components/HeroSection';
import TrustStrip from './components/TrustStrip';

// Below-the-fold sections — lazy loaded
const ShopByCategory = lazy(() => import('./components/ShopByCategory'));
const FeaturedProducts = lazy(() => import('./components/FeaturedProducts'));
const CustomJewellerySection = lazy(() => import('./components/CustomJewellerySection'));
const NaturalVsLab = lazy(() => import('./components/NaturalVsLab'));
const CraftsmanshipSection = lazy(() => import('./components/CraftsmanshipSection'));
const ServicePromise = lazy(() => import('./components/ServicePromise'));
const JournalSection = lazy(() => import('./components/JournalSection'));
const FinalCtaSection = lazy(() => import('./components/FinalCtaSection'));
const NewsletterSection = lazy(() => import('./components/NewsletterSection'));
const AIChatWidget = lazy(() => import('@/components/AIChatWidget'));

import type { HomepageData } from '@/lib/supabase/homepageService';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

// Homepage FAQ structured data for AEO — answers key customer questions
const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is DETARA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DETARA is a luxury diamond jewellery brand offering certified engagement rings, diamond stud earrings, tennis bracelets, pendants and bespoke custom pieces. DETARA combines Scandinavian design precision with exceptional diamond quality. All diamonds are certified by IGI or GIA. Both natural and lab-grown diamond options are available. DETARA ships worldwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DETARA offer lab-grown diamonds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DETARA offers both natural and lab-grown diamonds. Both options use certified diamonds with the same physical, chemical, and optical properties. Lab-grown diamonds offer the same brilliance and durability at a more accessible price point. All DETARA diamonds — natural and lab-grown — are certified by IGI or GIA.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I order custom jewellery from DETARA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DETARA offers a full bespoke custom jewellery design service. You can create a custom engagement ring, pendant, earrings, or bracelet. The process includes a consultation, design proposal, production (4–6 weeks), and fully insured shipping. Custom pieces start from approximately €3,000. Contact DETARA via the custom jewellery page or WhatsApp to begin.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the KISS concept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The DETARA KISS Collection is a curated selection of certified diamond jewellery — engagement rings, stud earrings, tennis bracelets, and pendants. KISS stands for the design philosophy of simplicity and precision: removing everything unnecessary until only the essential remains. The collection features pieces available in natural and lab-grown diamond options, across multiple metal choices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DETARA ship worldwide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DETARA ships worldwide with fully insured delivery. Shipping is available to the UK, Europe, USA, and internationally. All shipments are fully insured during transit. Delivery times vary by destination. Contact DETARA for specific shipping information for your country.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are DETARA diamonds certified?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All DETARA diamonds are certified by IGI (International Gemological Institute) or GIA (Gemological Institute of America) — the two most respected diamond grading laboratories in the world. Every certificate documents the diamond\'s cut, colour, clarity, and carat weight. DETARA works exclusively with D–G colour range diamonds and VVS clarity standards.',
      },
    },
  ],
};

function SectionPlaceholder() {
  return <div className="py-16 md:py-24" aria-hidden="true" />;
}

export default function HomePage() {
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    fetch('/api/homepage')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {/* silent */});
  }, []);

  const s = data?.sections || {};
  const isActive = (key: string) => !s[key] || s[key].is_active !== false;

  return (
    <>
      {/* Homepage FAQ structured data for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
      />
      <div suppressHydrationWarning>
        <div className="grain-overlay" aria-hidden="true" />
        <Header />
        <main style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {/* 1. Hero */}
          <HeroSection section={s['hero'] || null} />

          {/* 2. Trust Strip */}
          {isActive('trust_strip') && <TrustStrip />}

          {/* 3. Shop by Category — 6 master categories only */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('shop_by_category') && <ShopByCategory />}
          </Suspense>

          {/* 4. Featured Products */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('featured_products') && (
              <FeaturedProducts
                section={s['featured_products'] || null}
                products={data?.featuredProducts || []}
              />
            )}
          </Suspense>

          {/* 5. Custom Jewellery / Bespoke */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('custom_jewellery') && (
              <CustomJewellerySection section={s['custom_jewellery'] || null} />
            )}
          </Suspense>

          {/* 6. Natural vs Lab */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('natural_vs_lab') && (
              <NaturalVsLab section={s['natural_vs_lab'] || null} />
            )}
          </Suspense>

          {/* 7. Craftsmanship */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('craftsmanship') && (
              <CraftsmanshipSection section={s['craftsmanship'] || null} />
            )}
          </Suspense>

          {/* 8. Service Promise */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('service_promise') && <ServicePromise />}
          </Suspense>

          {/* 9. Journal */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('journal') && (
              <JournalSection
                section={s['journal'] || null}
                posts={data?.journalPosts || []}
              />
            )}
          </Suspense>

          {/* 10. Final CTA */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('final_cta') && (
              <FinalCtaSection section={s['final_cta'] || null} />
            )}
          </Suspense>

          {/* 11. Newsletter */}
          <Suspense fallback={<SectionPlaceholder />}>
            {isActive('newsletter') && (
              <NewsletterSection section={s['newsletter'] || null} />
            )}
          </Suspense>
        </main>
        <Footer />
        <WhatsAppFloat />
        <Suspense fallback={null}>
          <AIChatWidget />
        </Suspense>
      </div>
    </>
  );
}