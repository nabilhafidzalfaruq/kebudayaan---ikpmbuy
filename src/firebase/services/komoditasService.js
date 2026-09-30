import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config';

const COLLECTION_NAME = 'komoditas';

export const getAllKomoditas = async () => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('nama', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching komoditas:', error);
    return [];
  }
};

export const getKomoditasBySlug = async (slug) => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error fetching komoditas by slug:', error);
    return null;
  }
};

export const getKomoditasUnggulan = async () => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('unggulan', '==', true),
      orderBy('nama', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching komoditas unggulan:', error);
    return [];
  }
};

export const getKomoditasByKategori = async (kategori) => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, COLLECTION_NAME), where('kategori', '==', kategori));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching komoditas by kategori:', error);
    return [];
  }
};

export const addKomoditas = async (data) => {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding komoditas:', error);
    throw error;
  }
};

export const updateKomoditas = async (id, data) => {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error updating komoditas:', error);
    throw error;
  }
};

export const deleteKomoditas = async (id) => {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting komoditas:', error);
    throw error;
  }
};
