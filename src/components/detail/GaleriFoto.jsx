import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { getPlaceholderImage } from '../../utils/helpers';

/**
 * GaleriFoto Component
 * Photo gallery grid featuring an interactive modal lightbox with keyboard navigation.
 *
 * @param {Object} props
 * @param {Array<string>} [props.galeri=[]] - Array of image URLs
 * @param {string} [props.nama=''] - Name of the culture item for alt attributes
 */
export default function GaleriFoto({ galeri = [], nama = 'Budaya Bengkulu Utara' }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const isOpen = selectedIndex !== null;

  const handleOpen = (index) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : galeri.length - 1));
  }, [selectedIndex, galeri.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev < galeri.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, galeri.length]);

  // Keyboard navigation for modal lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll while lightbox is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handlePrev, handleNext]);

  if (!Array.isArray(galeri) || galeri.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-cream-100/70 dark:bg-dark-900/50 border-t border-cream-200 dark:border-dark-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center text-primary-700 dark:text-primary-300">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark-800 dark:text-cream-50">
                Galeri Foto
              </h2>
              <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
                Dokumentasi visual keindahan {nama} ({galeri.length} foto)
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map((imgUrl, index) => {
            const fallback = getPlaceholderImage(800, 600, `${nama} ${index + 1}`);
            const displayImg = imgUrl || fallback;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleOpen(index)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-200 dark:bg-dark-800 border border-cream-200 dark:border-dark-700 shadow-sm hover:shadow-lg cursor-pointer select-none"
              >
                <img
                  src={displayImg}
                  alt={`${nama} foto ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = fallback;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 dark:bg-dark-800/90 text-dark-800 dark:text-cream-100 flex items-center justify-center shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-200">
                    <ZoomIn className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-cream-100 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-between items-center">
                  <span>Lihat Foto Penuh</span>
                  <span className="text-[11px] text-accent-300">
                    {index + 1} / {galeri.length}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={handleClose}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-400"
              aria-label="Tutup Galeri"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter Label */}
            <div className="absolute top-6 left-6 z-20 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-cream-100 text-xs sm:text-sm font-medium">
              {selectedIndex + 1} dari {galeri.length} &bull; {nama}
            </div>

            {/* Navigation Buttons */}
            {galeri.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  aria-label="Foto Berikutnya"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            {/* Main Lightbox Image */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  galeri[selectedIndex] ||
                  getPlaceholderImage(1200, 800, `${nama} ${selectedIndex + 1}`)
                }
                alt={`${nama} foto ${selectedIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
