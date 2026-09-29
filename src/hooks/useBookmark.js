import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'budaya-bookmarks';

/**
 * Custom hook to manage bookmarked culture items using localStorage
 * 
 * @returns {{
 *   bookmarks: Array<string|number>,
 *   toggleBookmark: (id: string|number) => void,
 *   isBookmarked: (id: string|number) => boolean,
 *   clearBookmarks: () => void,
 *   totalBookmarks: number
 * }}
 */
export const useBookmark = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error reading bookmarks from localStorage:', err);
      return [];
    }
  });

  // Persist bookmarks to localStorage on changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (err) {
      console.error('Error persisting bookmarks to localStorage:', err);
    }
  }, [bookmarks]);

  // Sync across tabs/windows using storage event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY && event.newValue !== null) {
        try {
          const updated = JSON.parse(event.newValue);
          if (Array.isArray(updated)) {
            setBookmarks(updated);
          }
        } catch (err) {
          console.error('Error syncing bookmarks from storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Toggle a culture item bookmark status
   * @param {string|number} id
   */
  const toggleBookmark = useCallback((id) => {
    if (id === undefined || id === null) return;
    setBookmarks((prev) => {
      const idStr = String(id);
      const exists = prev.some((item) => String(item) === idStr);
      if (exists) {
        return prev.filter((item) => String(item) !== idStr);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  /**
   * Check if an item is bookmarked
   * @param {string|number} id
   * @returns {boolean}
   */
  const isBookmarked = useCallback((id) => {
    if (id === undefined || id === null) return false;
    const idStr = String(id);
    return bookmarks.some((item) => String(item) === idStr);
  }, [bookmarks]);

  /**
   * Remove all bookmarks
   */
  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
    totalBookmarks: bookmarks.length
  };
};

export default useBookmark;
