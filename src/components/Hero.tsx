import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroProps {
  siteContent: SiteContent;
  onOpenDevis: () => void;
  onExploreCatalog: () => void;
  onExplorePacks: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  siteContent,
  onOpenDevis,
  onExploreCatalog,
  onExplorePacks
}) => {
  return (
    <section className="relative overflow-hidden bg-[#141446] py-20 lg:py-28 text-white border-b border-[#6C68F4]/20">
      
      {/* Background Atmospheric Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#6C68F4] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00C2C2] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Background Graphic Lines Motif */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0C300 200 100 600 500 800" stroke="#6C68F4" strokeWidth="24" strokeLinecap="round" />
          <path d="M200 0C400 200 200 600 600 800" stroke="#00C2C2" strokeWidth="20" strokeLinecap="round" />
          <path d="M300 0C500 200 300 600 700 800" stroke="#FFAD5B" strokeWidth="16" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6C68F4]/10 border border-[#6C68F4]/30 text-[#00C2C2] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FFAD5B]" />
              <span>Marketing Digital & Logistique Événementielle</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.95] text-white uppercase max-w-3xl">
              PROGRESS <span className="text-[#6C68F4]">WITHOUT</span> LIMITS
            </h1>

            {/* Subtitle with border accent */}
            <p className="text-sm sm:text-lg text-[#738591] max-w-2xl font-normal leading-relaxed border-l-2 border-[#00C2C2] pl-4 sm:pl-6">
              {siteContent.heroSubtitle || "Architectures digitales haute performance et logistique événementielle intégrée. Nous transformons vos visions en réalités opérationnelles."}
            </p>

            {/* Key Differentiators / Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C68F4] shrink-0"></span>
                <span>Stratégie Marketing & Branding 360°</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2C2] shrink-0"></span>
                <span>Régie Son, Lumière & Vidéo Pro</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFAD5B] shrink-0"></span>
                <span>Catalogue Matériel & Pré-réservation</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C68F4] shrink-0"></span>
                <span>Back-Office d'Administration Sécurisé</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                onClick={onOpenDevis}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-[#FFAD5B] text-[#141446] rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#ff9d3d] active:scale-98 shadow-lg shadow-[#FFAD5B]/20 transition-all cursor-pointer"
              >
                <span>Obtenir un Devis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 hover:bg-[#00C2C2]/20 active:scale-98 uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Catalogue Matériel</span>
              </button>

              <button
                onClick={onExplorePacks}
                className="w-full sm:w-auto text-center px-4 py-2.5 sm:py-3.5 text-xs font-semibold text-[#738591] hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Découvrir nos Packs
              </button>
            </div>

            {/* Key Performance Indicators */}
            <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/10">
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-[10px] sm:text-xs text-[#738591] mt-1 uppercase tracking-wider font-medium">Maîtrise Technique</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-[#00C2C2]">+150</div>
                <div className="text-[10px] sm:text-xs text-[#738591] mt-1 uppercase tracking-wider font-medium">Événements Réussis</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-[#FFAD5B]">24h</div>
                <div className="text-[10px] sm:text-xs text-[#738591] mt-1 uppercase tracking-wider font-medium">Délai Devis</div>
              </div>
            </div>

          </div>

          {/* Right Column: Immersive UI Modules Grid */}
          <div className="lg:col-span-5 relative space-y-6">
            
            {/* Module 1 Card */}
            <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-[#6C68F4]/50 transition-all">
              <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-[#00C2C2] font-bold bg-[#00C2C2]/10 px-2.5 py-1 rounded">
                Module 01
              </div>
              <div className="w-12 h-12 bg-[#6C68F4]/20 rounded-xl flex items-center justify-center mb-6 text-[#6C68F4]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Marketing Digital</h3>
              <p className="text-[#738591] text-sm mb-6 leading-relaxed">
                Stratégie SEO, campagnes data-driven, branding et création web Next.js pour maximiser votre empreinte numérique.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C68F4]"></span> Analyse de Performance & SEO
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6C68F4]"></span> Optimisation Conversion & Ads
                </li>
              </ul>
            </div>

            {/* Module 2 Card */}
            <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-[#00C2C2]/50 transition-all">
              <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest text-[#FFAD5B] font-bold bg-[#FFAD5B]/10 px-2.5 py-1 rounded">
                Module 02
              </div>
              <div className="w-12 h-12 bg-[#00C2C2]/20 rounded-xl flex items-center justify-center mb-6 text-[#00C2C2]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Logistique Événementielle</h3>
              <p className="text-[#738591] text-sm mb-6 leading-relaxed">
                Catalogue de matériel premium (L-Acoustics, GrandMA, écrans LED), gestion des packs et coordination technique d'exception.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2C2]"></span> Location Son, Lumière & Vidéo
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2C2]"></span> Pré-réservation Directe en Ligne
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
