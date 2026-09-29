import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useData } from '../../context';
import { getPlaceholderImage } from '../../utils/helpers';
import defaultBudayaData from '../../data/budaya.json';

export default function BudayaPopuler({ budayaData }) {
  const contextData = useData ? useData() : null;
  const allBudaya = (budayaData && budayaData.length > 0)
    ? budayaData
    : (contextData?.budaya?.length ? contextData.budaya : defaultBudayaData);

  // Filter 6 popular items
  const popularItems = React.useMemo(() => {
    const popular = allBudaya.filter(item => item.populer === true);
    if (popular.length >= 6) return popular.slice(0, 6);
    // If fewer than 6 popular, pad with remaining items
    const remaining = allBudaya.filter(item => !item.populer);
    return [...popular, ...remaining].slice(0, 6);
  }, [allBudaya]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-20 bg-cream-100 dark:bg-dark-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-accent-500 uppercase">
              WARISAN PILIHAN
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-cream-100 mt-2">
              Budaya Populer
            </h2>
            <div className="h-1 w-20 bg-primary-600 dark:bg-accent-400 mx-auto mt-4 rounded-full" />
            <p className="text-dark-600 dark:text-cream-300 text-base sm:text-lg mt-4 leading-relaxed">
              Warisan adat istiadat, mahakarya seni, dan kearifan leluhur yang paling banyak dikagumi di Bengkulu Utara.
            </p>
          </motion.div>
        </div>

        {/* 6 Popular Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {popularItems.map((item) => {
            const imageUrl = item.gambar || getPlaceholderImage(600, 450, item.nama);

            return (
              <motion.div
                key={item.id || item.slug}
                variants={cardVariants}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-cream-200 dark:border-dark-700 flex flex-col justify-end"
              >
                {/* Background Image with Zoom on Hover */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={item.nama}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(600, 450, item.nama);
                    }}
                  />
                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-950/60 to-transparent" />
                  <div className="absolute inset-0 bg-dark-900/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                {/* Card Content at Bottom */}
                <div className="relative z-10 p-6 flex flex-col justify-end">
                  {/* Kategori Badge */}
                  <div className="mb-2.5">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent-400 text-dark-900 font-semibold text-xs tracking-wider uppercase shadow-xs">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl font-bold text-white group-hover:text-accent-300 transition-colors leading-snug">
                    {item.nama}
                  </h3>

                  {/* Kecamatan Info */}
                  <div className="flex items-center gap-1.5 text-cream-300 text-xs mt-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-accent-400" />
                    <span>Kecamatan {item.kecamatan}</span>
                  </div>

                  {/* Description: Reveals / expands on hover */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <p className="text-cream-200/90 text-xs sm:text-sm line-clamp-3 mt-3 leading-relaxed border-t border-white/15 pt-2">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                {/* Clickable Card Link */}
                <Link
                  to={`/budaya/${item.slug}`}
                  className="absolute inset-0 z-20"
                  aria-label={`Pelajari lebih lanjut tentang ${item.nama}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <Link
            to="/jelajah"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-700 hover:bg-primary-600 text-white font-medium text-base shadow-lg hover:shadow-primary-700/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <span>Lihat Semua Budaya</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
