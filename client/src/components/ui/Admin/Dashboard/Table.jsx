import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

// Import Constants
import { ORDER_STATUS, PAYMENT_STATUS } from '../../../../constants';

// Import Components
import Button from '../../Button';

function formatColumnLabel(column) {
  return column.replace(/([A-Z])/g, ' $1').trim();
}

function renderCellValue(column, row, handleChange) {
  if (column === 'numberOfOrders') {
    return row.orders.length;
  }
  if (column === 'isApproved') {
    return (
      <input
        type="checkbox"
        className="w-5 h-5 accent-primary-500"
        checked={row[column]}
        onChange={() => handleChange(row._id)}
      />
    );
  }
  if (column === 'isVerified') {
    return row[column] ? 'Verified' : 'Not Verified';
  }
  if (column === 'status') {
    return (
      <select
        className="bg-primary-700 text-primary-50 rounded-control p-2 min-h-[44px]"
        value={row[column]}
        onChange={(e) => handleChange(row._id, e.target.value)}
      >
        <option value={ORDER_STATUS.RECEIVED}>{ORDER_STATUS.RECEIVED}</option>
        <option value={ORDER_STATUS.IN_KITCHEN}>{ORDER_STATUS.IN_KITCHEN}</option>
        <option value={ORDER_STATUS.OUT_FOR_DELIVERY}>{ORDER_STATUS.OUT_FOR_DELIVERY}</option>
        <option value={ORDER_STATUS.DELIVERED}>{ORDER_STATUS.DELIVERED}</option>
      </select>
    );
  }
  if (column === 'paymentStatus') {
    return (
      <div className="flex flex-col items-center">
        <select
          className="bg-primary-700 text-primary-50 rounded-control p-2 min-h-[44px]"
          value={row.payment?.status}
          onChange={(e) => handleChange(row._id, e.target.value, 'payment')}
          disabled={row.payment?.method !== 'cod'}
        >
          <option value={PAYMENT_STATUS.PENDING}>Pending</option>
          <option value={PAYMENT_STATUS.PAID}>Paid</option>
          <option value={PAYMENT_STATUS.FAILED}>Failed</option>
        </select>
        {row.payment?.method !== 'cod' && (
          <span className="text-xs text-primary-200 block mt-1">
            (Only COD editable)
          </span>
        )}
      </div>
    );
  }
  if (column === 'orderItems') {
    return (
      <table className="bg-primary-700 w-full table-auto border-collapse border-2 border-primary-700 rounded-control text-center overflow-hidden">
        <thead>
          <tr>
            <th>Pizza</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {row[column].map((item) => (
            <tr key={item._id}>
              <td className="border border-primary-500 px-4 py-2 sm:px-2 sm:py-1">
                {typeof item.pizza === 'object'
                  ? item.pizza?.name || item.pizza?._id || '—'
                  : item.pizza}
              </td>
              <td className="border border-primary-500 px-4 py-2 sm:px-2 sm:py-1">
                {item.qty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const value = row[column];

  // Arrays of primitives (e.g. an admin's permissions) read best joined.
  if (Array.isArray(value)) {
    return value.join(', ') || '—';
  }

  // Populated Mongo references arrive as objects (e.g. order.user as
  // {_id, name, email}); rendering them raw crashes React, so show their
  // most human-readable field instead.
  if (value && typeof value === 'object') {
    return value.name || value.email || value._id || '—';
  }

  return value ?? '—';
}

function Table({ data, columns, handleDelete, handleChange }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  return (
    <>
      {/* Desktop/tablet: real table, md and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="bg-primary-500 w-full table-auto border-collapse border-2 border-primary-500 rounded-card text-center overflow-hidden">
          <thead className="bg-primary-500 h-10 uppercase font-bold text-white">
            <tr>
              {columns.map((column) => (
                <th key={column}>{formatColumnLabel(column)}</th>
              ))}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="bg-primary-100 text-primary-800">
            {pageData.map((row) => (
              <tr key={row._id}>
                {columns.map((column) => (
                  <td
                    key={column}
                    className="border border-primary-300 px-4 py-2 sm:px-2 sm:py-1"
                  >
                    {renderCellValue(column, row, handleChange)}
                  </td>
                ))}
                <td className="border border-primary-300">
                  <Button
                    variant="secondary"
                    className="rounded-control"
                    onClick={() => handleDelete(row._id)}
                    aria-label="Delete row"
                  >
                    <FaTrash className="text-error-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards, below md */}
      <div className="md:hidden space-y-4">
        {pageData.map((row) => (
          <div
            key={row._id}
            className="bg-primary-50 border-2 border-primary-200 rounded-card p-4 space-y-2"
          >
            {columns.map((column) => (
              <div key={column} className="flex flex-col">
                <span className="text-xs uppercase font-bold text-primary-600">
                  {formatColumnLabel(column)}
                </span>
                <span className="text-neutral-800 break-words">
                  {renderCellValue(column, row, handleChange)}
                </span>
              </div>
            ))}
            <Button
              variant="secondary"
              className="rounded-control w-full mt-2"
              onClick={() => handleDelete(row._id)}
            >
              <FaTrash className="text-error-500 mr-2" />
              Delete
            </Button>
          </div>
        ))}
      </div>

      {data.length > itemsPerPage && (
        <div className="flex justify-center items-center my-2 gap-2">
          {currentPage > 1 && (
            <Button
              variant="secondary"
              className="rounded-pill"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
          )}
          <span className="mx-4 text-neutral-700">
            Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
          </span>
          {currentPage < Math.ceil(data.length / itemsPerPage) && (
            <Button
              variant="secondary"
              className="rounded-pill"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
        </div>
      )}
    </>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
  handleChange: PropTypes.func,
};

export default Table;
