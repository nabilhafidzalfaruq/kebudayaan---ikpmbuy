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

const COLLECTION_NAME = 'kuliner';

/**
 * Get all kuliner documents ordered by name
 * @returns {Promise<Array<Object>>}
 */
export const getAllKuliner = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('nama', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (orderErr) {
      console.warn('Fallback: getting kuliner without orderBy', orderErr);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    }
  } catch (error) {
    console.error('Error in getAllKuliner:', error);
    throw error;
  }
};

/**
 * Get a single kuliner document by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getKulinerById = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error in getKulinerById (${id}):`, error);
    throw error;
  }
};

/**
 * Get a single kuliner document by slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const getKulinerBySlug = async (slug) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docItem = snapshot.docs[0];
    return { id: docItem.id, ...docItem.data() };
  } catch (error) {
    console.error(`Error in getKulinerBySlug (${slug}):`, error);
    throw error;
  }
};

/**
 * Add a new kuliner document
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addKuliner = async (data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error in addKuliner:', error);
    throw error;
  }
};

/**
 * Update an existing kuliner document
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateKuliner = async (id, data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error in updateKuliner (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a kuliner document
 * @param {string} id
 * @returns {Promise<string>}
 */
export const deleteKuliner = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error in deleteKuliner (${id}):`, error);
    throw error;
  }
};
