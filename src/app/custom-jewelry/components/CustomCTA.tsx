'use client';

import React from 'react';

export default function CustomCTA() {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('custom-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 md:py-40 px-5 md:px-8 bg-foreground text-center">
      <div className="max-w-[800px] mx-auto reveal-item">
        <p className="label-caps text-accent mb-6 tracking-[0.4em]">Begin Your Journey</p>
        <h2 className="heading-display text-[clamp(2.5rem,5.5vw,5.5rem)] text-white font-light leading-[0.9] mb-8 md:mb-10">
          Create Your Custom<br />
          <span className="italic opacity-65">Diamond Piece</span>
        </h2>
        <div className="w-12 h-[1px] bg-accent mx-auto mb-8 md:mb-10" />
        <p className="text-base md:text-lg text-white/60 font-light leading-relaxed mb-10 md:mb-14 max-w-lg mx-auto">
          Begin your bespoke jewelry journey with DETARA.
        </p>
        <button
          onClick={scrollToForm}
          className="inline-flex items-center justify-center px-12 py-4 bg-accent text-white text-[11px] font-medium tracking-[0.25em] uppercase hover:bg-accent-dark transition-colors min-h-[52px]"
        >
          Start Your Custom Design
        </button>
      </div>
    </section>
  );
}
