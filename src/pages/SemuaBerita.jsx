import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  BookOpen
} from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { formatDate, getPlaceholderImage } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ITEMS_PER_PAGE = 6;

/**
 * SemuaBerita Page
 * Editorial news & cultural article directory with search, category filtering,
 * 2-column horizontal card layout, and pagination.
 */
export default function SemuaBerita() {
  const { berita, kategori, loading } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKategori]);

  // Filter berita list based on search and category
  const filteredBerita = useMemo(() => {
    if (!Array.isArray(berita)) return [];

    return berita.filter((item) => {
      if (!item) return false;

      // Filter by Kategori
      if (selectedKategori && selectedKategori !== 'Semua') {
        const itemKat = (item.kategori || '').toLowerCase().trim();
        const selKat = selectedKategori.toLowerCase().trim();
        if (itemKat !== selKat) return false;
      }

      // Filter by Search Query
      if (searchQuery && searchQuery.trim()) {
        const term = searchQuery.toLowerCase().trim();
        const judul = (item.judul || '').toLowerCase();
        const ringkasan = (item.ringkasan || '').toLowerCase();
        const penulis = (item.penulis || '').toLowerCase();

        if (
          !judul.includes(term) &&
          !ringkasan.includes(term) &&
          !penulis.includes(term)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [berita, searchQuery, selectedKategori]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE) || 1;
  const paginatedBerita = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBerita.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBerita, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const contentElement = document.getElementById('berita-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Memuat kabar budaya Bengkulu Utara..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      {/* 1. Small Hero Banner */}
      <section className="relative py-14 sm:py-20 bg-dark-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-primary-950 opacity-90" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/20 border border-accent-400/30 text-accent-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Newspaper className="w-3.5 h-3.5 text-accent-400" />
              <span>Warta & Narasi Kebudayaan</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-cream-50 leading-tight mb-3">
              Berita Budaya
            </h1>

            <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed">
              Jelajahi liputan mendalam, kabar festival, artikel sejarah, dan dokumentasi terkini peradaban Bengkulu Utara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Content & Filters */}
      <main id="berita-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96 flex items-center bg-cream-50 dark:bg-dark-800 rounded-xl border border-cream-200 dark:border-dark-700 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20">
            <div className="pl-3.5 pr-1.5 text-primary-600 dark:text-primary-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita atau topik..."
              className="w-full py-2.5 pr-8 bg-transparent text-sm text-dark-800 dark:text-cream-100 placeholder-dark-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 mr-2 text-dark-400 hover:text-dark-600 cursor-pointer"
                aria-label="Bersihkan pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Kategori Filter Tabs */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedKategori('')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                !selectedKategori
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-cream-200/80 dark:bg-dark-800 text-dark-700 dark:text-cream-200 hover:bg-cream-300'
              }`}
            >
              Semua Berita
            </button>
            {kategori?.map((kat) => (
              <button
                key={kat.id || kat.nama}
                type="button"
                onClick={() =>
                  setSelectedKategori(
                    selectedKategori === kat.nama ? '' : kat.nama
                  )
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedKategori === kat.nama
                    ? 'bg-primary-700 text-white shadow-sm font-semibold'
                    : 'bg-cream-200/80 dark:bg-dark-800 text-dark-700 dark:text-cream-200 hover:bg-cream-300 dark:hover:bg-dark-700'
                }`}
              >
                {kat.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mb-6">
          Menampilkan <span className="font-semibold text-dark-800 dark:text-cream-100">{filteredBerita.length}</span> artikel berita
        </div>

        {/* 3. News Grid: 2 Cols Desktop (Large Cards: image left, text right), 1 Col Mobile */}
        {paginatedBerita.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {paginatedBerita.map((item) => {
              const fallbackImg = getPlaceholderImage(600, 400, item.judul);
              const displayImg = item.gambar || fallbackImg;

              return (
                <Link
                  key={item.id || item.slug}
                  to={`/berita/${item.slug}`}
                  className="group flex flex-col sm:flex-row bg-cream-50 dark:bg-dark-800 rounded-2xl overflow-hidden border border-cream-200 dark:border-dark-700 shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {/* Image (Left on sm+, top on mobile) */}
                  <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-cream-200 dark:bg-dark-700 shrink-0">
                    <img
                      src={displayImg}
                      alt={item.judul}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="kategori">{item.kategori}</Badge>
                    </div>
                  </div>

                  {/* Content (Right on sm+, bottom on mobile) */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
                    <div>
                      {/* Meta: Tanggal & Penulis */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-dark-400 dark:text-dark-400 mb-2.5">
                        {item.tanggal && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                            <span>{formatDate(item.tanggal)}</span>
                          </div>
                        )}
                        {item.penulis && (
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                            <span className="truncate max-w-[120px]">{item.penulis}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="font-heading font-bold text-lg sm:text-xl text-dark-800 dark:text-cream-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2.5 leading-snug">
                        {item.judul}
                      </h2>

                      {/* Ringkasan */}
                      <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-300 line-clamp-3 leading-relaxed">
                        {item.ringkasan}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 mt-4 border-t border-cream-200/80 dark:border-dark-700/80 flex items-center justify-between text-xs font-semibold text-primary-700 dark:text-primary-400">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-cream-50 dark:bg-dark-800 rounded-2xl border border-cream-200 dark:border-dark-700 p-12 text-center max-w-md mx-auto my-8">
            <BookOpen className="w-12 h-12 text-dark-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-dark-800 dark:text-cream-100 mb-2">
              Tidak ada berita ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-300 mb-6">
              Tidak ada artikel yang cocok dengan kata kunci atau kategori yang Anda pilih.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedKategori('');
              }}
            >
              Reset Pencarian
            </Button>
          </div>
        )}

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-cream-200 dark:border-dark-800">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Button>

            <span className="text-xs sm:text-sm font-medium px-3 text-dark-600 dark:text-dark-300">
              Halaman {currentPage} dari {totalPages}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="gap-1.5"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
