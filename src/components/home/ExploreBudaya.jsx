import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Music,
  Flame,
  ChefHat,
  Shirt,
  Home,
  BookOpen,
  Disc3,
  Paintbrush,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context';
import { getPlaceholderImage } from '../../utils/helpers';
import defaultKategoriData from '../../data/kategori.json';

const getCategoryIcon = (nama, iconKey) => {
  const n = (nama || '').toLowerCase();
  if (n.includes('seni')) return Music;
  if (n.includes('tradisi') || n.includes('upacara')) return Flame;
  if (n.includes('kuliner')) return ChefHat;
  if (n.includes('pakaian')) return Shirt;
  if (n.includes('rumah')) return Home;
  if (n.includes('bahasa') || n.includes('aksara')) return BookOpen;
  if (n.includes('musik')) return Disc3;
  if (n.includes('kerajinan')) return Paintbrush;

  if (iconKey === 'Music') return Music;
  if (iconKey === 'Calendar' || iconKey === 'Flame') return Flame;
  if (iconKey === 'Utensils' || iconKey === 'ChefHat') return ChefHat;
  if (iconKey === 'Shirt') return Shirt;
  if (iconKey === 'Home') return Home;
  if (iconKey === 'BookOpen') return BookOpen;
  if (iconKey === 'Radio' || iconKey === 'Disc3') return Disc3;
  if (iconKey === 'Palette' || iconKey === 'Paintbrush') return Paintbrush;

  return Sparkles;
};

export default function ExploreBudaya({ kategoriData }) {
  const contextData = useData ? useData() : null;
  const categories = (kategoriData && kategoriData.length > 0)
    ? kategoriData
    : (contextData?.kategori?.length ? contextData.kategori : defaultKategoriData);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 bg-cream-50 dark:bg-dark-900 transition-colors">
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
              JELAJAHI
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-cream-100 mt-2">
              Kekayaan Bengkulu Utara
            </h2>
            <div className="h-1 w-20 bg-primary-600 dark:bg-accent-400 mx-auto mt-4 rounded-full" />
            <p className="text-dark-600 dark:text-cream-300 text-base sm:text-lg mt-4 leading-relaxed">
              Temukan beragam warisan budaya yang tersimpan di Bumi Sungkai
            </p>
          </motion.div>
        </div>

        {/* 8 Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.nama, cat.icon);
            const imageUrl = cat.gambar || getPlaceholderImage(600, 400, cat.nama);

            return (
              <motion.div
                key={cat.id || cat.nama}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 cursor-pointer border border-cream-200 dark:border-dark-700"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={cat.nama}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(600, 400, cat.nama);
                    }}
                  />
                  {/* Overlays: dark initial, lightens slightly on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-900/75 to-dark-900/40 group-hover:via-dark-900/60 group-hover:to-dark-900/30 transition-all duration-500" />
                </div>

                {/* Top: Icon Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cream-100/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent-400 group-hover:bg-primary-700 group-hover:text-white group-hover:border-primary-600 transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                    <span className="w-8 h-8 rounded-full bg-accent-400/90 text-dark-900 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Bottom: Info */}
                <div className="relative z-10 space-y-2">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-accent-300 transition-colors">
                    {cat.nama}
                  </h3>
                  <p className="text-xs text-cream-200/85 line-clamp-2 leading-relaxed">
                    {cat.deskripsi}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-accent-400 uppercase">
                      {cat.jumlahBudaya || 0} Budaya
                    </span>
                    <span className="text-xs text-cream-300/80 group-hover:text-white transition-colors">
                      Jelajahi &rarr;
                    </span>
                  </div>
                </div>

                {/* Full Card Link */}
                <Link
                  to={`/jelajah?kategori=${encodeURIComponent(cat.nama)}`}
                  className="absolute inset-0 z-20"
                  aria-label={`Jelajahi kategori ${cat.nama}`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
