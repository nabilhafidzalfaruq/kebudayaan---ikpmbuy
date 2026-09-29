import { useState, useEffect } from 'react';
import { collection, doc, query, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

/**
 * Generic hook to subscribe to a Firestore collection with real-time updates
 * @param {string} collectionName - Firestore collection name
 * @param {Array} [constraints=[]] - Query constraints (where, orderBy, limit, etc.)
 * @param {Array} [deps=[]] - Optional dependencies to re-run the query
 * @returns {{ data: Array<Object>, loading: boolean, error: Error | null }}
 */
export const useCollection = (collectionName, constraints = [], deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Firebase is not configured or parameters are missing, return early
    if (!isFirebaseConfigured || !db || !collectionName) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const colRef = collection(db, collectionName);
      const activeConstraints = Array.isArray(constraints) ? constraints : [];
      const q = activeConstraints.length > 0
        ? query(colRef, ...activeConstraints)
        : colRef;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`useCollection snapshot error on '${collectionName}':`, err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`useCollection initialization error on '${collectionName}':`, err);
      setError(err);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, ...deps]);

  return { data, loading, error };
};

/**
 * Generic hook to subscribe to a single Firestore document in real-time
 * @param {string} collectionName - Firestore collection name
 * @param {string} docId - Document ID to fetch
 * @returns {{ data: Object | null, loading: boolean, error: Error | null }}
 */
export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Firebase is not configured or IDs are missing, return early
    if (!isFirebaseConfigured || !db || !collectionName || !docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, docId);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() });
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          console.error(`useDocument snapshot error on '${collectionName}/${docId}':`, err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`useDocument initialization error on '${collectionName}/${docId}':`, err);
      setError(err);
      setLoading(false);
    }
  }, [collectionName, docId]);

  return { data, loading, error };
};

export default {
  useCollection,
  useDocument
};
