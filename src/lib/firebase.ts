import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

// Safe helper to extract environment variables from Node process.env or Vite import.meta.env
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  return undefined;
};

export const resolvedFirebaseConfig = {
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID") || getEnvVar("FIREBASE_PROJECT_ID") || firebaseConfigJson.projectId,
  appId: getEnvVar("VITE_FIREBASE_APP_ID") || getEnvVar("FIREBASE_APP_ID") || firebaseConfigJson.appId,
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY") || getEnvVar("FIREBASE_API_KEY") || firebaseConfigJson.apiKey,
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN") || getEnvVar("FIREBASE_AUTH_DOMAIN") || firebaseConfigJson.authDomain,
  firestoreDatabaseId: getEnvVar("VITE_FIREBASE_DATABASE_ID") || getEnvVar("FIREBASE_DATABASE_ID") || firebaseConfigJson.firestoreDatabaseId || "(default)",
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET") || getEnvVar("FIREBASE_STORAGE_BUCKET") || firebaseConfigJson.storageBucket,
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID") || getEnvVar("FIREBASE_MESSAGING_SENDER_ID") || firebaseConfigJson.messagingSenderId,
};

const app = !getApps().length ? initializeApp(resolvedFirebaseConfig) : getApp();

export const db = getFirestore(app, resolvedFirebaseConfig.firestoreDatabaseId || "(default)");

