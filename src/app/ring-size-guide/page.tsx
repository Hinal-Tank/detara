import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

export const metadata: Metadata = {
  title: 'Ring Size Guide — International Size Chart | DETARA',
  description:
    'Find your ring size with our international conversion chart (UK, US, EU). Step-by-step guide to measuring your ring size at home. Free resizing within 30 days.',
  keywords: [
    'ring size guide',
    'ring size chart',
    'how to measure ring size',
    'ring size conversion',
    'UK ring sizes',
    'EU ring sizes',
    'US ring sizes',
    'engagement ring size',
  ],
  openGraph: {
    title: 'Ring Size Guide — International Size Chart | DETARA',
    description:
      'Find your ring size with our international conversion chart. Step-by-step guide to measuring at home.',
    type: 'article',
    url: `${baseUrl}/ring-size-guide`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ring Size Guide | DETARA',
    description: 'International ring size chart and how to measure your ring size at home.',
  },
  alternates: {
    canonical: `${baseUrl}/ring-size-guide`,
  },
};

const sizeChart = [
  { us: '4', uk: 'H', eu: '47', diameter: '14.9 mm', circumference: '46.8 mm' },
  { us: '4.5', uk: 'I', eu: '48', diameter: '15.3 mm', circumference: '48.0 mm' },
  { us: '5', uk: 'J', eu: '49', diameter: '15.7 mm', circumference: '49.3 mm' },
  { us: '5.5', uk: 'K', eu: '50', diameter: '16.1 mm', circumference: '50.6 mm' },
  { us: '6', uk: 'L', eu: '51', diameter: '16.5 mm', circumference: '51.9 mm' },
  { us: '6.5', uk: 'M', eu: '53', diameter: '16.9 mm', circumference: '53.1 mm' },
  { us: '7', uk: 'N', eu: '54', diameter: '17.3 mm', circumference: '54.4 mm' },
  { us: '7.5', uk: 'O', eu: '55', diameter: '17.7 mm', circumference: '55.7 mm' },
  { us: '8', uk: 'P', eu: '57', diameter: '18.1 mm', circumference: '57.0 mm' },
  { us: '8.5', uk: 'Q', eu: '58', diameter: '18.5 mm', circumference: '58.3 mm' },
  { us: '9', uk: 'R', eu: '59', diameter: '18.9 mm', circumference: '59.5 mm' },
  { us: '9.5', uk: 'S', eu: '60', diameter: '19.4 mm', circumference: '60.8 mm' },
  { us: '10', uk: 'T', eu: '62', diameter: '19.8 mm', circumference: '62.1 mm' },
];

const measurementSteps = [
  {
    step: '01',
    title: 'Use a strip of paper',
    desc: 'Cut a thin strip of paper approximately 10 cm long and 0.5 cm wide.',
  },
  {
    step: '02',
    title: 'Wrap around your finger',
    desc: 'Wrap the paper snugly around the base of the finger you intend to wear the ring on. Mark where the paper overlaps.',
  },
  {
    step: '03',
    title: 'Measure the length',
    desc: 'Lay the paper flat and measure the length in millimetres from the end to your mark. This is your circumference.',
  },
  {
    step: '04',
    title: 'Find your size',
    desc: 'Match your circumference measurement to the chart above. If between sizes, we recommend choosing the larger size.',
  },
];

// FAQ structured data for AEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I measure my ring size at home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To measure your ring size at home: (1) Cut a thin strip of paper about 10 cm long. (2) Wrap it snugly around the base of your finger and mark where it overlaps. (3) Measure the length in millimetres — this is your circumference. (4) Match your measurement to the ring size chart. Measure in the evening when fingers are at their largest, and avoid measuring when cold.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the average ring size for women?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average ring size for women is EU 53 (US 6.5, UK M). However, ring sizes vary significantly between individuals. We recommend measuring accurately rather than assuming an average size. DETARA offers complimentary resizing within 30 days of delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I am between ring sizes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you are between ring sizes, we recommend choosing the larger size. Ring size can vary by up to half a size depending on temperature and time of day. We also recommend measuring 2–3 times and taking the average. DETARA offers complimentary resizing within 30 days of delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I choose a ring size for a surprise proposal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a surprise proposal, you can: (1) Borrow a ring your partner wears on their ring finger and trace the inside diameter. (2) Ask a trusted friend or family member who may know the size. (3) Order a standard size (EU 53 / US 6.5 for women) — DETARA offers complimentary resizing within 30 days. (4) Contact our advisors who have guided hundreds of proposals and can advise on the best approach.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does DETARA offer ring resizing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DETARA offers complimentary resizing within 30 days of delivery. For clients outside Norway, we offer a secure postal service program — pieces are insured during transit and returned within 10–14 business days. Contact our customer care team at hello@detara.store to arrange resizing.',
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
    { '@type': 'ListItem', position: 2, name: 'Ring Size Guide', item: `${baseUrl}/ring-size-guide` },
  ],
};

export default function RingSizeGuidePage() {
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
            <span className="label-caps text-foreground" aria-current="page">Ring Size Guide</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-b border-[rgba(28,25,23,0.06)]">
          <p className="label-caps text-accent mb-6 tracking-[0.35em]">Service</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-foreground leading-tight mb-8 max-w-2xl">
            Ring Size<br />
            <span className="italic text-muted">Guide</span>
          </h1>
          <p className="text-lg text-muted font-light leading-relaxed max-w-xl">
            Finding the correct ring size ensures a comfortable fit and avoids the need for resizing. Use this guide to measure accurately at home.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/diamond-guide" className="text-sm text-accent hover:underline font-light">Diamond Guide →</Link>
            <Link href="/products?category=engagement-rings" className="text-sm text-accent hover:underline font-light">Engagement Rings →</Link>
            <Link href="/contact" className="text-sm text-accent hover:underline font-light">Contact an Advisor →</Link>
          </div>
        </div>

        {/* Size Chart */}
        <section className="py-24 px-8 md:px-20 border-b border-[rgba(28,25,23,0.06)]" aria-labelledby="size-chart-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-12">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">International Chart</p>
              <h2 id="size-chart-heading" className="font-serif text-4xl font-light text-foreground">Ring Size Conversion</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-[rgba(28,25,23,0.08)]">
                <thead>
                  <tr className="border-b border-[rgba(28,25,23,0.08)] bg-[#EAE2D8]">
                    <th className="text-left px-6 py-4 label-caps text-foreground" style={{ fontSize: '9px' }}>US / Canada</th>
                    <th className="text-left px-6 py-4 label-caps text-foreground" style={{ fontSize: '9px' }}>UK / Australia</th>
                    <th className="text-left px-6 py-4 label-caps text-foreground" style={{ fontSize: '9px' }}>Europe</th>
                    <th className="text-left px-6 py-4 label-caps text-foreground" style={{ fontSize: '9px' }}>Diameter</th>
                    <th className="text-left px-6 py-4 label-caps text-foreground" style={{ fontSize: '9px' }}>Circumference</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart?.map((row, i) => (
                    <tr
                      key={row?.us}
                      className={`border-b border-[rgba(28,25,23,0.06)] ${i % 2 === 0 ? 'bg-bg' : 'bg-[#FFFDF8]'}`}
                    >
                      <td className="px-6 py-4 text-sm text-foreground font-light">{row?.us}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-light">{row?.uk}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-light">{row?.eu}</td>
                      <td className="px-6 py-4 text-sm text-muted font-light">{row?.diameter}</td>
                      <td className="px-6 py-4 text-sm text-muted font-light">{row?.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Measuring at Home */}
        <section className="py-24 px-8 md:px-20 border-b border-[rgba(28,25,23,0.06)] bg-[#FFFDF8]" aria-labelledby="measuring-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="mb-16">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">How To</p>
              <h2 id="measuring-heading" className="font-serif text-4xl font-light text-foreground">Measuring at Home</h2>
              <p className="mt-6 text-base text-muted font-light max-w-lg">
                You will need a thin strip of paper, a pen, and a ruler. Measure in the evening when fingers are at their largest, and avoid measuring when cold.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[rgba(28,25,23,0.08)]">
              {measurementSteps?.map((step, i) => (
                <div
                  key={step?.step}
                  className={`p-8 ${i < 3 ? 'border-r border-[rgba(28,25,23,0.08)]' : ''}`}
                >
                  <span className="block font-serif text-5xl font-light text-accent/30 mb-6 leading-none" aria-hidden="true">{step?.step}</span>
                  <h3 className="font-serif text-lg font-light text-foreground mb-3">{step?.title}</h3>
                  <p className="text-sm text-muted font-light leading-relaxed">{step?.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 border border-[rgba(28,25,23,0.08)] bg-bg">
              <p className="text-sm text-muted font-light leading-relaxed">
                <span className="text-foreground font-normal">Important:</span> Ring size can vary by up to half a size depending on temperature and time of day. We recommend measuring 2–3 times and taking the average. If you are between sizes, always choose the larger size.
              </p>
            </div>
          </div>
        </section>

        {/* Surprise Proposals */}
        <section className="py-24 px-8 md:px-20" aria-labelledby="proposals-heading">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="label-caps text-accent mb-4 tracking-[0.35em]">For Proposals</p>
                <h2 id="proposals-heading" className="font-serif text-4xl font-light text-foreground mb-8">
                  Planning a<br />
                  <span className="italic text-muted">surprise?</span>
                </h2>
                <div className="space-y-5 text-sm text-muted font-light leading-relaxed">
                  <p>
                    Choosing a ring size without your partner knowing is one of the most common challenges in engagement ring shopping. Here are several discreet methods our advisors recommend.
                  </p>
                </div>
              </div>

              <div className="space-y-0 border border-[rgba(28,25,23,0.08)]">
                {[
                  {
                    title: 'Borrow an existing ring',
                    desc: 'Take a ring your partner wears on their ring finger and trace the inside diameter on paper, or bring it to our studio for measurement.',
                  },
                  {
                    title: 'Ask a trusted friend or family member',
                    desc: 'A close friend or sibling may already know the size, or can help you find out discreetly.',
                  },
                  {
                    title: 'Order a standard size',
                    desc: 'The average ring size for women is EU 53 (US 6.5) and for men EU 63 (US 10). DETARA offers complimentary resizing within 30 days of delivery.',
                  },
                  {
                    title: 'Contact our advisors',
                    desc: 'Our diamond advisors have guided hundreds of proposals. We are happy to advise on the best approach for your situation.',
                  },
                ]?.map((item, i) => (
                  <div key={item?.title} className={`p-7 ${i < 3 ? 'border-b border-[rgba(28,25,23,0.08)]' : ''}`}>
                    <h3 className="font-serif text-base font-light text-foreground mb-2">{item?.title}</h3>
                    <p className="text-sm text-muted font-light leading-relaxed">{item?.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-8 bg-[#EAE2D8] border-t border-[rgba(28,25,23,0.08)]">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-serif text-3xl font-light text-foreground mb-3">Still unsure about your size?</h3>
              <p className="text-sm text-muted font-light">Contact our advisors for personal guidance. We respond within 4 hours.</p>
            </div>
            <div className="flex gap-4">
              <a href="mailto:hello@detara.store" className="btn-primary">Contact an Advisor</a>
              <Link href="/products?category=engagement-rings" className="btn-outline">Explore Rings</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
