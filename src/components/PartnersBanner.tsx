import React from 'react';
import { PartnerItem, SiteContent } from '../types';
import { Handshake, ExternalLink } from 'lucide-react';

interface PartnersBannerProps {
  siteContent: SiteContent;
  theme?: 'dark' | 'light';
}

export const PartnersBanner: React.FC<PartnersBannerProps> = ({ siteContent, theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  // Check if banner is explicitly disabled
  if (siteContent.partnersBannerEnabled === false) {
    return null;
  }

  // Filter visible partners
  const visiblePartners = (siteContent.partners || []).filter(p => p.visible !== false);

  if (visiblePartners.length === 0) {
    return null;
  }

  // Duplicate list to make infinite marquee seamless
  const marqueePartners = [...visiblePartners, ...visiblePartners, ...visiblePartners];

  const bannerTitle = siteContent.partnersBannerTitle || "Nos Partenaires & Marques de Confiance";

  return (
    <div className={`w-full overflow-hidden border-y transition-colors duration-200 relative z-20 ${
      isLight 
        ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-inner' 
        : 'bg-[#080821] border-white/10 text-white shadow-lg'
    }`}>
      {/* Container flex with left fixed badge and scrolling right ticker */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center gap-2 md:gap-4 py-2.5 sm:py-3">
        
        {/* Fixed Title Label on Left (or top on mobile) */}
        <div className="flex items-center gap-2 shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-extrabold uppercase tracking-wider text-[#00C2C2] whitespace-nowrap shadow-xs">
          <Handshake className="w-3.5 h-3.5 text-[#FFAD5B] shrink-0" />
          <span className="whitespace-nowrap">{bannerTitle}</span>
        </div>

        {/* Separator on Desktop */}
        <div className="hidden md:block w-px h-6 bg-white/10 shrink-0" />

        {/* Scrolling Ticker Window */}
        <div className="relative w-full overflow-hidden flex-1 mask-gradient-x">
          {/* Subtle Left & Right Fade Gradients */}
          <div className="absolute top-0 bottom-0 left-0 w-8 z-10 bg-gradient-to-r from-[#080821] to-transparent pointer-events-none md:block hidden" />
          <div className="absolute top-0 bottom-0 right-0 w-8 z-10 bg-gradient-to-l from-[#080821] to-transparent pointer-events-none md:block hidden" />

          {/* Infinite Marquee Track */}
          <div className="animate-partner-marquee flex items-center gap-6 sm:gap-10 py-1">
            {marqueePartners.map((partner, index) => {
              const key = `${partner.id}-${index}`;
              const hasWebsite = Boolean(partner.website);

              const content = (
                <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C2C2]/40 transition-all group shrink-0 cursor-pointer">
                  {/* Logo Image or Fallback Badge */}
                  {partner.logo ? (
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/10 p-0.5 shrink-0 flex items-center justify-center">
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                        onError={(e) => {
                          // Fallback on image broken
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-col text-left whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors whitespace-nowrap">
                      {partner.name}
                    </span>
                    {partner.category && (
                      <span className="text-[9px] font-semibold text-[#00C2C2] tracking-wider uppercase opacity-85 whitespace-nowrap">
                        {partner.category}
                      </span>
                    )}
                  </div>

                  {hasWebsite && (
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#00C2C2] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                  )}
                </div>
              );

              if (hasWebsite) {
                return (
                  <a
                    key={key}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visiter ${partner.name}`}
                    className="shrink-0"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={key} className="shrink-0">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
