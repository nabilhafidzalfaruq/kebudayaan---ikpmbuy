import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Navbar({ onSearchOpen, onThemeToggle, isDark: propIsDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback to useTheme if props are not provided
  const themeHook = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : themeHook.isDark;
  const toggleTheme = onThemeToggle || themeHook.toggleTheme;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Jelajah Budaya', href: '/jelajah' },
    { label: 'Komoditas', href: '/komoditas' },
    { label: 'Kecamatan', href: '#peta' },
    { label: 'Berita', href: '/berita' },
    { label: 'Event', href: '/event' },
    { label: 'Kuliner', href: '#kuliner' },
    { label: 'Tentang', href: '#tentang' },
  ];

  const handleNavClick = (href, e) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const targetId = href.replace('#', '');

      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        if (!targetId) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    } else if (href === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const isLinkActive = (href) => {
    if (href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (href.startsWith('#')) {
      return location.pathname === '/' && location.hash === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream-100/90 dark:bg-dark-800/90 backdrop-blur-md shadow-md border-b border-cream-300/60 dark:border-dark-700/60 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => handleNavClick('/', e)}
            className="flex flex-col group focus:outline-hidden"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider text-dark-900 dark:text-cream-100 group-hover:text-primary-700 dark:group-hover:text-accent-400 transition-colors">
                BENGKULU UTARA
              </span>
            </div>
            {/* Subtle gold accent line */}
            <div className="h-0.5 w-12 bg-linear-to-r from-accent-400 via-primary-600 to-transparent rounded-full group-hover:w-full transition-all duration-300" />
            <span className="text-[10px] tracking-widest text-primary-700 dark:text-accent-400 font-semibold uppercase mt-0.5">
              Bumi Sungkai
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg group ${
                    active
                      ? 'text-primary-700 dark:text-accent-400 font-semibold'
                      : 'text-dark-700 dark:text-cream-200 hover:text-primary-700 dark:hover:text-accent-400'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-700 dark:bg-accent-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Search, Theme Toggle, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              type="button"
              onClick={onSearchOpen}
              aria-label="Buka Pencarian"
              className="p-2 rounded-full text-dark-700 dark:text-cream-200 hover:text-primary-700 dark:hover:text-accent-400 hover:bg-cream-200/80 dark:hover:bg-dark-700 transition-colors focus:outline-hidden cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              className="p-2 rounded-full text-dark-700 dark:text-cream-200 hover:text-primary-700 dark:hover:text-accent-400 hover:bg-cream-200/80 dark:hover:bg-dark-700 transition-colors focus:outline-hidden cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-accent-400 animate-fade-in" />
              ) : (
                <Moon className="w-5 h-5 text-dark-700 animate-fade-in" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              className="lg:hidden p-2 rounded-lg text-dark-800 dark:text-cream-100 hover:bg-cream-200/80 dark:hover:bg-dark-700 transition-colors focus:outline-hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark-900/60 backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm h-full bg-cream-100 dark:bg-dark-800 shadow-2xl border-l border-cream-300 dark:border-dark-700 flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-cream-200 dark:border-dark-700 flex items-center justify-between">
                <div>
                  <span className="font-heading text-lg font-bold tracking-wider text-dark-900 dark:text-cream-100">
                    BENGKULU UTARA
                  </span>
                  <p className="text-xs text-primary-700 dark:text-accent-400 font-semibold">
                    Warisan Budaya Bumi Sungkai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Tutup menu navigasi"
                  className="p-2 rounded-lg text-dark-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-dark-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navItems.map((item) => {
                  const active = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={(e) => handleNavClick(item.href, e)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        active
                          ? 'bg-primary-700 text-white font-semibold shadow-xs'
                          : 'text-dark-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-dark-700 hover:text-primary-700 dark:hover:text-accent-400'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-5 border-t border-cream-200 dark:border-dark-700 bg-cream-200/50 dark:bg-dark-900/40 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSearchOpen) onSearchOpen();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cream-100 dark:bg-dark-700 border border-cream-300 dark:border-dark-600 text-dark-800 dark:text-cream-100 text-sm font-medium hover:bg-cream-200 transition-colors"
                >
                  <Search className="w-4 h-4 text-primary-700 dark:text-accent-400" />
                  <span>Pencarian Budaya</span>
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cream-100 dark:bg-dark-700 border border-cream-300 dark:border-dark-600 text-dark-800 dark:text-cream-100 text-sm font-medium hover:bg-cream-200 transition-colors"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-accent-400" />
                      <span>Mode Terang</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-dark-700" />
                      <span>Mode Gelap</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
