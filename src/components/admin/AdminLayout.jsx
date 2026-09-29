import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon, Bell } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminLayout component wrapping the admin dashboard area
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Main page content
 * @param {string} [props.title] - Optional topbar title
 */
export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-800 flex flex-col antialiased">
      {/* Fixed Sidebar for Desktop & Drawer for Mobile */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (offset by w-64 on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 transition-all">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-dark-850/90 backdrop-blur-md border-b border-cream-200 dark:border-dark-700 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          {/* Left section: Hamburger button + Page Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-dark-600 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-lg sm:text-xl font-heading font-bold text-dark-900 dark:text-cream-100 truncate">
              {title}
            </h1>
          </div>

          {/* Right section: User info + Logout */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* User Info Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cream-100 dark:bg-dark-700/60 border border-cream-200 dark:border-dark-600">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 flex items-center justify-center">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-dark-700 dark:text-cream-200 max-w-[120px] sm:max-w-[200px] truncate">
                {user?.email || 'Admin'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/50 cursor-pointer"
              title="Keluar dari akun admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
