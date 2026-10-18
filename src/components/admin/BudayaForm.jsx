import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { slugify } from '../../utils/helpers';
import ImageUploader from './ImageUploader';

const KATEGORI_OPTIONS = [
  'Seni & Pertunjukan',
  'Tradisi & Upacara',
  'Rumah Adat',
  'Pakaian Adat',
  'Bahasa & Aksara',
  'Musik Tradisional',
  'Kerajinan',
  'Kuliner'
];

const KECAMATAN_OPTIONS = [
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

export default function BudayaForm({
  initialData,
  onSubmit,
  isLoading = false
}) {
  const navigate = useNavigate();
  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    nama: '',
    slug: '',
    kategori: KATEGORI_OPTIONS[0],
    kecamatan: KECAMATAN_OPTIONS[0],
    deskripsi: '',
    sejarah: '',
    filosofi: '',
    proses: '',
    faktaMenarik: '',
    gambar: '',
    populer: false,
    published: true
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || '',
        slug: initialData.slug || '',
        kategori: initialData.kategori || KATEGORI_OPTIONS[0],
        kecamatan: initialData.kecamatan || KECAMATAN_OPTIONS[0],
        deskripsi: initialData.deskripsi || '',
        sejarah: initialData.sejarah || '',
        filosofi: initialData.filosofi || '',
        proses: initialData.proses || '',
        faktaMenarik: Array.isArray(initialData.faktaMenarik)
          ? initialData.faktaMenarik.join('\n')
          : (initialData.faktaMenarik || ''),
        gambar: initialData.gambar || '',
        populer: Boolean(initialData.populer),
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
    if (errors.nama) setErrors((prev) => ({ ...prev, nama: null }));
  };

  const handleSlugChange = (e) => {
    setIsSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) errs.nama = 'Nama budaya wajib diisi';
    if (!formData.slug.trim()) errs.slug = 'Slug URL wajib diisi';
    if (!formData.deskripsi.trim()) errs.deskripsi = 'Deskripsi singkat wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSubmit = {
      ...formData,
      faktaMenarik: formData.faktaMenarik
        ? formData.faktaMenarik.split('\n').map((s) => s.trim()).filter(Boolean)
        : []
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Basic Info */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-5">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Informasi Utama Budaya
        </h3>

        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Nama Budaya <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            onChange={handleNamaChange}
            placeholder="Contoh: Tari Kejei, Aksara Kaganga"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary-500 ${
              errors.nama ? 'border-red-500' : 'border-cream-300 dark:border-dark-700'
            }`}
          />
          {errors.nama && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.nama}
            </p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Slug URL <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <span className="text-xs text-dark-500 dark:text-dark-400 bg-cream-200 dark:bg-dark-700 px-3 py-2.5 rounded-l-lg border border-r-0 border-cream-300 dark:border-dark-700">
              /budaya/
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="tari-kejei"
              className="w-full px-4 py-2.5 rounded-r-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 font-mono focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.slug}
            </p>
          )}
        </div>

        {/* Kategori & Kecamatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
              Kategori Budaya
            </label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData((prev) => ({ ...prev, kategori: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            >
              {KATEGORI_OPTIONS.map((kat) => (
                <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
              Kecamatan Asal / Sebaran
            </label>
            <select
              value={formData.kecamatan}
              onChange={(e) => setFormData((prev) => ({ ...prev, kecamatan: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            >
              {KECAMATAN_OPTIONS.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Deskripsi Singkat <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.deskripsi}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, deskripsi: e.target.value }));
              if (errors.deskripsi) setErrors((prev) => ({ ...prev, deskripsi: null }));
            }}
            placeholder="Ringkasan singkat tentang kebudayaan ini..."
            className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500 ${
              errors.deskripsi ? 'border-red-500' : 'border-cream-300 dark:border-dark-700'
            }`}
          />
          {errors.deskripsi && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.deskripsi}
            </p>
          )}
        </div>
      </div>

      {/* Ensiklopedia Details */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-5">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Uraian Ensiklopedia Budaya
        </h3>

        {/* Sejarah */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Sejarah & Asal-Usul
          </label>
          <textarea
            rows={3}
            value={formData.sejarah}
            onChange={(e) => setFormData((prev) => ({ ...prev, sejarah: e.target.value }))}
            placeholder="Latar belakang sejarah dan cerita turun temurun..."
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filosofi */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Filosofi & Makna Kultural
          </label>
          <textarea
            rows={3}
            value={formData.filosofi}
            onChange={(e) => setFormData((prev) => ({ ...prev, filosofi: e.target.value }))}
            placeholder="Nilai-nilai moral, simbolis, atau spiritual yang terkandung..."
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Proses */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Tata Cara Pelaksanaan / Proses Pembuatan
          </label>
          <textarea
            rows={3}
            value={formData.proses}
            onChange={(e) => setFormData((prev) => ({ ...prev, proses: e.target.value }))}
            placeholder="Langkah-langkah prosesi, pementasan, atau teknik pembuatan..."
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Fakta Menarik */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Fakta Menarik (Tulis 1 fakta per baris)
          </label>
          <textarea
            rows={3}
            value={formData.faktaMenarik}
            onChange={(e) => setFormData((prev) => ({ ...prev, faktaMenarik: e.target.value }))}
            placeholder="Contoh:&#10;Tarian sakral Suku Rejang tertua&#10;Diakui sebagai Warisan Budaya Takbenda"
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500 font-sans"
          />
        </div>
      </div>

      {/* Media & Visibilitas */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-6">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Gambar & Status Tampilan
        </h3>

        {/* Image Uploader */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-2">
            Foto Cover Budaya
          </label>
          <ImageUploader
            value={formData.gambar}
            onChange={(url) => setFormData((prev) => ({ ...prev, gambar: url }))}
            folder="budaya"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Tampil di Website */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100/60 dark:bg-dark-900/60 border border-cream-200 dark:border-dark-700">
            <div>
              <p className="text-sm font-semibold text-dark-900 dark:text-cream-100">
                Tampilkan di Website
              </p>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Aktifkan agar budaya ini tampil di katalog publik
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                formData.published ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  formData.published ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Budaya Populer */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100/60 dark:bg-dark-900/60 border border-cream-200 dark:border-dark-700">
            <div>
              <p className="text-sm font-semibold text-dark-900 dark:text-cream-100">
                Budaya Populer (Highlight)
              </p>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Sorot di grid Budaya Populer pada Beranda
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, populer: !prev.populer }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                formData.populer ? 'bg-accent-500' : 'bg-gray-300 dark:bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  formData.populer ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={() => navigate('/admin/budaya')}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm font-medium text-dark-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-dark-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Batal
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium shadow-md transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {isEditMode ? 'Perbarui Budaya' : 'Simpan Budaya Baru'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
