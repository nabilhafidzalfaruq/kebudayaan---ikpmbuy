import React, { useState, useMemo } from 'react';
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Inbox
} from 'lucide-react';
import DeleteModal from './DeleteModal';

/**
 * Reusable DataTable component with search filter, action buttons, and confirmation modal.
 *
 * @param {Object} props
 * @param {Array<{ key: string, label: string, render?: (item: any, idx: number) => React.ReactNode, className?: string }>} props.columns - Column definitions
 * @param {Array<Object>} props.data - Data rows array
 * @param {(item: Object) => void} [props.onEdit] - Edit handler
 * @param {(id: string) => Promise<any> | void} [props.onDelete] - Delete handler
 * @param {(id: string, currentPublished: boolean) => Promise<any> | void} [props.onTogglePublish] - Toggle publish status handler
 * @param {string} [props.searchPlaceholder='Cari data...'] - Search input placeholder
 * @param {string} [props.emptyMessage='Tidak ada data yang ditemukan.'] - Message displayed when empty
 * @param {(item: Object) => string} [props.getItemName] - Accessor for modal delete item title
 */
export default function DataTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onTogglePublish,
  searchPlaceholder = 'Cari data...',
  emptyMessage = 'Tidak ada data yang ditemukan.',
  getItemName = (item) => item?.judul || item?.nama || 'item ini'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState(null);

  // Filter rows based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase().trim();

    return data.filter((row) => {
      return Object.values(row).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm]);

  // Handle delete action initiation
  const handleDeleteClick = (item) => {
    setSelectedItemForDelete(item);
    setDeleteModalOpen(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!selectedItemForDelete || !onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(selectedItemForDelete.id);
      setDeleteModalOpen(false);
      setSelectedItemForDelete(null);
    } catch (err) {
      console.error('Error deleting item in DataTable:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle toggle publish
  const handleToggleClick = async (item) => {
    if (!onTogglePublish) return;
    try {
      setIsTogglingId(item.id);
      await onTogglePublish(item.id, item.published);
    } catch (err) {
      console.error('Error toggling publish status:', err);
    } finally {
      setIsTogglingId(null);
    }
  };

  const hasActions = Boolean(onEdit || onDelete || onTogglePublish);

  return (
    <div className="space-y-4">
      {/* Top Controls: Search Bar & Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-800 dark:text-cream-100 placeholder-dark-400 dark:placeholder-dark-500 focus:outline-hidden focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="text-xs text-dark-500 dark:text-dark-400 self-end sm:self-center">
          Menampilkan <span className="font-semibold text-dark-800 dark:text-cream-200">{filteredData.length}</span> dari {data.length} data
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-cream-300 dark:border-dark-700 bg-white dark:bg-dark-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-cream-200 dark:border-dark-700 bg-cream-100/60 dark:bg-dark-800/80 text-xs font-semibold uppercase tracking-wider text-dark-600 dark:text-dark-300">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3.5 px-4 ${col.className || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
                {hasActions && (
                  <th className="py-3.5 px-4 text-right pr-6 w-32">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-cream-100 dark:divide-dark-800 text-sm">
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-cream-50/70 dark:hover:bg-dark-800/50 transition-colors group"
                  >
                    {/* Index Number */}
                    <td className="py-4 px-4 text-center text-xs text-dark-400 dark:text-dark-500">
                      {idx + 1}
                    </td>

                    {/* Data Columns */}
                    {columns.map((col) => (
                      <td
                        key={`${row.id || idx}-${col.key}`}
                        className={`py-4 px-4 text-dark-700 dark:text-cream-200 ${col.className || ''}`}
                      >
                        {col.render ? col.render(row, idx) : row[col.key] ?? '-'}
                      </td>
                    ))}

                    {/* Action Column */}
                    {hasActions && (
                      <td className="py-4 px-4 text-right pr-6 whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Toggle Publish */}
                          {onTogglePublish && (
                            <button
                              type="button"
                              onClick={() => handleToggleClick(row)}
                              disabled={isTogglingId === row.id}
                              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                row.published
                                  ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700'
                              }`}
                              title={row.published ? 'Jadikan Draft' : 'Publikasikan'}
                            >
                              {row.published ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Edit Button */}
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(row)}
                              className="p-1.5 rounded-lg text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-100 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                              title="Edit item"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Button */}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(row)}
                              className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                              title="Hapus item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 2 : 1)}
                    className="py-12 px-4 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cream-100 dark:bg-dark-800 flex items-center justify-center text-dark-400">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-dark-700 dark:text-cream-200">
                        {emptyMessage}
                      </div>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="text-xs text-primary-700 dark:text-primary-400 hover:underline cursor-pointer"
                        >
                          Bersihkan pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedItemForDelete ? getItemName(selectedItemForDelete) : ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
