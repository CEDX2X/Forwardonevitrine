import React, { useState, useEffect } from 'react';
import { SiteContent } from '../types';

interface HeroProps {
  siteContent: SiteContent;
  theme?: 'light' | 'dark';
}

export const Hero: React.FC<HeroProps> = ({
  siteContent,
  theme = 'light'
}) => {
  const allSlides = siteContent?.heroSlides || [];
  const slides = allSlides.filter((s) => s.image && s.image.trim() !== '');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#0a0a28] via-[#141446] to-[#0c0c28] text-white py-20 sm:py-28 select-none border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00C2C2]/20 text-[#00C2C2] border border-[#00C2C2]/30">
            <span>{siteContent?.heroSlogan || "Mouvement. Excellence. Leadership."}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {siteContent?.heroTitle || "Progress Without Limits."}
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {siteContent?.heroSubtitle || "Forward One propulse votre marque et façonne vos événements avec une maîtrise d'exception."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#0a0a23] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Immersive image scrolling zone without text, buttons or redirection */}
      <div className="relative w-full h-[520px] xs:h-[600px] sm:h-[760px] md:h-[860px] lg:h-[960px]">
        
        {/* Slides rendering with smooth crossfade transition */}
        {slides.map((s, idx) => (
          <div
            key={s.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <img
              src={s.image}
              alt={s.title || "Slide"}
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}

        {/* Minimalist dot indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
