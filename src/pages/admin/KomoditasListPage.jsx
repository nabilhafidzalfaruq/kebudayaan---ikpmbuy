import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, TreePalm, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getAllKomoditas,
  deleteKomoditas,
  updateKomoditas
} from '../../firebase/services/komoditasService';
import {
  getLocalItems,
  removeLocalItem,
  upsertLocalItem
} from '../../utils/localDataManager';
import { getPlaceholderImage } from '../../utils/helpers';

export default function KomoditasListPage() {
  const navigate = useNavigate();
  const [komoditasList, setKomoditasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua');
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      try {
        const data = await getAllKomoditas();
        if (data && data.length > 0) {
          setKomoditasList(data);
          return;
        }
      } catch (fbErr) {
        console.warn('Firebase error, using local data:', fbErr);
      }
      const local = getLocalItems('komoditas');
      setKomoditasList(local || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item) => {
    navigate(`/admin/komoditas/edit/${item.id || item.slug}`);
  };

  const handleDelete = async (id) => {
    try {
      try {
        await deleteKomoditas(id);
      } catch (fbErr) {
        console.warn('Firebase delete error, removing locally:', fbErr);
      }
      removeLocalItem('komoditas', id);
      setKomoditasList((prev) => prev.filter((item) => String(item.id) !== String(id)));
      showToast('Data komoditas berhasil dihapus.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Gagal menghapus komoditas.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      try {
        await updateKomoditas(id, { published: newStatus });
      } catch (fbErr) {
        console.warn('Firebase toggle error, updating locally:', fbErr);
      }

      const item = komoditasList.find((k) => String(k.id) === String(id));
      if (item) {
        upsertLocalItem('komoditas', { ...item, published: newStatus }, id);
      }

      setKomoditasList((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, published: newStatus } : item
        )
      );
      showToast(
        newStatus ? 'Komoditas dipublikasikan ke katalog publik.' : 'Komoditas disimpan sebagai draf.',
        'success'
      );
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Gagal memperbarui status komoditas.', 'error');
    }
  };

  const filteredData = useMemo(() => {
    if (activeTab === 'published') {
      return komoditasList.filter((k) => k.published !== false);
    }
    if (activeTab === 'draft') {
      return komoditasList.filter((k) => k.published === false);
    }
    if (activeTab === 'unggulan') {
      return komoditasList.filter((k) => Boolean(k.unggulan));
    }
    return komoditasList;
  }, [komoditasList, activeTab]);

  const columns = [
    {
      key: 'nama',
      label: 'Komoditas & Sektor',
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.gambar || getPlaceholderImage(100, 100, item.nama)}
            alt={item.nama}
            className="w-12 h-12 rounded-lg object-cover bg-cream-200 dark:bg-dark-700 shrink-0"
            onError={(e) => { e.target.src = getPlaceholderImage(100, 100, item.nama); }}
          />
          <div>
            <span className="font-semibold text-dark-900 dark:text-cream-100 hover:text-primary-700 dark:hover:text-primary-400 block">
              {item.nama}
            </span>
            <span className="text-xs text-dark-500 dark:text-dark-400">
              {item.kategori || 'Sektor Daerah'}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'statistik',
      label: 'Estimasi Produksi / Luas',
      render: (item) => (
        <div className="text-xs">
          <span className="font-medium text-dark-800 dark:text-cream-200 block">
            {item.produksiPerTahun || '-'}
          </span>
          <span className="text-dark-400">
            {item.luasLahan || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'unggulan',
      label: 'Sorotan',
      render: (item) =>
        item.unggulan ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 dark:text-accent-400">
            <Sparkles className="w-3.5 h-3.5" /> Unggulan
          </span>
        ) : (
          <span className="text-xs text-dark-400">-</span>
        )
    },
    {
      key: 'published',
      label: 'Status',
      render: (item) => (
        <StatusBadge published={item.published !== false} />
      )
    }
  ];

  return (
    <AdminLayout title="Kelola Komoditas">
      <div className="space-y-6">
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between shadow-md transition-all ${
              notification.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-dark-900 dark:text-cream-100 flex items-center gap-2">
              <TreePalm className="w-6 h-6 text-primary-700 dark:text-accent-400" />
              Komoditas & Potensi Daerah
            </h2>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
              Kelola komoditas perkebunan, pertanian, perikanan, dan potensi ekonomi
            </p>
          </div>

          <Link
            to="/admin/komoditas/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Komoditas
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-cream-300 dark:border-dark-700 pb-px overflow-x-auto">
          {[
            { id: 'semua', label: 'Semua Komoditas' },
            { id: 'published', label: 'Tampil / Published' },
            { id: 'draft', label: 'Draf' },
            { id: 'unggulan', label: 'Komoditas Unggulan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-700 text-primary-700 dark:border-accent-400 dark:text-accent-400 font-semibold'
                  : 'border-transparent text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-cream-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" text="Memuat daftar komoditas..." />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            searchPlaceholder="Cari nama komoditas, sektor, kecamatan..."
            emptyMessage="Belum ada data komoditas yang sesuai."
            getItemName={(item) => item?.nama}
          />
        )}
      </div>
    </AdminLayout>
  );
}
