import React from 'react';
import Card from '../ui/Card';
import { Compass } from 'lucide-react';

/**
 * RelatedCulture Component
 * Displays other cultural assets from the same district (kecamatan).
 *
 * @param {Object} props
 * @param {Array<Object>} props.budayaData - Array of all culture records
 * @param {string} props.currentSlug - Slug of the currently viewed culture item (to exclude)
 * @param {string} props.currentKecamatan - Name of the current district
 */
export default function RelatedCulture({ budayaData = [], currentSlug, currentKecamatan }) {
  if (!currentKecamatan || !Array.isArray(budayaData)) {
    return null;
  }

  // Filter items from the same kecamatan, excluding current culture
  const normalizedKecamatan = currentKecamatan.toLowerCase().trim();
  const relatedItems = budayaData
    .filter((item) => {
      if (!item || item.slug === currentSlug) return false;
      const itemKec = (item.kecamatan || '').toLowerCase().trim();
      return itemKec === normalizedKecamatan;
    })
    .slice(0, 3);

  // If none from same kecamatan, don't render
  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-cream-50 dark:bg-dark-900 border-t border-cream-200 dark:border-dark-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>Eksplorasi Wilayah Terkait</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-800 dark:text-cream-50">
              Budaya Lainnya dari {currentKecamatan}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
            Menampilkan warisan adat sekeliling {currentKecamatan}
          </p>
        </div>

        {/* 3 Columns Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {relatedItems.map((item) => (
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
      </div>
    </section>
  );
}
