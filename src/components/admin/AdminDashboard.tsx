import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import {
  AdminStats,
  ArticleItem,
  CommentItem,
  PackItem,
  ProductItem,
  PreReservationItem,
  QuoteRequestItem,
  ServiceItem,
  SiteContent
} from '../../types';
import { ForwardOneLogo } from '../ForwardOneLogo';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Package,
  Boxes,
  BookOpen,
  MessageSquare,
  CalendarCheck,
  Edit3,
  Trash2,
  Plus,
  Check,
  X,
  LogOut,
  RefreshCw,
  Mail,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminToken,
  onLogout,
  onRefreshPublicData
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'siteContent' | 'services' | 'articles' | 'products' | 'packs' | 'comments' | 'devis' | 'reservations'
  >('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [packs, setPacks] = useState<PackItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [devis, setDevis] = useState<QuoteRequestItem[]>([]);
  const [reservations, setReservations] = useState<PreReservationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals / Forms States
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<ArticleItem> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [editingPack, setEditingPack] = useState<Partial<PackItem> | null>(null);
  const [viewingReservationEmail, setViewingReservationEmail] = useState<PreReservationItem | null>(null);

  const fetchHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        resStats,
        resContent,
        resServices,
        resArticles,
        resProducts,
        resPacks,
        resComments,
        resDevis,
        resReservations
      ] = await Promise.all([
        fetch('/api/admin/stats', { headers: fetchHeaders }),
        fetch('/api/site-content'),
        fetch('/api/services'),
        fetch('/api/articles', { headers: fetchHeaders }),
        fetch('/api/products'),
        fetch('/api/packs'),
        fetch('/api/comments', { headers: fetchHeaders }),
        fetch('/api/devis', { headers: fetchHeaders }),
        fetch('/api/prereservations', { headers: fetchHeaders })
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resContent.ok) setSiteContent(await resContent.json());
      if (resServices.ok) setServices(await resServices.json());
      if (resArticles.ok) setArticles(await resArticles.json());
      if (resProducts.ok) setProducts(await resProducts.json());
      if (resPacks.ok) setPacks(await resPacks.json());
      if (resComments.ok) setComments(await resComments.json());
      if (resDevis.ok) setDevis(await resDevis.json());
      if (resReservations.ok) setReservations(await resReservations.json());

      onRefreshPublicData();
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Handlers ---
  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify(siteContent)
      });
      if (res.ok) {
        alert('Textes du site mis à jour avec succès !');
        loadAllData();
      }
    } catch (e) {
      alert('Erreur lors de la sauvegarde.');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const isNew = !editingService.id;
    const url = isNew ? '/api/services' : `/api/services/${editingService.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        setEditingService(null);
        loadAllData();
      }
    } catch (e) {
      alert('Erreur enregistrement service.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Supprimer ce service ?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE', headers: fetchHeaders });
    loadAllData();
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    const isNew = !editingArticle.id;
    const url = isNew ? '/api/articles' : `/api/articles/${editingArticle.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: JSON.stringify(editingArticle)
      });
      if (res.ok) {
        setEditingArticle(null);
        loadAllData();
      }
    } catch (e) {
      alert('Erreur enregistrement article.');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE', headers: fetchHeaders });
    loadAllData();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const isNew = !editingProduct.id;
    const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        loadAllData();
      }
    } catch (e) {
      alert('Erreur enregistrement produit.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer cet équipement ?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: fetchHeaders });
    loadAllData();
  };

  const handleSavePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPack) return;
    const isNew = !editingPack.id;
    const url = isNew ? '/api/packs' : `/api/packs/${editingPack.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: JSON.stringify(editingPack)
      });
      if (res.ok) {
        setEditingPack(null);
        loadAllData();
      }
    } catch (e) {
      alert('Erreur enregistrement pack.');
    }
  };

  const handleDeletePack = async (id: string) => {
    if (!confirm('Supprimer ce pack ?')) return;
    await fetch(`/api/packs/${id}`, { method: 'DELETE', headers: fetchHeaders });
    loadAllData();
  };

  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    await fetch(`/api/comments/${id}/status`, {
      method: 'PUT',
      headers: fetchHeaders,
      body: JSON.stringify({ status })
    });
    loadAllData();
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    await fetch(`/api/comments/${id}`, { method: 'DELETE', headers: fetchHeaders });
    loadAllData();
  };

  const handleUpdateDevisStatus = async (id: string, status: string) => {
    await fetch(`/api/devis/${id}/status`, {
      method: 'PUT',
      headers: fetchHeaders,
      body: JSON.stringify({ status })
    });
    loadAllData();
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    await fetch(`/api/prereservations/${id}/status`, {
      method: 'PUT',
      headers: fetchHeaders,
      body: JSON.stringify({ status })
    });
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-[#09091f] text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Bar */}
      <header className="bg-[#141446] border-b border-[#6C68F4]/30 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-4">
          <ForwardOneLogo variant="light" size="sm" showTagline={false} />
          <div className="hidden sm:block text-xs font-semibold px-2.5 py-1 rounded-md bg-[#6C68F4]/20 text-[#00C2C2] border border-[#6C68F4]/40">
            Back-Office Administrateur
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Back-Office Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar / Horizontal Bar on Mobile */}
        <aside className="w-full md:w-64 bg-[#0d0d2e] border-b md:border-b-0 md:border-r border-white/10 p-3 md:p-4 space-y-1 overflow-x-auto md:overflow-x-visible scrollbar-none shrink-0">
          <div className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Gestion du Site & Métier
          </div>

          <div className="flex md:flex-col gap-1.5 md:gap-1 min-w-max md:min-w-0">
            {[
              { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard, badge: stats?.pendingQuotes ? `${stats.pendingQuotes} devis` : null },
              { id: 'siteContent', label: 'Textes du Site', icon: FileText },
              { id: 'services', label: 'Services', icon: Briefcase, count: services.length },
              { id: 'articles', label: 'Blog & Articles', icon: BookOpen, count: articles.length },
              { id: 'products', label: 'Catalogue Matériel', icon: Package, count: products.length },
              { id: 'packs', label: 'Packs & Bundles', icon: Boxes, count: packs.length },
              { id: 'comments', label: 'Commentaires', icon: MessageSquare, badge: stats?.pendingComments ? `${stats.pendingComments} mod.` : null },
              { id: 'devis', label: 'Demandes de Devis', icon: FileText, count: devis.length },
              { id: 'reservations', label: 'Pré-réservations', icon: CalendarCheck, badge: stats?.pendingReservations ? `${stats.pendingReservations} rés.` : null }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30'
                      : 'text-slate-300 bg-white/5 md:bg-transparent hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 opacity-80 shrink-0" />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFAD5B] text-slate-950 ml-1">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && !tab.badge && (
                    <span className="text-[11px] text-slate-400 font-normal ml-1">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 overflow-y-auto min-w-0 max-w-full">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-white">Tableau de Bord Administrateur</h2>
                <p className="text-xs text-slate-400 mt-1">Supervision globale des contenus, demandes de devis et réservations de matériel.</p>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 rounded-2xl bg-[#141446] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Devis Reçus</span>
                    <FileText className="w-4 h-4 text-[#6C68F4]" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats?.totalQuotes || 0}</div>
                  <div className="text-[11px] text-[#FFAD5B] font-semibold">{stats?.pendingQuotes || 0} en attente de traitement</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141446] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Pré-réservations</span>
                    <CalendarCheck className="w-4 h-4 text-[#00C2C2]" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats?.totalReservations || 0}</div>
                  <div className="text-[11px] text-[#00C2C2] font-semibold">{stats?.pendingReservations || 0} à confirmer</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141446] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Modération Commentaires</span>
                    <MessageSquare className="w-4 h-4 text-[#FFAD5B]" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats?.pendingComments || 0}</div>
                  <div className="text-[11px] text-slate-400">Commentaires publics en attente</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141446] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Catalogue Matériel</span>
                    <Package className="w-4 h-4 text-[#6C68F4]" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{stats?.totalProducts || 0}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Référencés au parc</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-2xl bg-[#141446] border border-[#6C68F4]/30 space-y-4">
                <h3 className="text-lg font-bold text-white">Actions Rapides Back-Office</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('devis')}
                    className="px-4 py-2.5 rounded-xl bg-[#6C68F4] text-white font-bold text-xs hover:bg-[#5b57e0] cursor-pointer"
                  >
                    Voir les Demandes de Devis ({stats?.pendingQuotes || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="px-4 py-2.5 rounded-xl bg-[#00C2C2] text-slate-950 font-bold text-xs hover:bg-[#00a3a3] cursor-pointer"
                  >
                    Voir les Pré-réservations ({stats?.pendingReservations || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 cursor-pointer"
                  >
                    Modérer les Commentaires ({stats?.pendingComments || 0})
                  </button>
                  <button
                    onClick={() => setEditingProduct({ name: '', category: 'Sonorisation', dailyRate: 100, stockQuantity: 5, availabilityStatus: 'disponible', specifications: {} })}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 cursor-pointer"
                  >
                    ＋ Ajouter un Équipement Matériel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SITE CONTENT */}
          {activeTab === 'siteContent' && siteContent && (
            <form onSubmit={handleSaveSiteContent} className="space-y-6 max-w-3xl animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-white">Gestion des Textes du Site Public</h2>
                <p className="text-xs text-slate-400 mt-1">Modifiez les slogans, présentations et coordonnées directement en direct.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141446] border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Titre Hero Principal</label>
                  <input
                    type="text"
                    value={siteContent.heroTitle}
                    onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sous-titre Hero</label>
                  <textarea
                    rows={2}
                    value={siteContent.heroSubtitle}
                    onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Titre À Propos</label>
                  <input
                    type="text"
                    value={siteContent.aboutHeadline}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutHeadline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Histoire & Présentation À Propos</label>
                  <textarea
                    rows={4}
                    value={siteContent.aboutStory}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutStory: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Contact</label>
                    <input
                      type="text"
                      value={siteContent.contactEmail}
                      onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone Contact</label>
                    <input
                      type="text"
                      value={siteContent.contactPhone}
                      onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Siège</label>
                    <input
                      type="text"
                      value={siteContent.contactAddress}
                      onChange={(e) => setSiteContent({ ...siteContent, contactAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Gestion des Services</h2>
                  <p className="text-xs text-slate-400 mt-1">Gérez vos prestations Marketing Digital et Logistique Événementielle.</p>
                </div>
                <button
                  onClick={() => setEditingService({ title: '', category: 'Marketing Digital', shortDescription: '', fullDescription: '', iconName: 'Sparkles', features: [], image: '' })}
                  className="px-4 py-2 rounded-xl bg-[#6C68F4] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((serv) => (
                  <div key={serv.id} className="p-4 rounded-xl bg-[#141446] border border-white/10 space-y-3 flex flex-col justify-between overflow-hidden">
                    {serv.image && (
                      <div className="h-32 -mx-4 -mt-4 mb-1 overflow-hidden relative">
                        <img src={serv.image} alt={serv.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141446] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#6C68F4]/20 text-[#00C2C2]">
                          {serv.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingService(serv)}
                            className="p-1 text-slate-300 hover:text-white cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(serv.id)}
                            className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base">{serv.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{serv.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ARTICLES (BLOG) */}
          {activeTab === 'articles' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Gestion du Blog & Articles</h2>
                  <p className="text-xs text-slate-400 mt-1">Rédigez et publiez vos actualités.</p>
                </div>
                <button
                  onClick={() => setEditingArticle({ title: '', category: 'Marketing Digital', excerpt: '', content: '', author: 'Équipe Forward One', authorRole: 'Expert', readTime: '5 min', published: true, image: '' })}
                  className="px-4 py-2.5 rounded-xl bg-[#6C68F4] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Rédiger un Article</span>
                </button>
              </div>

              <div className="space-y-3">
                {articles.map((art) => (
                  <div key={art.id} className="p-3.5 sm:p-4 rounded-xl bg-[#141446] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0 overflow-hidden">
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 w-full">
                      {art.image ? (
                        <img src={art.image} alt={art.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] min-w-0">
                          <span className="font-bold text-[#00C2C2] shrink-0">{art.category}</span>
                          <span className="text-slate-400 shrink-0">• {art.date}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${art.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                            {art.published ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-xs sm:text-sm leading-snug line-clamp-2 break-words">{art.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="p-1.5 text-slate-300 hover:text-white bg-white/5 rounded-lg cursor-pointer flex items-center gap-1 text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="sm:hidden text-[11px]">Éditer</span>
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 bg-white/5 rounded-lg cursor-pointer flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sm:hidden text-[11px]">Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS (CATALOGUE MATÉRIEL) */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Gestion du Catalogue Matériel</h2>
                  <p className="text-xs text-slate-400 mt-1">Ajoutez, ajustez les prix journaliers et états de disponibilité.</p>
                </div>
                <button
                  onClick={() => setEditingProduct({ name: '', category: 'Sonorisation', dailyRate: 50000, stockQuantity: 5, availabilityStatus: 'disponible', specifications: {}, isFeatured: false, image: '' })}
                  className="px-4 py-2.5 rounded-xl bg-[#00C2C2] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Matériel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-xl bg-[#141446] border border-white/10 space-y-3 flex flex-col justify-between overflow-hidden min-w-0">
                    {prod.image && (
                      <div className="h-36 -mx-4 -mt-4 mb-1 overflow-hidden relative">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141446] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center justify-between text-[10px] font-bold gap-2">
                        <span className="text-[#00C2C2] uppercase truncate">{prod.category}</span>
                        <span className={`px-2 py-0.5 rounded shrink-0 ${
                          prod.availabilityStatus === 'disponible' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {prod.availabilityStatus}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm break-words">{prod.name}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2 break-words">{prod.description}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="text-xs text-[#FFAD5B] font-bold truncate">{prod.dailyRate.toLocaleString()} FCFA/j (Stock: {prod.stockQuantity})</div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PACKS */}
          {activeTab === 'packs' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Gestion des Packs & Offres</h2>
                  <p className="text-xs text-slate-400 mt-1">Créez des offres groupées clé en main.</p>
                </div>
                <button
                  onClick={() => setEditingPack({ title: '', module: 'marketing', tagline: '', priceEstimate: 'À partir de 1 500 000 FCFA', badge: 'Sur-mesure', description: '', inclusions: [], popular: false, image: '' })}
                  className="px-4 py-2.5 rounded-xl bg-[#6C68F4] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Pack</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packs.map((pack) => (
                  <div key={pack.id} className="p-4 sm:p-5 rounded-xl bg-[#141446] border border-white/10 space-y-3 overflow-hidden min-w-0">
                    {pack.image && (
                      <div className="h-36 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-2 overflow-hidden relative">
                        <img src={pack.image} alt={pack.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141446] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00C2C2]/20 text-[#00C2C2] truncate">
                        {pack.badge}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingPack(pack)}
                          className="p-1 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePack(pack.id)}
                          className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-base">{pack.title}</h4>
                    <p className="text-xs text-[#FFAD5B] font-semibold">{pack.priceEstimate}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{pack.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COMMENTAIRES MODÉRATION */}
          {activeTab === 'comments' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Modération des Commentaires Publics</h2>
                <p className="text-xs text-slate-400 mt-1">Validez ou rejetez les avis déposés sans inscription sur les articles du blog.</p>
              </div>

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun commentaire soumis.</p>
                ) : (
                  comments.map((com) => (
                    <div key={com.id} className="p-4 rounded-xl bg-[#141446] border border-white/10 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="font-bold text-[#00C2C2]">{com.authorName}</span>
                          <span className="text-slate-400 truncate">• Article: {com.articleTitle || com.articleId}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          com.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          com.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {com.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 break-words">{com.content}</p>

                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-white/5">
                        {com.status !== 'approved' && (
                          <button
                            onClick={() => handleModerateComment(com.id, 'approved')}
                            className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approuver & Publier</span>
                          </button>
                        )}
                        {com.status !== 'rejected' && (
                          <button
                            onClick={() => handleModerateComment(com.id, 'rejected')}
                            className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Rejeter</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(com.id)}
                          className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: DEMANDES DE DEVIS */}
          {activeTab === 'devis' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Demandes de Devis Reçues</h2>
                <p className="text-xs text-slate-400 mt-1">Consultez et qualifiez les projets soumis par vos futurs clients.</p>
              </div>

              <div className="space-y-4">
                {devis.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune demande de devis enregistrée.</p>
                ) : (
                  devis.map((d) => (
                    <div key={d.id} className="p-4 sm:p-5 rounded-xl bg-[#141446] border border-white/10 space-y-3 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 min-w-0">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#00C2C2] break-words">{d.clientName}</span>
                          <span className="text-xs text-slate-400 ml-2 break-words">({d.company})</span>
                          <div className="text-[11px] text-slate-400 mt-0.5 break-words">Email : {d.email} | Tél : {d.phone}</div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <span className="text-xs font-bold text-[#FFAD5B]">Budget : {d.budgetRange}</span>
                          <select
                            value={d.status}
                            onChange={(e) => handleUpdateDevisStatus(d.id, e.target.value)}
                            className="px-3 py-1 rounded bg-white/10 text-xs text-white border border-white/15 cursor-pointer"
                          >
                            <option value="nouvelle" className="bg-[#141446]">Nouvelle</option>
                            <option value="en_traitement" className="bg-[#141446]">En traitement</option>
                            <option value="traitee" className="bg-[#141446]">Devis envoyé</option>
                            <option value="archivee" className="bg-[#141446]">Archivée</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed break-words">{d.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 9: PRÉ-RÉSERVATIONS MATÉRIEL */}
          {activeTab === 'reservations' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Demandes de Pré-réservation Matériel</h2>
                <p className="text-xs text-slate-400 mt-1">Gérez le matériel réservé, inspectez la durée et visualisez les emails de notification.</p>
              </div>

              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune pré-réservation enregistrée.</p>
                ) : (
                  reservations.map((res) => (
                    <div key={res.id} className="p-4 sm:p-5 rounded-xl bg-[#141446] border border-white/10 space-y-3 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 min-w-0">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-white break-words">{res.clientName}</span>
                            <span className="text-xs text-[#00C2C2] break-words">({res.company})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 break-words">
                            Période : <strong className="text-slate-200">Du {res.startDate} au {res.endDate}</strong> ({res.durationDays} jours) | Lieu : {res.location}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-[10px] text-slate-400">Total Estimé :</div>
                            <div className="text-sm sm:text-base font-extrabold text-[#00C2C2]">{res.totalEstimate.toLocaleString()} FCFA HT</div>
                          </div>

                          <select
                            value={res.status}
                            onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                            className="px-3 py-1 rounded bg-white/10 text-xs text-white border border-white/15 cursor-pointer"
                          >
                            <option value="en_attente" className="bg-[#141446]">En attente</option>
                            <option value="confirmee" className="bg-[#141446]">Confirmée</option>
                            <option value="refusee" className="bg-[#141446]">Refusée</option>
                          </select>
                        </div>
                      </div>

                      {/* Equipment Items */}
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-bold text-[#FFAD5B]">Équipements demandés :</div>
                        <div className="flex flex-wrap gap-2 min-w-0">
                          {res.equipmentDetails.map((eq, i) => (
                            <span key={i} className="px-2.5 py-1 rounded bg-white/5 text-xs text-slate-200 border border-white/10 break-words max-w-full">
                              {eq.name} (x{eq.quantity}) — {(eq.dailyRate * eq.quantity).toLocaleString()} FCFA/j
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 text-xs min-w-0">
                        <span className="text-slate-400 text-[11px] break-words">Contact : {res.email} | {res.phone}</span>

                        <button
                          onClick={() => setViewingReservationEmail(res)}
                          className="px-3 py-1 rounded bg-[#6C68F4]/20 hover:bg-[#6C68F4]/30 text-[#00C2C2] font-semibold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Voir les Emails Générés</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* EDIT MODALS FOR CRUD OPERATIONS */}

      {/* Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveService} className="w-full max-w-xl p-6 rounded-2xl bg-[#141446] border border-[#6C68F4] space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg">{editingService.id ? 'Éditer Service' : 'Nouveau Service'}</h3>
            <div>
              <label className="block text-xs mb-1">Titre</label>
              <input
                type="text"
                required
                value={editingService.title || ''}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Module / Catégorie</label>
              <select
                value={editingService.category || 'Marketing Digital'}
                onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                className="w-full p-2 rounded bg-[#0d0d2e] border border-white/15 text-xs"
              >
                <option value="Marketing Digital">Marketing Digital</option>
                <option value="Logistique Événementielle">Logistique Événementielle</option>
              </select>
            </div>

            <ImageUploader
              label="Image / Visuel de Présentation du Service"
              value={editingService.image || ''}
              onChange={(url) => setEditingService({ ...editingService, image: url })}
              adminToken={adminToken}
            />

            <div>
              <label className="block text-xs mb-1">Description courte</label>
              <textarea
                rows={2}
                value={editingService.shortDescription || ''}
                onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs mb-1">Description complète</label>
              <textarea
                rows={3}
                value={editingService.fullDescription || ''}
                onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded text-xs bg-white/10 cursor-pointer">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded text-xs font-bold bg-[#6C68F4] cursor-pointer">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveArticle} className="w-full max-w-xl p-6 rounded-2xl bg-[#141446] border border-[#6C68F4] space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg">{editingArticle.id ? 'Éditer Article' : 'Nouveau Article'}</h3>
            <div>
              <label className="block text-xs mb-1">Titre Article</label>
              <input
                type="text"
                required
                value={editingArticle.title || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              />
            </div>

            <ImageUploader
              label="Image de Couverture de l'Article"
              value={editingArticle.image || ''}
              onChange={(url) => setEditingArticle({ ...editingArticle, image: url })}
              adminToken={adminToken}
            />

            <div>
              <label className="block text-xs mb-1">Extrait</label>
              <textarea
                rows={2}
                value={editingArticle.excerpt || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs mb-1">Contenu complet</label>
              <textarea
                rows={5}
                value={editingArticle.content || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 rounded text-xs bg-white/10 cursor-pointer">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded text-xs font-bold bg-[#6C68F4] cursor-pointer">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveProduct} className="w-full max-w-xl p-6 rounded-2xl bg-[#141446] border border-[#00C2C2] space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg">{editingProduct.id ? 'Éditer Équipement' : 'Nouveau Matériel'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1">Nom Matériel</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Catégorie</label>
                <select
                  value={editingProduct.category || 'Sonorisation'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full p-2 rounded bg-[#0d0d2e] border border-white/15 text-xs"
                >
                  <option value="Sonorisation">Sonorisation</option>
                  <option value="Éclairage">Éclairage</option>
                  <option value="Audiovisuel">Audiovisuel</option>
                  <option value="Structure & Scène">Structure & Scène</option>
                  <option value="Mobilier & Déco">Mobilier & Déco</option>
                </select>
              </div>
            </div>

            <ImageUploader
              label="Photo de l'Équipement"
              value={editingProduct.image || ''}
              onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
              adminToken={adminToken}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1">Tarif FCFA / jour</label>
                <input
                  type="number"
                  required
                  value={editingProduct.dailyRate || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, dailyRate: Number(e.target.value) })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Quantité Stock</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stockQuantity || 1}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Statut</label>
                <select
                  value={editingProduct.availabilityStatus || 'disponible'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, availabilityStatus: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#0d0d2e] border border-white/15 text-xs"
                >
                  <option value="disponible">Disponible</option>
                  <option value="reserve">Sur réservation</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1">Description</label>
              <textarea
                rows={2}
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded text-xs bg-white/10 cursor-pointer">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded text-xs font-bold bg-[#00C2C2] text-slate-950 cursor-pointer">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Pack Modal */}
      {editingPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSavePack} className="w-full max-w-xl p-6 rounded-2xl bg-[#141446] border border-[#6C68F4] space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg">{editingPack.id ? 'Éditer Pack' : 'Nouveau Pack'}</h3>
            <div>
              <label className="block text-xs mb-1">Titre Pack</label>
              <input
                type="text"
                required
                value={editingPack.title || ''}
                onChange={(e) => setEditingPack({ ...editingPack, title: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              />
            </div>

            <ImageUploader
              label="Visuel de Couverture du Pack"
              value={editingPack.image || ''}
              onChange={(url) => setEditingPack({ ...editingPack, image: url })}
              adminToken={adminToken}
            />

            <div>
              <label className="block text-xs mb-1">Estimation Prix</label>
              <input
                type="text"
                value={editingPack.priceEstimate || ''}
                onChange={(e) => setEditingPack({ ...editingPack, priceEstimate: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Description</label>
              <textarea
                rows={2}
                value={editingPack.description || ''}
                onChange={(e) => setEditingPack({ ...editingPack, description: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingPack(null)} className="px-4 py-2 rounded text-xs bg-white/10 cursor-pointer">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded text-xs font-bold bg-[#6C68F4] cursor-pointer">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Reservation Email View Modal */}
      {viewingReservationEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-[#141446] border border-[#00C2C2] space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm">Emails Générés pour Référence #{viewingReservationEmail.id}</h3>
              <button onClick={() => setViewingReservationEmail(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-[#00C2C2]">Email Destiné au Client :</h4>
                <pre className="p-3 rounded bg-white/5 text-[11px] whitespace-pre-wrap mt-1">
                  {viewingReservationEmail.emailNotificationSent?.clientEmailContent}
                </pre>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#FFAD5B]">Alerte Transmise à l'Administrateur :</h4>
                <pre className="p-3 rounded bg-white/5 text-[11px] whitespace-pre-wrap mt-1">
                  {viewingReservationEmail.emailNotificationSent?.adminEmailContent}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setViewingReservationEmail(null)} className="px-4 py-2 rounded text-xs bg-[#00C2C2] text-slate-950 font-bold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
