'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomepageSection } from '@/lib/supabase/homepageService';

interface HeroSectionProps {
  section: HomepageSection | null;
}

export default function HeroSection({ section }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  // Start false on both server and client — updated after mount only
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // Mounted flag prevents any SSR/client branch divergence
  const [mounted, setMounted] = useState(false);

  const title = section?.title || 'EUROPEAN DIAMOND JEWELLERY';
  const subtitle = section?.subtitle || 'Precision-crafted. Quietly exceptional.';
  const description = section?.description || 'IGI & GIA Certified · Natural & Lab-Grown · Worldwide Delivery';
  const ctaText = section?.cta_text || 'SHOP COLLECTION';
  const ctaHref = section?.cta_href || '/products';
  const secondaryCtaText = section?.secondary_cta_text || 'DESIGN YOUR JEWELLERY';
  const secondaryCtaHref = section?.secondary_cta_href || '/custom-jewelry';
  const imageUrl = section?.image_url || 'https://img.rocket.new/generatedImages/rocket_gen_img_147bb36e3-1786049051962.png';
  const videoUrl = section?.video_url || null;
  const videoPoster = section?.video_poster_url || imageUrl;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Only show video after mount (client-only) to avoid SSR/client mismatch
  const showVideo = mounted && videoUrl && !prefersReducedMotion;
  const isRemoteImage = imageUrl.startsWith('http');

  return (
    <section
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{
        height: '100svh',
        minHeight: '100svh',
        maxWidth: '100%',
        backgroundColor: '#5B4636'
      }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={videoPoster}
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-80' : 'opacity-0'}`}
              style={{ objectPosition: 'center' }}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
            {!videoLoaded && (
              isRemoteImage ? (
                <Image
                  src={videoPoster}
                  alt="DETARA diamond jewellery"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                  className="object-cover opacity-80"
                  style={{ objectPosition: 'center center' }}
                  quality={85}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={videoPoster}
                  alt="DETARA diamond jewellery"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  style={{ objectPosition: 'center center' }}
                  fetchPriority="high"
                />
              )
            )}
          </>
        ) : (
          isRemoteImage ? (
            <Image
              src={imageUrl}
              alt="European model wearing minimal diamond jewelry — DETARA editorial"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover opacity-60"
              style={{ objectPosition: 'center center' }}
              quality={85}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="European model wearing minimal diamond jewelry — DETARA editorial"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              style={{ objectPosition: 'center center' }}
              fetchPriority="high"
              loading="eager"
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B4636]/25 via-transparent to-[#5B4636]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5B4636]/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-end pb-10 sm:pb-16 md:pb-24 px-5 md:px-8 w-full"
        style={{ height: '100%', minHeight: '100%', paddingTop: 'clamp(100px, 18vh, 240px)' }}
      >
        <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center text-center md:items-start md:text-left">
          <div className="w-full max-w-2xl">
            <p className="label-caps mb-2 tracking-[0.35em]" style={{ color: '#C6A15B' }}>European Diamond Jewellery</p>
            <h1 className="heading-display text-[clamp(2rem,7vw,5.5rem)] text-white font-light mb-4 md:mb-8 leading-[0.95]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-white/80 font-light mb-3 tracking-wide italic">{subtitle}</p>
            )}
            <p className="text-sm text-white/60 font-light mb-5 md:mb-8 tracking-wide">{description}</p>
            <div className="w-16 md:w-20 h-[1px] opacity-60 mb-5 md:mb-10 mx-auto md:mx-0" style={{ backgroundColor: '#C6A15B' }} />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href={ctaHref}
                className="btn-primary-hero text-center"
                style={{ touchAction: 'manipulation' }}
              >
                {ctaText}
              </Link>
              <Link
                href={secondaryCtaHref}
                className="text-center"
                style={{
                  border: '1.5px solid rgba(247,245,241,0.6)',
                  color: '#F6F1E8',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  padding: '16px 32px',
                  minHeight: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                  touchAction: 'manipulation',
                  width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F6F1E8'; e.currentTarget.style.backgroundColor = 'rgba(247,245,241,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(247,245,241,0.6)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {secondaryCtaText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hidden md:flex absolute bottom-10 right-12 z-10 flex-col items-center gap-3">
        <span
          className="label-caps text-white/40 tracking-[0.4em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full hero-scroll-line"
            style={{ height: '100%', backgroundColor: '#C6A15B' }}
          />
        </div>
      </div>
    </section>
  );
}
