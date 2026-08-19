'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { SupabaseProduct, CategoryRecord } from '@/lib/supabase/productService';
import ProductImage from '@/components/ui/ProductImage';

// Canonical master category IDs
const MASTER_CAT_IDS = {
  rings:     '11111111-0001-0001-0001-000000000001',
  earrings:  '11111111-0001-0001-0001-000000000002',
  necklaces: '11111111-0001-0001-0001-000000000003',
  bracelets: '11111111-0001-0001-0001-000000000004',
  mens:      '11111111-0001-0001-0001-000000000005',
  gemstone:  '11111111-0001-0001-0001-000000000006',
};

// Legacy slug → category_id mapping for backward-compatible URLs
const SLUG_TO_CATEGORY_ID: Record<string, string> = {
  'rings':                MASTER_CAT_IDS.rings,
  'engagement-rings':     MASTER_CAT_IDS.rings,
  'engagement':           MASTER_CAT_IDS.rings,
  'solitaires':           MASTER_CAT_IDS.rings,
  'diamond-bands':        MASTER_CAT_IDS.rings,
  'bands':                MASTER_CAT_IDS.rings,
  'earrings':             MASTER_CAT_IDS.earrings,
  'diamond-stud-earrings':MASTER_CAT_IDS.earrings,
  'diamond-studs':        MASTER_CAT_IDS.earrings,
  'necklaces':            MASTER_CAT_IDS.necklaces,
  'necklace':             MASTER_CAT_IDS.necklaces,
  'diamond-pendants':     MASTER_CAT_IDS.necklaces,
  'pendants':             MASTER_CAT_IDS.necklaces,
  'bracelets':            MASTER_CAT_IDS.bracelets,
  'bracelet':             MASTER_CAT_IDS.bracelets,
  'tennis-bracelets':     MASTER_CAT_IDS.bracelets,
  'tennis':               MASTER_CAT_IDS.bracelets,
  'tennis-jewellery':     MASTER_CAT_IDS.bracelets,
  'mens-jewellery':       MASTER_CAT_IDS.mens,
  'mens':                 MASTER_CAT_IDS.mens,
  'mens-cufflinks':       MASTER_CAT_IDS.mens,
  'cufflinks':            MASTER_CAT_IDS.mens,
  'gemstone':             MASTER_CAT_IDS.gemstone,
  'gemstone-jewellery':   MASTER_CAT_IDS.gemstone,
};

interface FilterState {
  type: 'all' | 'category' | 'subcategory';
  id: string | null;
  label: string;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse flex flex-col">
      <div className="aspect-square bg-[#EEE7DC] mb-3" />
      <div className="px-1 flex flex-col flex-1">
        <div className="h-2 bg-[#EEE7DC] mb-2 w-1/4 rounded" />
        <div className="h-3 bg-[#EEE7DC] mb-1.5 w-3/4 rounded" />
        <div className="h-3 bg-[#EEE7DC] mb-2 w-2/3 rounded" />
        <div className="h-2.5 bg-[#EEE7DC] mb-3 w-1/3 rounded" />
        <div className="h-4 bg-[#EEE7DC] w-full rounded mt-auto" />
      </div>
    </div>
  );
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category');
  const categoryIdParam = searchParams?.get('category_id');
  const subcategoryIdParam = searchParams?.get('subcategory_id');

  const [filter, setFilter] = useState<FilterState>({ type: 'all', id: null, label: 'All' });
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [masterCategories, setMasterCategories] = useState<CategoryRecord[]>([]);
  const [subcategories, setSubcategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { toggleItem, isWishlisted } = useWishlist();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  // Load master categories and subcategories from DB
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const json = await res.json();
          setMasterCategories(json.categories || []);
          setSubcategories(json.subcategories || []);
        }
      } catch {
        // ignore — filters will still work via URL params
      }
    }
    loadCategories();
  }, []);

  // Resolve initial filter from URL params
  useEffect(() => {
    if (subcategoryIdParam) {
      setFilter({ type: 'subcategory', id: subcategoryIdParam, label: '' });
    } else if (categoryIdParam) {
      setFilter({ type: 'category', id: categoryIdParam, label: '' });
    } else if (categoryParam) {
      // Legacy slug support
      const catId = SLUG_TO_CATEGORY_ID[categoryParam];
      if (catId) {
        setFilter({ type: 'category', id: catId, label: categoryParam });
      } else {
        setFilter({ type: 'all', id: null, label: 'All' });
      }
    }
  }, [categoryParam, categoryIdParam, subcategoryIdParam]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      let url = '/api/products?';
      if (filter.type === 'subcategory' && filter.id) {
        url += `subcategory_id=${encodeURIComponent(filter.id)}`;
      } else if (filter.type === 'category' && filter.id) {
        url += `category_id=${encodeURIComponent(filter.id)}`;
      }
      // No params = all products
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setProducts(json.products || []);
    } catch {
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filter, retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleWishlist = (product: SupabaseProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: Number(product.id),
      name: product.name,
      spec: `${product.carat_range || '0.30ct–2.00ct'} · D–G · VVS`,
      metal: product.metal_options?.[3] || '18K White Gold',
      price: formatPrice(product.price),
      img: product.image || '',
      alt: `${product.name} — ${product.category}`,
      slug: product.slug || product.id,
    });
  };

  const handleAddToCart = (product: SupabaseProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-1.00-18K White Gold-natural`,
      name: product.name,
      shape: product.category,
      carat: '1.00 ct',
      metal: product.metal_options?.[0] || '18K White Gold',
      origin: 'Natural',
      price: product.price,
      img: product.image || '',
      alt: `${product.name} — ${product.category}`,
      slug: product.slug || product.id,
      productId: product.id,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  // Get active category label
  const getActiveLabel = () => {
    if (filter.type === 'all') return 'All';
    if (filter.type === 'category' && filter.id) {
      const cat = masterCategories.find((c) => c.id === filter.id);
      return cat?.name || filter.label || 'Category';
    }
    if (filter.type === 'subcategory' && filter.id) {
      const sub = subcategories.find((c) => c.id === filter.id);
      return sub?.name || filter.label || 'Subcategory';
    }
    return 'All';
  };

  // Build breadcrumb for current filter
  const getBreadcrumb = () => {
    if (filter.type === 'subcategory' && filter.id) {
      const sub = subcategories.find((c) => c.id === filter.id);
      if (sub?.parent_id) {
        const parent = masterCategories.find((c) => c.id === sub.parent_id);
        if (parent) return `${parent.name} › ${sub.name}`;
      }
      return sub?.name || '';
    }
    if (filter.type === 'category' && filter.id) {
      const cat = masterCategories.find((c) => c.id === filter.id);
      return cat?.name || '';
    }
    return '';
  };

  const activeLabel = getActiveLabel();
  const breadcrumb = getBreadcrumb();

  // Get subcategories for active master category
  const activeCategoryId =
    filter.type === 'category' ? filter.id :
    filter.type === 'subcategory' ? (subcategories.find((s) => s.id === filter.id)?.parent_id || null) : null;

  const activeSubcategories = activeCategoryId
    ? subcategories.filter((s) => s.parent_id === activeCategoryId)
    : [];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Page header */}
      <div className="px-4 sm:px-5 md:px-8 mb-6 md:mb-12 lg:mb-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-10 lg:mb-12">
            <div>
              <p className="label-caps text-accent mb-2 md:mb-4">DETARA Collection</p>
              <h1 className="heading-display text-[clamp(1.8rem,6vw,5rem)] text-foreground leading-[0.9] overflow-wrap-anywhere">
                Diamond Jewelry.<br />
                <span className="italic font-light text-muted">Configured to you.</span>
              </h1>
              {breadcrumb && (
                <p className="label-caps text-muted mt-2 text-[9px]">{breadcrumb}</p>
              )}
            </div>
            <p className="text-sm text-muted font-light max-w-xs leading-relaxed">
              {loading ? 'Loading collection...' : `${products.length} pieces. All D–G color range, VVS clarity. Lab-grown or natural.`}
            </p>
          </div>

          {/* Master category filters */}
          <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-none -mx-4 sm:-mx-5 md:mx-0 px-4 sm:px-5 md:px-0 md:flex-wrap">
            <button
              onClick={() => setFilter({ type: 'all', id: null, label: 'All' })}
              className={`flex-shrink-0 px-4 md:px-5 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-250 min-h-[44px] tap-transparent ${
                filter.type === 'all' ?'bg-foreground text-[#FFFDF8] border border-foreground' :'bg-transparent text-muted border border-[rgba(28,25,23,0.2)] hover:border-foreground hover:text-foreground'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              All
            </button>
            {masterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter({ type: 'category', id: cat.id, label: cat.name })}
                className={`flex-shrink-0 px-4 md:px-5 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-250 min-h-[44px] tap-transparent ${
                  (filter.type === 'category' && filter.id === cat.id) ||
                  (filter.type === 'subcategory' && subcategories.find((s) => s.id === filter.id)?.parent_id === cat.id)
                    ? 'bg-foreground text-[#FFFDF8] border border-foreground' :'bg-transparent text-muted border border-[rgba(28,25,23,0.2)] hover:border-foreground hover:text-foreground'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategory filters — only shown when a master category is active */}
          {activeSubcategories.length > 0 && (
            <div className="flex gap-2 pt-2 pb-4 md:pb-8 border-b border-[rgba(28,25,23,0.08)] overflow-x-auto scrollbar-none -mx-4 sm:-mx-5 md:mx-0 px-4 sm:px-5 md:px-0 md:flex-wrap">
              <button
                onClick={() => setFilter({ type: 'category', id: activeCategoryId!, label: masterCategories.find((c) => c.id === activeCategoryId)?.name || '' })}
                className={`flex-shrink-0 px-3 py-2 text-[9px] font-medium tracking-[0.15em] uppercase transition-all duration-250 min-h-[36px] tap-transparent ${
                  filter.type === 'category' ?'bg-[rgba(201,169,110,0.12)] text-[#B9924A] border border-[#B9924A]' :'bg-transparent text-muted border border-[rgba(28,25,23,0.15)] hover:border-[#B9924A] hover:text-[#B9924A]'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                All {masterCategories.find((c) => c.id === activeCategoryId)?.name}
              </button>
              {activeSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setFilter({ type: 'subcategory', id: sub.id, label: sub.name })}
                  className={`flex-shrink-0 px-3 py-2 text-[9px] font-medium tracking-[0.15em] uppercase transition-all duration-250 min-h-[36px] tap-transparent ${
                    filter.type === 'subcategory' && filter.id === sub.id ?'bg-[rgba(201,169,110,0.12)] text-[#B9924A] border border-[#B9924A]' :'bg-transparent text-muted border border-[rgba(28,25,23,0.15)] hover:border-[#B9924A] hover:text-[#B9924A]'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
          {activeSubcategories.length === 0 && (
            <div className="border-b border-[rgba(28,25,23,0.08)] mb-0 pb-4 md:pb-8" />
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-4 sm:px-5 md:px-8 pb-16 md:pb-28 lg:pb-40">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl font-light text-muted mb-6">Unable to load products.</p>
              <button onClick={() => setRetryCount((c) => c + 1)} className="btn-primary">
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl font-light text-muted mb-4">No products found in {activeLabel}.</p>
              <button
                onClick={() => setFilter({ type: 'all', id: null, label: 'All' })}
                className="label-caps text-accent hover:text-foreground transition-colors"
              >
                View all products →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer relative flex flex-col bg-[#FFFDF8] border border-[rgba(28,25,23,0.06)] hover:border-[rgba(28,25,23,0.12)] transition-all duration-300"
                >
                  {product.badge && (
                    <div className="absolute top-2 left-2 z-10 bg-[#B9924A] text-white px-2 py-0.5 text-[8px] font-medium tracking-[0.15em] uppercase">
                      {product.badge}
                    </div>
                  )}
                  <button
                    className="absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity tap-transparent"
                    onClick={(e) => handleWishlist(product, e)}
                    aria-label={isWishlisted(Number(product.id)) ? 'Remove from wishlist' : 'Add to wishlist'}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <svg viewBox="0 0 24 24" fill={isWishlisted(Number(product.id)) ? '#B9924A' : 'none'} stroke={isWishlisted(Number(product.id)) ? '#B9924A' : '#766C63'} strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    className="block relative w-full overflow-hidden bg-[#F3EEE5] flex-shrink-0"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                      <div className="absolute inset-0">
                        <ProductImage
                          src={product.image}
                          alt={`${product.name} — ${product.category} — DETARA`}
                          hoverScale={true}
                        />
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <p className="label-caps text-accent mb-1" style={{ fontSize: '8px' }}>{product.category}</p>
                    <h3
                      className="font-serif text-sm font-light text-foreground leading-snug mb-1.5 flex-1"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}
                    >
                      {product.name}
                    </h3>
                    <p className="label-caps text-muted mb-1.5 hidden sm:block" style={{ fontSize: '8px' }}>
                      {product.carat_range || '0.30ct–2.00ct'} · {product.metal_options?.slice(0, 2).join(' / ') || '18K White Gold'}
                    </p>
                    <p className="font-serif text-sm font-light text-foreground mb-3">
                      From {formatPrice(product.price)}
                    </p>
                    <div className="flex gap-1.5 mt-auto">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`flex-1 py-2.5 text-[9px] font-medium tracking-[0.15em] uppercase transition-all duration-200 min-h-[40px] tap-transparent border ${
                          addedIds.has(product.id)
                            ? 'border-[#B9924A] bg-[rgba(201,169,110,0.08)] text-[#B9924A]'
                            : 'border-[rgba(28,25,23,0.2)] text-foreground hover:border-[#B9924A] hover:text-[#B9924A] hover:bg-[rgba(201,169,110,0.04)]'
                        }`}
                        style={{ touchAction: 'manipulation' }}
                      >
                        {addedIds.has(product.id) ? '✓ Added' : 'Add to Cart'}
                      </button>
                      <Link
                        href={`/product/${product.slug || product.id}`}
                        className="flex-shrink-0 w-10 h-10 border border-[rgba(28,25,23,0.12)] flex items-center justify-center text-muted hover:border-[#B9924A] hover:text-[#B9924A] transition-all duration-200 tap-transparent"
                        onClick={(e) => e.stopPropagation()}
                        style={{ touchAction: 'manipulation' }}
                        aria-label="View product details"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
