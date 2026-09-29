import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

/**
 * NotFound Page (404)
 * Displays friendly culture-themed 404 error with navigation actions.
 */
export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cream-100 dark:bg-dark-900">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-40 pointer-events-none" />

      {/* Decorative Traditional Motif Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-accent-200/25 dark:bg-accent-900/15 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* Cultural Decorative Ornament */}
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-cream-200/80 dark:bg-dark-800/80 border border-primary-300/40 dark:border-dark-700 shadow-inner mb-6 text-primary-600 dark:text-primary-400">
          <Compass className="w-12 h-12 text-primary-600 dark:text-accent-400 animate-spin-slow" />
        </div>

        {/* Large 404 text */}
        <h1 className="font-heading font-extrabold text-7xl sm:text-8xl md:text-9xl text-primary-700 dark:text-accent-400 tracking-wider mb-2 drop-shadow-sm select-none">
          404
        </h1>

        {/* Heading & Explanation */}
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark-800 dark:text-cream-50 mb-3">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-dark-600 dark:text-dark-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Mari kembali menelusuri keagungan warisan budaya Bengkulu Utara.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            href="/"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-md hover:shadow-lg gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Button>

          <Button
            href="/jelajah"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Jelajah Budaya</span>
          </Button>
        </div>

        {/* Cultural Motto Footer */}
        <div className="mt-12 pt-6 border-t border-cream-200 dark:border-dark-800">
          <p className="text-xs tracking-widest uppercase font-semibold text-primary-700/70 dark:text-accent-400/70">
            Pusaka Sejarah &bull; Warisan Adat &bull; Bengkulu Utara
          </p>
        </div>
      </motion.div>
    </div>
  );
}
