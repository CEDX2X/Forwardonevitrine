import React from 'react';
import { SiteContent } from '../types';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TestimonialsSectionProps {
  siteContent: SiteContent;
  theme?: 'light' | 'dark';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ siteContent, theme = 'light' }) => {
  const isLight = theme === 'light';
  const testimonials = siteContent.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className={`py-20 transition-colors duration-200 relative overflow-hidden ${
      isLight ? 'bg-slate-50 text-slate-900 border-y border-slate-200' : 'bg-[#0f0f33] text-white border-y border-white/10'
    }`}>
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#6C68F4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isLight ? 'bg-white text-[#102A6B] border border-slate-200 shadow-xs' : 'bg-[#6C68F4]/20 text-[#00C2C2] border border-[#6C68F4]/30'
          }`}>
            <Star className="w-3.5 h-3.5 fill-[#FFAD5B] text-[#FFAD5B]" />
            <span>Témoignages & Avis Clients</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
            {siteContent.testimonialsTitle || "Ce Que Disent Nos Clients"}
          </h2>

          <p className={`text-base leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {siteContent.testimonialsSubtitle || "La satisfaction de nos partenaires est la preuve irréfutable de notre quête d’excellence."}
          </p>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <motion.div
              key={testi.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-3xl border relative flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm hover:border-[#5362DC]'
                  : 'bg-[#141446] border-white/10 hover:border-[#6C68F4]/50 shadow-xl'
              }`}
            >
              <Quote className={`absolute top-6 right-6 w-10 h-10 opacity-15 pointer-events-none ${
                isLight ? 'text-[#5362DC]' : 'text-[#6C68F4]'
              }`} />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(testi.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFAD5B] text-[#FFAD5B]" />
                  ))}
                </div>

                {/* Comment text */}
                <p className={`text-sm leading-relaxed italic ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  "{testi.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className={`mt-6 pt-6 border-t flex items-center gap-4 ${
                isLight ? 'border-slate-100' : 'border-white/10'
              }`}>
                {testi.avatar ? (
                  <img
                    src={testi.avatar}
                    alt={testi.clientName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#5362DC]/30 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${
                    isLight ? 'bg-[#5362DC]/10 text-[#5362DC]' : 'bg-[#6C68F4]/20 text-[#00C2C2]'
                  }`}>
                    {testi.clientName.charAt(0)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className={`font-bold text-sm truncate flex items-center gap-1.5 ${isLight ? 'text-black' : 'text-white'}`}>
                    <span>{testi.clientName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Client Vérifié" />
                  </h4>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {testi.clientRole} — <strong className={isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}>{testi.company}</strong>
                  </p>
                  {testi.date && (
                    <span className={`text-[10px] block mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {testi.date}
                    </span>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
