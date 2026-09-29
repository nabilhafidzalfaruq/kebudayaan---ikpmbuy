import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { uploadImage } from '../../firebase/services/storageService';
import { isFirebaseConfigured } from '../../firebase/config';

/**
 * Image upload component supporting drag & drop, file picker, and manual URL input
 *
 * @param {Object} props
 * @param {string} props.value - Current image URL
 * @param {(url: string) => void} props.onChange - Change handler returning new URL
 * @param {string} [props.folder='uploads'] - Storage folder prefix
 */
export default function ImageUploader({
  value = '',
  onChange,
  folder = 'uploads'
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [manualUrl, setManualUrl] = useState(value || '');
  const [showManualInput, setShowManualInput] = useState(Boolean(!isFirebaseConfigured || value));
  const fileInputRef = useRef(null);

  /**
   * Handle file upload process
   * @param {File} file
   */
  const handleFile = async (file) => {
    if (!file) return;

    // Validate image mime type
    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya file gambar yang diperbolehkan (JPG, PNG, WebP, dll).');
      return;
    }

    // Check Firebase configuration
    if (!isFirebaseConfigured) {
      setUploadError('Firebase Storage belum dikonfigurasi. Silakan gunakan opsi URL langsung.');
      setShowManualInput(true);
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const url = await uploadImage(file, folder);
      if (onChange) {
        onChange(url);
      }
      setManualUrl(url);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Gagal mengunggah gambar. Periksa koneksi dan konfigurasi Firebase Storage.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    if (onChange) onChange('');
    setManualUrl('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualApply = () => {
    if (onChange) onChange(manualUrl.trim());
  };

  return (
    <div className="space-y-3">
      {/* Firebase not configured warning */}
      {!isFirebaseConfigured && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-lg text-xs border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Firebase Storage belum dikonfigurasi. Anda dapat memasukkan URL gambar secara manual di bawah.</span>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Current Image Preview */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-cream-300 dark:border-dark-700 bg-cream-100/50 dark:bg-dark-800 max-w-md">
          <div className="aspect-video w-full overflow-hidden bg-cream-200 dark:bg-dark-900 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400/A0522D/FDF8F0?text=Gambar+Tidak+Ditemukan';
              }}
            />
          </div>

          {/* Action overlay */}
          <div className="p-3 flex items-center justify-between gap-3 bg-white dark:bg-dark-800 border-t border-cream-200 dark:border-dark-700">
            <span className="text-xs text-dark-500 dark:text-dark-400 truncate max-w-[220px]" title={value}>
              {value}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2.5 py-1 text-xs font-medium text-primary-700 dark:text-primary-400 hover:bg-cream-100 dark:hover:bg-dark-700 rounded-md transition-colors cursor-pointer"
              >
                Ganti
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors cursor-pointer"
                title="Hapus gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
              : 'border-cream-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-500 bg-cream-50/50 dark:bg-dark-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-cream-200/80 dark:bg-dark-800 flex items-center justify-center text-primary-600 dark:text-primary-400">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            {isUploading ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-dark-800 dark:text-cream-100">
                  Mengunggah gambar...
                </p>
                <p className="text-xs text-dark-500 dark:text-dark-400">
                  Harap tunggu beberapa saat
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-dark-800 dark:text-cream-100">
                  Klik untuk unggah atau seret file gambar ke sini
                </p>
                <p className="text-xs text-dark-500 dark:text-dark-400">
                  PNG, JPG, JPEG, atau WebP (maks. 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual URL Input Option */}
      <div className="pt-1">
        {!showManualInput && !value ? (
          <button
            type="button"
            onClick={() => setShowManualInput(true)}
            className="inline-flex items-center gap-1.5 text-xs text-primary-700 dark:text-primary-400 hover:underline cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Atau gunakan URL gambar langsung
          </button>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-medium text-dark-600 dark:text-dark-300">
              URL Gambar (Eksternal / Path lokal)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                onBlur={handleManualApply}
                placeholder="https://example.com/gambar.jpg atau /images/..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-800 dark:text-cream-100 focus:outline-hidden focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleManualApply}
                className="px-3 py-1.5 text-xs font-medium bg-cream-200 dark:bg-dark-700 hover:bg-cream-300 dark:hover:bg-dark-600 text-dark-800 dark:text-cream-100 rounded-lg transition-colors cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
