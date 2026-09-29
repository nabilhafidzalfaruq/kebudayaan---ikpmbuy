import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, CalendarDays, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getAllEventsAdmin,
  deleteEvent,
  togglePublishEvent
} from '../../firebase/services/eventService';
import { formatDateShort, getStatusColor, getStatusLabel } from '../../utils/helpers';
import localEventsData from '../../data/events.json';

/**
 * EventListPage for managing cultural events and agendas
 */
export default function EventListPage() {
  const navigate = useNavigate();
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('semua'); // 'semua' | 'published' | 'draft' | 'upcoming' | 'completed'
  const [notification, setNotification] = useState(null);

  // Show auto-dismissing toast notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch all events for admin
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllEventsAdmin();
        if (isMounted) {
          setEventList(data || []);
        }
      } catch (err) {
        console.warn('Fallback to local events.json:', err);
        if (isMounted) {
          setEventList(localEventsData || []);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter items
  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'published':
        return eventList.filter((item) => item.published === true);
      case 'draft':
        return eventList.filter((item) => !item.published);
      case 'upcoming':
        return eventList.filter((item) => item.status === 'upcoming');
      case 'completed':
        return eventList.filter((item) => item.status === 'completed');
      default:
        return eventList;
    }
  }, [eventList, activeFilter]);

  // Actions
  const handleEdit = (item) => {
    navigate(`/admin/event/edit/${item.id}`);
  };

  const handleDelete = async (id) => {
    try {
      try {
        await deleteEvent(id);
      } catch (fbErr) {
        console.warn('Firebase delete error, updating state locally:', fbErr);
      }
      setEventList((prev) => prev.filter((item) => item.id !== id));
      showToast('Event berhasil dihapus.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Gagal menghapus event: ' + err.message, 'error');
    }
  };

  const handleTogglePublish = async (id, currentPublished) => {
    try {
      let newStatus = !currentPublished;
      try {
        newStatus = await togglePublishEvent(id, currentPublished);
      } catch (fbErr) {
        console.warn('Firebase toggle error, toggling state locally:', fbErr);
      }

      setEventList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: newStatus } : item
        )
      );

      showToast(
        `Status event diubah menjadi: ${newStatus ? 'Published' : 'Draft'}`,
        'success'
      );
    } catch (err) {
      console.error('Toggle publish error:', err);
      showToast('Gagal mengubah status publikasi event.', 'error');
    }
  };

  // DataTable columns
  const columns = [
    {
      key: 'nama',
      label: 'Nama Event',
      render: (item) => (
        <div className="flex items-center gap-3 max-w-sm sm:max-w-md">
          {item.gambar ? (
            <img
              src={item.gambar}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-cream-200 dark:bg-dark-800 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/A0522D/FDF8F0?text=Event';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-cream-200 dark:bg-dark-800 flex items-center justify-center text-dark-400 shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-medium text-dark-900 dark:text-cream-100 line-clamp-1 hover:text-primary-600 transition-colors">
              {item.nama}
            </div>
            <div className="text-xs text-dark-500 dark:text-dark-400 line-clamp-1 mt-0.5">
              {item.deskripsi || item.slug}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'lokasi',
      label: 'Lokasi & Kecamatan',
      render: (item) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 font-medium text-dark-800 dark:text-cream-200">
            <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="truncate max-w-[150px]">{item.kecamatan || 'Kab. Bengkulu Utara'}</span>
          </div>
          <div className="text-dark-500 dark:text-dark-400 truncate max-w-[170px] pl-4">
            {item.lokasi}
          </div>
        </div>
      )
    },
    {
      key: 'tanggalMulai',
      label: 'Tanggal Mulai',
      render: (item) => (
        <span className="text-xs text-dark-600 dark:text-dark-400 whitespace-nowrap">
          {formatDateShort(item.tanggalMulai)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status Event',
      render: (item) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusColor(
            item.status
          )}`}
        >
          {getStatusLabel(item.status)}
        </span>
      )
    },
    {
      key: 'published',
      label: 'Publikasi',
      className: 'text-center',
      render: (item) => <StatusBadge published={item.published} />
    }
  ];

  return (
    <AdminLayout title="Kelola Event">
      <div className="space-y-6">
        {/* Header Title + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-dark-900 dark:text-cream-100">
              Daftar Agenda & Festival Budaya
            </h2>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1">
              Atur jadwal pagelaran seni, festival tradisional, dan kalender pariwisata daerah.
            </p>
          </div>

          <Link
            to="/admin/event/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 active:bg-primary-800 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Event
          </Link>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-xs ${
              notification.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-cream-200 dark:border-dark-700 pb-2">
          {[
            { id: 'semua', label: 'Semua Event', count: eventList.length },
            {
              id: 'published',
              label: 'Published',
              count: eventList.filter((e) => e.published).length
            },
            {
              id: 'draft',
              label: 'Draft',
              count: eventList.filter((e) => !e.published).length
            },
            {
              id: 'upcoming',
              label: 'Akan Datang',
              count: eventList.filter((e) => e.status === 'upcoming').length
            },
            {
              id: 'completed',
              label: 'Selesai',
              count: eventList.filter((e) => e.status === 'completed').length
            }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-primary-700 text-white shadow-xs font-semibold'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-cream-100 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-cream-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeFilter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-cream-200 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* DataTable or Loading */}
        {loading ? (
          <LoadingSpinner size="md" text="Memuat jadwal event..." />
        ) : (
          <DataTable
            columns={columns}
            data={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            searchPlaceholder="Cari nama event, lokasi, atau kecamatan..."
            emptyMessage={
              activeFilter === 'semua'
                ? 'Belum ada agenda event yang tersimpan.'
                : `Tidak ada event dengan filter "${activeFilter}".`
            }
            getItemName={(item) => item.nama}
          />
        )}
      </div>
    </AdminLayout>
  );
}
