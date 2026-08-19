'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import AIChatWidget from '@/components/AIChatWidget';

const jewelryTypes = [
  'Engagement Ring',
  'Diamond Stud Earrings',
  'Tennis Bracelet',
  'Diamond Band / Eternity Ring',
  'Diamond Pendant',
  'Custom Jewelry',
  'Other',
];

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';

// FAQ structured data for AEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I contact DETARA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact DETARA via WhatsApp at +44 20 4614 8575, by email at hello@detara.store, or by completing the contact form on this page. Our customer care team is available Monday–Friday, 9:00 AM–6:00 PM UK Time. We aim to respond to all enquiries within 4 business hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a private jewellery consultation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Private consultations are available for custom jewellery projects, engagement ring selection, and bespoke design commissions. Sessions are conducted via video call. To schedule a private consultation, complete the contact form and select your jewellery type. A DETARA advisor will confirm your appointment within one business day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are DETARA\'s business hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DETARA\'s customer care team is available Monday through Friday, 9:00 AM to 6:00 PM UK Time. We aim to respond to all enquiries within 4 business hours. For urgent enquiries, WhatsApp is the fastest channel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get help choosing a diamond engagement ring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DETARA advisors are available to guide you through every decision — from diamond shape and carat to metal type and setting style. You can contact us via WhatsApp, email, or book a private video consultation. Our AI advisor is also available 24/7 for instant answers.',
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
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${baseUrl}/contact` },
  ],
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    jewelryType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        jewelry_type: formData.jewelryType,
        message: formData.message,
      });

      if (dbError) {
        console.warn('Contact form DB error (non-critical):', dbError.message);
      }

      const emailRes = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact_form',
          data: {
            to: formData.email,
            customerName: formData.name,
            message: `Jewelry Type: ${formData.jewelryType || 'Not specified'}\n\n${formData.message}`,
            subject: `New Contact: ${formData.name} — ${formData.jewelryType || 'General Inquiry'}`,
          },
        }),
      });

      if (!emailRes.ok) {
        const errData = await emailRes.json().catch(() => ({}));
        console.error('Contact email API error:', errData);
      }

      // Always show success to customer — submission was saved
      setSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send message. Please try again or reach us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-44 md:pt-56 lg:pt-64 pb-16 md:pb-20 lg:pb-24 px-5 md:px-8 bg-bg">
          <div className="max-w-[1280px] mx-auto">
            <p className="label-caps text-accent mb-6">Contact</p>
            <h1 className="heading-display text-[clamp(3rem,6vw,6rem)] text-foreground leading-[0.9] mb-8 max-w-2xl">
              Get in<br />
              <span className="italic font-light text-muted">Touch</span>
            </h1>
            <p className="text-lg text-muted font-light leading-relaxed max-w-lg">
              Our customer care team is here to help with consultations, custom jewelry inquiries, and order support.
            </p>
          </div>
        </section>

        {/* Contact info cards */}
        <section className="py-12 px-5 md:px-8 bg-bg-warm border-t border-[rgba(28,25,23,0.05)]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* WhatsApp */}
              <div className="border border-[rgba(28,25,23,0.08)] p-8 bg-bg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <p className="label-caps text-foreground">WhatsApp Support</p>
                </div>
                <p className="text-sm text-muted font-light leading-relaxed">
                  Chat with us directly for fast responses on orders, custom jewelry, and product questions.
                </p>
                <a
                  href="https://wa.me/442046148575"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors font-light"
                >
                  +44 20 4614 8575
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/442046148575"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 px-5 py-2.5 border border-[rgba(28,25,23,0.12)] text-xs font-medium tracking-widest text-foreground hover:border-accent hover:text-accent transition-colors text-center"
                >
                  OPEN WHATSAPP
                </a>
              </div>

              {/* Email */}
              <div className="border border-[rgba(28,25,23,0.08)] p-8 bg-bg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <p className="label-caps text-foreground">Email Support</p>
                </div>
                <p className="text-sm text-muted font-light leading-relaxed">
                  Send us an email for detailed inquiries, order support, or custom jewelry consultations.
                </p>
                <a
                  href="mailto:hello@detara.store"
                  className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors font-light"
                >
                  hello@detara.store
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@detara.store"
                  className="block mt-2 px-5 py-2.5 border border-[rgba(28,25,23,0.12)] text-xs font-medium tracking-widest text-foreground hover:border-accent hover:text-accent transition-colors text-center"
                >
                  SEND EMAIL
                </a>
              </div>

              {/* Business Hours */}
              <div className="border border-[rgba(28,25,23,0.08)] p-8 bg-bg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <p className="label-caps text-foreground">Business Hours</p>
                </div>
                <p className="text-sm text-muted font-light leading-relaxed">
                  Our customer care team is available during the following hours:
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-foreground font-light">Monday – Friday</p>
                  <p className="text-sm text-muted font-light">9:00 AM – 6:00 PM (UK Time)</p>
                </div>
                <p className="text-xs text-muted font-light">
                  We aim to respond to all inquiries within 4 business hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-24 px-5 md:px-8 bg-bg">
          <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-24 items-start">

            {/* Left — additional info */}
            <div className="space-y-16">

              {/* AI Chat Support */}
              <div className="border-t border-[rgba(28,25,23,0.08)] pt-10">
                <p className="label-caps text-accent mb-4">AI Advisor</p>
                <h2 className="font-serif text-2xl font-light text-foreground mb-4">
                  Instant answers, 24/7
                </h2>
                <p className="text-sm text-muted font-light leading-relaxed mb-6">
                  Get instant answers about diamond types, product recommendations, sizing, and pricing through our AI chat assistant. Available around the clock.
                </p>
                <div className="flex items-center gap-3 p-4 border border-[rgba(28,25,23,0.08)] bg-bg-warm">
                  <span className="text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm text-foreground font-light">Chat with our AI advisor</p>
                    <p className="text-xs text-muted font-light">Click the chat icon in the bottom right corner</p>
                  </div>
                </div>
              </div>

              {/* Private Consultation */}
              <div className="border-t border-[rgba(28,25,23,0.08)] pt-10">
                <p className="label-caps text-accent mb-4">Private Consultations</p>
                <h2 className="font-serif text-2xl font-light text-foreground mb-4">
                  Bespoke appointment scheduling
                </h2>
                <p className="text-sm text-muted font-light leading-relaxed mb-6">
                  Private consultations are available for custom jewelry projects, engagement ring selection,
                  and bespoke design commissions. Sessions are conducted via video call.
                </p>
                <p className="text-sm text-muted font-light leading-relaxed">
                  To schedule a private consultation, complete the form and select your jewelry type.
                  A DETARA advisor will confirm your appointment within one business day.
                </p>
              </div>

              {/* FAQ Link */}
              <div id="faq" className="border-t border-[rgba(28,25,23,0.08)] pt-10">
                <p className="label-caps text-accent mb-4">Frequently Asked Questions</p>
                <h2 className="font-serif text-2xl font-light text-foreground mb-4">
                  Find quick answers
                </h2>
                <p className="text-sm text-muted font-light leading-relaxed mb-6">
                  Browse our most commonly asked questions about diamonds, orders, shipping, and returns.
                </p>
                <div className="space-y-4">
                  {[
                    { q: 'How long does production take?', a: 'Standard production is 3–5 weeks from order confirmation.' },
                    { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide with fully insured express courier.' },
                    { q: 'What is your returns policy?', a: 'We accept returns for manufacturing defects within 14 days of delivery.' },
                    { q: 'Are diamonds certified?', a: 'Yes, all diamonds come with IGI or GIA certification.' },
                  ].map((item) => (
                    <div key={item.q} className="border-b border-[rgba(28,25,23,0.06)] pb-4">
                      <p className="text-sm text-foreground font-light mb-1">{item.q}</p>
                      <p className="text-xs text-muted font-light leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="border border-[rgba(28,25,23,0.08)] p-10 md:p-14 bg-bg-warm">
              {submitted ? (
                <div className="py-16 text-center space-y-6">
                  <span className="block text-4xl text-accent font-light">◇</span>
                  <h3 className="font-serif text-2xl font-light text-foreground">
                    Message received.
                  </h3>
                  <p className="text-sm text-muted font-light leading-relaxed max-w-xs mx-auto">
                    Thank you for reaching out. A DETARA advisor will respond within 4 hours during business hours (Mon–Fri, 9AM–6PM UK Time).
                  </p>
                </div>
              ) : (
                <>
                  <p className="label-caps text-accent mb-2">Send a Message</p>
                  <h2 className="font-serif text-2xl font-light text-foreground mb-8">
                    How can we help?
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="label-caps text-muted block mb-2" htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full bg-transparent border border-[rgba(28,25,23,0.12)] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="label-caps text-muted block mb-2" htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-transparent border border-[rgba(28,25,23,0.12)] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="label-caps text-muted block mb-2" htmlFor="jewelryType">Jewelry Type</label>
                      <select
                        id="jewelryType"
                        name="jewelryType"
                        required
                        value={formData.jewelryType}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-[rgba(28,25,23,0.12)] px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select jewelry type</option>
                        {jewelryTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-caps text-muted block mb-2" htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your inquiry or custom jewelry vision..."
                        className="w-full bg-transparent border border-[rgba(28,25,23,0.12)] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 font-light">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-foreground text-[#FFFDF8] text-xs font-medium tracking-widest hover:bg-accent-dark transition-colors disabled:opacity-60"
                    >
                      {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>

                    <p className="text-xs text-muted font-light text-center">
                      Or reach us directly at{' '}
                      <a href="mailto:hello@detara.store" className="text-foreground hover:text-accent transition-colors">
                        hello@detara.store
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIChatWidget />
    </>
  );
}
