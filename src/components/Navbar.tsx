import React, { useState } from 'react';
import { ForwardOneLogo } from './ForwardOneLogo';
import { FileText, CalendarCheck, Lock, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDevis: () => void;
  onOpenPreReservation: () => void;
  onOpenAdminLogin: () => void;
  theme: 'light' | 'dark';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDevis,
  onOpenPreReservation,
  onOpenAdminLogin,
  theme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'services', label: 'Marketing Digital' },
    { id: 'logistique', label: 'Logistique Événementielle' },
    { id: 'billetterie', label: 'Billetterie', locked: true },
    { id: 'blog', label: 'Blog & Actus' },
    { id: 'about', label: 'À Propos' },
  ];

  const handleNavClick = (item: { id: string; locked?: boolean }) => {
    if (item.locked) return;
    setActiveTab(item.id);
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
        <nav className={`hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-1.5 p-1 sm:p-1.5 rounded-full border backdrop-blur-sm ${
          isLight
            ? 'bg-slate-100/80 border-slate-200/80'
            : 'bg-[#0d0d2e]/80 border-white/10'
        }`}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                disabled={item.locked}
                className={`px-2.5 lg:px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs lg:text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                  item.locked
                    ? 'opacity-60 cursor-not-allowed ' + (isLight ? 'text-slate-400 bg-slate-200/50' : 'text-slate-500 bg-white/5')
                    : isActive
                      ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30 font-bold cursor-pointer'
                      : isLight
                        ? 'text-slate-700 hover:text-black hover:bg-slate-200/70 cursor-pointer'
                        : 'text-[#738591] hover:text-[#00C2C2] hover:bg-white/5 cursor-pointer'
                }`}
              >
                {item.id === 'services' ? (
                  <>
                    <span className="hidden xl:inline">Marketing Digital</span>
                    <span className="xl:hidden">Marketing</span>
                  </>
                ) : item.id === 'logistique' ? (
                  <>
                    <span className="hidden xl:inline">Logistique Événementielle</span>
                    <span className="xl:hidden">Logistique</span>
                  </>
                ) : item.id === 'blog' ? (
                  <>
                    <span className="hidden xl:inline">Blog & Actus</span>
                    <span className="xl:hidden">Blog</span>
                  </>
                ) : (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {item.locked && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Devis + Pre-reservation + Theme Toggle + Admin) */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <button
            onClick={onOpenPreReservation}
            className={`flex items-center gap-1.5 px-3 xl:px-3.5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
              isLight
                ? 'text-[#102A6B] bg-[#102A6B]/10 border border-[#102A6B]/30 hover:bg-[#102A6B]/20'
                : 'text-[#00C2C2] bg-[#00C2C2]/10 border border-[#00C2C2]/40 hover:bg-[#00C2C2]/20'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Pré-réservation</span>
          </button>

          <button
            onClick={onOpenDevis}
            className={`flex items-center gap-1.5 px-3.5 xl:px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#5362DC] hover:bg-[#4351c4] shadow-md shadow-[#5362DC]/20 transition-all cursor-pointer whitespace-nowrap shrink-0`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline whitespace-nowrap">Offre Personnalisée</span>
            <span className="xl:hidden whitespace-nowrap">Offre Pers.</span>
          </button>

        </div>

        {/* Mobile controls (Offre Pers. + Hamburger Menu) */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Offre Personnalisée Button */}
          <button
            onClick={onOpenDevis}
            className="px-3 py-2 text-xs font-bold text-white bg-[#5362DC] hover:bg-[#4351c4] rounded-full shadow-md shadow-[#5362DC]/20 active:scale-95 transition-transform cursor-pointer shrink-0"
            title="Demander une Offre Personnalisée"
          >
            <span className="hidden sm:inline">Offre Personnalisée</span>
            <span className="sm:hidden">Offre Pers.</span>
          </button>

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
              <Menu className={`w-6 h-6 ${isLight ? 'text-slate-900' : 'text-slate-300'}`} />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-2xl border-b ${
          isLight
            ? 'bg-white/98 text-slate-900 border-slate-200'
            : 'bg-[#141446]/95 text-white border-[#6C68F4]/20 backdrop-blur-xl'
        }`}>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                disabled={item.locked}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${
                  item.locked
                    ? 'opacity-60 cursor-not-allowed ' + (isLight ? 'text-slate-400 bg-slate-100' : 'text-slate-500 bg-white/5')
                    : activeTab === item.id
                      ? 'bg-[#5362DC] text-white shadow-lg shadow-[#5362DC]/25 font-bold cursor-pointer'
                      : isLight
                        ? 'text-slate-800 hover:bg-slate-100 active:bg-slate-200 cursor-pointer'
                        : 'text-slate-300 hover:bg-white/5 active:bg-white/10 cursor-pointer'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.locked && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                </span>
                {!item.locked && <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : isLight ? 'text-slate-400' : 'text-slate-500'}`} />}
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
              <span>Demander une Offre Personnalisée</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

