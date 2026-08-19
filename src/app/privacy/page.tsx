'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getContentPage } from '@/lib/supabase/contentPageService';

const STATIC_SECTIONS = [
  { title: '1. Data Controller', content: 'DETARA LTD, London, United Kingdom, is the data controller for personal data collected through this website. Contact: hello@detara.store' },
  { title: '2. Data We Collect', content: 'We collect: name, email address, phone number, shipping address, and order details when you place an order or contact us. We may also collect browsing data (IP address, browser type) for analytics purposes.' },
  { title: '3. How We Use Your Data', content: 'Your data is used to: process and fulfill your orders, communicate order status updates, respond to inquiries, and improve our services. We do not sell your personal data to third parties.' },
  { title: '4. Data Retention', content: 'Order data is retained for 7 years as required by UK accounting regulations. Contact form submissions are retained for 2 years. You may request deletion of your data at any time, subject to legal retention requirements.' },
  { title: '5. Your Rights (UK GDPR)', content: 'Under UK GDPR, you have the right to: access your personal data, correct inaccurate data, request deletion, restrict processing, and data portability. To exercise these rights, contact hello@detara.store.' },
  { title: '6. Cookies', content: 'We use essential cookies for website functionality and analytics cookies to understand how visitors use our site. You may disable non-essential cookies in your browser settings.' },
  { title: '7. Security', content: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.' },
  { title: '8. Contact', content: 'For privacy-related inquiries, contact our Data Protection team at hello@detara.store.' },
];

export default function PrivacyPage() {
  const [dbContent, setDbContent] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Privacy Policy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentPage('privacy')?.then((data) => {
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
