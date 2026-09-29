import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Delete confirmation modal with framer-motion animations
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility status
 * @param {() => void} props.onClose - Close callback
 * @param {() => void} props.onConfirm - Confirm delete callback
 * @param {string} [props.itemName] - Name of the item to be deleted
 * @param {boolean} [props.isLoading] - Loading state during delete
 */
export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'item ini',
  isLoading = false
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark-900/60 backdrop-blur-xs"
            onClick={isLoading ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-2xl border border-cream-200 dark:border-dark-700 z-10 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-delete-title"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  id="modal-delete-title"
                  className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100"
                >
                  Hapus Item
                </h3>
                <p className="mt-2 text-sm text-dark-500 dark:text-dark-300 leading-relaxed">
                  Apakah Anda yakin ingin menghapus{' '}
                  <span className="font-semibold text-dark-800 dark:text-cream-100 break-words">
                    "{itemName}"
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-dark-700 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
