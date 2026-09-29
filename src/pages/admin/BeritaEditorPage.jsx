import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BeritaForm from '../../components/admin/BeritaForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getBeritaById,
  addBerita,
  updateBerita
} from '../../firebase/services/beritaService';
import localBeritaData from '../../data/berita.json';

/**
 * BeritaEditorPage for adding or editing news/articles
 */
export default function BeritaEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch existing data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;

    const fetchItem = async () => {
      try {
        setIsLoadingData(true);
        setErrorMessage(null);

        let data = null;
        try {
          data = await getBeritaById(id);
        } catch (fbErr) {
          console.warn('Firebase getBeritaById error, checking local json:', fbErr);
        }

        if (!data) {
          data = localBeritaData.find((item) => String(item.id) === String(id));
        }

        if (isMounted) {
          if (data) {
            setInitialData(data);
          } else {
            setErrorMessage(`Data berita dengan ID "${id}" tidak ditemukan.`);
          }
        }
      } catch (err) {
        console.error('Error fetching berita:', err);
        if (isMounted) {
          setErrorMessage('Gagal mengambil data artikel berita.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  // Handle Form Submission
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (isEditMode) {
        try {
          await updateBerita(id, formData);
        } catch (err) {
          console.warn('Error in updateBerita Firestore:', err);
        }
      } else {
        try {
          await addBerita(formData);
        } catch (err) {
          console.warn('Error in addBerita Firestore:', err);
        }
      }

      navigate('/admin/berita');
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Gagal menyimpan perubahan berita.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = isEditMode ? 'Edit Berita' : 'Tambah Berita';

  return (
    <AdminLayout title={pageTitle}>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
          <Link
            to="/admin"
            className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to="/admin/berita"
            className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
          >
            Berita
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-dark-800 dark:text-cream-100">
            {isEditMode ? 'Edit' : 'Tambah Baru'}
          </span>
        </nav>

        {/* Page Title Header */}
        <div className="border-b border-cream-200 dark:border-dark-700 pb-4">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-dark-900 dark:text-cream-100">
            {pageTitle}
          </h2>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1">
            {isEditMode
              ? 'Perbarui detail informasi berita, konten, dan status publikasi.'
              : 'Buat publikasi artikel atau dokumentasi budaya baru untuk masyarakat.'}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Terjadi Kesalahan:</p>
              <p className="text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form or Loader */}
        {isLoadingData ? (
          <LoadingSpinner size="md" text="Mengambil data berita..." />
        ) : (
          <BeritaForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </AdminLayout>
  );
}
