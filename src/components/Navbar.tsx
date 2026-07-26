import React, { useState } from 'react';
import { ForwardOneLogo } from './ForwardOneLogo';
import { FileText, CalendarCheck, Lock, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDevis: () => void;
  onOpenPreReservation: () => void;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDevis,
  onOpenPreReservation,
  onOpenAdminLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'services', label: 'Services' },
    { id: 'catalog', label: 'Catalogue Matériel' },
    { id: 'packs', label: 'Packs & Offres' },
    { id: 'blog', label: 'Blog & Actus' },
    { id: 'about', label: 'À Propos' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#141446]/90 backdrop-blur-md border-b border-[#6C68F4]/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo (Double-click triggers secret Admin login) */}
        <div className="flex items-center gap-3">
          <ForwardOneLogo
            variant="light"
            size="md"
            onAdminTrigger={onOpenAdminLogin}
          />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#0d0d2e]/80 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30'
                    : 'text-[#738591] hover:text-[#00C2C2] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Devis + Pre-reservation + Admin portal button) */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenPreReservation}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 rounded-full hover:bg-[#00C2C2]/20 transition-all cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Pré-réservation</span>
          </button>

          <button
            onClick={onOpenDevis}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FFAD5B] text-[#141446] rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#ff9d3d] shadow-md shadow-[#FFAD5B]/20 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Obtenir un Devis</span>
          </button>

          {/* Admin Lock Button Shortcut */}
          <button
            onClick={onOpenAdminLogin}
            title="Espace Administrateur (Back-Office)"
            className="p-2 text-[#738591] hover:text-[#FFAD5B] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenDevis}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#6C68F4] rounded-full shadow-md shadow-[#6C68F4]/20 active:scale-95 transition-transform cursor-pointer"
          >
            Devis
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-white/5 border border-white/10 active:bg-white/10 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#00C2C2]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141446]/95 backdrop-blur-xl border-b border-[#6C68F4]/20 px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#6C68F4] text-white shadow-lg shadow-[#6C68F4]/25'
                    : 'text-slate-300 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`} />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPreReservation();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 rounded-full active:bg-[#00C2C2]/20 transition-all cursor-pointer uppercase tracking-wider"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Pré-réservation Matériel</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDevis();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-[#141446] bg-[#FFAD5B] rounded-full active:bg-[#ff9d3d] transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-[#FFAD5B]/20"
            >
              <FileText className="w-4 h-4" />
              <span>Demander un Devis Gratuit</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#738591] hover:text-[#FFAD5B] active:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#FFAD5B]" />
              <span>Accès Espace Administrateur</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
