import { motion } from 'framer-motion';

/**
 * Minimalist cultural quote section for the homepage
 */
export default function CulturalQuote() {
  return (
    <section className="bg-pattern py-24 md:py-32 relative overflow-hidden bg-cream-100/60 dark:bg-dark-900/40 border-y border-cream-200/80 dark:border-dark-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Large decorative opening quote mark */}
          <span
            aria-hidden="true"
            className="font-heading text-8xl text-accent-400 opacity-30 leading-none select-none -mb-6 sm:-mb-8"
          >
            “
          </span>

          {/* Quote Text */}
          <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl italic text-primary-700 dark:text-cream-200 max-w-4xl mx-auto leading-relaxed">
            &ldquo;Budaya bukan hanya warisan masa lalu, tetapi cerita yang terus kita hidupkan di Bumi Sungkai.&rdquo;
          </blockquote>

          {/* Thin Horizontal Line */}
          <div className="w-16 h-0.5 bg-accent-400 mx-auto my-6 rounded-full" />

          {/* Attribution */}
          <p className="text-sm tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
            — Warisan Budaya Bengkulu Utara
          </p>
        </motion.div>
      </div>
    </section>
  );
}
