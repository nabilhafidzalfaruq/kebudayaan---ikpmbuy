import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { isFirebaseConfigured } from '../firebase/config';
import { getAllBudaya } from '../firebase/services/budayaService';
import { getAllKategori } from '../firebase/services/kategoriService';
import { getAllBerita } from '../firebase/services/beritaService';
import { getAllEvents } from '../firebase/services/eventService';
import { getAllKuliner } from '../firebase/services/kulinerService';
import { getAllKecamatan } from '../firebase/services/kecamatanService';
import { getAllKomoditas } from '../firebase/services/komoditasService';

// Eagerly import all JSON data files from src/data/*.json if available
const localJsonFiles = import.meta.glob('../data/*.json', { eager: true });

/**
 * Safely retrieve local JSON array for a given collection name
 * @param {string} name 
 * @returns {Array<Object>}
 */
const getLocalCollection = (name) => {
  const matchKey = Object.keys(localJsonFiles).find(
    (key) => key.endsWith(`/${name}.json`) || key.endsWith(`\\${name}.json`)
  );
  if (matchKey && localJsonFiles[matchKey]) {
    const mod = localJsonFiles[matchKey];
    const data = mod.default || mod;
    return Array.isArray(data) ? data : [];
  }
  return [];
};

/**
 * Firebase / Data Context for Bengkulu Utara Culture Website
 */
export const FirebaseContext = createContext({
  budaya: [],
  kategori: [],
  berita: [],
  events: [],
  kuliner: [],
  kecamatan: [],
  komoditas: [],
  loading: true,
  loadingBudaya: true,
  loadingKategori: true,
  loadingBerita: true,
  loadingEvents: true,
  loadingKuliner: true,
  loadingKecamatan: true,
  loadingKomoditas: true,
  error: null,
  isConfigured: false,
  dataSource: 'local', // 'firebase' | 'local'
  getBudayaBySlug: () => null,
  getBudayaById: () => null,
  getBudayaByKecamatan: () => [],
  getBudayaByKategori: () => [],
  getBudayaPopuler: () => [],
  filterBudaya: () => [],
  getBeritaBySlug: () => null,
  getFeaturedBerita: () => [],
  getEventBySlug: () => null,
  getUpcomingEvents: () => [],
  refreshData: async () => {}
});

/**
 * FirebaseProvider wraps components that consume website cultural data
 * Automatically switches between Firestore and local JSON files
 */
export const FirebaseProvider = ({ children }) => {
  const [budaya, setBudaya] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [berita, setBerita] = useState([]);
  const [events, setEvents] = useState([]);
  const [kuliner, setKuliner] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [komoditas, setKomoditas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingBudaya, setLoadingBudaya] = useState(true);
  const [loadingKategori, setLoadingKategori] = useState(true);
  const [loadingBerita, setLoadingBerita] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingKuliner, setLoadingKuliner] = useState(true);
  const [loadingKecamatan, setLoadingKecamatan] = useState(true);
  const [loadingKomoditas, setLoadingKomoditas] = useState(true);

  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(isFirebaseConfigured ? 'firebase' : 'local');

  /**
   * Helper to load all data from local JSON seed
   */
  const loadLocalData = useCallback(() => {
    const localBudaya = getLocalCollection('budaya');
    const localKategori = getLocalCollection('kategori');
    const localBerita = getLocalCollection('berita');
    const localEvents = getLocalCollection('events');
    const localKuliner = getLocalCollection('kuliner');
    const localKecamatan = getLocalCollection('kecamatan');
    const localKomoditas = getLocalCollection('komoditas');

    setBudaya(localBudaya);
    setKategori(localKategori);
    setBerita(localBerita);
    setEvents(localEvents);
    setKuliner(localKuliner);
    setKecamatan(localKecamatan);
    setKomoditas(localKomoditas);

    setLoadingBudaya(false);
    setLoadingKategori(false);
    setLoadingBerita(false);
    setLoadingEvents(false);
    setLoadingKuliner(false);
    setLoadingKecamatan(false);
    setLoadingKomoditas(false);
    setLoading(false);
    setDataSource('local');
  }, []);

  /**
   * Fetch all data from either Firestore (if configured) or local JSON
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured) {
      loadLocalData();
      return;
    }

    try {
      setDataSource('firebase');

      // Fetch all collections in parallel with Promise.allSettled
      const [
        budayaRes,
        kategoriRes,
        beritaRes,
        eventsRes,
        kulinerRes,
        kecamatanRes,
        komoditasRes
      ] = await Promise.allSettled([
        getAllBudaya(),
        getAllKategori(),
        getAllBerita(),
        getAllEvents(),
        getAllKuliner(),
        getAllKecamatan(),
        getAllKomoditas()
      ]);

      // Fallback helpers
      const localBudaya = getLocalCollection('budaya');
      const localKategori = getLocalCollection('kategori');
      const localBerita = getLocalCollection('berita');
      const localEvents = getLocalCollection('events');
      const localKuliner = getLocalCollection('kuliner');
      const localKecamatan = getLocalCollection('kecamatan');
      const localKomoditas = getLocalCollection('komoditas');

      // Budaya
      if (budayaRes.status === 'fulfilled' && Array.isArray(budayaRes.value) && budayaRes.value.length > 0) {
        setBudaya(budayaRes.value);
      } else {
        setBudaya(localBudaya);
      }
      setLoadingBudaya(false);

      // Kategori
      if (kategoriRes.status === 'fulfilled' && Array.isArray(kategoriRes.value) && kategoriRes.value.length > 0) {
        setKategori(kategoriRes.value);
      } else {
        setKategori(localKategori);
      }
      setLoadingKategori(false);

      // Berita
      if (beritaRes.status === 'fulfilled' && Array.isArray(beritaRes.value) && beritaRes.value.length > 0) {
        setBerita(beritaRes.value);
      } else {
        setBerita(localBerita);
      }
      setLoadingBerita(false);

      // Events
      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value) && eventsRes.value.length > 0) {
        setEvents(eventsRes.value);
      } else {
        setEvents(localEvents);
      }
      setLoadingEvents(false);

      // Kuliner
      if (kulinerRes.status === 'fulfilled' && Array.isArray(kulinerRes.value) && kulinerRes.value.length > 0) {
        setKuliner(kulinerRes.value);
      } else {
        setKuliner(localKuliner);
      }
      setLoadingKuliner(false);

      // Kecamatan
      if (kecamatanRes.status === 'fulfilled' && Array.isArray(kecamatanRes.value) && kecamatanRes.value.length > 0) {
        setKecamatan(kecamatanRes.value);
      } else {
        setKecamatan(localKecamatan);
      }
      setLoadingKecamatan(false);

      // Komoditas
      if (komoditasRes.status === 'fulfilled' && Array.isArray(komoditasRes.value) && komoditasRes.value.length > 0) {
        setKomoditas(komoditasRes.value);
      } else {
        setKomoditas(localKomoditas);
      }
      setLoadingKomoditas(false);

    } catch (err) {
      console.warn('Gagal memuat data dari Firestore, beralih ke data lokal JSON:', err);
      setError(err);
      loadLocalData();
    } finally {
      setLoading(false);
    }
  }, [loadLocalData]);

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper functions
  const getBudayaBySlug = useCallback((slug) => {
    if (!slug) return null;
    return budaya.find((item) => item.slug === slug) || null;
  }, [budaya]);

  const getBudayaById = useCallback((id) => {
    if (!id) return null;
    const strId = String(id);
    return budaya.find((item) => String(item.id) === strId) || null;
  }, [budaya]);

  const getBudayaByKecamatan = useCallback((kec) => {
    if (!kec || kec === 'Semua' || kec.toLowerCase() === 'semua') return budaya;
    const target = kec.toLowerCase().trim();
    return budaya.filter((item) => (item.kecamatan || '').toLowerCase().trim() === target);
  }, [budaya]);

  const getBudayaByKategori = useCallback((kat) => {
    if (!kat || kat === 'Semua' || kat.toLowerCase() === 'semua') return budaya;
    const target = kat.toLowerCase().trim();
    return budaya.filter((item) => (item.kategori || '').toLowerCase().trim() === target);
  }, [budaya]);

  const getBudayaPopuler = useCallback(() => {
    return budaya.filter((item) => Boolean(item.populer));
  }, [budaya]);

  const filterBudaya = useCallback(({ searchQuery = '', kategori = '', kecamatan = '' } = {}) => {
    return budaya.filter((item) => {
      // Filter kategori
      if (kategori && kategori !== 'Semua' && kategori.toLowerCase() !== 'semua') {
        if ((item.kategori || '').toLowerCase().trim() !== kategori.toLowerCase().trim()) {
          return false;
        }
      }

      // Filter kecamatan
      if (kecamatan && kecamatan !== 'Semua' && kecamatan.toLowerCase() !== 'semua') {
        if ((item.kecamatan || '').toLowerCase().trim() !== kecamatan.toLowerCase().trim()) {
          return false;
        }
      }

      // Text search query
      if (searchQuery && searchQuery.trim()) {
        const queryTerm = searchQuery.toLowerCase().trim();
        const nama = (item.nama || '').toLowerCase();
        const deskripsi = (item.deskripsi || '').toLowerCase();
        const ringkasan = (item.ringkasan || '').toLowerCase();
        const matchesName = nama.includes(queryTerm);
        const matchesDesc = deskripsi.includes(queryTerm);
        const matchesSummary = ringkasan.includes(queryTerm);
        const matchesTags = Array.isArray(item.tags)
          ? item.tags.some((t) => (t || '').toLowerCase().includes(queryTerm))
          : false;

        if (!matchesName && !matchesDesc && !matchesSummary && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [budaya]);

  const getBeritaBySlug = useCallback((slug) => {
    if (!slug) return null;
    return berita.find((item) => item.slug === slug) || null;
  }, [berita]);

  const getFeaturedBerita = useCallback(() => {
    return berita.filter((item) => Boolean(item.featured));
  }, [berita]);

  const getEventBySlug = useCallback((slug) => {
    if (!slug) return null;
    return events.find((item) => item.slug === slug) || null;
  }, [events]);

  const getUpcomingEvents = useCallback(() => {
    return events.filter((item) => item.status === 'upcoming' || item.status === 'ongoing');
  }, [events]);

  const value = {
    budaya,
    kategori,
    berita,
    events,
    kuliner,
    kecamatan,
    komoditas,
    loading,
    loadingBudaya,
    loadingKategori,
    loadingBerita,
    loadingEvents,
    loadingKuliner,
    loadingKecamatan,
    loadingKomoditas,
    error,
    isConfigured: isFirebaseConfigured,
    dataSource,
    getBudayaBySlug,
    getBudayaById,
    getBudayaByKecamatan,
    getBudayaByKategori,
    getBudayaPopuler,
    filterBudaya,
    getBeritaBySlug,
    getFeaturedBerita,
    getEventBySlug,
    getUpcomingEvents,
    refreshData: fetchData
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Custom hook to consume FirebaseContext
 */
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useData = useFirebase;

export default FirebaseContext;
