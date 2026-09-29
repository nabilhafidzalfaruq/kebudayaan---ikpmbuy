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

const COLLECTION_NAME = 'kategori';

/**
 * Get all kategori documents
 * @returns {Promise<Array<Object>>}
 */
export const getAllKategori = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('nama', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (orderErr) {
      console.warn('Fallback: getting kategori without orderBy', orderErr);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    }
  } catch (error) {
    console.error('Error in getAllKategori:', error);
    throw error;
  }
};

/**
 * Get a single kategori document by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getKategoriById = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error in getKategoriById (${id}):`, error);
    throw error;
  }
};

/**
 * Get a kategori document by its slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const getKategoriBySlug = async (slug) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docItem = snapshot.docs[0];
    return { id: docItem.id, ...docItem.data() };
  } catch (error) {
    console.error(`Error in getKategoriBySlug (${slug}):`, error);
    throw error;
  }
};

/**
 * Add a new kategori document
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addKategori = async (data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error in addKategori:', error);
    throw error;
  }
};

/**
 * Update an existing kategori document
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateKategori = async (id, data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error in updateKategori (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a kategori document
 * @param {string} id
 * @returns {Promise<string>}
 */
export const deleteKategori = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error in deleteKategori (${id}):`, error);
    throw error;
  }
};
