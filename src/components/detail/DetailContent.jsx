import React, { useState, useEffect } from 'react';
import { BookOpen, History, Compass, Hammer, Sparkles } from 'lucide-react';

/**
 * DetailContent Component
 * Structured encyclopedia content with sticky sidebar navigation and semantic article sections.
 *
 * @param {Object} props
 * @param {string} [props.deskripsi] - Cultural description
 * @param {string} [props.sejarah] - Historical background
 * @param {string} [props.filosofi] - Cultural philosophy and symbolic meaning
 * @param {string} [props.proses] - Ritual/performance/making process
 * @param {Array<string>} [props.faktaMenarik] - Array of interesting facts
 */
export default function DetailContent({
  deskripsi,
  sejarah,
  filosofi,
  proses,
  faktaMenarik
}) {
  // Define available sections dynamically based on content presence
  const sections = [
    {
      id: 'deskripsi',
      title: 'Deskripsi',
      icon: BookOpen,
      content: deskripsi,
      isList: false
    },
    {
      id: 'sejarah',
      title: 'Sejarah & Asal-usul',
      icon: History,
      content: sejarah,
      isList: false
    },
    {
      id: 'filosofi',
      title: 'Filosofi & Nilai Budaya',
      icon: Compass,
      content: filosofi,
      isList: false
    },
    {
      id: 'proses',
      title: 'Proses & Pelaksanaan',
      icon: Hammer,
      content: proses,
      isList: false
    },
    {
      id: 'fakta-menarik',
      title: 'Fakta Menarik',
      icon: Sparkles,
      content: faktaMenarik,
      isList: true
    }
  ].filter((sec) => {
    if (sec.isList) {
      return Array.isArray(sec.content) && sec.content.length > 0;
    }
    return Boolean(sec.content && typeof sec.content === 'string' && sec.content.trim().length > 0);
  });

  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'deskripsi');

  // Track scroll position to update active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <article className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Sticky Sidebar for Desktop Navigation */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-cream-50/80 dark:bg-dark-800/80 backdrop-blur-md rounded-2xl p-6 border border-cream-200/80 dark:border-dark-700 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-dark-800 dark:text-cream-100 mb-4 pb-3 border-b border-cream-200 dark:border-dark-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Daftar Isi
              </h3>
              <nav className="space-y-1.5" aria-label="Navigasi Bagian Detail">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-primary-700 text-white shadow-sm font-semibold'
                          : 'text-dark-600 dark:text-dark-300 hover:bg-cream-200/60 dark:hover:bg-dark-700/60 hover:text-primary-700 dark:hover:text-primary-300'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-accent-300'
                            : 'text-dark-400 dark:text-dark-400 group-hover:text-primary-600'
                        }`}
                      />
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Decorative Museum Seal */}
              <div className="mt-8 pt-6 border-t border-cream-200 dark:border-dark-700 text-center">
                <span className="text-[11px] uppercase tracking-widest text-dark-400 dark:text-dark-400 font-semibold block mb-1">
                  Ensiklopedi Adat & Budaya
                </span>
                <p className="text-xs text-dark-500 dark:text-dark-300 italic">
                  Dokumentasi Warisan Leluhur Kabupaten Bengkulu Utara
                </p>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {sections.map((sec) => {
              if (sec.id === 'fakta-menarik') {
                return (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className="scroll-mt-28 bg-cream-50 dark:bg-dark-800/90 rounded-2xl p-6 sm:p-8 border border-cream-200 dark:border-dark-700 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-lg bg-accent-100 dark:bg-accent-950/60 flex items-center justify-center text-accent-700 dark:text-accent-300 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark-800 dark:text-cream-50 border-l-4 border-accent-400 pl-4 leading-tight">
                        {sec.title}
                      </h2>
                    </div>

                    <ol className="space-y-4">
                      {sec.content.map((fact, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-xl bg-cream-100/60 dark:bg-dark-700/40 border border-cream-200/60 dark:border-dark-700 hover:border-accent-300/60 transition-colors"
                        >
                          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-accent-400 text-dark-900 font-heading font-bold text-sm shadow-sm">
                            {index + 1}
                          </span>
                          <p className="text-dark-700 dark:text-dark-200 text-base leading-relaxed pt-0.5 font-normal">
                            {fact}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              }

              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-28 bg-white dark:bg-dark-800/60 rounded-2xl p-6 sm:p-8 border border-cream-200/80 dark:border-dark-700/80 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark-800 dark:text-cream-50 border-l-4 border-accent-400 pl-4 leading-tight">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="prose-budaya max-w-none text-dark-700 dark:text-dark-200 text-base sm:text-lg leading-relaxed space-y-4">
                    {/* Render either HTML or formatted paragraphs */}
                    {sec.content.includes('<p>') ? (
                      <div dangerouslySetInnerHTML={{ __html: sec.content }} />
                    ) : (
                      sec.content.split('\n\n').map((para, i) => (
                        <p key={i} className="mb-4">
                          {para}
                        </p>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
