import { FAQItem } from '../types';
import { INITIAL_FAQS } from '../data/faqDatabase';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'smart_campus_faqs';
const FIRESTORE_COLLECTION = 'faqs';

/**
 * Retrieves cached FAQs from LocalStorage or returns prebuilt INITIAL_FAQS
 */
export function getStoredFAQs(): FAQItem[] {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading FAQs from local storage:', err);
  }
  return INITIAL_FAQS;
}

/**
 * Saves FAQs locally and syncs with Firestore
 */
export async function saveStoredFAQs(faqs: FAQItem[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));

    if (db) {
      // 1. Single document store sync
      setDoc(doc(db, 'ckcet_campro', STORAGE_KEY), { data: faqs, updatedAt: Date.now() }, { merge: true })
        .catch((err) => console.warn('Firestore FAQ single doc sync notice:', err));

      // 2. Collection document sync
      faqs.forEach((faq) => {
        setDoc(doc(db, FIRESTORE_COLLECTION, faq.id), { ...faq, updatedAt: new Date().toISOString() }, { merge: true })
          .catch((err) => console.warn(`Firestore collection sync error for FAQ ${faq.id}:`, err));
      });
    }
  } catch (err) {
    console.error('Error saving FAQs:', err);
  }
}

/**
 * Real-time subscription to Firestore `faqs` collection
 */
export function subscribeToFAQs(callback: (faqs: FAQItem[]) => void) {
  const localFAQs = getStoredFAQs();
  callback(localFAQs);

  if (!db) return () => {};

  // Listen to `faqs` collection
  const colRef = collection(db, FIRESTORE_COLLECTION);
  const unsubCol = onSnapshot(
    colRef,
    (snapshot) => {
      const items: FAQItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as FAQItem);
      });
      if (items.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        callback(items);
      }
    },
    (error) => {
      console.warn('Firestore FAQ subscription error, using local cache:', error);
    }
  );

  // Fallback single document listener
  const unsubDoc = onSnapshot(
    doc(db, 'ckcet_campro', STORAGE_KEY),
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.data();
        if (val && Array.isArray(val.data) && val.data.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(val.data));
          callback(val.data as FAQItem[]);
        }
      }
    },
    () => {}
  );

  return () => {
    unsubCol();
    unsubDoc();
  };
}

/**
 * Add a new FAQ
 */
export async function addFAQ(newFaq: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const faqs = getStoredFAQs();
  const id = `faq-custom-${Date.now()}`;
  const created: FAQItem = {
    ...newFaq,
    id,
    version: 1,
    createdAt: new Date().toISOString(),
    status: newFaq.status || 'active'
  };

  const updatedList = [created, ...faqs];
  await saveStoredFAQs(updatedList);
  return created;
}

/**
 * Update an existing FAQ
 */
export async function updateFAQ(updated: FAQItem): Promise<void> {
  const faqs = getStoredFAQs();
  const index = faqs.findIndex((f) => f.id === updated.id);
  const updatedItem: FAQItem = {
    ...updated,
    version: (updated.version || 1) + 1,
    updatedAt: new Date().toISOString()
  };

  if (index !== -1) {
    faqs[index] = updatedItem;
  } else {
    faqs.unshift(updatedItem);
  }

  await saveStoredFAQs(faqs);
}

/**
 * Delete an FAQ
 */
export async function deleteFAQ(id: string): Promise<void> {
  const faqs = getStoredFAQs();
  const filtered = faqs.filter((f) => f.id !== id);
  await saveStoredFAQs(filtered);

  if (db) {
    deleteDoc(doc(db, FIRESTORE_COLLECTION, id)).catch(() => {});
  }
}

/**
 * Toggle Active/Inactive status
 */
export async function toggleFAQStatus(id: string): Promise<void> {
  const faqs = getStoredFAQs();
  const faq = faqs.find((f) => f.id === id);
  if (faq) {
    faq.status = faq.status === 'inactive' ? 'active' : 'inactive';
    await saveStoredFAQs(faqs);
  }
}

/**
 * Bulk Upload FAQs
 */
export async function bulkUploadFAQs(uploadedList: FAQItem[]): Promise<void> {
  const current = getStoredFAQs();
  const existingMap = new Map(current.map((f) => [f.id, f]));

  uploadedList.forEach((item) => {
    const faqId = item.id || `faq-imported-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    existingMap.set(faqId, {
      ...item,
      id: faqId,
      status: item.status || 'active',
      updatedAt: new Date().toISOString()
    });
  });

  const merged = Array.from(existingMap.values());
  await saveStoredFAQs(merged);
}

/**
 * React Hook for monitoring Online / Offline network state
 */
export function useOnlineStatus(): { isOnline: boolean; lastSynced: string } {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastSynced, setLastSynced] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSynced(new Date().toLocaleTimeString());
      // Trigger sync when coming back online
      const current = getStoredFAQs();
      saveStoredFAQs(current);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, lastSynced };
}
