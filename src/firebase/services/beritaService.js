import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';

const COLLECTION_NAME = 'berita';

/**
 * Helper to safely extract date value for sorting
 */
const getTimeValue = (val) => {
  if (!val) return 0;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (val instanceof Date) return val.getTime();
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get all published berita documents ordered by date descending
 * @returns {Promise<Array<Object>>}
 */
export const getAllBerita = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('published', '==', true),
        orderBy('tanggal', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (indexError) {
      console.warn('Fallback: query published berita without composite index', indexError);
      const q = query(collection(db, COLLECTION_NAME), where('published', '==', true));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => getTimeValue(b.tanggal || b.createdAt) - getTimeValue(a.tanggal || a.createdAt));
    }
  } catch (error) {
    console.error('Error in getAllBerita:', error);
    throw error;
  }
};

/**
 * Get all berita documents including drafts for admin, ordered by updatedAt descending
 * @returns {Promise<Array<Object>>}
 */
export const getAllBeritaAdmin = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (err) {
      console.warn('Fallback: getting admin berita with manual sort', err);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => getTimeValue(b.updatedAt || b.createdAt) - getTimeValue(a.updatedAt || a.createdAt));
    }
  } catch (error) {
    console.error('Error in getAllBeritaAdmin:', error);
    throw error;
  }
};

/**
 * Get a single berita by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getBeritaById = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error in getBeritaById (${id}):`, error);
    throw error;
  }
};

/**
 * Get a single berita by slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const getBeritaBySlug = async (slug) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docItem = snapshot.docs[0];
    return { id: docItem.id, ...docItem.data() };
  } catch (error) {
    console.error(`Error in getBeritaBySlug (${slug}):`, error);
    throw error;
  }
};

/**
 * Get featured and published berita
 * @returns {Promise<Array<Object>>}
 */
export const getFeaturedBerita = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('featured', '==', true),
        where('published', '==', true)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => getTimeValue(b.tanggal || b.createdAt) - getTimeValue(a.tanggal || a.createdAt));
    } catch (err) {
      console.warn('Fallback: getting featured berita with client filter', err);
      const allBerita = await getAllBerita();
      return allBerita.filter(item => item.featured === true);
    }
  } catch (error) {
    console.error('Error in getFeaturedBerita:', error);
    throw error;
  }
};

/**
 * Add a new berita document
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addBerita = async (data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docData = {
      ...data,
      published: data.published !== undefined ? data.published : true,
      featured: data.featured !== undefined ? data.featured : false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error in addBerita:', error);
    throw error;
  }
};

/**
 * Update an existing berita document
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateBerita = async (id, data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error in updateBerita (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a berita document
 * @param {string} id
 * @returns {Promise<string>}
 */
export const deleteBerita = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error in deleteBerita (${id}):`, error);
    throw error;
  }
};

/**
 * Toggle published boolean of a berita document
 * @param {string} id
 * @param {boolean} currentStatus
 * @returns {Promise<boolean>} The new published status
 */
export const togglePublishBerita = async (id, currentStatus) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const newStatus = !currentStatus;
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      published: newStatus,
      updatedAt: serverTimestamp()
    });
    return newStatus;
  } catch (error) {
    console.error(`Error in togglePublishBerita (${id}):`, error);
    throw error;
  }
};
