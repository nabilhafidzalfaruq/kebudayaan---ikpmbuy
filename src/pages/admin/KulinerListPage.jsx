import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getAllKuliner,
  deleteKuliner,
  updateKuliner
} from '../../firebase/services/kulinerService';
import {
  getLocalItems,
  removeLocalItem,
  upsertLocalItem
} from '../../utils/localDataManager';
import { getPlaceholderImage } from '../../utils/helpers';

export default function KulinerListPage() {
  const navigate = useNavigate();
  const [kulinerList, setKulinerList] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const data = await getAllKuliner();
        if (data && data.length > 0) {
          setKulinerList(data);
          return;
        }
      } catch (fbErr) {
        console.warn('Firebase error, using local data:', fbErr);
      }
      const local = getLocalItems('kuliner');
      setKulinerList(local || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item) => {
    navigate(`/admin/kuliner/edit/${item.id || item.slug}`);
  };

  const handleDelete = async (id) => {
    try {
      try {
        await deleteKuliner(id);
      } catch (fbErr) {
        console.warn('Firebase delete error, removing locally:', fbErr);
      }
      removeLocalItem('kuliner', id);
      setKulinerList((prev) => prev.filter((item) => String(item.id) !== String(id)));
      showToast('Data kuliner berhasil dihapus.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Gagal menghapus kuliner.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      try {
        await updateKuliner(id, { published: newStatus });
      } catch (fbErr) {
        console.warn('Firebase toggle error, updating locally:', fbErr);
      }

      const item = kulinerList.find((k) => String(k.id) === String(id));
      if (item) {
        upsertLocalItem('kuliner', { ...item, published: newStatus }, id);
      }

      setKulinerList((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, published: newStatus } : item
        )
      );
      showToast(
        newStatus ? 'Kuliner ditampilkan di website.' : 'Kuliner disembunyikan.',
        'success'
      );
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Gagal memperbarui status kuliner.', 'error');
    }
  };

  const columns = [
    {
      key: 'nama',
      label: 'Kuliner Tradisional',
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
            <span className="text-xs text-dark-500 dark:text-dark-400 font-mono">
              /kuliner/{item.slug}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'deskripsi',
      label: 'Deskripsi Cita Rasa',
      render: (item) => (
        <p className="text-xs text-dark-600 dark:text-cream-300 line-clamp-2 max-w-md">
          {item.deskripsi}
        </p>
      )
    },
    {
      key: 'published',
      label: 'Status Tampil',
      render: (item) => (
        <StatusBadge published={item.published !== false} />
      )
    }
  ];

  return (
    <AdminLayout title="Kelola Kuliner">
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
              <Utensils className="w-6 h-6 text-primary-700 dark:text-accent-400" />
              Kuliner Tradisional Khas Rejang
            </h2>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
              Kelola hidangan otentik seperti Lemea, Tempoyak, Kelicuk, dan Punjung
            </p>
          </div>

          <Link
            to="/admin/kuliner/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Kuliner
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" text="Memuat daftar kuliner..." />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={kulinerList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            searchPlaceholder="Cari kuliner tradisional..."
            emptyMessage="Belum ada data kuliner."
            getItemName={(item) => item?.nama}
          />
        )}
      </div>
    </AdminLayout>
  );
}
