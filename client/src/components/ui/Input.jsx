import PropTypes from 'prop-types';

function Input({
  label,
  name,
  id,
  error,
  helperText,
  as = 'input',
  className: additionalClassNames,
  ...props
}) {
  const inputId = id || name;
  const Field = as;

  const baseClasses =
    'w-full min-h-[44px] px-3 py-2 rounded-control border bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors duration-150';
  const stateClasses = error
    ? 'border-error-400 focus:ring-error-300'
    : 'border-neutral-200 focus:ring-primary-300 focus:border-primary-400';

  const classes = [baseClasses, stateClasses, additionalClassNames || ''].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block mb-1 text-sm font-semibold text-neutral-700">
          {label}
        </label>
      )}
      <Field id={inputId} name={name} className={classes} {...props} />
      {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-sm text-neutral-500">{helperText}</p>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  as: PropTypes.oneOf(['input', 'textarea']),
  className: PropTypes.string,
};

export default Input;
