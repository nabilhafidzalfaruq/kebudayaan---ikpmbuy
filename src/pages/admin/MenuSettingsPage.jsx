import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Info
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getNavSettings,
  saveNavSettings,
  resetNavSettings
} from '../../utils/navSettings';

export default function MenuSettingsPage() {
  const [settings, setSettings] = useState({});
  const [notification, setNotification] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSettings(getNavSettings());
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          visible: !prev[key].visible
        }
      };
      setHasChanges(true);
      return updated;
    });
  };

  const handleSave = () => {
    saveNavSettings(settings);
    setHasChanges(false);
    showToast('Pengaturan menu & visibilitas navigasi berhasil disimpan!');
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan seluruh visibilitas menu navigasi ke pengaturan awal?')) {
      const def = resetNavSettings();
      setSettings(def);
      setHasChanges(false);
      showToast('Visibilitas menu dikembalikan ke pengaturan standar.', 'info');
    }
  };

  const menuList = Object.entries(settings);

  return (
    <AdminLayout title="Pengaturan Menu & Navigasi">
      <div className="space-y-8 max-w-5xl">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between shadow-md transition-all ${
              notification.type === 'info'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-primary-800 to-primary-950 rounded-2xl p-6 sm:p-8 text-cream-100 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-400 text-dark-950 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Kontrol Visibilitas Web
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
              Atur Menu & Seksi Tampilan Website
            </h2>
            <p className="text-sm text-cream-200/90 leading-relaxed">
              Tentukan menu apa saja di bilah navigasi dan seksi beranda yang ingin Anda tampilkan atau sembunyikan untuk publik. Perubahan akan langsung tersinkronisasi ke seluruh halaman website.
            </p>
          </div>
        </div>

        {/* Live Preview Bar (mirip foto yang diunggah) */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 dark:border-dark-700 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary-700 dark:text-accent-400" />
              <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100">
                Pratinjau Langsung Bilah Menu (Navbar Preview)
              </h3>
            </div>
            <span className="text-xs text-dark-500 dark:text-dark-400">
              Pratinjau Navigasi Publik
            </span>
          </div>

          <p className="text-xs text-dark-500 dark:text-dark-400">
            Berikut simulasi tampilan menu navigasi di website saat ini sesuai toggle di bawah:
          </p>

          {/* Simulated Dark Header Navbar */}
          <div className="bg-dark-900 text-cream-100 rounded-xl px-6 py-4 flex flex-wrap items-center gap-6 shadow-inner border border-dark-700 overflow-x-auto">
            {menuList.map(([key, item]) => {
              if (!item.visible) return null;
              return (
                <span
                  key={key}
                  className={`text-sm font-medium transition-all ${
                    key === 'beranda'
                      ? 'text-accent-400 border-b-2 border-accent-400 pb-1'
                      : 'text-cream-200 hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
              );
            })}
            {menuList.every(([, item]) => !item.visible) && (
              <span className="text-xs italic text-gray-500">
                Semua menu navigasi dinonaktifkan
              </span>
            )}
          </div>
        </div>

        {/* Menu Toggles Table / Card */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xs border border-cream-300 dark:border-dark-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 dark:border-dark-700 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-dark-900 dark:text-cream-100">
                Daftar Menu & Status Tampilan
              </h3>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Klik saklar untuk menampilkan atau menyembunyikan menu dari pengunjung
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-cream-300 dark:border-dark-700 text-xs font-medium text-dark-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-dark-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Default
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold shadow-md transition disabled:opacity-40"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Toggle List */}
          <div className="divide-y divide-cream-200 dark:divide-dark-700">
            {menuList.map(([key, item]) => {
              const isVisible = Boolean(item.visible);

              return (
                <div
                  key={key}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-cream-50/50 dark:hover:bg-dark-900/30 px-3 rounded-lg transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-dark-900 dark:text-cream-100">
                        {item.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cream-200 dark:bg-dark-700 text-dark-600 dark:text-cream-300">
                        {item.href}
                      </span>
                      {isVisible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          <Eye className="w-3 h-3" /> Tampil
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-full">
                          <EyeOff className="w-3 h-3" /> Disembunyikan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      isVisible ? 'bg-primary-600' : 'bg-gray-300 dark:bg-dark-600'
                    }`}
                    aria-label={`Toggle visibilitas ${item.label}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                        isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Save Bar when changes exist */}
          {hasChanges && (
            <div className="pt-4 flex items-center justify-between border-t border-cream-200 dark:border-dark-700 bg-cream-100/50 dark:bg-dark-900/40 p-4 rounded-xl">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Ada perubahan visibilitas yang belum disimpan.
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold shadow-md transition"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
