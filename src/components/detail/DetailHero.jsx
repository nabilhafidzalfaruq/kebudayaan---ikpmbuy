import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import { getPlaceholderImage } from '../../utils/helpers';

/**
 * DetailHero Component
 * Full-width hero banner with parallax-like backdrop, dark gradient overlay,
 * and culture header information (title, category badge, and kecamatan).
 *
 * @param {Object} props
 * @param {string} props.nama - Name of the culture item
 * @param {string} props.kecamatan - District name
 * @param {string} props.kategori - Category label
 * @param {string} props.gambar - Hero image URL
 * @param {React.ReactNode} [props.actions] - Optional action buttons (e.g. Bookmark button)
 */
export default function DetailHero({ nama, kecamatan, kategori, gambar, actions }) {
  const fallbackImage = getPlaceholderImage(1600, 900, nama || 'Bengkulu Utara');
  const heroImage = gambar || fallbackImage;

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[65vh] min-h-[380px] overflow-hidden bg-dark-900">
      {/* Background Image with Parallax & Zoom subtle animation */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={heroImage}
          alt={nama || 'Budaya Bengkulu Utara'}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="w-full h-full object-cover object-center transform scale-105"
        />
      </motion.div>

      {/* Multi-stage Gradient Overlays for High Contrast Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/60 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl"
        >
          {/* Category & District Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-4">
            {kategori && (
              <Badge
                variant="kategori"
                size="md"
                className="bg-accent-400/90 text-dark-900 font-semibold shadow-sm backdrop-blur-md"
              >
                {kategori}
              </Badge>
            )}

            {kecamatan && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-cream-100 text-xs md:text-sm border border-white/10 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                <span>Kecamatan {kecamatan}</span>
              </div>
            )}

            {/* Optional Actions Slot (e.g. Bookmark, Share) */}
            {actions && <div className="ml-auto">{actions}</div>}
          </div>

          {/* Main Title */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cream-50 leading-tight md:leading-none tracking-tight drop-shadow-md">
            {nama}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
