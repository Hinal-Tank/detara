import React from 'react';

const timelineSteps = [
  { phase: 'Consultation', duration: '1–2 days', icon: '01' },
  { phase: 'Design Proposal', duration: '3–5 days', icon: '02' },
  { phase: 'Production', duration: '4–6 weeks', icon: '03' },
  { phase: 'Delivery', duration: 'Fully insured shipping', icon: '04' },
];

export default function CustomTimeline() {
  return (
    <section className="py-20 md:py-32 px-5 md:px-8 bg-bg-warm">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-14 md:mb-20 reveal-item text-center">
          <p className="label-caps text-accent mb-4 tracking-[0.35em]">Timeline</p>
          <h2 className="heading-display text-[clamp(2rem,4.5vw,4.5rem)] text-foreground leading-[0.92]">
            From Concept<br />
            <span className="italic font-light text-muted">to Creation</span>
          </h2>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:grid grid-cols-4 gap-0 reveal-item">
          {timelineSteps?.map((step, i) => (
            <div key={step?.phase} className="relative">
              {/* Connector line */}
              {i < timelineSteps?.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-[1px] bg-[rgba(28,25,23,0.12)]" />
              )}
              <div className="flex flex-col items-center text-center px-6">
                <div className="relative z-10 w-12 h-12 flex items-center justify-center border border-accent/40 bg-bg mb-6">
                  <span className="font-serif text-sm font-light text-accent">{step?.icon}</span>
                </div>
                <h3 className="font-serif text-lg font-light text-foreground mb-2">{step?.phase}</h3>
                <p className="text-xs text-muted font-light tracking-wide">{step?.duration}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0 reveal-item">
          {timelineSteps?.map((step, i) => (
            <div key={step?.phase} className="flex gap-6 pb-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center border border-accent/40 bg-bg flex-shrink-0">
                  <span className="font-serif text-xs font-light text-accent">{step?.icon}</span>
                </div>
                {i < timelineSteps?.length - 1 && (
                  <div className="w-[1px] flex-1 bg-[rgba(28,25,23,0.12)] mt-3" />
                )}
              </div>
              <div className="pt-2">
                <h3 className="font-serif text-lg font-light text-foreground mb-1">{step?.phase}</h3>
                <p className="text-xs text-muted font-light">{step?.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
