import React from 'react';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

export const metadata: Metadata = {
  title: 'DETARA — Luxury Diamond Jewellery | Engagement Rings, Diamond Studs & Tennis Bracelets',
  description:
    'DETARA is a luxury diamond jewellery brand offering certified engagement rings, diamond stud earrings, tennis bracelets and bespoke custom pieces. Natural and lab-grown diamonds. Worldwide shipping.',
  openGraph: {
    title: 'DETARA — Luxury Diamond Jewellery',
    description:
      'Certified diamond engagement rings, stud earrings, tennis bracelets and bespoke custom pieces. Natural and lab-grown diamonds. Worldwide shipping.',
    type: 'website',
    url: baseUrl,
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
