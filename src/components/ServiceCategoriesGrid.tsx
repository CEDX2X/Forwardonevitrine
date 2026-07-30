import React from 'react';
import { SiteContent, ServiceCategoryItem } from '../types';
import { initialServiceCategories } from '../data/initialData';
import { ArrowRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCategoriesGridProps {
  siteContent: SiteContent;
  theme?: 'light' | 'dark';
  onNavigateTab: (tab: string) => void;
}

export const ServiceCategoriesGrid: React.FC<ServiceCategoriesGridProps> = ({
  siteContent,
  theme = 'light',
  onNavigateTab
}) => {
  const isLight = theme === 'light';
  const categories: ServiceCategoryItem[] = siteContent?.serviceCategories && siteContent.serviceCategories.length > 0
    ? siteContent.serviceCategories
    : initialServiceCategories;

  return (
    <section className={`py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#0f0f33]'}`}>
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap ${
            isLight ? 'bg-slate-200 text-[#102A6B]' : 'bg-[#6C68F4]/20 text-[#00C2C2]'
          }`}>
            Nos Domaines d'Expertise
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
            Explorez nos pôles de services
          </h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Des solutions sur-mesure pour propulser votre communication digitale et orchestrer vos événements d'envergure.
          </p>
        </motion.div>

        {/* 3 Square Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const isMarketing = cat.type === 'marketing';
            const isLogistique = cat.type === 'logistique';

            const handleClick = () => {
              if (!cat.available) return;
              if (isMarketing) {
                onNavigateTab('services');
              } else if (isLogistique) {
                onNavigateTab('logistique');
              }
            };

            return (
              <motion.div
                key={cat.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={handleClick}
                className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col h-[520px] sm:h-[580px] ${
                  !cat.available
                    ? isLight
                      ? 'bg-white border-slate-300 opacity-90 cursor-not-allowed shadow-sm'
                      : 'bg-[#5362DC] border-white/20 opacity-85 cursor-not-allowed shadow-lg'
                    : isLight
                      ? 'bg-white border-slate-200 hover:border-[#5362DC] hover:shadow-2xl cursor-pointer shadow-md'
                      : 'bg-[#5362DC] border-white/20 hover:border-white hover:shadow-2xl cursor-pointer shadow-xl'
                }`}
              >
                {/* TOP 2/3: Image Zone */}
                <div className="relative h-[65%] w-full overflow-hidden bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ${
                      !cat.available ? 'grayscale opacity-75' : ''
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest bg-slate-950/80 backdrop-blur-md text-[#00C2C2] border border-white/10 shadow-md whitespace-nowrap">
                      {cat.title}
                    </span>
                  </div>

                  {/* Locked Badge if unavailable */}
                  {!cat.available && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-500/30 shadow-md flex items-center gap-1.5 whitespace-nowrap">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="whitespace-nowrap">Bientôt disponible</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* BOTTOM 1/3: Opaque Text Zone */}
                <div className={`h-[35%] w-full p-6 sm:p-7 flex flex-col justify-between border-t ${
                  isLight
                    ? 'bg-white border-slate-200'
                    : 'bg-[#5362DC] border-white/15'
                }`}>
                  <div className="space-y-2">
                    <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                      !cat.available
                        ? isLight ? 'text-slate-500' : 'text-slate-200'
                        : isLight ? 'text-black' : 'text-white'
                    }`}>
                      {cat.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                      isLight ? 'text-slate-600' : 'text-white/90'
                    }`}>
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-white/20">
                    {cat.available ? (
                      <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
                        isLight ? 'text-[#5362DC] group-hover:text-[#102A6B]' : 'text-white group-hover:text-[#00C2C2]'
                      } group-hover:translate-x-1.5 transition-all whitespace-nowrap`}>
                        <span className="whitespace-nowrap text-white">Voir nos offres</span>
                        <ArrowRight className="w-4 h-4 shrink-0 text-white group-hover:text-[#00C2C2]" />
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-amber-400 italic flex items-center gap-1.5 whitespace-nowrap">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">Service non disponible</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
