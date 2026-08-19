'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContentPage } from '@/lib/supabase/contentPageService';

const STATIC_SECTIONS = [
  { title: 'Made-to-Order Policy', content: 'All DETARA jewelry is crafted to order based on your specifications. Because each piece is uniquely made for you, we are unable to accept returns for change of mind. This policy is in accordance with UK consumer law for custom-made goods.' },
  { title: 'Manufacturing Defects', content: 'If your jewelry arrives with a manufacturing defect, we will repair or replace the item at no cost. Please contact us within 14 days of receiving your order with photographs of the defect. We will arrange collection and resolution within 30 days.' },
  { title: 'Damaged in Transit', content: 'All DETARA shipments are fully insured. If your order arrives damaged, please photograph the packaging and item immediately and contact us within 48 hours. We will file an insurance claim and arrange a replacement.' },
  { title: 'Incorrect Items', content: 'If you receive an item that does not match your order specifications, contact us immediately. We will arrange collection and produce the correct item at no additional cost.' },
  { title: 'Resizing', content: 'We offer one complimentary resize within 60 days of delivery for rings. The customer is responsible for return shipping costs. Resizing may not be possible for all ring styles.' },
  { title: 'Cancellations', content: 'Orders may be cancelled within 24 hours of placement for a full refund. After 24 hours, production may have begun and cancellation may not be possible. Custom jewelry orders cannot be cancelled once production has started.' },
  { title: 'Refund Process', content: 'Approved refunds are processed within 5–10 business days via the original payment method. DETARA is not responsible for bank processing times.' },
  { title: 'Contact', content: 'To initiate a return or refund request, contact hello@detara.store with your order number and a description of the issue. Our customer care team is available Monday–Friday, 9:00 AM – 6:00 PM (UK Time).' },
];

export default function RefundPage() {
  const [dbContent, setDbContent] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Refund & Return Policy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentPage('returns')?.then((data) => {
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
