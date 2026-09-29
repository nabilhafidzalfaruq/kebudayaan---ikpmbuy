import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Share2, Check, Home } from 'lucide-react';
import { useData } from '../context/FirebaseContext';
import { useBookmark } from '../hooks/useBookmark';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DetailHero from '../components/detail/DetailHero';
import DetailContent from '../components/detail/DetailContent';
import GaleriFoto from '../components/detail/GaleriFoto';
import RelatedCulture from '../components/detail/RelatedCulture';
import NotFound from './NotFound';

/**
 * DetailBudaya Page
 * Digital museum style detail view for a cultural heritage asset.
 */
export default function DetailBudaya() {
  const { slug } = useParams();
  const { budaya, loading } = useData();
  const { isBookmarked, toggleBookmark } = useBookmark();
  const [copied, setCopied] = useState(false);

  // Always scroll to top when slug changes or component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Memuat dokumentasi budaya..." />
      </div>
    );
  }

  // Find the culture item by slug (or id as fallback)
  const budayaItem = budaya?.find(
    (item) => item.slug === slug || String(item.id) === slug
  );

  if (!budayaItem) {
    return <NotFound />;
  }

  const itemId = budayaItem.id || budayaItem.slug;
  const bookmarked = isBookmarked(itemId);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${budayaItem.nama} - Warisan Budaya Bengkulu Utara`,
          text: budayaItem.ringkasan || budayaItem.deskripsi,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Action buttons (Bookmark & Share) to pass into DetailHero
  const actionButtons = (
    <div className="flex items-center gap-2">
      {/* Bookmark Button */}
      <button
        onClick={() => toggleBookmark(itemId)}
        aria-label={bookmarked ? 'Hapus dari koleksi' : 'Simpan ke koleksi'}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-md shadow-sm cursor-pointer ${
          bookmarked
            ? 'bg-rose-600 text-white shadow-rose-900/30'
            : 'bg-black/40 hover:bg-black/60 text-cream-100 hover:text-rose-300 border border-white/20'
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${
            bookmarked ? 'fill-white text-white' : 'text-cream-100'
          }`}
        />
        <span>{bookmarked ? 'Tersimpan' : 'Simpan'}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        aria-label="Bagikan informasi budaya ini"
        className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium bg-black/40 hover:bg-black/60 text-cream-100 border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300">Tersalin!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Bagikan</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      {/* Breadcrumb Bar */}
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
                to="/jelajah"
                className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Jelajah Budaya
              </Link>
            </li>
            <li className="flex items-center text-dark-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li
              className="text-primary-800 dark:text-accent-400 font-semibold truncate max-w-[220px] sm:max-w-xs md:max-w-md"
              aria-current="page"
            >
              {budayaItem.nama}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <DetailHero
        nama={budayaItem.nama}
        kecamatan={budayaItem.kecamatan}
        kategori={budayaItem.kategori}
        gambar={budayaItem.gambar}
        actions={actionButtons}
      />

      {/* Main Structured Museum Content */}
      <DetailContent
        deskripsi={budayaItem.deskripsi}
        sejarah={budayaItem.sejarah}
        filosofi={budayaItem.filosofi}
        proses={budayaItem.proses}
        faktaMenarik={budayaItem.faktaMenarik}
      />

      {/* Photo Gallery Grid with Lightbox */}
      <GaleriFoto galeri={budayaItem.galeri} nama={budayaItem.nama} />

      {/* Related Cultural Items from the same District */}
      <RelatedCulture
        budayaData={budaya}
        currentSlug={budayaItem.slug}
        currentKecamatan={budayaItem.kecamatan}
      />
    </div>
  );
}
