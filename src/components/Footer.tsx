import React from 'react';
import { ForwardOneLogo } from './ForwardOneLogo';
import { Mail, Phone, MapPin, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { SiteContent } from '../types';

interface FooterProps {
  siteContent: SiteContent;
  setActiveTab: (tab: string) => void;
  onOpenAdminLogin: () => void;
  onOpenDevis: () => void;
  onOpenPreReservation: () => void;
  theme?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({
  siteContent,
  setActiveTab,
  onOpenAdminLogin,
  onOpenDevis,
  onOpenPreReservation,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  return (
    <footer className={`transition-colors duration-200 border-t pt-16 pb-12 relative overflow-hidden ${
      isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#0d0d2e] text-slate-300 border-[#6C68F4]/20'
    }`}>
      
      {/* Background Graphic Lines Motif */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5362DC] via-[#12B857] to-[#E85D75]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <ForwardOneLogo variant={isLight ? 'dark' : 'light'} size="md" onAdminTrigger={onOpenAdminLogin} />

            <p className={`text-xs max-w-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Plateforme web d'excellence unifiant stratégie marketing digital et régie logistique événementielle haute performance.
            </p>

            <div className={`pt-2 flex items-center gap-2 text-xs font-semibold ${isLight ? 'text-[#102A6B]' : 'text-[#00C2C2]'}`}>
              <Sparkles className="w-4 h-4 text-[#5362DC]" />
              <span>Slogan officiel : "Progress Without Limits."</span>
            </div>
          </div>

          {/* Col 2: Marketing Digital */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Marketing Digital
            </div>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-[#5362DC] cursor-pointer">Branding & Identité</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-[#5362DC] cursor-pointer">Développement Next.js</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-[#5362DC] cursor-pointer">SEO & Netlinking</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-[#5362DC] cursor-pointer">Social Media & Ads</button></li>
            </ul>
          </div>

          {/* Col 3: Logistique Événementielle */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Logistique Événementielle
            </div>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-[#12B857] cursor-pointer">Sonorisation L-Acoustics</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-[#12B857] cursor-pointer">Éclairage GrandMA</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-[#12B857] cursor-pointer">Écrans LED Outdoor</button></li>
              <li><button onClick={onOpenPreReservation} className="hover:text-[#12B857] font-semibold text-[#12B857] cursor-pointer">Pré-réservation Matériel</button></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Contact & Support
            </div>
            <div className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5362DC]" />
                <span>{siteContent.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#12B857]" />
                <span>{siteContent.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E85D75]" />
                <span>Douala & Yaoundé, Cameroun</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdminLogin}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Lock className="w-3 h-3 text-[#5362DC]" />
                <span>Accès Back-Office Admin</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-white/5 text-[#738591]'
        }`}>
          <div className="flex items-center gap-6">
            <div className="text-[11px] uppercase tracking-[3px]">Architecture Modulaire</div>
            <div className="text-[11px] uppercase tracking-[3px] hidden md:block">Premium Service</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest font-semibold">Système Opérationnel • V1.0</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={onOpenDevis} className="hover:text-black cursor-pointer">Demande de Devis</button>
            <span>•</span>
            <button onClick={onOpenPreReservation} className="hover:text-black cursor-pointer">Pré-réservation</button>
            <span>•</span>
            <button onClick={() => setActiveTab('about')} className="hover:text-black cursor-pointer">À Propos</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
