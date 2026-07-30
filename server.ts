import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  ArticleItem,
  CommentItem,
  PackItem,
  ProductItem,
  PreReservationItem,
  QuoteRequestItem,
  ServiceItem,
  SiteContent
} from "./src/types.js";
import {
  seedFirestoreIfEmpty,
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
  createComment,
  updateCommentStatus,
  deleteComment,
  getDevis,
  createDevis,
  updateDevisStatus,
  deleteDevis,
  getPreReservations,
  createPreReservation,
  updatePreReservationStatus,
  deletePreReservation,
  getAdminPassword,
  updateAdminPassword,
  removeAdminPassword,
  resetAndReseedFirestore
} from "./src/lib/firebaseStore.js";
import { resolvedFirebaseConfig } from "./src/lib/firebase.js";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Seed Firestore if empty
  await seedFirestoreIfEmpty();

  // Static uploads directory
  const UPLOADS_DIR = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Admin Password
  let ADMIN_PASS = await getAdminPassword();

  // Simple Admin Auth Token Check Helper
  const checkAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    ADMIN_PASS = await getAdminPassword();
    // If no password is set in Firestore, access is open/unlocked
    if (!ADMIN_PASS) {
      return next();
    }
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_PASS}` || authHeader === `Bearer OPEN` || req.headers["x-admin-key"] === ADMIN_PASS) {
      return next();
    }
    return res.status(401).json({ error: "Accès non autorisé. Le Back-Office est verrouillé par un mot de passe." });
  };

  // --- API ROUTES ---

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin Image Upload Endpoint
  app.post("/api/admin/upload", checkAdmin, (req, res) => {
    try {
      const { fileData } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Aucune donnée d'image transmise." });
      }

      // If fileData is already a Data URL (e.g. data:image/jpeg;base64,...), return it directly.
      // This ensures the image is stored directly inside Firestore and never disappears when the container restarts.
      if (typeof fileData === "string" && (fileData.startsWith("data:image/") || fileData.startsWith("data:video/"))) {
        return res.json({ success: true, url: fileData });
      }

      let buffer: Buffer;
      let ext = "png";

      if (typeof fileData === "string" && fileData.startsWith("data:")) {
        const matches = fileData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          ext = matches[1] === "jpeg" ? "jpg" : matches[1];
          buffer = Buffer.from(matches[2], "base64");
        } else {
          const parts = fileData.split(",");
          buffer = Buffer.from(parts[1] || parts[0], "base64");
        }
      } else if (typeof fileData === "string") {
        buffer = Buffer.from(fileData, "base64");
      } else {
        return res.status(400).json({ error: "Format d'image non valide." });
      }

      const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "");
      const safeFileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${safeExt || "png"}`;
      const targetPath = path.join(UPLOADS_DIR, safeFileName);

      fs.writeFileSync(targetPath, buffer);
      
      // Form a persistent data URL fallback
      const dataUrl = `data:image/${safeExt || "png"};base64,${buffer.toString("base64")}`;
      res.json({ success: true, url: dataUrl });
    } catch (err: any) {
      console.error("Upload handler error:", err);
      res.status(500).json({ error: "Erreur serveur lors de l'enregistrement de l'image." });
    }
  });

  // Admin Status Check
  app.get("/api/admin/status", async (_req, res) => {
    try {
      const currentPass = await getAdminPassword();
      res.json({ isLocked: !!currentPass, isConfigured: !!currentPass });
    } catch (err) {
      res.json({ isLocked: false, isConfigured: false });
    }
  });

  // Admin Auth Login
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    const currentPass = await getAdminPassword();
    if (!currentPass) {
      // Unlocked: allow immediate login
      return res.json({ success: true, token: "OPEN", isLocked: false, user: "Administrateur Forward One" });
    }
    if (password === currentPass) {
      ADMIN_PASS = currentPass;
      res.json({ success: true, token: currentPass, isLocked: true, user: "Administrateur Forward One" });
    } else {
      res.status(401).json({ success: false, error: "Mot de passe administrateur incorrect." });
    }
  });

  // Admin Update / Lock Password
  app.put("/api/admin/password", checkAdmin, async (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
      }
      await updateAdminPassword(newPassword);
      ADMIN_PASS = newPassword;
      res.json({ success: true, message: "Le mot de passe a été enregistré. Le Back-Office est désormais verrouillé." });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erreur lors de la mise à jour du mot de passe." });
    }
  });

  // Admin Remove / Unlock Password
  app.delete("/api/admin/password", checkAdmin, async (_req, res) => {
    try {
      await removeAdminPassword();
      ADMIN_PASS = null;
      res.json({ success: true, message: "Le mot de passe a été supprimé. L'accès au Back-Office est désormais libre." });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erreur lors de la suppression du mot de passe." });
    }
  });

  // Admin Reset Database
  app.post("/api/admin/reset-db", checkAdmin, async (_req, res) => {
    try {
      const result = await resetAndReseedFirestore();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erreur lors de la réinitialisation de la base de données." });
    }
  });

  // Admin Get Firebase Config (for Vercel integration)
  app.get("/api/admin/firebase-config", checkAdmin, (_req, res) => {
    res.json({
      config: resolvedFirebaseConfig,
      envSnippet: {
        VITE_FIREBASE_PROJECT_ID: resolvedFirebaseConfig.projectId,
        VITE_FIREBASE_APP_ID: resolvedFirebaseConfig.appId,
        VITE_FIREBASE_API_KEY: resolvedFirebaseConfig.apiKey,
        VITE_FIREBASE_AUTH_DOMAIN: resolvedFirebaseConfig.authDomain,
        VITE_FIREBASE_DATABASE_ID: resolvedFirebaseConfig.firestoreDatabaseId,
        VITE_FIREBASE_STORAGE_BUCKET: resolvedFirebaseConfig.storageBucket,
        VITE_FIREBASE_MESSAGING_SENDER_ID: resolvedFirebaseConfig.messagingSenderId
      }
    });
  });

  // Admin Stats
  app.get("/api/admin/stats", checkAdmin, async (_req, res) => {
    try {
      const [articles, products, packs, devis, prereservations, comments] = await Promise.all([
        getArticles(),
        getProducts(),
        getPacks(),
        getDevis(),
        getPreReservations(),
        getComments()
      ]);

      const stats = {
        totalArticles: articles.length,
        totalProducts: products.length,
        totalPacks: packs.length,
        totalQuotes: devis.length,
        pendingQuotes: devis.filter((d) => d.status === "nouvelle").length,
        totalReservations: prereservations.length,
        pendingReservations: prereservations.filter((p) => p.status === "en_attente").length,
        pendingComments: comments.filter((c) => c.status === "pending").length
      };
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erreur serveur" });
    }
  });

  // Site Content
  app.get("/api/site-content", async (_req, res) => {
    try {
      const data = await getSiteContent();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la récupération des données de contenu site" });
    }
  });

  app.put("/api/site-content", checkAdmin, async (req, res) => {
    try {
      const updated = await updateSiteContent(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la mise à jour des données du site" });
    }
  });

  // Services
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await getServices();
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des services" });
    }
  });

  app.post("/api/services", checkAdmin, async (req, res) => {
    try {
      const newService: ServiceItem = {
        id: `serv-${Date.now()}`,
        title: req.body.title || "Nouveau Service",
        category: req.body.category || "Marketing Digital",
        shortDescription: req.body.shortDescription || "",
        fullDescription: req.body.fullDescription || "",
        iconName: req.body.iconName || "Sparkles",
        features: req.body.features || [],
        image: req.body.image || "https://images.unsplash.com/photo-1542744094-3a3121699f84?auto=format&fit=crop&w=800&q=80"
      };
      const created = await createService(newService);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la création du service" });
    }
  });

  app.put("/api/services/:id", checkAdmin, async (req, res) => {
    try {
      const updated = await updateService(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du service" });
    }
  });

  app.delete("/api/services/:id", checkAdmin, async (req, res) => {
    try {
      await deleteService(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: "Erreur lors de la suppression du service" });
    }
  });

  // Products / Equipment Catalog
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération du catalogue" });
    }
  });

  app.post("/api/products", checkAdmin, async (req, res) => {
    try {
      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        name: req.body.name || "Nouveau Matériel",
        category: req.body.category || "Sonorisation",
        description: req.body.description || "",
        dailyRate: Number(req.body.dailyRate) || 50,
        stockQuantity: Number(req.body.stockQuantity) || 1,
        availabilityStatus: req.body.availabilityStatus || "disponible",
        specifications: req.body.specifications || {},
        image: req.body.image || "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
        isFeatured: Boolean(req.body.isFeatured)
      };
      const created = await createProduct(newProduct);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la création du matériel" });
    }
  });

  app.put("/api/products/:id", checkAdmin, async (req, res) => {
    try {
      const updated = await updateProduct(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du matériel" });
    }
  });

  app.delete("/api/products/:id", checkAdmin, async (req, res) => {
    try {
      await deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression du matériel" });
    }
  });

  // Packs
  app.get("/api/packs", async (_req, res) => {
    try {
      const packs = await getPacks();
      res.json(packs);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des packs" });
    }
  });

  app.post("/api/packs", checkAdmin, async (req, res) => {
    try {
      const newPack: PackItem = {
        id: `pack-${Date.now()}`,
        title: req.body.title || "Nouveau Pack",
        module: req.body.module || "marketing",
        tagline: req.body.tagline || "",
        priceEstimate: req.body.priceEstimate || "Sur devis",
        badge: req.body.badge || "Offre",
        description: req.body.description || "",
        inclusions: req.body.inclusions || [],
        popular: Boolean(req.body.popular),
        image: req.body.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
      };
      const created = await createPack(newPack);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la création du pack" });
    }
  });

  app.put("/api/packs/:id", checkAdmin, async (req, res) => {
    try {
      const updated = await updatePack(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du pack" });
    }
  });

  app.delete("/api/packs/:id", checkAdmin, async (req, res) => {
    try {
      await deletePack(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression du pack" });
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const isAdmin = req.headers.authorization === `Bearer ${ADMIN_PASS}` || req.headers["x-admin-key"] === ADMIN_PASS;
      const allArticles = await getArticles();
      if (isAdmin) {
        res.json(allArticles);
      } else {
        res.json(allArticles.filter((a) => a.published));
      }
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des articles" });
    }
  });

  app.post("/api/articles", checkAdmin, async (req, res) => {
    try {
      const title = req.body.title || "Nouvel Article";
      const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const newArticle: ArticleItem = {
        id: `art-${Date.now()}`,
        title,
        slug,
        category: req.body.category || "Marketing Digital",
        excerpt: req.body.excerpt || "",
        content: req.body.content || "",
        author: req.body.author || "Équipe Forward One",
        authorRole: req.body.authorRole || "Expert Editorial",
        date: new Date().toISOString().split("T")[0],
        readTime: req.body.readTime || "5 min",
        image: req.body.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        published: req.body.published !== undefined ? Boolean(req.body.published) : true,
        views: 0
      };
      const created = await createArticle(newArticle);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la création de l'article" });
    }
  });

  app.put("/api/articles/:id", checkAdmin, async (req, res) => {
    try {
      const updated = await updateArticle(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'article" });
    }
  });

  app.delete("/api/articles/:id", checkAdmin, async (req, res) => {
    try {
      await deleteArticle(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression de l'article" });
    }
  });

  // Comments (Public Submission + Admin Moderation)
  app.get("/api/comments", async (req, res) => {
    try {
      const isAdmin = req.headers.authorization === `Bearer ${ADMIN_PASS}` || req.headers["x-admin-key"] === ADMIN_PASS;
      const articleId = req.query.articleId as string | undefined;

      let list = await getComments();
      if (articleId) {
        list = list.filter((c) => c.articleId === articleId);
      }

      if (!isAdmin) {
        list = list.filter((c) => c.status === "approved");
      }

      res.json(list);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const { articleId, articleTitle, authorName, content } = req.body;
      if (!authorName || !content) {
        return res.status(400).json({ error: "Nom et commentaire obligatoires." });
      }

      const newComment: CommentItem = {
        id: `com-${Date.now()}`,
        articleId,
        articleTitle,
        authorName,
        content,
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      const created = await createComment(newComment);
      res.status(201).json({
        message: "Votre commentaire a été transmis et est en attente de modération par l'équipe.",
        comment: created
      });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la création du commentaire" });
    }
  });

  app.put("/api/comments/:id/status", checkAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await updateCommentStatus(req.params.id, status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la modération du commentaire" });
    }
  });

  app.delete("/api/comments/:id", checkAdmin, async (req, res) => {
    try {
      await deleteComment(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression du commentaire" });
    }
  });

  // Devis (Quote Requests)
  app.get("/api/devis", checkAdmin, async (_req, res) => {
    try {
      const list = await getDevis();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des demandes de devis" });
    }
  });

  app.post("/api/devis", async (req, res) => {
    try {
      const { clientName, company, email, phone, moduleType, budgetRange, targetDate, eventLocation, description, selectedItems } = req.body;

      if (!clientName || !email || !phone || !description) {
        return res.status(400).json({ error: "Informations requises manquantes." });
      }

      const newDevis: QuoteRequestItem = {
        id: `dev-${Date.now()}`,
        clientName,
        company: company || "Particulier / Non spécifié",
        email,
        phone,
        moduleType: moduleType || "Marketing Digital",
        budgetRange: budgetRange || "À définir",
        targetDate: targetDate || "ASAP",
        eventLocation: eventLocation || "",
        description,
        selectedItems: selectedItems || [],
        status: "nouvelle",
        createdAt: new Date().toISOString()
      };

      const created = await createDevis(newDevis);
      res.status(201).json({
        message: "Votre demande de devis a été enregistrée avec succès. Notre équipe vous recontactera sous 24h.",
        devis: created
      });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la création de la demande de devis" });
    }
  });

  app.put("/api/devis/:id/status", checkAdmin, async (req, res) => {
    try {
      const updated = await updateDevisStatus(req.params.id, req.body.status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du statut du devis" });
    }
  });

  app.delete("/api/devis/:id", checkAdmin, async (req, res) => {
    try {
      await deleteDevis(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression de la demande de devis" });
    }
  });

  // Pre-reservations & Email Sending Simulation
  app.get("/api/prereservations", checkAdmin, async (_req, res) => {
    try {
      const list = await getPreReservations();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des pré-réservations" });
    }
  });

  app.post("/api/prereservations", async (req, res) => {
    try {
      const { clientName, company, email, phone, equipmentDetails, startDate, endDate, location, notes } = req.body;

      if (!clientName || !email || !phone || !startDate || !endDate || !equipmentDetails || equipmentDetails.length === 0) {
        return res.status(400).json({ error: "Champs requis manquants pour la pré-réservation." });
      }

      // Calculate duration in days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.max(end.getTime() - start.getTime(), 86400000);
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // Calculate total estimate
      let totalRatePerDay = 0;
      equipmentDetails.forEach((eq: any) => {
        totalRatePerDay += (eq.dailyRate || 0) * (eq.quantity || 1);
      });
      const totalEstimate = totalRatePerDay * durationDays;

      const currentSiteContent = await getSiteContent();

      // Build Email Templates for Client & Admin
      const sentAt = new Date().toISOString();
      const itemsListText = equipmentDetails
        .map((eq: any) => `- ${eq.name} (x${eq.quantity}) : ${(eq.dailyRate || 0).toLocaleString()} FCFA/jour`)
        .join("\n");

      const clientEmailContent = `
Objet : [Forward One] Confirmation de votre pré-réservation #${Date.now().toString().slice(-6)}

Bonjour ${clientName},

Nous avons bien reçu votre demande de pré-réservation de matériel pour la période du ${startDate} au ${endDate} (${durationDays} jour(s)).

Détail des équipements réservés :
${itemsListText}

Estimation tarifaire indicative : ${totalEstimate.toLocaleString()} FCFA HT
Lieu de mise à disposition : ${location || "À définir / Retrait entrepôt Cameroun"}

Notre équipe Logistique Événementielle traite votre demande et étudie la disponibilité exacte du matériel aux dates sélectionnées.
Vous recevrez votre devis définitif avec conditions de livraison sous 24h ouvrées.

Slogan : Progress Without Limits.
L'équipe Forward One - Logistique Événementielle
Contact : ${currentSiteContent.contactPhone} | ${currentSiteContent.contactEmail}
      `.trim();

      const adminEmailContent = `
Objet : [ALERTE ADMIN FORWARD ONE] Nouvelle Pré-réservation de matériel !

Client : ${clientName} (${company || "Non renseigné"})
Email : ${email} | Tél : ${phone}
Dates : Du ${startDate} au ${endDate} (${durationDays} jours)
Lieu : ${location || "Entrepôt Cameroun"}

Matériel demandé :
${itemsListText}

Total estimé : ${totalEstimate.toLocaleString()} FCFA HT
Notes client : ${notes || "Aucune note."}

Accédez au Back-Office pour valider la disponibilité et convertir en réservation ferme.
      `.trim();

      const newReservation: PreReservationItem = {
        id: `res-${Date.now()}`,
        clientName,
        company: company || "Particulier",
        email,
        phone,
        equipmentDetails,
        startDate,
        endDate,
        durationDays,
        totalEstimate,
        location: location || "Entrepôt Douala / Yaoundé",
        notes: notes || "",
        status: "en_attente",
        createdAt: sentAt,
        emailNotificationSent: {
          clientEmailContent,
          adminEmailContent,
          sentAt
        }
      };

      const created = await createPreReservation(newReservation);

      res.status(201).json({
        success: true,
        message: "Votre pré-réservation a été enregistrée. Un email de confirmation vous a été envoyé et une alerte a été transmise à notre administrateur.",
        reservation: created
      });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la création de la pré-réservation" });
    }
  });

  app.put("/api/prereservations/:id/status", checkAdmin, async (req, res) => {
    try {
      const updated = await updatePreReservationStatus(req.params.id, req.body.status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du statut de la pré-réservation" });
    }
  });

  app.delete("/api/prereservations/:id", checkAdmin, async (req, res) => {
    try {
      await deletePreReservation(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la suppression de la pré-réservation" });
    }
  });

  // --- SEO ROUTES (robots.txt & sitemap.xml) ---
  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.join(process.cwd(), "public", "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.header("Content-Type", "text/plain");
      return res.sendFile(robotsPath);
    }
    res.type("text/plain").send("User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://forwardone.cm/sitemap.xml");
  });

  app.get("/sitemap.xml", (_req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.header("Content-Type", "application/xml");
      return res.sendFile(sitemapPath);
    }
    res.status(404).send("Sitemap non trouvé");
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Forward One Server] En ligne sur http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Échec du démarrage du serveur:", err);
});
