import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DetailBudaya from './pages/DetailBudaya'
import JelajahBudaya from './pages/JelajahBudaya'
import SemuaBerita from './pages/SemuaBerita'
import DetailBerita from './pages/DetailBerita'
import SemuaEvent from './pages/SemuaEvent'
import DetailEvent from './pages/DetailEvent'
import NotFound from './pages/NotFound'

// Admin pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import BeritaListPage from './pages/admin/BeritaListPage'
import BeritaEditorPage from './pages/admin/BeritaEditorPage'
import EventListPage from './pages/admin/EventListPage'
import EventEditorPage from './pages/admin/EventEditorPage'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

// Scroll to top on route change
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/budaya/:slug" element={<Layout><DetailBudaya /></Layout>} />
        <Route path="/jelajah" element={<Layout><JelajahBudaya /></Layout>} />
        <Route path="/berita" element={<Layout><SemuaBerita /></Layout>} />
        <Route path="/berita/:slug" element={<Layout><DetailBerita /></Layout>} />
        <Route path="/event" element={<Layout><SemuaEvent /></Layout>} />
        <Route path="/event/:slug" element={<Layout><DetailEvent /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout title="Dashboard">
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/berita" element={
          <ProtectedRoute>
            <AdminLayout title="Kelola Berita">
              <BeritaListPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/berita/tambah" element={
          <ProtectedRoute>
            <AdminLayout title="Tambah Berita">
              <BeritaEditorPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/berita/edit/:id" element={
          <ProtectedRoute>
            <AdminLayout title="Edit Berita">
              <BeritaEditorPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/event" element={
          <ProtectedRoute>
            <AdminLayout title="Kelola Event">
              <EventListPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/event/tambah" element={
          <ProtectedRoute>
            <AdminLayout title="Tambah Event">
              <EventEditorPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/event/edit/:id" element={
          <ProtectedRoute>
            <AdminLayout title="Edit Event">
              <EventEditorPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </>
  )
}
