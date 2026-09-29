import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { slugify } from '../../utils/helpers';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

const KATEGORI_OPTIONS = [
  'Seni & Pertunjukan',
  'Tradisi & Adat',
  'Bahasa & Aksara',
  'Sejarah & Cagar Budaya',
  'Kuliner Tradisional',
  'Wisata Budaya',
  'Komunitas & Tokoh'
];

/**
 * BeritaForm component for creating or editing news/articles
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Existing data for editing mode
 * @param {(formData: Object) => Promise<void> | void} props.onSubmit - Submit callback
 * @param {boolean} [props.isLoading=false] - Submission pending state
 */
export default function BeritaForm({
  initialData,
  onSubmit,
  isLoading = false
}) {
  const navigate = useNavigate();
  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    kategori: KATEGORI_OPTIONS[0],
    penulis: 'Redaksi Budaya BU',
    ringkasan: '',
    konten: '',
    gambar: '',
    featured: false,
    published: true,
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync initialData when provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        judul: initialData.judul || '',
        slug: initialData.slug || '',
        kategori: initialData.kategori || KATEGORI_OPTIONS[0],
        penulis: initialData.penulis || 'Redaksi Budaya BU',
        ringkasan: initialData.ringkasan || '',
        konten: initialData.konten || '',
        gambar: initialData.gambar || '',
        featured: Boolean(initialData.featured),
        published: initialData.published !== undefined ? Boolean(initialData.published) : true,
        tanggal: initialData.tanggal || new Date().toISOString().split('T')[0]
      });
      setIsSlugManuallyEdited(true);
    }
  }, [initialData]);

  // Handle title change and auto slug generation
  const handleJudulChange = (e) => {
    const newJudul = e.target.value;
    setFormData((prev) => ({
      ...prev,
      judul: newJudul,
      slug: !isSlugManuallyEdited ? slugify(newJudul) : prev.slug
    }));

    if (errors.judul) {
      setErrors((prev) => ({ ...prev, judul: null }));
    }
  };

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul berita wajib diisi.';
    }
    if (!formData.ringkasan.trim()) {
      newErrors.ringkasan = 'Ringkasan berita wajib diisi.';
    } else if (formData.ringkasan.length > 200) {
      newErrors.ringkasan = 'Ringkasan maksimal 200 karakter.';
    }
    if (!formData.konten.trim()) {
      newErrors.konten = 'Konten artikel berita wajib diisi.';
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

    const payload = {
      ...formData,
      slug: formData.slug || slugify(formData.judul)
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner / Error notice */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Mohon lengkapi kolom yang wajib diisi:</p>
            <ul className="list-disc list-inside mt-1 text-xs space-y-0.5">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Form Fields Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 sm:p-8 border border-cream-300 dark:border-dark-700 shadow-xs space-y-6">
        <h2 className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Informasi Utama
        </h2>

        {/* Judul Berita */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
            Judul Berita <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.judul}
            onChange={handleJudulChange}
            placeholder="Contoh: Eksplorasi Keindahan Tari Kejei Suku Rejang"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden transition-all ${
              errors.judul
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-cream-300 dark:border-dark-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          {errors.judul && (
            <p className="mt-1 text-xs text-red-500">{errors.judul}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-dark-500 dark:text-dark-400 mb-1">
            Slug URL (otomatis dari judul)
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="eksplorasi-keindahan-tari-kejei"
            className="w-full px-4 py-2 text-xs font-mono rounded-lg border border-cream-200 dark:border-dark-700 bg-cream-50 dark:bg-dark-950 text-dark-600 dark:text-dark-300 focus:outline-hidden focus:border-primary-400"
          />
        </div>

        {/* Grid: Kategori, Penulis, Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Kategori
            </label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-800 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              {KATEGORI_OPTIONS.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>

          {/* Penulis */}
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Penulis
            </label>
            <input
              type="text"
              value={formData.penulis}
              onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
              placeholder="Nama Penulis / Redaksi"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-800 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-1.5">
              Tanggal Publikasi
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-800 dark:text-cream-100 text-sm focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Ringkasan */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-100">
              Ringkasan Singkat <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-xs ${
                formData.ringkasan.length > 200
                  ? 'text-red-500 font-semibold'
                  : 'text-dark-400 dark:text-dark-500'
              }`}
            >
              {formData.ringkasan.length}/200 karakter
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={200}
            value={formData.ringkasan}
            onChange={(e) => {
              setFormData({ ...formData, ringkasan: e.target.value });
              if (errors.ringkasan) setErrors({ ...errors, ringkasan: null });
            }}
            placeholder="Tulis ringkasan 1-2 kalimat pengantar berita..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden transition-all ${
              errors.ringkasan
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-cream-300 dark:border-dark-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          {errors.ringkasan && (
            <p className="mt-1 text-xs text-red-500">{errors.ringkasan}</p>
          )}
        </div>
      </div>

      {/* Konten Lengkap Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 sm:p-8 border border-cream-300 dark:border-dark-700 shadow-xs space-y-4">
        <div className="border-b border-cream-200 dark:border-dark-700 pb-3 flex justify-between items-center">
          <h2 className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100">
            Isi Konten Artikel <span className="text-red-500">*</span>
          </h2>
          <span className="text-xs text-dark-400 dark:text-dark-500">
            Dapat menyertakan format HTML
          </span>
        </div>

        <RichTextEditor
          value={formData.konten}
          onChange={(newVal) => {
            setFormData({ ...formData, konten: newVal });
            if (errors.konten) setErrors({ ...errors, konten: null });
          }}
          placeholder="Tulis isi artikel berita lengkap di sini..."
        />
        {errors.konten && (
          <p className="text-xs text-red-500">{errors.konten}</p>
        )}
      </div>

      {/* Media & Pengaturan Publikasi Card */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 sm:p-8 border border-cream-300 dark:border-dark-700 shadow-xs space-y-6">
        <h2 className="text-lg font-heading font-semibold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Gambar Utama & Publikasi
        </h2>

        {/* Gambar Uploader */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-100 mb-2">
            Gambar Sampul Berita
          </label>
          <ImageUploader
            value={formData.gambar}
            onChange={(url) => setFormData({ ...formData, gambar: url })}
            folder="berita"
          />
        </div>

        {/* Switches: Featured & Published */}
        <div className="pt-4 border-t border-cream-200 dark:border-dark-700 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-dark-850 border border-cream-200 dark:border-dark-700">
            <div>
              <div className="text-sm font-medium text-dark-900 dark:text-cream-100">
                Berita Utama (Featured)
              </div>
              <div className="text-xs text-dark-500 dark:text-dark-400">
                Tampilkan di banner utama halaman depan
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-cream-300 peer-focus:outline-hidden rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-400"></div>
            </label>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-50 dark:bg-dark-850 border border-cream-200 dark:border-dark-700">
            <div>
              <div className="text-sm font-medium text-dark-900 dark:text-cream-100">
                Status Publikasi
              </div>
              <div className="text-xs text-dark-500 dark:text-dark-400">
                {formData.published ? 'Publikasikan langsung' : 'Simpan sebagai draft'}
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
          onClick={() => navigate('/admin/berita')}
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
            ? 'Update Berita'
            : 'Simpan Berita'}
        </button>
      </div>
    </form>
  );
}
