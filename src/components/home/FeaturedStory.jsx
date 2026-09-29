import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { useData } from '../../context';
import { getPlaceholderImage, formatDate, formatDateShort } from '../../utils/helpers';
import defaultBeritaData from '../../data/berita.json';

export default function FeaturedStory({ beritaData }) {
  const contextData = useData ? useData() : null;
  const articles = (beritaData && beritaData.length > 0)
    ? beritaData
    : (contextData?.berita?.length ? contextData.berita : defaultBeritaData);

  // Determine the main featured article and the secondary articles
  const { mainArticle, secondaryArticles } = useMemo(() => {
    if (!articles || articles.length === 0) {
      return { mainArticle: null, secondaryArticles: [] };
    }

    const featured = articles.find(a => a.featured === true) || articles[0];
    const others = articles.filter(a => a.id !== featured.id).slice(0, 3);

    return {
      mainArticle: featured,
      secondaryArticles: others,
    };
  }, [articles]);

  if (!mainArticle) {
    return null;
  }

  const mainImageUrl = mainArticle.gambar || getPlaceholderImage(800, 600, mainArticle.judul);

  return (
    <section className="py-20 bg-cream-50 dark:bg-dark-900/90 transition-colors">
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
              BERITA BUDAYA
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-cream-100 mt-2">
              Cerita dari Bumi Sungkai
            </h2>
            <div className="h-1 w-20 bg-primary-600 dark:bg-accent-400 mx-auto mt-4 rounded-full" />
            <p className="text-dark-600 dark:text-cream-300 text-base sm:text-lg mt-4 leading-relaxed">
              Kumpulan ulasan mendalam, dokumentasi kegiatan adat, dan kabar seputar pelestarian tradisi di Bengkulu Utara.
            </p>
          </motion.div>
        </div>

        {/* Magazine-style Layout: 1 Large Left (60%), 2-3 Small Right (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Large Featured Card (60% / 7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="group relative h-full min-h-[460px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-cream-200 dark:border-dark-700 flex flex-col justify-end">
              {/* Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={mainImageUrl}
                  alt={mainArticle.judul}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage(800, 600, mainArticle.judul);
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-900/60 to-dark-900/20 group-hover:via-dark-900/50 transition-colors duration-300" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-6 sm:p-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary-700 text-white font-semibold text-xs tracking-wider uppercase shadow-xs">
                    Berita Utama
                  </span>
                  {mainArticle.kategori && (
                    <span className="px-3 py-1 rounded-full bg-accent-400 text-dark-900 font-semibold text-xs tracking-wider uppercase">
                      {mainArticle.kategori}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white group-hover:text-accent-300 transition-colors leading-tight">
                  {mainArticle.judul}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-cream-300 font-medium pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent-400" />
                    {formatDate(mainArticle.tanggal)}
                  </span>
                  {mainArticle.penulis && (
                    <span className="inline-flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent-400" />
                      {mainArticle.penulis}
                    </span>
                  )}
                </div>

                <p className="text-cream-200/90 text-sm sm:text-base line-clamp-3 leading-relaxed pt-1">
                  {mainArticle.ringkasan}
                </p>

                <div className="pt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent-400 group-hover:text-white transition-colors">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* Clickable Area Link */}
              <Link
                to={`/berita/${mainArticle.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`Baca artikel: ${mainArticle.judul}`}
              />
            </div>
          </motion.div>

          {/* Smaller Cards Stacked Right (40% / 5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between space-y-4"
          >
            {secondaryArticles.map((article) => {
              const smallImageUrl = article.gambar || getPlaceholderImage(400, 300, article.judul);

              return (
                <div
                  key={article.id || article.slug}
                  className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-cream-100 dark:bg-dark-800 border border-cream-200 dark:border-dark-700 hover:shadow-xl hover:border-accent-400/40 dark:hover:border-accent-400/40 transition-all duration-300"
                >
                  {/* Thumbnail (40% on horizontal) */}
                  <div className="w-full sm:w-36 sm:h-32 h-44 rounded-xl overflow-hidden shrink-0 relative bg-cream-300 dark:bg-dark-700">
                    <img
                      src={smallImageUrl}
                      alt={article.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage(400, 300, article.judul);
                      }}
                    />
                    <div className="absolute inset-0 bg-dark-900/10 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Content (60% on horizontal) */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        {article.kategori && (
                          <span className="text-[11px] font-semibold text-primary-700 dark:text-accent-400 uppercase tracking-wider">
                            {article.kategori}
                          </span>
                        )}
                        <span className="text-dark-300 dark:text-dark-500 text-xs">•</span>
                        <span className="text-xs text-dark-500 dark:text-cream-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateShort(article.tanggal)}
                        </span>
                      </div>

                      <h4 className="font-heading text-base sm:text-lg font-bold text-dark-900 dark:text-cream-100 group-hover:text-primary-700 dark:group-hover:text-accent-400 transition-colors line-clamp-2 leading-snug">
                        {article.judul}
                      </h4>

                      <p className="text-xs text-dark-600 dark:text-cream-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {article.ringkasan}
                      </p>
                    </div>

                    <div className="mt-2 text-xs font-semibold text-primary-700 dark:text-accent-400 inline-flex items-center gap-1 group-hover:underline">
                      <span>Selengkapnya</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Clickable Area Link */}
                  <Link
                    to={`/berita/${article.slug}`}
                    className="absolute inset-0 z-20"
                    aria-label={`Baca artikel: ${article.judul}`}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Centered Button */}
        <div className="mt-14 text-center">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-700 hover:bg-primary-600 text-white font-medium text-base shadow-lg hover:shadow-primary-700/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
          >
            <BookOpen className="w-4 h-4 text-accent-400" />
            <span>Semua Berita</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
