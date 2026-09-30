import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, TrendingUp, ArrowRight, Sprout, Fish, TreePalm, X } from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { getPlaceholderImage } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const kategoriIcons = {
  'Perkebunan': TreePalm,
  'Pertanian': Sprout,
  'Perikanan': Fish,
};

const KATEGORI_LIST = ['Semua', 'Perkebunan', 'Pertanian', 'Perikanan'];

export default function SemuaKomoditas() {
  const { komoditas = [], loading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  const filtered = useMemo(() => {
    return komoditas.filter(item => {
      const matchSearch = !searchQuery ||
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchKategori = selectedKategori === 'Semua' || item.kategori === selectedKategori;
      return matchSearch && matchKategori;
    });
  }, [komoditas, searchQuery, selectedKategori]);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getPlaceholderImage(1920, 600, 'Komoditas Bengkulu Utara')})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-800/70 via-primary-900/60 to-dark-800/80" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-accent-400 text-sm font-semibold tracking-widest uppercase mb-3">
              <TrendingUp className="w-4 h-4" /> Potensi Daerah
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
              Komoditas Bengkulu Utara
            </h1>
            <p className="text-cream-200 text-lg max-w-xl mx-auto">
              Jelajahi komoditas unggulan yang menjadi kekuatan ekonomi Bumi Sungkai
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-cream-50 dark:bg-dark-800 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="mb-10 space-y-4">
            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari komoditas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Kategori filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {KATEGORI_LIST.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedKategori === kat
                      ? 'bg-primary-700 text-white shadow-md'
                      : 'bg-white dark:bg-dark-700 text-gray-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-dark-600 border border-cream-300 dark:border-dark-600'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-center text-sm text-gray-500 dark:text-cream-400">
              Menampilkan {filtered.length} komoditas
            </p>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Sprout className="w-16 h-16 mx-auto text-gray-300 dark:text-dark-600 mb-4" />
              <h3 className="text-xl font-heading font-semibold text-gray-500 dark:text-cream-400 mb-2">
                Komoditas tidak ditemukan
              </h3>
              <p className="text-gray-400 dark:text-cream-500 mb-4">Coba ubah kata kunci pencarian atau filter</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedKategori('Semua'); }}
                className="text-primary-600 dark:text-accent-400 font-medium hover:underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((item, index) => {
                const IconComponent = kategoriIcons[item.kategori] || Sprout;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/komoditas/${item.slug}`} className="block group">
                      <div className="bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={item.gambar || getPlaceholderImage(600, 400, item.nama)}
                            alt={item.nama}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => { e.target.src = getPlaceholderImage(600, 400, item.nama); }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-dark-700/90 text-primary-700 dark:text-accent-400 backdrop-blur-sm">
                            <IconComponent className="w-3.5 h-3.5" />
                            {item.kategori}
                          </span>
                          {item.unggulan && (
                            <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold bg-accent-400 text-white">
                              Unggulan
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-cream-100 mb-2 group-hover:text-primary-600 transition-colors">
                            {item.nama}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-cream-400 line-clamp-2 mb-4">{item.deskripsi}</p>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-cream-100 dark:bg-dark-600 rounded-lg p-2.5 text-center">
                              <p className="text-xs text-gray-500 dark:text-cream-400">Produksi/Tahun</p>
                              <p className="text-sm font-semibold text-primary-700 dark:text-accent-400 mt-0.5">{item.produksiPerTahun}</p>
                            </div>
                            <div className="bg-cream-100 dark:bg-dark-600 rounded-lg p-2.5 text-center">
                              <p className="text-xs text-gray-500 dark:text-cream-400">Luas Lahan</p>
                              <p className="text-sm font-semibold text-primary-700 dark:text-accent-400 mt-0.5">{item.luasLahan}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-cream-400">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{Array.isArray(item.kecamatan) ? item.kecamatan.join(', ') : item.kecamatan}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary-600 dark:text-accent-400 group-hover:gap-2 transition-all">
                            Selengkapnya <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
