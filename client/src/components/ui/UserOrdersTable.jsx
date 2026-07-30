import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

// Import Constants
import { ORDER_STATUS_VALUES } from '../../constants';

import Badge from './Badge';
import Button from './Button';

function UserOrdersTable({ orders }) {
  const ordersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;

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
            {orders.slice(startIndex, endIndex).map((order) => (
              <tr
                key={order._id}
                onClick={() => navigate(`/my-orders/${order._id}`)}
                className="cursor-pointer hover:bg-primary-100 transition-colors"
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

      {orders.length > ordersPerPage && (
        <div className="flex justify-center items-center my-2">
          {currentPage > 1 && (
            <Button
              variant="outline"
              className="rounded-pill"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
          )}
          <span className="mx-4 text-neutral-800">
            Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)}
          </span>
          {currentPage < Math.ceil(orders.length / ordersPerPage) && (
            <Button
              variant="outline"
              className="rounded-pill"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
        </div>
      )}

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
