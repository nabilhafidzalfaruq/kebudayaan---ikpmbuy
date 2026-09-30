import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Share2, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const navigasiLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Jelajah Budaya', href: '/jelajah' },
    { label: 'Komoditas Daerah', href: '/komoditas' },
    { label: 'Peta Kecamatan', href: '/#peta' },
    { label: 'Berita Budaya', href: '/berita' },
    { label: 'Agenda Event', href: '/event' },
    { label: 'Kuliner Tradisional', href: '/#kuliner' },
    { label: 'Tentang Kami', href: '/#tentang' },
  ];

  const kategoriLinks = [
    { label: 'Seni & Pertunjukan', href: '/jelajah?kategori=Seni%20%26%20Pertunjukan' },
    { label: 'Tradisi & Upacara', href: '/jelajah?kategori=Tradisi%20%26%20Upacara' },
    { label: 'Kuliner Tradisional', href: '/jelajah?kategori=Kuliner' },
    { label: 'Pakaian Adat', href: '/jelajah?kategori=Pakaian%20Adat' },
    { label: 'Rumah Adat', href: '/jelajah?kategori=Rumah%20Adat' },
    { label: 'Bahasa & Aksara', href: '/jelajah?kategori=Bahasa%20%26%20Aksara' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Globe, href: 'https://instagram.com' },
    { name: 'Facebook', icon: MessageCircle, href: 'https://facebook.com' },
    { name: 'Youtube', icon: Share2, href: 'https://youtube.com' },
    { name: 'Email', icon: Mail, href: 'mailto:info@bengkuluutara.go.id' },
  ];

  return (
    <footer className="bg-dark-800 text-cream-200 border-t border-dark-700/80 transition-colors">
      {/* Top Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div>
              <span className="font-heading text-2xl font-bold tracking-wider text-white">
                BENGKULU UTARA
              </span>
              <div className="h-0.5 w-16 bg-accent-400 rounded-full mt-1" />
              <p className="text-xs uppercase tracking-widest text-accent-400 font-semibold mt-1">
                Bumi Sungkai
              </p>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed">
              Platform digital untuk mengenal, menjaga, dan melestarikan warisan budaya Kabupaten Bengkulu Utara, Bumi Sungkai.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center text-xs text-cream-400 bg-dark-700 px-3 py-1.5 rounded-full border border-dark-600">
                Kabupaten Bengkulu Utara, Bengkulu
              </span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <span>Navigasi</span>
              <span className="h-1 w-6 bg-primary-600 rounded-full" />
            </h3>
            <ul className="space-y-2.5">
              {navigasiLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-cream-300 hover:text-accent-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-accent-400/50 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all text-xs">
                      ›
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Kategori Budaya */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <span>Kategori Budaya</span>
              <span className="h-1 w-6 bg-accent-400 rounded-full" />
            </h3>
            <ul className="space-y-2.5">
              {kategoriLinks.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.href}
                    className="text-sm text-cream-300 hover:text-accent-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-accent-400/50 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all text-xs">
                      ›
                    </span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Ikuti Kami */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <span>Ikuti Kami</span>
              <span className="h-1 w-6 bg-primary-600 rounded-full" />
            </h3>
            <p className="text-sm text-cream-300 mb-4 leading-relaxed">
              Dapatkan berita terbaru, agenda festival adat, dan dokumentasi kebudayaan Bengkulu Utara.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="p-2.5 rounded-xl bg-dark-700 text-cream-300 hover:text-accent-400 hover:bg-dark-600 border border-dark-600 transition-all hover:scale-105"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <div className="mt-6 p-3.5 rounded-xl bg-dark-700/50 border border-dark-600 text-xs text-cream-300 leading-relaxed">
              Melestarikan adat Suku Rejang & Suku Pekal menuju peradaban digital berkarakter.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-700 py-6 bg-dark-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400 text-center sm:text-left">
          <p>© 2024 Budaya Bengkulu Utara. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
            <span>untuk memperkenalkan dan melestarikan budaya Bengkulu Utara.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
