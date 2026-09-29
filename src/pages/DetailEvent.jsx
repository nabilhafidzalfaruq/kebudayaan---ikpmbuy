import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Compass,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { formatDate, getPlaceholderImage, getStatusLabel } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NotFound from './NotFound';

/**
 * DetailEvent Page
 * Festival & ceremony detail page with hero banner, structured info sidebar,
 * HTML rich description (.prose-budaya), and related events recommendation.
 */
export default function DetailEvent() {
  const { slug } = useParams();
  const { events, loading } = useData();

  // Scroll to top on mount or slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Memuat informasi kegiatan budaya..." />
      </div>
    );
  }

  const eventItem = events?.find(
    (item) => item.slug === slug || String(item.id) === slug
  );

  if (!eventItem) {
    return <NotFound />;
  }

  // Related events from the same or other districts (max 3)
  const relatedEvents = (events || [])
    .filter((e) => e.slug !== eventItem.slug && String(e.id) !== String(eventItem.id))
    .slice(0, 3);

  const displayImage =
    eventItem.gambar || getPlaceholderImage(1200, 600, eventItem.nama);

  // Formatted date range
  const dateFormatted =
    eventItem.tanggalMulai === eventItem.tanggalSelesai || !eventItem.tanggalSelesai
      ? formatDate(eventItem.tanggalMulai)
      : `${formatDate(eventItem.tanggalMulai)} – ${formatDate(eventItem.tanggalSelesai)}`;

  return (
    <article className="min-h-screen bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      {/* 1. Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="bg-cream-200/60 dark:bg-dark-800/60 border-b border-cream-200 dark:border-dark-700/80 sticky top-16 md:top-20 z-20 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-dark-500 dark:text-dark-400 overflow-x-auto no-scrollbar whitespace-nowrap">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </Link>
            </li>
            <li className="flex items-center text-dark-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <Link
                to="/event"
                className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Event Budaya
              </Link>
            </li>
            <li className="flex items-center text-dark-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li
              className="text-primary-800 dark:text-accent-400 font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md"
              aria-current="page"
            >
              {eventItem.nama}
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. Cover Image Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative aspect-[21/9] min-h-[260px] max-h-[480px] w-full rounded-2xl overflow-hidden bg-cream-200 dark:bg-dark-800 shadow-lg">
          <img
            src={displayImage}
            alt={eventItem.nama}
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(1200, 600, eventItem.nama);
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Floating Status Badge on top-right */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant={eventItem.status} size="md" className="shadow-md">
              {getStatusLabel(eventItem.status)}
            </Badge>
          </div>

          {/* District Tag on bottom-left of cover */}
          {eventItem.kecamatan && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-cream-100 text-xs sm:text-sm font-medium border border-white/10">
              <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
              <span>Kecamatan {eventItem.kecamatan}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Event Main Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-dark-800 dark:text-cream-50 leading-tight">
          {eventItem.nama}
        </h1>
      </div>

      {/* 4. Content Body with Info Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Main Description (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-cream-50 dark:bg-dark-800/80 rounded-2xl p-6 sm:p-8 border border-cream-200 dark:border-dark-700 shadow-sm mb-8">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-dark-800 dark:text-cream-100 border-l-4 border-accent-400 pl-4 mb-6">
                Deskripsi & Rangkaian Acara
              </h2>

              <div
                className="prose-budaya max-w-none text-dark-700 dark:text-dark-200 text-base sm:text-lg leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html:
                    eventItem.konten ||
                    `<p>${eventItem.deskripsi || 'Belum ada rincian lengkap untuk kegiatan ini.'}</p>`
                }}
              />
            </div>

            {/* Back Button */}
            <Link
              to="/event"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Kalender Event Budaya</span>
            </Link>
          </div>

          {/* Info Sidebar Block (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-cream-50 dark:bg-dark-800 rounded-2xl p-6 border border-cream-200 dark:border-dark-700 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-dark-800 dark:text-cream-100 pb-3 border-b border-cream-200 dark:border-dark-700 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Informasi Kegiatan
              </h3>

              {/* Status */}
              <div>
                <span className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-1.5">
                  Status Pelaksanaan
                </span>
                <Badge variant={eventItem.status} size="md">
                  {getStatusLabel(eventItem.status)}
                </Badge>
              </div>

              {/* Tanggal Pelaksanaan */}
              <div>
                <span className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-1.5">
                  Jadwal Waktu
                </span>
                <div className="flex items-start gap-2.5 text-sm text-dark-800 dark:text-cream-100 font-medium">
                  <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                  <span>{dateFormatted}</span>
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <span className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-1.5">
                  Lokasi Tempat
                </span>
                <div className="flex items-start gap-2.5 text-sm text-dark-800 dark:text-cream-100 font-medium">
                  <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                  <span>{eventItem.lokasi || eventItem.kecamatan}</span>
                </div>
              </div>

              {/* Kecamatan */}
              {eventItem.kecamatan && (
                <div>
                  <span className="block text-xs font-medium text-dark-400 uppercase tracking-wider mb-1.5">
                    Kecamatan
                  </span>
                  <div className="flex items-center gap-2 text-sm text-dark-800 dark:text-cream-100 font-medium">
                    <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                    <span>Kecamatan {eventItem.kecamatan}</span>
                  </div>
                </div>
              )}

              {/* Note / Callout */}
              <div className="p-4 rounded-xl bg-accent-50 dark:bg-dark-700/60 border border-accent-200/80 dark:border-dark-600 text-xs text-dark-600 dark:text-dark-300 leading-relaxed">
                <strong className="block text-dark-800 dark:text-cream-100 font-semibold mb-1">
                  Pemberitahuan Pengunjung:
                </strong>
                Jadwal dapat mengalami penyesuaian oleh panitia adat. Pengunjung disarankan datang tepat waktu dan mematuhi tata tertib tradisi setempat.
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 5. Related Events at Bottom */}
      {relatedEvents.length > 0 && (
        <section className="py-14 bg-cream-50 dark:bg-dark-800/60 border-t border-cream-200 dark:border-dark-700/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-dark-800 dark:text-cream-50">
                Kegiatan Budaya Lainnya
              </h2>
              <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1">
                Ikuti kalender festival dan upacara adat di Bengkulu Utara
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedEvents.map((e) => (
                <Card
                  key={e.id || e.slug}
                  variant="event"
                  to={`/event/${e.slug}`}
                  image={e.gambar}
                  title={e.nama}
                  location={e.lokasi || e.kecamatan}
                  subtitle={e.kecamatan}
                  date={e.tanggalMulai}
                  status={e.status}
                  description={e.deskripsi}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
