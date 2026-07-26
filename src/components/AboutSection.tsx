import React from 'react';
import { SiteContent } from '../types';
import { ForwardOneLogo } from './ForwardOneLogo';
import { Award, Compass, Sparkles, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

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
    <section id="about" className={`py-20 transition-colors duration-200 relative ${
      isLight ? 'bg-white text-slate-900 border-t border-slate-200' : 'bg-[#0d0d2e] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Top Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isLight
              ? 'bg-slate-100 border border-slate-200 text-[#102A6B]'
              : 'bg-[#6C68F4]/20 text-[#00C2C2]'
          }`}>
            <span>À Propos de Forward One</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
            {siteContent.aboutHeadline}
          </h2>
          <p className={`text-base leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {siteContent.aboutStory}
          </p>
        </div>

        {/* Highlight Feature: "Pourquoi la flèche dans le logo ?" */}
        <div className={`rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border ${
          isLight
            ? 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 border-slate-200'
            : 'bg-gradient-brand-2 border-[#6C68F4]/30 shadow-2xl'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Visual Brand Icon & Logo Breakdown */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className={`inline-block p-6 rounded-2xl border shadow-xl ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#141446] border-white/10'
              }`}>
                <ForwardOneLogo variant={isLight ? 'dark' : 'light'} size="lg" onAdminTrigger={onOpenAdminLogin} />
              </div>

              <div className="space-y-2">
                <h3 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Pourquoi la flèche dans le logo ?</h3>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>
                  La signature visuelle de l'identité Forward One
                </p>
              </div>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                La flèche n'est pas un simple élément décoratif. Elle raconte l'histoire d'une marque qui ne s'arrête jamais, qui pousse ses clients vers de nouveaux horizons digitaux et événementiels.
              </p>
            </div>

            {/* Right Column: The 4 Pillars from the Brand Guide */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Pillar 1 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-[#5362DC]/15 text-[#5362DC] flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Mouvement & Progression</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  L'élan vers l'avant, le dépassement de soi. Une marque en marche constante où tout est en évolution.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-[#12B857]/15 text-[#12B857] flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Direction & Leadership</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Une flèche montre le chemin. Elle positionne Forward One comme un guide qui maîtrise son cap et emmène ses clients vers la réussite.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-[#E85D75]/15 text-[#E85D75] flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Excellence & Numéro 1</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Symbole de performance et de position dominante. Forward One, c'est le numéro 1 qui ouvre la voie sans concession.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-white/5 border-white/10'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-[#5362DC]/15 text-[#5362DC] flex items-center justify-center font-bold">
                  04
                </div>
                <h4 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Simplicité & Mémorisation</h4>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Un symbole universel immédiatement reconnaissable qui gravera la marque de manière indélébile dans les esprits.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Brand Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-6 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141446] border-white/10'
          }`}>
            <Compass className="w-8 h-8 text-[#5362DC]" />
            <h3 className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>Innovation sans Limite</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Nous adoptons les technologies les plus évoluées en développement Next.js, régie vidéo 4K et éclairage asservi.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141446] border-white/10'
          }`}>
            <Award className="w-8 h-8 text-[#12B857]" />
            <h3 className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>Rigueur & Zéro Défaut</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Chaque détail compte. En logistique événementielle comme en marketing digital, la précision est la clé du succès.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141446] border-white/10'
          }`}>
            <Sparkles className="w-8 h-8 text-[#E85D75]" />
            <h3 className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>Engagement Partenaire</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Nous faisons équipe avec vous à chaque étape, de la réflexion stratégique jusqu'au démontage final du matériel.
            </p>
          </div>
        </div>

        {/* Contact Banner & Location */}
        <div className={`rounded-3xl border p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
          isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-[#141446] border-white/10'
        }`}>
          <div className="lg:col-span-8 space-y-4">
            <h3 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Parlons de votre prochain projet</h3>
            <p className={`text-sm max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Que vous souhaitiez propulser votre stratégie marketing ou louer du matériel de sonorisation et d'éclairage pro, nos experts sont à votre disposition.
            </p>

            <div className={`flex flex-wrap gap-6 pt-2 text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5362DC]" />
                <span>{siteContent.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#12B857]" />
                <span>{siteContent.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E85D75]" />
                <span>{siteContent.contactAddress}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <button
              onClick={onOpenDevis}
              className="px-6 py-3.5 rounded-full font-bold text-xs text-white bg-[#5362DC] hover:bg-[#4351c4] flex items-center gap-2 shadow-lg shadow-[#5362DC]/20 cursor-pointer transition-all uppercase tracking-wider"
            >
              <span>Demander un Devis Gratuit</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
