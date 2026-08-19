'use client';

import React from 'react';

const SERVICES = [
  { icon: '◇', label: 'Certified Diamonds', desc: 'IGI & GIA certified' },
  { icon: '◈', label: 'Secure Checkout', desc: 'Encrypted payment' },
  { icon: '◉', label: 'Insured Shipping', desc: 'Fully insured delivery' },
  { icon: '◆', label: 'Worldwide Delivery', desc: 'Ship to any country' },
  { icon: '◎', label: 'Easy Returns', desc: 'Hassle-free process' },
  { icon: '◐', label: 'Lifetime Service', desc: 'Complimentary care' },
  { icon: '◑', label: 'Jewellery Warranty', desc: 'Craftsmanship covered' },
  { icon: '◒', label: 'Jewellery Care', desc: 'Expert guidance' },
  { icon: '◓', label: 'Custom Jewellery', desc: 'Bespoke designs' },
  { icon: '◔', label: 'Concierge Support', desc: 'Personal assistance' },
];

export default function ServicePromise() {
  return (
    <section
      className="py-14 md:py-20 lg:py-28"
      style={{ maxWidth: '100vw', backgroundColor: '#F6F1E8', borderTop: '1px solid rgba(212,176,122,0.2)' }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="label-caps mb-3" style={{ color: '#C6A15B' }}>Service</p>
          <h2 className="heading-serif text-2xl md:text-3xl font-light" style={{ color: '#211B18' }}>Our Promise to You</h2>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-0 border"
          style={{ borderColor: 'rgba(47,74,90,0.1)' }}
        >
          {SERVICES?.map((service, i) => (
            <div
              key={service?.label}
              className="p-5 md:p-6 flex flex-col items-center text-center transition-colors"
              style={{
                borderRight: (i + 1) % 2 === 0 ? 'none' : '1px solid rgba(47,74,90,0.08)',
                borderBottom: i >= SERVICES?.length - 2 ? 'none' : '1px solid rgba(47,74,90,0.08)',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(47,74,90,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span className="text-lg mb-2" style={{ color: '#C6A15B' }}>{service?.icon}</span>
              <h3 className="text-xs font-light tracking-wide mb-1" style={{ color: '#211B18' }}>{service?.label}</h3>
              <p className="text-[10px] font-light" style={{ color: '#5B4636' }}>{service?.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
