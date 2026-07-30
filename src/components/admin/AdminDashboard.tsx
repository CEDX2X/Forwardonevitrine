import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { VideoUploader } from './VideoUploader';
import { AdminPasswordForm } from './AdminPasswordForm';
import { StatusModal } from './StatusModal';
import {
  AdminStats,
  ArticleItem,
  CommentItem,
  PackItem,
  ProductItem,
  PreReservationItem,
  QuoteRequestItem,
  ServiceItem,
  SiteContent,
  PartnerItem,
  TestimonialItem,
  VideoCardItem
} from '../../types';
import { initialServiceCategories, initialPartners, initialTestimonials, initialVideoCards } from '../../data/initialData';
import {
  getSiteContent,
  updateSiteContent,
  getServices,
  createService,
  updateService,
  deleteService,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPacks,
  createPack,
  updatePack,
  deletePack,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getComments,
  updateCommentStatus,
  deleteComment,
  getDevis,
  updateDevisStatus,
  deleteDevis,
  getPreReservations,
  updatePreReservationStatus,
  deletePreReservation,
  resetAndReseedFirestore
} from '../../lib/firebaseStore';
import { ForwardOneLogo } from '../ForwardOneLogo';
import { PartnersBanner } from '../PartnersBanner';
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
  EyeOff,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  MessageCircle,
  Handshake,
  Globe,
  ExternalLink,
  Video,
  Star,
  Play
} from 'lucide-react';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
  onRefreshPublicData: () => void;
}

const FirebaseVercelPanel: React.FC<{
  adminToken: string;
  onResetSuccess: () => void;
  setStatusModal: (modal: any) => void;
  setDeleteConfirm: (confirm: any) => void;
}> = ({ adminToken, onResetSuccess, setStatusModal, setDeleteConfirm }) => {
  const [config, setConfig] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/firebase-config', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('Failed to load firebase config:', err));
  }, [adminToken]);

  const handleCopyEnv = () => {
    if (!config?.envSnippet) return;
    const envText = Object.entries(config.envSnippet)
      .map(([k, v]) => `${k}="${v}"`)
      .join('\n');
    navigator.clipboard.writeText(envText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetDb = () => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Vider & Réinitialiser la base de données',
      message: 'ATTENTION : Cette action supprimera et réinitialisera toutes les collections Firestore avec les données par défaut. Voulez-vous continuer ?',
      onConfirm: async () => {
        setIsResetting(true);
        try {
          let resetDone = false;
          try {
            const res = await fetch('/api/admin/reset-db', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
              const data = await res.json();
              if (data.success) resetDone = true;
            }
          } catch (e) {}

          if (!resetDone) {
            await resetAndReseedFirestore();
          }

          setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Base réinitialisée !',
            message: 'La base de données Firestore a été vidée et rechargée à neuf.'
          });
          onResetSuccess();
        } catch (e: any) {
          setStatusModal({
            isOpen: true,
            type: 'error',
            title: 'Erreur',
            message: e.message || 'Échec de la réinitialisation.'
          });
        } finally {
          setIsResetting(false);
        }
      }
    });
  };

  return (
    <div className="space-y-6 pt-4 border-t border-white/10">
      {/* Vercel Environment Variables Card */}
      <div className="p-5 rounded-2xl bg-[#141446] border border-[#6C68F4]/30 space-y-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6C68F4]/20 text-[#00C2C2]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Connexion Vercel & Firebase</h3>
              <p className="text-xs text-slate-400">Variables d'environnement pour votre déploiement sur Vercel</p>
            </div>
          </div>

          <button
            onClick={handleCopyEnv}
            className="px-4 py-2 rounded-xl bg-[#6C68F4] hover:bg-[#5b57e0] text-xs font-bold text-white transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <RefreshCw className="w-4 h-4" />}
            <span>{copied ? 'Copié dans le presse-papier !' : 'Copier Variables Vercel (.env)'}</span>
          </button>
        </div>

        {config?.envSnippet && (
          <div className="bg-[#0b0b26] p-4 rounded-xl border border-white/10 overflow-x-auto text-[11px] font-mono text-slate-300 space-y-1">
            {Object.entries(config.envSnippet).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-[#00C2C2] font-semibold">{k}=</span>
                <span className="text-emerald-400 font-mono">"{String(v)}"</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
          <strong> Astuce Déploiement Vercel :</strong>
          <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
            <li>Sur Vercel, allez dans <strong>Project Settings &gt; Environment Variables</strong>.</li>
            <li>Collez les variables ci-dessus pour que votre site Vercel communique directement avec cette même base Firestore.</li>
            <li>Dans la console Firebase, vérifiez que le domaine de votre site Vercel (ex: <code>mon-projet.vercel.app</code>) est autorisé.</li>
          </ul>
        </div>
      </div>

      {/* Wipe & Reset Database Card */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-rose-200">Réinitialiser / Vider la Base de Données</h3>
              <p className="text-xs text-rose-300/70">Wipe complet et rechargement des collections Firestore</p>
            </div>
          </div>

          <button
            onClick={handleResetDb}
            disabled={isResetting}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isResetting ? 'Réinitialisation...' : 'Vider & Réinitialiser la Base Firestore'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Si vous avez des erreurs de synchronisation ou des anciennes données corrompues, vous pouvez purger les collections Firestore et les réinitialiser immédiatement avec le jeu de données par défaut.
        </p>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminToken,
  onLogout,
  onRefreshPublicData
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'siteContent' | 'partners' | 'services' | 'articles' | 'products' | 'packs' | 'comments' | 'devis' | 'reservations' | 'settings'
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
  const [devisSearch, setDevisSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals / Forms States
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [serviceFeatures, setServiceFeatures] = useState<string[]>(['']);

  const handleOpenNewService = () => {
    setServiceFeatures(['']);
    setEditingService({
      title: '',
      category: 'Marketing Digital',
      badge: 'OFFRE DIGITAL',
      tagline: '',
      priceEstimate: 'Sur devis',
      popular: false,
      shortDescription: '',
      fullDescription: '',
      iconName: 'Sparkles',
      features: [],
      image: ''
    });
  };

  const handleOpenEditService = (serv: ServiceItem) => {
    const feats = serv.features && serv.features.length > 0 ? [...serv.features] : [''];
    setServiceFeatures(feats);
    setEditingService(serv);
  };

  const [editingArticle, setEditingArticle] = useState<Partial<ArticleItem> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerItem> | null>(null);
  const [specKeys, setSpecKeys] = useState<string[]>(['', '', '', '', '']);
  const [specValues, setSpecValues] = useState<string[]>(['', '', '', '', '']);

  const handleOpenNewPartner = () => {
    setEditingPartner({
      name: '',
      logo: '',
      category: 'Partenaire Technique',
      website: '',
      visible: true
    });
  };

  const handleOpenEditPartner = (partner: PartnerItem) => {
    setEditingPartner(partner);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner || !siteContent) return;

    const currentPartners = siteContent.partners ? [...siteContent.partners] : [...initialPartners];
    let updatedPartners: PartnerItem[];

    if (editingPartner.id) {
      updatedPartners = currentPartners.map(p => p.id === editingPartner.id ? (editingPartner as PartnerItem) : p);
    } else {
      const newPartner: PartnerItem = {
        id: `partner-${Date.now()}`,
        name: editingPartner.name || 'Nouveau Partenaire',
        logo: editingPartner.logo || '',
        category: editingPartner.category || 'Partenaire',
        website: editingPartner.website || '',
        visible: editingPartner.visible !== false
      };
      updatedPartners = [newPartner, ...currentPartners];
    }

    const updatedSiteContent = {
      ...siteContent,
      partners: updatedPartners
    };

    try {
      let saved = false;
      try {
        const res = await fetch('/api/site-content', {
          method: 'PUT',
          headers: fetchHeaders,
          body: JSON.stringify(updatedSiteContent)
        });
        if (res.ok) saved = true;
      } catch (e) {}

      if (!saved) {
        await updateSiteContent(updatedSiteContent);
      }

      setEditingPartner(null);
      setSiteContent(updatedSiteContent);
      setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Partenaire enregistré avec succès !' });
      loadAllData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (e) {
      setStatusModal({ isOpen: true, type: 'error', title: 'Erreur', message: 'Erreur lors de la sauvegarde du partenaire.' });
    }
  };

  const handleDeletePartner = (id: string, partnerName: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Supprimer le partenaire',
      message: `Êtes-vous sûr de vouloir retirer "${partnerName}" du bandeau des partenaires ?`,
      onConfirm: async () => {
        if (!siteContent) return;
        const updatedPartners = (siteContent.partners || []).filter(p => p.id !== id);
        const updatedSiteContent = { ...siteContent, partners: updatedPartners };
        
        try {
          const res = await fetch('/api/site-content', {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify(updatedSiteContent)
          });
          if (!res.ok) await updateSiteContent(updatedSiteContent);
        } catch (e) {
          await updateSiteContent(updatedSiteContent);
        }

        setSiteContent(updatedSiteContent);
        loadAllData();
        if (onRefreshPublicData) onRefreshPublicData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Partenaire retiré.' });
      }
    });
  };

  const handleTogglePartnerVisibility = async (partner: PartnerItem) => {
    if (!siteContent) return;
    const updatedPartners = (siteContent.partners || []).map(p => 
      p.id === partner.id ? { ...p, visible: !p.visible } : p
    );
    const updatedSiteContent = { ...siteContent, partners: updatedPartners };
    setSiteContent(updatedSiteContent);

    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify(updatedSiteContent)
      });
      if (!res.ok) await updateSiteContent(updatedSiteContent);
    } catch (e) {
      await updateSiteContent(updatedSiteContent);
    }

    if (onRefreshPublicData) onRefreshPublicData();
  };

  const handleResetDefaultPartners = async () => {
    if (!siteContent) return;
    setDeleteConfirm({
      isOpen: true,
      title: 'Réinitialiser les partenaires',
      message: 'Voulez-vous réinitialiser la liste avec les 8 partenaires et marques par défaut ?',
      onConfirm: async () => {
        const updatedSiteContent = { ...siteContent, partners: initialPartners };
        setSiteContent(updatedSiteContent);

        try {
          const res = await fetch('/api/site-content', {
            method: 'PUT',
            headers: fetchHeaders,
            body: JSON.stringify(updatedSiteContent)
          });
          if (!res.ok) await updateSiteContent(updatedSiteContent);
        } catch (e) {
          await updateSiteContent(updatedSiteContent);
        }

        loadAllData();
        if (onRefreshPublicData) onRefreshPublicData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Partenaires réinitialisés.' });
      }
    });
  };

  const handleOpenNewProduct = () => {
    setSpecKeys(['', '', '', '', '']);
    setSpecValues(['', '', '', '', '']);
    setEditingProduct({ name: '', category: 'Sonorisation', dailyRate: 50000, stockQuantity: 5, availabilityStatus: 'disponible', specifications: {}, isFeatured: false, image: '' });
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    const entries = Object.entries(prod.specifications || {});
    const keys = ['', '', '', '', ''];
    const values = ['', '', '', '', ''];
    entries.slice(0, 5).forEach(([k, v], idx) => {
      keys[idx] = k;
      values[idx] = v;
    });
    setSpecKeys(keys);
    setSpecValues(values);
    setEditingProduct(prod);
  };
  const [editingPack, setEditingPack] = useState<Partial<PackItem> | null>(null);
  const [packInclusions, setPackInclusions] = useState<string[]>(['']);

  const handleOpenNewPack = () => {
    setPackInclusions(['']);
    setEditingPack({ title: '', module: 'marketing', tagline: '', priceEstimate: 'À partir de 1 500 000 FCFA', badge: 'Sur-mesure', description: '', inclusions: [], popular: false, image: '' });
  };

  const handleOpenEditPack = (pack: PackItem) => {
    const incs = pack.inclusions && pack.inclusions.length > 0 ? [...pack.inclusions] : [''];
    setPackInclusions(incs);
    setEditingPack(pack);
  };
  const [viewingReservationEmail, setViewingReservationEmail] = useState<PreReservationItem | null>(null);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  }>({ isOpen: false, title: '', message: '', onConfirm: async () => {} });

  const fetchHeaders = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      let statsData, contentData, servicesData, articlesData, productsData, packsData, commentsData, devisData, reservationsData;

      try {
        const resStats = await fetch('/api/admin/stats', { headers: fetchHeaders });
        if (resStats.ok && resStats.headers.get('content-type')?.includes('application/json')) {
          statsData = await resStats.json();
        }
      } catch (e) {}

      try {
        const resContent = await fetch('/api/site-content');
        if (resContent.ok && resContent.headers.get('content-type')?.includes('application/json')) {
          contentData = await resContent.json();
        }
      } catch (e) {}
      if (!contentData) contentData = await getSiteContent();
      if (!contentData.serviceCategories || contentData.serviceCategories.length === 0) {
        contentData.serviceCategories = initialServiceCategories;
      }

      try {
        const resServices = await fetch('/api/services');
        if (resServices.ok && resServices.headers.get('content-type')?.includes('application/json')) {
          servicesData = await resServices.json();
        }
      } catch (e) {}
      if (!servicesData) servicesData = await getServices();

      try {
        const resArticles = await fetch('/api/articles', { headers: fetchHeaders });
        if (resArticles.ok && resArticles.headers.get('content-type')?.includes('application/json')) {
          articlesData = await resArticles.json();
        }
      } catch (e) {}
      if (!articlesData) articlesData = await getArticles();

      try {
        const resProducts = await fetch('/api/products');
        if (resProducts.ok && resProducts.headers.get('content-type')?.includes('application/json')) {
          productsData = await resProducts.json();
        }
      } catch (e) {}
      if (!productsData) productsData = await getProducts();

      try {
        const resPacks = await fetch('/api/packs');
        if (resPacks.ok && resPacks.headers.get('content-type')?.includes('application/json')) {
          packsData = await resPacks.json();
        }
      } catch (e) {}
      if (!packsData) packsData = await getPacks();

      try {
        const resComments = await fetch('/api/comments', { headers: fetchHeaders });
        if (resComments.ok && resComments.headers.get('content-type')?.includes('application/json')) {
          commentsData = await resComments.json();
        }
      } catch (e) {}
      if (!commentsData) commentsData = await getComments();

      try {
        const resDevis = await fetch('/api/devis', { headers: fetchHeaders });
        if (resDevis.ok && resDevis.headers.get('content-type')?.includes('application/json')) {
          devisData = await resDevis.json();
        }
      } catch (e) {}
      if (!devisData) devisData = await getDevis();

      try {
        const resReservations = await fetch('/api/prereservations', { headers: fetchHeaders });
        if (resReservations.ok && resReservations.headers.get('content-type')?.includes('application/json')) {
          reservationsData = await resReservations.json();
        }
      } catch (e) {}
      if (!reservationsData) reservationsData = await getPreReservations();

      if (!statsData) {
        statsData = {
          totalServices: servicesData.length,
          totalProducts: productsData.length,
          totalPacks: packsData.length,
          totalArticles: articlesData.length,
          totalQuotes: devisData.length,
          pendingQuotes: devisData.filter((d: any) => d.status === 'pending').length,
          totalReservations: reservationsData.length,
          pendingReservations: reservationsData.filter((r: any) => r.status === 'pending').length,
          totalComments: commentsData.length,
          pendingComments: commentsData.filter((c: any) => c.status === 'pending').length
        };
      }

      setStats(statsData);
      setSiteContent(contentData);
      setServices(servicesData);
      setArticles(articlesData);
      setProducts(productsData);
      setPacks(packsData);
      setComments(commentsData);
      setDevis(devisData);
      setReservations(reservationsData);

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
      let saved = false;
      try {
        const res = await fetch('/api/site-content', {
          method: 'PUT',
          headers: fetchHeaders,
          body: JSON.stringify(siteContent)
        });
        if (res.ok) saved = true;
      } catch (e) {}

      if (!saved) {
        await updateSiteContent(siteContent);
      }

      setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Textes du site mis à jour avec succès !' });
      loadAllData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (e) {
      setStatusModal({ isOpen: true, type: 'error', title: 'Erreur', message: 'Erreur lors de la sauvegarde.' });
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const isNew = !editingService.id;
    const id = editingService.id || 'service_' + Date.now();
    const finalFeatures = serviceFeatures.map(s => s.trim()).filter(Boolean);
    const payload: ServiceItem = {
      ...editingService,
      id,
      features: finalFeatures
    };

    try {
      let saved = false;
      try {
        const url = isNew ? '/api/services' : `/api/services/${id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, {
          method,
          headers: fetchHeaders,
          body: JSON.stringify(payload)
        });
        if (res.ok) saved = true;
      } catch (e) {}

      if (!saved) {
        if (isNew) {
          await createService(payload);
        } else {
          await updateService(id, payload);
        }
      }

      setEditingService(null);
      await loadAllData();
      if (onRefreshPublicData) onRefreshPublicData();
      setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Offre / Service enregistré(e) avec succès.' });
    } catch (e) {
      console.error('Error saving service:', e);
      setStatusModal({ isOpen: true, type: 'error', title: 'Erreur', message: 'Erreur enregistrement service.' });
    }
  };

  const handleDeleteService = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Supprimer le service',
      message: 'Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/services/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deleteService(id);
        } catch (e) {
          await deleteService(id);
        }
        await loadAllData();
        if (onRefreshPublicData) onRefreshPublicData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Service supprimé avec succès.' });
      }
    });
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    const isNew = !editingArticle.id;
    const id = editingArticle.id || 'art_' + Date.now();
    const payload: ArticleItem = {
      ...editingArticle,
      id
    };

    try {
      let saved = false;
      try {
        const url = isNew ? '/api/articles' : `/api/articles/${id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, {
          method,
          headers: fetchHeaders,
          body: JSON.stringify(payload)
        });
        if (res.ok) saved = true;
      } catch (e) {}

      if (!saved) {
        if (isNew) {
          await createArticle(payload);
        } else {
          await updateArticle(id, payload);
        }
      }

      setEditingArticle(null);
      await loadAllData();
      if (onRefreshPublicData) onRefreshPublicData();
      setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Article enregistré avec succès.' });
    } catch (e) {
      console.error('Error saving article:', e);
      setStatusModal({ isOpen: true, type: 'error', title: 'Erreur', message: 'Erreur enregistrement article.' });
    }
  };

  const handleDeleteArticle = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Supprimer l'article",
      message: "Êtes-vous sûr de vouloir supprimer cet article ?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/articles/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deleteArticle(id);
        } catch (e) {
          await deleteArticle(id);
        }
        await loadAllData();
        if (onRefreshPublicData) onRefreshPublicData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Article supprimé avec succès.' });
      }
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const newSpecs: Record<string, string> = {};
    for (let i = 0; i < 5; i++) {
      const k = specKeys[i]?.trim();
      const v = specValues[i]?.trim();
      if (k) {
        newSpecs[k] = v || '';
      }
    }

    const isNew = !editingProduct.id;
    const id = editingProduct.id || 'prod_' + Date.now();
    const payload: ProductItem = {
      ...editingProduct,
      id,
      specifications: newSpecs
    };

    try {
      let saved = false;
      try {
        const url = isNew ? '/api/products' : `/api/products/${id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, {
          method,
          headers: fetchHeaders,
          body: JSON.stringify(payload)
        });
        if (res.ok) saved = true;
      } catch (e) {}

      if (!saved) {
        if (isNew) {
          await createProduct(payload);
        } else {
          await updateProduct(id, payload);
        }
      }

      setEditingProduct(null);
      await loadAllData();
      if (onRefreshPublicData) onRefreshPublicData();
      setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Produit enregistré avec succès.' });
    } catch (e) {
      console.error('Error saving product:', e);
      setStatusModal({ isOpen: true, type: 'error', title: 'Erreur', message: 'Erreur enregistrement produit.' });
    }
  };

  const handleDeleteProduct = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Supprimer le matériel",
      message: "Êtes-vous sûr de vouloir supprimer cet équipement de votre catalogue ?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deleteProduct(id);
        } catch (e) {
          await deleteProduct(id);
        }
        await loadAllData();
        if (onRefreshPublicData) onRefreshPublicData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Matériel supprimé avec succès.' });
      }
    });
  };

  const handleSavePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPack) return;
    const finalInclusions = packInclusions.map(s => s.trim()).filter(Boolean);
    const isNew = !editingPack.id;
    const id = editingPack.id || 'pack_' + Date.now();
    const payload: PackItem = {
      ...editingPack,
      id,
      inclusions: finalInclusions
    };

    try {
      let saved = false;
      try {
        const url = isNew ? '/api/packs' : `/api/packs/${id}`;
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch(url, {
          method,
          headers: fetchHeaders,
          body: JSON.stringify(payload)
        });
        if (res.ok) saved = true;
      } catch (e) {}

      if (!saved) {
        if (isNew) {
          await createPack(payload);
        } else {
          await updatePack(id, payload);
        }
      }

      setEditingPack(null);
      await loadAllData();
      if (onRefreshPublicData) onRefreshPublicData();
      setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Pack enregistré avec succès.' });
    } catch (e) {
      console.error('Error saving pack:', e);
      setStatusModal({ isOpen: true, type: 'error', title: 'Erreur', message: 'Erreur enregistrement pack.' });
    }
  };

  const handleDeletePack = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Supprimer le pack",
      message: "Êtes-vous sûr de vouloir supprimer ce pack ?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/packs/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deletePack(id);
        } catch (e) {
          await deletePack(id);
        }
        await loadAllData();
        if (onRefreshPublicData) onRefreshPublicData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Pack supprimé avec succès.' });
      }
    });
  };

  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/comments/${id}/status`, {
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify({ status })
      });
      if (!res.ok) await updateCommentStatus(id, status);
    } catch (e) {
      await updateCommentStatus(id, status);
    }
    loadAllData();
  };

  const handleDeleteComment = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Supprimer le commentaire",
      message: "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/comments/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deleteComment(id);
        } catch (e) {
          await deleteComment(id);
        }
        loadAllData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Commentaire supprimé avec succès.' });
      }
    });
  };

  const handleDeleteDevis = (id: string, clientName: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Supprimer la demande de devis",
      message: `Êtes-vous sûr de vouloir supprimer le devis de ${clientName} ?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/devis/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deleteDevis(id);
        } catch (e) {
          await deleteDevis(id);
        }
        loadAllData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Demande de devis supprimée.' });
      }
    });
  };

  const handleDeleteReservation = (id: string, clientName: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: "Supprimer la pré-réservation",
      message: `Êtes-vous sûr de vouloir supprimer la réservation de ${clientName} ?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/prereservations/${id}`, { method: 'DELETE', headers: fetchHeaders });
          if (!res.ok) await deletePreReservation(id);
        } catch (e) {
          await deletePreReservation(id);
        }
        loadAllData();
        setStatusModal({ isOpen: true, type: 'success', title: 'Succès', message: 'Pré-réservation supprimée.' });
      }
    });
  };

  const handleUpdateDevisStatus = async (id: string, status: 'nouvelle' | 'en_traitement' | 'traitee' | 'archivee') => {
    try {
      const res = await fetch(`/api/devis/${id}/status`, {
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify({ status })
      });
      if (!res.ok) await updateDevisStatus(id, status);
    } catch (e) {
      await updateDevisStatus(id, status);
    }
    loadAllData();
  };

  const handleUpdateReservationStatus = async (id: string, status: 'en_attente' | 'confirmee' | 'refusee') => {
    try {
      const res = await fetch(`/api/prereservations/${id}/status`, {
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify({ status })
      });
      if (!res.ok) await updatePreReservationStatus(id, status);
    } catch (e) {
      await updatePreReservationStatus(id, status);
    }
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
        <aside className="w-full md:w-64 bg-[#0d0d2e] border-b md:border-b-0 md:border-r border-white/10 p-3 md:p-4 space-y-4 overflow-x-auto md:overflow-x-visible scrollbar-none shrink-0">
          
          {/* GROUP 1 */}
          <div className="space-y-1">
            <div className="hidden md:block text-[10px] font-extrabold uppercase tracking-wider text-[#00C2C2] px-3 py-1">
              Pilotage & Demandes
            </div>
            <div className="flex md:flex-col gap-1 min-w-max md:min-w-0">
              {[
                { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
                { id: 'devis', label: 'Demandes de Devis', icon: FileText, count: devis.length, badge: stats?.pendingQuotes ? `${stats.pendingQuotes} att.` : null },
                { id: 'reservations', label: 'Pré-réservations', icon: CalendarCheck, count: reservations.length, badge: stats?.pendingReservations ? `${stats.pendingReservations} att.` : null },
                { id: 'comments', label: 'Commentaires Blog', icon: MessageSquare, count: comments.length, badge: stats?.pendingComments ? `${stats.pendingComments} mod.` : null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30 font-bold'
                        : 'text-slate-300 bg-white/5 md:bg-transparent hover:bg-white/10 active:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 opacity-90 shrink-0" />
                      <span>{tab.label}</span>
                    </div>

                    {tab.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFAD5B] text-slate-950 ml-1">
                        {tab.badge}
                      </span>
                    ) : tab.count !== undefined ? (
                      <span className="text-[10px] text-slate-400 font-normal ml-1 bg-white/10 px-1.5 py-0.5 rounded-md">
                        {tab.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GROUP 2 */}
          <div className="space-y-1 pt-2 md:border-t border-white/10">
            <div className="hidden md:block text-[10px] font-extrabold uppercase tracking-wider text-[#00C2C2] px-3 py-1">
              Offres & Catalogues
            </div>
            <div className="flex md:flex-col gap-1 min-w-max md:min-w-0">
              {[
                { id: 'services', label: 'Offres Marketing', icon: Briefcase, count: services.length },
                { id: 'packs', label: 'Packs Clé en Main', icon: Boxes, count: packs.length },
                { id: 'products', label: 'Catalogue Matériel', icon: Package, count: products.length },
                { id: 'articles', label: 'Blog & Articles', icon: BookOpen, count: articles.length },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30 font-bold'
                        : 'text-slate-300 bg-white/5 md:bg-transparent hover:bg-white/10 active:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 opacity-90 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="text-[10px] text-slate-400 font-normal ml-1 bg-white/10 px-1.5 py-0.5 rounded-md">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GROUP 3 */}
          <div className="space-y-1 pt-2 md:border-t border-white/10">
            <div className="hidden md:block text-[10px] font-extrabold uppercase tracking-wider text-[#00C2C2] px-3 py-1">
              Apparence & Paramètres
            </div>
            <div className="flex md:flex-col gap-1 min-w-max md:min-w-0">
              {[
                { id: 'siteContent', label: 'Textes & Visuels Site', icon: Edit3 },
                { id: 'partners', label: 'Bandeau Partenaires', icon: Handshake, count: siteContent?.partners?.length },
                { id: 'settings', label: 'Paramètres Back-Office', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#6C68F4] text-white shadow-md shadow-[#6C68F4]/30 font-bold'
                        : 'text-slate-300 bg-white/5 md:bg-transparent hover:bg-white/10 active:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 opacity-90 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="text-[10px] text-slate-400 font-normal ml-1 bg-white/10 px-1.5 py-0.5 rounded-md">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
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

                {/* Hero Carousel Customization Section */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Images du Carrousel d'accueil</h3>
                      <p className="text-xs text-slate-400">Gérez les images de la zone de défilement visuel de la page d'accueil.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentSlides = siteContent.heroSlides || [];
                        const newSlide = {
                          id: `slide-${Date.now()}`,
                          title: '',
                          subtitle: '',
                          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=85',
                          buttonText: '',
                          tab: ''
                        };
                        setSiteContent({ ...siteContent, heroSlides: [...currentSlides, newSlide] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#00C2C2] text-slate-950 font-bold text-xs hover:bg-[#00a3a3] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une image</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(siteContent.heroSlides || []).map((slide, index) => (
                      <div key={slide.id || index} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#00C2C2]">Image #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentSlides = siteContent.heroSlides || [];
                              const updated = currentSlides.filter((_, i) => i !== index);
                              setSiteContent({ ...siteContent, heroSlides: updated });
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            title="Supprimer cette image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <ImageUploader
                            label="Image de fond (Téléverser depuis l'appareil ou URL)"
                            value={slide.image}
                            onChange={(url) => {
                              const currentSlides = [...(siteContent.heroSlides || [])];
                              currentSlides[index] = { ...slide, image: url };
                              setSiteContent({ ...siteContent, heroSlides: currentSlides });
                            }}
                            adminToken={adminToken}
                          />
                        </div>

                        {slide.image && (
                          <div className="h-32 w-full rounded-xl overflow-hidden border border-white/10 mt-2">
                            <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Categories Grid Management Section */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Cartes de Services (Page d'Accueil)</h3>
                    <p className="text-xs text-slate-400">Modifiez les images (Zone 2/3 du haut) et les textes (Zone 1/3 du bas) des 3 cartes de présentation des services, ainsi que leur statut de disponibilité.</p>
                  </div>

                  <div className="space-y-4">
                    {((siteContent.serviceCategories && siteContent.serviceCategories.length > 0)
                      ? siteContent.serviceCategories
                      : initialServiceCategories
                    ).map((cat, index) => (
                      <div key={cat.id || index} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#00C2C2]">Carte #{index + 1} : {cat.title}</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cat.available}
                              onChange={(e) => {
                                const currentCats = siteContent.serviceCategories && siteContent.serviceCategories.length > 0
                                  ? [...siteContent.serviceCategories]
                                  : [...initialServiceCategories];
                                currentCats[index] = { ...cat, available: e.target.checked };
                                setSiteContent({ ...siteContent, serviceCategories: currentCats });
                              }}
                              className="rounded bg-white/10 border-white/20 text-[#6C68F4] focus:ring-0"
                            />
                            <span className="text-xs font-medium text-slate-300">Disponible / Actif</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Titre de la Carte</label>
                            <input
                              type="text"
                              value={cat.title}
                              onChange={(e) => {
                                const currentCats = siteContent.serviceCategories && siteContent.serviceCategories.length > 0
                                  ? [...siteContent.serviceCategories]
                                  : [...initialServiceCategories];
                                currentCats[index] = { ...cat, title: e.target.value };
                                setSiteContent({ ...siteContent, serviceCategories: currentCats });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description courte (Bas de la carte)</label>
                            <input
                              type="text"
                              value={cat.description}
                              onChange={(e) => {
                                const currentCats = siteContent.serviceCategories && siteContent.serviceCategories.length > 0
                                  ? [...siteContent.serviceCategories]
                                  : [...initialServiceCategories];
                                currentCats[index] = { ...cat, description: e.target.value };
                                setSiteContent({ ...siteContent, serviceCategories: currentCats });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                          </div>
                        </div>

                        <ImageUploader
                          label="Image de la Carte (Haut de la carte 2/3)"
                          value={cat.image}
                          onChange={(url) => {
                            const currentCats = siteContent.serviceCategories && siteContent.serviceCategories.length > 0
                              ? [...siteContent.serviceCategories]
                              : [...initialServiceCategories];
                            currentCats[index] = { ...cat, image: url };
                            setSiteContent({ ...siteContent, serviceCategories: currentCats });
                          }}
                          adminToken={adminToken}
                        />

                        {cat.image && (
                          <div className="h-28 w-full rounded-xl overflow-hidden border border-white/10 mt-2">
                            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials Management Section */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#FFAD5B]" />
                        <span>Section Témoignages & Avis Clients</span>
                      </h3>
                      <p className="text-xs text-slate-400">Modifiez le titre, le sous-titre et les avis clients affichés sur le site.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentTestis = siteContent.testimonials || initialTestimonials;
                        const newTesti: TestimonialItem = {
                          id: `testi-${Date.now()}`,
                          clientName: 'Nouveau Client',
                          clientRole: 'Responsable',
                          company: 'Entreprise',
                          comment: 'Excellent service et accompagnement professionnel de l’équipe Forward One.',
                          rating: 5,
                          avatar: '',
                          date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                        };
                        setSiteContent({ ...siteContent, testimonials: [...currentTestis, newTesti] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#00C2C2] text-slate-950 font-bold text-xs hover:bg-[#00a3a3] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un témoignage</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Titre de la section Témoignages</label>
                      <input
                        type="text"
                        value={siteContent.testimonialsTitle || "Ce Que Disent Nos Clients"}
                        onChange={(e) => setSiteContent({ ...siteContent, testimonialsTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Sous-titre de la section Témoignages</label>
                      <input
                        type="text"
                        value={siteContent.testimonialsSubtitle || "La satisfaction de nos partenaires est la preuve irréfutable de notre quête d’excellence."}
                        onChange={(e) => setSiteContent({ ...siteContent, testimonialsSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {((siteContent.testimonials && siteContent.testimonials.length > 0)
                      ? siteContent.testimonials
                      : initialTestimonials
                    ).map((testi, index) => (
                      <div key={testi.id || index} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#FFAD5B]">Témoignage #{index + 1} : {testi.clientName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentTestis = siteContent.testimonials || initialTestimonials;
                              const updated = currentTestis.filter((_, i) => i !== index);
                              setSiteContent({ ...siteContent, testimonials: updated });
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            title="Supprimer ce témoignage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nom du Client</label>
                            <input
                              type="text"
                              value={testi.clientName}
                              onChange={(e) => {
                                const currentTestis = [...(siteContent.testimonials || initialTestimonials)];
                                currentTestis[index] = { ...testi, clientName: e.target.value };
                                setSiteContent({ ...siteContent, testimonials: currentTestis });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Rôle / Poste</label>
                            <input
                              type="text"
                              value={testi.clientRole}
                              onChange={(e) => {
                                const currentTestis = [...(siteContent.testimonials || initialTestimonials)];
                                currentTestis[index] = { ...testi, clientRole: e.target.value };
                                setSiteContent({ ...siteContent, testimonials: currentTestis });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Entreprise</label>
                            <input
                              type="text"
                              value={testi.company}
                              onChange={(e) => {
                                const currentTestis = [...(siteContent.testimonials || initialTestimonials)];
                                currentTestis[index] = { ...testi, company: e.target.value };
                                setSiteContent({ ...siteContent, testimonials: currentTestis });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Avis / Commentaire</label>
                          <textarea
                            rows={2}
                            value={testi.comment}
                            onChange={(e) => {
                              const currentTestis = [...(siteContent.testimonials || initialTestimonials)];
                              currentTestis[index] = { ...testi, comment: e.target.value };
                              setSiteContent({ ...siteContent, testimonials: currentTestis });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                          />
                        </div>

                        <ImageUploader
                          label="Avatar ou Photo de profil (Optionnel)"
                          value={testi.avatar || ''}
                          onChange={(url) => {
                            const currentTestis = [...(siteContent.testimonials || initialTestimonials)];
                            currentTestis[index] = { ...testi, avatar: url };
                            setSiteContent({ ...siteContent, testimonials: currentTestis });
                          }}
                          adminToken={adminToken}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Cards Section Management */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-[#00C2C2]" />
                        <span>Section Cartes Vidéos (Directement après les Témoignages)</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Modifiez les 3 cartes vidéos rectangulaires à l'horizontale. Vous pouvez changer l'intitulé (titre sur la carte), la vidéo (YouTube ou fichier MP4) et l'image de couverture.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVids = siteContent.videoCards || initialVideoCards;
                        const newVid: VideoCardItem = {
                          id: `video-${Date.now()}`,
                          title: 'Nouvelle Vidéo Réalisation',
                          subtitle: 'Description rapide de la prestation ou de la réalisation.',
                          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                          thumbnailImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
                          badge: 'FORWARD ONE'
                        };
                        setSiteContent({ ...siteContent, videoCards: [...currentVids, newVid] });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#6C68F4] text-white font-bold text-xs hover:bg-[#5b57e0] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une carte vidéo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Titre de la section Vidéos</label>
                      <input
                        type="text"
                        value={siteContent.videoSectionTitle || "Forward One en Action"}
                        onChange={(e) => setSiteContent({ ...siteContent, videoSectionTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Sous-titre de la section Vidéos</label>
                      <input
                        type="text"
                        value={siteContent.videoSectionSubtitle || "Découvrez nos réalisations en vidéos : régies événements, tournages, shows lumière et créations web."}
                        onChange={(e) => setSiteContent({ ...siteContent, videoSectionSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {((siteContent.videoCards && siteContent.videoCards.length > 0)
                      ? siteContent.videoCards
                      : initialVideoCards
                    ).map((video, index) => (
                      <div key={video.id || index} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#00C2C2]">Carte Vidéo #{index + 1} : {video.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentVids = siteContent.videoCards || initialVideoCards;
                              const updated = currentVids.filter((_, i) => i !== index);
                              setSiteContent({ ...siteContent, videoCards: updated });
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            title="Supprimer cette carte vidéo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Intitulé / Titre (Affiché DESSUS la carte)</label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => {
                                const currentVids = [...(siteContent.videoCards || initialVideoCards)];
                                currentVids[index] = { ...video, title: e.target.value };
                                setSiteContent({ ...siteContent, videoCards: currentVids });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Badge Catégorie (Haut de carte)</label>
                            <input
                              type="text"
                              value={video.badge || ''}
                              onChange={(e) => {
                                const currentVids = [...(siteContent.videoCards || initialVideoCards)];
                                currentVids[index] = { ...video, badge: e.target.value };
                                setSiteContent({ ...siteContent, videoCards: currentVids });
                              }}
                              placeholder="Ex: LOGISTIQUE ÉVÉNEMENTIELLE"
                              className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                            />
                          </div>
                        </div>

                        <VideoUploader
                          label="Vidéo à afficher (Fichier MP4/WebM uploaddé ou Lien YouTube)"
                          value={video.videoUrl}
                          onChange={(url) => {
                            const currentVids = [...(siteContent.videoCards || initialVideoCards)];
                            currentVids[index] = { ...video, videoUrl: url };
                            setSiteContent({ ...siteContent, videoCards: currentVids });
                          }}
                          adminToken={adminToken}
                        />

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Sous-titre / Description Courte</label>
                          <input
                            type="text"
                            value={video.subtitle || ''}
                            onChange={(e) => {
                              const currentVids = [...(siteContent.videoCards || initialVideoCards)];
                              currentVids[index] = { ...video, subtitle: e.target.value };
                              setSiteContent({ ...siteContent, videoCards: currentVids });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                          />
                        </div>

                        <ImageUploader
                          label="Image de Couverture de la Carte Vidéo (Thumbnail)"
                          value={video.thumbnailImage || ''}
                          onChange={(url) => {
                            const currentVids = [...(siteContent.videoCards || initialVideoCards)];
                            currentVids[index] = { ...video, thumbnailImage: url };
                            setSiteContent({ ...siteContent, videoCards: currentVids });
                          }}
                          adminToken={adminToken}
                        />

                        {video.thumbnailImage && (
                          <div className="h-28 w-full rounded-xl overflow-hidden border border-white/10 mt-2 relative">
                            <img src={video.thumbnailImage} alt={video.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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

          {/* TAB: BANDEAU PARTENAIRES */}
          {activeTab === 'partners' && siteContent && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Handshake className="w-6 h-6 text-[#00C2C2]" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Gestion de la Bande Défilante des Partenaires</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Ajoutez et personnalisez les logos des entreprises, marques et sponsors affichés en défilement continu sur le site public.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetDefaultPartners}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Réinitialiser avec les 8 partenaires par défaut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Réinitialiser</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenNewPartner}
                    className="px-4 py-2.5 rounded-xl bg-[#00C2C2] hover:bg-[#00a3a3] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un Partenaire</span>
                  </button>
                </div>
              </div>

              {/* Banner Configuration Card */}
              <div className="p-5 rounded-2xl bg-[#141446] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#FFAD5B] uppercase tracking-wider">Configuration Globale du Bandeau</div>
                    <div className="text-xs text-slate-300">Activer ou masquer le bandeau défilant sur la page d'accueil du site.</div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer shrink-0 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      checked={siteContent.partnersBannerEnabled !== false}
                      onChange={(e) => {
                        const updated = { ...siteContent, partnersBannerEnabled: e.target.checked };
                        setSiteContent(updated);
                        fetch('/api/site-content', {
                          method: 'PUT',
                          headers: fetchHeaders,
                          body: JSON.stringify(updated)
                        });
                        if (onRefreshPublicData) onRefreshPublicData();
                      }}
                      className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#6C68F4] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">Bandeau Actif sur le Site</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Titre de la Rubrique (ex: "Nos Partenaires & Marques de Confiance")</label>
                    <input
                      type="text"
                      value={siteContent.partnersBannerTitle || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, partnersBannerTitle: e.target.value })}
                      placeholder="Nos Partenaires & Marques de Confiance"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveSiteContent}
                      className="px-5 py-2 rounded-xl bg-[#6C68F4] hover:bg-[#5b57e0] font-bold text-xs text-white cursor-pointer shadow-md"
                    >
                      Sauvegarder le Titre du Bandeau
                    </button>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="pt-3">
                  <div className="text-[11px] font-bold text-[#00C2C2] uppercase mb-2">Aperçu en Direct du Bandeau :</div>
                  <div className="rounded-xl overflow-hidden border border-white/15">
                    <PartnersBanner siteContent={siteContent} theme="dark" />
                  </div>
                </div>
              </div>

              {/* Partners Logos Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Logos des Partenaires ({ (siteContent.partners || []).length })
                  </h3>
                  <span className="text-xs text-slate-400">
                    { (siteContent.partners || []).filter(p => p.visible !== false).length } actifs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(siteContent.partners || []).map((partner) => (
                    <div
                      key={partner.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                        partner.visible !== false
                          ? 'bg-[#141446] border-white/10 hover:border-[#6C68F4]/50'
                          : 'bg-black/40 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Header Badge & Controls */}
                        <div className="flex items-center justify-between text-[10px] font-bold gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#00C2C2]/20 text-[#00C2C2] uppercase truncate">
                            {partner.category || 'Partenaire'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleTogglePartnerVisibility(partner)}
                            className={`p-1 rounded cursor-pointer transition-colors ${
                              partner.visible !== false ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-slate-500 hover:bg-white/10'
                            }`}
                            title={partner.visible !== false ? 'Partenaire visible (Cliquer pour masquer)' : 'Partenaire masqué (Cliquer pour afficher)'}
                          >
                            {partner.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Logo Image Preview */}
                        <div className="h-20 w-full rounded-lg bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden">
                          {partner.logo ? (
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-xs text-slate-500 italic">Aucun logo</div>
                          )}
                        </div>

                        {/* Name & Link */}
                        <div>
                          <div className="font-bold text-white text-sm truncate">{partner.name}</div>
                          {partner.website && (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#6C68F4] hover:underline flex items-center gap-1 truncate mt-0.5"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{partner.website}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className={`text-[10px] font-semibold ${partner.visible !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {partner.visible !== false ? '• Affiché' : '• Masqué'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPartner(partner)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                            title="Modifier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePartner(partner.id, partner.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & OFFRES */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Gestion des Offres & Services</h2>
                  <p className="text-xs text-slate-400 mt-1">Concevez, modifiez et gérez vos offres Marketing Digital et Logistique.</p>
                </div>
                <button
                  onClick={handleOpenNewService}
                  className="px-4 py-2.5 rounded-xl bg-[#6C68F4] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle Offre / Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {services.map((serv) => (
                  <div key={serv.id} className="p-4 sm:p-5 rounded-xl bg-[#141446] border border-white/10 space-y-3 overflow-hidden min-w-0 flex flex-col justify-between">
                    <div>
                      {serv.image && (
                        <div className="h-36 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-3 overflow-hidden relative">
                          <img src={serv.image} alt={serv.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141446] via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#00C2C2]/20 text-[#00C2C2] truncate">
                            {serv.badge || serv.category}
                          </span>
                          {serv.popular && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#5362DC]/30 text-[#6C68F4]">
                              ★ Recommandé
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditService(serv)}
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

                      <h4 className="font-bold text-white text-base mt-2">{serv.title}</h4>
                      {serv.tagline && <p className="text-xs text-[#6C68F4] font-semibold">{serv.tagline}</p>}
                      <p className="text-xs text-[#FFAD5B] font-semibold mt-1">{serv.priceEstimate || "Sur devis"}</p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-2">{serv.shortDescription}</p>

                      {serv.features && serv.features.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                          <div className="text-[11px] font-bold text-slate-400 uppercase">Prestations incluses ({serv.features.length}) :</div>
                          <div className="text-xs text-slate-300 space-y-0.5">
                            {serv.features.slice(0, 3).map((f, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 truncate">
                                <span className="text-[#00C2C2]">✓</span>
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                            {serv.features.length > 3 && (
                              <div className="text-[10px] text-slate-400 italic">+ {serv.features.length - 3} autres prestations...</div>
                            )}
                          </div>
                        </div>
                      )}
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
                  onClick={handleOpenNewProduct}
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
                          onClick={() => handleOpenEditProduct(prod)}
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
                  onClick={handleOpenNewPack}
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
                          onClick={() => handleOpenEditPack(pack)}
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

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, société ou email..."
                  value={devisSearch}
                  onChange={(e) => setDevisSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141446] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
                />
              </div>

              <div className="space-y-4">
                {devis.filter(d => 
                  d.clientName.toLowerCase().includes(devisSearch.toLowerCase()) ||
                  d.company?.toLowerCase().includes(devisSearch.toLowerCase()) ||
                  d.email.toLowerCase().includes(devisSearch.toLowerCase())
                ).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune demande de devis correspondante.</p>
                ) : (
                  devis.filter(d => 
                    d.clientName.toLowerCase().includes(devisSearch.toLowerCase()) ||
                    d.company?.toLowerCase().includes(devisSearch.toLowerCase()) ||
                    d.email.toLowerCase().includes(devisSearch.toLowerCase())
                  ).map((d) => (
                    <div key={d.id} className="p-4 sm:p-5 rounded-xl bg-[#141446] border border-white/10 space-y-3 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 min-w-0">
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#00C2C2] break-words">{d.clientName}</span>
                          <span className="text-xs text-slate-400 ml-2 break-words">({d.company})</span>
                          <div className="text-[11px] text-slate-400 mt-0.5 break-words">Email : {d.email} | Tél : {d.phone}</div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <a
                            href={`https://wa.me/${d.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                            title="Contacter sur WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
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
                          <button
                            onClick={() => handleDeleteDevis(d.id, d.clientName)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            title="Supprimer la demande de devis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleDeleteReservation(res.id, res.clientName)}
                            className="px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            title="Supprimer la réservation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                          <button
                            onClick={() => setViewingReservationEmail(res)}
                            className="px-3 py-1 rounded bg-[#6C68F4]/20 hover:bg-[#6C68F4]/30 text-[#00C2C2] font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Voir les Emails Générés</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 10: PARAMÈTRES */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in min-w-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Paramètres Administrateur & Connexion Vercel / Firebase</h2>
                <p className="text-xs text-slate-400 mt-1">Gérez la sécurité du Back-Office, la réinitialisation de la base de données et la synchronisation Vercel.</p>
              </div>
              <AdminPasswordForm adminToken={adminToken} />
              <FirebaseVercelPanel
                adminToken={adminToken}
                onResetSuccess={loadAllData}
                setStatusModal={setStatusModal}
                setDeleteConfirm={setDeleteConfirm}
              />
            </div>
          )}

        </main>
      </div>

      {/* EDIT MODALS FOR CRUD OPERATIONS */}

      {/* Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveService} className="w-full max-w-xl p-6 rounded-2xl bg-[#141446] border border-[#6C68F4] space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg">{editingService.id ? 'Éditer Offre / Service' : 'Nouvelle Offre / Service'}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1">Titre de l'Offre / Service</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Stratégie de Marque & Branding"
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Pôle / Catégorie</label>
                <select
                  value={editingService.category || 'Marketing Digital'}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#0d0d2e] border border-white/15 text-xs"
                >
                  <option value="Marketing Digital">Marketing Digital</option>
                  <option value="Logistique Événementielle">Logistique Événementielle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1">Badge / Libellé (ex: BRANDING PRO)</label>
                <input
                  type="text"
                  placeholder="ex: OFFRE DIGITAL"
                  value={editingService.badge || ''}
                  onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Sous-titre / Tagline</label>
                <input
                  type="text"
                  placeholder="ex: Positionnement & Identité d'Excellence"
                  value={editingService.tagline || ''}
                  onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs mb-1">Estimation Tarifaire (ex: À partir de 350 000 FCFA)</label>
                <input
                  type="text"
                  placeholder="ex: Sur devis"
                  value={editingService.priceEstimate || ''}
                  onChange={(e) => setEditingService({ ...editingService, priceEstimate: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
                />
              </div>
              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#00C2C2]">
                  <input
                    type="checkbox"
                    checked={!!editingService.popular}
                    onChange={(e) => setEditingService({ ...editingService, popular: e.target.checked })}
                    className="rounded bg-white/10 border-white/20 text-[#6C68F4] focus:ring-0"
                  />
                  <span>Marquer comme Offre Recommandée ★</span>
                </label>
              </div>
            </div>

            <ImageUploader
              label="Image / Visuel de Présentation du Service"
              value={editingService.image || ''}
              onChange={(url) => setEditingService({ ...editingService, image: url })}
              adminToken={adminToken}
            />

            <div>
              <label className="block text-xs mb-1">Description courte (Affichée sur la carte)</label>
              <textarea
                rows={2}
                value={editingService.shortDescription || ''}
                onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs mb-1">Description complète (Affichée dans les détails)</label>
              <textarea
                rows={3}
                value={editingService.fullDescription || ''}
                onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs mb-1 font-bold text-[#00C2C2]">Prestations Incluses / Inclusions</label>
              <div className="space-y-2">
                {serviceFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Prestation ${idx + 1} (ex: Audit de marque)`}
                      value={feat}
                      onChange={(e) => {
                        const newFeats = [...serviceFeatures];
                        newFeats[idx] = e.target.value;
                        setServiceFeatures(newFeats);
                      }}
                      className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs placeholder-slate-500 text-white"
                    />
                    {serviceFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newFeats = serviceFeatures.filter((_, i) => i !== idx);
                          setServiceFeatures(newFeats);
                        }}
                        className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300 bg-white/5 rounded border border-white/15 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setServiceFeatures([...serviceFeatures, ''])}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded font-medium transition text-white cursor-pointer"
                >
                  + Ajouter une prestation
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded text-xs bg-white/10 cursor-pointer">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded text-xs font-bold bg-[#6C68F4] cursor-pointer">Enregistrer l'Offre</button>
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
              <label className="block text-xs font-bold mb-1.5 text-[#00C2C2]">Spécifications Techniques (5 lignes)</label>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Caractéristique ${idx + 1} (ex: Poids)`}
                      value={specKeys[idx]}
                      onChange={(e) => {
                        const newKeys = [...specKeys];
                        newKeys[idx] = e.target.value;
                        setSpecKeys(newKeys);
                      }}
                      className="w-1/2 p-2 rounded bg-white/5 border border-white/15 text-xs placeholder-slate-500 text-white"
                    />
                    <input
                      type="text"
                      placeholder={`Valeur ${idx + 1} (ex: 26 kg)`}
                      value={specValues[idx]}
                      onChange={(e) => {
                        const newValues = [...specValues];
                        newValues[idx] = e.target.value;
                        setSpecValues(newValues);
                      }}
                      className="w-1/2 p-2 rounded bg-white/5 border border-white/15 text-xs placeholder-slate-500 text-white"
                    />
                  </div>
                ))}
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

            <div>
              <label className="block text-xs mb-1">Inclusions / Éléments du Pack (Ce que comprend ce pack)</label>
              <div className="space-y-2">
                {packInclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Élément ${idx + 1} (ex: Création de logo)`}
                      value={inc}
                      onChange={(e) => {
                        const newIncs = [...packInclusions];
                        newIncs[idx] = e.target.value;
                        setPackInclusions(newIncs);
                      }}
                      className="w-full p-2 rounded bg-white/5 border border-white/15 text-xs placeholder-slate-500 text-white"
                    />
                    {packInclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newIncs = packInclusions.filter((_, i) => i !== idx);
                          setPackInclusions(newIncs);
                        }}
                        className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300 bg-white/5 rounded border border-white/15"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPackInclusions([...packInclusions, ''])}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded font-medium transition text-white"
                >
                  + Ajouter un élément
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingPack(null)} className="px-4 py-2 rounded text-xs bg-white/10 cursor-pointer">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded text-xs font-bold bg-[#6C68F4] cursor-pointer">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSavePartner} className="w-full max-w-lg p-6 rounded-2xl bg-[#141446] border border-[#00C2C2] space-y-4 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-[#00C2C2]" />
                <h3 className="font-bold text-lg">{editingPartner.id ? 'Modifier le Partenaire' : 'Nouveau Partenaire'}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPartner(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom du Partenaire / Marque *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: L-Acoustics ou Orange Cameroun"
                  value={editingPartner.name || ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie / Rôle</label>
                  <input
                    type="text"
                    placeholder="ex: Sonorisation Pro, Sponsor, Média"
                    value={editingPartner.category || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lien Site Web (Optionnel)</label>
                  <input
                    type="url"
                    placeholder="https://www.exemple.com"
                    value={editingPartner.website || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Logo du Partenaire (Format PNG/SVG/JPG recommandé)"
                  value={editingPartner.logo || ''}
                  onChange={(url) => setEditingPartner({ ...editingPartner, logo: url })}
                  adminToken={adminToken}
                />

                {editingPartner.logo && (
                  <div className="mt-2 p-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/10 p-1 flex items-center justify-center shrink-0">
                      <img src={editingPartner.logo} alt="Aperçu" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="text-xs text-slate-300 truncate">Aperçu du logo partenaire</div>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingPartner.visible !== false}
                  onChange={(e) => setEditingPartner({ ...editingPartner, visible: e.target.checked })}
                  className="rounded bg-white/10 border-white/20 text-[#00C2C2] focus:ring-0"
                />
                <span className="text-xs font-medium text-slate-300">Visible sur le bandeau public</span>
              </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPartner(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#00C2C2] hover:bg-[#00a3a3] text-xs font-bold text-slate-950 cursor-pointer"
              >
                Enregistrer le Partenaire
              </button>
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

      {/* Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141446] border border-rose-500/40 space-y-4 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{deleteConfirm.title}</h3>
                <p className="text-xs text-slate-400">Confirmation requise</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {deleteConfirm.message}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteConfirm.onConfirm();
                  setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />

    </div>
  );
};
