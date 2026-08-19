'use client';

import React, { Suspense } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomHero from './components/CustomHero';
import CustomProcess from './components/CustomProcess';
import CustomForm from './components/CustomForm';
import CustomGallery from './components/CustomGallery';
import CustomTimeline from './components/CustomTimeline';
import CustomAssurance from './components/CustomAssurance';
import CustomCTA from './components/CustomCTA';
import WhatsAppFloat from '../homepage/components/WhatsAppFloat';
import ScrollReveal from '../homepage/components/ScrollReveal';

export default function CustomJewelryPage() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main>
        {/* SEO H1 — visually hidden, for crawlers */}
        <h1 className="sr-only">Custom Diamond Jewellery — Bespoke Design Service | DETARA</h1>
        <CustomHero />
        <CustomProcess />
        <CustomGallery />
        <CustomTimeline />
        <CustomAssurance />
        {/* FAQ Section */}
        <section className="py-16 md:py-24 px-5 md:px-8 bg-[#FFFDF8]" aria-labelledby="faq-heading">
          <div className="max-w-[760px] mx-auto">
            <p className="text-[9px] tracking-[0.35em] uppercase text-[#B9924A] mb-4">Common Questions</p>
            <h2 id="faq-heading" className="font-serif text-[clamp(1.8rem,3.5vw,3rem)] font-light text-[#211B18] leading-[0.92] mb-10">
              Custom Jewellery<br />
              <span className="italic text-[#766C63]">FAQ</span>
            </h2>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'How long does a custom jewellery piece take to create?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'The typical timeline is 4–8 weeks from design approval to delivery. This includes consultation (1–2 days), design proposal (3–5 days), production (4–6 weeks), and fully insured shipping.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What is the minimum budget for a custom DETARA piece?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Custom pieces start from approximately €3,000 depending on the design, diamond choice, and metal. Our team will work with your budget to create the best possible piece.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Can I choose between natural and lab-grown diamonds?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. DETARA offers both natural and lab-grown diamonds for custom pieces. Both options use certified diamonds with the same physical and visual properties. Our team can guide you on the best choice for your needs.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Do I need to pay upfront for a custom order?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No payment is required at the enquiry stage. Once the design is approved, a deposit is typically required to begin production. Our concierge team will explain the payment process during your consultation.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What information do I need to provide for a custom order?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'The more detail you can provide, the better. Useful information includes: the type of jewellery, preferred diamond shape and carat, metal preference, budget, occasion, and any inspiration images or references.',
                      },
                    },
                  ],
                }),
              }}
            />
            <div className="space-y-0">
              {[
                {
                  q: 'How long does a custom piece take?',
                  a: 'Typically 4–8 weeks from design approval: consultation (1–2 days), design proposal (3–5 days), production (4–6 weeks), and fully insured shipping.',
                },
                {
                  q: 'What is the minimum budget?',
                  a: 'Custom pieces start from approximately €3,000 depending on the design, diamond choice, and metal. Our team will work with your budget.',
                },
                {
                  q: 'Natural or lab-grown diamonds?',
                  a: 'Both options are available. DETARA uses certified diamonds for all custom pieces. Our team can guide you on the best choice for your needs and budget.',
                },
                {
                  q: 'Do I need to pay upfront?',
                  a: 'No payment is required at the enquiry stage. A deposit is required once the design is approved. Our concierge team will explain the process during your consultation.',
                },
                {
                  q: 'What information should I provide?',
                  a: 'The more detail the better: jewellery type, diamond shape and carat, metal preference, budget, occasion, and any inspiration images or references.',
                },
              ]?.map((item, i) => (
                <details key={i} className="group border-b border-[rgba(28,25,23,0.08)]">
                  <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                    <span className="text-sm text-[#211B18] font-light pr-4">{item?.q}</span>
                    <span className="text-[#B9924A] flex-shrink-0 group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
                  </summary>
                  <p className="pb-5 text-sm text-[#766C63] font-light leading-relaxed">{item?.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <Suspense fallback={<div className="py-20 px-5 text-center text-[#766C63] font-light">Loading form...</div>}>
          <CustomForm />
        </Suspense>
        <CustomCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollReveal />
    </>
  );
}