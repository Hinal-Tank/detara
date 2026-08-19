import React from 'react';
import AppImage from '@/components/ui/AppImage';

const galleryItems = [
{
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_173eddb81-1773481801355.png",
  alt: 'Custom diamond engagement ring with round brilliant solitaire in platinum setting — DETARA bespoke',
  label: 'Custom Engagement Rings'
},
{
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_1e2e993aa-1766488433050.png",
  alt: 'Custom diamond necklace with delicate pendant in 18K white gold — DETARA bespoke jewelry',
  label: 'Custom Diamond Necklaces'
},
{
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_1d2edd610-1772212098743.png",
  alt: 'Custom diamond tennis bracelet in yellow gold with brilliant cut stones — DETARA bespoke',
  label: 'Custom Bracelets'
},
{
  src: "https://img.rocket.new/generatedImages/rocket_gen_img_1b1e3f789-1778920578376.png",
  alt: 'Custom diamond drop earrings in rose gold with pear shaped diamonds — DETARA bespoke',
  label: 'Custom Earrings'
}];


export default function CustomGallery() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-5 md:px-8 bg-bg">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-10 md:mb-14 lg:mb-20 reveal-item">
          <p className="label-caps text-accent mb-4 tracking-[0.35em]">Portfolio</p>
          <h2 className="heading-display text-[clamp(2rem,4vw,4.5rem)] text-foreground leading-[0.92]">
            Custom Jewelry<br />
            <span className="italic font-light text-muted">Gallery</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {galleryItems?.map((item, i) =>
          <div key={item?.label} className={`reveal-item delay-${i} group`}>
              <div className="relative overflow-hidden bg-bg-warm aspect-[4/3]">
                <AppImage
                src={item?.src}
                alt={item?.alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              </div>
              <div className="pt-4 md:pt-5 pb-2">
                <p className="label-caps text-foreground tracking-[0.25em]">{item?.label}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}