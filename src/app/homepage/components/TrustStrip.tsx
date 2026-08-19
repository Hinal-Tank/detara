'use client';

import React from 'react';

const TRUST_ITEMS = [
  { icon: '◇', label: 'IGI & GIA Certified' },
  { icon: '◈', label: 'Insured Shipping' },
  { icon: '◉', label: 'Worldwide Delivery' },
  { icon: '◆', label: 'Secure Checkout' },
  { icon: '◎', label: 'Easy Returns' },
  { icon: '◐', label: 'Lifetime Service' },
];

export default function TrustStrip() {
  return (
    <div
      className="w-full py-3 overflow-hidden"
      style={{ maxWidth: '100vw', backgroundColor: '#5B4636', borderTop: '1px solid rgba(212,176,122,0.2)' }}
    >
      <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 px-5 md:px-8">
        {TRUST_ITEMS?.map((item, i) => (
          <React.Fragment key={item?.label}>
            <span className="flex items-center gap-2 text-[11px] font-light tracking-wider whitespace-nowrap" style={{ color: 'rgba(247,245,241,0.8)' }}>
              <span className="text-xs" style={{ color: '#C6A15B' }}>{item?.icon}</span>
              {item?.label}
            </span>
            {i < TRUST_ITEMS?.length - 1 && (
              <span className="hidden md:inline text-xs" style={{ color: 'rgba(212,176,122,0.3)' }}>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
