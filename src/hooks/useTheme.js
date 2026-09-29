import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'budaya-theme';

/**
 * Determine initial dark mode state from localStorage or system preferences
 * @returns {boolean}
 */
const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;

    // Fallback to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (err) {
    console.error('Error reading theme preference from localStorage:', err);
    return false;
  }
};

/**
 * Custom hook to manage Dark/Light theme mode
 * Synchronizes with document.documentElement ('dark' class) and localStorage ('budaya-theme')
 * 
 * @returns {{
 *   isDark: boolean,
 *   toggleTheme: () => void,
 *   theme: 'dark' | 'light',
 *   setTheme: (mode: 'dark' | 'light') => void
 * }}
 */
export const useTheme = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  // Apply 'dark' class to document.documentElement and save to localStorage
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try {
        localStorage.setItem(THEME_KEY, 'dark');
      } catch (err) {
        console.error('Error saving theme to localStorage:', err);
      }
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem(THEME_KEY, 'light');
      } catch (err) {
        console.error('Error saving theme to localStorage:', err);
      }
    }
  }, [isDark]);

  // Listen for system theme changes if user hasn't explicitly overridden
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const saved = localStorage.getItem(THEME_KEY);
      if (!saved) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setTheme = useCallback((mode) => {
    setIsDark(mode === 'dark');
  }, []);

  return {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light',
    setTheme
  };
};

export default useTheme;
