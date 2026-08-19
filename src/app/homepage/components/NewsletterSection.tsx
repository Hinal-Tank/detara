'use client';

import React, { useState } from 'react';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface NewsletterSectionProps {
  section: HomepageSection | null;
}

export default function NewsletterSection({ section }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const title = section?.title || 'THE DETARA JOURNAL';
  const description = section?.description || 'Private access to new collections, diamond education and selected releases.';
  const ctaText = section?.cta_text || 'SUBSCRIBE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError('');
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'homepage_newsletter' });
      if (dbError && dbError.code !== '23505') throw dbError;
      fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter_signup', data: { to: email } }),
      }).catch(() => {/* non-critical */});
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 px-5 md:px-8" style={{ maxWidth: '100vw', backgroundColor: '#5B4636' }}>
      <div className="max-w-[640px] mx-auto text-center">
        <span className="block mb-5" style={{ color: '#C6A15B' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 mx-auto">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="label-caps mb-4" style={{ color: '#C6A15B' }}>Journal</p>
        <h2 className="heading-serif text-2xl md:text-3xl font-light mb-3" style={{ color: '#F6F1E8' }}>{title}</h2>
        <p className="text-sm font-light leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: 'rgba(247,245,241,0.6)' }}>{description}</p>

        {done ? (
          <p className="text-sm font-light py-3" style={{ color: '#C6A15B' }}>◇ Thank you — you&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              required
              className="flex-1 bg-transparent px-4 py-3.5 text-sm focus:outline-none transition-colors tracking-wider"
              style={{ border: '1px solid rgba(247,245,241,0.2)', color: '#F6F1E8' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#C6A15B')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(247,245,241,0.2)')}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3.5 label-caps text-xs tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#C6A15B', color: '#211B18' }}
            >
              {submitting ? '...' : ctaText}
            </button>
          </form>
        )}

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <p className="mt-4 text-[10px] font-light" style={{ color: 'rgba(247,245,241,0.35)' }}>No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
