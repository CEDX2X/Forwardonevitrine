import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfigDefault from "../../firebase-applet-config.json";

const getEnv = (key: string) => {
  try {
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const config = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || firebaseConfigDefault.apiKey || "",
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || firebaseConfigDefault.authDomain || "",
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || firebaseConfigDefault.projectId || "",
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || firebaseConfigDefault.storageBucket || "",
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || firebaseConfigDefault.messagingSenderId || "",
  appId: getEnv("VITE_FIREBASE_APP_ID") || firebaseConfigDefault.appId || "",
  firestoreDatabaseId: getEnv("VITE_FIREBASE_DATABASE_ID") || firebaseConfigDefault.firestoreDatabaseId || "(default)"
};

const app = !getApps().length ? initializeApp(config) : getApp();

export const db = getFirestore(app, config.firestoreDatabaseId || "(default)");


