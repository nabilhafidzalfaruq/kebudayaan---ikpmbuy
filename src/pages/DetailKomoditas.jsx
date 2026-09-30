import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, MapPin, TrendingUp, BarChart3, Ruler, Sprout, Fish, TreePalm,
  Lightbulb, Target, AlertTriangle, Home, ArrowLeft
} from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { getPlaceholderImage } from '../utils/helpers';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';

const kategoriIcons = {
  'Perkebunan': TreePalm,
  'Pertanian': Sprout,
  'Perikanan': Fish,
};

export default function DetailKomoditas() {
  const { slug } = useParams();
  const { komoditas = [], loading } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;

  const item = komoditas.find(k => k.slug === slug);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-dark-800">
        <div className="text-center px-4">
          <h2 className="font-heading text-3xl font-bold text-gray-700 dark:text-cream-200 mb-4">Komoditas Tidak Ditemukan</h2>
          <p className="text-gray-500 dark:text-cream-400 mb-6">Komoditas yang Anda cari tidak tersedia.</p>
          <Link to="/komoditas" className="inline-flex items-center gap-2 text-primary-600 dark:text-accent-400 font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Komoditas
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = kategoriIcons[item.kategori] || Sprout;
  const relatedKomoditas = komoditas.filter(k => k.slug !== slug && k.kategori === item.kategori).slice(0, 3);
  const galeri = item.galeri || [];

  const sections = [
    { id: 'deskripsi', label: 'Deskripsi', icon: Sprout, content: item.deskripsi },
    { id: 'potensi', label: 'Potensi', icon: Target, content: item.potensi },
    { id: 'manfaat', label: 'Manfaat', icon: Lightbulb, content: item.manfaat },
    { id: 'tantangan', label: 'Tantangan', icon: AlertTriangle, content: item.tantangan },
  ].filter(s => s.content);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[55vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.gambar || getPlaceholderImage(1920, 800, item.nama)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-cream-300 mb-4">
            <Link to="/" className="hover:text-white transition flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/komoditas" className="hover:text-white transition">Komoditas</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">{item.nama}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="kategori">
              <span className="inline-flex items-center gap-1.5"><IconComponent className="w-3.5 h-3.5" />{item.kategori}</span>
            </Badge>
            {item.unggulan && <Badge variant="default">⭐ Unggulan</Badge>}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            {item.nama}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-cream-50 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4 border-l-4 border-accent-400 pl-4">
                    <section.icon className="w-5 h-5 text-primary-700 dark:text-accent-400" />
                    <h2 className="font-heading text-2xl font-bold text-primary-700 dark:text-cream-100">{section.label}</h2>
                  </div>
                  <p className="text-gray-700 dark:text-cream-300 leading-relaxed pl-4">{section.content}</p>
                </motion.div>
              ))}

              {/* Galeri */}
              {galeri.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4 border-l-4 border-accent-400 pl-4">
                    <h2 className="font-heading text-2xl font-bold text-primary-700 dark:text-cream-100">Galeri</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-4">
                    {galeri.map((img, i) => (
                      <img
                        key={i}
                        src={img || getPlaceholderImage(400, 300, `${item.nama} ${i + 1}`)}
                        alt={`${item.nama} ${i + 1}`}
                        className="w-full h-40 object-cover rounded-xl"
                        onError={(e) => { e.target.src = getPlaceholderImage(400, 300, `${item.nama}`); }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-md border border-cream-200 dark:border-dark-600">
                <h3 className="font-heading text-lg font-bold text-primary-700 dark:text-cream-100 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Data Komoditas
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-cream-200 dark:border-dark-600">
                    <span className="text-sm text-gray-500 dark:text-cream-400">Kategori</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-cream-100 flex items-center gap-1.5">
                      <IconComponent className="w-4 h-4 text-primary-600" /> {item.kategori}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-cream-200 dark:border-dark-600">
                    <span className="text-sm text-gray-500 dark:text-cream-400 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Produksi/Tahun</span>
                    <span className="text-sm font-semibold text-primary-700 dark:text-accent-400">{item.produksiPerTahun}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-cream-200 dark:border-dark-600">
                    <span className="text-sm text-gray-500 dark:text-cream-400 flex items-center gap-1.5"><Ruler className="w-4 h-4" /> Luas Lahan</span>
                    <span className="text-sm font-semibold text-primary-700 dark:text-accent-400">{item.luasLahan}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm text-gray-500 dark:text-cream-400 flex items-center gap-1.5 mb-2"><MapPin className="w-4 h-4" /> Wilayah Produksi</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(item.kecamatan) ? item.kecamatan : [item.kecamatan]).map((kec, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-cream-200 dark:bg-dark-600 text-gray-700 dark:text-cream-300">
                          {kec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-md border border-cream-200 dark:border-dark-600">
                <h3 className="font-heading text-lg font-bold text-primary-700 dark:text-cream-100 mb-3">Navigasi</h3>
                <nav className="space-y-1.5">
                  {sections.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-dark-600 transition"
                    >
                      <s.icon className="w-4 h-4 text-primary-600 dark:text-accent-400" />
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedKomoditas.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-primary-700 dark:text-cream-100 mb-6">
                Komoditas {item.kategori} Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedKomoditas.map((related) => (
                  <Link key={related.id} to={`/komoditas/${related.slug}`} className="block group">
                    <div className="bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group-hover:-translate-y-1">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={related.gambar || getPlaceholderImage(400, 300, related.nama)}
                          alt={related.nama}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.src = getPlaceholderImage(400, 300, related.nama); }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-gray-900 dark:text-cream-100 group-hover:text-primary-600 transition-colors">{related.nama}</h3>
                        <p className="text-xs text-gray-500 dark:text-cream-400 mt-1">{related.produksiPerTahun}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
