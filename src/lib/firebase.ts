import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfigDefault from "../../firebase-applet-config.json";

const config = {
  apiKey: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_API_KEY) || firebaseConfigDefault.apiKey || "",
  authDomain: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_AUTH_DOMAIN) || firebaseConfigDefault.authDomain || "",
  projectId: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_PROJECT_ID) || firebaseConfigDefault.projectId || "",
  storageBucket: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_STORAGE_BUCKET) || firebaseConfigDefault.storageBucket || "",
  messagingSenderId: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || firebaseConfigDefault.messagingSenderId || "",
  appId: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_APP_ID) || firebaseConfigDefault.appId || "",
  firestoreDatabaseId: (typeof process !== "undefined" && process.env?.VITE_FIREBASE_DATABASE_ID) || firebaseConfigDefault.firestoreDatabaseId || "(default)"
};

const app = !getApps().length ? initializeApp(config) : getApp();

export const db = getFirestore(app, config.firestoreDatabaseId || "(default)");

