import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getAllKecamatan,
  deleteKecamatan,
  updateKecamatan
} from '../../firebase/services/kecamatanService';
import {
  getLocalItems,
  removeLocalItem,
  upsertLocalItem
} from '../../utils/localDataManager';

export default function KecamatanListPage() {
  const navigate = useNavigate();
  const [kecamatanList, setKecamatanList] = useState([]);
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
        const data = await getAllKecamatan();
        if (data && data.length > 0) {
          setKecamatanList(data);
          return;
        }
      } catch (fbErr) {
        console.warn('Firebase error, using local data:', fbErr);
      }
      const local = getLocalItems('kecamatan');
      setKecamatanList(local || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (item) => {
    navigate(`/admin/kecamatan/edit/${item.id || item.slug}`);
  };

  const handleDelete = async (id) => {
    try {
      try {
        await deleteKecamatan(id);
      } catch (fbErr) {
        console.warn('Firebase delete error, removing locally:', fbErr);
      }
      removeLocalItem('kecamatan', id);
      setKecamatanList((prev) => prev.filter((item) => String(item.id) !== String(id)));
      showToast('Data kecamatan berhasil dihapus.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Gagal menghapus kecamatan.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      try {
        await updateKecamatan(id, { published: newStatus });
      } catch (fbErr) {
        console.warn('Firebase toggle error, updating locally:', fbErr);
      }

      const item = kecamatanList.find((k) => String(k.id) === String(id));
      if (item) {
        upsertLocalItem('kecamatan', { ...item, published: newStatus }, id);
      }

      setKecamatanList((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, published: newStatus } : item
        )
      );
      showToast(
        newStatus ? 'Kecamatan diaktifkan di peta interaktif.' : 'Kecamatan disembunyikan.',
        'success'
      );
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Gagal memperbarui status kecamatan.', 'error');
    }
  };

  const columns = [
    {
      key: 'nama',
      label: 'Nama Kecamatan',
      render: (item) => (
        <div>
          <span className="font-semibold text-dark-900 dark:text-cream-100 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-600" /> {item.nama}
          </span>
          <span className="text-xs text-dark-400 font-mono">
            {item.slug}
          </span>
        </div>
      )
    },
    {
      key: 'deskripsi',
      label: 'Karakteristik & Wilayah',
      render: (item) => (
        <p className="text-xs text-dark-600 dark:text-cream-300 line-clamp-2 max-w-md">
          {item.deskripsi}
        </p>
      )
    },
    {
      key: 'jumlahBudaya',
      label: 'Warisan Tercatat',
      render: (item) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-cream-200 dark:bg-dark-700 text-primary-800 dark:text-accent-400">
          {item.jumlahBudaya || 0} Budaya
        </span>
      )
    },
    {
      key: 'published',
      label: 'Status Peta',
      render: (item) => (
        <StatusBadge published={item.published !== false} />
      )
    }
  ];

  return (
    <AdminLayout title="Kelola Kecamatan">
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
              <MapPin className="w-6 h-6 text-primary-700 dark:text-accent-400" />
              Wilayah Kecamatan Bengkulu Utara
            </h2>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
              Kelola 19 kecamatan resmi atau tambahkan kecamatan baru (pemekaran wilayah)
            </p>
          </div>

          <Link
            to="/admin/kecamatan/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Kecamatan (Pemekaran)
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" text="Memuat daftar kecamatan..." />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={kecamatanList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            searchPlaceholder="Cari nama kecamatan atau deskripsi..."
            emptyMessage="Belum ada data kecamatan."
            getItemName={(item) => item?.nama}
          />
        )}
      </div>
    </AdminLayout>
  );
}
