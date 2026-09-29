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

const COLLECTION_NAME = 'events';

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
 * Get all published events ordered by start date ascending
 * @returns {Promise<Array<Object>>}
 */
export const getAllEvents = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('published', '==', true),
        orderBy('tanggalMulai', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (indexError) {
      console.warn('Fallback: getting events without composite index', indexError);
      const q = query(collection(db, COLLECTION_NAME), where('published', '==', true));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => getTimeValue(a.tanggalMulai) - getTimeValue(b.tanggalMulai));
    }
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    throw error;
  }
};

/**
 * Get all events including drafts for admin
 * @returns {Promise<Array<Object>>}
 */
export const getAllEventsAdmin = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('tanggalMulai', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (err) {
      console.warn('Fallback: getting all events admin with manual sort', err);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => getTimeValue(b.tanggalMulai || b.createdAt) - getTimeValue(a.tanggalMulai || a.createdAt));
    }
  } catch (error) {
    console.error('Error in getAllEventsAdmin:', error);
    throw error;
  }
};

/**
 * Get a single event by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getEventById = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error(`Error in getEventById (${id}):`, error);
    throw error;
  }
};

/**
 * Get a single event by slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export const getEventBySlug = async (slug) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docItem = snapshot.docs[0];
    return { id: docItem.id, ...docItem.data() };
  } catch (error) {
    console.error(`Error in getEventBySlug (${slug}):`, error);
    throw error;
  }
};

/**
 * Get upcoming events (status == 'upcoming' and published == true)
 * @returns {Promise<Array<Object>>}
 */
export const getUpcomingEvents = async () => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'upcoming'),
        where('published', '==', true)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      return items.sort((a, b) => getTimeValue(a.tanggalMulai) - getTimeValue(b.tanggalMulai));
    } catch (err) {
      console.warn('Fallback: getUpcomingEvents fallback query', err);
      const allEvents = await getAllEvents();
      return allEvents.filter(item => item.status === 'upcoming');
    }
  } catch (error) {
    console.error('Error in getUpcomingEvents:', error);
    throw error;
  }
};

/**
 * Get events filtered by month (bulan)
 * @param {string|number} bulan - Month identifier or name
 * @returns {Promise<Array<Object>>}
 */
export const getEventsByBulan = async (bulan) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(
      collection(db, COLLECTION_NAME),
      where('bulan', '==', bulan),
      where('published', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    return items.sort((a, b) => getTimeValue(a.tanggalMulai) - getTimeValue(b.tanggalMulai));
  } catch (error) {
    console.error(`Error in getEventsByBulan (${bulan}):`, error);
    throw error;
  }
};

/**
 * Get events filtered by kecamatan
 * @param {string} kecamatan
 * @returns {Promise<Array<Object>>}
 */
export const getEventsByKecamatan = async (kecamatan) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const q = query(
      collection(db, COLLECTION_NAME),
      where('kecamatan', '==', kecamatan),
      where('published', '==', true)
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    return items.sort((a, b) => getTimeValue(a.tanggalMulai) - getTimeValue(b.tanggalMulai));
  } catch (error) {
    console.error(`Error in getEventsByKecamatan (${kecamatan}):`, error);
    throw error;
  }
};

/**
 * Add a new event document
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const addEvent = async (data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docData = {
      ...data,
      published: data.published !== undefined ? data.published : true,
      status: data.status || 'upcoming',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error in addEvent:', error);
    throw error;
  }
};

/**
 * Update an existing event document
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateEvent = async (id, data) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error(`Error in updateEvent (${id}):`, error);
    throw error;
  }
};

/**
 * Delete an event document
 * @param {string} id
 * @returns {Promise<string>}
 */
export const deleteEvent = async (id) => {
  try {
    if (!db) throw new Error('Firestore belum dikonfigurasi.');
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error in deleteEvent (${id}):`, error);
    throw error;
  }
};

/**
 * Toggle published status of an event
 * @param {string} id
 * @param {boolean} currentStatus
 * @returns {Promise<boolean>}
 */
export const togglePublishEvent = async (id, currentStatus) => {
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
    console.error(`Error in togglePublishEvent (${id}):`, error);
    throw error;
  }
};
