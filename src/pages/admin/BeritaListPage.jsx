import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Newspaper, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getAllBeritaAdmin,
  deleteBerita,
  togglePublishBerita
} from '../../firebase/services/beritaService';
import { formatDateShort } from '../../utils/helpers';
import localBeritaData from '../../data/berita.json';

/**
 * BeritaListPage for managing all news and articles
 */
export default function BeritaListPage() {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua'); // 'semua' | 'published' | 'draft'
  const [notification, setNotification] = useState(null);

  // Show auto-dismissing toast notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch all berita for admin
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllBeritaAdmin();
        if (isMounted) {
          setBeritaList(data || []);
        }
      } catch (err) {
        console.warn('Fallback to local berita.json:', err);
        if (isMounted) {
          setBeritaList(localBeritaData || []);
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

  // Filter list based on selected tab
  const filteredBerita = useMemo(() => {
    if (activeTab === 'published') {
      return beritaList.filter((item) => item.published === true);
    }
    if (activeTab === 'draft') {
      return beritaList.filter((item) => !item.published);
    }
    return beritaList;
  }, [beritaList, activeTab]);

  // Handle Edit navigation
  const handleEdit = (item) => {
    navigate(`/admin/berita/edit/${item.id}`);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      try {
        await deleteBerita(id);
      } catch (fbErr) {
        console.warn('Firebase delete error, updating state locally:', fbErr);
      }
      setBeritaList((prev) => prev.filter((item) => item.id !== id));
      showToast('Berita berhasil dihapus.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Gagal menghapus berita: ' + err.message, 'error');
    }
  };

  // Handle Toggle Publish
  const handleTogglePublish = async (id, currentPublished) => {
    try {
      let newStatus = !currentPublished;
      try {
        newStatus = await togglePublishBerita(id, currentPublished);
      } catch (fbErr) {
        console.warn('Firebase toggle error, toggling state locally:', fbErr);
      }

      setBeritaList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, published: newStatus } : item
        )
      );

      showToast(
        `Status berita diubah menjadi: ${newStatus ? 'Published' : 'Draft'}`,
        'success'
      );
    } catch (err) {
      console.error('Toggle publish error:', err);
      showToast('Gagal mengubah status publikasi.', 'error');
    }
  };

  // Columns definition for DataTable
  const columns = [
    {
      key: 'judul',
      label: 'Judul Berita',
      render: (item) => (
        <div className="flex items-center gap-3 max-w-md">
          {item.gambar ? (
            <img
              src={item.gambar}
              alt=""
              className="w-12 h-12 rounded-lg object-cover bg-cream-200 dark:bg-dark-800 shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/A0522D/FDF8F0?text=BU';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-cream-200 dark:bg-dark-800 flex items-center justify-center text-dark-400 shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-medium text-dark-900 dark:text-cream-100 line-clamp-1 hover:text-primary-600 transition-colors">
              {item.judul}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {item.featured && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-accent-100 text-accent-800 dark:bg-accent-950/60 dark:text-accent-300">
                  <Sparkles className="w-2.5 h-2.5" /> Featured
                </span>
              )}
              <span className="text-xs text-dark-500 dark:text-dark-400 line-clamp-1">
                {item.ringkasan || 'Tidak ada ringkasan'}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'kategori',
      label: 'Kategori',
      render: (item) => (
        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-cream-100 dark:bg-dark-800 text-dark-700 dark:text-cream-300 border border-cream-200 dark:border-dark-700">
          {item.kategori || 'Umum'}
        </span>
      )
    },
    {
      key: 'penulis',
      label: 'Penulis',
      render: (item) => (
        <span className="text-xs text-dark-600 dark:text-dark-300">
          {item.penulis || 'Redaksi'}
        </span>
      )
    },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (item) => (
        <span className="text-xs text-dark-600 dark:text-dark-400 whitespace-nowrap">
          {formatDateShort(item.tanggal || item.createdAt)}
        </span>
      )
    },
    {
      key: 'published',
      label: 'Status',
      className: 'text-center',
      render: (item) => <StatusBadge published={item.published} />
    }
  ];

  return (
    <AdminLayout title="Kelola Berita">
      <div className="space-y-6">
        {/* Header Title + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-dark-900 dark:text-cream-100">
              Daftar Berita & Artikel
            </h2>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-1">
              Publikasikan berita, liputan tradisi, dan dokumentasi kesenian daerah.
            </p>
          </div>

          <Link
            to="/admin/berita/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 active:bg-primary-800 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Berita
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
        <div className="flex items-center gap-2 border-b border-cream-200 dark:border-dark-700 pb-2">
          {[
            { id: 'semua', label: 'Semua Berita', count: beritaList.length },
            {
              id: 'published',
              label: 'Published',
              count: beritaList.filter((b) => b.published).length
            },
            {
              id: 'draft',
              label: 'Draft',
              count: beritaList.filter((b) => !b.published).length
            }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-primary-700 text-white shadow-xs font-semibold'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-cream-100 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-cream-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id
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
          <LoadingSpinner size="md" text="Memuat data berita..." />
        ) : (
          <DataTable
            columns={columns}
            data={filteredBerita}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            searchPlaceholder="Cari judul, penulis, atau kategori berita..."
            emptyMessage={
              activeTab === 'semua'
                ? 'Belum ada artikel berita yang dibuat.'
                : `Tidak ada berita berstatus ${activeTab}.`
            }
            getItemName={(item) => item.judul}
          />
        )}
      </div>
    </AdminLayout>
  );
}
