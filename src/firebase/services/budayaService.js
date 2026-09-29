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

const COLLECTION_NAME = 'budaya';

/**
 * Get all budaya documents ordered by name
 * @returns {Promise<Array<Object>>}
 */
export const getAllBudaya = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('nama', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (orderErr) {
      console.warn('Fallback: getting budaya without orderBy index', orderErr);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    }
  } catch (error) {
    console.error('Error in getAllBudaya:', error);
    throw error;
  }
};

/**
 * Get a single budaya document by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getBudayaById = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error in getBudayaById (${id}):`, error);
    throw error;
  }
};

/**
 * Get a single budaya document by its slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const getBudayaBySlug = async (slug) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docItem = snapshot.docs[0];
    return { id: docItem.id, ...docItem.data() };
  } catch (error) {
    console.error(`Error in getBudayaBySlug (${slug}):`, error);
    throw error;
  }
};

/**
 * Get budaya documents filtered by kecamatan
 * @param {string} kecamatan
 * @returns {Promise<Array<Object>>}
 */
export const getBudayaByKecamatan = async (kecamatan) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('kecamatan', '==', kecamatan));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error(`Error in getBudayaByKecamatan (${kecamatan}):`, error);
    throw error;
  }
};

/**
 * Get budaya documents filtered by kategori
 * @param {string} kategori
 * @returns {Promise<Array<Object>>}
 */
export const getBudayaByKategori = async (kategori) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('kategori', '==', kategori));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error(`Error in getBudayaByKategori (${kategori}):`, error);
    throw error;
  }
};

/**
 * Get popular budaya documents (populer == true)
 * @returns {Promise<Array<Object>>}
 */
export const getBudayaPopuler = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('populer', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (error) {
    console.error('Error in getBudayaPopuler:', error);
    throw error;
  }
};

/**
 * Search budaya by query string across name, description, kategori, and kecamatan (client-side filter)
 * @param {string} queryStr
 * @returns {Promise<Array<Object>>}
 */
export const searchBudaya = async (queryStr) => {
  try {
    const allBudaya = await getAllBudaya();
    if (!queryStr || !queryStr.trim()) {
      return allBudaya;
    }
    const term = queryStr.toLowerCase().trim();
    return allBudaya.filter(item => {
      const nama = (item.nama || '').toLowerCase();
      const deskripsi = (item.deskripsi || '').toLowerCase();
      const kategori = (item.kategori || '').toLowerCase();
      const kecamatan = (item.kecamatan || '').toLowerCase();
      return (
        nama.includes(term) ||
        deskripsi.includes(term) ||
        kategori.includes(term) ||
        kecamatan.includes(term)
      );
    });
  } catch (error) {
    console.error(`Error in searchBudaya (${queryStr}):`, error);
    throw error;
  }
};

/**
 * Add a new budaya document
 * @param {Object} data
 * @returns {Promise<Object>} The created document with id
 */
export const addBudaya = async (data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error in addBudaya:', error);
    throw error;
  }
};

/**
 * Update an existing budaya document
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateBudaya = async (id, data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error in updateBudaya (${id}):`, error);
    throw error;
  }
};

/**
 * Delete a budaya document by ID
 * @param {string} id
 * @returns {Promise<string>} Deleted ID
 */
export const deleteBudaya = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error in deleteBudaya (${id}):`, error);
    throw error;
  }
};
