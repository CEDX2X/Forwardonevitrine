import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  ArticleItem,
  PackItem,
  ProductItem,
  ServiceItem,
  SiteContent
} from './types';
import { initialSiteContent } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PartnersBanner } from './components/PartnersBanner';
import { ServiceCategoriesGrid } from './components/ServiceCategoriesGrid';
import { TestimonialsSection } from './components/TestimonialsSection';
import { VideosSection } from './components/VideosSection';
import { ServicesSection } from './components/ServicesSection';
import { CatalogSection } from './components/CatalogSection';
import { PacksSection } from './components/PacksSection';
import { BlogSection } from './components/BlogSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { DevisModal } from './components/DevisModal';
import { PreReservationModal } from './components/PreReservationModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [navHistory, setNavHistory] = useState<string[]>(['home']);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [packs, setPacks] = useState<PackItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  // Navigation handlers with history stack
  const navigateToTab = (newTab: string) => {
    if (newTab === activeTab) return;
    setNavHistory((prev) => [...prev, newTab]);
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop(); // remove current tab
      const prevTab = newHistory[newHistory.length - 1] || 'home';
      setNavHistory(newHistory);
      setActiveTab(prevTab);
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal States
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [devisPreselectedItem, setDevisPreselectedItem] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [isPreReservationModalOpen, setIsPreReservationModalOpen] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState<ProductItem | null>(null);

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('forwardone_admin_token') || null;
  });

  // Fetch Public Site Data
  const fetchPublicData = async () => {
    try {
      const [resContent, resServices, resProducts, resPacks, resArticles] = await Promise.all([
        fetch('/api/site-content'),
        fetch('/api/services'),
        fetch('/api/products'),
        fetch('/api/packs'),
        fetch('/api/articles')
      ]);

      if (resContent.ok) setSiteContent(await resContent.json());
      if (resServices.ok) setServices(await resServices.json());
      if (resProducts.ok) setProducts(await resProducts.json());
      if (resPacks.ok) setPacks(await resPacks.json());
      if (resArticles.ok) setArticles(await resArticles.json());
    } catch (e) {
      console.error('Failed to fetch public site data:', e);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  // Handlers
  const handleOpenDevisWithItem = (itemTitle: string) => {
    setDevisPreselectedItem(itemTitle);
    setIsDevisModalOpen(true);
  };

  const handleOpenPreReservationWithProduct = (product?: ProductItem) => {
    if (product) setPreselectedProduct(product);
    else setPreselectedProduct(null);
    setIsPreReservationModalOpen(true);
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('forwardone_admin_token', token);
    setIsAdminLoginOpen(false);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('forwardone_admin_token');
  };

  // If Admin is authenticated and active, render the Back-Office Portal!
  if (adminToken) {
    return (
      <AdminDashboard
        adminToken={adminToken}
        onLogout={handleAdminLogout}
        onRefreshPublicData={fetchPublicData}
      />
    );
  }

  // Otherwise, render the Public Web Platform
  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-[#6C68F4] selection:text-white ${
      theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#0f0f33] text-slate-100'
    }`}>
      
      {/* Sticky Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        theme={theme}
        onOpenDevis={() => {
          setDevisPreselectedItem(undefined);
          setIsDevisModalOpen(true);
        }}
        onOpenPreReservation={() => handleOpenPreReservationWithProduct()}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Page Content Area */}
      <main className="flex-1">
        
        {/* Discrete Back Button (all pages except home) */}
        {activeTab !== 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <button
              onClick={handleGoBack}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black border border-slate-200 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 shadow-sm'
              } group`}
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-[#6C68F4]" />
              <span>Retour</span>
            </button>
          </div>
        )}

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <>
            <Hero
              siteContent={siteContent}
              theme={theme}
              onOpenDevis={() => {
                setDevisPreselectedItem(undefined);
                setIsDevisModalOpen(true);
              }}
              onExploreCatalog={() => navigateToTab('catalog')}
              onExplorePacks={() => navigateToTab('packs')}
              onNavigateTab={(tab) => navigateToTab(tab)}
            />

            <PartnersBanner siteContent={siteContent} theme={theme} />

            <ServiceCategoriesGrid
              siteContent={siteContent}
              theme={theme}
              onNavigateTab={(tab) => navigateToTab(tab)}
            />

            <VideosSection
              siteContent={siteContent}
              theme={theme}
            />

            <BlogSection articles={articles} theme={theme} />

            <TestimonialsSection
              siteContent={siteContent}
              theme={theme}
            />

            <AboutSection
              siteContent={siteContent}
              theme={theme}
              onOpenDevis={() => setIsDevisModalOpen(true)}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            />
          </>
        )}

        {/* TAB 2: SERVICES */}
        {activeTab === 'services' && (
          <ServicesSection
            services={services}
            theme={theme}
            onSelectServiceForDevis={handleOpenDevisWithItem}
          />
        )}

        {/* TAB 3: LOGISTIQUE ÉVÉNEMENTIELLE (Packs & Offres + Catalogue Matériel à la suite) */}
        {activeTab === 'logistique' && (
          <div className="space-y-12 py-8">
            <PacksSection
              packs={packs}
              theme={theme}
              onSelectPackForDevis={handleOpenDevisWithItem}
            />
            <CatalogSection
              products={products}
              theme={theme}
              onOpenPreReservationWithItems={handleOpenPreReservationWithProduct}
            />
          </div>
        )}

        {/* TAB 4: CATALOGUE MATÉRIEL */}
        {activeTab === 'catalog' && (
          <CatalogSection
            products={products}
            theme={theme}
            onOpenPreReservationWithItems={handleOpenPreReservationWithProduct}
          />
        )}

        {/* TAB 5: PACKS */}
        {activeTab === 'packs' && (
          <PacksSection
            packs={packs}
            theme={theme}
            onSelectPackForDevis={handleOpenDevisWithItem}
          />
        )}

        {/* TAB 5: BLOG */}
        {activeTab === 'blog' && (
          <BlogSection articles={articles} theme={theme} />
        )}

        {/* TAB 6: À PROPOS */}
        {activeTab === 'about' && (
          <AboutSection
            siteContent={siteContent}
            theme={theme}
            onOpenDevis={() => setIsDevisModalOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        siteContent={siteContent}
        setActiveTab={navigateToTab}
        theme={theme}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenDevis={() => setIsDevisModalOpen(true)}
        onOpenPreReservation={() => handleOpenPreReservationWithProduct()}
      />

      {/* Modals */}
      <DevisModal
        isOpen={isDevisModalOpen}
        onClose={() => setIsDevisModalOpen(false)}
        preselectedItem={devisPreselectedItem}
        theme={theme}
      />

      <PreReservationModal
        isOpen={isPreReservationModalOpen}
        onClose={() => setIsPreReservationModalOpen(false)}
        availableProducts={products}
        preselectedProduct={preselectedProduct}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <BackToTop theme={theme} />

    </div>
  );
}
