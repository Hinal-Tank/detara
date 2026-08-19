'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal-item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    items?.forEach((item) => observer?.observe(item));

    return () => observer?.disconnect();
  }, []);

  return null;
}