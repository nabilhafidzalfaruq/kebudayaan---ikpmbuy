import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, ArrowRight, Sprout, Fish, TreePalm } from 'lucide-react';
import { getPlaceholderImage } from '../../utils/helpers';
import Button from '../ui/Button';

const kategoriIcons = {
  'Perkebunan': TreePalm,
  'Pertanian': Sprout,
  'Perikanan': Fish,
};

export default function KomoditasDaerah({ komoditasData = [] }) {
  const unggulan = komoditasData.filter(k => k.unggulan);
  const displayData = unggulan.length > 0 ? unggulan : komoditasData.slice(0, 6);

  if (displayData.length === 0) return null;

  return (
    <section id="komoditas" className="py-20 bg-cream-100 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-accent-400 mb-3">
            <TrendingUp className="w-4 h-4" />
            Komoditas Unggulan
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-700 dark:text-cream-100 mb-4">
            Potensi Ekonomi Bengkulu Utara
          </h2>
          <p className="text-gray-600 dark:text-cream-400 max-w-2xl mx-auto">
            Kenali komoditas unggulan daerah yang menjadi tulang punggung perekonomian masyarakat Bengkulu Utara
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.map((item, index) => {
            const IconComponent = kategoriIcons[item.kategori] || Sprout;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/komoditas/${item.slug}`} className="block group">
                  <div className="bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.gambar || getPlaceholderImage(600, 400, item.nama)}
                        alt={item.nama}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.src = getPlaceholderImage(600, 400, item.nama); }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Kategori badge */}
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-dark-700/90 text-primary-700 dark:text-accent-400 backdrop-blur-sm">
                        <IconComponent className="w-3.5 h-3.5" />
                        {item.kategori}
                      </span>

                      {/* Unggulan badge */}
                      {item.unggulan && (
                        <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold bg-accent-400 text-white">
                          Unggulan
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-cream-100 mb-2 group-hover:text-primary-600 transition-colors">
                        {item.nama}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-cream-400 line-clamp-2 mb-4">
                        {item.deskripsi}
                      </p>

                      {/* Stats */}
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

                      {/* Kecamatan */}
                      <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-cream-400">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">
                          {Array.isArray(item.kecamatan) ? item.kecamatan.join(', ') : item.kecamatan}
                        </span>
                      </div>

                      {/* Arrow */}
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="primary" href="/komoditas">
            Lihat Semua Komoditas
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
