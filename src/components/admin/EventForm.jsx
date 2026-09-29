import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { slugify } from '../../utils/helpers';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

const KECAMATAN_LIST = [
  'Arga Makmur',
  'Arma Jaya',
  'Hulu Palik',
  'Kerkap',
  'Tanjung Agung Palik',
  'Air Napal',
  'Air Besi',
  'Lais',
  'Air Padang',
  'Batik Nau',
  'Padang Jaya',
  'Enggano',
  'Giri Mulya',
  'Ketahun',
  'Pinang Raya',
  'Ulok Kupai',
  'Napal Putih',
  'Putri Hijau',
  'Marga Sakti Sebelat'
];

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Akan Datang (Upcoming)' },
  { value: 'ongoing', label: 'Sedang Berlangsung (Ongoing)' },
  { value: 'completed', label: 'Selesai (Completed)' }
];

/**
 * EventForm component for creating and editing cultural events
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Existing event data for edit mode
 * @param {(formData: Object) => Promise<void> | void} props.onSubmit - Submit callback
 * @param {boolean} [props.isLoading=false] - Loading indicator
 */
export default function EventForm({
  initialData,
  onSubmit,
  isLoading = false
}) {
  const navigate = useNavigate();
  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    nama: '',
    slug: '',
    lokasi: '',
    kecamatan: KECAMATAN_LIST[0],
    tanggalMulai: '',
    tanggalSelesai: '',
    status: 'upcoming',
    deskripsi: '',
    konten: '',
    gambar: '',
    published: true
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || '',
        slug: initialData.slug || '',
        lokasi: initialData.lokasi || '',
        kecamatan: initialData.kecamatan || KECAMATAN_LIST[0],
        tanggalMulai: initialData.tanggalMulai || '',
        tanggalSelesai: initialData.tanggalSelesai || '',
        status: initialData.status || 'upcoming',
        deskripsi: initialData.deskripsi || '',
        konten: initialData.konten || '',
        gambar: initialData.gambar || '',
        published: initialData.published !== undefined ? Boolean(initialData.published) : true
      });
      setIsSlugManuallyEdited(true);
    }
  }, [initialData]);

  const handleNamaChange = (e) => {
    const newNama = e.target.value;
    setFormData((prev) => ({
      ...prev,
      nama: newNama,
      slug: !isSlugManuallyEdited ? slugify(newNama) : prev.slug
    }));

    if (errors.nama) {
      setErrors((prev) => ({ ...prev, nama: null }));
    }
  };

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama event wajib diisi.';
    }
    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi event wajib diisi.';
    }
    if (!formData.tanggalMulai) {
      newErrors.tanggalMulai = 'Tanggal mulai event wajib ditentukan.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Derive month index for filtering
    const monthNum = formData.tanggalMulai
      ? parseInt(formData.tanggalMulai.split('-')[1], 10)
      : new Date().getMonth() + 1;

    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.nama),
      bulan: monthNum
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Errors alert */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Periksa kolom wajib berikut:</p>
            <ul className="list-disc list-inside mt-1 text-xs space-y-0.5">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Info Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 sm:p-8 border border-cream-300 dark:border-dark-700 shadow-xs space-y-6">
        <h2 className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Informasi Event
        </h2>

        {/* Nama Event */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
            Nama Event <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            onChange={handleNamaChange}
            placeholder="Contoh: Rafflesia Kemumu Festival 2026"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden transition-all ${
              errors.nama
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-cream-300 dark:border-dark-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          {errors.nama && (
            <p className="mt-1 text-xs text-red-500">{errors.nama}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">
            Slug URL (otomatis dibuat dari nama)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="rafflesia-kemumu-festival-2026"
            className="w-full px-4 py-2 text-xs font-mono rounded-lg border border-cream-200 dark:border-dark-700 bg-cream-50 dark:bg-dark-950 text-dark-600 dark:text-dark-300 focus:outline-hidden focus:border-primary-400"
          />
        </div>

        {/* Lokasi & Kecamatan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Lokasi / Tempat Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lokasi}
              onChange={(e) => {
                setFormData({ ...formData, lokasi: e.target.value });
                if (errors.lokasi) setErrors({ ...errors, lokasi: null });
              }}
              placeholder="Contoh: Palak Siring Kemumu, Arga Makmur"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden transition-all ${
                errors.lokasi
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-cream-300 dark:border-dark-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
              }`}
            />
            {errors.lokasi && (
              <p className="mt-1 text-xs text-red-500">{errors.lokasi}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Kecamatan
            </label>
            <select
              value={formData.kecamatan}
              onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-800 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              {KECAMATAN_LIST.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tanggal & Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Tanggal Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.tanggalMulai}
              onChange={(e) => {
                setFormData({ ...formData, tanggalMulai: e.target.value });
                if (errors.tanggalMulai) setErrors({ ...errors, tanggalMulai: null });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden transition-all ${
                errors.tanggalMulai
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-cream-300 dark:border-dark-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
              }`}
            />
            {errors.tanggalMulai && (
              <p className="mt-1 text-xs text-red-500">{errors.tanggalMulai}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={formData.tanggalSelesai}
              onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-800 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Status Event
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-800 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
            Deskripsi Singkat Event
          </label>
          <textarea
            rows={3}
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            placeholder="Ringkasan singkat tentang event dan tujuan penyelenggaraan..."
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
      </div>

      {/* Konten Lengkap Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 sm:p-8 border border-cream-300 dark:border-dark-700 shadow-xs space-y-4">
        <div className="border-b border-cream-200 dark:border-dark-700 pb-3 flex justify-between items-center">
          <h2 className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100">
            Detail Informasi & Rundown Acara
          </h2>
          <span className="text-xs text-dark-400 dark:text-dark-500">
            Format HTML didukung
          </span>
        </div>

        <RichTextEditor
          value={formData.konten}
          onChange={(newVal) => setFormData({ ...formData, konten: newVal })}
          placeholder="Tuliskan jadwal lengkap, tata cara keikutsertaan, maupun agenda kegiatan..."
        />
      </div>

      {/* Media & Publikasi Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 sm:p-8 border border-cream-300 dark:border-dark-700 shadow-xs space-y-6">
        <h2 className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Poster & Status Publikasi
        </h2>

        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-2">
            Poster / Gambar Event
          </label>
          <ImageUploader
            value={formData.gambar}
            onChange={(url) => setFormData({ ...formData, gambar: url })}
            folder="events"
          />
        </div>

        {/* Published Toggle */}
        <div className="pt-4 border-t border-cream-200 dark:border-dark-700">
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-dark-850 border border-cream-200 dark:border-dark-700 max-w-md">
            <div>
              <div className="text-sm font-medium text-dark-900 dark:text-cream-100">
                Status Publikasi
              </div>
              <div className="text-xs text-dark-500 dark:text-dark-400">
                {formData.published ? 'Event tampil di website' : 'Disimpan sebagai draft internal'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-cream-300 peer-focus:outline-hidden rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/event')}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-dark-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-dark-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary-700 hover:bg-primary-600 active:bg-primary-800 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isLoading
            ? 'Menyimpan...'
            : isEditMode
            ? 'Update Event'
            : 'Simpan Event'}
        </button>
      </div>
    </form>
  );
}
