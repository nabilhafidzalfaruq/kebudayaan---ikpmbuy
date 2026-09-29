/**
 * Badge component for tags, categories, kecamatan, and event statuses.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content or label
 * @param {'default' | 'kategori' | 'kecamatan' | 'status-upcoming' | 'status-ongoing' | 'status-completed' | 'upcoming' | 'ongoing' | 'completed'} [props.variant='default'] - Badge color variant
 * @param {'sm' | 'md'} [props.size='sm'] - Badge size
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) {
  // Normalize alias variants (e.g. 'upcoming' -> 'status-upcoming')
  const normalizedVariant =
    variant === 'upcoming'
      ? 'status-upcoming'
      : variant === 'ongoing'
      ? 'status-ongoing'
      : variant === 'completed'
      ? 'status-completed'
      : variant;

  const variantStyles = {
    default:
      'bg-primary-100 text-primary-800 border border-primary-200/80 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-800/60',
    kategori:
      'bg-accent-100 text-accent-800 border border-accent-300/80 dark:bg-accent-950/60 dark:text-accent-300 dark:border-accent-800/60',
    kecamatan:
      'bg-cream-200 text-dark-700 border border-cream-300 dark:bg-dark-700 dark:text-cream-200 dark:border-dark-600',
    'status-upcoming':
      'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
    'status-ongoing':
      'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
    'status-completed':
      'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-dark-700 dark:text-dark-300 dark:border-dark-600'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs tracking-wide',
    md: 'px-3 py-1 text-sm'
  };

  const baseStyles =
    'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors select-none';

  const selectedVariant = variantStyles[normalizedVariant] || variantStyles.default;
  const selectedSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`${baseStyles} ${selectedVariant} ${selectedSize} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
