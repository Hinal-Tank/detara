'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg pt-44 md:pt-56 pb-20 md:pb-32 px-5 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-10 md:mb-16 pb-8 border-b border-[rgba(28,25,23,0.08)]">
            <p className="label-caps text-accent mb-3">Saved Pieces</p>
            <h1 className="heading-display text-[clamp(2rem,4vw,4rem)] text-foreground font-light leading-[0.92]">
              Your Wishlist
            </h1>
            {items?.length > 0 && (
              <p className="text-sm text-muted font-light mt-4">{items?.length} saved pieces</p>
            )}
          </div>

          {items?.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border border-[rgba(28,25,23,0.12)] flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-muted">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-serif text-2xl font-light text-muted mb-3">Your wishlist is empty.</p>
              <p className="text-sm text-muted font-light mb-8">Save pieces you love by tapping the heart icon.</p>
              <Link href="/products" className="btn-primary inline-block">Explore Collection</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items?.map((item) => (
                <div key={item?.id} className="product-card-luxury overflow-hidden group relative">
                  <button
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity"
                    onClick={() => removeItem(item?.id)}
                    aria-label="Remove from wishlist"
                  >
                    <svg viewBox="0 0 24 24" fill="#B9924A" stroke="#B9924A" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="relative aspect-square overflow-hidden bg-[#EAE2D8]">
                    <AppImage
                      src={item?.img}
                      alt={item?.alt}
                      fill
                      className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-serif text-sm md:text-base font-light text-foreground leading-snug mb-1.5">{item?.name}</h3>
                    <p className="label-caps text-muted mb-3" style={{ fontSize: '9px' }}>{item?.spec} · {item?.metal}</p>
                    <p className="font-serif text-sm font-light text-foreground whitespace-nowrap mb-4">{item?.price}</p>
                    <Link
                      href={`/product/${item?.slug}`}
                      className="w-full py-3 px-4 bg-foreground text-[#FFFDF8] text-[10px] font-medium tracking-[0.2em] uppercase text-center block hover:bg-accent-dark transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      Configure
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
