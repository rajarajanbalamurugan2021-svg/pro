import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  getDocFromServer,
  deleteDoc,
  enableIndexedDbPersistence,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import config from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(config) : getApp();

export const db = getFirestore(app, (config as any).firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Enable offline persistence safely
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn('Firestore offline persistence notice:', err?.code || err?.message || err);
  });
}

// Test Firestore connection on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}

// Storage setup
export const storage = getStorage(app);

// Helper for file uploads to Firebase Storage
export async function uploadFileToStorage(file: File, folderPath = 'uploads'): Promise<string> {
  try {
    const fileRef = ref(storage, `${folderPath}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase storage upload fallback to local URL:', err);
    return URL.createObjectURL(file);
  }
}

export {
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  getDocFromServer,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
export type { FirebaseUser };
