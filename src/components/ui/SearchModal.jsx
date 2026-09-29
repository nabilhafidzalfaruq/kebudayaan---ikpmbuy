import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Sparkles, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

/**
 * Full-screen Search Modal for cultural heritage catalog
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Array<Object>} [props.budayaData=[]] - Full cultural catalog data
 * @param {Array<Object|string>} [props.kategoriData=[]] - List of categories
 * @param {Array<Object|string>} [props.kecamatanData=[]] - List of kecamatan
 */
export default function SearchModal({
  isOpen,
  onClose,
  budayaData = [],
  kategoriData = [],
  kecamatanData = []
}) {
  const [query, setQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const inputRef = useRef(null);

  // Extract category names cleanly from array of objects or strings
  const categories = useMemo(() => {
    if (kategoriData && kategoriData.length > 0) {
      const names = kategoriData.map((k) => (typeof k === 'object' ? k.nama : k));
      return ['Semua', ...Array.from(new Set(names))];
    }
    // Fallback extract from budayaData
    const extracted = Array.from(
      new Set(budayaData.map((item) => item.kategori).filter(Boolean))
    );
    return ['Semua', ...extracted];
  }, [kategoriData, budayaData]);

  // Extract kecamatan names cleanly from array of objects or strings
  const kecamatans = useMemo(() => {
    if (kecamatanData && kecamatanData.length > 0) {
      const names = kecamatanData.map((k) => (typeof k === 'object' ? k.nama : k));
      return ['Semua', ...Array.from(new Set(names))];
    }
    // Fallback extract from budayaData
    const extracted = Array.from(
      new Set(budayaData.map((item) => item.kecamatan).filter(Boolean))
    );
    return ['Semua', ...extracted];
  }, [kecamatanData, budayaData]);

  // Auto-focus input and prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small timeout to allow framer-motion render
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset filters
  const handleResetFilters = () => {
    setQuery('');
    setSelectedKategori('Semua');
    setSelectedKecamatan('Semua');
    inputRef.current?.focus();
  };

  // Real-time filtering
  const filteredResults = useMemo(() => {
    if (!Array.isArray(budayaData)) return [];

    const normalizedQuery = query.toLowerCase().trim();

    return budayaData.filter((item) => {
      if (!item) return false;

      // Filter by category
      if (selectedKategori !== 'Semua') {
        const itemKat = (item.kategori || '').toLowerCase();
        if (itemKat !== selectedKategori.toLowerCase()) return false;
      }

      // Filter by kecamatan
      if (selectedKecamatan !== 'Semua') {
        const itemKec = (item.kecamatan || '').toLowerCase();
        if (itemKec !== selectedKecamatan.toLowerCase()) return false;
      }

      // Filter by search query
      if (normalizedQuery) {
        const nama = (item.nama || '').toLowerCase();
        const deskripsi = (item.deskripsi || '').toLowerCase();
        const ringkasan = (item.ringkasan || '').toLowerCase();
        const tags = Array.isArray(item.tags)
          ? item.tags.map((t) => String(t).toLowerCase())
          : [];

        const matches =
          nama.includes(normalizedQuery) ||
          deskripsi.includes(normalizedQuery) ||
          ringkasan.includes(normalizedQuery) ||
          tags.some((t) => t.includes(normalizedQuery));

        if (!matches) return false;
      }

      return true;
    });
  }, [budayaData, query, selectedKategori, selectedKecamatan]);

  const isFiltered =
    Boolean(query.trim()) ||
    selectedKategori !== 'Semua' ||
    selectedKecamatan !== 'Semua';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian Budaya Bengkulu Utara"
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
        >
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl my-auto bg-cream-50 dark:bg-dark-800 rounded-2xl shadow-2xl border border-cream-200 dark:border-dark-700 flex flex-col max-h-[85vh] overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Search Input */}
            <div className="flex items-center px-4 sm:px-6 py-4 border-b border-cream-200 dark:border-dark-700 bg-cream-100/50 dark:bg-dark-900/40">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kebudayaan, tari, tradisi, rumah adat, kuliner..."
                className="w-full text-base sm:text-lg bg-transparent border-none text-dark-900 dark:text-cream-50 placeholder:text-dark-400 dark:placeholder:text-dark-400 focus:outline-none focus:ring-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-dark-400 hover:text-dark-700 dark:hover:text-cream-200 mr-2 transition-colors"
                  aria-label="Hapus kata kunci pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-dark-500 hover:text-dark-800 dark:text-dark-300 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
                aria-label="Tutup pencarian (Escape)"
              >
                <span className="hidden sm:inline-block text-xs font-medium mr-1.5 text-dark-400 dark:text-dark-400">
                  ESC
                </span>
                <X className="w-5 h-5 inline-block" />
              </button>
            </div>

            {/* Filter Chips Section */}
            <div className="px-4 sm:px-6 py-3 border-b border-cream-200 dark:border-dark-700 bg-cream-50 dark:bg-dark-800 space-y-2.5">
              {/* Kategori Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-dark-400 dark:text-dark-400 shrink-0 font-medium">
                  Kategori:
                </span>
                {categories.map((kat) => {
                  const isActive = selectedKategori === kat;
                  return (
                    <button
                      key={kat}
                      type="button"
                      onClick={() => setSelectedKategori(kat)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-cream-200 text-dark-700 hover:bg-cream-300 dark:bg-dark-700 dark:text-cream-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      {kat}
                    </button>
                  );
                })}
              </div>

              {/* Kecamatan Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-dark-400 dark:text-dark-400 shrink-0 font-medium">
                  Kecamatan:
                </span>
                {kecamatans.map((kec) => {
                  const isActive = selectedKecamatan === kec;
                  return (
                    <button
                      key={kec}
                      type="button"
                      onClick={() => setSelectedKecamatan(kec)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-cream-200 text-dark-700 hover:bg-cream-300 dark:bg-dark-700 dark:text-cream-200 dark:hover:bg-dark-600'
                      }`}
                    >
                      {kec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Status Bar */}
            <div className="px-4 sm:px-6 py-2 bg-cream-100/70 dark:bg-dark-900/60 border-b border-cream-200 dark:border-dark-700 flex items-center justify-between text-xs text-dark-500 dark:text-dark-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                {isFiltered
                  ? `Ditemukan ${filteredResults.length} hasil kebudayaan`
                  : `Menampilkan semua ${filteredResults.length} kebudayaan`}
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>

            {/* Results List / Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[220px]">
              {filteredResults.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-12 text-center text-dark-500 dark:text-dark-400 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-cream-200 dark:bg-dark-700 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-1">
                    <Search className="w-7 h-7" />
                  </div>
                  <h4 className="font-heading font-semibold text-lg text-dark-800 dark:text-cream-100">
                    Tidak ada hasil
                  </h4>
                  <p className="text-sm max-w-md text-dark-500 dark:text-dark-300">
                    Tidak ditemukan kebudayaan yang cocok dengan kata kunci atau filter yang Anda pilih. Silakan coba kata kunci lain.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Pencarian & Filter
                  </button>
                </div>
              ) : (
                /* Grid of results */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.map((item) => {
                    const fallbackImg = `https://placehold.co/400x260/A0522D/FDF8F0?text=${encodeURIComponent(
                      item.nama || 'Budaya'
                    )}&font=playfair-display`;

                    return (
                      <Link
                        key={item.id || item.slug}
                        to={`/budaya/${item.slug || item.id}`}
                        onClick={onClose}
                        className="group flex flex-col bg-white dark:bg-dark-700/60 rounded-xl overflow-hidden border border-cream-200 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-cream-200 dark:bg-dark-600">
                          <img
                            src={item.gambar || fallbackImg}
                            alt={item.nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImg;
                            }}
                          />
                          {item.kategori && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="kategori">{item.kategori}</Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-3.5 flex flex-col flex-1">
                          {item.kecamatan && (
                            <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{item.kecamatan}</span>
                            </div>
                          )}
                          <h4 className="font-heading font-semibold text-base text-dark-800 dark:text-cream-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 mb-1">
                            {item.nama}
                          </h4>
                          {item.deskripsi && (
                            <p className="text-xs text-dark-500 dark:text-dark-300 line-clamp-2 leading-relaxed">
                              {item.deskripsi}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
