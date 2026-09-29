import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Button from '../ui/Button';
import { getPlaceholderImage } from '../../utils/helpers';

/**
 * CallToAction section inviting users to explore Bengkulu Utara culture
 */
export default function CallToAction() {
  const bgImage = getPlaceholderImage(1920, 800, 'CTA');

  return (
    <section className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mx-4 md:mx-8 lg:mx-16 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Visual Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Dark Hero Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient bg-dark-900/60" />

        {/* Centered Content */}
        <div className="relative z-10 py-20 px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl mx-auto font-bold leading-tight drop-shadow-md">
            Budaya Bengkulu Utara Akan Tetap Hidup Jika Kita Mengenalnya
          </h2>

          <p className="text-cream-200 text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Mulai perjalananmu mengenal budaya Bengkulu Utara hari ini.
          </p>

          <div className="mt-8 flex justify-center">
            <Link to="/jelajah">
              <Button
                variant="primary"
                size="lg"
                className="shadow-xl hover:shadow-2xl font-semibold gap-2"
              >
                <span>Jelajahi Bengkulu Utara</span>
                <Compass className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
