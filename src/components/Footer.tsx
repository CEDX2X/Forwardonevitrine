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
    <footer className={`border-t pt-16 pb-12 relative overflow-hidden transition-colors duration-200 ${
      isLight ? 'bg-white text-slate-700 border-slate-200' : 'bg-[#0d0d2e] text-slate-300 border-[#6C68F4]/20'
    }`}>
      
      {/* Background Graphic Lines Motif */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#6C68F4] via-[#00C2C2] to-[#FFAD5B]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <ForwardOneLogo variant={isLight ? 'dark' : 'light'} size="md" onAdminTrigger={onOpenAdminLogin} />

            <p className={`text-xs max-w-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Plateforme web d'excellence unifiant stratégie marketing digital et régie logistique événementielle haute performance.
            </p>

            <div className={`pt-2 flex items-center gap-2 text-xs font-semibold whitespace-nowrap ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>
              <Sparkles className="w-4 h-4 text-[#FFAD5B] shrink-0" />
              <span className="whitespace-nowrap">Slogan officiel : "Progress Without Limits."</span>
            </div>
          </div>

          {/* Col 2: Marketing Digital */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Marketing Digital
            </div>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li><button onClick={() => setActiveTab('services')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>Branding & Identité</button></li>
              <li><button onClick={() => setActiveTab('services')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>Développement Next.js</button></li>
              <li><button onClick={() => setActiveTab('services')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>SEO & Netlinking</button></li>
              <li><button onClick={() => setActiveTab('services')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>Social Media & Ads</button></li>
            </ul>
          </div>

          {/* Col 3: Logistique Événementielle */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Logistique Événementielle
            </div>
            <ul className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <li><button onClick={() => setActiveTab('catalog')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>Sonorisation L-Acoustics</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>Éclairage GrandMA</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className={`hover:cursor-pointer ${isLight ? 'hover:text-[#5362DC]' : 'hover:text-[#00C2C2]'}`}>Écrans LED Outdoor</button></li>
              <li><button onClick={onOpenPreReservation} className={`hover:cursor-pointer font-semibold ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>Pré-réservation Matériel</button></li>
            </ul>
          </div>

          {/* Col 4: Contact & Access */}
          <div className="space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Contact & Support
            </div>
            <div className={`space-y-2 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              <div className="flex items-center gap-2">
                <Mail className={`w-3.5 h-3.5 ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`} />
                <span>{siteContent.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFAD5B]" />
                <span>{siteContent.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className={`w-3.5 h-3.5 ${isLight ? 'text-[#5362DC]' : 'text-[#6C68F4]'}`} />
                <span>Douala & Yaoundé, Cameroun</span>
              </div>
            </div>


          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex items-center justify-center text-xs ${isLight ? 'border-slate-200 text-slate-600' : 'border-white/5 text-slate-400'}`}>
          <p className="text-xs font-medium tracking-wide">
            propriété de ForwardOne tout droits réservés 2026
          </p>
        </div>

      </div>
    </footer>
  );
};
