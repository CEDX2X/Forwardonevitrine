import React, { useState } from 'react';
import { ForwardOneLogo } from './ForwardOneLogo';
import { ThemeToggle } from './ThemeToggle';
import { FileText, CalendarCheck, Lock, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDevis: () => void;
  onOpenPreReservation: () => void;
  onOpenAdminLogin: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDevis,
  onOpenPreReservation,
  onOpenAdminLogin,
  theme,
  onToggleTheme
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

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 backdrop-blur-md border-b ${
      isLight
        ? 'bg-white/95 text-slate-900 border-slate-200 shadow-xs'
        : 'bg-[#141446]/90 text-white border-[#6C68F4]/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <ForwardOneLogo
            variant={isLight ? 'dark' : 'light'}
            size="md"
            onAdminTrigger={onOpenAdminLogin}
          />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className={`hidden md:flex items-center space-x-1 lg:space-x-2 p-1.5 rounded-full border backdrop-blur-sm ${
          isLight
            ? 'bg-slate-100/80 border-slate-200/80'
            : 'bg-[#0d0d2e]/80 border-white/10'
        }`}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 lg:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30 font-bold'
                    : isLight
                      ? 'text-slate-700 hover:text-black hover:bg-slate-200/70'
                      : 'text-[#738591] hover:text-[#00C2C2] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Devis + Pre-reservation + Theme Toggle + Admin) */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenPreReservation}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              isLight
                ? 'text-[#102A6B] bg-[#102A6B]/10 border border-[#102A6B]/30 hover:bg-[#102A6B]/20'
                : 'text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 hover:bg-[#00C2C2]/20'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Pré-réservation</span>
          </button>

          <button
            onClick={onOpenDevis}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#5362DC] hover:bg-[#4351c4] shadow-md shadow-[#5362DC]/20 transition-all cursor-pointer`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Devis</span>
          </button>

          {/* Theme Toggle Switch (Jour / Nuit) */}
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

          {/* Admin Lock Shortcut */}
          <button
            onClick={onOpenAdminLogin}
            title="Espace Administrateur (Back-Office)"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-[#738591] hover:text-[#FFAD5B] hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile controls (Devis + Theme Toggle + Hamburger Menu) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Devis Button */}
          <button
            onClick={onOpenDevis}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#5362DC] hover:bg-[#4351c4] rounded-full shadow-md shadow-[#5362DC]/20 active:scale-95 transition-transform cursor-pointer shrink-0"
          >
            Devis
          </button>

          {/* Day / Night Theme Toggle Switch */}
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border active:scale-95 focus:outline-none cursor-pointer ${
              isLight
                ? 'text-slate-900 bg-slate-100 border-slate-300 hover:bg-slate-200'
                : 'text-slate-300 hover:text-white bg-white/5 border-white/10 active:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`} />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-2xl border-b ${
          isLight
            ? 'bg-white/98 text-slate-900 border-slate-200'
            : 'bg-[#141446]/95 text-white border-[#6C68F4]/20 backdrop-blur-xl'
        }`}>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#5362DC] text-white shadow-lg shadow-[#5362DC]/25 font-bold'
                    : isLight
                      ? 'text-slate-800 hover:bg-slate-100 active:bg-slate-200'
                      : 'text-slate-300 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            ))}
          </div>

          <div className={`pt-3 border-t space-y-2.5 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPreReservation();
              }}
              className={`w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-full transition-all cursor-pointer uppercase tracking-wider ${
                isLight
                  ? 'text-[#102A6B] bg-[#102A6B]/10 border border-[#102A6B]/30 active:bg-[#102A6B]/20'
                  : 'text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 active:bg-[#00C2C2]/20'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Pré-réservation Matériel</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDevis();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-[#5362DC] hover:bg-[#4351c4] rounded-full active:scale-98 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-[#5362DC]/20"
            >
              <FileText className="w-4 h-4" />
              <span>Demander un Devis Gratuit</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminLogin();
              }}
              className={`w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-[#738591] hover:text-[#FFAD5B] active:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4 text-[#5362DC]" />
              <span>Accès Espace Administrateur</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

