import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

const sizeClasses = {
  sm: 'text-sm px-3 py-2.5 min-h-[44px] min-w-[44px]',
  md: 'text-base px-4 py-3 min-h-[44px] min-w-[44px]',
  lg: 'text-lg px-6 py-4 min-h-[52px] min-w-[52px]',
};

const variantClasses = {
  primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white',
  secondary: 'bg-neutral-50 hover:bg-neutral-100 text-primary-600 border border-neutral-200',
  outline:
    'bg-transparent hover:bg-primary-500 text-primary-500 hover:text-white border-2 border-primary-500 transition-colors duration-200',
  danger: 'bg-error-500 hover:bg-error-600 active:bg-error-700 text-white',
  ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700',
};

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  className: additionalClassNames,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    additionalClassNames || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <FaSpinner className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;
