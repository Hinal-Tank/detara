'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, updateQty, removeItem, subtotal } = useCart();

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-foreground/30 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 z-[301] h-full w-full max-w-[420px] bg-bg shadow-2xl flex flex-col" style={{ maxWidth: 'min(420px, 100vw)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-[rgba(28,25,23,0.08)] flex-shrink-0">
          <div>
            <p className="label-caps text-accent mb-0.5">Your Selection</p>
            <h2 className="font-serif text-xl font-light text-foreground">Shopping Cart</h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-muted hover:text-foreground transition-colors tap-transparent"
            aria-label="Close cart"
            style={{ touchAction: 'manipulation' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4 space-y-4 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
          {items?.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-lg font-light text-muted mb-4">Your cart is empty.</p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="label-caps text-accent hover:text-foreground transition-colors min-h-[44px]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items?.map((item) => (
              <div key={item?.id} className="flex gap-3 p-3 md:p-4 bg-bg-warm border border-[rgba(28,25,23,0.06)]">
                <div className="relative w-18 h-18 md:w-20 md:h-20 flex-shrink-0 bg-[#EAE2D8] overflow-hidden" style={{ width: '72px', height: '72px' }}>
                  <AppImage
                    src={item?.img}
                    alt={item?.alt}
                    fill
                    className="object-cover object-center"
                    sizes="72px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-light text-foreground mb-1 leading-snug">{item?.name}</h3>
                  <p className="label-caps text-muted mb-2" style={{ fontSize: '8px' }}>
                    {item?.carat} · {item?.metal} · {item?.origin}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center border border-[rgba(28,25,23,0.12)]">
                      <button
                        onClick={() => updateQty(item?.id, -1)}
                        className="w-9 h-9 flex items-center justify-center text-muted hover:text-foreground transition-colors text-sm tap-transparent"
                        aria-label="Decrease"
                        style={{ touchAction: 'manipulation' }}
                      >−</button>
                      <span className="w-6 text-center text-xs font-light text-foreground">{item?.quantity}</span>
                      <button
                        onClick={() => updateQty(item?.id, 1)}
                        className="w-9 h-9 flex items-center justify-center text-muted hover:text-foreground transition-colors text-sm tap-transparent"
                        aria-label="Increase"
                        style={{ touchAction: 'manipulation' }}
                      >+</button>
                    </div>
                    <p className="font-serif text-sm font-light text-foreground whitespace-nowrap">
                      NOK {(item?.price * item?.quantity)?.toLocaleString('nb-NO')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item?.id)}
                    className="mt-2 label-caps text-muted hover:text-foreground transition-colors min-h-[36px] tap-transparent"
                    style={{ fontSize: '8px', touchAction: 'manipulation' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items?.length > 0 && (
          <div className="px-5 md:px-6 py-4 md:py-5 border-t border-[rgba(28,25,23,0.08)] flex-shrink-0 safe-bottom">
            <div className="flex justify-between mb-4 md:mb-5">
              <span className="font-serif text-base font-light text-foreground">Subtotal</span>
              <span className="font-serif text-base font-light text-foreground whitespace-nowrap">
                NOK {subtotal?.toLocaleString('nb-NO')}
              </span>
            </div>
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="w-full py-4 px-6 bg-foreground text-[#FFFDF8] text-[11px] font-medium tracking-[0.25em] uppercase text-center block hover:bg-accent-dark transition-colors min-h-[52px] flex items-center justify-center tap-transparent"
                style={{ touchAction: 'manipulation' }}
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3.5 px-6 border border-[rgba(28,25,23,0.2)] text-foreground text-[11px] font-medium tracking-[0.25em] uppercase text-center block hover:border-foreground transition-colors min-h-[48px] flex items-center justify-center tap-transparent"
                style={{ touchAction: 'manipulation' }}
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
