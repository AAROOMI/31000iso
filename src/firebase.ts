import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Default database for master data
export const masterDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(masterDb).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support all of the features required to enable persistence");
    }
  });
}

// Function to get a specific database instance for a tenant
export const getTenantDb = (databaseId?: string): Firestore => {
  if (!databaseId || databaseId === '(default)' || databaseId === firebaseConfig.firestoreDatabaseId) {
    return masterDb;
  }
  return getFirestore(app, databaseId);
};

// For backward compatibility, export db as masterDb initially
export const db = masterDb;
export const storage = getStorage(app);

export default app;
