import { motion } from 'framer-motion';

/**
 * Reusable Button component supporting various styles, sizes, and anchor rendering.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or nested elements
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} [props.variant='primary'] - Visual variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 * @param {Function} [props.onClick] - Click event handler
 * @param {string} [props.href] - Optional URL; if present, renders as an anchor link
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Button type (when rendered as button)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.target] - Target attribute when rendered as link
 * @param {string} [props.rel] - Rel attribute when rendered as link
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false,
  target,
  rel,
  ...props
}) {
  // Variant styles matching Bengkulu Utara terracotta & cream palette
  const variantStyles = {
    primary:
      'bg-primary-700 hover:bg-primary-800 text-white shadow-sm hover:shadow-md active:bg-primary-900 dark:bg-primary-600 dark:hover:bg-primary-500 border border-transparent focus-visible:ring-primary-600',
    secondary:
      'bg-cream-200 hover:bg-cream-300 text-dark-800 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-cream-100 border border-cream-300 dark:border-dark-600 shadow-sm focus-visible:ring-primary-500',
    outline:
      'bg-transparent border-2 border-primary-600 text-primary-700 hover:bg-primary-50 active:bg-primary-100 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-950/40 focus-visible:ring-primary-500',
    ghost:
      'bg-transparent text-primary-700 hover:bg-primary-100/60 active:bg-primary-200/60 dark:text-primary-300 dark:hover:bg-dark-700/60 border border-transparent focus-visible:ring-primary-500'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-6 py-2.5 text-base font-semibold gap-2.5'
  };

  const baseStyles =
    'inline-flex items-center justify-center rounded-lg select-none transition-colors duration-200 cursor-pointer text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-900';

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none'
    : '';

  const combinedClassName = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${disabledStyles} ${className}`.trim();

  const hoverAnimation = disabled ? undefined : { scale: 1.02 };
  const tapAnimation = disabled ? undefined : { scale: 0.98 };

  if (href) {
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const computedRel = rel || (isExternal ? 'noopener noreferrer' : undefined);

    return (
      <motion.a
        href={disabled ? undefined : href}
        className={combinedClassName}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        target={target}
        rel={computedRel}
        aria-disabled={disabled}
        role="button"
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
