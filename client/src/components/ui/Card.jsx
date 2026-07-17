import PropTypes from 'prop-types';

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

function Card({
  padding = 'md',
  as: Component = 'div',
  children,
  className: additionalClassNames,
  ...props
}) {
  const classes = [
    'bg-neutral-50 rounded-card shadow-card border border-neutral-100',
    paddingClasses[padding],
    additionalClassNames || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

Card.propTypes = {
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
