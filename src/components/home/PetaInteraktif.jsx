import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Tag, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import { useData } from '../../context';
import { getPlaceholderImage } from '../../utils/helpers';
import defaultKecamatanData from '../../data/kecamatan.json';
import defaultBudayaData from '../../data/budaya.json';

export default function PetaInteraktif({ kecamatanData, budayaData }) {
  const contextData = useData ? useData() : null;
  const kecamatans = (kecamatanData && kecamatanData.length > 0)
    ? kecamatanData
    : (contextData?.kecamatan?.length ? contextData.kecamatan : defaultKecamatanData);

  const budayaList = (budayaData && budayaData.length > 0)
    ? budayaData
    : (contextData?.budaya?.length ? contextData.budaya : defaultBudayaData);

  // Default selection: Arga Makmur (id 1 or name 'Arga Makmur')
  const defaultSelection = kecamatans.find(k => k.nama.toLowerCase() === 'arga makmur') || kecamatans[0] || {};
  const [selectedKecamatanId, setSelectedKecamatanId] = useState(defaultSelection.id || '1');

  const selectedKecamatan = useMemo(() => {
    return kecamatans.find(k => k.id === selectedKecamatanId) || defaultSelection;
  }, [kecamatans, selectedKecamatanId, defaultSelection]);

  // Find matching budaya items for the selected kecamatan
  const matchingBudaya = useMemo(() => {
    if (!selectedKecamatan || !selectedKecamatan.nama) return [];
    const kecName = selectedKecamatan.nama.toLowerCase().trim();
    const highlights = Array.isArray(selectedKecamatan.budayaHighlight)
      ? selectedKecamatan.budayaHighlight
      : [];

    return budayaList.filter(item => {
      const itemKec = (item.kecamatan || '').toLowerCase().trim();
      const isDirectMatch = itemKec === kecName;
      const isHighlightMatch = highlights.includes(item.slug);
      return isDirectMatch || isHighlightMatch;
    });
  }, [budayaList, selectedKecamatan]);

  return (
    <section id="peta" className="py-20 bg-cream-100 dark:bg-dark-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-accent-500 uppercase">
            PETA INTERAKTIF
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-cream-100 mt-2">
            Jelajahi Berdasarkan Kecamatan
          </h2>
          <div className="h-1 w-20 bg-primary-600 dark:bg-accent-400 mx-auto mt-4 rounded-full" />
          <p className="text-dark-600 dark:text-cream-300 text-base sm:text-lg mt-4 leading-relaxed">
            Pilih salah satu dari 19 kecamatan di Kabupaten Bengkulu Utara untuk melihat ragam warisan budaya dan kearifan lokalnya.
          </p>
        </div>

        {/* 2-Column Interactive Map & Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Visual Map Grid (60% / 7 cols) */}
          <div className="lg:col-span-7 bg-cream-50 dark:bg-dark-900 rounded-3xl p-6 sm:p-8 shadow-lg border border-cream-200 dark:border-dark-700 relative overflow-hidden">
            {/* Ambient Map Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream-200 dark:border-dark-700">
              <div className="flex items-center gap-2 text-primary-700 dark:text-accent-400 font-semibold text-sm">
                <Navigation className="w-4 h-4 rotate-45" />
                <span>Tata Letak Wilayah Administratif</span>
              </div>
              <span className="text-xs font-mono text-dark-500 dark:text-cream-400 bg-cream-200 dark:bg-dark-800 px-2.5 py-1 rounded-full">
                19 Wilayah
              </span>
            </div>

            {/* Geographical Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {kecamatans.map((kec) => {
                const isSelected = kec.id === selectedKecamatanId;
                const isEnggano = kec.nama.toLowerCase() === 'enggano';

                return (
                  <button
                    key={kec.id || kec.nama}
                    type="button"
                    onClick={() => setSelectedKecamatanId(kec.id)}
                    className={`group relative p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primary-700 text-white border-accent-400 shadow-md ring-2 ring-accent-400/60 scale-[1.02]'
                        : 'bg-cream-100 dark:bg-dark-800 text-dark-800 dark:text-cream-200 border-cream-300 dark:border-dark-700 hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <span
                        className={`text-xs sm:text-sm font-semibold leading-tight line-clamp-2 ${
                          isSelected
                            ? 'text-white'
                            : 'text-dark-900 dark:text-cream-100 group-hover:text-primary-700 dark:group-hover:text-accent-400'
                        }`}
                      >
                        {kec.nama}
                      </span>
                      <MapPin
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isSelected
                            ? 'text-accent-300'
                            : 'text-dark-400 dark:text-cream-500 group-hover:text-accent-400'
                        }`}
                      />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span
                        className={
                          isSelected
                            ? 'text-accent-300 font-medium'
                            : 'text-dark-500 dark:text-cream-400'
                        }
                      >
                        {kec.jumlahBudaya || 0} Budaya
                      </span>
                      {isEnggano && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-accent-400/20 text-accent-400 font-medium">
                          Pulau
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Footnote */}
            <div className="mt-6 pt-4 border-t border-cream-200 dark:border-dark-700 flex items-center justify-between text-xs text-dark-500 dark:text-cream-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-400 inline-block animate-pulse" />
                Klik salah satu blok kecamatan untuk melihat informasi
              </span>
            </div>
          </div>

          {/* RIGHT: Info Panel (40% / 5 cols) */}
          <div className="lg:col-span-5 bg-cream-50 dark:bg-dark-900 rounded-3xl p-6 sm:p-8 shadow-lg border border-cream-200 dark:border-dark-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedKecamatan.id || selectedKecamatan.nama}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-400/15 text-primary-700 dark:text-accent-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Kecamatan Terpilih</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-700 dark:text-accent-400">
                    {selectedKecamatan.nama}
                  </h3>
                  <p className="text-dark-600 dark:text-cream-300 text-sm sm:text-base leading-relaxed mt-3">
                    {selectedKecamatan.deskripsi}
                  </p>
                </div>

                {/* Cultural Heritage Section */}
                <div className="pt-2 border-t border-cream-200 dark:border-dark-700">
                  <h4 className="font-heading text-lg font-semibold text-dark-900 dark:text-cream-100 mb-3 flex items-center justify-between">
                    <span>Budaya dari {selectedKecamatan.nama}:</span>
                    <span className="text-xs font-normal text-dark-500 dark:text-cream-400 font-sans">
                      {matchingBudaya.length} Item
                    </span>
                  </h4>

                  {matchingBudaya.length > 0 ? (
                    <div className="space-y-3">
                      {matchingBudaya.map((item) => (
                        <Link
                          key={item.id || item.slug}
                          to={`/budaya/${item.slug}`}
                          className="flex items-center gap-3.5 p-3 rounded-2xl bg-cream-100 dark:bg-dark-800 hover:bg-cream-200 dark:hover:bg-dark-700/80 border border-cream-200/80 dark:border-dark-700 transition-all duration-200 group"
                        >
                          <img
                            src={item.gambar || getPlaceholderImage(100, 100, item.nama)}
                            alt={item.nama}
                            className="w-14 h-14 rounded-xl object-cover bg-cream-300 dark:bg-dark-700 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = getPlaceholderImage(100, 100, item.nama);
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-heading text-base font-semibold text-dark-900 dark:text-cream-100 group-hover:text-primary-700 dark:group-hover:text-accent-400 transition-colors truncate">
                              {item.nama}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-primary-700 dark:text-accent-400 inline-flex items-center gap-1 font-medium">
                                <Tag className="w-3 h-3" />
                                {item.kategori}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-cream-200 dark:bg-dark-700 text-dark-600 dark:text-cream-200 group-hover:bg-primary-700 group-hover:text-white transition-colors shrink-0">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-cream-100 dark:bg-dark-800 border border-cream-200 dark:border-dark-700 text-center space-y-3">
                      <Sparkles className="w-8 h-8 text-accent-400 mx-auto" />
                      <p className="text-sm text-dark-600 dark:text-cream-300">
                        Dokumentasi budaya khusus kecamatan ini sedang dalam proses kurasi digital.
                      </p>
                      <Link
                        to="/jelajah"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-accent-400 hover:underline"
                      >
                        Lihat katalog lengkap budaya &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                {/* Explore Button */}
                <div className="pt-2">
                  <Link
                    to={`/jelajah?kecamatan=${encodeURIComponent(selectedKecamatan.nama)}`}
                    className="w-full py-3 px-4 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Jelajahi Arsip {selectedKecamatan.nama}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
