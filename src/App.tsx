import React, { useState, useEffect } from 'react';
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
import { ServicesSection } from './components/ServicesSection';
import { CatalogSection } from './components/CatalogSection';
import { PacksSection } from './components/PacksSection';
import { BlogSection } from './components/BlogSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { DevisModal } from './components/DevisModal';
import { PreReservationModal } from './components/PreReservationModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [packs, setPacks] = useState<PackItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('forwardone_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'light';
  });

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('forwardone_theme', next);
      return next;
    });
  };

  // Modal States
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [devisPreselectedItem, setDevisPreselectedItem] = useState<string | undefined>(undefined);

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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-slate-50 text-slate-900 selection:bg-[#5362DC] selection:text-white'
        : 'bg-[#0f0f33] text-slate-100 selection:bg-[#6C68F4] selection:text-white'
    }`}>
      
      {/* Sticky Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDevis={() => {
          setDevisPreselectedItem(undefined);
          setIsDevisModalOpen(true);
        }}
        onOpenPreReservation={() => handleOpenPreReservationWithProduct()}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Page Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <>
            <Hero
              siteContent={siteContent}
              onOpenDevis={() => {
                setDevisPreselectedItem(undefined);
                setIsDevisModalOpen(true);
              }}
              onExploreCatalog={() => {
                setActiveTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePacks={() => {
                setActiveTab('packs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              theme={theme}
            />

            <ServicesSection
              services={services}
              onSelectServiceForDevis={handleOpenDevisWithItem}
              theme={theme}
            />

            <CatalogSection
              products={products}
              onOpenPreReservationWithItems={handleOpenPreReservationWithProduct}
              theme={theme}
            />

            <PacksSection
              packs={packs}
              onSelectPackForDevis={handleOpenDevisWithItem}
              theme={theme}
            />

            <BlogSection articles={articles} theme={theme} />

            <AboutSection
              siteContent={siteContent}
              onOpenDevis={() => setIsDevisModalOpen(true)}
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
              theme={theme}
            />
          </>
        )}

        {/* TAB 2: SERVICES */}
        {activeTab === 'services' && (
          <ServicesSection
            services={services}
            onSelectServiceForDevis={handleOpenDevisWithItem}
            theme={theme}
          />
        )}

        {/* TAB 3: CATALOGUE MATÉRIEL */}
        {activeTab === 'catalog' && (
          <CatalogSection
            products={products}
            onOpenPreReservationWithItems={handleOpenPreReservationWithProduct}
            theme={theme}
          />
        )}

        {/* TAB 4: PACKS */}
        {activeTab === 'packs' && (
          <PacksSection
            packs={packs}
            onSelectPackForDevis={handleOpenDevisWithItem}
            theme={theme}
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
            onOpenDevis={() => setIsDevisModalOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            theme={theme}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        siteContent={siteContent}
        setActiveTab={setActiveTab}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenDevis={() => setIsDevisModalOpen(true)}
        onOpenPreReservation={() => handleOpenPreReservationWithProduct()}
        theme={theme}
      />

      {/* Modals */}
      <DevisModal
        isOpen={isDevisModalOpen}
        onClose={() => setIsDevisModalOpen(false)}
        preselectedItem={devisPreselectedItem}
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

    </div>
  );
}
