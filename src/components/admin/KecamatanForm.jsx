import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { slugify } from '../../utils/helpers';

export default function KecamatanForm({
  initialData,
  onSubmit,
  isLoading = false
}) {
  const navigate = useNavigate();
  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    nama: '',
    slug: '',
    deskripsi: '',
    budayaHighlight: '',
    jumlahBudaya: 0,
    published: true
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || '',
        slug: initialData.slug || '',
        deskripsi: initialData.deskripsi || '',
        budayaHighlight: Array.isArray(initialData.budayaHighlight)
          ? initialData.budayaHighlight.join(', ')
          : (initialData.budayaHighlight || ''),
        jumlahBudaya: initialData.jumlahBudaya || 0,
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
    if (!formData.nama.trim()) errs.nama = 'Nama kecamatan wajib diisi';
    if (!formData.slug.trim()) errs.slug = 'Slug URL wajib diisi';
    if (!formData.deskripsi.trim()) errs.deskripsi = 'Deskripsi wilayah wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSubmit = {
      ...formData,
      jumlahBudaya: Number(formData.jumlahBudaya) || 0,
      budayaHighlight: formData.budayaHighlight
        ? formData.budayaHighlight.split(',').map((s) => s.trim()).filter(Boolean)
        : []
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-5">
        <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100 border-b border-cream-200 dark:border-dark-700 pb-3">
          Data Wilayah Kecamatan {isEditMode ? '' : '(Baru / Pemekaran)'}
        </h3>

        {/* Nama Kecamatan */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Nama Kecamatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            onChange={handleNamaChange}
            placeholder="Contoh: Arga Makmur, Enggano, Kerkap"
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
            Slug Pengenal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="arga-makmur"
            className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 font-mono focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />
          {errors.slug && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.slug}
            </p>
          )}
        </div>

        {/* Jumlah Budaya & Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
              Jumlah Warisan Budaya Tercatat
            </label>
            <input
              type="number"
              min="0"
              value={formData.jumlahBudaya}
              onChange={(e) => setFormData((prev) => ({ ...prev, jumlahBudaya: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
              Slug Budaya Unggulan (Koma)
            </label>
            <input
              type="text"
              value={formData.budayaHighlight}
              onChange={(e) => setFormData((prev) => ({ ...prev, budayaHighlight: e.target.value }))}
              placeholder="tari-kejei, rumah-bubungan-lima"
              className="w-full px-4 py-2.5 rounded-lg border border-cream-300 dark:border-dark-700 text-sm bg-cream-50/50 dark:bg-dark-900 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:ring-2 focus:ring-primary-500 font-mono"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-dark-800 dark:text-cream-200 mb-1">
            Deskripsi Wilayah & Karakteristik Kultural <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.deskripsi}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, deskripsi: e.target.value }));
              if (errors.deskripsi) setErrors((prev) => ({ ...prev, deskripsi: null }));
            }}
            placeholder="Karakteristik geografis, suku dominan, dan signifikansi adat di kecamatan ini..."
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

        {/* Status Aktif */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-cream-100/60 dark:bg-dark-900/60 border border-cream-200 dark:border-dark-700">
          <div>
            <p className="text-sm font-semibold text-dark-900 dark:text-cream-100">
              Tampilkan di Peta Interaktif
            </p>
            <p className="text-xs text-dark-500 dark:text-dark-400">
              Kecamatan akan muncul di grid peta interaktif dan filter website
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
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={() => navigate('/admin/kecamatan')}
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
              <Save className="w-4 h-4" /> {isEditMode ? 'Perbarui Kecamatan' : 'Simpan Kecamatan Baru'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
