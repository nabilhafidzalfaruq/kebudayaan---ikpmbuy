import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eye,
  Code,
  Pilcrow
} from 'lucide-react';

/**
 * RichTextEditor component supporting HTML editing with quick insertion toolbar and live HTML preview.
 *
 * @param {Object} props
 * @param {string} props.value - HTML content string
 * @param {(val: string) => void} props.onChange - Change handler
 * @param {string} [props.placeholder] - Textarea placeholder
 */
export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Tulis konten artikel atau deskripsi di sini (mendukung format HTML)...'
}) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const textareaRef = useRef(null);

  /**
   * Insert or wrap HTML tag around the selected text in textarea
   */
  const insertTag = (openTag, closeTag = '') => {
    if (activeTab !== 'editor') {
      setActiveTab('editor');
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const selectedText = currentVal.substring(start, end);

    let insertion = '';
    let newCursorPos = start;

    if (openTag === '<a') {
      const url = prompt('Masukkan URL tautan:', 'https://');
      if (!url) return;
      insertion = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || 'Tautan'}</a>`;
      newCursorPos = start + insertion.length;
    } else if (openTag === 'ul') {
      insertion = `<ul>\n  <li>${selectedText || 'Poin daftar'}</li>\n</ul>`;
      newCursorPos = start + insertion.length;
    } else if (openTag === 'ol') {
      insertion = `<ol>\n  <li>${selectedText || 'Poin berurutan'}</li>\n</ol>`;
      newCursorPos = start + insertion.length;
    } else {
      insertion = `${openTag}${selectedText || 'teks'}${closeTag}`;
      newCursorPos = selectedText
        ? start + insertion.length
        : start + openTag.length + 4; // cursor right after default word
    }

    const newValue =
      currentVal.substring(0, start) +
      insertion +
      currentVal.substring(end);

    if (onChange) {
      onChange(newValue);
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="border border-cream-300 dark:border-dark-600 rounded-xl overflow-hidden bg-white dark:bg-dark-900 shadow-xs focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-500 transition-all">
      {/* Top Toolbar & Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-cream-100/70 dark:bg-dark-800 border-b border-cream-200 dark:border-dark-700">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            title="Tebal (Bold)"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Miring (Italic)"
            onClick={() => insertTag('<em>', '</em>')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Garis Bawah (Underline)"
            onClick={() => insertTag('<u>', '</u>')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-cream-300 dark:bg-dark-700 mx-1" />

          <button
            type="button"
            title="Judul 2 (Heading 2)"
            onClick={() => insertTag('<h2>', '</h2>')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Judul 3 (Heading 3)"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Paragraf"
            onClick={() => insertTag('<p>', '</p>')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <Pilcrow className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-cream-300 dark:bg-dark-700 mx-1" />

          <button
            type="button"
            title="Daftar Poin (Bullet List)"
            onClick={() => insertTag('ul')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Daftar Berurutan (Ordered List)"
            onClick={() => insertTag('ol')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Tautan (Link)"
            onClick={() => insertTag('<a')}
            className="p-1.5 rounded-md text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-cream-200 dark:hover:bg-dark-700 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Editor / Preview Mode Tabs */}
        <div className="flex items-center rounded-lg bg-cream-200/80 dark:bg-dark-700 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow-xs font-semibold'
                : 'text-dark-500 dark:text-dark-300 hover:text-dark-900 dark:hover:text-cream-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-400 shadow-xs font-semibold'
                : 'text-dark-500 dark:text-dark-300 hover:text-dark-900 dark:hover:text-cream-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-64">
        {activeTab === 'editor' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className="w-full h-full min-h-64 p-4 font-mono text-sm leading-relaxed text-dark-800 dark:text-cream-100 bg-transparent resize-y focus:outline-hidden placeholder-dark-400 dark:placeholder-dark-500"
          />
        ) : (
          <div className="p-6 min-h-64 bg-cream-50/50 dark:bg-dark-950/30 overflow-y-auto max-h-[600px]">
            {value && value.trim() ? (
              <div
                className="prose-budaya text-dark-800 dark:text-cream-200"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <p className="text-sm italic text-dark-400 dark:text-dark-500">
                Belum ada konten untuk ditampilkan di preview.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Helper Footer */}
      <div className="px-4 py-1.5 bg-cream-50 dark:bg-dark-850 border-t border-cream-200 dark:border-dark-700 text-[11px] text-dark-400 dark:text-dark-500 flex justify-between items-center">
        <span>Gunakan tag HTML standar: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;</span>
        <span>{value ? `${value.length} karakter` : '0 karakter'}</span>
      </div>
    </div>
  );
}
