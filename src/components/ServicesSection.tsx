import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { Sparkles, Check, ArrowRight, Compass, Code2, TrendingUp, Share2, Volume2, Zap, Box, Tv } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForDevis: (serviceTitle: string) => void;
  theme?: 'light' | 'dark';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForDevis,
  theme = 'light'
}) => {
  const [filter, setFilter] = useState<'Tous' | 'Marketing Digital' | 'Logistique Événementielle'>('Tous');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);

  const isLight = theme === 'light';

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

  const cardBordersLight = [
    'border-2 border-[#12B857]', // Sarcelle / Green (Logistique Événementielle in screenshot)
    'border-2 border-[#E85D75]', // Coral / Pink (Marketing Digital in screenshot)
    'border-2 border-[#5362DC]', // Purple
    'border-2 border-[#0EA5E9]', // Sky Blue
  ];

  return (
    <section id="services" className={`py-20 transition-colors duration-200 relative ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#0d0d2e] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isLight
              ? 'bg-slate-100 border border-slate-200 text-[#102A6B]'
              : 'bg-[#6C68F4]/20 text-[#00C2C2]'
          }`}>
            <span>Catalogue de Services</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Des Solutions sur-mesure pour Projeter votre Marque
          </h2>
          <p className={`text-base ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            Deux modules d'intervention hautement spécialisés, conçus pour répondre à toutes vos exigences de stratégie digitale et de régie événementielle.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mt-8 sm:mt-10 max-w-full overflow-x-auto scrollbar-none px-2">
          <div className={`inline-flex p-1.5 rounded-2xl gap-1 shrink-0 ${
            isLight
              ? 'bg-slate-100 border border-slate-200'
              : 'bg-[#141446] border border-white/10'
          }`}>
            {(['Tous', 'Marketing Digital', 'Logistique Événementielle'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-[#5362DC] text-white shadow-md shadow-[#5362DC]/20 font-bold'
                    : isLight
                      ? 'text-slate-700 hover:text-black hover:bg-slate-200/60'
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
          {filteredServices.map((service, index) => {
            const isDigital = service.category === 'Marketing Digital';
            const lightBorder = cardBordersLight[index % cardBordersLight.length];

            return (
              <div
                key={service.id}
                className={`group relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isLight
                    ? `bg-white ${lightBorder} shadow-xs hover:shadow-lg`
                    : `bg-white/5 border border-white/10 backdrop-blur-sm ${isDigital ? 'hover:border-[#6C68F4]/60' : 'hover:border-[#00C2C2]/60'}`
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Category Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${
                      isLight
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : isDigital
                          ? 'bg-[#6C68F4]/10 text-[#6C68F4] border-[#6C68F4]/30'
                          : 'bg-[#00C2C2]/10 text-[#00C2C2] border-[#00C2C2]/30'
                    }`}>
                      {service.category}
                    </span>
                    <div className={`p-3 rounded-xl border transition-transform group-hover:scale-105 ${
                      isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-900'
                        : `bg-white/5 ${isDigital ? 'text-[#6C68F4]' : 'text-[#00C2C2]'}`
                    }`}>
                      {renderIcon(service.iconName)}
                    </div>
                  </div>

                  {/* Title & Short Desc */}
                  <h3 className={`text-xl font-extrabold transition-colors ${
                    isLight ? 'text-black group-hover:text-[#5362DC]' : 'text-white group-hover:text-[#00C2C2]'
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isLight ? 'text-black font-normal' : 'text-[#738591]'
                  }`}>
                    {service.shortDescription}
                  </p>

                  {/* Feature Checklist */}
                  <div className="pt-2 space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          isLight
                            ? isDigital ? 'bg-[#E85D75]' : 'bg-[#12B857]'
                            : isDigital ? 'bg-[#6C68F4]' : 'bg-[#00C2C2]'
                        }`}></span>
                        <span className={`font-medium ${isLight ? 'text-black' : 'text-gray-300'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className={`pt-6 mt-6 border-t flex items-center justify-between ${
                  isLight ? 'border-slate-100' : 'border-white/10'
                }`}>
                  <button
                    onClick={() => setSelectedServiceModal(service)}
                    className={`text-xs font-extrabold underline cursor-pointer transition-colors ${
                      isLight ? 'text-black hover:text-[#5362DC]' : 'text-[#738591] hover:text-white'
                    }`}
                  >
                    Détails complets
                  </button>

                  <button
                    onClick={() => onSelectServiceForDevis(service.title)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#5362DC] hover:bg-[#4351c4] shadow-md shadow-[#5362DC]/20 active:scale-95 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isLight
              ? 'bg-white text-slate-900 border border-slate-200'
              : 'bg-[#141446] text-white border border-[#6C68F4]/40'
          }`}>
            
            <div className={`flex items-start justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>
                  {selectedServiceModal.category}
                </span>
                <h3 className={`text-2xl font-bold mt-1 ${isLight ? 'text-black' : 'text-white'}`}>
                  {selectedServiceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className={`p-1 text-xl font-bold cursor-pointer ${isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {selectedServiceModal.fullDescription}
            </p>

            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                Inclus dans cette prestation :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedServiceModal.deliverables.map((deliv, i) => (
                  <div key={i} className={`flex items-center gap-2.5 text-xs p-2.5 rounded-lg border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-black' : 'bg-white/5 border-white/10 text-slate-200'
                  }`}>
                    <Check className="w-4 h-4 text-[#5362DC] shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`pt-4 border-t flex items-center justify-end gap-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                  isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const title = selectedServiceModal.title;
                  setSelectedServiceModal(null);
                  onSelectServiceForDevis(title);
                }}
                className="px-5 py-2.5 bg-[#5362DC] hover:bg-[#4351c4] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Demander un Devis
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

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
