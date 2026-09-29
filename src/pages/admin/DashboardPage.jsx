import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAllBeritaAdmin } from '../../firebase/services/beritaService';
import { getAllEventsAdmin } from '../../firebase/services/eventService';
import { formatDateShort, getStatusColor, getStatusLabel } from '../../utils/helpers';
import localBeritaData from '../../data/berita.json';
import localEventsData from '../../data/events.json';

/**
 * Admin Dashboard Page displaying key statistics, quick actions, latest news, and upcoming events.
 */
export default function DashboardPage() {
  const [beritaList, setBeritaList] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Berita (Firebase or fallback to local JSON)
        let beritaResult = [];
        try {
          beritaResult = await getAllBeritaAdmin();
        } catch (bErr) {
          console.warn('Using local berita fallback for dashboard:', bErr);
          beritaResult = localBeritaData;
        }

        // Fetch Events (Firebase or fallback to local JSON)
        let eventResult = [];
        try {
          eventResult = await getAllEventsAdmin();
        } catch (eErr) {
          console.warn('Using local events fallback for dashboard:', eErr);
          eventResult = localEventsData;
        }

        if (isMounted) {
          setBeritaList(beritaResult || []);
          setEventList(eventResult || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (isMounted) {
          setError('Gagal memuat sebagian data dashboard.');
          setBeritaList(localBeritaData || []);
          setEventList(localEventsData || []);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Statistics
  const totalBerita = beritaList.length;
  const beritaPublished = beritaList.filter((b) => b.published).length;
  const beritaDraft = totalBerita - beritaPublished;

  const totalEvent = eventList.length;
  const eventUpcoming = eventList.filter((e) => e.status === 'upcoming').length;
  const eventOngoing = eventList.filter((e) => e.status === 'ongoing').length;
  const eventCompleted = eventList.filter((e) => e.status === 'completed').length;

  // Recent 5 Berita
  const recentBerita = beritaList.slice(0, 5);

  // Upcoming 3 Events
  const upcomingEvents = eventList
    .filter((e) => e.status === 'upcoming' || e.published)
    .slice(0, 3);

  return (
    <AdminLayout title="Dashboard Overview">
      {loading ? (
        <LoadingSpinner size="lg" text="Memuat ringkasan dashboard..." />
      ) : (
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-primary-700 via-primary-600 to-primary-800 text-white shadow-lg">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-400/20 text-accent-300 mb-2 border border-accent-400/30">
                Portal Pengelolaan Konten
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
                Selamat Datang, Admin
              </h2>
              <p className="mt-1 text-sm text-cream-200 max-w-xl">
                Kelola warisan budaya, publikasi berita kesenian, dan agenda perayaan kebudayaan Kabupaten Bengkulu Utara.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/admin/berita/tambah"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-primary-800 hover:bg-cream-100 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Berita
              </Link>
              <Link
                to="/admin/event/tambah"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-accent-400 text-dark-900 hover:bg-accent-300 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Event
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Berita */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-cream-200 dark:border-dark-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-dark-500 dark:text-dark-400">
                  Total Berita
                </span>
                <div className="text-3xl font-heading font-bold text-dark-900 dark:text-cream-100 mt-1">
                  {totalBerita}
                </div>
                <div className="mt-1 text-xs text-dark-400 dark:text-dark-500">
                  <span className="text-green-600 font-medium">{beritaPublished}</span> publish ·{' '}
                  <span className="text-dark-500">{beritaDraft}</span> draft
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Newspaper className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Total Event */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-cream-200 dark:border-dark-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-dark-500 dark:text-dark-400">
                  Total Event
                </span>
                <div className="text-3xl font-heading font-bold text-dark-900 dark:text-cream-100 mt-1">
                  {totalEvent}
                </div>
                <div className="mt-1 text-xs text-dark-400 dark:text-dark-500">
                  <span className="text-blue-600 font-medium">{eventUpcoming}</span> akan datang ·{' '}
                  <span className="text-gray-500">{eventCompleted}</span> selesai
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Berita Terpublikasi */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-cream-200 dark:border-dark-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-dark-500 dark:text-dark-400">
                  Berita Published
                </span>
                <div className="text-3xl font-heading font-bold text-dark-900 dark:text-cream-100 mt-1">
                  {beritaPublished}
                </div>
                <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  Tayang di Website
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Event Mendatang */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-cream-200 dark:border-dark-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-dark-500 dark:text-dark-400">
                  Event Upcoming
                </span>
                <div className="text-3xl font-heading font-bold text-dark-900 dark:text-cream-100 mt-1">
                  {eventUpcoming}
                </div>
                <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Agenda Mendatang
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Two-Column Section: Recent Berita & Upcoming Events */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Recent Berita Table */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-2xl border border-cream-200 dark:border-dark-700 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-heading font-semibold text-dark-900 dark:text-cream-100">
                      Berita Terbaru
                    </h3>
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      5 publikasi artikel terkini
                    </p>
                  </div>
                  <Link
                    to="/admin/berita"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 dark:text-primary-400 hover:underline"
                  >
                    Lihat Semua
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cream-200 dark:border-dark-700 text-[11px] font-semibold text-dark-500 dark:text-dark-400 uppercase">
                        <th className="pb-3 pr-4">Judul Artikel</th>
                        <th className="pb-3 px-4">Tanggal</th>
                        <th className="pb-3 pl-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100 dark:divide-dark-800 text-xs">
                      {recentBerita.length > 0 ? (
                        recentBerita.map((item) => (
                          <tr key={item.id} className="hover:bg-cream-50/50 dark:hover:bg-dark-800/40 transition-colors">
                            <td className="py-3 pr-4">
                              <Link
                                to={`/admin/berita/edit/${item.id}`}
                                className="font-medium text-dark-800 dark:text-cream-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1"
                              >
                                {item.judul}
                              </Link>
                              <span className="text-[11px] text-dark-400">
                                {item.kategori}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-dark-600 dark:text-dark-400 whitespace-nowrap">
                              {formatDateShort(item.tanggal || item.createdAt)}
                            </td>
                            <td className="py-3 pl-4 text-right whitespace-nowrap">
                              <StatusBadge published={item.published} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-dark-400">
                            Belum ada data berita.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-cream-100 dark:border-dark-800 text-right">
                <Link
                  to="/admin/berita/tambah"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Berita Baru
                </Link>
              </div>
            </div>

            {/* Right 1 Col: Upcoming Events List */}
            <div className="bg-white dark:bg-dark-900 rounded-2xl border border-cream-200 dark:border-dark-700 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-heading font-semibold text-dark-900 dark:text-cream-100">
                      Agenda Event
                    </h3>
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      3 kegiatan mendatang
                    </p>
                  </div>
                  <Link
                    to="/admin/event"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 dark:text-primary-400 hover:underline"
                  >
                    Kelola
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl border border-cream-200 dark:border-dark-700 bg-cream-50/50 dark:bg-dark-850/60 hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <Link
                            to={`/admin/event/edit/${evt.id}`}
                            className="text-xs font-semibold text-dark-900 dark:text-cream-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-1"
                          >
                            {evt.nama}
                          </Link>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${getStatusColor(
                              evt.status
                            )}`}
                          >
                            {getStatusLabel(evt.status)}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-dark-500 dark:text-dark-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-primary-600 dark:text-primary-400 shrink-0" />
                            <span>{formatDateShort(evt.tanggalMulai)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-accent-600 dark:text-accent-400 shrink-0" />
                            <span className="truncate">{evt.kecamatan || evt.lokasi}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-dark-400">
                      Belum ada event mendatang.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-cream-100 dark:border-dark-800 text-right">
                <Link
                  to="/admin/event/tambah"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Jadwal Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
