import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Calendar,
  User,
  Share2,
  Check,
  Home,
  MessageCircle,
  Globe,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { formatDate, getPlaceholderImage } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NotFound from './NotFound';

/**
 * DetailBerita Page
 * Editorial news reading page with full-width cover, rich typography (.prose-budaya),
 * social sharing buttons, and 3 related news cards.
 */
export default function DetailBerita() {
  const { slug } = useParams();
  const { berita, loading } = useData();
  const [copied, setCopied] = useState(false);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Memuat artikel berita..." />
      </div>
    );
  }

  const beritaItem = berita?.find(
    (item) => item.slug === slug || String(item.id) === slug
  );

  if (!beritaItem) {
    return <NotFound />;
  }

  // Related news (exclude current item, up to 3)
  const relatedBerita = (berita || [])
    .filter((item) => item.slug !== beritaItem.slug && String(item.id) !== String(beritaItem.id))
    .slice(0, 3);

  const shareUrl = window.location.href;
  const shareTitle = `${beritaItem.judul} - Kabar Budaya Bengkulu Utara`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const coverImage =
    beritaItem.gambar || getPlaceholderImage(1200, 600, beritaItem.judul);

  return (
    <article className="min-h-screen bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      {/* 1. Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="bg-cream-200/60 dark:bg-dark-800/60 border-b border-cream-200 dark:border-dark-700/80 sticky top-16 md:top-20 z-20 backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
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
                to="/berita"
                className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Berita
              </Link>
            </li>
            <li className="flex items-center text-dark-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li
              className="text-primary-800 dark:text-accent-400 font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
              aria-current="page"
            >
              {beritaItem.judul}
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. Article Header & Meta */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
        <div className="mb-4">
          <Badge variant="kategori" size="md">
            {beritaItem.kategori}
          </Badge>
        </div>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-dark-800 dark:text-cream-50 leading-tight mb-6">
          {beritaItem.judul}
        </h1>

        {/* Author & Date Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cream-200 dark:border-dark-700/80">
          <div className="flex items-center gap-4 text-xs sm:text-sm text-dark-500 dark:text-dark-400">
            {beritaItem.penulis && (
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span>Oleh {beritaItem.penulis}</span>
              </div>
            )}
            {beritaItem.tanggal && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <time dateTime={beritaItem.tanggal}>
                  {formatDate(beritaItem.tanggal)}
                </time>
              </div>
            )}
          </div>

          {/* Social Share Icon Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-400 dark:text-dark-500 mr-1 hidden sm:inline">
              Bagikan:
            </span>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `${shareTitle} - ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-cream-200 hover:bg-cream-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 dark:text-cream-200 transition-colors"
              aria-label="Bagikan ke WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareTitle
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-cream-200 hover:bg-cream-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 dark:text-cream-200 transition-colors"
              aria-label="Bagikan ke Twitter/X"
            >
              <Globe className="w-4 h-4 text-sky-500" />
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-cream-200 hover:bg-cream-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-dark-700 dark:text-cream-200 transition-colors"
              aria-label="Bagikan ke Facebook"
            >
              <Mail className="w-4 h-4 text-blue-600" />
            </a>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-200 hover:bg-cream-300 dark:bg-dark-800 dark:hover:bg-dark-700 text-xs font-medium text-dark-700 dark:text-cream-200 transition-colors cursor-pointer"
              aria-label="Salin tautan berita"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Tersalin</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Cover Image (Full Width within container, max-h-[500px] object-cover) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-cream-200 dark:bg-dark-800 shadow-md">
          <img
            src={coverImage}
            alt={beritaItem.judul}
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(1200, 600, beritaItem.judul);
            }}
            className="w-full max-h-[500px] object-cover"
          />
          {beritaItem.ringkasan && (
            <div className="p-4 bg-cream-50/95 dark:bg-dark-800/95 border-t border-cream-200 dark:border-dark-700 italic text-xs sm:text-sm text-dark-600 dark:text-dark-300">
              &ldquo;{beritaItem.ringkasan}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* 4. Rich Article Content (Rendered in .prose-budaya) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="prose-budaya max-w-none text-dark-800 dark:text-cream-100 text-base sm:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: beritaItem.konten || `<p>${beritaItem.ringkasan}</p>` }}
        />

        {/* Back Link */}
        <div className="mt-12 pt-6 border-t border-cream-200 dark:border-dark-700/80">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Berita Budaya</span>
          </Link>
        </div>
      </section>

      {/* 5. Related Berita (3 Cards at bottom) */}
      {relatedBerita.length > 0 && (
        <section className="py-14 bg-cream-50 dark:bg-dark-800/60 border-t border-cream-200 dark:border-dark-700/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-dark-800 dark:text-cream-50">
                Berita Budaya Terkait
              </h2>
              <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1">
                Ikuti artikel dan wawasan kebudayaan lainnya di Bengkulu Utara
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedBerita.map((rel) => (
                <Card
                  key={rel.id || rel.slug}
                  variant="story"
                  to={`/berita/${rel.slug}`}
                  image={rel.gambar}
                  title={rel.judul}
                  subtitle={rel.penulis}
                  badge={rel.kategori}
                  date={rel.tanggal}
                  description={rel.ringkasan}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
