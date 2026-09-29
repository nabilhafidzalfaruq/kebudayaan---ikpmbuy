import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import {
  getPlaceholderImage,
  getStatusLabel,
  getStatusColor,
  formatDateShort
} from '../../utils/helpers';

/**
 * Helper to extract day and short month for the date overlay badge
 * @param {string} dateString
 * @returns {{ day: string | number, month: string }}
 */
const parseEventDate = (dateString) => {
  if (!dateString) return { day: '01', month: 'EVT' };
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      const parts = dateString.split('-');
      return { day: parts[2] || '01', month: 'EVT' };
    }
    const day = d.getDate();
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
      'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
    ];
    const month = months[d.getMonth()] || 'EVT';
    return { day, month };
  } catch {
    return { day: '01', month: 'EVT' };
  }
};

/**
 * Event & Cultural Activities homepage section
 *
 * @param {Object} props
 * @param {Array} [props.eventsData=[]] - Array of event items
 */
export default function EventBudaya({ eventsData = [] }) {
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  // Extract unique kecamatan list from events
  const kecamatans = useMemo(() => {
    if (!Array.isArray(eventsData)) return ['Semua'];
    const unique = Array.from(
      new Set(eventsData.map((e) => e.kecamatan).filter(Boolean))
    );
    return ['Semua', ...unique];
  }, [eventsData]);

  // Filter events by selected kecamatan
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(eventsData)) return [];
    if (selectedFilter === 'Semua') return eventsData;
    return eventsData.filter((e) => e.kecamatan === selectedFilter);
  }, [eventsData, selectedFilter]);

  return (
    <section id="event-budaya" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
        >
          <span className="text-primary-600 dark:text-accent-400 font-semibold tracking-wider text-xs md:text-sm uppercase inline-block mb-2">
            EVENT & KEGIATAN
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-dark-800 dark:text-cream-100 tracking-tight">
            Agenda Budaya Bengkulu Utara
          </h2>
          <div className="w-16 h-1 bg-accent-400 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Kecamatan Filter Row */}
        {kecamatans.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 justify-start sm:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {kecamatans.map((kecamatan) => {
              const isActive = selectedFilter === kecamatan;
              return (
                <button
                  key={kecamatan}
                  type="button"
                  onClick={() => setSelectedFilter(kecamatan)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary-700 text-white shadow-md dark:bg-primary-600'
                      : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-cream-300 dark:border-dark-700 hover:bg-cream-200 dark:hover:bg-dark-700'
                  }`}
                >
                  {kecamatan}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white/60 dark:bg-dark-800/60 rounded-2xl border border-cream-300 dark:border-dark-700">
            <p className="text-gray-600 dark:text-gray-400">
              Tidak ada agenda budaya ditemukan untuk wilayah {selectedFilter}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map((event, index) => {
              const { day, month } = parseEventDate(event.tanggalMulai);
              const eventSlug = event.slug || event.id;

              return (
                <motion.article
                  key={event.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-cream-300/80 dark:border-dark-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image with Date Overlay */}
                  <div className="relative aspect-16/10 overflow-hidden bg-cream-200 dark:bg-dark-700">
                    <img
                      src={event.gambar || getPlaceholderImage(600, 380, event.nama)}
                      alt={event.nama}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getPlaceholderImage(600, 380, event.nama);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Day & Month Date Badge Overlay (top-left) */}
                    <div className="absolute top-4 left-4 bg-accent-400 text-dark-900 rounded-xl px-3 py-2 flex flex-col items-center justify-center shadow-lg min-w-[50px] z-10 select-none">
                      <span className="text-xl font-bold font-heading leading-none text-dark-900">
                        {day}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider leading-none mt-1 text-dark-800">
                        {month}
                      </span>
                    </div>

                    {/* Subtle Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    {/* Location and Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 truncate">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 dark:text-accent-400 shrink-0" />
                        <span className="truncate">{event.lokasi || 'Bengkulu Utara'}</span>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>

                    {/* Event Title */}
                    <h3 className="font-heading text-xl font-bold text-dark-800 dark:text-cream-100 group-hover:text-primary-600 dark:group-hover:text-accent-400 transition-colors mb-2 line-clamp-1">
                      <Link to={`/event/${eventSlug}`}>
                        {event.nama}
                      </Link>
                    </h3>

                    {/* Short Description (truncated 2 lines) */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-5">
                      {event.deskripsi}
                    </p>

                    {/* Card Footer / Link */}
                    <div className="mt-auto pt-4 border-t border-cream-200 dark:border-dark-700/80 flex items-center justify-between">
                      <Link
                        to={`/event/${eventSlug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 dark:text-accent-400 dark:hover:text-accent-300 group/link transition-colors"
                      >
                        <span>Selengkapnya</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>

                      {event.tanggalMulai && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateShort(event.tanggalMulai)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link to="/event">
            <Button variant="primary" size="lg" className="shadow-md hover:shadow-lg">
              <span>Semua Event</span>
              <Calendar className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
