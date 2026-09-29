import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  ArrowLeft,
  X,
  ShieldCheck
} from 'lucide-react';

/**
 * AdminSidebar navigation menu
 * @param {Object} props
 * @param {boolean} [props.isOpen] - Mobile drawer visibility
 * @param {() => void} [props.onClose] - Mobile drawer close handler
 */
export default function AdminSidebar({ isOpen = false, onClose }) {
  const navItems = [
    {
      to: '/admin',
      end: true,
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/admin/berita',
      end: false,
      label: 'Berita',
      icon: Newspaper
    },
    {
      to: '/admin/event',
      end: false,
      label: 'Event',
      icon: CalendarDays
    }
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-dark-950/70 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-dark-800 text-cream-100 flex flex-col border-r border-dark-700 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo / Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-dark-700">
          <Link
            to="/admin"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center text-white shadow-xs group-hover:bg-primary-600 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-heading font-bold text-lg tracking-wider text-white">
                  BU ADMIN
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
              </div>
              <div className="h-0.5 w-12 bg-accent-400 rounded-full mt-0.5" />
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
            aria-label="Tutup menu sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-dark-400 uppercase">
            Menu Utama
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-700 text-white shadow-sm font-semibold'
                      : 'text-cream-300 hover:text-white hover:bg-dark-700/70'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="py-3">
            <div className="h-px bg-dark-700 mx-2" />
          </div>

          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-dark-400 uppercase">
            Navigasi Luar
          </div>

          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-cream-300 hover:text-white hover:bg-dark-700/70 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Website</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-dark-700 text-xs text-dark-400 flex items-center justify-between">
          <span>Budaya Bengkulu Utara</span>
          <span className="px-2 py-0.5 rounded bg-dark-700 text-[10px] text-accent-400">
            v1.0
          </span>
        </div>
      </aside>
    </>
  );
}
