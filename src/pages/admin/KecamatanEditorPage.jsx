import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import KecamatanForm from '../../components/admin/KecamatanForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getKecamatanById,
  getKecamatanBySlug,
  addKecamatan,
  updateKecamatan
} from '../../firebase/services/kecamatanService';
import {
  getLocalItems,
  upsertLocalItem
} from '../../utils/localDataManager';

export default function KecamatanEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;

    const fetchItem = async () => {
      try {
        setIsLoadingData(true);
        setErrorMessage(null);

        let data = null;
        try {
          data = await getKecamatanById(id);
          if (!data) {
            data = await getKecamatanBySlug(id);
          }
        } catch (fbErr) {
          console.warn('Firebase error fetching kecamatan:', fbErr);
        }

        if (!data) {
          const local = getLocalItems('kecamatan');
          data = local.find(
            (item) => String(item.id) === String(id) || item.slug === id
          );
        }

        if (isMounted) {
          if (data) {
            setInitialData(data);
          } else {
            setErrorMessage(`Data kecamatan dengan ID "${id}" tidak ditemukan.`);
          }
        }
      } catch (err) {
        console.error('Error fetching kecamatan:', err);
        if (isMounted) {
          setErrorMessage('Gagal mengambil data kecamatan.');
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

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const targetId = isEditMode ? (initialData?.id || id) : `kecamatan_${Date.now()}`;

      // Save locally
      upsertLocalItem('kecamatan', formData, targetId);

      // Save to Firebase
      try {
        if (isEditMode) {
          await updateKecamatan(targetId, formData);
        } else {
          await addKecamatan(formData);
        }
      } catch (fbErr) {
        console.warn('Firebase warning (data saved locally):', fbErr);
      }

      navigate('/admin/kecamatan');
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Gagal menyimpan data kecamatan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = isEditMode ? 'Edit Kecamatan' : 'Tambah Kecamatan (Pemekaran)';

  return (
    <AdminLayout title={pageTitle}>
      <div className="space-y-6">
        <nav className="flex items-center gap-2 text-xs text-dark-500 dark:text-dark-400">
          <Link to="/admin" className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/admin/kecamatan" className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
            Kecamatan
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-dark-900 dark:text-cream-100 font-medium">
            {isEditMode ? initialData?.nama || 'Edit' : 'Tambah Pemekaran'}
          </span>
        </nav>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {isLoadingData ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" text="Memuat formulir kecamatan..." />
          </div>
        ) : (
          <KecamatanForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </AdminLayout>
  );
}
