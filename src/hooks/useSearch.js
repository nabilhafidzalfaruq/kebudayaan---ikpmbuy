import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for searching and filtering budaya items
 * Filters by text (nama, deskripsi, ringkasan, tags), kategori, and kecamatan
 * 
 * @param {Array<Object>} [budayaList=[]] - The full array of budaya items
 * @returns {{
 *   results: Array<Object>,
 *   searchQuery: string,
 *   setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
 *   selectedKategori: string,
 *   setSelectedKategori: React.Dispatch<React.SetStateAction<string>>,
 *   selectedKecamatan: string,
 *   setSelectedKecamatan: React.Dispatch<React.SetStateAction<string>>,
 *   resetFilters: () => void,
 *   totalResults: number,
 *   isFiltered: boolean
 * }}
 */
export const useSearch = (budayaList = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');

  const results = useMemo(() => {
    if (!Array.isArray(budayaList)) return [];

    return budayaList.filter((item) => {
      if (!item) return false;

      // Filter by Kategori
      if (
        selectedKategori &&
        selectedKategori !== 'Semua' &&
        selectedKategori !== 'all' &&
        selectedKategori.toLowerCase() !== 'semua'
      ) {
        const itemKat = (item.kategori || '').toLowerCase().trim();
        const selKat = selectedKategori.toLowerCase().trim();
        if (itemKat !== selKat) {
          return false;
        }
      }

      // Filter by Kecamatan
      if (
        selectedKecamatan &&
        selectedKecamatan !== 'Semua' &&
        selectedKecamatan !== 'all' &&
        selectedKecamatan.toLowerCase() !== 'semua'
      ) {
        const itemKec = (item.kecamatan || '').toLowerCase().trim();
        const selKec = selectedKecamatan.toLowerCase().trim();
        if (itemKec !== selKec) {
          return false;
        }
      }

      // Filter by Text Search (nama, deskripsi, ringkasan, tags)
      if (searchQuery && searchQuery.trim()) {
        const term = searchQuery.toLowerCase().trim();
        const nama = (item.nama || '').toLowerCase();
        const deskripsi = (item.deskripsi || '').toLowerCase();
        const ringkasan = (item.ringkasan || '').toLowerCase();
        const tags = Array.isArray(item.tags)
          ? item.tags.map((t) => String(t).toLowerCase())
          : [];

        const matchesNama = nama.includes(term);
        const matchesDeskripsi = deskripsi.includes(term);
        const matchesRingkasan = ringkasan.includes(term);
        const matchesTags = tags.some((t) => t.includes(term));

        if (!matchesNama && !matchesDeskripsi && !matchesRingkasan && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [budayaList, searchQuery, selectedKategori, selectedKecamatan]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedKategori('');
    setSelectedKecamatan('');
  }, []);

  const isFiltered = useMemo(() => {
    return Boolean(
      (searchQuery && searchQuery.trim().length > 0) ||
      (selectedKategori && selectedKategori !== 'Semua' && selectedKategori.toLowerCase() !== 'semua') ||
      (selectedKecamatan && selectedKecamatan !== 'Semua' && selectedKecamatan.toLowerCase() !== 'semua')
    );
  }, [searchQuery, selectedKategori, selectedKecamatan]);

  return {
    results,
    searchQuery,
    setSearchQuery,
    selectedKategori,
    setSelectedKategori,
    selectedKecamatan,
    setSelectedKecamatan,
    resetFilters,
    totalResults: results.length,
    isFiltered
  };
};

export default useSearch;
