import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { Sparkles, Check, ArrowRight, Compass, Code2, TrendingUp, Share2, Volume2, Zap, Box, Tv } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForDevis: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForDevis
}) => {
  const [filter, setFilter] = useState<'Tous' | 'Marketing Digital' | 'Logistique Événementielle'>('Tous');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Code2': return <Code2 className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Share2': return <Share2 className="w-6 h-6" />;
      case 'Volume2': return <Volume2 className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Box': return <Box className="w-6 h-6" />;
      case 'Tv': return <Tv className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const filteredServices = services.filter((s) => {
    if (filter === 'Tous') return true;
    return s.category === filter;
  });

  return (
    <section id="services" className="py-20 bg-[#0d0d2e] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C68F4]/20 text-[#00C2C2] text-xs font-semibold uppercase tracking-wider">
            <span>Catalogue de Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Des Solutions sur-mesure pour Projeter votre Marque
          </h2>
          <p className="text-slate-300 text-base">
            Deux modules d'intervention hautement spécialisés, conçus pour répondre à toutes vos exigences de stratégie digitale et de régie événementielle.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mt-8 sm:mt-10 max-w-full overflow-x-auto scrollbar-none px-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#141446] border border-white/10 gap-1 shrink-0">
            {(['Tous', 'Marketing Digital', 'Logistique Événementielle'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
          {filteredServices.map((service) => {
            const isDigital = service.category === 'Marketing Digital';
            const accentColor = isDigital ? 'text-[#6C68F4]' : 'text-[#00C2C2]';
            const borderColor = isDigital ? 'hover:border-[#6C68F4]/60' : 'hover:border-[#00C2C2]/60';
            const badgeBg = isDigital ? 'bg-[#6C68F4]/10 text-[#6C68F4] border-[#6C68F4]/30' : 'bg-[#00C2C2]/10 text-[#00C2C2] border-[#00C2C2]/30';

            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${borderColor}`}
              >
                <div className="space-y-4">
                  
                  {/* Category Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${badgeBg}`}>
                      {service.category}
                    </span>
                    <div className={`p-3 rounded-xl bg-white/5 ${accentColor} group-hover:scale-110 transition-transform`}>
                      {renderIcon(service.iconName)}
                    </div>
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00C2C2] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#738591] leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Feature Checklist */}
                  <div className="pt-2 space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${isDigital ? 'bg-[#6C68F4]' : 'bg-[#00C2C2]'} shrink-0`}></span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedServiceModal(service)}
                    className="text-xs font-bold text-[#738591] hover:text-white underline cursor-pointer"
                  >
                    Détails complets
                  </button>

                  <button
                    onClick={() => onSelectServiceForDevis(service.title)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#6C68F4] hover:bg-[#5b57e0] shadow-md shadow-[#6C68F4]/20 transition-all cursor-pointer"
                  >
                    <span>Demander Devis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#141446] border border-[#6C68F4]/40 p-6 sm:p-8 space-y-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#00C2C2] uppercase tracking-wider">
                  {selectedServiceModal.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedServiceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="p-1 text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Image Preview */}
            <div className="h-48 rounded-xl overflow-hidden relative">
              <img
                src={selectedServiceModal.image}
                alt={selectedServiceModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141446] via-transparent to-transparent"></div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedServiceModal.fullDescription}
            </p>

            {/* Detailed Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFAD5B]">Inclusions & Prestations :</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedServiceModal.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-[#00C2C2]" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
              >
                Fermer
              </button>

              <button
                onClick={() => {
                  const title = selectedServiceModal.title;
                  setSelectedServiceModal(null);
                  onSelectServiceForDevis(title);
                }}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer"
              >
                Inclure dans mon Devis
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
