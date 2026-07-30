import React from 'react';
import { SiteContent } from '../types';
import { ForwardOneLogo } from './ForwardOneLogo';
import { Award, Compass, Sparkles, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ServicePatternBackground } from './ServicePatternBackground';

interface AboutSectionProps {
  siteContent: SiteContent;
  onOpenDevis: () => void;
  onOpenAdminLogin: () => void;
  theme?: 'light' | 'dark';
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  siteContent,
  onOpenDevis,
  onOpenAdminLogin,
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  return (
    <section id="about" className={`py-20 transition-colors duration-200 relative overflow-hidden ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#0d0d2e] text-white'
    }`}>
      {/* Recreated geometric square background pattern */}
      <ServicePatternBackground theme={theme} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Top Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isLight ? 'bg-slate-100 border border-slate-200 text-[#102A6B]' : 'bg-[#6C68F4]/20 text-[#00C2C2]'
          }`}>
            <span>À Propos de Forward One</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
            {siteContent.aboutHeadline}
          </h2>
          <p className={`text-base leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {siteContent.aboutStory}
          </p>
        </motion.div>

        {/* Highlight Feature: "Pourquoi la flèche dans le logo ?" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`rounded-3xl border p-8 sm:p-12 shadow-2xl relative overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-gradient-brand-2 border-[#6C68F4]/30'
          }`}
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Visual Brand Icon & Logo Breakdown */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className={`inline-block p-6 rounded-2xl border shadow-xl ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141446] border-white/10'
              }`}>
                <ForwardOneLogo variant={isLight ? 'dark' : 'light'} size="lg" onAdminTrigger={onOpenAdminLogin} />
              </div>

              <div className="space-y-2">
                <h3 className={`text-2xl font-bold ${isLight ? 'text-black' : 'text-white'}`}>Pourquoi la flèche dans le logo ?</h3>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>
                  La signature visuelle de l'identité Forward One
                </p>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                La flèche n'est pas un simple élément décoratif. Elle raconte l'histoire d'une marque qui ne s'arrête jamais, qui pousse ses clients vers de nouveaux horizons digitaux et événementiels.
              </p>
            </div>

            {/* Right Column: The 4 Pillars from the Brand Guide */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Pillar 1 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isLight ? 'bg-[#5362DC]/10 text-[#5362DC]' : 'bg-[#6C68F4]/20 text-[#6C68F4]'}`}>
                  01
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-black' : 'text-white'}`}>Mouvement & Progression</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  L'élan vers l'avant, le dépassement de soi. Une marque en marche constante où tout est en évolution.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isLight ? 'bg-[#5362DC]/10 text-[#5362DC]' : 'bg-[#00C2C2]/20 text-[#00C2C2]'}`}>
                  02
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-black' : 'text-white'}`}>Direction & Leadership</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Une flèche montre le chemin. Elle positionne Forward One comme un guide qui maîtrise son cap et emmène ses clients vers la réussite.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isLight ? 'bg-[#FFAD5B]/10 text-[#FFAD5B]' : 'bg-[#FFAD5B]/20 text-[#FFAD5B]'}`}>
                  03
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-black' : 'text-white'}`}>Excellence & Numéro 1</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Symbole de performance et de position dominante. Forward One, c'est le numéro 1 qui ouvre la voie sans concession.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isLight ? 'bg-[#5362DC]/10 text-[#5362DC]' : 'bg-[#6C68F4]/20 text-[#00C2C2]'}`}>
                  04
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-black' : 'text-white'}`}>Simplicité & Mémorisation</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Un symbole universel immédiatement reconnaissable qui gravera la marque de manière indélébile dans les esprits.
                </p>
              </div>

            </div>

          </div>

        </motion.div>

        {/* Brand Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{
            icon: <Compass className={`w-8 h-8 ${isLight ? 'text-[#5362DC]' : 'text-[#6C68F4]'}`} />,
            title: "Innovation sans Limite",
            desc: "Nous adoptons les technologies les plus évoluées en développement Next.js, régie vidéo 4K et éclairage asservi."
          }, {
            icon: <Award className={`w-8 h-8 ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`} />,
            title: "Rigueur & Zéro Défaut",
            desc: "Chaque détail compte. En logistique événementielle comme en marketing digital, la précision est la clé du succès."
          }, {
            icon: <Sparkles className={`w-8 h-8 ${isLight ? 'text-[#FFAD5B]' : 'text-[#FFAD5B]'}`} />,
            title: "Engagement Partenaire",
            desc: "Nous faisons équipe avec vous à chaque étape, de la réflexion stratégique jusqu'au démontage final du matériel."
          }].map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141446] border-white/10'}`}
            >
              {val.icon}
              <h3 className={`font-bold text-lg ${isLight ? 'text-black' : 'text-white'}`}>{val.title}</h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact Banner & Location */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl border p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141446] border-white/10'}`}
        >
          <div className="lg:col-span-8 space-y-4">
            <h3 className={`text-2xl font-bold ${isLight ? 'text-black' : 'text-white'}`}>Parlons de votre prochain projet</h3>
            <p className={`text-sm max-w-xl ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Que vous souhaitiez propulser votre stratégie marketing ou louer du matériel de sonorisation et d'éclairage pro, nos experts sont à votre disposition.
            </p>

            <div className={`flex flex-wrap gap-6 pt-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Mail className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`} />
                <span className="whitespace-nowrap">{siteContent.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Phone className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#FFAD5B]' : 'text-[#FFAD5B]'}`} />
                <span className="whitespace-nowrap">{siteContent.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <MapPin className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#5362DC]' : 'text-[#6C68F4]'}`} />
                <span className="whitespace-nowrap">{siteContent.contactAddress}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={onOpenDevis}
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Demander un Devis Gratuit</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
