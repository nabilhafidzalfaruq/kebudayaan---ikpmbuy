import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import EventForm from '../../components/admin/EventForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getEventById,
  addEvent,
  updateEvent
} from '../../firebase/services/eventService';
import localEventsData from '../../data/events.json';

/**
 * EventEditorPage for adding or editing cultural events
 */
export default function EventEditorPage() {
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
          data = await getEventById(id);
        } catch (fbErr) {
          console.warn('Firebase getEventById error, checking local json:', fbErr);
        }

        if (!data) {
          data = localEventsData.find((item) => String(item.id) === String(id));
        }

        if (isMounted) {
          if (data) {
            setInitialData(data);
          } else {
            setErrorMessage(`Data event dengan ID "${id}" tidak ditemukan.`);
          }
        }
      } catch (err) {
        console.error('Error fetching event data:', err);
        if (isMounted) {
          setErrorMessage('Gagal mengambil detail event.');
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
          await updateEvent(id, formData);
        } catch (err) {
          console.warn('Error in updateEvent Firestore:', err);
        }
      } else {
        try {
          await addEvent(formData);
        } catch (err) {
          console.warn('Error in addEvent Firestore:', err);
        }
      }

      navigate('/admin/event');
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Gagal menyimpan perubahan event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = isEditMode ? 'Edit Event' : 'Tambah Event';

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
            to="/admin/event"
            className="hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
          >
            Event
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-dark-800 dark:text-cream-100">
            {isEditMode ? 'Edit' : 'Tambah Baru'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-cream-200 dark:border-dark-700 pb-4">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-dark-900 dark:text-cream-100">
            {pageTitle}
          </h2>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1">
            {isEditMode
              ? 'Perbarui jadwal, tempat pelaksanaan, atau deskripsi agenda festival.'
              : 'Tambahkan agenda kesenian atau perayaan budaya baru ke kalender pariwisata.'}
          </p>
        </div>

        {/* Error Notification */}
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
          <LoadingSpinner size="md" text="Mengambil data event..." />
        ) : (
          <EventForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </AdminLayout>
  );
}
