import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { slugify } from '../../utils/helpers';
import ImageUploader from './ImageUploader';

const KATEGORI_OPTIONS = [
  'Perkebunan',
  'Pertanian',
  'Perikanan',
  'Peternakan',
  'Kehutanan',
  'Lainnya'
];

export default function KomoditasForm({
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
    kecamatan: '',
    produksiPerTahun: '',
    luasLahan: '',
    deskripsi: '',
    potensi: '',
    manfaat: '',
    tantangan: '',
    gambar: '',
    unggulan: false,
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
        kecamatan: Array.isArray(initialData.kecamatan)
          ? initialData.kecamatan.join(', ')
          : (initialData.kecamatan || ''),
        produksiPerTahun: initialData.produksiPerTahun || '',
        luasLahan: initialData.luasLahan || '',
        deskripsi: initialData.deskripsi || '',
        potensi: initialData.potensi || '',
        manfaat: initialData.manfaat || '',
        tantangan: initialData.tantangan || '',
        gambar: initialData.gambar || '',
        unggulan: Boolean(initialData.unggulan),
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
    if (!formData.nama.trim()) errs.nama = 'Nama komoditas wajib diisi';
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
      kecamatan: formData.kecamatan
        ? formData.kecamatan.split(',').map((k) => k.trim()).filter(Boolean)
        : []
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Basic Info */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-5">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Informasi Utama Komoditas
        </h3>

        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Nama Komoditas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            onChange={handleNamaChange}
            placeholder="Contoh: Kelapa Sawit, Kopi Robusta, Lemea"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500 ${
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
              /komoditas/
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="kelapa-sawit"
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
              Sektor Kategori
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
              Kecamatan Sebaran (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.kecamatan}
              onChange={(e) => setFormData((prev) => ({ ...prev, kecamatan: e.target.value }))}
              placeholder="Lais, Batik Nau, Ketahun, Enggano"
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Produksi & Luas Lahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
              Estimasi Produksi / Tahun
            </label>
            <input
              type="text"
              value={formData.produksiPerTahun}
              onChange={(e) => setFormData((prev) => ({ ...prev, produksiPerTahun: e.target.value }))}
              placeholder="Contoh: ±350.000 ton TBS"
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
              Estimasi Luas Lahan / Zona
            </label>
            <input
              type="text"
              value={formData.luasLahan}
              onChange={(e) => setFormData((prev) => ({ ...prev, luasLahan: e.target.value }))}
              placeholder="Contoh: ±45.000 hektare"
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Deskripsi Komoditas <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.deskripsi}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, deskripsi: e.target.value }));
              if (errors.deskripsi) setErrors((prev) => ({ ...prev, deskripsi: null }));
            }}
            placeholder="Penjelasan ringkas peranan komoditas ini di Bengkulu Utara..."
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

      {/* Potensi, Manfaat, Tantangan */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-5">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Potensi Ekonomi & Nilai Tambah
        </h3>

        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Potensi & Prospek Daerah
          </label>
          <textarea
            rows={3}
            value={formData.potensi}
            onChange={(e) => setFormData((prev) => ({ ...prev, potensi: e.target.value }))}
            placeholder="Peluang pasar, pengembangan agrowisata, hilirisasi industri..."
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Manfaat & Produk Turunan
          </label>
          <textarea
            rows={3}
            value={formData.manfaat}
            onChange={(e) => setFormData((prev) => ({ ...prev, manfaat: e.target.value }))}
            placeholder="Produk yang dihasilkan, kegunaan ekonomi, penyerapan tenaga kerja..."
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Tantangan & Solusi Keberlanjutan
          </label>
          <textarea
            rows={3}
            value={formData.tantangan}
            onChange={(e) => setFormData((prev) => ({ ...prev, tantangan: e.target.value }))}
            placeholder="Fluktuasi harga, peremajaan tanaman, infrastruktur jalan, cuaca..."
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Media & Visibilitas */}
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-6">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Gambar & Status Tampilan
        </h3>

        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-2">
            Foto Komoditas
          </label>
          <ImageUploader
            value={formData.gambar}
            onChange={(url) => setFormData((prev) => ({ ...prev, gambar: url }))}
            folder="komoditas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Tampil di Website */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100/60 dark:bg-dark-900/60 border border-cream-200 dark:border-dark-700">
            <div>
              <p className="text-sm font-semibold text-dark-900 dark:text-cream-100">
                Tampilkan di Website
              </p>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Aktifkan agar tampil di daftar komoditas publik
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

          {/* Unggulan */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100/60 dark:bg-dark-900/60 border border-cream-200 dark:border-dark-700">
            <div>
              <p className="text-sm font-semibold text-dark-900 dark:text-cream-100">
                Komoditas Unggulan
              </p>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Sorot di section Komoditas Unggulan di Beranda
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, unggulan: !prev.unggulan }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                formData.unggulan ? 'bg-accent-500' : 'bg-gray-300 dark:bg-dark-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  formData.unggulan ? 'translate-x-5' : 'translate-x-0'
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
          onClick={() => navigate('/admin/komoditas')}
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
              <Save className="w-4 h-4" /> {isEditMode ? 'Perbarui Komoditas' : 'Simpan Komoditas Baru'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
