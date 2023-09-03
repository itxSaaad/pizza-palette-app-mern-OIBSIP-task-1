import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FaBoxOpen,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaTruck,
  FaUtensils,
} from 'react-icons/fa';

import Button from './Button';

function UserOrdersTable({ orders }) {
  const ordersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate starting and ending indices for the current page
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Received':
        return (
          <FaBoxOpen className="inline-flex items-center justify-center text-green-600" />
        );
      case 'In the Kitchen':
        return (
          <FaUtensils className="inline-flex items-center justify-center text-blue-600" />
        );
      case 'Sent for Delivery':
        return (
          <FaTruck className="inline-flex items-center justify-center text-red-600" />
        );
      case 'Delivered':
        return (
          <FaCheck className="inline-flex items-center justify-center text-green-600" />
        );
      default:
        return (
          <FaBoxOpen className="inline-flex items-center justify-center text-orange-600" />
        );
    }
  };

  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="bg-orange-400 w-full table-auto border-collapse border-2 border-orange-500 rounded-2xl text-center overflow-hidden whitespace-no-wrap">
          <thead className="bg-orange-400 h-10 uppercase font-bold text-white">
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className="bg-orange-100 text-orange-500">
            {orders.slice(startIndex, endIndex).map((order) => (
              <tr key={order._id}>
                <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                  {order._id}
                </td>
                <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                  {order.user}
                </td>
                <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                  ${order.totalPrice}
                </td>
                <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
                  {getStatusIcon(order.status)}
                </td>
                <td className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1">
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
              className="rounded-full"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
          )}
          <span className="mx-4">
            Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)}
          </span>
          {currentPage < Math.ceil(orders.length / ordersPerPage) && (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center my-4">
        <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
          <FaBoxOpen className="inline-block mr-1" />
          Recieved
        </span>

        <FaChevronRight className="hidden sm:inline-block text-orange-400 mx-2" />
        <FaChevronDown className="sm:hidden text-orange-400 mx-2" />

        <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
          <FaUtensils className="inline-block mr-1" />
          In the Kitchen
        </span>

        <FaChevronRight className="hidden sm:inline-block text-orange-400 mx-2" />
        <FaChevronDown className="sm:hidden text-orange-400 mx-2" />

        <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
          <FaTruck className="inline-block mr-1" />
          Sent for Delivery
        </span>

        <FaChevronRight className="hidden sm:inline-block text-orange-400 mx-2" />
        <FaChevronDown className="sm:hidden text-orange-400 mx-2" />

        <span className="bg-orange-500 text-white px-2 py-1 rounded-full">
          <FaCheck className="inline-block mr-1" />
          Delivered
        </span>
      </div>
    </>
  );
}

UserOrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default UserOrdersTable;
