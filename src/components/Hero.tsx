import React, { useState, useEffect } from 'react';
import { SiteContent, CarouselSlideItem } from '../types';

interface HeroProps {
  siteContent: SiteContent;
  theme?: 'light' | 'dark';
}

const defaultSlides: CarouselSlideItem[] = [
  {
    id: 'slide-1',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=85',
    buttonText: '',
    tab: ''
  },
  {
    id: 'slide-2',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=85',
    buttonText: '',
    tab: ''
  },
  {
    id: 'slide-3',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85',
    buttonText: '',
    tab: ''
  },
  {
    id: 'slide-4',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1800&q=85',
    buttonText: '',
    tab: ''
  },
  {
    id: 'slide-5',
    title: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=85',
    buttonText: '',
    tab: ''
  }
];

export const Hero: React.FC<HeroProps> = ({
  siteContent,
  theme = 'light'
}) => {
  const slides = siteContent?.heroSlides && siteContent.heroSlides.length > 0 ? siteContent.heroSlides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

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
              alt="Slide"
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}

        {/* Minimalist dot indicators */}
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

      </div>
    </section>
  );
};
