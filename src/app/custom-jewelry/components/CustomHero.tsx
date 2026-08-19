'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';

export default function CustomHero() {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('custom-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] lg:min-h-screen flex items-end pb-16 md:pb-24 lg:pb-36 overflow-hidden bg-foreground pt-20 md:pt-28 lg:pt-32">
      {/* Background image */}
      <div className="absolute inset-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_176ff815f-1778929838573.png"
          alt="Luxury bespoke diamond jewelry atelier — DETARA custom design studio"
          fill
          priority={true}
          className="object-cover object-center opacity-45"
          sizes="100vw" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/25 to-foreground/85" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 w-full">
        <div className="reveal-item max-w-3xl">
          <p className="label-caps text-accent mb-5 md:mb-6 lg:mb-8 tracking-[0.4em]">DETARA Bespoke · Custom Atelier</p>
          <h1 className="heading-display text-[clamp(2.4rem,5.5vw,7rem)] text-white font-light leading-[0.88] mb-6 md:mb-8 lg:mb-10">
            Bespoke Diamond<br />
            <span className="italic opacity-65">Jewelry</span>
          </h1>
          <div className="w-16 h-[1px] bg-accent mb-6 md:mb-8 lg:mb-10" />
          <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed font-light max-w-2xl mb-8 md:mb-10 lg:mb-12">
            Every DETARA custom piece begins with a conversation. Our design team works closely with each client to create jewelry that reflects personal style, exceptional diamonds, and timeless craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToForm}
              className="btn-primary min-h-[52px] px-8 md:px-10 text-center">
              
              Start Your Custom Design
            </button>
            <button
              onClick={scrollToForm}
              className="btn-secondary min-h-[52px] px-8 md:px-10 text-center border-white/40 text-white hover:border-white hover:text-white">
              
              Book Design Consultation
            </button>
          </div>
        </div>
      </div>
    </section>);

}