import React from 'react';
import { PackItem } from '../types';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ServicePatternBackground } from './ServicePatternBackground';

interface PacksSectionProps {
  packs: PackItem[];
  onSelectPackForDevis: (packTitle: string) => void;
  theme?: 'light' | 'dark';
}

export const PacksSection: React.FC<PacksSectionProps> = ({
  packs,
  onSelectPackForDevis,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  return (
    <section id="packs" className={`py-20 transition-colors duration-200 relative overflow-hidden ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#0d0d2e] text-white'
    }`}>
      {/* Recreated geometric square background pattern */}
      <ServicePatternBackground theme={theme} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
            isLight ? 'bg-slate-100 text-[#102A6B] border border-slate-200' : 'bg-[#6C68F4]/20 text-[#00C2C2]'
          }`}>
            <Sparkles className="w-4 h-4 text-[#5362DC] shrink-0" />
            <span className="whitespace-nowrap">Offres Packagées Clé en Main</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
            Packs pour Maximiser votre Impact
          </h2>
          <p className={`text-base ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Combinez la stratégie digitale et la régie événementielle avec nos bundles tout-compris pré-négociés.
          </p>
        </motion.div>

        {/* Packs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {packs.map((pack, index) => {
            const isPopular = pack.popular;
            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isLight
                    ? isPopular
                      ? 'bg-white border-2 border-[#5362DC] shadow-xl transform lg:-translate-y-2'
                      : 'bg-white border-2 border-slate-200 hover:border-slate-300 shadow-xs'
                    : isPopular
                      ? 'bg-[#141446] border-2 border-[#6C68F4] shadow-2xl shadow-[#6C68F4]/20 transform lg:-translate-y-2'
                      : 'bg-[#141446] border border-white/10 hover:border-white/30'
                }`}
              >
                {/* Popular Ribbon Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#5362DC] text-white text-[10px] md:text-xs font-black uppercase tracking-wider shadow-md whitespace-nowrap">
                    ★ Recommandé Forward One
                  </div>
                )}

                <div className="space-y-6">
                  
                  {/* Pack Image Banner */}
                  {pack.image && (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
                      <img
                        src={pack.image}
                        alt={pack.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] md:text-xs font-extrabold uppercase whitespace-nowrap bg-black/60 text-[#00C2C2] backdrop-blur-md border border-white/20">
                          {pack.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top info */}
                  <div>
                    {!pack.image && (
                      <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-extrabold uppercase whitespace-nowrap inline-block ${
                        isLight ? 'bg-slate-100 text-[#102A6B] border border-slate-200' : 'bg-white/10 text-[#00C2C2]'
                      }`}>
                        {pack.badge}
                      </span>
                    )}
                    <h3 className={`text-2xl font-extrabold ${pack.image ? 'mt-1' : 'mt-3'} break-words ${isLight ? 'text-black' : 'text-white'}`}>{pack.title}</h3>
                    <p className="text-xs text-[#5362DC] font-bold mt-1 break-words leading-snug">{pack.tagline}</p>
                  </div>

                  {/* Price Estimate */}
                  <div className={`p-4 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
                  }`}>
                    <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Estimation forfaitaire :</div>
                    <div className={`text-lg sm:text-xl font-black mt-1 break-words leading-tight ${isLight ? 'text-[#5362DC]' : 'text-white'}`}>{pack.priceEstimate}</div>
                  </div>

                  <p className={`text-xs leading-relaxed ${isLight ? 'text-black font-normal' : 'text-slate-300'}`}>
                    {pack.description}
                  </p>

                  {/* Inclusions Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <div className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-slate-400'}`}>
                      Ce que comprend ce pack :
                    </div>
                    {pack.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-[#5362DC] shrink-0 mt-0.5" />
                        <span className={`font-medium ${isLight ? 'text-black' : 'text-slate-200'}`}>{item}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Call to action */}
                <div className={`pt-8 mt-8 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                  <button
                    onClick={() => onSelectPackForDevis(pack.title)}
                    className="w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 text-white bg-[#5362DC] hover:bg-[#4351c4] shadow-md shadow-[#5362DC]/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">Demander ce Pack</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
