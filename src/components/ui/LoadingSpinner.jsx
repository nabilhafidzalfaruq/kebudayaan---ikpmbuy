/**
 * LoadingSpinner component with terracotta branding for inline, section, and full-page loading states.
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner size: sm (inline), md (section), lg (full page)
 * @param {string | null} [props.text='Memuat...'] - Optional loading text displayed alongside or below the spinner
 * @param {string} [props.className=''] - Additional container classes
 */
export default function LoadingSpinner({
  size = 'md',
  text = 'Memuat...',
  className = ''
}) {
  const sizeConfig = {
    sm: {
      container: 'p-2 flex-row gap-2',
      spinner: 'w-5 h-5 border-2',
      textSize: 'text-xs text-dark-600 dark:text-dark-300'
    },
    md: {
      container: 'py-12 flex-col gap-3',
      spinner: 'w-10 h-10 border-[3px]',
      textSize: 'text-sm text-dark-600 dark:text-dark-300 font-medium'
    },
    lg: {
      container: 'min-h-screen py-16 flex-col gap-4',
      spinner: 'w-14 h-14 border-4',
      textSize: 'text-base font-heading font-medium text-dark-700 dark:text-cream-200 tracking-wide'
    }
  };

  const currentConfig = sizeConfig[size] || sizeConfig.md;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center text-center ${currentConfig.container} ${className}`.trim()}
    >
      {/* Terracotta Spinning Ring */}
      <div
        className={`${currentConfig.spinner} rounded-full border-primary-200 border-t-primary-600 dark:border-primary-950 dark:border-t-primary-500 animate-spin`}
        aria-hidden="true"
      />

      {/* Loading Text */}
      {text ? (
        <span className={currentConfig.textSize}>{text}</span>
      ) : (
        <span className="sr-only">Memuat...</span>
      )}
    </div>
  );
}
