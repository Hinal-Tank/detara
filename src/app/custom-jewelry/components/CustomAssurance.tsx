import React from 'react';

const assurances = [
  {
    icon: '◈',
    title: 'Certified Diamonds',
    desc: 'Every diamond includes internationally recognized certification.',
  },
  {
    icon: '◻',
    title: 'Secure Payment',
    desc: 'All transactions are processed through secure, encrypted payment systems.',
  },
  {
    icon: '◎',
    title: 'Fully Insured Shipping',
    desc: 'Every piece is shipped fully insured with tracked delivery.',
  },
  {
    icon: '◇',
    title: 'Lifetime Care',
    desc: 'DETARA provides lifetime care and service for all custom pieces.',
  },
];

export default function CustomAssurance() {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 bg-bg border-t border-[rgba(28,25,23,0.06)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {assurances?.map((item, i) => (
            <div key={item?.title} className={`reveal-item delay-${i} text-center`}>
              <div className="text-2xl text-accent mb-4">{item?.icon}</div>
              <h3 className="font-serif text-base md:text-lg font-light text-foreground mb-2">
                {item?.title}
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed">{item?.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
