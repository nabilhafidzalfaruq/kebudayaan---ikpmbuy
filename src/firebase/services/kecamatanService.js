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

const COLLECTION_NAME = 'kecamatan';

/**
 * Get all kecamatan documents ordered by name
 * @returns {Promise<Array<Object>>}
 */
export const getAllKecamatan = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('nama', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (orderErr) {
      console.warn('Fallback: getting kecamatan without orderBy', orderErr);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    }
  } catch (error) {
    console.error('Error in getAllKecamatan:', error);
    throw error;
  }
};

/**
 * Get a single kecamatan document by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getKecamatanById = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error in getKecamatanById (${id}):`, error);
    throw error;
  }
};

/**
 * Get a single kecamatan document by slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const getKecamatanBySlug = async (slug) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docItem = snapshot.docs[0];
    return { id: docItem.id, ...docItem.data() };
  } catch (error) {
    console.error(`Error in getKecamatanBySlug (${slug}):`, error);
    throw error;
  }
};

/**
 * Add a new kecamatan document
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addKecamatan = async (data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error in addKecamatan:', error);
    throw error;
  }
};

/**
 * Update an existing kecamatan document
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateKecamatan = async (id, data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error in updateKecamatan (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a kecamatan document
 * @param {string} id
 * @returns {Promise<string>}
 */
export const deleteKecamatan = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error in deleteKecamatan (${id}):`, error);
    throw error;
  }
};
