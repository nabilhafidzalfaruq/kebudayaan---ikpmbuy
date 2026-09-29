/**
 * Generate a slug from a string
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

/**
 * Format date short
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

/**
 * Get month name in Indonesian
 */
export const getMonthName = (monthNum) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthNum - 1] || '';
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Strip HTML tags from string
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Get status color for events
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'ongoing':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'completed':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
};

/**
 * Get status label in Indonesian
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'upcoming': return 'Akan Datang';
    case 'ongoing': return 'Berlangsung';
    case 'completed': return 'Selesai';
    default: return status;
  }
};

/**
 * Placeholder image URL generator
 */
export const getPlaceholderImage = (width = 800, height = 600, text = '') => {
  const encodedText = encodeURIComponent(text || `${width}x${height}`);
  return `https://placehold.co/${width}x${height}/A0522D/FDF8F0?text=${encodedText}&font=playfair-display`;
};

/**
 * Debounce function
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Scroll to element by ID
 */
export const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
