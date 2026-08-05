import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

// Import Constants
import { ORDER_STATUS_VALUES } from '../../constants';

// Import Hooks
import { usePagination } from '../../hooks/usePagination';

import Badge from './Badge';
import Pagination from './Pagination';

function UserOrdersTable({ orders }) {
  const { currentPage, totalPages, pageData, goToPrevPage, goToNextPage } = usePagination(
    orders,
    10
  );
  const navigate = useNavigate();

  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="bg-primary-500 w-full table-auto border-collapse border-2 border-primary-600 rounded-card text-center overflow-hidden whitespace-no-wrap">
          <thead className="bg-primary-500 h-10 uppercase font-bold text-white">
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className="bg-primary-50 text-primary-700">
            {pageData.map((order) => (
              <tr
                key={order._id}
                onClick={() => navigate(`/my-orders/${order._id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/my-orders/${order._id}`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View order ${order._id}`}
                className="cursor-pointer hover:bg-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <td className="border border-primary-200 px-4 py-2 sm:px-2 sm:py-1">{order._id}</td>
                <td className="border border-primary-200 px-4 py-2 sm:px-2 sm:py-1">
                  {order.user}
                </td>
                <td className="border border-primary-200 px-4 py-2 sm:px-2 sm:py-1">
                  ${order.totalPrice}
                </td>
                <td className="border border-primary-200 px-4 py-2 sm:px-2 sm:py-1">
                  <Badge.OrderStatus status={order.status} />
                </td>
                <td className="border border-primary-200 px-4 py-2 sm:px-2 sm:py-1">
                  {order.createdAt.substring(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={goToPrevPage}
        onNext={goToNextPage}
        variant="outline"
      />

      <div className="flex flex-col sm:flex-row items-center justify-center my-4 gap-2">
        {ORDER_STATUS_VALUES.map((status, index) => (
          <div key={status} className="flex items-center gap-2">
            <Badge.OrderStatus status={status} />
            {index !== ORDER_STATUS_VALUES.length - 1 && (
              <>
                <FaChevronRight className="hidden sm:inline-block text-primary-300" />
                <FaChevronDown className="sm:hidden text-primary-300" />
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

UserOrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default UserOrdersTable;
