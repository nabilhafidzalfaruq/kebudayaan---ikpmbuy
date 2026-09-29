import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import SearchModal from '../ui/SearchModal';
import { useTheme } from '../../hooks/useTheme';

export default function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-dark-900 text-dark-800 dark:text-cream-100 transition-colors duration-300">
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        onThemeToggle={toggleTheme}
        isDark={isDark}
      />
      <main className="flex-1 min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
