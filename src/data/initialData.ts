import { ArticleItem, CommentItem, PackItem, ProductItem, ServiceItem, SiteContent, CarouselSlideItem, PartnerItem, TestimonialItem, VideoCardItem } from '../types';

export const initialHeroSlides: CarouselSlideItem[] = [
  {
    id: 'slide-1',
    title: 'Services & Expertise 360°',
    subtitle: 'Stratégie digitale, web development, régie technique et accompagnement sur-mesure pour tous vos projets.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'Découvrir nos services',
    tab: 'services'
  },
  {
    id: 'slide-2',
    title: 'Catalogue Matériel Professionnel',
    subtitle: 'Sonorisation concert, éclairage scénique, écrans LED et backline disponibles à la location immédiate.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'Explorer le catalogue',
    tab: 'catalog'
  },
  {
    id: 'slide-3',
    title: 'Packs Événementiels Clés en Main',
    subtitle: 'Solutions prêtes à l’emploi pour mariages, séminaires, concerts et soirées d’entreprise.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'Voir les packs',
    tab: 'packs'
  },
  {
    id: 'slide-4',
    title: 'Actualités & Conseils d’Experts',
    subtitle: 'Guides techniques, tendances de l’innovation digitale et retours d’expérience de nos équipes.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'Lire les articles',
    tab: 'blog'
  },
  {
    id: 'slide-5',
    title: 'À Propos de Forward One',
    subtitle: 'Notre philosophie, notre engagement pour l’excellence opérationnelle et notre équipe de passionnés.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'En savoir plus',
    tab: 'about'
  }
];

export const initialServiceCategories = [
  {
    id: 'cat-1',
    title: 'Marketing Digital',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Stratégies d’avant-garde, branding, développement web et acquisition ciblée.',
    type: 'marketing' as const,
    available: true
  },
  {
    id: 'cat-2',
    title: 'Logistique Événementielle',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Catalogue matériel 4K, éclairage asservi, scènes modulaires et packs clés en main.',
    type: 'logistique' as const,
    available: true
  },
  {
    id: 'cat-3',
    title: 'Billetterie',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    description: 'Plateforme de billetterie intelligente pour vos grands événements (Prochainement).',
    type: 'billetterie' as const,
    available: false
  }
];

export const initialPartners: PartnerItem[] = [
  {
    id: 'partner-1',
    name: 'L-Acoustics',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    category: 'Sonorisation Pro',
    website: 'https://www.l-acoustics.com',
    visible: true
  },
  {
    id: 'partner-2',
    name: 'Shure Audio',
    logo: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80',
    category: 'Microphonie HF',
    website: 'https://www.shure.com',
    visible: true
  },
  {
    id: 'partner-3',
    name: 'Blackmagic Design',
    logo: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=400&q=80',
    category: 'Régie Vidéo & 4K',
    website: 'https://www.blackmagicdesign.com',
    visible: true
  },
  {
    id: 'partner-4',
    name: 'MA Lighting',
    logo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
    category: 'Éclairage Scénique',
    website: 'https://www.malighting.com',
    visible: true
  },
  {
    id: 'partner-5',
    name: 'Orange Cameroun',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    category: 'Partenaire Télécom',
    website: 'https://www.orange.cm',
    visible: true
  },
  {
    id: 'partner-6',
    name: 'Canal+ Events',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=400&q=80',
    category: 'Sponsor Média',
    website: 'https://www.canalplus.com',
    visible: true
  },
  {
    id: 'partner-7',
    name: 'Meta Business Partner',
    logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
    category: 'Social Media Ads',
    website: 'https://www.facebook.com/business',
    visible: true
  },
  {
    id: 'partner-8',
    name: 'Google Marketing Platform',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=400&q=80',
    category: 'SEO & Digital',
    website: 'https://marketingplatform.google.com',
    visible: true
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: 'testi-1',
    clientName: 'Marc-Antoine Kouamé',
    clientRole: 'Directeur Marketing',
    company: 'Orange Cameroun',
    comment: 'La régie technique vidéo et son de Forward One a totalement métamorphosé notre convention annuelle. Une sonorisation cristalline et une réactivité exemplaire.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    date: '15 Juillet 2026'
  },
  {
    id: 'testi-2',
    clientName: 'Sylvie Nguema',
    clientRole: 'Fondatrice & Event Manager',
    company: 'Event Prestige Yaoundé',
    comment: 'Le matériel son, lumière et scène loué chez Forward One est d’une propreté et d’une performance irréprochables. Nos soirées d’entreprise VIP sont toujours un franc succès !',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    date: '02 Juillet 2026'
  },
  {
    id: 'testi-3',
    clientName: 'Christian Mbarga',
    clientRole: 'CEO & Fondateur',
    company: 'Pulse Media Group',
    comment: 'Forward One a conçu notre plateforme e-commerce et gère nos campagnes d’acquisition digitale. Taux de conversion et visibilité de marque multipliés par 3 en 90 jours.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    date: '28 Juin 2026'
  }
];

export const initialVideoCards: VideoCardItem[] = [
  {
    id: 'video-1',
    title: 'Régie Vidéo 4K & Sonorisation Concert Live',
    subtitle: 'Captation multi-caméras et sonorisation L-Acoustics en direct du grand festival Akwa Live.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    badge: 'LOGISTIQUE ÉVÉNEMENTIELLE'
  },
  {
    id: 'video-2',
    title: 'Showroom Lumière & Scénographie Scénique',
    subtitle: 'Démonstration de nos lyres asservies Robe BMFL et ponts aluminium certifiés SOCOTEC.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    badge: 'ÉCLAIRAGE & SCÈNE'
  },
  {
    id: 'video-3',
    title: 'Stratégie Branding & Web Performance 360°',
    subtitle: 'Comment nous propulsons les marques leaders au Cameroun avec Next.js et du design d’avant-garde.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    badge: 'MARKETING DIGITAL'
  }
];

export const initialSiteContent: SiteContent = {
  heroTitle: "Progress Without Limits.",
  heroSubtitle: "Forward One propulse votre marque et façonne vos événements avec une maîtrise d'exception. Marketing digital à fort impact et logistique événementielle de pointe.",
  heroSlogan: "Mouvement. Excellence. Leadership.",
  aboutHeadline: "Incarner l'élan vers l'avant et la maîtrise technique",
  aboutStory: "Forward One est né de la synergie entre deux expertises indispensables à la réussite moderne : une stratégie marketing d'avant-garde et une logistique événementielle zéro défaut. Nous accompagnons les entreprises, institutions et créateurs dans la concrétisation de leurs projets les plus ambitieux.",
  aboutArrowMeaning: "La flèche n'est pas un simple élément décoratif. Elle est la signature visuelle de l'identité Forward One. Elle symbolise le mouvement perpétuel, la direction claire et l'excellence du numéro 1 qui ouvre la voie.",
  contactEmail: "contact@forwardone.cm",
  contactPhone: "+237 6 90 00 20 26",
  contactAddress: "Avenue Akwa, Douala & Bastos, Yaoundé, Cameroun",
  heroSlides: initialHeroSlides,
  serviceCategories: initialServiceCategories,
  partners: initialPartners,
  partnersBannerTitle: "Nos Partenaires & Marques de Confiance",
  partnersBannerEnabled: true,
  testimonials: initialTestimonials,
  testimonialsTitle: "Ce Que Disent Nos Clients",
  testimonialsSubtitle: "La satisfaction de nos partenaires est la preuve irréfutable de notre quête d’excellence.",
  videoSectionTitle: "Forward One en Action",
  videoSectionSubtitle: "Découvrez nos réalisations en vidéos : régies événements, tournages, shows lumière et créations web.",
  videoCards: initialVideoCards
};

export const initialServices: ServiceItem[] = [
  // Marketing Digital
  {
    id: "serv-mkt-1",
    title: "Stratégie de Marque & Branding",
    category: "Marketing Digital",
    badge: "BRANDING PRO",
    tagline: "Positionnement & Identité d'Excellence",
    priceEstimate: "À partir de 350 000 FCFA",
    popular: true,
    shortDescription: "Positionnement d'excellence, identité visuelle et charte de marque globale.",
    fullDescription: "Nous définissons une identité de marque puissante et mémorable qui capte l'attention et affirme votre leadership. De la création du logo à la rédaction de votre charte éditoriale, nous construisons un univers de marque sans limites.",
    iconName: "Compass",
    features: ["Audit de marque & positionnement", "Identité visuelle & système graphique", "Charte éditoriale & Tone of Voice", "Guidelines multi-supports"],
    image: "https://images.unsplash.com/photo-1542744094-3a3121699f84?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "serv-mkt-2",
    title: "Développement Web & Mobile",
    category: "Marketing Digital",
    badge: "WEB & APPLICATION",
    tagline: "Plateformes sur-mesure & UX/UI Haute Performance",
    priceEstimate: "À partir de 500 000 FCFA",
    popular: true,
    shortDescription: "Plateformes web modernes, applications réactives, UX/UI haute performance.",
    fullDescription: "Conception de sites vitrines d'exception, plateformes web sur-mesure et applications mobiles ultra-fluides. Nous combinons esthétique raffinée, temps de chargement ultra-rapides et taux de conversion optimisés.",
    iconName: "Code2",
    features: ["Design UX/UI sur-mesure", "Développement Next.js / React réactif", "Optimisation Core Web Vitals", "Architecture sécurisée & Scalable"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "serv-mkt-3",
    title: "SEO & Référencement Stratégique",
    category: "Marketing Digital",
    badge: "ACQUISITION ORGANIQUE",
    tagline: "Visibilité N°1 sur les moteurs de recherche",
    priceEstimate: "À partir de 250 000 FCFA",
    popular: false,
    shortDescription: "Positionnez votre marque en première page sur les requêtes clés de votre marché.",
    fullDescription: "Propulsez votre visibilité organique grâce à un référencement technique rigoureux, une stratégie de contenu ciblée et une acquisition de liens d'autorité.",
    iconName: "TrendingUp",
    features: ["Audit SEO technique complet", "Recherche & ciblage de mots-clés", "Stratégie de netlinking haute autorité", "SEO Local & international"],
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "serv-mkt-4",
    title: "Social Media & Acquisition Média",
    category: "Marketing Digital",
    badge: "COMMUNITY & ADS",
    tagline: "Engagement Communautaire & Campagnes SMM",
    priceEstimate: "À partir de 300 000 FCFA",
    popular: false,
    shortDescription: "Gestion de communautés, campagnes Ads ciblées et stratégie d'influence.",
    fullDescription: "Engagez vos audiences sur LinkedIn, Instagram, TikTok et YouTube avec des contenus créatifs à forte valeur ajoutée et des campagnes publicitaires rentables.",
    iconName: "Share2",
    features: ["Community Management engageant", "Campagnes Meta & LinkedIn Ads", "Création de contenus vidéo Shorts/Reels", "A/B Testing & Reporting analytique"],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
  },

  // Logistique Événementielle
  {
    id: "serv-log-1",
    title: "Sonorisation & Acoustique Événementielle",
    category: "Logistique Événementielle",
    shortDescription: "Systèmes audio haute fidélité pour concerts, conférences et soirées d'entreprise.",
    fullDescription: "Distribution sonore homogène et cristalline grâce à du matériel de sonorisation de classe internationale. Nos ingénieurs du son assurent une couverture parfaite adaptée à la géométrie de vos espaces.",
    iconName: "Volume2",
    features: ["Systèmes Line Array L-Acoustics & d&b", "Micros HF sans fil professionnels", "Consoles numériques pré-configurées", "Gestion de la régie son en direct"],
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "serv-log-2",
    title: "Éclairage Scénique & Architecture Lumière",
    category: "Logistique Événementielle",
    shortDescription: "Mise en lumière spectaculaire, projecteurs LED asservis et shows scéniques.",
    fullDescription: "Transformez vos lieux de réception avec une architecture lumineuse immersive et des effets scéniques captivants qui subliment vos temps forts et vos intervenants.",
    iconName: "Zap",
    features: ["Projecteurs asservis & Lyres de découpe", "Mise en lumière architecturale LED", "Consoles GrandMA2/GrandMA3", "Programmation de shows synchronisés"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "serv-log-3",
    title: "Scénographie & Structures Pro",
    category: "Logistique Événementielle",
    shortDescription: "Scènes modulaires, ponts de structure aluminium, totems et décors sur-mesure.",
    fullDescription: "Montage et assemblage sécurisé de scènes, podiums, totems d'exposition et structures métalliques certifiées SOCOTEC. Design scénographique sur-mesure.",
    iconName: "Box",
    features: ["Podiums & scènes modulaires Prolyte", "Ponts de structure aluminium noir/argent", "Habillage tissu éco-responsable", "Certification de sécurité & notes de calcul"],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "serv-log-4",
    title: "Audiovisuel & Écrans LED Géants",
    category: "Logistique Événementielle",
    shortDescription: "Murs d'images LED ultra-haute définition, captation vidéo multi-caméras et régie.",
    fullDescription: "Diffusion vidéo haute définition en intérieur comme en extérieur. Captation multi-caméras 4K et retransmission live streaming sur vos canaux digitaux.",
    iconName: "Tv",
    features: ["Murs LED Pitch 2.6mm & 3.9mm", "Régie vidéo HD Blackmagic Design", "Captation 4K multi-caméras", "Streaming live sécurisé & interactif"],
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80"
  }
];

export const initialProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "Système Line Array L-Acoustics Kara II",
    category: "Sonorisation",
    description: "Enceinte d'amplification compacte à directivité variable, idéale pour salles modulaires et extérieurs jusqu'à 2500 personnes.",
    dailyRate: 120000,
    stockQuantity: 12,
    availabilityStatus: "disponible",
    specifications: {
      "Bande passante": "55 Hz - 20 kHz",
      "Pression max (SPL)": "142 dB",
      "Poids": "26 kg per enclosure",
      "Connecteurs": "Speakon NL4"
    },
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  },
  {
    id: "prod-2",
    name: "Console Lumière MA Lighting GrandMA3 Compact XT",
    category: "Éclairage",
    description: "Console de gestion d'éclairage professionnelle ultime avec écrans tactiles intégrés et gestion DMX multi-univers.",
    dailyRate: 165000,
    stockQuantity: 4,
    availabilityStatus: "disponible",
    specifications: {
      "Paramètres": "4 096 paramètres",
      "Écrans": "2 x écrans tactiles 15.6 pouces",
      "Sorties DMX": "6 x XLR 5-pin",
      "Protocoles": "MA-Net3, sACN, Art-Net"
    },
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  },
  {
    id: "prod-3",
    name: "Écran Muraire LED Absen Polaris Pitch 2.5mm Outdoor",
    category: "Audiovisuel",
    description: "Dalle d'écran LED ultra-lumineuse IP65 étanche pour montage sur pont ou sol, visibilité directe plein soleil.",
    dailyRate: 80000,
    stockQuantity: 40,
    availabilityStatus: "disponible",
    specifications: {
      "Luminosité": "5 000 nits",
      "Résolution par dalle": "200 x 200 px",
      "Fréquence de rafraîchissement": "3 840 Hz",
      "Protection": "IP65 Waterproof"
    },
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  },
  {
    id: "prod-4",
    name: "Pack Micro HF Shure Axient Digital AD4D",
    category: "Sonorisation",
    description: "Récepteur HF double canal numérique avec émetteurs mains Shure KSM9 et boîtiers ceinture.",
    dailyRate: 60000,
    stockQuantity: 8,
    availabilityStatus: "disponible",
    specifications: {
      "Gamme de fréquence": "470 - 636 MHz",
      "Autonomie": "9 heures sur batterie rechargeable SB900B",
      "Sortie Audio": "Dante & XLR Analogique"
    },
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  },
  {
    id: "prod-5",
    name: "Projecteur Lyre Asservie Robe BMFL Blade",
    category: "Éclairage",
    description: "Lyre asservie de découpe ultra-puissante 1700W pour grands événements, galas et captations vidéo.",
    dailyRate: 90000,
    stockQuantity: 16,
    availabilityStatus: "disponible",
    specifications: {
      "Source": "Lampe OSRAM HTI 1500W/60/P28 Lok-it!",
      "Zoom": "5° à 55°",
      "Couteaux": "4 couteaux orientables individuellement"
    },
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  },
  {
    id: "prod-6",
    name: "Canapé Lounge Chesterfield Cuir Cognac",
    category: "Mobilier & Déco",
    description: "Canapé 3 places premium en cuir véritable patiné cognac pour espaces VIP, plateaux TV et loges d'artistes.",
    dailyRate: 75000,
    stockQuantity: 6,
    availabilityStatus: "disponible",
    specifications: {
      "Dimensions": "L 215 cm x P 90 cm x H 75 cm",
      "Matière": "Cuir de vêtement premium cognac",
      "Style": "Capitonné classique"
    },
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    isFeatured: true
  },
  {
    id: "prod-7",
    name: "Scène Modulaire Prolyte Stagedex 2x1m (Pieds réglables)",
    category: "Structure & Scène",
    description: "Praticable de scène renforcé 750 kg/m², revêtement antidérapant noir pour podiums sur-mesure.",
    dailyRate: 25000,
    stockQuantity: 50,
    availabilityStatus: "disponible",
    specifications: {
      "Charge max": "750 kg/m²",
      "Hauteur pieds": "Variable 20 cm à 120 cm",
      "Finition": "Contreplaqué antidérapant étanche"
    },
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  },
  {
    id: "prod-8",
    name: "Bar Lumineux Modulaire LED RGBW Curve",
    category: "Mobilier & Déco",
    description: "Module de bar étanche sur batterie 12h, personnalisable par télécommande ou DMX sans fil.",
    dailyRate: 55000,
    stockQuantity: 10,
    availabilityStatus: "disponible",
    specifications: {
      "Autonomie": "12 à 16 heures",
      "Résistance": "Polyéthylène résistant aux chocs IP65",
      "Contrôle": "DMX sans fil WDMX ou télécommande"
    },
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  }
];

export const initialPacks: PackItem[] = [
  {
    id: "pack-1",
    title: "Pack 'Lancement Marque 360°'",
    module: "marketing",
    tagline: "Positionnez votre nouvelle marque au sommet en moins de 30 jours.",
    priceEstimate: "À partir de 3 200 000 FCFA HT",
    badge: "Incontournable",
    description: "Une offre clé en main intégrant le branding complet, la création d'un site web Next.js ultra-rapide et le lancement de votre campagne sur les réseaux sociaux.",
    inclusions: [
      "Création de la charte graphique & Logo",
      "Site Web Responsive (jusqu'à 6 pages)",
      "Stratégie SEO initiale & Audit de mots-clés",
      "Campagne Google & Meta Ads (Gestion 1er mois)",
      "Kit de modèles réseaux sociaux personnalisés"
    ],
    popular: true,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pack-2",
    title: "Pack 'Soirée Corporate Prestige'",
    module: "logistique",
    tagline: "Une logistique événementielle zéro défaut pour 150 à 500 invités.",
    priceEstimate: "À partir de 2 100 000 FCFA HT / jour",
    badge: "Clé en main",
    description: "Sonorisation haute définition, architecture lumineuse personnalisée aux couleurs de votre entreprise et régie technique dédiée.",
    inclusions: [
      "Système son L-Acoustics calibré pour la salle",
      "Kit lumière dynamique LED & Lyres asservies",
      "Écran géant d'accueil LED ou Vidéoprojecteur 10K",
      "2 Techniciens régisseurs (Son & Lumière)",
      "Livraison, montage et démonstration complète"
    ],
    popular: true,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "pack-3",
    title: "Pack 'Hybride Keynote & Live Stream'",
    module: "hybride",
    tagline: "Associez événement physique d'exception et visibilité digitale globale.",
    priceEstimate: "À partir de 4 250 000 FCFA HT",
    badge: "Full Experience",
    description: "Combinaison ultime Forward One : Scénographie physique VIP et diffusion digitale en direct avec page web dédiée et captation multi-caméras.",
    inclusions: [
      "Scène modulaire habillée avec écran LED Fond de Scène",
      "Régie de captation multi-caméras 4K & Streaming",
      "Plateforme web d'inscription & Landing Page événementielle",
      "Stratégie de communication avant/pendant/après événement",
      "Replay monté & contenus vidéo déclinés pour réseaux sociaux"
    ],
    popular: false,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80"
  }
];

export const initialArticles: ArticleItem[] = [
  {
    id: "art-1",
    title: "Pourquoi la flèche Forward One incarne l'avenir du Marketing et de la Logistique",
    slug: "pourquoi-fleche-forward-one-incarne-avenir",
    category: "Branding & Vision",
    excerpt: "Découvrez l'histoire et les fondements géométriques de notre symbole : mouvement perpétuel, leadership et excellence sans limites.",
    content: `
La flèche Forward One n'est pas un simple élément décoratif. Elle est la signature visuelle de l'identité de notre marque.

### 1. Le Mouvement et la Progression
La flèche incarne l'élan vers l'avant et le dépassement de soi. Elle raconte l'histoire d'une marque qui ne s'arrête jamais, qui pousse ses clients vers de nouveaux horizons digitaux et événementiels.

### 2. Direction et Leadership
Une flèche montre le chemin. Elle positionne Forward One comme un guide, un leader qui sait où il va et qui emmène ses partenaires avec lui.

### 3. Excellence et Numéro 1
La flèche devient le symbole universel de la performance. Forward One, c'est le numéro 1, celui qui ouvre la voie et garantit un taux de satisfaction sans concession.

### 4. Simplicité et Mémorisation
Un symbole universel compris par tous dans toutes les cultures. La flèche est immédiatement reconnaissable et grave la marque dans les esprits.
    `,
    author: "Marc de Forward One",
    authorRole: "Directeur de la Création & Stratégie",
    date: "2026-07-20",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    published: true,
    views: 342
  },
  {
    id: "art-2",
    title: "Comment orchestrer une logistique événementielle sans faille en 2026",
    slug: "orchestrer-logistique-evenementielle-sans-faille-2026",
    category: "Logistique Événementielle",
    excerpt: "Anticipation des flux, sonorisation de précision et régie technique coordonnée : les conseils incontournables des experts Forward One.",
    content: `
Derrière chaque grand événement, il y a une logistique sans faille. Derrière chaque logistique, il y a Forward One.

L'organisation d'un événement d'entreprise exige un niveau de précision chirurgical. Un retard de 15 minutes dans l'installation d'un pont de lumière ou un grésillement de micro HF peut entacher l'image d'une marque.

### Règle N°1 : La vérification préalable du matériel (Check & Double Check)
Tout équipement loué ou déployé sur le terrain doit faire l'objet d'un contrôle rigoureux en entrepôt. Chez Forward One, chaque câble, console et projecteur est testé avant chaque départ.

### Règle N°2 : La synchronisation entre le son, la lumière et la vidéo
Une régie unifiée évite la dispersion. Nos équipes intègrent les régisseurs son, lumière et vidéo sous un même commandement technique.

### Règle N°3 : Le plan B systématique
En événementiel, le risque zéro n'existe pas, mais la préparation limite les urgences. Nous prévoyons toujours des secours HF et des alimentations stabilisées redondantes.
    `,
    author: "Sophie Laurent",
    authorRole: "Responsable Régie & Logistique",
    date: "2026-07-15",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    published: true,
    views: 520
  },
  {
    id: "art-3",
    title: "Les nouvelles tendances du Marketing Digital B2B et B2C",
    slug: "tendances-marketing-digital-b2b-b2c-2026",
    category: "Marketing Digital",
    excerpt: "IA générative appliquée au contenu, vidéo ultra-courte à fort engagement et stratégie omnicanale.",
    content: `
Le digital n'a pas de limites. Nous non plus.

En 2026, la création de contenu ne suffit plus : elle doit s'inscrire dans une narration de marque (brand storytelling) authentique et captivante.

### Des formats ultra-dynamiques
Les utilisateurs recherchent des formats interactifs, synthétiques mais visuellement impeccables. L'adoption des couleurs vibrantes comme l'Ultra Violet (#6C68F4) et le Bleu-vert (#00C2C2) crée une distinction immédiate sur les fils d'actualité.

### Le SEO axé sur l'expérience utilisateur
Google privilégie les plateformes réactives à temps de chargement instantané. C'est pourquoi nous développons nos projets web sur des frameworks de pointe comme Next.js et React.
    `,
    author: "Alexandre Mercier",
    authorRole: "Head of Digital Growth",
    date: "2026-07-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    published: true,
    views: 410
  }
];

export const initialComments: CommentItem[] = [
  {
    id: "com-1",
    articleId: "art-1",
    articleTitle: "Pourquoi la flèche Forward One incarne l'avenir du Marketing et de la Logistique",
    authorName: "Jean-Pierre V.",
    content: "Article captivant ! La symbolique de la flèche est très bien pensée et la charte graphique de Forward One est vraiment élégante.",
    createdAt: "2026-07-21T14:30:00.000Z",
    status: "approved"
  },
  {
    id: "com-2",
    articleId: "art-2",
    articleTitle: "Comment orchestrer une logistique événementielle sans faille en 2026",
    authorName: "Claire Dupont",
    content: "Nous avons fait appel à vos équipes pour notre convention annuelle et le résultat était parfait, tant sur la sonorisation que sur l'écran LED géant.",
    createdAt: "2026-07-22T09:15:00.000Z",
    status: "approved"
  },
  {
    id: "com-3",
    articleId: "art-3",
    articleTitle: "Les nouvelles tendances du Marketing Digital B2B et B2C",
    authorName: "Julien M.",
    content: "Très intéressant ! Merci pour ces conseils précieux concernant le SEO et le temps de chargement des applications.",
    createdAt: "2026-07-24T18:40:00.000Z",
    status: "pending"
  }
];
