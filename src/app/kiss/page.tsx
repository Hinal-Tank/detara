'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { productService, SupabaseProduct } from '@/lib/supabase/productService';

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Smooth scroll helper ─── */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ─── Diamond Standard Card ─── */
interface StandardCardProps {
  label: string;
  value: string;
  delay: string;
}
function StandardCard({ label, value, delay }: StandardCardProps) {
  return (
    <div className={`reveal-item ${delay} border border-[rgba(28,25,23,0.08)] p-8 bg-[#FFFDF8] hover:border-[rgba(201,169,110,0.4)] transition-all duration-500 group`}>
      <p className="label-caps text-[#B9924A] mb-4 tracking-[0.35em]">{label}</p>
      <p className="font-serif text-2xl font-light text-[#211B18] group-hover:text-[#A8864A] transition-colors duration-300">{value}</p>
    </div>);
}

/* ─── Product Data ─── */
interface KissProduct {
  id: number;
  name: string;
  slug: string;
  nokPrice: number;
  category: 'engagement-rings' | 'stud-earrings' | 'bracelets' | 'necklaces' | 'bands';
  origin: 'natural' | 'lab-grown' | 'both';
  metals: string[];
  imageSrc: string;
  imageAlt: string;
}

// Map DB category names to filter keys
function dbCategoryToFilter(cat: string): KissProduct['category'] {
  if (cat === 'Engagement Rings') return 'engagement-rings';
  if (cat === 'Diamond Stud Earrings') return 'stud-earrings';
  if (cat === 'Tennis Bracelets') return 'bracelets';
  if (cat === 'Diamond Bands') return 'bands';
  if (cat === 'Diamond Pendants') return 'necklaces';
  return 'necklaces';
}

function supabaseToKiss(p: SupabaseProduct): KissProduct {
  return {
    id: typeof p.id === 'number' ? p.id : parseInt(p.id, 10) || 0,
    name: p.name,
    slug: p.slug || p.id,
    nokPrice: p.price,
    category: dbCategoryToFilter(p.category),
    origin: 'both' as const,
    metals: ['white-gold', 'yellow-gold', 'rose-gold', 'platinum'],
    imageSrc: p.image || '',
    imageAlt: `${p.name} — ${p.category} — DETARA KISS Collection`
  };
}

/* ─── Product Card ─── */
interface ProductCardProps {
  product: KissProduct;
}
function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-[#F3EEE5] aspect-[3/4] mb-5 flex flex-col items-center justify-center gap-2">
        {product.imageSrc ?
        <AppImage
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy" /> :

        <>
            <div className="w-10 h-10 border border-[rgba(28,25,23,0.12)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#B9924A" strokeWidth="1" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="label-caps text-[#B9924A] text-[8px] tracking-[0.2em]">{product.id}</span>
          </>
        }
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem({
              id: product.id,
              name: product.name,
              spec: 'VVS · D–G · Excellent',
              metal: product.metals[0],
              price: formatPrice(product.nokPrice),
              img: product.imageSrc,
              alt: product.imageAlt,
              slug: product.slug
            });
          }}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#B9924A' : 'none'} stroke={wishlisted ? '#B9924A' : '#211B18'} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#211B18]/0 group-hover:bg-[#211B18]/5 transition-all duration-500" />
      </div>
      <div className="px-1">
        <p className="label-caps text-[#B9924A] text-[8px] mb-1 tracking-[0.2em]">{product.category.replace(/-/g, ' ').toUpperCase()}</p>
        <p className="text-[#211B18] text-sm font-medium tracking-wide mb-1 group-hover:text-[#A8864A] transition-colors duration-300">{product.name}</p>
        <p className="text-[#766C63] text-xs font-light mb-3">VVS · D–G · Excellent Cut</p>
        <p className="text-[#211B18] text-sm font-light">From {formatPrice(product.nokPrice)}</p>
        <div className="mt-4">
          <span className="inline-block border border-[#211B18] text-[#211B18] text-xs tracking-[0.2em] px-4 py-2 min-h-[36px] group-hover:bg-[#211B18] group-hover:text-white transition-all duration-300">
            VIEW PRODUCT
          </span>
        </div>
      </div>
    </Link>);
}

/* ─── Filter Types ─── */
type CategoryFilter = 'all' | 'engagement-rings' | 'stud-earrings' | 'bracelets' | 'necklaces' | 'bands';
type OriginFilter = 'all' | 'natural' | 'lab-grown';
type MetalFilter = 'all' | 'white-gold' | 'yellow-gold' | 'rose-gold' | 'platinum';

/* ─── Main Page ─── */
export default function KissPage() {
  useReveal();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('all');
  const [metalFilter, setMetalFilter] = useState<MetalFilter>('all');
  const [allProducts, setAllProducts] = useState<KissProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await productService.getAll();
      setAllProducts(data.map(supabaseToKiss));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter((p) => {
    const catMatch = categoryFilter === 'all' || p.category === categoryFilter;
    const originMatch = originFilter === 'all' || p.origin === 'both' || p.origin === originFilter;
    const metalMatch = metalFilter === 'all' || p.metals.includes(metalFilter);
    return catMatch && originMatch && metalMatch;
  });

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main className="bg-[#FFFDF8]">

        {/* ══════════════════════════════════════════
                                    SECTION 1 — HERO
                                 ══════════════════════════════════════════ */}
        <section className="relative w-full min-h-screen overflow-hidden bg-[#211B18] flex items-end">
          <div className="absolute inset-0">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1bb85d85b-1785148772690.png"
              alt="Close-up of a brilliant-cut diamond solitaire engagement ring on a white marble surface — DETARA KISS editorial"
              fill
              priority
              className="object-cover object-center opacity-55"
              sizes="100vw" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#211B18]/20 via-[#211B18]/10 to-[#211B18]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#211B18]/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 md:px-8 lg:px-20 pb-16 md:pb-20 lg:pb-24 pt-44 md:pt-56 lg:pt-64">
            <div className="max-w-3xl">
              <p className="label-caps text-[#B9924A] mb-6 md:mb-8 lg:mb-10 tracking-[0.45em] reveal-item">
                DETARA · KISS Collection
              </p>
              <h1 className="heading-display text-[clamp(3rem,7vw,7.5rem)] text-white font-light mb-6 md:mb-7 lg:mb-8 leading-[0.88]">
                DETARA<br />
                <span className="italic opacity-80">KISS</span>
              </h1>
              <p className="font-serif text-[clamp(1rem,1.8vw,1.5rem)] text-white/70 font-light mb-5 md:mb-6 leading-relaxed max-w-xl reveal-item delay-1">
                Keep It Simple. Keep It Brilliant.
              </p>
              <div className="w-16 h-[1px] bg-[#B9924A] opacity-60 mb-6 md:mb-7 lg:mb-8 reveal-item delay-2" />
              <p className="text-sm text-white/55 font-light leading-relaxed max-w-lg mb-10 md:mb-12 lg:mb-14 reveal-item delay-2">
                A curated diamond jewelry collection designed to remove complexity while maintaining exceptional quality and elegance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 reveal-item delay-3">
                <button
                  onClick={() => scrollTo('collection')}
                  className="btn-gold inline-block text-center min-h-[52px] flex items-center justify-center">
                  Explore Engagement Rings
                </button>
                <button
                  onClick={() => scrollTo('collection')}
                  className="btn-outline-light inline-block text-center min-h-[52px] flex items-center justify-center border border-white/40 text-white/80 px-8 py-4 text-xs tracking-[0.25em] hover:border-white hover:text-white transition-all duration-300">
                  Explore Diamond Studs
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 right-8 md:right-12 z-10 flex flex-col items-center gap-3">
            <span className="label-caps text-white/35 tracking-[0.4em]" style={{ writingMode: 'vertical-rl' }}>
              Scroll
            </span>
            <div className="w-[1px] h-12 bg-white/15 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-[#B9924A]" style={{ animation: 'scrollLine 2s ease-in-out infinite', height: '100%' }} />
            </div>
          </div>
          <style>{`@keyframes scrollLine { 0% { transform: translateY(-100%); opacity: 1; } 100% { transform: translateY(100%); opacity: 0; } }`}</style>
        </section>

        {/* ══════════════════════════════════════════
                                    SECTION 2 — PHILOSOPHY
                                 ══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 lg:py-28 px-5 md:px-8 lg:px-20 bg-[#FFFDF8]">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.6fr] gap-10 md:gap-14 lg:gap-20 items-start">
              <div className="md:sticky md:top-32">
                <p className="label-caps text-[#B9924A] mb-6 md:mb-7 lg:mb-8 tracking-[0.35em] reveal-item">Philosophy</p>
                <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,3.2rem)] text-[#211B18] font-light leading-tight reveal-item delay-1">
                  The Philosophy<br />Behind<br />
                  <span className="italic">DETARA KISS</span>
                </h2>
                <div className="w-12 h-[1px] bg-[#B9924A] opacity-50 mt-6 md:mt-8 reveal-item delay-2" />
              </div>
              <div className="space-y-6 md:space-y-8">
                <p className="text-base md:text-[1.05rem] text-[#211B18] font-light leading-[1.85] reveal-item">
                  DETARA KISS is built on a simple idea: luxury should not be complicated.
                </p>
                <p className="text-base md:text-[1.05rem] text-[#766C63] font-light leading-[1.85] reveal-item delay-1">
                  Traditional diamond shopping often involves hundreds of technical choices — clarity grades, color variations, diamond cuts, and pricing differences. This complexity can overwhelm even experienced buyers.
                </p>
                <p className="text-base md:text-[1.05rem] text-[#766C63] font-light leading-[1.85] reveal-item delay-2">
                  The KISS collection removes this complexity by offering a carefully curated selection of timeless diamond jewelry pieces with standardized quality. Instead of navigating endless options, clients can focus on what truly matters: elegance, beauty, and meaning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-20">
          <div className="gold-line opacity-30" />
        </div>

        {/* ══════════════════════════════════════════
                                    SECTION 3 — DIAMOND STANDARDS
                                 ══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 lg:py-28 px-5 md:px-8 lg:px-20 bg-[#FFFDF8]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 md:mb-14 lg:mb-20">
              <p className="label-caps text-[#B9924A] mb-5 md:mb-6 tracking-[0.35em] reveal-item">Standards</p>
              <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,3.2rem)] text-[#211B18] font-light mb-6 md:mb-8 reveal-item delay-1">
                Consistent Diamond Excellence
              </h2>
              <p className="text-sm md:text-[1rem] text-[#766C63] font-light leading-relaxed max-w-2xl mx-auto reveal-item delay-2">
                Every DETARA KISS piece follows a strict diamond quality standard to ensure brilliance and clarity while keeping pricing transparent.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
              <StandardCard label="Clarity" value="VVS Minimum" delay="delay-1" />
              <StandardCard label="Color" value="F – G Range" delay="delay-2" />
              <StandardCard label="Cut" value="Excellent Precision" delay="delay-3" />
              <StandardCard label="Certification" value="Gemological Grading" delay="delay-4" />
            </div>

            <div className="max-w-3xl mx-auto text-center reveal-item">
              <div className="w-8 h-[1px] bg-[#B9924A] opacity-50 mx-auto mb-8" />
              <p className="text-sm text-[#766C63] font-light leading-relaxed">
                By maintaining these standards across the collection, DETARA ensures that every piece delivers exceptional brilliance and luxury without unnecessary complexity.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
                                    SECTION 4 — DIAMOND ORIGIN
                                 ══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 lg:py-28 px-5 md:px-8 lg:px-20 bg-[#F3EEE5]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 md:mb-14 lg:mb-20">
              <p className="label-caps text-[#B9924A] mb-5 md:mb-6 tracking-[0.35em] reveal-item">Origin</p>
              <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,3.2rem)] text-[#211B18] font-light mb-6 md:mb-8 reveal-item delay-1">
                Choose Your Diamond Origin
              </h2>
              <p className="text-sm md:text-[1rem] text-[#766C63] font-light leading-relaxed max-w-2xl mx-auto reveal-item delay-2">
                DETARA KISS offers two clear options for diamond origin while maintaining the same visual brilliance and quality standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {/* Natural */}
              <Link href="/products?origin=natural" className="reveal-item delay-1 bg-[#211B18] p-12 md:p-14 relative overflow-hidden group block">
                <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-[#B9924A]/20" />
                <p className="label-caps text-[#B9924A] mb-6 tracking-[0.35em]">Natural Diamonds</p>
                <h3 className="font-serif text-[1.8rem] font-light text-white mb-6 leading-tight">
                  Billions of Years<br />
                  <span className="italic opacity-70">in the Making</span>
                </h3>
                <div className="w-10 h-[1px] bg-[#B9924A] opacity-40 mb-6" />
                <p className="text-sm text-white/60 font-light leading-relaxed mb-8">
                  Formed over billions of years within the Earth, natural diamonds carry a heritage of rarity and tradition that many clients value.
                </p>
                <span className="label-caps text-[#B9924A] tracking-[0.3em] group-hover:text-white transition-colors duration-300 inline-flex items-center gap-3">
                  Explore Natural →
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B9924A]/30 to-transparent" />
              </Link>

              {/* Lab-grown */}
              <Link href="/products?origin=lab-grown" className="reveal-item delay-2 bg-[#FFFDF8] border border-[rgba(28,25,23,0.08)] p-12 md:p-14 relative overflow-hidden group hover:border-[rgba(201,169,110,0.3)] transition-colors duration-500 block">
                <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-[#B9924A]/15" />
                <p className="label-caps text-[#B9924A] mb-6 tracking-[0.35em]">Lab-Grown Diamonds</p>
                <h3 className="font-serif text-[1.8rem] font-light text-[#211B18] mb-6 leading-tight">
                  Advanced Science,<br />
                  <span className="italic text-[#766C63]">Same Brilliance</span>
                </h3>
                <div className="w-10 h-[1px] bg-[#B9924A] opacity-40 mb-6" />
                <p className="text-sm text-[#766C63] font-light leading-relaxed mb-8">
                  Produced using advanced technology that replicates the natural diamond creation process, lab-grown diamonds offer the same optical beauty and durability.
                </p>
                <span className="label-caps text-[#211B18] tracking-[0.3em] group-hover:text-[#B9924A] transition-colors duration-300 inline-flex items-center gap-3">
                  Explore Lab-Grown →
                </span>
              </Link>
            </div>

            <div className="text-center reveal-item">
              <p className="label-caps text-[#766C63] tracking-[0.3em]">
                Both options meet the same clarity and color standards within the DETARA KISS collection.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
                                    SECTION 5 — PRODUCT GRID
                                 ══════════════════════════════════════════ */}
        <section id="collection" className="py-16 md:py-24 lg:py-28 px-5 md:px-8 lg:px-20 bg-[#FFFDF8]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-14 md:mb-16">
              <p className="label-caps text-[#B9924A] mb-6 tracking-[0.35em] reveal-item">Collection</p>
              <h2 className="heading-serif text-[clamp(2rem,4vw,3.2rem)] text-[#211B18] font-light mb-6 reveal-item delay-1">
                The DETARA KISS Collection
              </h2>
              <p className="text-[1rem] text-[#766C63] font-light leading-relaxed max-w-2xl mx-auto reveal-item delay-2">
                Timeless diamond jewelry with standardized quality — designed for those who value elegance over complexity.
              </p>
            </div>

            {/* ── Filters ── */}
            <div className="mb-12 reveal-item delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {/* TYPE */}
              <div>
                <span className="label-caps text-[#766C63] tracking-[0.3em] text-[10px] block mb-2">TYPE</span>
                <div className="flex flex-wrap" style={{ gap: '12px' }}>
                  {([
                  { value: 'all', label: 'All' },
                  { value: 'engagement-rings', label: 'Engagement Rings' },
                  { value: 'stud-earrings', label: 'Stud Earrings' },
                  { value: 'bracelets', label: 'Tennis Bracelets' },
                  { value: 'bands', label: 'Diamond Bands' },
                  { value: 'necklaces', label: 'Diamond Pendants' }] as
                  {value: CategoryFilter;label: string;}[]).map((f) =>
                  <button
                    key={f.value}
                    onClick={() => setCategoryFilter(f.value)}
                    style={{
                      height: '40px',
                      paddingLeft: '18px',
                      paddingRight: '18px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      border: categoryFilter === f.value ? '1px solid #1A1A1A' : '1px solid rgba(28,25,23,0.2)',
                      background: categoryFilter === f.value ? '#1A1A1A' : '#ffffff',
                      color: categoryFilter === f.value ? '#ffffff' : '#766C63',
                      cursor: 'pointer'
                    }}>
                    
                    {f.label}
                  </button>
                  )}
                </div>
              </div>

              {/* ORIGIN */}
              <div>
                <span className="label-caps text-[#766C63] tracking-[0.3em] text-[10px] block mb-2">ORIGIN</span>
                <div className="flex flex-wrap" style={{ gap: '12px' }}>
                  {([
                  { value: 'all', label: 'All' },
                  { value: 'natural', label: 'Natural' },
                  { value: 'lab-grown', label: 'Lab-Grown' }] as
                  {value: OriginFilter;label: string;}[]).map((f) =>
                  <button
                    key={f.value}
                    onClick={() => setOriginFilter(f.value)}
                    style={{
                      height: '40px',
                      paddingLeft: '18px',
                      paddingRight: '18px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      border: originFilter === f.value ? '1px solid #1A1A1A' : '1px solid rgba(28,25,23,0.2)',
                      background: originFilter === f.value ? '#1A1A1A' : '#ffffff',
                      color: originFilter === f.value ? '#ffffff' : '#766C63',
                      cursor: 'pointer'
                    }}>
                    
                    {f.label}
                  </button>
                  )}
                </div>
              </div>

              {/* METAL */}
              <div>
                <span className="label-caps text-[#766C63] tracking-[0.3em] text-[10px] block mb-2">METAL</span>
                <div className="flex flex-wrap" style={{ gap: '12px' }}>
                  {([
                  { value: 'all', label: 'All' },
                  { value: 'white-gold', label: 'White Gold' },
                  { value: 'yellow-gold', label: 'Yellow Gold' },
                  { value: 'rose-gold', label: 'Rose Gold' },
                  { value: 'platinum', label: 'Platinum' }] as
                  {value: MetalFilter;label: string;}[]).map((f) =>
                  <button
                    key={f.value}
                    onClick={() => setMetalFilter(f.value)}
                    style={{
                      height: '40px',
                      paddingLeft: '18px',
                      paddingRight: '18px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      letterSpacing: '0.15em',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                      border: metalFilter === f.value ? '1px solid #1A1A1A' : '1px solid rgba(28,25,23,0.2)',
                      background: metalFilter === f.value ? '#1A1A1A' : '#ffffff',
                      color: metalFilter === f.value ? '#ffffff' : '#766C63',
                      cursor: 'pointer'
                    }}>
                    
                    {f.label}
                  </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Product Grid ── */}
            {loading ?
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) =>
              <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-[#F3EEE5] mb-5" />
                    <div className="h-3 bg-[#F3EEE5] mb-2 w-3/4" />
                    <div className="h-3 bg-[#F3EEE5] w-1/2" />
                  </div>
              )}
              </div> :
            filteredProducts.length > 0 ?
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((product) =>
              <ProductCard key={product.id} product={product} />
              )}
              </div> :

            <div className="text-center py-24">
                <p className="text-[#766C63] font-light text-sm">No products match the selected filters.</p>
                <button
                onClick={() => {setCategoryFilter('all');setOriginFilter('all');setMetalFilter('all');}}
                className="mt-6 label-caps text-[#B9924A] tracking-[0.3em] hover:text-[#211B18] transition-colors duration-300">
                
                  Clear Filters
                </button>
              </div>
            }
          </div>
        </section>

        {/* ══════════════════════════════════════════
                                    SECTION 6 — BUYING EXPERIENCE
                                 ══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 lg:py-28 px-5 md:px-8 lg:px-20 bg-[#F3EEE5]">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">
              <div>
                <p className="label-caps text-[#B9924A] mb-8 tracking-[0.35em] reveal-item">Process</p>
                <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,3.2rem)] text-[#211B18] font-light mb-8 leading-tight reveal-item delay-1">
                  A Curated<br />
                  <span className="italic">Buying Experience</span>
                </h2>
                <p className="text-sm text-[#766C63] font-light leading-relaxed mb-12 reveal-item delay-2">
                  DETARA KISS simplifies the buying process by eliminating overwhelming options. Customers only choose between a few essential preferences.
                </p>

                <div className="space-y-6 mb-12">
                  {[
                  { num: '01', label: 'Diamond Origin', detail: 'Natural or Lab-Grown' },
                  { num: '02', label: 'Metal Type', detail: 'White Gold · Yellow Gold · Rose Gold · Platinum' },
                  { num: '03', label: 'Size & Dimensions', detail: 'Depending on jewelry type' }].
                  map((item, i) =>
                  <div key={i} className={`reveal-item delay-${i + 1} flex items-start gap-6 border-b border-[rgba(28,25,23,0.06)] pb-6`}>
                      <span className="label-caps text-[#B9924A] tracking-[0.3em] mt-1 shrink-0">{item.num}</span>
                      <div>
                        <p className="text-[#211B18] font-medium text-sm mb-1">{item.label}</p>
                        <p className="text-[#766C63] text-sm font-light">{item.detail}</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#766C63] font-light italic font-serif text-base leading-relaxed reveal-item">
                  Everything else is already curated for exceptional quality.
                </p>
              </div>

              <div className="reveal-item delay-2">
                <div className="img-hover-zoom aspect-[4/5] overflow-hidden bg-[#EAE2D8]">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_1359c56a0-1766869195537.png"
                    alt="Elegant diamond jewelry selection laid out on white marble — DETARA KISS curated collection"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    loading="lazy" />
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
                                    SECTION 7 — CROSS PROMOTION
                                 ══════════════════════════════════════════ */}
        <section className="py-16 md:py-24 lg:py-28 px-5 md:px-8 lg:px-20 bg-[#211B18]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12 md:mb-14 lg:mb-20">
              <p className="label-caps text-[#B9924A] mb-5 md:mb-6 tracking-[0.35em] reveal-item">Brand</p>
              <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,3.2rem)] text-white font-light mb-6 reveal-item delay-1">
                Two Ways to Experience DETARA
              </h2>
              <p className="text-sm text-white/50 font-light leading-relaxed max-w-xl mx-auto reveal-item delay-2">
                DETARA is built on two complementary jewelry experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {/* KISS */}
              <div className="reveal-item delay-1 border border-[#B9924A]/25 p-12 md:p-14 relative group hover:border-[#B9924A]/50 transition-colors duration-500">
                <div className="absolute top-6 right-6">
                  <span className="label-caps text-[#B9924A]/40 tracking-[0.4em]">01</span>
                </div>
                <p className="label-caps text-[#B9924A] mb-6 tracking-[0.35em]">DETARA KISS</p>
                <h3 className="font-serif text-[2rem] font-light text-white mb-6 leading-tight">
                  Curated Simplicity
                </h3>
                <div className="w-10 h-[1px] bg-[#B9924A] opacity-30 mb-6" />
                <p className="text-sm text-white/55 font-light leading-relaxed mb-8">
                  A curated jewelry collection with standardized diamond quality and timeless designs — designed for simplicity and elegance.
                </p>
                <Link
                  href="/kiss"
                  className="inline-block border border-[#B9924A] text-[#B9924A] text-xs tracking-[0.25em] px-8 py-4 min-h-[48px] hover:bg-[#B9924A] hover:text-[#211B18] transition-all duration-300">
                  
                  EXPLORE KISS
                </Link>
              </div>

              {/* CUSTOM */}
              <div className="reveal-item delay-2 border border-white/10 p-12 md:p-14 relative group hover:border-white/20 transition-colors duration-500">
                <div className="absolute top-6 right-6">
                  <span className="label-caps text-white/20 tracking-[0.4em]">02</span>
                </div>
                <p className="label-caps text-white/40 mb-6 tracking-[0.35em]">DETARA CUSTOM</p>
                <h3 className="font-serif text-[2rem] font-light text-white mb-6 leading-tight">
                  Bespoke Creation
                </h3>
                <div className="w-10 h-[1px] bg-white/20 mb-6" />
                <p className="text-sm text-white/55 font-light leading-relaxed mb-8">
                  A bespoke service where clients create personalized jewelry with custom designs, metals, and diamond specifications — maintaining a minimum quality of VVS2 clarity.
                </p>
                <Link
                  href="/custom-jewelry"
                  className="inline-block border border-white/30 text-white/70 text-xs tracking-[0.25em] px-8 py-4 min-h-[48px] hover:border-white hover:text-white transition-all duration-300">
                  
                  CREATE CUSTOM JEWELRY
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
                                    SECTION 8 — FINAL CTA
                                 ══════════════════════════════════════════ */}
        <section className="relative py-40 md:py-48 px-5 md:px-8 lg:px-20 overflow-hidden bg-[#FFFDF8]">
          <div className="absolute inset-0">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1bc808c66-1772227832361.png"
              alt="Diamond engagement ring with dramatic studio lighting against dark background — DETARA luxury editorial"
              fill
              className="object-cover object-center opacity-10"
              sizes="100vw"
              loading="lazy" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8]/60 via-transparent to-[#FFFDF8]/60" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto text-center">
            <p className="label-caps text-[#B9924A] mb-8 tracking-[0.45em] reveal-item">Begin</p>
            <h2 className="heading-display text-[clamp(2.5rem,6vw,5.5rem)] text-[#211B18] font-light mb-10 leading-[0.9] reveal-item delay-1">
              Discover the Simplicity<br />
              <span className="italic opacity-70">of Diamond Luxury</span>
            </h2>
            <div className="w-16 h-[1px] bg-[#B9924A] opacity-40 mx-auto mb-12 reveal-item delay-2" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-item delay-3">
              <button
                onClick={() => scrollTo('collection')}
                className="btn-primary inline-block min-h-[52px] flex items-center justify-center">
                
                Explore DETARA KISS
              </button>
              <Link href="/custom-jewelry" className="btn-outline inline-block min-h-[52px] flex items-center justify-center">
                Create Your Custom Piece
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>);
}