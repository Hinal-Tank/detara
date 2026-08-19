'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency, CURRENCIES, type Currency } from '@/context/CurrencyContext';
import CartDrawer from '@/components/CartDrawer';

const navLinks = [
  { label: 'KISS Collection', href: '/kiss' },
  { label: 'Rings', href: '/products?category_id=11111111-0001-0001-0001-000000000001' },
  { label: 'Earrings', href: '/products?category_id=11111111-0001-0001-0001-000000000002' },
  { label: 'Necklaces & Pendants', href: '/products?category_id=11111111-0001-0001-0001-000000000003' },
  { label: 'Bracelets', href: '/products?category_id=11111111-0001-0001-0001-000000000004' },
  { label: 'Custom Jewelry', href: '/custom-jewelry' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

// Mobile nav categories with icons
const mobileNavSections = [
  {
    label: 'Collections',
    items: [
      { label: 'KISS Collection', href: '/kiss', sub: 'Minimal everyday elegance' },
      { label: 'All Products', href: '/products', sub: '200 diamond jewellery pieces' },
    ],
  },
  {
    label: 'Shop',
    items: [
      { label: 'Rings',                href: '/products?category_id=11111111-0001-0001-0001-000000000001', sub: 'Solitaires, halos & bands' },
      { label: 'Earrings',             href: '/products?category_id=11111111-0001-0001-0001-000000000002', sub: 'Studs, drops & hoops' },
      { label: 'Necklaces & Pendants', href: '/products?category_id=11111111-0001-0001-0001-000000000003', sub: 'Pendants & necklaces' },
      { label: 'Bracelets',            href: '/products?category_id=11111111-0001-0001-0001-000000000004', sub: 'Tennis & diamond bracelets' },
      { label: "Men\'s Jewellery",      href: '/products?category_id=11111111-0001-0001-0001-000000000005', sub: 'Rings, chains & cufflinks' },
      { label: 'Gemstone Jewellery',   href: '/products?category_id=11111111-0001-0001-0001-000000000006', sub: 'Sapphire, ruby & emerald' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Custom Jewelry', href: '/custom-jewelry', sub: 'Design your own piece' },
      { label: 'Diamond Guide', href: '/diamond-guide', sub: 'Learn about diamonds' },
      { label: 'Ring Size Guide', href: '/ring-size-guide', sub: 'Find your perfect fit' },
      { label: 'Jewellery Care', href: '/care-guide', sub: 'Care & maintenance' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About DETARA', href: '/about', sub: 'Our story & values' },
      { label: 'Journal', href: '/journal', sub: 'Insights & stories' },
      { label: 'Contact', href: '/contact', sub: 'Get in touch' },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('Collections');

  const { totalItems, setDrawerOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { currency, setCurrency } = useCurrency();

  const currentCurrencyLabel = CURRENCIES.find((c) => c.code === currency)?.label || 'NOK kr';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!currencyOpen) return;
    const handler = () => setCurrencyOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [currencyOpen]);

  return (
    <div suppressHydrationWarning>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 flex flex-col justify-center ${
          scrolled ? 'nav-glass' : ''
        } ${menuOpen ? 'invisible lg:visible' : 'visible'}`}
        style={{ maxWidth: '100vw' }}
        suppressHydrationWarning
      >
        {/* Main header bar */}
        <div className="h-[72px] sm:h-[84px] md:h-[96px] lg:h-[128px] xl:h-[140px] flex items-center" suppressHydrationWarning>
          <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-5 md:px-8 relative flex md:grid md:grid-cols-[1fr_auto_1fr] items-center overflow-visible" suppressHydrationWarning>

            {/* LEFT — hamburger (mobile) or nav (desktop) */}
            <div className="flex items-center z-10">
              {/* Mobile hamburger — 48px touch target */}
              <button
                className="lg:hidden flex flex-col justify-center gap-[5px] p-3 -ml-2 w-[48px] h-[48px] flex-shrink-0 tap-transparent"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Open menu"
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block w-6 h-[1.5px] bg-foreground" />
                <span className="block w-4 h-[1.5px] bg-foreground" />
                <span className="block w-6 h-[1.5px] bg-foreground" />
              </button>

              {/* Desktop left nav */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                {navLinks.slice(0, 4).map((link) => (
                  <Link key={link.label} href={link.href} className="label-caps text-muted hover:text-foreground transition-colors whitespace-nowrap" style={{ fontSize: '9.5px', letterSpacing: '0.18em' }}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* CENTER — Logo (single source of truth: src/lib/brand.ts) */}
            <div className="flex-1 flex justify-center items-center md:flex-none md:justify-center">
              <BrandLogo
                priority
                heightClass="h-[64px] sm:h-[72px] md:h-[76px] lg:h-[108px] xl:h-[120px]"
              />
            </div>

            {/* RIGHT — icons + right nav */}
            <div className="flex items-center justify-end gap-0 sm:gap-0.5 ml-auto md:ml-0 z-10">
              {/* Desktop right nav */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mr-4">
                {navLinks.slice(4, 8).map((link) => (
                  <Link key={link.label} href={link.href} className="label-caps text-muted hover:text-foreground transition-colors whitespace-nowrap" style={{ fontSize: '9.5px', letterSpacing: '0.18em' }}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Currency selector — hidden on small mobile */}
              <div className="relative hidden sm:block md:hidden lg:block" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 label-caps text-muted hover:text-foreground transition-colors min-h-[44px]"
                  style={{ fontSize: '9px', touchAction: 'manipulation' }}
                  aria-label="Select currency"
                >
                  <span className="hidden md:inline">{currentCurrencyLabel}</span>
                  <span className="md:hidden">{currency}</span>
                  <svg viewBox="0 0 12 12" fill="none" className="w-2 h-2 flex-shrink-0" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-1 border border-[rgba(28,25,23,0.12)] shadow-xl z-[300] min-w-[132px] py-1"
                    style={{ backgroundColor: '#F6F1E8', overflow: 'visible' }}>
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c.code as Currency); setCurrencyOpen(false); }}
                        className={`w-full px-3 py-3 text-left label-caps hover:bg-bg-warm transition-colors min-h-[44px] ${
                          currency === c.code ? 'text-foreground' : 'text-muted'
                        }`}
                        style={{ fontSize: '9px', touchAction: 'manipulation' }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist — hidden on mobile/tablet (in bottom nav) */}
              <Link
                href="/wishlist"
                className="relative hidden lg:flex items-center justify-center w-11 h-11 text-muted hover:text-foreground transition-colors flex-shrink-0 tap-transparent"
                aria-label="Wishlist"
                style={{ touchAction: 'manipulation' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-medium flex items-center justify-center rounded-full leading-none">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart — hidden on mobile/tablet (in bottom nav) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative hidden lg:flex items-center justify-center w-11 h-11 text-muted hover:text-foreground transition-colors flex-shrink-0 tap-transparent"
                aria-label="Cart"
                style={{ touchAction: 'manipulation' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-medium flex items-center justify-center rounded-full leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Cart — mobile/tablet only (visible, no bottom nav duplication) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative flex lg:hidden items-center justify-center w-11 h-11 text-muted hover:text-foreground transition-colors flex-shrink-0 tap-transparent"
                aria-label="Cart"
                style={{ touchAction: 'manipulation' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-medium flex items-center justify-center rounded-full leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Account — hidden on mobile/tablet (in bottom nav) */}
              <Link
                href="/account"
                className="hidden lg:flex items-center justify-center w-11 h-11 text-muted hover:text-foreground transition-colors flex-shrink-0 tap-transparent"
                aria-label="My Account"
                style={{ touchAction: 'manipulation' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet navigation bar — removed (replaced by bottom nav + full-screen menu) */}
        <div className="hidden">
          <nav className="flex items-center justify-center gap-0 px-4 w-full">
            {navLinks?.map((link) => (
              <Link
                key={link?.label}
                href={link?.href}
                className="flex-shrink-0 px-3 py-2.5 label-caps text-muted hover:text-foreground transition-colors duration-300 whitespace-nowrap border-r border-[rgba(28,25,23,0.06)] last:border-r-0 hover:bg-[rgba(28,25,23,0.02)]"
                style={{ fontSize: '8.5px', letterSpacing: '0.15em' }}
              >
                {link?.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Gold accent line */}
        <div className={`gold-line transition-opacity duration-500 ${scrolled ? 'opacity-60' : 'opacity-0'}`} />
      </header>

      {/* Mobile/Tablet slide-in menu — full screen, premium app-like */}
      <div
        className={`fixed inset-0 z-[120] flex flex-col transition-all duration-400 ease-in-out ${
          menuOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'
        } lg:hidden`}
        style={{ background: 'var(--bg)', maxWidth: '100vw', overflowX: 'hidden' }}
      >
        {/* Menu header — one close control, centered DETARA logo */}
        <div className="relative grid grid-cols-[48px_1fr_48px] items-center px-3 sm:px-5 h-[60px] sm:h-[68px] md:h-[80px] border-b border-[rgba(28,25,23,0.06)] flex-shrink-0"
          style={{ backgroundColor: '#F6F1E8' }}>
          <button
            className="flex items-center justify-center w-12 h-12 text-foreground flex-shrink-0 tap-transparent"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ touchAction: 'manipulation' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex items-center justify-center" onClick={() => setMenuOpen(false)}>
            <BrandLogo asLink={false} heightClass="h-[56px] md:h-[60px] md:h-[64px]" />
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center justify-center w-12 h-12 text-muted hover:text-foreground transition-colors tap-transparent"
            aria-label="Cart"
            style={{ touchAction: 'manipulation' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[9px] font-medium flex items-center justify-center rounded-full leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable nav content */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }}>
          {/* Accordion sections */}
          <div className="px-5 md:px-8 pt-4">
            {mobileNavSections.map((section) => (
              <div key={section.label} className="border-b border-[rgba(28,25,23,0.06)]">
                <button
                  className="w-full flex items-center justify-between py-4 md:py-5 tap-transparent"
                  onClick={() => setExpandedSection(expandedSection === section.label ? null : section.label)}
                  style={{ touchAction: 'manipulation' }}
                >
                  <span className="label-caps text-foreground tracking-[0.3em]" style={{ fontSize: '9px' }}>{section.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`w-4 h-4 text-muted transition-transform duration-300 ${expandedSection === section.label ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSection === section.label ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pb-3 space-y-0 md:grid md:grid-cols-2 md:gap-x-4">
                    {section.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between py-3.5 px-2 tap-transparent group"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <div>
                          <p className="text-sm md:text-base font-light text-foreground group-active:text-accent transition-colors">{item.label}</p>
                          <p className="text-xs text-muted font-light mt-0.5">{item.sub}</p>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-muted flex-shrink-0">
                          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="px-5 md:px-8 pt-6 pb-4">
            <p className="label-caps text-muted mb-4 tracking-[0.3em]" style={{ fontSize: '8px' }}>Quick Links</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center py-3.5 md:py-4 border border-[rgba(28,25,23,0.12)] text-xs font-light text-foreground tracking-wider uppercase tap-transparent active:bg-[rgba(28,25,23,0.04)] transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                All Products
              </Link>
              <Link
                href="/custom-jewelry"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center py-3.5 md:py-4 bg-foreground text-white text-xs font-light tracking-wider uppercase tap-transparent active:bg-accent-dark transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                Custom Design
              </Link>
              <Link
                href="/diamond-guide"
                onClick={() => setMenuOpen(false)}
                className="hidden md:flex items-center justify-center py-4 border border-[rgba(28,25,23,0.12)] text-xs font-light text-foreground tracking-wider uppercase tap-transparent active:bg-[rgba(28,25,23,0.04)] transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                Diamond Guide
              </Link>
              <Link
                href="/journal"
                onClick={() => setMenuOpen(false)}
                className="hidden md:flex items-center justify-center py-4 border border-[rgba(28,25,23,0.12)] text-xs font-light text-foreground tracking-wider uppercase tap-transparent active:bg-[rgba(28,25,23,0.04)] transition-colors"
                style={{ touchAction: 'manipulation' }}
              >
                Journal
              </Link>
            </div>
          </div>

          {/* Currency selector in menu */}
          <div className="px-5 md:px-8 py-4 border-t border-[rgba(28,25,23,0.06)]">
            <p className="label-caps text-muted mb-3 tracking-[0.3em]" style={{ fontSize: '8px' }}>Currency</p>
            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code as Currency); }}
                  className={`px-3 py-2 label-caps border transition-colors tap-transparent min-h-[44px] ${
                    currency === c.code
                      ? 'border-foreground bg-foreground text-white'
                      : 'border-[rgba(28,25,23,0.12)] text-muted'
                  }`}
                  style={{ fontSize: '9px', touchAction: 'manipulation' }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="px-5 md:px-8 py-4 border-t border-[rgba(28,25,23,0.06)]">
            <a
              href="https://wa.me/442046148575"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 tap-transparent"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-light text-foreground">WhatsApp Concierge</p>
                <p className="text-xs text-muted font-light">+44 20 4614 8575</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[110] bg-[rgba(28,25,23,0.3)] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <CartDrawer />
    </div>
  );
}
