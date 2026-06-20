import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY",
  authDomain: "greybrainer.firebaseapp.com",
  projectId: "greybrainer",
  storageBucket: "greybrainer.firebasestorage.app",
  messagingSenderId: "334602682761",
  appId: "1:334602682761:web:a8cc82bd81a753a3392158",
  measurementId: "G-BQ36BCQTTX"
};

// Initialize Firebase (Singleton pattern for Next.js SSR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
