'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { productService, SupabaseProduct, ProductVariant, ProductMedia, ProductReview } from '@/lib/supabase/productService';
import { METAL_OPTIONS } from '@/lib/products';
import ConciergeModal, { ConciergeType } from '@/components/ConciergeModal';
import MobileSwipeGallery from '@/components/MobileSwipeGallery';
import ProductStructuredData from '@/components/ProductStructuredData';

type CaratWeight = '0.30' | '0.50' | '0.70' | '1.00' | '1.50' | '2.00';
type MetalType = typeof METAL_OPTIONS[number];
type DiamondOrigin = 'lab' | 'natural';

const basePricesNOK: Record<CaratWeight, number> = {
  '0.30': 8500,
  '0.50': 11900,
  '0.70': 16500,
  '1.00': 24900,
  '1.50': 36900,
  '2.00': 58900,
};

const metalMultiplier: Record<string, number> = {
  '14K White Gold': 1.0,
  '14K Yellow Gold': 1.0,
  '14K Rose Gold': 1.0,
  '18K White Gold': 1.08,
  '18K Yellow Gold': 1.08,
  '18K Rose Gold': 1.08,
  'Platinum 950': 1.15,
};

// Metal swatch colors for premium visual selection
const metalSwatchColors: Record<string, { bg: string; ring: string; label: string }> = {
  '14K White Gold': { bg: '#E8E4DC', ring: '#C8C4BC', label: 'White Gold' },
  '14K Yellow Gold': { bg: '#D4A843', ring: '#B8922E', label: 'Yellow Gold' },
  '14K Rose Gold': { bg: '#D4907A', ring: '#B87A64', label: 'Rose Gold' },
  '18K White Gold': { bg: '#E8E4DC', ring: '#C8C4BC', label: 'White Gold' },
  '18K Yellow Gold': { bg: '#D4A843', ring: '#B8922E', label: 'Yellow Gold' },
  '18K Rose Gold': { bg: '#D4907A', ring: '#B87A64', label: 'Rose Gold' },
  'Platinum 950': { bg: '#D8D6D2', ring: '#B8B6B2', label: 'Platinum' },
};

const originMultiplier: Record<DiamondOrigin, number> = { lab: 0.72, natural: 1.0 };
const caratOptions: CaratWeight[] = ['0.30', '0.50', '0.70', '1.00', '1.50', '2.00'];

const diamondDetails = {
  natural: {
    type: 'Natural Diamond',
    description:
      'Natural diamonds are formed deep within the Earth over millions of years under extreme heat and pressure. Each diamond is unique, with natural inclusions and characteristics that make it rare and valuable.',
    values: [
      'Rare and limited supply',
      'Formed naturally over millions of years',
      'Traditionally holds long-term value',
    ],
    positioningLine: 'Formed by nature over millions of years, every natural diamond is one of a kind.',
  },
  lab: {
    type: 'Lab-Grown Diamond',
    description:
      'Lab-grown diamonds are created using advanced technology that replicates the natural diamond formation process. They have the same physical, chemical, and visual properties as natural diamonds.',
    values: [
      'More affordable alternative',
      'Same brilliance and appearance',
      'Modern and sustainable option',
    ],
    positioningLine: 'Engineered with precision, offering the same brilliance in a more accessible form.',
  },
};

// Expandable accordion section
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[rgba(28,25,23,0.08)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left tap-transparent"
        style={{ touchAction: 'manipulation' }}
      >
        <span className="label-caps text-foreground tracking-[0.2em]">{title}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`w-4 h-4 text-muted transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm text-muted font-light leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Lightbox component
function Lightbox({ images, activeIndex, onClose, onPrev, onNext }: {
  images: { url: string; alt: string; label: string }[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-[300] bg-[rgba(28,25,23,0.95)] flex items-center justify-center" onClick={onClose}>
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl z-10 p-2"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous image"
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl z-10 p-2"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next image"
      >
        ›
      </button>
      <div className="relative max-w-4xl max-h-[85vh] w-full mx-8" onClick={(e) => e.stopPropagation()}>
        {images[activeIndex]?.url && (
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].alt}
            width={1200}
            height={900}
            className="object-contain max-h-[85vh] w-full"
            sizes="100vw"
          />
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-white/60 text-sm font-light">{activeIndex + 1} / {images.length}</span>
        </div>
      </div>
    </div>
  );
}

// Star Rating Component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const px = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 24 24" className={px} fill={star <= rating ? '#B9924A' : 'none'} stroke={star <= rating ? '#B9924A' : '#D1CCC6'} strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [carat, setCarat] = useState<CaratWeight>('1.00');
  const [metal, setMetal] = useState<MetalType>('18K White Gold');
  const [origin, setOrigin] = useState<DiamondOrigin>('natural');
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedView, setSelectedView] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeType, setConciergeType] = useState<ConciergeType>('reservation');
  const [conciergeMode, setConciergeMode] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+4700000000');
  const [conciergeCtaPrimary, setConciergeCtaPrimary] = useState('Reserve This Piece');
  const [conciergeCtaSecondary, setConciergeCtaSecondary] = useState('Request Invoice');
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await productService.getBySlug(slug);
        setProduct(data);
        if (data) {
          const [variantsData, mediaData, reviewsData, relatedData] = await Promise.all([
            productService.getVariants(data.id),
            productService.getMedia(data.id),
            productService.getReviews(data.id),
            productService.getRelated(data.category_id || data.category, data.id, 4),
          ]);
          setVariants(variantsData);
          setMedia(mediaData);
          setReviews(reviewsData);
          setRelatedProducts(relatedData);

          // Fetch category name if category_id is set
          if (data.category_id) {
            try {
              const catRes = await fetch('/api/categories');
              if (catRes.ok) {
                const catJson = await catRes.json();
                const cat = (catJson.categories || []).find((c: any) => c.id === data.category_id);
                if (cat) setCategoryName(cat.name);
              }
            } catch { /* ignore */ }
          }
        }
      } catch (err) {
        console.warn('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  // Load concierge settings
  useEffect(() => {
    import('@/lib/supabase/conciergeService').then(({ conciergeService: cs }) => {
      cs.getConciergeSettings().then((settings) => {
        if (settings.concierge_mode_enabled !== undefined) {
          setConciergeMode(settings.concierge_mode_enabled === 'true');
        }
        if (settings.concierge_whatsapp_number) setWhatsappNumber(settings.concierge_whatsapp_number);
        if (settings.concierge_cta_primary) setConciergeCtaPrimary(settings.concierge_cta_primary);
        if (settings.concierge_cta_secondary) setConciergeCtaSecondary(settings.concierge_cta_secondary);
      });
    });
  }, []);

  const openConcierge = (type: ConciergeType) => {
    setConciergeType(type);
    setConciergeOpen(true);
  };

  // Compute price: use variant if available, else fallback to base price calculation
  const computedPrice = (() => {
    if (variants.length > 0) {
      const match = variants.find(
        (v) =>
          v.diamond_type.toLowerCase() === (origin === 'natural' ? 'natural' : 'lab-grown') &&
          v.carat === carat
      );
      if (match) return match.price;
    }
    return Math.round(
      basePricesNOK[carat] * (metalMultiplier[metal] ?? 1.0) * originMultiplier[origin]
    );
  })();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [product]);

  // Sticky Add to Cart: show when main buttons scroll out of view
  useEffect(() => {
    const handleScroll = () => {
      const mainButtons = document.getElementById('product-main-buttons');
      if (!mainButtons) return;
      const rect = mainButtons.getBoundingClientRect();
      setStickyBarVisible(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bg pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-serif text-lg font-light text-muted">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bg pt-32 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-2xl font-light text-muted mb-6">Product not found.</p>
            <Link href="/products" className="btn-primary inline-block">Back to Collection</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const metalOptions = product.metal_options?.length ? product.metal_options : METAL_OPTIONS;

  // Build gallery: use all Supabase media if available, else fallback to product image
  const galleryImages: { url: string; alt: string; label: string }[] = media.length >= 1
    ? media.map((m, i) => ({
        url: m.url,
        alt: m.alt_text || `${product.name} — View ${i + 1} — DETARA`,
        label: (m as any).label || `View ${i + 1}`,
      }))
    : [
        { url: product.image || '', alt: `${product.name} — DETARA`, label: 'Front' },
      ];

  // Find video if any
  const videoMedia = media.find((m) => m.media_type === 'video');

  const currentDiamondDetails = diamondDetails[origin];

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${carat}-${metal}-${origin}`,
      name: product.name,
      shape: product.category,
      carat: `${carat} ct`,
      metal,
      origin: origin === 'lab' ? 'Lab-Grown' : 'Natural',
      price: computedPrice,
      img: product.image || '',
      alt: `${product.name} — ${product.category}`,
      slug: product.slug || product.id,
      productId: product.id,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    addItem({
      id: `${product.id}-${carat}-${metal}-${origin}`,
      name: product.name,
      shape: product.category,
      carat: `${carat} ct`,
      metal,
      origin: origin === 'lab' ? 'Lab-Grown' : 'Natural',
      price: computedPrice,
      img: product.image || '',
      alt: `${product.name} — ${product.category}`,
      slug: product.slug || product.id,
      productId: product.id,
    });
    router.push('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitting(true);
    const ok = await productService.submitReview({
      product_id: product.id,
      reviewer_name: reviewForm.name,
      reviewer_email: reviewForm.email,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
    setReviewSubmitting(false);
    if (ok) {
      setReviewSubmitted(true);
      setShowReviewForm(false);
      const updated = await productService.getReviews(product.id);
      setReviews(updated);
    }
  };

  const wishlisted = isWishlisted(product.id as unknown as number);

  const handleRequestCustom = () => {
    const searchParams = new URLSearchParams();
    searchParams.set('name', product.name);
    searchParams.set('image', product.image || '');
    searchParams.set('metal', metal);
    searchParams.set('diamond', origin === 'lab' ? 'Lab-Grown Diamond' : 'Natural Diamond');
    searchParams.set('variant', `${carat}ct · ${metal} · ${origin === 'lab' ? 'Lab-Grown' : 'Natural'}`);
    searchParams.set('url', `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug || product.id}`);
    searchParams.set('sku', product.sku || product.id);
    searchParams.set('price', formatPrice(computedPrice));
    router.push(`/custom-jewelry?${searchParams.toString()}#custom-form`);
  };

  return (
    <>
      <Header />
      {/* Inject Product + BreadcrumbList structured data */}
      {product && (
        <ProductStructuredData
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: computedPrice,
            image: product.image,
            category: product.category,
            slug: product.slug,
            sku: product.sku,
            certification: product.certification,
            carat_range: product.carat_range,
            metal_options: product.metal_options,
            diamond_type: product.diamond_type,
          }}
        />
      )}
      <main className="min-h-screen bg-bg pt-16 md:pt-20" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}>
        {/* Breadcrumb */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-5 md:py-6 border-b border-[rgba(28,25,23,0.06)]">
          <nav className="flex items-center gap-3 flex-wrap" aria-label="Breadcrumb">
            <Link href="/homepage" className="label-caps text-muted hover:text-foreground transition-colors">Home</Link>
            <span className="text-muted opacity-40 text-xs">—</span>
            <Link href="/products" className="label-caps text-muted hover:text-foreground transition-colors">Collection</Link>
            {(categoryName || product?.category) && (
              <>
                <span className="text-muted opacity-40 text-xs">—</span>
                <Link
                  href={product?.category_id ? `/products?category_id=${product.category_id}` : `/products?category=${encodeURIComponent(product?.category || '')}`}
                  className="label-caps text-muted hover:text-foreground transition-colors"
                >
                  {categoryName || product?.category}
                </Link>
              </>
            )}
            <span className="text-muted opacity-40 text-xs">—</span>
            <span className="label-caps text-foreground">{product?.name}</span>
          </nav>
        </div>

        {/* Product layout */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 md:py-12 lg:py-16">
          <div className="flex flex-col md:flex-row lg:flex-row gap-8 md:gap-10 lg:gap-16">

            {/* Left: Product Image Gallery */}
            <div className="w-full md:w-[50%] lg:w-[55%]">
              {/* Mobile/Tablet: swipe gallery */}
              <div className="lg:hidden">
                <MobileSwipeGallery
                  images={galleryImages}
                  priority={true}
                  aspectRatio="4/5"
                />
              </div>

              {/* Desktop: premium gallery with thumbnails */}
              <div className="hidden lg:block">
                {/* Main Image */}
                <div
                  className="relative aspect-[4/5] bg-[#F3EEE5] overflow-hidden cursor-zoom-in group"
                  onClick={() => openLightbox(selectedView)}
                >
                  {galleryImages[selectedView]?.url ? (
                    <Image
                      src={galleryImages[selectedView].url}
                      alt={galleryImages[selectedView].alt}
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 55vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F3EEE5] flex items-center justify-center">
                      <span className="text-muted text-sm">No image available</span>
                    </div>
                  )}
                  {/* Image counter */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="label-caps text-white bg-[rgba(28,25,23,0.55)] px-2.5 py-1 text-[9px] tracking-[0.2em]">
                      {galleryImages[selectedView]?.label}
                    </span>
                    <span className="label-caps text-white bg-[rgba(28,25,23,0.55)] px-2.5 py-1 text-[9px] tracking-[0.2em]">
                      {selectedView + 1} / {galleryImages.length}
                    </span>
                  </div>
                  {/* Zoom hint */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="label-caps text-white bg-[rgba(28,25,23,0.55)] px-2.5 py-1 text-[9px] tracking-[0.2em]">
                      ⊕ Zoom
                    </span>
                  </div>
                  {/* Prev/Next arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedView((v) => (v - 1 + galleryImages.length) % galleryImages.length); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedView((v) => (v + 1) % galleryImages.length); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails — show all images */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-1.5 mt-2">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={`${img.label}-${idx}`}
                        onClick={() => setSelectedView(idx)}
                        className={`relative aspect-square bg-[#F3EEE5] overflow-hidden border-2 transition-all duration-200 ${
                          selectedView === idx
                            ? 'border-[#B9924A]'
                            : 'border-transparent hover:border-[rgba(201,169,110,0.4)]'
                        }`}
                        aria-label={`View ${img.label}`}
                      >
                        {img.url ? (
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 20vw, 11vw"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F3EEE5]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Video */}
              {videoMedia && (
                <div className="mt-4">
                  <video
                    src={videoMedia.url}
                    controls
                    className="w-full aspect-video bg-[#F3EEE5]"
                    aria-label={`${product.name} product video`}
                  />
                </div>
              )}
            </div>

            {/* Right: Config */}
            <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col">
              {/* Title */}
              <div className="mb-6 md:mb-7 lg:mb-8 pb-6 md:pb-7 lg:pb-8 border-b border-[rgba(28,25,23,0.08)]">
                <p className="label-caps text-accent mb-3 tracking-[0.35em]">{categoryName || product.category}</p>
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-foreground leading-tight mb-3">
                  {product.h1 || product.name}
                </h1>
                {(product.short_description || product.description) && (
                  <p className="text-sm text-muted font-light leading-relaxed mt-3">{product.short_description || product.description}</p>
                )}
                {product.badge && (
                  <span className="inline-block mt-2 bg-[#B9924A] text-white px-3 py-1 text-[9px] font-medium tracking-[0.2em] uppercase">
                    {product.badge}
                  </span>
                )}
                <div className="flex flex-wrap gap-3 md:gap-4 mt-4">
                  <span className="label-caps text-muted text-[9px]">Carat: {product.carat_range || '0.30ct–2.00ct'}</span>
                  <span className="label-caps text-muted text-[9px]">Cert: {product.certification || 'IGI / GIA'}</span>
                  {product.master_product_id && (
                    <span className="label-caps text-muted text-[9px]">ID: {product.master_product_id}</span>
                  )}
                </div>
                <p className="text-sm text-muted font-light leading-relaxed mt-3">
                  D–G color range · VVS clarity · Excellent cut · {product.certification || 'IGI / GIA'} certified
                </p>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <StarRating rating={Math.round(avgRating)} />
                    <span className="text-xs text-muted font-light">{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                  </div>
                )}
              </div>

              {/* ── CARAT WEIGHT — Premium outlined selection cards ── */}
              <div className="mb-6 md:mb-7 lg:mb-8">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <p className="label-caps text-foreground tracking-[0.25em]">Carat Weight</p>
                  <p className="text-xs text-muted font-light">{carat} ct selected</p>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-2.5">
                  {caratOptions.map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setCarat(ct)}
                      className={`relative px-2 md:px-3 py-3 md:py-3.5 text-xs md:text-sm font-light transition-all duration-200 min-h-[52px] md:min-h-[56px] tap-transparent flex flex-col items-center justify-center gap-0.5 ${
                        carat === ct
                          ? 'border-2 border-[#B9924A] bg-[rgba(201,169,110,0.06)] text-foreground'
                          : 'border border-[rgba(28,25,23,0.12)] bg-white text-muted hover:border-[rgba(201,169,110,0.4)] hover:text-foreground hover:bg-[rgba(201,169,110,0.03)]'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {carat === ct && (
                        <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#B9924A] rounded-full flex items-center justify-center">
                          <svg viewBox="0 0 10 10" fill="none" className="w-2 h-2">
                            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                      <span className={`font-light ${carat === ct ? 'text-foreground' : ''}`}>{ct} ct</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── METAL TYPE — Premium swatches ── */}
              <div className="mb-6 md:mb-7 lg:mb-8">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <p className="label-caps text-foreground tracking-[0.25em]">Metal Type</p>
                  <p className="text-xs text-muted font-light">{metal}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                  {metalOptions.map((m) => {
                    const swatch = metalSwatchColors[m] || { bg: '#E8E4DC', ring: '#C8C4BC', label: m };
                    const isSelected = metal === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setMetal(m)}
                        className={`relative flex items-center gap-3 px-3 py-3 text-left transition-all duration-200 min-h-[52px] tap-transparent ${
                          isSelected
                            ? 'border-2 border-[#B9924A] bg-[rgba(201,169,110,0.06)]'
                            : 'border border-[rgba(28,25,23,0.12)] bg-white hover:border-[rgba(201,169,110,0.4)] hover:bg-[rgba(201,169,110,0.03)]'
                        }`}
                        style={{ touchAction: 'manipulation' }}
                      >
                        {/* Metal swatch circle */}
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${isSelected ? 'border-[#B9924A]' : 'border-transparent'}`}
                          style={{ backgroundColor: swatch.bg, boxShadow: `inset 0 0 0 1px ${swatch.ring}` }}
                        />
                        <span className={`text-xs font-light tracking-wide ${isSelected ? 'text-foreground' : 'text-muted'}`}>
                          {m}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#B9924A] rounded-full flex items-center justify-center">
                            <svg viewBox="0 0 10 10" fill="none" className="w-2 h-2">
                              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── DIAMOND ORIGIN — Premium selection ── */}
              <div className="mb-8 md:mb-9 lg:mb-10">
                <p className="label-caps text-foreground mb-3 md:mb-4 tracking-[0.25em]">Diamond Origin</p>
                <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                  {(['natural', 'lab'] as DiamondOrigin[]).map((o) => {
                    const isSelected = origin === o;
                    return (
                      <button
                        key={o}
                        onClick={() => setOrigin(o)}
                        className={`relative flex flex-col items-center justify-center px-4 py-4 text-center transition-all duration-200 min-h-[64px] tap-transparent ${
                          isSelected
                            ? 'border-2 border-[#B9924A] bg-[rgba(201,169,110,0.06)]'
                            : 'border border-[rgba(28,25,23,0.12)] bg-white hover:border-[rgba(201,169,110,0.4)] hover:bg-[rgba(201,169,110,0.03)]'
                        }`}
                        style={{ touchAction: 'manipulation' }}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#B9924A] rounded-full flex items-center justify-center">
                            <svg viewBox="0 0 10 10" fill="none" className="w-2 h-2">
                              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                        <span className={`text-xs font-light tracking-widest uppercase mb-0.5 ${isSelected ? 'text-foreground' : 'text-muted'}`}>
                          {o === 'natural' ? 'Natural' : 'Lab-Grown'}
                        </span>
                        <span className="text-[9px] text-muted font-light">
                          {o === 'natural' ? 'Earth-formed' : 'Modern origin'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── PRICE — Dynamic based on selection ── */}
              <div className="mb-6 md:mb-7 lg:mb-8 pb-6 md:pb-7 lg:pb-8 border-b border-[rgba(28,25,23,0.08)]">
                <p className="label-caps text-muted mb-2 tracking-[0.25em]">Configuration Price</p>
                <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-foreground tracking-tight whitespace-nowrap">
                  {formatPrice(computedPrice)}
                </p>
                <p className="mt-1 text-xs text-muted font-light">
                  {carat} ct · {metal} · {origin === 'lab' ? 'Lab-Grown' : 'Natural'} Diamond
                </p>
                <p className="mt-1 text-xs text-muted font-light">Incl. VAT · Free insured shipping · {product.production_time || '3–5 weeks'}</p>
              </div>

              {/* ── CTA HIERARCHY — Premium product actions ── */}
              <div id="product-main-buttons" className="flex flex-col gap-2.5 mb-6">
                {conciergeMode ? (
                  <>
                    {/* PRIMARY: Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className={`w-full text-center py-4 min-h-[52px] transition-all tap-transparent text-[11px] font-medium tracking-[0.25em] uppercase ${
                        addedToCart
                          ? 'bg-[#B9924A] text-white border-2 border-[#B9924A]'
                          : 'bg-foreground text-white hover:bg-[#2C2927]'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                    </button>
                    {/* PRIMARY: Reserve This Piece */}
                    <button
                      onClick={() => openConcierge('reservation')}
                      className="w-full text-center py-4 min-h-[52px] btn-outline transition-all tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {conciergeCtaPrimary}
                    </button>
                    {/* SECONDARY: Request Invoice */}
                    <button
                      onClick={() => openConcierge('invoice_request')}
                      className="w-full text-center py-3.5 min-h-[48px] border border-[rgba(28,25,23,0.15)] text-[11px] font-medium tracking-[0.25em] uppercase text-muted hover:text-foreground hover:border-foreground transition-all tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {conciergeCtaSecondary}
                    </button>
                    {/* TERTIARY: Speak With Concierge */}
                    <button
                      onClick={() => openConcierge('inquiry')}
                      className="w-full py-3 border border-[rgba(28,25,23,0.1)] text-[10px] font-light tracking-widest uppercase text-muted hover:text-foreground hover:border-[rgba(28,25,23,0.2)] transition-all flex items-center justify-center gap-2 tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <span className="text-accent text-xs">◎</span>
                      Speak With Concierge
                    </button>
                    {/* Private Consultation */}
                    <button
                      onClick={() => openConcierge('consultation')}
                      className="w-full py-3 border border-[rgba(28,25,23,0.08)] text-[10px] font-light tracking-widest uppercase text-muted hover:text-foreground hover:border-[rgba(28,25,23,0.15)] transition-all flex items-center justify-center gap-2 tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <span className="text-accent text-xs">◇</span>
                      Private Consultation
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleBuyNow} className="w-full text-center py-4 min-h-[52px] btn-primary transition-all tap-transparent" style={{ touchAction: 'manipulation' }}>
                      Buy Now
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className={`w-full text-center py-4 min-h-[52px] transition-all btn-outline tap-transparent ${addedToCart ? 'border-accent text-accent' : ''}`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => openConcierge('reservation')}
                      className="w-full text-center py-3.5 min-h-[48px] border border-[rgba(28,25,23,0.15)] text-[11px] font-medium tracking-[0.25em] uppercase text-muted hover:text-foreground hover:border-foreground transition-all tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      Reserve This Piece
                    </button>
                    <button
                      onClick={() => openConcierge('invoice_request')}
                      className="w-full py-3 border border-[rgba(28,25,23,0.1)] text-[10px] font-light tracking-widest uppercase text-muted hover:text-foreground transition-all flex items-center justify-center tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      Request Invoice
                    </button>
                    <button
                      onClick={handleRequestCustom}
                      className="btn-outline w-full text-center py-3.5 min-h-[48px] flex items-center justify-center tap-transparent"
                      style={{ touchAction: 'manipulation' }}
                    >
                      Request Custom Design
                    </button>
                  </>
                )}
                {/* Wishlist — always visible */}
                <button
                  onClick={() => toggleItem({
                    id: product.id as unknown as number,
                    name: product.name,
                    spec: `${carat} ct · D–G · VVS`,
                    metal,
                    price: computedPrice,
                    img: product.image || '',
                    alt: `${product.name} — ${product.category}`,
                    slug: (product.slug || product.id) as string,
                  })}
                  className="w-full py-3 border border-[rgba(28,25,23,0.08)] text-[10px] font-light tracking-widest uppercase text-muted hover:text-foreground hover:border-[rgba(28,25,23,0.15)] transition-all flex items-center justify-center gap-2 tap-transparent"
                  style={{ touchAction: 'manipulation' }}
                >
                  <svg viewBox="0 0 24 24" fill={wishlisted ? '#B9924A' : 'none'} stroke={wishlisted ? '#B9924A' : 'currentColor'} strokeWidth="1.5" className="w-4 h-4">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {wishlisted ? 'Saved to Wishlist' : '♡ Save to Wishlist'}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-[rgba(28,25,23,0.08)]">
                {[
                  { icon: '◇', label: 'IGI / GIA Certified' },
                  { icon: '◈', label: 'Free Insured Shipping' },
                  { icon: '◉', label: '30-Day Returns' },
                  { icon: '◎', label: 'Secure Checkout' },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2">
                    <span className="text-accent text-xs">{badge.icon}</span>
                    <span className="label-caps text-muted" style={{ fontSize: '8px' }}>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── EXPANDABLE PRODUCT INFORMATION ACCORDIONS ── */}
          <div className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-[rgba(28,25,23,0.08)]">
            <div className="max-w-[760px]">
              <p className="label-caps text-accent mb-6 tracking-[0.35em]">Product Information</p>
              <div className="divide-y divide-[rgba(28,25,23,0.08)]">
                <AccordionSection title="Diamond Details">
                  <p className="mb-3">{currentDiamondDetails.description}</p>
                  <ul className="space-y-1.5">
                    {currentDiamondDetails.values.map((v) => (
                      <li key={v} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5 text-xs flex-shrink-0">◇</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 italic border-l-2 border-accent pl-3 text-foreground font-light">
                    &ldquo;{currentDiamondDetails.positioningLine}&rdquo;
                  </p>
                </AccordionSection>

                <AccordionSection title="Metal & Craftsmanship">
                  <p>Each DETARA piece is crafted by skilled goldsmiths using the finest metals. We offer 14K and 18K gold in white, yellow, and rose, as well as Platinum 950.</p>
                  <ul className="mt-3 space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">◈</span><span>Handcrafted to order</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">◈</span><span>Precision-set diamonds</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">◈</span><span>Quality inspected before delivery</span></li>
                  </ul>
                </AccordionSection>

                <AccordionSection title="Certification">
                  <p>All DETARA diamonds above 0.30ct are certified by IGI or GIA — the two most respected independent grading laboratories in the world.</p>
                  <p className="mt-2">Your certificate includes: carat weight, cut grade, color grade, clarity grade, and diamond origin.</p>
                </AccordionSection>

                <AccordionSection title="Shipping & Delivery">
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">→</span><span>Free insured shipping worldwide</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">→</span><span>Production time: {product.production_time || '3–5 weeks'}</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">→</span><span>Tracking provided</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">→</span><span>Delivered in premium DETARA packaging</span></li>
                  </ul>
                </AccordionSection>

                <AccordionSection title="Returns">
                  <p>We offer a 30-day return policy on all standard pieces. Custom-made pieces are non-returnable unless there is a manufacturing defect.</p>
                  <p className="mt-2">To initiate a return, contact our concierge team at hello@detara.store.</p>
                </AccordionSection>

                <AccordionSection title="Warranty & Lifetime Service">
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">◉</span><span>2-year manufacturing warranty</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">◉</span><span>Lifetime cleaning and inspection service</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">◉</span><span>Resizing service available</span></li>
                  </ul>
                </AccordionSection>

                <AccordionSection title="Jewellery Care">
                  <p>To maintain the brilliance of your DETARA jewellery:</p>
                  <ul className="mt-2 space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">·</span><span>Store separately in the provided pouch</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">·</span><span>Remove before swimming, bathing, or exercising</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">·</span><span>Clean gently with a soft cloth</span></li>
                    <li className="flex items-start gap-2"><span className="text-accent text-xs flex-shrink-0">·</span><span>Professional cleaning recommended annually</span></li>
                  </ul>
                </AccordionSection>

                <AccordionSection title="Customisation">
                  <p>Every DETARA piece can be customised. We offer bespoke diamond selection, alternative settings, and fully custom designs.</p>
                  <p className="mt-2">Contact our concierge team or visit our Custom Jewellery page to begin your bespoke journey.</p>
                  <div className="mt-3">
                    <Link href="/custom-jewelry" className="text-accent text-xs font-light tracking-wider underline underline-offset-4 hover:text-foreground transition-colors">
                      Design Your Jewellery →
                    </Link>
                  </div>
                </AccordionSection>
              </div>
            </div>
          </div>

          {/* ── DIAMOND DETAILS SECTION ── */}
          <div className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-[rgba(28,25,23,0.08)]">
            <div className="max-w-[760px]">
              <p className="label-caps text-accent mb-3 tracking-[0.35em]">Authenticity &amp; Quality</p>
              <div className="space-y-3 mb-5">
                {[
                  'IGI / GIA certified diamonds',
                  'Natural & lab-grown options clearly specified',
                  'Quality checked before delivery',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-accent mt-0.5 text-xs">◈</span>
                    <span className="text-sm text-muted font-light">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground font-light italic border-l-2 border-accent pl-4">
                &ldquo;Both natural and lab-grown diamonds are real — the difference lies in their origin.&rdquo;
              </p>
            </div>
          </div>

          {/* ── REVIEWS SECTION ── */}
          <div className="mt-10 md:mt-12 pt-10 md:pt-12 border-t border-[rgba(28,25,23,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="label-caps text-accent mb-2 tracking-[0.35em]">Customer Reviews</p>
                {reviews.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <StarRating rating={Math.round(avgRating)} size="md" />
                    <span className="font-serif text-xl font-light text-foreground">{avgRating}</span>
                    <span className="text-xs text-muted font-light">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted font-light">Be the first to review this product.</p>
                )}
              </div>
              {!showReviewForm && !reviewSubmitted && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs font-light tracking-widest uppercase border border-[rgba(28,25,23,0.15)] px-4 py-2.5 text-muted hover:text-foreground hover:border-foreground transition-colors tap-transparent"
                  style={{ touchAction: 'manipulation' }}
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-[#F9F7F3] border border-[rgba(28,25,23,0.08)] p-6 mb-8 max-w-[560px]">
                <h3 className="font-serif text-base font-light text-foreground mb-5">Share Your Experience</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-caps text-muted block mb-1.5" style={{ fontSize: '9px' }}>Your Name *</label>
                      <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))} className="w-full bg-white border border-[rgba(28,25,23,0.12)] px-3 py-2.5 text-sm font-light text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="label-caps text-muted block mb-1.5" style={{ fontSize: '9px' }}>Email (optional)</label>
                      <input type="email" value={reviewForm.email} onChange={(e) => setReviewForm((p) => ({ ...p, email: e.target.value }))} className="w-full bg-white border border-[rgba(28,25,23,0.12)] px-3 py-2.5 text-sm font-light text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="label-caps text-muted block mb-2" style={{ fontSize: '9px' }}>Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewForm((p) => ({ ...p, rating: star }))} className="p-1 tap-transparent" style={{ touchAction: 'manipulation' }}>
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill={star <= reviewForm.rating ? '#B9924A' : 'none'} stroke={star <= reviewForm.rating ? '#B9924A' : '#D1CCC6'} strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label-caps text-muted block mb-1.5" style={{ fontSize: '9px' }}>Your Review *</label>
                    <textarea required value={reviewForm.comment} onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} rows={3} className="w-full bg-white border border-[rgba(28,25,23,0.12)] px-3 py-2.5 text-sm font-light text-foreground focus:outline-none focus:border-foreground transition-colors resize-none" placeholder="Share your experience with this product..." />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="submit" disabled={reviewSubmitting} className="px-6 py-2.5 bg-foreground text-white text-xs font-medium uppercase tracking-wider hover:bg-accent-dark transition-colors disabled:opacity-60 tap-transparent" style={{ touchAction: 'manipulation' }}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2.5 border border-[rgba(28,25,23,0.2)] text-xs font-medium uppercase tracking-wider text-muted hover:text-foreground transition-colors tap-transparent" style={{ touchAction: 'manipulation' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {reviewSubmitted && (
              <p className="text-sm text-accent font-light mb-6">Thank you for your review!</p>
            )}

            {reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 max-w-[900px]">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-[#F9F7F3] border border-[rgba(28,25,23,0.06)] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-light text-foreground">{review.reviewer_name}</p>
                        {review.is_verified && (
                          <span className="text-[9px] text-accent tracking-wider uppercase">Verified Purchase</span>
                        )}
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted font-light leading-relaxed">{review.comment}</p>
                    )}
                    <p className="text-[10px] text-muted mt-1">{new Date(review.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted font-light">Be the first to review this product.</p>
            )}
          </div>

          {/* ── RELATED PRODUCTS ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-[rgba(28,25,23,0.08)]">
              <p className="label-caps text-accent mb-3 tracking-[0.35em]">You May Also Like</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/product/${rp.slug || rp.id}`} className="group block tap-transparent" style={{ touchAction: 'manipulation' }}>
                    <div className="relative aspect-square bg-[#F3EEE5] overflow-hidden mb-3">
                      {rp.image ? (
                        <Image
                          src={rp.image}
                          alt={`${rp.name} — ${rp.category} — DETARA`}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#F3EEE5]" />
                      )}
                    </div>
                    <p className="label-caps text-accent text-[8px] mb-1">{rp.category}</p>
                    <p className="font-serif text-sm font-light text-foreground leading-snug group-hover:text-accent transition-colors">{rp.name}</p>
                    <p className="text-xs text-muted font-light mt-1">From {formatPrice(rp.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MOBILE/TABLET STICKY BAR ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[105] lg:hidden transition-transform duration-300 ease-in-out ${
          stickyBarVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          background: 'rgba(244, 242, 238, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(28,25,23,0.08)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm font-light text-foreground truncate">{product.name}</p>
            <p className="text-xs text-muted font-light">{carat}ct · {metal}</p>
          </div>
          <p className="font-serif text-base font-light text-foreground whitespace-nowrap flex-shrink-0">
            {formatPrice(computedPrice)}
          </p>
          {conciergeMode ? (
            <button
              onClick={() => openConcierge('reservation')}
              className="flex-shrink-0 px-4 py-3 bg-foreground text-white text-xs font-medium tracking-widest uppercase tap-transparent active:bg-accent-dark transition-colors min-h-[48px]"
              style={{ touchAction: 'manipulation' }}
            >
              Reserve
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`flex-shrink-0 px-4 py-3 text-xs font-medium tracking-widest uppercase tap-transparent transition-colors min-h-[48px] ${
                addedToCart ? 'bg-accent text-white' : 'bg-foreground text-white active:bg-accent-dark'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {addedToCart ? '✓ Added' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
          onNext={() => setLightboxIndex((i) => (i + 1) % galleryImages.length)}
        />
      )}

      {/* Concierge Modal */}
      <ConciergeModal
        isOpen={conciergeOpen}
        onClose={() => setConciergeOpen(false)}
        type={conciergeType}
        whatsappNumber={whatsappNumber}
        product={product ? {
          id: product.id,
          name: product.name,
          config: `${carat}ct · ${metal} · ${origin === 'lab' ? 'Lab-Grown' : 'Natural'}`,
          price: computedPrice,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/product/${product.slug || product.id}`,
          sku: product.sku || product.id,
        } : undefined}
      />
    </>
  );
}
