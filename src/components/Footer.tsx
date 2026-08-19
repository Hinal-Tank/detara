'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import type { FooterConfig } from '@/lib/supabase/footerService';

// ─── Trust Strip Icons ────────────────────────────────────────────────────────
function TrustIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
          <path d="M6 3h12l4 6-10 12L2 9l4-6z" strokeLinejoin="round" />
          <path d="M2 9h20M6 3l4 6M18 3l-4 6" strokeLinejoin="round" />
        </svg>
      );
    case 'lock':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

// ─── Instagram SVG ────────────────────────────────────────────────────────────
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─── Newsletter Form ──────────────────────────────────────────────────────────
function NewsletterForm({ ctaText }: { ctaText: string }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
        .insert({ email, source: 'footer_newsletter' });
      if (dbError && dbError.code !== '23505') throw dbError;
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return <p className="text-sm text-[#B9924A] font-light py-2">◇ Thank you — you&apos;re on the list.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-0 mt-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="EMAIL ADDRESS"
          required
          className="flex-1 min-w-0 bg-transparent border border-[rgba(28,25,23,0.15)] px-3 py-2.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors tracking-wider"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2.5 bg-foreground text-[#FFFDF8] text-[10px] font-medium tracking-widest hover:bg-accent-dark transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {submitting ? '...' : ctaText}
        </button>
      </form>
      {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── Mobile Accordion Group ───────────────────────────────────────────────────
function AccordionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[rgba(28,25,23,0.08)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="label-caps text-foreground text-[11px] tracking-widest">{title}</span>
        <span className="text-muted transition-transform duration-200" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ─── Default Footer Config ────────────────────────────────────────────────────
const DEFAULT_CONFIG: FooterConfig = {
  brand: {
    name: 'DETARA',
    tagline: 'Precision-crafted diamond jewellery.',
    description: 'Natural and lab-grown diamonds, selected for brilliance and crafted with restraint.',
    logo_url: '/assets/images/file_000000004f747208abb644f0cadec060-1773483679682.png',
    is_visible: true,
  },
  shop_links: {
    title: 'SHOP',
    is_visible: true,
    links: [
      { label: 'Rings', href: '/products?category=rings' },
      { label: 'Engagement Rings', href: '/products?category=engagement-rings' },
      { label: 'Diamond Stud Earrings', href: '/products?category=diamond-stud-earrings' },
      { label: 'Earrings', href: '/products?category=earrings' },
      { label: 'Tennis Bracelets', href: '/products?category=tennis-bracelets' },
      { label: 'Bracelets', href: '/products?category=bracelets' },
      { label: 'Diamond Bands', href: '/products?category=diamond-bands' },
      { label: 'Diamond Pendants', href: '/products?category=diamond-pendants' },
      { label: 'Necklaces', href: '/products?category=necklaces' },
      { label: "Men's Jewellery", href: '/products?category=mens-jewellery' },
      { label: "Men's Cufflinks", href: '/products?category=mens-cufflinks' },
      { label: 'Custom Jewellery', href: '/custom-jewelry' },
    ],
  },
  diamond_links: {
    title: 'DIAMONDS',
    is_visible: true,
    links: [
      { label: 'Natural Diamonds', href: '/diamond-guide#natural' },
      { label: 'Lab-Grown Diamonds', href: '/diamond-guide#lab-grown' },
      { label: 'Diamond Education', href: '/diamond-guide' },
      { label: 'Diamond Guide', href: '/diamond-guide' },
      { label: 'Certification', href: '/diamond-guide#certification' },
      { label: 'Our Standards', href: '/about#standards' },
    ],
  },
  service_links: {
    title: 'SERVICES',
    is_visible: true,
    links: [
      { label: 'Custom Jewellery', href: '/custom-jewelry' },
      { label: 'Concierge', href: '/custom-jewelry#concierge' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/refund' },
      { label: 'Warranty', href: '/care-guide#warranty' },
      { label: 'Lifetime Service', href: '/care-guide#lifetime' },
      { label: 'Jewellery Care', href: '/care-guide' },
      { label: 'FAQs', href: '/contact#faq' },
    ],
  },
  company_links: {
    title: 'COMPANY',
    is_visible: true,
    links: [
      { label: 'About DETARA', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Cookie Policy', href: '/privacy#cookies' },
    ],
  },
  contact: {
    company_name: 'DETARA LTD',
    location: 'London, United Kingdom',
    email: 'hello@detara.store',
    whatsapp: '+44 20 4614 8575',
    whatsapp_link: 'https://wa.me/442046148575',
    support_hours: 'Monday–Friday',
    support_time: '9:00 AM – 6:00 PM UK Time',
    is_visible: true,
  },
  social: {
    is_visible: true,
    platforms: [
      { name: 'Instagram', href: 'https://www.instagram.com/detara.store', is_enabled: true },
      { name: 'Facebook', href: 'https://www.facebook.com/share/1Wa8vVFWJ1/', is_enabled: true },
    ],
  },
  newsletter: {
    heading: 'THE DETARA JOURNAL',
    description: 'Private access to new collections, diamond education and selected releases.',
    cta_text: 'SUBSCRIBE',
    is_visible: true,
  },
  trust_strip: {
    is_visible: true,
    items: [
      { label: 'CERTIFIED DIAMONDS', icon: 'diamond' },
      { label: 'SECURE CHECKOUT', icon: 'lock' },
      { label: 'INSURED SHIPPING', icon: 'shield' },
      { label: 'WORLDWIDE DELIVERY', icon: 'globe' },
      { label: 'LIFETIME SERVICE', icon: 'star' },
    ],
  },
  legal: {
    is_visible: true,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Cookie Policy', href: '/privacy#cookies' },
    ],
  },
};

// ─── Link Column ──────────────────────────────────────────────────────────────
function LinkColumn({ group }: { group: { title: string; is_visible: boolean; links: { label: string; href: string }[] } }) {
  if (!group.is_visible) return null;
  return (
    <div className="space-y-3">
      <p className="label-caps text-foreground text-[11px] tracking-widest">{group.title}</p>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors leading-relaxed"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer() {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_CONFIG);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    fetch('/api/footer')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setConfig({
            brand: data.brand || DEFAULT_CONFIG.brand,
            shop_links: data.shop_links || DEFAULT_CONFIG.shop_links,
            diamond_links: data.diamond_links || DEFAULT_CONFIG.diamond_links,
            service_links: data.service_links || DEFAULT_CONFIG.service_links,
            company_links: data.company_links || DEFAULT_CONFIG.company_links,
            contact: data.contact || DEFAULT_CONFIG.contact,
            social: data.social || DEFAULT_CONFIG.social,
            newsletter: data.newsletter || DEFAULT_CONFIG.newsletter,
            trust_strip: data.trust_strip || DEFAULT_CONFIG.trust_strip,
            legal: data.legal || DEFAULT_CONFIG.legal,
          });
        }
      })
      .catch(() => {});
  }, []);

  const { brand, shop_links, diamond_links, service_links, company_links, contact, social, newsletter, trust_strip, legal } = config;
  const activeSocial = social.platforms.filter((p) => p.is_enabled);

  return (
    <footer
      className="border-t border-[rgba(28,25,23,0.08)] overflow-hidden"
      style={{ background: '#EAE2D8', maxWidth: '100vw' }}
    >
      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      {trust_strip.is_visible && (
        <div className="border-b border-[rgba(28,25,23,0.06)] py-4 px-5 md:px-8">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-10">
              {trust_strip.items.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-muted">
                  <TrustIcon icon={item.icon} />
                  <span className="text-[10px] font-medium tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP / TABLET LAYOUT ─────────────────────────────────────── */}
      <div className="hidden md:block px-8 pt-14 pb-10 max-w-[1280px] mx-auto">
        {/* Main columns */}
        <div className="grid grid-cols-5 gap-8 xl:gap-12 mb-12">
          {/* Col 1 — Brand */}
          {brand.is_visible && (
            <div className="col-span-1 space-y-4">
              <Link href="/homepage">
                <AppImage
                  src={brand.logo_url}
                  alt="DETARA — Luxury Diamond Jewellery"
                  width={110}
                  height={38}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </Link>
              <p className="text-sm text-foreground font-light leading-snug">{brand.tagline}</p>
              <p className="text-xs text-muted font-light leading-relaxed">{brand.description}</p>
              {/* Contact */}
              {contact.is_visible && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[10px] text-muted font-light">{contact.company_name}</p>
                  <p className="text-[10px] text-muted font-light">{contact.location}</p>
                  <a href={`mailto:${contact.email}`} className="block text-[10px] text-muted hover:text-foreground transition-colors font-light">
                    {contact.email}
                  </a>
                  <a href={contact.whatsapp_link} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-muted hover:text-foreground transition-colors font-light">
                    WhatsApp: {contact.whatsapp}
                  </a>
                  <p className="text-[10px] text-muted font-light">{contact.support_hours}</p>
                  <p className="text-[10px] text-muted font-light">{contact.support_time}</p>
                </div>
              )}
            </div>
          )}

          {/* Col 2 — Shop */}
          <div className="col-span-1">
            <LinkColumn group={shop_links} />
          </div>

          {/* Col 3 — Diamonds */}
          <div className="col-span-1">
            <LinkColumn group={diamond_links} />
          </div>

          {/* Col 4 — Services */}
          <div className="col-span-1">
            <LinkColumn group={service_links} />
          </div>

          {/* Col 5 — Company */}
          <div className="col-span-1">
            <LinkColumn group={company_links} />
          </div>
        </div>

        {/* Newsletter + Social row */}
        <div className="grid grid-cols-2 gap-8 xl:gap-12 mb-10 pt-8 border-t border-[rgba(28,25,23,0.06)]">
          {/* Newsletter */}
          {newsletter.is_visible && (
            <div className="space-y-2">
              <p className="label-caps text-foreground text-[11px] tracking-widest">{newsletter.heading}</p>
              <p className="text-xs text-muted font-light leading-relaxed max-w-xs">{newsletter.description}</p>
              <NewsletterForm ctaText={newsletter.cta_text} />
              <p className="text-[10px] text-muted font-light pt-1">No spam. Unsubscribe anytime.</p>
            </div>
          )}

          {/* Social */}
          {social.is_visible && activeSocial.length > 0 && (
            <div className="space-y-3">
              <p className="label-caps text-foreground text-[11px] tracking-widest">FOLLOW DETARA</p>
              <div className="flex flex-col gap-2">
                {activeSocial.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted hover:text-foreground transition-colors group"
                  >
                    <span className="w-7 h-7 border border-[rgba(28,25,23,0.12)] flex items-center justify-center group-hover:border-foreground transition-colors">
                      {platform.name === 'Instagram' ? <InstagramIcon /> : <FacebookIcon />}
                    </span>
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legal bar */}
        <div className="border-t border-[rgba(28,25,23,0.06)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-muted font-light tracking-wider">
            © {year} DETARA LTD. London, United Kingdom.
          </p>
          {legal.is_visible && (
            <div className="flex flex-wrap gap-4 md:gap-6">
              {legal.links.map((link) => (
                <Link key={link.label} href={link.href} className="text-[11px] text-muted hover:text-foreground transition-colors tracking-wider">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE LAYOUT ───────────────────────────────────────────────── */}
      <div className="md:hidden px-5 pt-8 pb-10">
        {/* Brand */}
        {brand.is_visible && (
          <div className="mb-6 space-y-3">
            <Link href="/homepage">
              <AppImage
                src={brand.logo_url}
                alt="DETARA — Luxury Diamond Jewellery"
                width={100}
                height={34}
                className="object-contain opacity-80"
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-foreground font-light">{brand.tagline}</p>
            <p className="text-xs text-muted font-light leading-relaxed">{brand.description}</p>
          </div>
        )}

        {/* Accordion groups */}
        {shop_links.is_visible && (
          <AccordionGroup title={shop_links.title}>
            <ul className="space-y-2">
              {shop_links.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionGroup>
        )}

        {diamond_links.is_visible && (
          <AccordionGroup title={diamond_links.title}>
            <ul className="space-y-2">
              {diamond_links.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionGroup>
        )}

        {service_links.is_visible && (
          <AccordionGroup title={service_links.title}>
            <ul className="space-y-2">
              {service_links.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionGroup>
        )}

        {company_links.is_visible && (
          <AccordionGroup title={company_links.title}>
            <ul className="space-y-2">
              {company_links.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionGroup>
        )}

        {/* Contact */}
        {contact.is_visible && (
          <div className="py-5 border-b border-[rgba(28,25,23,0.08)] space-y-1.5">
            <p className="label-caps text-foreground text-[11px] tracking-widest mb-3">CONTACT</p>
            <p className="text-xs text-muted font-light">{contact.company_name} · {contact.location}</p>
            <a href={`mailto:${contact.email}`} className="block text-sm text-muted hover:text-foreground transition-colors">
              {contact.email}
            </a>
            <a href={contact.whatsapp_link} target="_blank" rel="noopener noreferrer" className="block text-sm text-muted hover:text-foreground transition-colors">
              WhatsApp: {contact.whatsapp}
            </a>
            <p className="text-xs text-muted font-light">{contact.support_hours} · {contact.support_time}</p>
          </div>
        )}

        {/* Newsletter */}
        {newsletter.is_visible && (
          <div className="py-5 border-b border-[rgba(28,25,23,0.08)] space-y-2">
            <p className="label-caps text-foreground text-[11px] tracking-widest">{newsletter.heading}</p>
            <p className="text-xs text-muted font-light leading-relaxed">{newsletter.description}</p>
            <NewsletterForm ctaText={newsletter.cta_text} />
          </div>
        )}

        {/* Social */}
        {social.is_visible && activeSocial.length > 0 && (
          <div className="py-5 border-b border-[rgba(28,25,23,0.08)]">
            <p className="label-caps text-foreground text-[11px] tracking-widest mb-3">FOLLOW DETARA</p>
            <div className="flex gap-3">
              {activeSocial.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <span className="w-8 h-8 border border-[rgba(28,25,23,0.12)] flex items-center justify-center">
                    {platform.name === 'Instagram' ? <InstagramIcon /> : <FacebookIcon />}
                  </span>
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Legal */}
        <div className="pt-5 space-y-3">
          <p className="text-[11px] text-muted font-light">© {year} DETARA LTD. London, United Kingdom.</p>
          {legal.is_visible && (
            <div className="flex flex-wrap gap-3">
              {legal.links.map((link) => (
                <Link key={link.label} href={link.href} className="text-[11px] text-muted hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}