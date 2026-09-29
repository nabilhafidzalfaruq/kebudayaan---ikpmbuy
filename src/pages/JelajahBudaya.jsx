import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Compass
} from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { useSearch } from '../hooks/useSearch';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

/**
 * JelajahBudaya Page
 * Culture catalog with advanced filtering, full-text search, district selection, and sorting.
 */
export default function JelajahBudaya() {
  const { budaya, kategori, kecamatan, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize search hook with budaya list
  const {
    results,
    searchQuery,
    setSearchQuery,
    selectedKategori,
    setSelectedKategori,
    selectedKecamatan,
    setSelectedKecamatan,
    resetFilters,
    totalResults,
    isFiltered
  } = useSearch(budaya);

  // Sorting state: 'az' (A-Z) or 'za' (Z-A)
  const [sortBy, setSortBy] = useState('az');

  // Sync URL search parameters on mount or URL changes
  useEffect(() => {
    const urlKat = searchParams.get('kategori');
    const urlKec = searchParams.get('kecamatan');
    const urlQ = searchParams.get('q');

    if (urlKat) {
      setSelectedKategori(urlKat);
    }
    if (urlKec) {
      setSelectedKecamatan(urlKec);
    }
    if (urlQ) {
      setSearchQuery(urlQ);
    }
  }, [searchParams, setSelectedKategori, setSelectedKecamatan, setSearchQuery]);

  // Handle manual category chip clicks
  const handleCategoryClick = (katName) => {
    if (selectedKategori.toLowerCase() === katName.toLowerCase()) {
      setSelectedKategori('');
      // update URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('kategori');
      setSearchParams(newParams);
    } else {
      setSelectedKategori(katName);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('kategori', katName);
      setSearchParams(newParams);
    }
  };

  // Handle kecamatan dropdown change
  const handleKecamatanChange = (e) => {
    const val = e.target.value;
    setSelectedKecamatan(val);
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'Semua') {
      newParams.set('kecamatan', val);
    } else {
      newParams.delete('kecamatan');
    }
    setSearchParams(newParams);
  };

  // Reset all filters including URL params
  const handleReset = () => {
    resetFilters();
    setSearchParams({});
  };

  // Apply sorting to search results
  const sortedResults = useMemo(() => {
    const list = [...results];
    if (sortBy === 'az') {
      list.sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'));
    } else if (sortBy === 'za') {
      list.sort((a, b) => (b.nama || '').localeCompare(a.nama || '', 'id'));
    }
    return list;
  }, [results, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Menyiapkan data budaya Bengkulu Utara..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      {/* 1. Hero Banner (~40vh) */}
      <section className="relative h-[38vh] min-h-[280px] max-h-[380px] flex items-center justify-center overflow-hidden bg-dark-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-pattern opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-dark-900/80 to-primary-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/20 border border-accent-400/40 text-accent-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5 text-accent-400" />
              <span>Katalog Warisan Nusantara</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-cream-50 leading-tight mb-3">
              Jelajah Budaya Bengkulu Utara
            </h1>

            <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed">
              Telusuri khazanah kearifan lokal, seni tradisi, adat istiadat sakral, dan pusaka leluhur dari 19 kecamatan se-Kabupaten Bengkulu Utara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Exploration Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar */}
        <div className="-mt-16 relative z-20 mb-8 max-w-3xl mx-auto">
          <div className="relative flex items-center bg-cream-50 dark:bg-dark-800 rounded-2xl shadow-xl border border-cream-200 dark:border-dark-700 overflow-hidden focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <div className="pl-5 pr-2 text-primary-600 dark:text-primary-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari budaya, tarian, adat istiadat, alat musik, atau kata kunci..."
              className="w-full py-4 pr-10 bg-transparent text-sm sm:text-base text-dark-800 dark:text-cream-100 placeholder-dark-400 dark:placeholder-dark-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus kata kunci pencarian"
                className="p-2 mr-2 text-dark-400 hover:text-dark-600 dark:hover:text-cream-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Row: Kategori Chips + Kecamatan Dropdown + Sort Dropdown */}
        <div className="space-y-4 mb-8">
          {/* Category Chips Horizontal Scrollable Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedKategori('')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium shrink-0 transition-all cursor-pointer ${
                !selectedKategori
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-cream-200/80 dark:bg-dark-800 text-dark-700 dark:text-cream-200 hover:bg-cream-300 dark:hover:bg-dark-700'
              }`}
            >
              Semua Kategori
            </button>

            {kategori?.map((kat) => {
              const isSelected =
                selectedKategori.toLowerCase() === kat.nama.toLowerCase();
              return (
                <button
                  key={kat.id || kat.nama}
                  type="button"
                  onClick={() => handleCategoryClick(kat.nama)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-700 text-white shadow-sm font-semibold'
                      : 'bg-cream-200/80 dark:bg-dark-800 text-dark-700 dark:text-cream-200 hover:bg-cream-300 dark:hover:bg-dark-700'
                  }`}
                >
                  {kat.nama}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter & Sort Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-cream-200 dark:border-dark-800">
            {/* Results Count Info */}
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-dark-800 dark:text-cream-100 text-base sm:text-lg">
                Menampilkan {sortedResults.length} budaya
              </span>
              {isFiltered && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-primary-700 dark:text-primary-400 hover:underline cursor-pointer ml-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>

            {/* Dropdowns: Kecamatan & Sort */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Kecamatan Dropdown */}
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 absolute left-3 pointer-events-none" />
                <select
                  value={selectedKecamatan}
                  onChange={handleKecamatanChange}
                  className="pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-cream-50 dark:bg-dark-800 border border-cream-200 dark:border-dark-700 text-dark-700 dark:text-cream-200 focus:outline-none focus:ring-1 focus:ring-primary-600 cursor-pointer"
                  aria-label="Filter berdasarkan Kecamatan"
                >
                  <option value="">Semua Kecamatan</option>
                  {kecamatan?.map((kec) => (
                    <option key={kec.id || kec.nama} value={kec.nama}>
                      {kec.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex items-center">
                <ArrowUpDown className="w-4 h-4 text-primary-600 dark:text-primary-400 absolute left-3 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-cream-50 dark:bg-dark-800 border border-cream-200 dark:border-dark-700 text-dark-700 dark:text-cream-200 focus:outline-none focus:ring-1 focus:ring-primary-600 cursor-pointer"
                  aria-label="Urutkan budaya"
                >
                  <option value="az">Urutkan: A - Z</option>
                  <option value="za">Urutkan: Z - A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Culture Grid (3 cols desktop, 2 tablet, 1 mobile) */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedResults.map((item) => (
              <Card
                key={item.id || item.slug}
                variant="culture"
                to={`/budaya/${item.slug}`}
                image={item.gambar}
                title={item.nama}
                subtitle={item.kecamatan}
                badge={item.kategori}
                description={item.ringkasan || item.deskripsi}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-cream-50 dark:bg-dark-800/80 rounded-2xl border border-cream-200 dark:border-dark-700 p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-cream-200 dark:bg-dark-700 flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-accent-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-dark-800 dark:text-cream-100 mb-2">
              Tidak ada budaya yang ditemukan
            </h3>
            <p className="text-dark-500 dark:text-dark-300 text-sm mb-6 leading-relaxed">
              Coba sesuaikan kata kunci pencarian Anda atau hapus filter kategori dan kecamatan untuk melihat seluruh koleksi budaya.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Semua Filter</span>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
