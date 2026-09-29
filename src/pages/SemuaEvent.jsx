import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, RotateCcw } from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const STATUS_TABS = [
  { id: 'semua', label: 'Semua Status' },
  { id: 'upcoming', label: 'Akan Datang' },
  { id: 'ongoing', label: 'Berlangsung' },
  { id: 'completed', label: 'Selesai' }
];

/**
 * SemuaEvent Page
 * Complete calendar and directory of cultural events, festivals, and traditional ceremonies.
 */
export default function SemuaEvent() {
  const { events, kecamatan, loading } = useData();

  const [activeTab, setActiveTab] = useState('semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');

  // Filter events based on active status tab and district
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    return events.filter((item) => {
      if (!item) return false;

      // Status filter
      if (activeTab !== 'semua') {
        const itemStatus = (item.status || '').toLowerCase().trim();
        if (itemStatus !== activeTab) return false;
      }

      // Kecamatan filter
      if (selectedKecamatan && selectedKecamatan !== 'Semua') {
        const itemKec = (item.kecamatan || '').toLowerCase().trim();
        const selKec = selectedKecamatan.toLowerCase().trim();
        if (itemKec !== selKec) return false;
      }

      return true;
    });
  }, [events, activeTab, selectedKecamatan]);

  const handleReset = () => {
    setActiveTab('semua');
    setSelectedKecamatan('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Memuat jadwal festival budaya..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      {/* 1. Small Hero Banner */}
      <section className="relative py-14 sm:py-20 bg-dark-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-dark-900 to-primary-950 opacity-90" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/20 border border-accent-400/30 text-accent-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Agenda Adat & Seni Daerah</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-cream-50 leading-tight mb-3">
              Event & Kegiatan Budaya
            </h1>

            <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl mx-auto leading-relaxed">
              Saksikan kemeriahan festival tahunan, ritual sakral, pawai adat kolosal, dan pentas kreasi daerah di seantero Bengkulu Utara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Controls & Filter Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-cream-200 dark:border-dark-800">
          {/* Status Tabs */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary-700 text-white shadow-sm font-semibold'
                    : 'bg-cream-200/80 dark:bg-dark-800 text-dark-700 dark:text-cream-200 hover:bg-cream-300 dark:hover:bg-dark-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Kecamatan Dropdown Filter */}
          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="relative flex items-center w-full md:w-60">
              <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-cream-50 dark:bg-dark-800 border border-cream-200 dark:border-dark-700 text-dark-700 dark:text-cream-200 focus:outline-none focus:ring-1 focus:ring-primary-600 cursor-pointer"
                aria-label="Filter event berdasarkan Kecamatan"
              >
                <option value="">Semua Kecamatan</option>
                {kecamatan?.map((kec) => (
                  <option key={kec.id || kec.nama} value={kec.nama}>
                    {kec.nama}
                  </option>
                ))}
              </select>
            </div>

            {(activeTab !== 'semua' || selectedKecamatan) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-primary-700 dark:text-primary-400 hover:underline cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mb-6">
          Menampilkan <span className="font-semibold text-dark-800 dark:text-cream-100">{filteredEvents.length}</span> kegiatan budaya
        </div>

        {/* 3. Event Cards Grid: 3 cols desktop, 1 mobile */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((item) => (
              <Card
                key={item.id || item.slug}
                variant="event"
                to={`/event/${item.slug}`}
                image={item.gambar}
                title={item.nama}
                location={item.lokasi || item.kecamatan}
                subtitle={item.kecamatan}
                date={item.tanggalMulai}
                status={item.status}
                description={item.deskripsi}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-cream-50 dark:bg-dark-800 rounded-2xl border border-cream-200 dark:border-dark-700 p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-cream-200 dark:bg-dark-700 flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-dark-800 dark:text-cream-100 mb-2">
              Tidak ada kegiatan ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-300 mb-6">
              Tidak ada agenda budaya untuk status atau kecamatan yang Anda tentukan saat ini.
            </p>
            <Button variant="primary" size="sm" onClick={handleReset}>
              Lihat Semua Kegiatan
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
