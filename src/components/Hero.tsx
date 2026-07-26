import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroProps {
  siteContent: SiteContent;
  onOpenDevis: () => void;
  onExploreCatalog: () => void;
  onExplorePacks: () => void;
  theme?: 'light' | 'dark';
}

export const Hero: React.FC<HeroProps> = ({
  siteContent,
  onOpenDevis,
  onExploreCatalog,
  onExplorePacks,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 transition-colors duration-200 border-b ${
      isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#141446] text-white border-[#6C68F4]/20'
    }`}>
      
      {/* Background Atmospheric Glows */}
      {!isLight && (
        <>
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#6C68F4] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00C2C2] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isLight
                ? 'bg-slate-100 border border-slate-200 text-[#102A6B]'
                : 'bg-[#6C68F4]/10 border border-[#6C68F4]/30 text-[#00C2C2]'
            }`}>
              <Sparkles className="w-4 h-4 text-[#5362DC]" />
              <span>Marketing Digital & Logistique Événementielle</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.95] uppercase max-w-3xl ${
              isLight ? 'text-black' : 'text-white'
            }`}>
              PROGRESS <span className="text-[#5362DC]">WITHOUT</span> LIMITS
            </h1>

            {/* Subtitle with border accent */}
            <p className={`text-base sm:text-lg max-w-2xl font-normal leading-relaxed border-l-2 pl-4 sm:pl-6 ${
              isLight ? 'text-slate-700 border-[#12B857]' : 'text-[#738591] border-[#00C2C2]'
            }`}>
              {siteContent.heroSubtitle || "Architectures digitales haute performance et logistique événementielle intégrée. Nous transformons vos visions en réalités opérationnelles."}
            </p>

            {/* Key Differentiators / Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              <div className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${isLight ? 'text-black' : 'text-gray-300'}`}>
                <span className="w-2 h-2 rounded-full bg-[#5362DC] shrink-0"></span>
                <span>Stratégie Marketing & Branding 360°</span>
              </div>
              <div className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${isLight ? 'text-black' : 'text-gray-300'}`}>
                <span className="w-2 h-2 rounded-full bg-[#12B857] shrink-0"></span>
                <span>Régie Son, Lumière & Vidéo Pro</span>
              </div>
              <div className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${isLight ? 'text-black' : 'text-gray-300'}`}>
                <span className="w-2 h-2 rounded-full bg-[#E85D75] shrink-0"></span>
                <span>Catalogue Matériel & Pré-réservation</span>
              </div>
              <div className={`flex items-center gap-3 text-xs sm:text-sm font-medium ${isLight ? 'text-black' : 'text-gray-300'}`}>
                <span className="w-2 h-2 rounded-full bg-[#5362DC] shrink-0"></span>
                <span>Back-Office d'Administration Sécurisé</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                onClick={onOpenDevis}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-[#5362DC] hover:bg-[#4351c4] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider active:scale-98 shadow-lg shadow-[#5362DC]/20 transition-all cursor-pointer"
              >
                <span>Obtenir un Devis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCatalog}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm active:scale-98 uppercase tracking-wider transition-all cursor-pointer ${
                  isLight
                    ? 'text-[#102A6B] bg-[#102A6B]/10 border border-[#102A6B]/30 hover:bg-[#102A6B]/20'
                    : 'text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 hover:bg-[#00C2C2]/20'
                }`}
              >
                <span>Catalogue Matériel</span>
              </button>

              <button
                onClick={onExplorePacks}
                className={`w-full sm:w-auto text-center px-4 py-2.5 sm:py-3.5 text-xs font-semibold underline underline-offset-4 cursor-pointer ${
                  isLight ? 'text-slate-600 hover:text-black' : 'text-[#738591] hover:text-white'
                }`}
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
