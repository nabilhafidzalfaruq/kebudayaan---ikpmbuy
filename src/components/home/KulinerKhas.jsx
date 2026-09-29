import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { getPlaceholderImage } from '../../utils/helpers';

/**
 * Horizontal scrollable culinary section for the homepage
 *
 * @param {Object} props
 * @param {Array} [props.kulinerData=[]] - Array of culinary items
 */
export default function KulinerKhas({ kulinerData = [] }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position and determine chevron visibility
  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const hasOverflow = scrollWidth > clientWidth + 4;

    setCanScrollLeft(hasOverflow && scrollLeft > 10);
    setCanScrollRight(hasOverflow && scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Small delay to allow layout recalculation after images or font rendering
    const timer = setTimeout(updateScrollState, 100);

    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [kulinerData, updateScrollState]);

  // Scroll by card width
  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320 + 24; // card width (w-80 = 320px) + gap-6 (24px)
    container.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth'
    });
  };

  return (
    <section id="kuliner" className="py-16 md:py-24 bg-cream-100/50 dark:bg-dark-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 text-primary-600 dark:text-accent-400 font-semibold tracking-wider text-xs md:text-sm uppercase mb-2">
            <Utensils className="w-4 h-4" />
            <span>Kuliner Khas</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-dark-800 dark:text-cream-100 tracking-tight">
            Cita Rasa Bumi Sungkai
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Nikmati kelezatan makanan tradisional Bengkulu Utara yang kaya akan rempah dan cita rasa.
          </p>
          <div className="w-16 h-1 bg-accent-400 mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Scrollable Container Wrapper with Absolute Chevrons */}
        <div className="relative group/scroll">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Gulir ke kiri"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-dark-800/95 text-dark-800 dark:text-cream-100 shadow-xl border border-cream-300 dark:border-dark-700 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-dark-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <ChevronLeft className="w-6 h-6 text-primary-700 dark:text-accent-400" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Gulir ke kanan"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-dark-800/95 text-dark-800 dark:text-cream-100 shadow-xl border border-cream-300 dark:border-dark-700 flex items-center justify-center hover:bg-cream-100 dark:hover:bg-dark-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <ChevronRight className="w-6 h-6 text-primary-700 dark:text-accent-400" />
            </button>
          )}

          {/* Horizontal Scroll Track */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto flex gap-6 snap-x snap-mandatory py-4 px-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {kulinerData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="snap-center shrink-0 w-72 sm:w-80 bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border border-cream-300/80 dark:border-dark-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group/card"
              >
                {/* Square-ish Image (4:3 aspect ratio) */}
                <div className="relative aspect-4/3 overflow-hidden bg-cream-200 dark:bg-dark-700">
                  <img
                    src={item.gambar || getPlaceholderImage(600, 450, item.nama)}
                    alt={item.nama}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getPlaceholderImage(600, 450, item.nama);
                    }}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Culinary Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-heading text-xl font-bold text-dark-800 dark:text-cream-100 mb-2 group-hover/card:text-primary-600 dark:group-hover/card:text-accent-400 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
