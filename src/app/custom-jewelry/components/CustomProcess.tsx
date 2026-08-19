import React from 'react';

const whyChoose = [
  {
    title: 'Unique Design',
    desc: 'Each piece is designed exclusively for the client — no two pieces are ever alike.',
    icon: '◇',
  },
  {
    title: 'Diamond Selection',
    desc: 'Carefully selected certified diamonds, chosen for exceptional brilliance and quality.',
    icon: '◈',
  },
  {
    title: 'Craftsmanship',
    desc: 'Expert jewelers create each piece with precision, care, and decades of experience.',
    icon: '◉',
  },
];

const steps = [
  {
    number: '01',
    title: 'Consultation',
    desc: 'A DETARA design specialist discusses your vision, preferred diamond shapes, metal options, and design direction.',
  },
  {
    number: '02',
    title: 'Diamond Selection',
    desc: 'A curated selection of certified diamonds is presented for your approval.',
  },
  {
    number: '03',
    title: 'Design Proposal',
    desc: 'A detailed design drawing and 3D rendering is created for review.',
  },
  {
    number: '04',
    title: 'Craftsmanship',
    desc: 'Your piece is handcrafted by experienced jewelers and inspected before delivery.',
  },
];

const metals = [
  '14K White Gold',
  '14K Yellow Gold',
  '14K Rose Gold',
  '18K White Gold',
  '18K Yellow Gold',
  '18K Rose Gold',
  'Platinum (950)',
];

export default function CustomProcess() {
  return (
    <>
      {/* Section 2 — Why Choose Custom */}
      <section className="py-16 md:py-24 lg:py-32 px-5 md:px-8 bg-bg">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-10 md:mb-14 lg:mb-20 reveal-item text-center">
            <p className="label-caps text-accent mb-4 tracking-[0.35em]">The Value of Bespoke</p>
            <h2 className="heading-display text-[clamp(2rem,4vw,4.5rem)] text-foreground leading-[0.92]">
              Why Clients Choose<br />
              <span className="italic font-light text-muted">Custom Jewelry</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {whyChoose?.map((item, i) => (
              <div key={item?.title} className={`reveal-item delay-${i} text-center md:text-left`}>
                <div className="w-12 h-12 flex items-center justify-center border border-accent/30 text-accent text-xl mb-5 md:mb-6 mx-auto md:mx-0">
                  {item?.icon}
                </div>
                <h3 className="font-serif text-lg md:text-xl lg:text-2xl font-light text-foreground mb-3 md:mb-4">
                  {item?.title}
                </h3>
                <p className="text-sm md:text-sm lg:text-base text-muted font-light leading-relaxed">
                  {item?.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section 3 — Custom Design Process */}
      <section className="py-16 md:py-24 lg:py-32 px-5 md:px-8 bg-bg-warm overflow-hidden">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-10 md:mb-14 lg:mb-20 reveal-item">
            <p className="label-caps text-accent mb-4 tracking-[0.35em]">The Process</p>
            <h2 className="heading-display text-[clamp(2rem,4vw,4.5rem)] text-foreground leading-[0.92]">
              The DETARA<br />
              <span className="italic font-light text-muted">Custom Process</span>
            </h2>
          </div>

          <div className="space-y-0">
            {steps?.map((step, i) => (
              <div
                key={step?.number}
                className={`reveal-item delay-${i} grid grid-cols-12 gap-5 md:gap-8 lg:gap-10 py-8 md:py-12 lg:py-16 border-b border-[rgba(28,25,23,0.08)] group`}
              >
                <div className="col-span-2 md:col-span-1">
                  <span className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-foreground/10 group-hover:text-accent/40 transition-colors duration-500">
                    {step?.number}
                  </span>
                </div>
                <div className="col-span-10 md:col-span-11">
                  <h3 className="font-serif text-lg md:text-xl lg:text-2xl font-light text-foreground mb-3 md:mb-4">
                    {step?.title}
                  </h3>
                  <p className="text-sm md:text-sm lg:text-base text-muted leading-relaxed font-light">
                    {step?.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Section 4 — Precious Metals */}
      <section className="py-16 md:py-24 lg:py-32 px-5 md:px-8 bg-bg">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-start">
            <div className="reveal-item">
              <p className="label-caps text-accent mb-4 tracking-[0.35em]">Materials</p>
              <h2 className="heading-display text-[clamp(2rem,3.5vw,4rem)] text-foreground leading-[0.92] mb-5 md:mb-6 lg:mb-8">
                Precious<br />
                <span className="italic font-light text-muted">Metals</span>
              </h2>
              <p className="text-sm md:text-sm lg:text-base text-muted font-light leading-relaxed mb-6 md:mb-8">
                DETARA custom jewelry can be crafted in a variety of precious metals depending on the design and client preference.
              </p>
              <p className="text-xs text-muted/60 font-light italic">
                Each metal is finished to enhance the brilliance and durability of the jewelry piece.
              </p>
            </div>

            <div className="reveal-item delay-1">
              <ul className="space-y-0">
                {metals?.map((m, i) => (
                  <li
                    key={m}
                    className="flex items-center justify-between py-3.5 md:py-4 border-b border-[rgba(28,25,23,0.07)] group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-1.5 h-1.5 bg-accent/50 rounded-full flex-shrink-0 group-hover:bg-accent transition-colors" />
                      <span className="text-sm md:text-sm lg:text-base text-foreground font-light">{m}</span>
                    </div>
                    <span className="text-xs text-muted/40 font-light">{String(i + 1)?.padStart(2, '0')}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted/60 font-light italic mt-6">
                Metal choice is finalized during the design consultation and configuration process.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Section 5 — Diamond Standards */}
      <section className="py-16 md:py-24 lg:py-32 px-5 md:px-8 bg-bg-warm">
        <div className="max-w-[1000px] mx-auto reveal-item">
          <p className="label-caps text-accent mb-4 tracking-[0.35em]">Quality Standards</p>
          <h2 className="heading-display text-[clamp(2rem,3.5vw,4rem)] text-foreground leading-[0.92] mb-5 md:mb-6 lg:mb-8">
            Exceptional Diamond<br />
            <span className="italic font-light text-muted">Standards</span>
          </h2>
          <p className="text-sm md:text-sm lg:text-base text-muted font-light leading-relaxed mb-10 md:mb-12 lg:mb-16 max-w-xl">
            All diamonds used in DETARA jewelry meet strict quality standards.
          </p>

          <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-10 md:mb-12 lg:mb-16">
            {[
              { label: 'Color', value: 'D–G', note: 'Near-colorless to colorless' },
              { label: 'Clarity', value: 'VVS', note: 'Very Very Slightly Included' },
              { label: 'Cut', value: 'Excellent', note: 'Maximum brilliance and fire' },
            ]?.map((spec) => (
              <div key={spec?.label} className="p-4 md:p-6 lg:p-8 bg-bg border border-[rgba(28,25,23,0.06)] text-center">
                <p className="label-caps text-accent mb-2 md:mb-3 tracking-[0.25em]">{spec?.label}</p>
                <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground mb-1 md:mb-2">{spec?.value}</p>
                <p className="text-xs text-muted font-light">{spec?.note}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <p className="label-caps text-foreground tracking-[0.25em]">Available Options</p>
            <div className="flex flex-wrap gap-3">
              {['Natural Diamonds', 'Lab-Grown Diamonds']?.map((t) => (
                <span key={t} className="px-4 md:px-5 py-2.5 md:py-3 border border-[rgba(28,25,23,0.15)] text-xs font-light text-muted tracking-wide">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted font-light italic">
            Each diamond includes internationally recognized certification.
          </p>
        </div>
      </section>
    </>
  );
}