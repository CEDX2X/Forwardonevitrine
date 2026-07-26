import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";
import {
  initialArticles,
  initialComments,
  initialPacks,
  initialProducts,
  initialServices,
  initialSiteContent
} from "../data/initialData";
import {
  ArticleItem,
  CommentItem,
  PackItem,
  ProductItem,
  PreReservationItem,
  QuoteRequestItem,
  ServiceItem,
  SiteContent
} from "../types";

// Collections names
const COLLECTIONS = {
  SITE_CONTENT: "siteContent",
  SERVICES: "services",
  PRODUCTS: "products",
  PACKS: "packs",
  ARTICLES: "articles",
  COMMENTS: "comments",
  DEVIS: "devis",
  PRERESERVATIONS: "prereservations"
};

/**
 * Seed Firebase Firestore with initial data if collections are empty.
 */
export async function seedFirestoreIfEmpty() {
  try {
    // 1. Site Content
    const siteContentRef = doc(db, COLLECTIONS.SITE_CONTENT, "main");
    const siteContentSnap = await getDoc(siteContentRef);
    if (!siteContentSnap.exists()) {
      console.log("[Firebase] Seeding siteContent in Firestore...");
      await setDoc(siteContentRef, initialSiteContent);
    }

    // 2. Services
    const servicesSnap = await getDocs(collection(db, COLLECTIONS.SERVICES));
    if (servicesSnap.empty) {
      console.log("[Firebase] Seeding services in Firestore...");
      for (const service of initialServices) {
        await setDoc(doc(db, COLLECTIONS.SERVICES, service.id), service);
      }
    }

    // 3. Products
    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log("[Firebase] Seeding products in Firestore...");
      for (const prod of initialProducts) {
        await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), prod);
      }
    }

    // 4. Packs
    const packsSnap = await getDocs(collection(db, COLLECTIONS.PACKS));
    if (packsSnap.empty) {
      console.log("[Firebase] Seeding packs in Firestore...");
      for (const pack of initialPacks) {
        await setDoc(doc(db, COLLECTIONS.PACKS, pack.id), pack);
      }
    }

    // 5. Articles
    const articlesSnap = await getDocs(collection(db, COLLECTIONS.ARTICLES));
    if (articlesSnap.empty) {
      console.log("[Firebase] Seeding articles in Firestore...");
      for (const art of initialArticles) {
        await setDoc(doc(db, COLLECTIONS.ARTICLES, art.id), art);
      }
    }

    // 6. Comments
    const commentsSnap = await getDocs(collection(db, COLLECTIONS.COMMENTS));
    if (commentsSnap.empty) {
      console.log("[Firebase] Seeding comments in Firestore...");
      for (const com of initialComments) {
        await setDoc(doc(db, COLLECTIONS.COMMENTS, com.id), com);
      }
    }

    console.log("[Firebase] Firestore initialization/verification complete.");
  } catch (err) {
    console.error("[Firebase] Error seeding Firestore:", err);
  }
}

// ================= SITE CONTENT =================
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.SITE_CONTENT, "main"));
    if (snap.exists()) {
      return snap.data() as SiteContent;
    }
  } catch (err) {
    console.error("[Firebase] Error fetching siteContent:", err);
  }
  return initialSiteContent;
}

export async function updateSiteContent(data: Partial<SiteContent>): Promise<SiteContent> {
  const current = await getSiteContent();
  const updated = { ...current, ...data };
  await setDoc(doc(db, COLLECTIONS.SITE_CONTENT, "main"), updated, { merge: true });
  return updated;
}

// ================= SERVICES =================
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.SERVICES));
    if (!snap.empty) {
      return snap.docs.map((doc) => doc.data() as ServiceItem);
    }
  } catch (err) {
    console.error("[Firebase] Error fetching services:", err);
  }
  return initialServices;
}

export async function createService(service: ServiceItem): Promise<ServiceItem> {
  await setDoc(doc(db, COLLECTIONS.SERVICES, service.id), service);
  return service;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem> {
  const ref = doc(db, COLLECTIONS.SERVICES, id);
  await updateDoc(ref, data);
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as ServiceItem;
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
}

// ================= PRODUCTS =================
export async function getProducts(): Promise<ProductItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (!snap.empty) {
      return snap.docs.map((doc) => doc.data() as ProductItem);
    }
  } catch (err) {
    console.error("[Firebase] Error fetching products:", err);
  }
  return initialProducts;
}

export async function createProduct(product: ProductItem): Promise<ProductItem> {
  await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product);
  return product;
}

export async function updateProduct(id: string, data: Partial<ProductItem>): Promise<ProductItem> {
  const ref = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(ref, data);
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as ProductItem;
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
}

// ================= PACKS =================
export async function getPacks(): Promise<PackItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PACKS));
    if (!snap.empty) {
      return snap.docs.map((doc) => doc.data() as PackItem);
    }
  } catch (err) {
    console.error("[Firebase] Error fetching packs:", err);
  }
  return initialPacks;
}

export async function createPack(pack: PackItem): Promise<PackItem> {
  await setDoc(doc(db, COLLECTIONS.PACKS, pack.id), pack);
  return pack;
}

export async function updatePack(id: string, data: Partial<PackItem>): Promise<PackItem> {
  const ref = doc(db, COLLECTIONS.PACKS, id);
  await updateDoc(ref, data);
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as PackItem;
}

export async function deletePack(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PACKS, id));
}

// ================= ARTICLES =================
export async function getArticles(): Promise<ArticleItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.ARTICLES));
    if (!snap.empty) {
      const list = snap.docs.map((doc) => doc.data() as ArticleItem);
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (err) {
    console.error("[Firebase] Error fetching articles:", err);
  }
  return initialArticles;
}

export async function createArticle(article: ArticleItem): Promise<ArticleItem> {
  await setDoc(doc(db, COLLECTIONS.ARTICLES, article.id), article);
  return article;
}

export async function updateArticle(id: string, data: Partial<ArticleItem>): Promise<ArticleItem> {
  const ref = doc(db, COLLECTIONS.ARTICLES, id);
  await updateDoc(ref, data);
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as ArticleItem;
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ARTICLES, id));
}

// ================= COMMENTS =================
export async function getComments(): Promise<CommentItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.COMMENTS));
    if (!snap.empty) {
      const list = snap.docs.map((doc) => doc.data() as CommentItem);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.error("[Firebase] Error fetching comments:", err);
  }
  return initialComments;
}

export async function createComment(comment: CommentItem): Promise<CommentItem> {
  await setDoc(doc(db, COLLECTIONS.COMMENTS, comment.id), comment);
  return comment;
}

export async function updateCommentStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<CommentItem> {
  const ref = doc(db, COLLECTIONS.COMMENTS, id);
  await updateDoc(ref, { status });
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as CommentItem;
}

export async function deleteComment(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.COMMENTS, id));
}

// ================= DEVIS (QUOTES) =================
export async function getDevis(): Promise<QuoteRequestItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.DEVIS));
    if (!snap.empty) {
      const list = snap.docs.map((doc) => doc.data() as QuoteRequestItem);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.error("[Firebase] Error fetching devis:", err);
  }
  return [];
}

export async function createDevis(devis: QuoteRequestItem): Promise<QuoteRequestItem> {
  await setDoc(doc(db, COLLECTIONS.DEVIS, devis.id), devis);
  return devis;
}

export async function updateDevisStatus(id: string, status: QuoteRequestItem['status']): Promise<QuoteRequestItem> {
  const ref = doc(db, COLLECTIONS.DEVIS, id);
  await updateDoc(ref, { status });
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as QuoteRequestItem;
}

export async function deleteDevis(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.DEVIS, id));
}

// ================= PRERESERVATIONS =================
export async function getPreReservations(): Promise<PreReservationItem[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PRERESERVATIONS));
    if (!snap.empty) {
      const list = snap.docs.map((doc) => doc.data() as PreReservationItem);
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.error("[Firebase] Error fetching prereservations:", err);
  }
  return [];
}

export async function createPreReservation(res: PreReservationItem): Promise<PreReservationItem> {
  await setDoc(doc(db, COLLECTIONS.PRERESERVATIONS, res.id), res);
  return res;
}

export async function updatePreReservationStatus(id: string, status: PreReservationItem['status']): Promise<PreReservationItem> {
  const ref = doc(db, COLLECTIONS.PRERESERVATIONS, id);
  await updateDoc(ref, { status });
  const updatedSnap = await getDoc(ref);
  return updatedSnap.data() as PreReservationItem;
}

export async function deletePreReservation(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRERESERVATIONS, id));
}
