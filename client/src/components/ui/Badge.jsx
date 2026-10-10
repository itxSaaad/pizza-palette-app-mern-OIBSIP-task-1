import PropTypes from 'prop-types';
import { getOrderStatusColor } from '../../constants/orderStatus';

function Badge({ children, className: additionalClassNames }) {
  const classes = [
    'inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-semibold',
    additionalClassNames || 'bg-neutral-100 text-neutral-800',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function OrderStatusBadge({ status }) {
  return <Badge className={getOrderStatusColor(status)}>{status}</Badge>;
}

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

Badge.OrderStatus = OrderStatusBadge;

export default Badge;
