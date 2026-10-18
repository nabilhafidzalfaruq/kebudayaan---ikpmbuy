/**
 * Navigation and Section Visibility Settings for Bengkulu Utara Culture Website
 */

export const DEFAULT_NAV_SETTINGS = {
  beranda: {
    id: 'beranda',
    label: 'Beranda',
    href: '/',
    visible: true,
    description: 'Halaman utama dan hero section'
  },
  jelajah: {
    id: 'jelajah',
    label: 'Jelajah Budaya',
    href: '/jelajah',
    visible: true,
    description: 'Katalog dan pencarian ensiklopedia budaya'
  },
  komoditas: {
    id: 'komoditas',
    label: 'Komoditas',
    href: '/komoditas',
    visible: true,
    description: 'Potensi ekonomi & komoditas unggulan daerah'
  },
  kecamatan: {
    id: 'kecamatan',
    label: 'Kecamatan',
    href: '#peta',
    visible: true,
    description: 'Peta interaktif 19 kecamatan Bengkulu Utara'
  },
  berita: {
    id: 'berita',
    label: 'Berita',
    href: '/berita',
    visible: true,
    description: 'Warta, artikel editorial, dan liputan kebudayaan'
  },
  event: {
    id: 'event',
    label: 'Event',
    href: '/event',
    visible: true,
    description: 'Kalender festival dan agenda perayaan'
  },
  kuliner: {
    id: 'kuliner',
    label: 'Kuliner',
    href: '#kuliner',
    visible: true,
    description: 'Seksi santapan tradisional khas Rejang'
  },
  tentang: {
    id: 'tentang',
    label: 'Tentang',
    href: '#tentang',
    visible: true,
    description: 'Informasi visi pelestarian budaya Bumi Sungkai'
  }
};

const STORAGE_KEY = 'bu_nav_settings';

/**
 * Get current navigation visibility settings
 * @returns {Record<string, { id: string, label: string, href: string, visible: boolean, description: string }>}
 */
export const getNavSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_NAV_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Error reading nav settings from localStorage:', err);
  }
  return { ...DEFAULT_NAV_SETTINGS };
};

/**
 * Save navigation visibility settings
 * @param {Object} newSettings
 */
export const saveNavSettings = (newSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    // Dispatch custom event to notify components in the current window
    window.dispatchEvent(new CustomEvent('bu-nav-settings-changed', { detail: newSettings }));
  } catch (err) {
    console.error('Error saving nav settings to localStorage:', err);
  }
};

/**
 * Reset navigation visibility settings to defaults
 */
export const resetNavSettings = () => {
  saveNavSettings(DEFAULT_NAV_SETTINGS);
  return { ...DEFAULT_NAV_SETTINGS };
};
