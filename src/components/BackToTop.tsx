import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  theme?: 'light' | 'dark';
}

export const BackToTop: React.FC<BackToTopProps> = ({ theme = 'light' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center ${
        isLight
          ? 'bg-[#102A6B] text-white hover:bg-[#5362DC] shadow-blue-900/20'
          : 'bg-[#6C68F4] text-white hover:bg-[#807dfe] shadow-indigo-500/30'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
