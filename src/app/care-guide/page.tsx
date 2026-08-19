import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

export const metadata: Metadata = {
  title: 'Jewellery Care Guide — How to Clean & Store Diamond Jewellery | DETARA',
  description:
    'Expert guide on how to clean, store and maintain your diamond jewellery. DETARA\'s professional care advice for engagement rings, diamond studs, tennis bracelets and all fine jewellery.',
  keywords: [
    'jewellery care guide',
    'how to clean diamond jewellery',
    'diamond ring care',
    'jewellery storage',
    'engagement ring maintenance',
    'diamond care tips',
    'fine jewellery care',
  ],
  openGraph: {
    title: 'Jewellery Care Guide | DETARA',
    description:
      'How to clean, store and maintain your diamond jewellery. Expert care advice from DETARA.',
    type: 'article',
    url: `${baseUrl}/care-guide`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewellery Care Guide | DETARA',
    description: 'Expert guide on cleaning and maintaining your diamond jewellery.',
  },
  alternates: {
    canonical: `${baseUrl}/care-guide`,
  },
};

// FAQ structured data for AEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I clean diamond jewellery at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The safest method is warm water with mild dish soap. Soak the piece for 20–30 minutes, then gently brush with a soft-bristle toothbrush, paying attention to the underside of the diamond. Rinse under clean lukewarm water and pat dry with a lint-free cloth. Avoid chlorine bleach, acetone, and abrasive cleaners.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I have my diamond ring professionally serviced?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend a professional prong inspection every 12–18 months for rings worn daily. Clean at home every 6 months using the warm water method. A full service (replating, polishing, and stone check) is recommended every 3–5 years. DETARA provides professional maintenance services and includes prong inspection in our lifetime service program.',
      },
    },
    {
      '@type': 'Question',
      name: 'How should I store diamond jewellery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Store each piece separately in a soft pouch or compartment — diamonds are the hardest natural material and will scratch other jewellery. Use the original DETARA packaging for long-term storage. Keep jewellery in a cool, dry environment away from direct sunlight and humidity. Remove rings and bracelets before exercise or manual work.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I avoid when wearing diamond jewellery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Remove jewellery before swimming in chlorinated pools, using cleaning products, exercising, or gardening. Avoid chlorine bleach, acetone, and abrasive cleaners. Hot water can loosen certain adhesives in pavé settings. Impact from physical activity can bend prongs and loosen stones over time.',
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
    { '@type': 'ListItem', position: 2, name: 'Jewellery Care Guide', item: `${baseUrl}/care-guide` },
  ],
};

export default function CareGuidePage() {
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
            <span className="label-caps text-foreground" aria-current="page">Jewellery Care Guide</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-b border-[rgba(28,25,23,0.06)]">
          <p className="label-caps text-accent mb-6 tracking-[0.35em]">Care</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-foreground leading-tight mb-8 max-w-2xl">
            Jewelry Care<br />
            <span className="italic text-muted">Guide</span>
          </h1>
          <p className="text-lg text-muted font-light leading-relaxed max-w-xl">
            With proper care, DETARA jewelry retains its brilliance and structural integrity for generations. These guidelines reflect the same standards we apply in our studio.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 border border-accent/30 bg-accent/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-foreground font-light">DETARA offers lifetime jewelry care advice to all clients.</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/diamond-guide" className="text-sm text-accent hover:underline font-light">Diamond Guide →</Link>
            <Link href="/ring-size-guide" className="text-sm text-accent hover:underline font-light">Ring Size Guide →</Link>
            <Link href="/contact" className="text-sm text-accent hover:underline font-light">Contact Support →</Link>
          </div>
        </div>

        {/* Section 1: Cleaning */}
        <section className="py-24 px-5 md:px-8 border-b border-[rgba(28,25,23,0.06)]" aria-labelledby="cleaning-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 01</p>
                <h2 id="cleaning-heading" className="font-serif text-4xl font-light text-foreground leading-tight">
                  Cleaning<br />
                  <span className="italic text-muted">Diamond Jewelry</span>
                </h2>
              </div>
              <div className="lg:col-span-8">
                <div className="space-y-0 border border-[rgba(28,25,23,0.08)]">
                  {[
                    {
                      title: 'Warm water and mild soap',
                      desc: 'The safest and most effective method for regular cleaning. Use lukewarm water with a small amount of mild dish soap. Soak the piece for 20–30 minutes, then gently brush with a soft-bristle toothbrush, paying attention to the underside of the diamond where oils accumulate.',
                    },
                    {
                      title: 'Rinse thoroughly',
                      desc: 'Rinse under clean lukewarm water to remove all soap residue. Soap film can reduce brilliance. Avoid hot water, which can loosen certain adhesives in pavé settings.',
                    },
                    {
                      title: 'Dry with a lint-free cloth',
                      desc: 'Pat dry with a soft, lint-free cloth. Allow to air dry completely before storing. Avoid paper towels, which can leave micro-scratches on gold surfaces.',
                    },
                    {
                      title: 'What to avoid',
                      desc: 'Avoid chlorine bleach, acetone, and abrasive cleaners — these can damage gold alloys and loosen prong settings. Remove jewelry before swimming in chlorinated pools or using cleaning products.',
                    },
                  ]?.map((item, i) => (
                    <div key={item?.title} className={`p-8 ${i < 3 ? 'border-b border-[rgba(28,25,23,0.08)]' : ''}`}>
                      <h3 className="font-serif text-lg font-light text-foreground mb-3">{item?.title}</h3>
                      <p className="text-sm text-muted font-light leading-relaxed">{item?.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Storage */}
        <section className="py-24 px-5 md:px-8 border-b border-[rgba(28,25,23,0.06)] bg-[#FFFDF8]" aria-labelledby="storage-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 02</p>
                <h2 id="storage-heading" className="font-serif text-4xl font-light text-foreground leading-tight">
                  Storing<br />
                  <span className="italic text-muted">Properly</span>
                </h2>
              </div>
              <div className="lg:col-span-8">
                <div className="grid md:grid-cols-2 gap-0 border border-[rgba(28,25,23,0.08)]">
                  {[
                    {
                      title: 'Store pieces separately',
                      desc: 'Diamonds are the hardest natural material and will scratch other jewelry — including other gold pieces. Each piece should be stored individually in a soft pouch or compartment.',
                    },
                    {
                      title: 'Use the original packaging',
                      desc: 'DETARA packaging is designed for long-term storage. The interior lining protects against scratches and the rigid exterior prevents deformation.',
                    },
                    {
                      title: 'Avoid humidity and direct sunlight',
                      desc: 'Store jewelry in a cool, dry environment away from direct sunlight. Prolonged UV exposure can affect certain gemstone treatments and cause gold to appear dull.',
                    },
                    {
                      title: 'Remove before physical activity',
                      desc: 'Remove rings and bracelets before exercise, gardening, or manual work. Impact can bend prongs and loosen stones over time.',
                    },
                  ]?.map((item, i) => (
                    <div
                      key={item?.title}
                      className={`p-8 ${i % 2 === 0 ? 'border-r border-[rgba(28,25,23,0.08)]' : ''} ${i < 2 ? 'border-b border-[rgba(28,25,23,0.08)]' : ''}`}
                    >
                      <h3 className="font-serif text-lg font-light text-foreground mb-3">{item?.title}</h3>
                      <p className="text-sm text-muted font-light leading-relaxed">{item?.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Prong Service */}
        <section className="py-24 px-5 md:px-8 border-b border-[rgba(28,25,23,0.06)]" aria-labelledby="prong-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 03</p>
                <h2 id="prong-heading" className="font-serif text-4xl font-light text-foreground leading-tight">
                  Prong &amp; Setting<br />
                  <span className="italic text-muted">Service</span>
                </h2>
              </div>
              <div className="lg:col-span-8">
                <div className="space-y-6 text-sm text-muted font-light leading-relaxed mb-10">
                  <p>
                    Prongs are the small metal claws that hold a diamond in place. Over time, daily wear causes microscopic bending and wear on prong tips. A loose prong is the primary cause of diamond loss.
                  </p>
                  <p>
                    We recommend a professional prong inspection every 12–18 months for rings worn daily. This is a quick procedure performed in our studio and is included in DETARA&apos;s lifetime service program.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-0 border border-[rgba(28,25,23,0.08)]">
                  {[
                    { interval: 'Every 6 months', action: 'Clean at home using the warm water method.' },
                    { interval: 'Every 12–18 months', action: 'Professional prong inspection and tightening.' },
                    { interval: 'Every 3–5 years', action: 'Full service: replating, polishing, and stone check.' },
                  ]?.map((item, i) => (
                    <div key={item?.interval} className={`p-7 ${i < 2 ? 'border-r border-[rgba(28,25,23,0.08)]' : ''}`}>
                      <p className="label-caps text-accent mb-3 tracking-[0.2em]" style={{ fontSize: '9px' }}>{item?.interval}</p>
                      <p className="text-sm text-foreground font-light leading-relaxed">{item?.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Professional Maintenance */}
        <section className="py-24 px-5 md:px-8 bg-[#FFFDF8]" aria-labelledby="maintenance-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">Section 04</p>
              <h2 id="maintenance-heading" className="font-serif text-4xl font-light text-foreground">Professional Maintenance</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-5 text-sm text-muted font-light leading-relaxed">
                <p>
                  Professional maintenance goes beyond cleaning. A skilled goldsmith can restore the original surface finish of your piece, re-tip worn prongs, replate white gold rhodium coating, and check all stone settings for security.
                </p>
                <p>
                  DETARA provides professional maintenance services from our studio. All work is performed by our in-house goldsmiths using the same techniques and materials used in original production.
                </p>
                <p>
                  For clients outside Norway, we offer a secure postal service program. Pieces are insured during transit and returned within 10–14 business days.
                </p>
              </div>

              <div className="space-y-0 border border-[rgba(28,25,23,0.08)]">
                {[
                  { service: 'Prong inspection & tightening', note: 'Included in lifetime service' },
                  { service: 'Rhodium replating (white gold)', note: 'Restores original bright finish' },
                  { service: 'Polish and refinishing', note: 'Removes surface scratches' },
                  { service: 'Stone security check', note: 'Full inspection under magnification' },
                  { service: 'Ultrasonic deep cleaning', note: 'Studio-grade professional clean' },
                ]?.map((item, i) => (
                  <div key={item?.service} className={`flex justify-between items-center px-7 py-5 ${i < 4 ? 'border-b border-[rgba(28,25,23,0.08)]' : ''}`}>
                    <span className="text-sm text-foreground font-light">{item?.service}</span>
                    <span className="label-caps text-muted text-right" style={{ fontSize: '9px' }}>{item?.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lifetime Care Promise */}
        <section className="py-20 px-5 md:px-8 bg-[#EAE2D8] border-t border-[rgba(28,25,23,0.08)]">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-serif text-3xl font-light text-foreground mb-3">Lifetime jewelry care advice</h3>
              <p className="text-sm text-muted font-light max-w-md">
                Every DETARA client receives lifetime access to our care advisory service. Whether you have a question about cleaning, storage, or service — we are here.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="mailto:hello@detara.store" className="btn-primary">Contact Us</a>
              <Link href="/diamond-guide" className="btn-outline">Diamond Guide</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
