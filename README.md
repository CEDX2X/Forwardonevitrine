# 🚀 Forward One — Manuel Technique & Guide de Maintenance Développeur

Bienvenue dans le manuel d'architecture et de maintenance technique de la plateforme **Forward One** (Leader en Marketing Digital, Régie Technique & Logistique Événementielle au Cameroun).

Ce document complet est conçu pour qu'un nouvel ingénieur ou développeur reprenant le projet puisse comprendre en profondeur l'ensemble de la codebase, la structure des APIs, la persistance hybride Firestore/Express, la modération du contenu, le système de devis & pré-réservations et les procédures d'exploitation.

---

## 📑 Sommaire
1. [Stack Technique & Choix d'Architecture](#1-stack-technique--choix-darchitecture)
2. [Structure Détaillée du Projet](#2-structure-détaillée-du-projet)
3. [Architecture de Persistance Hybride (Express + Firestore Direct)](#3-architecture-de-persistance-hybride)
4. [Documentation des Endpoints API REST (`server.ts`)](#4-documentation-des-endpoints-api-rest)
5. [Modèle de Données TypeScript & Collections Firestore](#5-modèle-de-données-typescript--collections-firestore)
6. [Système d'Authentification & Back-Office Administrateur](#6-système-dauthentification--back-office-administrateur)
7. [Workflows Metier (Devis, Pré-réservations & Commentaires)](#7-workflows-metier)
8. [Référencement SEO & Previews OpenGraph / Réseaux Sociaux](#8-référencement-seo--previews-opengraph)
9. [Procédures de Déploiement (Cloud Run, Vercel, Docker)](#9-procédures-de-déploiement)
10. [Guide de Maintenance & Résolution de Problèmes (Troubleshooting)](#10-guide-de-maintenance--résolution-de-problèmes)

---

## 🛠️ 1. Stack Technique & Choix d'Architecture

- **Frontend UI** : 
  - **React 18** avec **TypeScript** (Strict Mode)
  - **Vite** comme bundler de développement rapide
  - **Tailwind CSS v3** pour le styling utilitaire et responsive (palette dark-luxury `#141446`, cyan `#00C2C2`, green `#12B857`, indigo `#6C68F4`)
  - **Lucide React** pour la bibliothèque d'icônes vectorielles
  - **Motion** (`motion/react`) pour les animations et transitions fluides
- **Backend API & Serveur** :
  - **Node.js** avec **Express**
  - Exécuté via `tsx server.ts` en développement
  - Compilé en CommonJS unique (`dist/server.cjs`) via `esbuild` pour la production Cloud Run / Docker
- **Base de Données & Cloud** :
  - **Firebase Firestore** : Base de données NoSQL temps réel
  - **Firebase Web SDK v11** : Intégration côté client et fallback autonome
- **Rendu d'Images & Asset Pipeline** :
  - **Sharp** : Génération automatisée des bannières HD OpenGraph (1200x630) et logos carrés (800x800) pour WhatsApp, Facebook et LinkedIn.

---

## 📁 2. Structure Détaillée du Projet

```text
.
├── index.html                    # HTML principal avec SEO, balises OpenGraph et JSON-LD Schema.org
├── server.ts                     # Serveur Express full-stack (API REST + Middleware Vite Dev / Production)
├── package.json                  # Scripts d'exécution et dépendances npm
├── metadata.json                 # Déclarations des capacités système AI Studio
├── .env.example                  # Déclaration des variables d'environnement
├── public/                       # Assets statiques accessibles à la racine
│   ├── og-image.png              # Bannière HD 1200x630 (Preview liens Facebook, LinkedIn, Twitter)
│   ├── og-logo.png               # Logo HD carré 800x800 (Preview WhatsApp, Avatars)
│   ├── logo-512.png / 192.png    # Icônes pour navigateurs et PWA
│   ├── logo-icon.svg             # Vecteur SVG officiel du logo Forward One
│   ├── robots.txt                # Directives d'indexation Googlebot
│   └── sitemap.xml               # Plan du site XML dynamique
├── scripts/
│   └── generate-og-images.js     # Script Sharp de génération automatique des images OpenGraph
├── src/
│   ├── main.tsx                  # Montage React de l'application
│   ├── App.tsx                   # Composant racine, orchestration d'état global, modal devis/réservation
│   ├── types.ts                  # Définitions des types TypeScript (Produits, Devis, Articles, etc.)
│   ├── index.css                 # Configuration globale Tailwind CSS
│   ├── lib/
│   │   ├── firebase.ts           # Initialisation du SDK Firebase Client
│   │   ├── firebaseStore.ts      # Fonctions CRUD directes Firestore avec fallback usine
│   │   └── defaultData.ts        # Données de démarrage (Services, Matériel, Packs, Articles usine)
│   └── components/
│       ├── Header.tsx            # Barre de navigation responsive, sélection d'onglets, CTA
│       ├── Hero.tsx              # Slider d'accueil, statistiques clés et recherche rapide
│       ├── ServicesSection.tsx   # Grille des prestations (Marketing Digital & Logistique Événementielle)
│       ├── CatalogSection.tsx    # Catalogue matériel avec filtres par catégorie, recherche et panier rapide
│       ├── PacksSection.tsx      # Formules clés en main (Packs sonorisation, conférences, mariages)
│       ├── BlogSection.tsx       # Actualités, articles détaillés et module de commentaires modérés
│       ├── PartnersSection.tsx   # Galerie des marques et partenaires de confiance au Cameroun
│       ├── AboutSection.tsx      # Présentation de Forward One, équipe et vision
│       ├── ContactSection.tsx    # Formulaire de contact direct, Google Maps et coordonnées (Douala/Yaoundé)
│       ├── Footer.tsx            # Pied de page complet, liens rapides et mentions légales
│       ├── DevisModal.tsx        # Modal interactif de demande de devis personnalisé
│       ├── PreReservationModal.tsx # Modal de pré-réservation d'équipement avec calcul de durée et estimation
│       ├── ForwardOneLogo.tsx    # Composant SVG dynamique du logo de la marque
│       └── admin/                # Espace d'Administration Back-Office
│           ├── AdminDashboard.tsx   # Dashboard principal (Gestion contenu, articles, devis, réservations, DB)
│           ├── AdminLoginModal.tsx  # Modal de connexion sécurisée avec mot de passe
│           └── AdminPasswordForm.tsx# Formulaire de mise à jour du mot de passe admin
```

---

## ⚡ 3. Architecture de Persistance Hybride

L'application est conçue selon un principe de **résilience maximale** (*Fault-Tolerant Hybrid Data Layer*) :

1. **Première Tentative (Express REST API)** : Lorsqu'un composant demande ou enregistre des données, il émet une requête HTTP `fetch('/api/...')` vers le serveur Express (`server.ts`).
2. **Fallback Automatique (Firestore Web SDK)** : Si l'API backend n'est pas joignable (ex: déploiement JAMstack statique sur Vercel sans serveur Node, ou coupure réseau temporaire), le code intercepte l'erreur et fait appel à `src/lib/firebaseStore.ts`.
3. **Seeding Usine de Secours (`defaultData.ts`)** : Si Firestore est vide lors du premier lancement, la fonction `initializeDefaultFirestoreData()` peuple automatiquement la base avec les données de démonstration officielles de Forward One.

### Diagramme de flux de données :
```text
[ Composant React ]
        │
        ├──► 1. fetch('/api/data') ──► [ Backend Express (server.ts) ] ──► [ Firestore DB ]
        │                                        │
        │ (En cas d'échec / Offline)             │ (Succès)
        ▼                                        ▼
2. [ firebaseStore.ts ] ─────────────────────────┴──► [ Rend dans l'UI ]
        │
        └─► (Si DB vide) Peuple avec [ defaultData.ts ]
```

---

## 📡 4. Documentation des Endpoints API REST (`server.ts`)

Toutes les routes API sont préfixées par `/api`. Les endpoints nécessitant des droits d'administration requièrent un header HTTP :
`Authorization: Bearer <TOKEN_ADMIN>`.

### Public Endpoints

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Vérification de l'état de santé du serveur. |
| `GET` | `/api/content` | Récupère le contenu dynamique du site (textes, héros, contact). |
| `GET` | `/api/services` | Liste des services proposés. |
| `GET` | `/api/products` | Liste du catalogue de matériel en location. |
| `GET` | `/api/packs` | Liste des packs et formules événementielles. |
| `GET` | `/api/articles` | Liste des articles du blog. |
| `GET` | `/api/partners` | Liste des partenaires. |
| `GET` | `/api/articles/:id/comments` | Liste des commentaires approuvés pour un article. |
| `POST` | `/api/articles/:id/comments` | Soumission d'un nouveau commentaire visiteur (créé avec statut `pending`). |
| `POST` | `/api/devis` | Soumission d'une nouvelle demande de devis sur-mesure. |
| `POST` | `/api/prereservations` | Soumission d'une pré-réservation d'équipements. |
| `POST` | `/api/admin/login` | Connexion administrateur avec mot de passe (retourne un token JWT/session). |

### Endpoints Sécurisés (Administrateur)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `PUT` | `/api/content` | Mise à jour des textes globaux du site. |
| `POST` | `/api/services` | Création d'un nouveau service. |
| `PUT` | `/api/services/:id` | Modification d'un service existant. |
| `DELETE` | `/api/services/:id` | Suppression d'un service. |
| `POST` | `/api/products` | Ajout d'un nouveau produit au catalogue. |
| `PUT` | `/api/products/:id` | Modification d'un produit. |
| `DELETE` | `/api/products/:id` | Suppression d'un produit. |
| `POST` | `/api/packs` | Création d'un pack d'équipements. |
| `PUT` | `/api/packs/:id` | Modification d'un pack. |
| `DELETE` | `/api/packs/:id` | Suppression d'un pack. |
| `POST` | `/api/articles` | Rédaction d'un nouvel article de blog. |
| `PUT` | `/api/articles/:id` | Édition d'un article. |
| `DELETE` | `/api/articles/:id` | Suppression d'un article. |
| `GET` | `/api/comments/all` | Liste de **tous** les commentaires (y compris en attente/rejetés). |
| `PUT` | `/api/comments/:id/status` | Modération d'un commentaire (`approved`, `rejected`). |
| `DELETE` | `/api/comments/:id` | Suppression définitive d'un commentaire. |
| `GET` | `/api/devis` | Liste de toutes les demandes de devis reçues. |
| `PUT` | `/api/devis/:id/status` | Changement de statut d'un devis (`nouvelle`, `en_traitement`, `traitee`, `archivee`). |
| `GET` | `/api/prereservations` | Liste de toutes les pré-réservations. |
| `PUT` | `/api/prereservations/:id/status` | Changement de statut d'une réservation (`en_attente`, `confirmee`, `refusee`). |
| `POST` | `/api/admin/change-password` | Modification du mot de passe d'accès admin. |
| `POST` | `/api/admin/reset-db` | Réinitialisation totale de la base de données vers les données usine. |

---

## 🗄️ 5. Modèle de Données TypeScript & Collections Firestore

Les types centraux sont définis dans `src/types.ts` :

### 1. `ProductItem` (Catalogue Matériel)
```typescript
export interface ProductItem {
  id: string;
  name: string;
  category: 'sonorisation' | 'eclairage' | 'ecrans_led' | 'structure_scene' | 'videoprojecteur' | 'regie_captee';
  pricePerDay: number;
  image: string;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  available: boolean;
  popular?: boolean;
}
```

### 2. `QuoteRequestItem` (Demande de Devis)
```typescript
export interface QuoteRequestItem {
  id: string;
  clientName: string;
  company?: string;
  email: string;
  phone: string;
  serviceType: string;
  eventDate?: string;
  location?: string;
  budget?: string;
  description: string;
  status: 'nouvelle' | 'en_traitement' | 'traitee' | 'archivee';
  createdAt: string;
}
```

### 3. `PreReservationItem` (Pré-réservation)
```typescript
export interface PreReservationItem {
  id: string;
  clientName: string;
  company?: string;
  email: string;
  phone: string;
  equipmentDetails: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalEstimate: number;
  location: string;
  notes?: string;
  status: 'en_attente' | 'confirmee' | 'refusee';
  createdAt: string;
}
```

---

## 🔐 6. Système d'Authentification & Back-Office Administrateur

Le composant `src/components/admin/AdminDashboard.tsx` offre une interface d'administration complète divisée en onglets :

1. **Tableau de Bord** : Statistiques globales (Devis en attente, Réservations actives, Articles publiés, Commentaires à modérer).
2. **Contenu du Site** : Modification en temps réel des textes du Hero, À propos, et coordonnées.
3. **Services** : Gestion des cartes de prestations.
4. **Catalogue Matériel** : Ajout/Modification de produits avec calcul des tarifs.
5. **Packs & Formules** : Configuration des packs événementiels.
6. **Blog & Modération** : Rédaction d'actualités et approbation des commentaires.
7. **Demandes de Devis** : Traitement et changement d'état des devis.
8. **Pré-réservations** : Suivi des demandes de location.
9. **Paramètres Administrateur** :
   - Formulaire de changement de mot de passe sécurisé.
   - **Bouton Épuré de Réinitialisation de la Base de Données** :
     Un bouton d'action simple déclenchant un **modal d'avertissement de sécurité** détaillant explicitement les risques de perte de données avant de réensemencer Firestore avec les données d'usine.

---

## 🔄 7. Workflows Metier

### Flux de Demande de Devis Client
1. Le visiteur clique sur **"Demander un Devis"** dans le Header ou sur un Service.
2. Le modal `DevisModal.tsx` s'ouvre. Le client choisit le type de prestation, la date, la ville (Douala, Yaoundé, etc.) et son budget.
3. À la soumission :
   - La demande est envoyée via `/api/devis` et sauvegardée dans la collection Firestore `devis`.
   - Un identifiant unique de confirmation est généré pour le client.
   - L'administrateur voit immédiatement la notification sur son tableau de bord.

### Flux de Pré-réservation de Matériel
1. Le visiteur navigue dans le catalogue (`CatalogSection.tsx`) et ajoute des équipements à son panier.
2. Il valide en cliquant sur **"Réserver ces équipements"**, ce qui ouvre `PreReservationModal.tsx`.
3. Il saisit la période de location (Date de début & Date de fin). Le modal calcule automatiquement le nombre de jours et l'estimation du tarif total.
4. La pré-réservation est enregistrée dans Firestore avec le statut `en_attente`.

---

## 🌐 8. Référencement SEO & Previews OpenGraph / Réseaux Sociaux

L'application intègre une stratégie de référencement naturel poussée pour le marché camerounais :

- **Meta Tags Dynamiques** (`index.html`) : Déclaration des mots-clés géolocalisés (Douala, Yaoundé, Cameroun, Afrique Centrale).
- **Balises OpenGraph & Twitter Card** :
  - `og:image` principal : `/og-image.png` (Bannière HD 1200x630 générée via Sharp).
  - `og:image` secondaire : `/og-logo.png` (Logo carré 800x800 idéal pour les aperçus de liens dans **WhatsApp**).
- **Données Structurées JSON-LD** : Déclaration Schema.org de type `LocalBusiness` pour faciliter l'affichage dans les résultats enrichis Google (Google Maps & Knowledge Graph).

### Régénération des Images OpenGraph
Pour modifier le visuel d'aperçu de liens :
1. Éditez le modèle SVG dans `scripts/generate-og-images.js`.
2. Exécutez la commande :
   ```bash
   npx tsx scripts/generate-og-images.js
   ```
3. Les images générées seront automatiquement enregistrées dans `/public`.

---

## 🚀 9. Procédures de Déploiement

### Déploiement sur Cloud Run / Conteneur Docker

L'application est configurée pour binder automatiquement sur la variable d'environnement `PORT` ou le port `3000` sur l'hôte `0.0.0.0`.

1. **Build de production** :
   ```bash
   npm run build
   ```
2. **Démarrage du conteneur** :
   ```bash
   npm start
   ```

### Déploiement sur Vercel / Netlify (Frontend Statics)

Si vous déployez l'application sur Vercel :
1. Dans le tableau de bord Vercel, ajoutez les variables d'environnement `VITE_FIREBASE_*` (tirées de votre console Firebase).
2. Grâce à la persistance hybride, le site communiquera directement avec la base de données Firestore côté client.

---

## 🧰 10. Guide de Maintenance & Résolution de Problèmes

### Problème 1 : Les données ne se mettent pas à jour sur le site public après modification dans l'admin
- **Cause** : Le cache du navigateur ou de l'API conserve l'ancienne réponse.
- **Solution** : Le composant `App.tsx` déclenche `loadAllData()` automatiquement à chaque mise à jour. En cas de doute, cliquez sur le bouton **"Rafraîchir"** dans le Back-Office ou videz le cache local.

### Problème 2 : Indisponibilité ou erreur de règles Firestore
- **Cause** : Règles de sécurité Firestore trop restrictives ou projet Firebase non lié.
- **Solution** : Vérifiez la présence du fichier `firestore.rules` ou assurez-vous que les permissions en lecture/écriture sont accordées pour la collection publique si l'authentification Firebase n'est pas activée.

### Problème 3 : Erreur de build TypeScript (`tsc --noEmit`)
- **Cause** : Incohérence entre un composant et la définition d'un type dans `src/types.ts`.
- **Solution** : Lancez `npm run lint` pour identifier la ligne exacte posant problème.

---

*Manuel rédigé pour l'équipe technique Forward One. Document interne confidentiel.*
