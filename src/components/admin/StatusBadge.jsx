import React from 'react';

/**
 * StatusBadge component showing published or draft state
 * @param {{ published: boolean }} props
 */
export default function StatusBadge({ published }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Draft
    </span>
  );
}
