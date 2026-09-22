import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBMAHm1NsA46HRtiIzobd8QgYPhETqY92w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "metodo-canal-dark.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "metodo-canal-dark",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "metodo-canal-dark.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "46904346631",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:46904346631:web:bb61d275886ca13fbf42a2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
