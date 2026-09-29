import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Admin Login Page with authentication context integration and responsive card
 */
export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const redirectPath = location.state?.from?.pathname || '/admin';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan email dan kata sandi.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      let message = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Email atau kata sandi tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Terlalu banyak percobaan gagal. Silakan coba lagi beberapa saat.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-dark-900 bg-pattern flex items-center justify-center p-4 sm:p-6 antialiased">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-3xl shadow-xl border border-cream-200 dark:border-dark-700 p-6 sm:p-10 relative">
        {/* Back to website link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-500 dark:text-dark-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Website</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-700 text-white shadow-md mb-4 ring-4 ring-primary-100 dark:ring-primary-950">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-dark-900 dark:text-cream-100 tracking-wide">
            BENGKULU UTARA
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-0.5 w-6 bg-accent-400 rounded-full" />
            <span className="text-xs uppercase tracking-widest font-semibold text-accent-600 dark:text-accent-400">
              Admin Dashboard
            </span>
            <span className="h-0.5 w-6 bg-accent-400 rounded-full" />
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">
            Masuk untuk mengelola konten kebudayaan dan event daerah
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-dark-700 dark:text-cream-200 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bengkuluutara.go.id"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder-dark-400 dark:placeholder-dark-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-dark-700 dark:text-cream-200 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-cream-300 dark:border-dark-600 bg-white dark:bg-dark-850 text-dark-900 dark:text-cream-100 focus:outline-hidden focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder-dark-400 dark:placeholder-dark-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-400 hover:text-dark-600 dark:hover:text-cream-200 transition-colors"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 active:bg-primary-800 shadow-md shadow-primary-700/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-cream-200 dark:border-dark-700 text-center">
          <p className="text-[11px] text-dark-400 dark:text-dark-500">
            Akses khusus administrator Dinas Kebudayaan Bengkulu Utara
          </p>
        </div>
      </div>
    </div>
  );
}
