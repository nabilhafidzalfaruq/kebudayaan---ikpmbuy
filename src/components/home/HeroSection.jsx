import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, MapPin, ArrowRight } from 'lucide-react';
import { getPlaceholderImage } from '../../utils/helpers';

export default function HeroSection() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  const scrollToPeta = (e) => {
    e.preventDefault();
    const el = document.getElementById('peta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const heroImageUrl = getPlaceholderImage(1920, 1080, 'Bengkulu Utara');

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-dark-900 pt-24 pb-12">
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute -top-24 -bottom-24 inset-x-0 w-full h-[120%] pointer-events-none"
      >
        <img
          src={heroImageUrl}
          alt="Bengkulu Utara Landscape"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Dark & Gradient Overlays */}
        <div className="absolute inset-0 bg-dark-900/60" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-radial from-transparent via-dark-900/40 to-dark-900/80" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12 flex flex-col items-center lg:items-start text-center lg:text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: contentOpacity }}
          className="max-w-4xl space-y-6"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
            <span className="h-0.5 w-8 bg-accent-400 rounded-full hidden sm:inline-block" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-accent-400 uppercase">
              JELAJAH BUDAYA BENGKULU UTARA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-[1.15] drop-shadow-md"
          >
            Kenali Budaya,<br className="hidden sm:inline" /> Temukan Cerita<br />
            <span className="text-gradient">Bumi Sungkai</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-cream-200 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed drop-shadow-xs"
          >
            Jelajahi kekayaan tradisi, kesenian, kuliner, aksara, dan warisan budaya Bengkulu Utara dari Arga Makmur hingga Enggano.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
          >
            <Link
              to="/jelajah"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary-700 hover:bg-primary-600 text-white font-medium text-base shadow-xl hover:shadow-primary-700/50 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300 text-accent-400" />
              <span>Mulai Menjelajah</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#peta"
              onClick={scrollToPeta}
              className="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-cream-100/70 hover:border-white text-white hover:bg-white/10 backdrop-blur-xs font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-accent-400 group-hover:scale-110 transition-transform" />
              <span>Lihat Peta Kecamatan</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Bar at Bottom */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-dark-800/70 backdrop-blur-md border border-cream-200/15 rounded-2xl py-4 sm:py-5 px-6 sm:px-12 shadow-2xl flex flex-wrap items-center justify-around gap-4 text-cream-200"
        >
          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-accent-400">12+</span>
            <span className="text-xs sm:text-sm text-cream-200 font-medium tracking-wide">Budaya</span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-cream-200/20" />

          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-accent-400">19</span>
            <span className="text-xs sm:text-sm text-cream-200 font-medium tracking-wide">Kecamatan</span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-cream-200/20" />

          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-accent-400">8</span>
            <span className="text-xs sm:text-sm text-cream-200 font-medium tracking-wide">Kategori</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
