import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Utensils } from 'lucide-react';
import Badge from './Badge';

/**
 * Format date string safely into Indonesian format
 */
const formatCardDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Extract day and month for event date badge
 */
const getEventDateParts = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  const day = date.getDate();
  const month = date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
  return { day, month };
};

/**
 * Versatile Card component for culture, editorial stories, events, and culinary items.
 *
 * @param {Object} props
 * @param {'culture' | 'story' | 'event' | 'culinary'} [props.variant='culture'] - Card variant
 * @param {React.ReactNode} [props.children] - Optional custom children
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.to] - Router Link destination
 * @param {string} [props.image] - Image URL
 * @param {string} [props.title] - Card title / item name
 * @param {string} [props.subtitle] - Card subtitle (e.g. kecamatan or author)
 * @param {React.ReactNode | string} [props.badge] - Badge text or element
 * @param {string} [props.description] - Description or summary
 * @param {string} [props.date] - Date string for stories or events
 * @param {string} [props.location] - Location string for events
 * @param {'upcoming' | 'ongoing' | 'completed' | string} [props.status] - Status for events
 * @param {string} [props.author] - Author for stories
 */
export default function Card({
  variant = 'culture',
  children,
  className = '',
  to,
  image,
  title,
  subtitle,
  badge,
  description,
  date,
  location,
  status,
  author,
  ...props
}) {
  // Fallback placeholder image when none is provided
  const placeholderImg = `https://placehold.co/600x400/A0522D/FDF8F0?text=${encodeURIComponent(
    title || 'Bengkulu Utara'
  )}&font=playfair-display`;

  const displayImage = image || placeholderImg;

  // Render badge helper
  const renderBadge = (badgeContent, defaultVariant = 'kategori') => {
    if (!badgeContent) return null;
    if (typeof badgeContent === 'string') {
      return <Badge variant={defaultVariant}>{badgeContent}</Badge>;
    }
    return badgeContent;
  };

  // Base card motion wrapper
  const cardBody = (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group relative flex flex-col h-full bg-cream-50 dark:bg-dark-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-cream-200 dark:border-dark-700 transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 1. CULTURE VARIANT: Museum Catalog Feel */}
      {variant === 'culture' && (
        <>
          <div className="relative aspect-[16/10] overflow-hidden bg-cream-200 dark:bg-dark-700">
            <img
              src={displayImage}
              alt={title || 'Kebudayaan Bengkulu Utara'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = placeholderImg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

            {/* Badge on image */}
            {badge && (
              <div className="absolute top-3 left-3 z-10">
                {renderBadge(badge, 'kategori')}
              </div>
            )}

            {/* Subtitle / Kecamatan on bottom left of image */}
            {subtitle && (
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-sm text-cream-100 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                <span>{subtitle}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-heading font-bold text-lg md:text-xl text-dark-800 dark:text-cream-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 mb-2">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-dark-500 dark:text-dark-200 line-clamp-2 leading-relaxed mb-4 flex-1">
                {description}
              </p>
            )}

            <div className="pt-3 mt-auto border-t border-cream-200 dark:border-dark-700 flex items-center justify-between text-xs text-primary-700 dark:text-primary-400 font-medium">
              <span>Jelajahi Warisan Adat</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>

            {children}
          </div>
        </>
      )}

      {/* 2. STORY VARIANT: Editorial Magazine Feel */}
      {variant === 'story' && (
        <>
          <div className="relative aspect-[16/9] overflow-hidden bg-cream-200 dark:bg-dark-700">
            <img
              src={displayImage}
              alt={title || 'Berita Budaya'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = placeholderImg;
              }}
            />
            {badge && (
              <div className="absolute top-3 left-3 z-10">
                {renderBadge(badge, 'kategori')}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 p-5">
            {/* Metadata (Date & Author) */}
            {(date || author || subtitle) && (
              <div className="flex items-center gap-3 text-xs text-dark-400 dark:text-dark-300 mb-2.5">
                {date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span>{formatCardDate(date)}</span>
                  </span>
                )}
                {(author || subtitle) && (
                  <span>Oleh {author || subtitle}</span>
                )}
              </div>
            )}

            <h3 className="font-heading font-bold text-lg md:text-xl text-dark-800 dark:text-cream-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2 leading-snug">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-dark-600 dark:text-dark-300 line-clamp-3 leading-relaxed mb-4 flex-1">
                {description}
              </p>
            )}

            <div className="pt-3 mt-auto border-t border-cream-200 dark:border-dark-700 flex items-center justify-between text-xs text-primary-600 dark:text-primary-400 font-semibold">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>

            {children}
          </div>
        </>
      )}

      {/* 3. EVENT VARIANT: Event Schedule & Poster Feel */}
      {variant === 'event' && (
        <>
          <div className="relative aspect-[16/10] overflow-hidden bg-cream-200 dark:bg-dark-700">
            <img
              src={displayImage}
              alt={title || 'Acara Budaya'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = placeholderImg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

            {/* Date Badge Overlay (Calendar box on top-left) */}
            {date && getEventDateParts(date) && (
              <div className="absolute top-3 left-3 z-10 flex flex-col items-center justify-center w-12 h-13 rounded-lg bg-cream-50/95 dark:bg-dark-800/95 backdrop-blur-md shadow-md border border-cream-300 dark:border-dark-600 text-center leading-tight py-1">
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-tighter">
                  {getEventDateParts(date).month}
                </span>
                <span className="text-lg font-extrabold text-dark-800 dark:text-cream-50">
                  {getEventDateParts(date).day}
                </span>
              </div>
            )}

            {/* Status Badge overlay on top-right */}
            {status && (
              <div className="absolute top-3 right-3 z-10">
                <Badge variant={status}>{status}</Badge>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-heading font-bold text-lg text-dark-800 dark:text-cream-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-3">
              {title}
            </h3>

            <div className="space-y-1.5 text-xs text-dark-500 dark:text-dark-300 mb-4">
              {(location || subtitle) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                  <span className="line-clamp-1">{location || subtitle}</span>
                </div>
              )}
              {date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                  <span>{formatCardDate(date)}</span>
                </div>
              )}
            </div>

            {description && (
              <p className="text-sm text-dark-500 dark:text-dark-200 line-clamp-2 leading-relaxed mb-4 flex-1">
                {description}
              </p>
            )}

            <div className="pt-3 mt-auto border-t border-cream-200 dark:border-dark-700 flex items-center justify-between text-xs text-primary-700 dark:text-primary-400 font-medium">
              <span>Informasi Acara</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>

            {children}
          </div>
        </>
      )}

      {/* 4. CULINARY VARIANT: Gastronomy & Food Heritage Feel */}
      {variant === 'culinary' && (
        <>
          <div className="relative aspect-[4/3] overflow-hidden bg-cream-200 dark:bg-dark-700">
            <img
              src={displayImage}
              alt={title || 'Kuliner Tradisional Bengkulu Utara'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = placeholderImg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-50/90 dark:bg-dark-800/90 backdrop-blur-sm text-primary-700 dark:text-primary-300 text-xs font-medium shadow-sm">
              <Utensils className="w-3 h-3 text-primary-600 shrink-0" />
              <span>Kuliner Tradisional</span>
            </div>

            {badge && (
              <div className="absolute top-3 right-3 z-10">
                {renderBadge(badge, 'kategori')}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-heading font-bold text-xl text-dark-800 dark:text-cream-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-dark-600 dark:text-dark-200 line-clamp-3 leading-relaxed mb-4 flex-1">
                {description}
              </p>
            )}

            {children}
          </div>
        </>
      )}
    </motion.div>
  );

  // If 'to' is provided, wrap in React Router's Link
  if (to) {
    return (
      <Link to={to} className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl">
        {cardBody}
      </Link>
    );
  }

  return cardBody;
}
