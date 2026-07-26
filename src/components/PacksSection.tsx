import React from 'react';
import { PackItem } from '../types';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PacksSectionProps {
  packs: PackItem[];
  onSelectPackForDevis: (packTitle: string) => void;
}

export const PacksSection: React.FC<PacksSectionProps> = ({
  packs,
  onSelectPackForDevis
}) => {
  return (
    <section id="packs" className="py-20 bg-[#0d0d2e] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C68F4]/20 text-[#00C2C2] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#FFAD5B]" />
            <span>Offres Packagées Clé en Main</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Des Packs Conçus pour Maximiser votre Impact
          </h2>
          <p className="text-slate-300 text-base">
            Combinez la stratégie digitale et la régie événementielle avec nos bundles tout-compris pré-négociés.
          </p>
        </div>

        {/* Packs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {packs.map((pack) => {
            const isPopular = pack.popular;
            return (
              <div
                key={pack.id}
                className={`relative rounded-2xl bg-[#141446] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'border-2 border-[#6C68F4] shadow-2xl shadow-[#6C68F4]/20 transform lg:-translate-y-2'
                    : 'border border-white/10 hover:border-white/30'
                }`}
              >
                {/* Popular Ribbon Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#6C68F4] to-[#00C2C2] text-white text-xs font-black uppercase tracking-wider shadow-md">
                    ★ Recommandé Forward One
                  </div>
                )}

                <div className="space-y-6">
                  
                  {/* Top info */}
                  <div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-white/10 text-[#00C2C2]">
                      {pack.badge}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-3">{pack.title}</h3>
                    <p className="text-xs text-[#FFAD5B] font-medium mt-1">{pack.tagline}</p>
                  </div>

                  {/* Price Estimate */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-slate-400">Estimation forfaitaire :</div>
                    <div className="text-xl font-extrabold text-white mt-1">{pack.priceEstimate}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pack.description}
                  </p>

                  {/* Inclusions Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Ce que comprend ce pack :</div>
                    {pack.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-[#00C2C2] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Call to action */}
                <div className="pt-8 mt-8 border-t border-white/10">
                  <button
                    onClick={() => onSelectPackForDevis(pack.title)}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-[#6C68F4] hover:bg-[#5b57e0] text-white shadow-lg shadow-[#6C68F4]/30'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>Demander ce Pack</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
