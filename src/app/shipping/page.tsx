'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContentPage } from '@/lib/supabase/contentPageService';

const STATIC_SECTIONS = [
  { title: 'Production Time', content: 'All DETARA jewelry is made to order. Standard production time is 3–5 weeks from order confirmation (after payment is verified). Complex custom pieces may require 6–8 weeks. You will be notified of your estimated completion date after your order is confirmed.' },
  { title: 'Shipping Method', content: 'All orders are shipped via insured express courier (DHL or equivalent). Tracking information is provided once your order is dispatched. Delivery typically takes 2–5 business days after dispatch, depending on destination.' },
  { title: 'Insurance', content: 'Every DETARA shipment is fully insured for the declared value of the jewelry. In the unlikely event of loss or damage in transit, we will file an insurance claim and arrange a replacement at no cost to you.' },
  { title: 'Shipping Costs', content: 'Free insured shipping is included on all orders. There are no additional shipping charges regardless of order value or destination.' },
  { title: 'United Kingdom', content: 'Orders within the United Kingdom are delivered within 2–3 business days after dispatch. Delivery is to your specified address via insured courier with signature required.' },
  { title: 'Europe', content: 'We ship to all European countries. Delivery takes 3–5 business days after dispatch. Import duties and taxes may apply depending on your country. The customer is responsible for any applicable customs fees.' },
  { title: 'International (Rest of World)', content: 'We ship worldwide. Delivery times vary by destination (5–10 business days). The customer is responsible for all import duties, taxes, and customs clearance fees.' },
  { title: 'Packaging', content: 'Your jewelry arrives in DETARA signature packaging: a luxury box with ribbon, certificate of authenticity, diamond certificate (IGI/GIA), and care instructions. All packaging is discreet for security.' },
  { title: 'Contact', content: 'For shipping inquiries, contact hello@detara.store. Our customer care team is available Monday–Friday, 9:00 AM – 6:00 PM (UK Time).' },
];

export default function ShippingPage() {
  const [dbContent, setDbContent] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Shipping Policy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentPage('shipping')?.then((data) => {
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
              className="prose prose-sm max-w-none space-y-0 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-light [&_h2]:text-foreground [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:pt-8 [&_h2]:border-t [&_h2]:border-[rgba(28,25,23,0.08)] [&_p]:text-sm [&_p]:text-muted [&_p]:font-light [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dbContent }}
            />
          ) : (
            <div className="space-y-10">
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
