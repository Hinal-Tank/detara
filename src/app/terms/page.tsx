'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContentPage } from '@/lib/supabase/contentPageService';

const STATIC_SECTIONS = [
  { title: '1. General', content: 'These Terms and Conditions govern your use of the DETARA website and the purchase of products from DETARA LTD, a company registered in the United Kingdom. By placing an order, you agree to these terms in full. DETARA reserves the right to update these terms at any time.' },
  { title: '2. Products', content: 'All DETARA jewelry is made to order. Products are crafted to your specifications and may vary slightly from images shown on the website. Diamond certifications (IGI/GIA) are included with every purchase.' },
  { title: '3. Pricing', content: 'All prices are displayed in the currency shown at checkout. Prices include applicable taxes where required. DETARA reserves the right to change prices at any time without notice.' },
  { title: '4. Orders & Payment', content: 'Orders are confirmed upon receipt of full payment. Production begins only after payment is verified. Your order number must be used as the payment reference.' },
  { title: '5. Production & Delivery', content: 'Standard production time is 3–5 weeks from order confirmation. Delivery is via insured courier. All shipments are fully insured for the declared value.' },
  { title: '6. Returns & Refunds', content: 'As all pieces are made to order, returns are accepted only for manufacturing defects. Please refer to our Refund Policy for full details. Custom jewelry orders are non-refundable.' },
  { title: '7. Intellectual Property', content: 'All content on the DETARA website, including images, text, logos, and designs, is the intellectual property of DETARA LTD. Reproduction or use without written permission is prohibited.' },
  { title: '8. Governing Law', content: 'These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England and Wales.' },
  { title: '9. Contact', content: 'For questions regarding these terms, contact us at hello@detara.store or through our Contact page.' },
];

export default function TermsPage() {
  const [dbContent, setDbContent] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Terms & Conditions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentPage('terms')?.then((data) => {
      if (data) {
        setDbContent(data?.content);
        setPageTitle(data?.title);
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg pt-44 md:pt-56 pb-20 md:pb-32 px-5 md:px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="label-caps text-accent mb-4">Legal</p>
          <h1 className="heading-display text-[clamp(2rem,4vw,4rem)] text-foreground font-light leading-[0.92] mb-8">
            {pageTitle}
          </h1>
          <p className="text-sm text-muted font-light mb-12">Last updated: January 2026</p>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              {[1,2,3,4]?.map(i => (
                <div key={i} className="border-t border-[rgba(28,25,23,0.08)] pt-8">
                  <div className="h-5 bg-[#EEE7DC] rounded w-1/3 mb-3" />
                  <div className="h-4 bg-[#EEE7DC] rounded w-full mb-2" />
                  <div className="h-4 bg-[#EEE7DC] rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : dbContent ? (
            <div
              className="prose prose-sm max-w-none [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-light [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:pt-8 [&_h2]:border-t [&_h2]:border-[rgba(28,25,23,0.08)] [&_p]:text-sm [&_p]:text-muted [&_p]:font-light [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dbContent }}
            />
          ) : (
            <div className="prose prose-sm max-w-none space-y-10">
              {STATIC_SECTIONS?.map((section) => (
                <div key={section?.title} className="border-t border-[rgba(28,25,23,0.08)] pt-8">
                  <h2 className="font-serif text-xl font-light text-foreground mb-4">{section?.title}</h2>
                  <p className="text-sm text-muted font-light leading-relaxed">{section?.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
