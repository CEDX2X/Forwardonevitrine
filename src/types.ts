export type CategoryType = 'Marketing Digital' | 'Logistique Événementielle' | 'Les Deux';

export interface ServiceItem {
  id: string;
  title: string;
  category: CategoryType;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  image: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string; // e.g. "Sonorisation", "Éclairage", "Audiovisuel", "Structure & Scène", "Mobilier & Déco", "Matériel Informatique"
  description: string;
  dailyRate: number; // rate per day in FCFA (XAF)
  stockQuantity: number;
  availabilityStatus: 'disponible' | 'reserve' | 'maintenance';
  specifications: Record<string, string>;
  image: string;
  isFeatured?: boolean;
}

export interface PackItem {
  id: string;
  title: string;
  module: 'marketing' | 'logistique' | 'hybride';
  tagline: string;
  priceEstimate: string;
  badge: string;
  description: string;
  inclusions: string[];
  popular?: boolean;
  image: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  published: boolean;
  views: number;
}

export interface CommentItem {
  id: string;
  articleId?: string; // Optional: associated with an article or general site review
  articleTitle?: string;
  authorName: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface QuoteRequestItem {
  id: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  moduleType: CategoryType;
  budgetRange: string;
  targetDate: string;
  eventLocation?: string;
  description: string;
  selectedItems: string[];
  status: 'nouvelle' | 'en_traitement' | 'traitee' | 'archivee';
  createdAt: string;
}

export interface PreReservationEquipment {
  id: string;
  name: string;
  quantity: number;
  dailyRate: number;
}

export interface PreReservationItem {
  id: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  equipmentDetails: PreReservationEquipment[];
  startDate: string;
  endDate: string;
  durationDays: number;
  totalEstimate: number;
  location: string;
  notes: string;
  status: 'en_attente' | 'confirmee' | 'refusee';
  createdAt: string;
  emailNotificationSent: {
    clientEmailContent: string;
    adminEmailContent: string;
    sentAt: string;
  };
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroSlogan: string;
  aboutHeadline: string;
  aboutStory: string;
  aboutArrowMeaning: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface AdminStats {
  totalArticles: number;
  totalProducts: number;
  totalPacks: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalReservations: number;
  pendingReservations: number;
  pendingComments: number;
}
