import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const requireEnv = (key: string) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required Firebase env var: ${key}`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(firebaseConfig);
};

export const firebaseApp = getFirebaseApp();
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

// Local test plumbing only. VITE_FIREBASE_USE_EMULATOR=true must never be set
// in a production build; it routes Firestore to the local emulator suite.
const useFirestoreEmulator = import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true';
if (useFirestoreEmulator) {
  connectFirestoreEmulator(
    firestore,
    String(import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1'),
    Number(import.meta.env.VITE_FIREBASE_EMULATOR_PORT || 8080),
  );
}
