import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

// Import Components
import Button from '../../Button';

function Table({ data, columns, handleDelete, handleChange }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="bg-orange-700 w-full table-auto border-collapse border-2 border-orange-700 rounded-lg text-center overflow-hidden whitespace-no-wrap">
          <thead className="bg-orange-700 h-10 uppercase font-bold">
            <tr>
              {columns.map((column) => (
                <th key={column}>{column.replace(/([A-Z])/g, ' $1').trim()}</th>
              ))}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="bg-orange-600 text-orange-100">
            {data.slice(startIndex, endIndex).map((row) => (
              <tr key={row._id}>
                {columns.map((column) => (
                  <td
                    key={column}
                    className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1"
                  >
                    {column === 'numberOfOrders' ? (
                      row.orders.length
                    ) : column === 'isApproved' ? (
                      <input
                        type="checkbox"
                        checked={row[column]}
                        onChange={() => handleChange(row._id)}
                      />
                    ) : (
                      row[column]
                    )}
                  </td>
                ))}
                <td className="border border-orange-500">
                  <Button
                    variant="secondary"
                    className="rounded-md"
                    onClick={() => handleDelete(row._id)}
                  >
                    <FaTrash className="text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > itemsPerPage && (
        <div className="flex justify-center items-center my-2">
          {currentPage > 1 && (
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>
          )}
          <span className="mx-4">
            Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
          </span>
          {currentPage < Math.ceil(data.length / itemsPerPage) && (
            <Button
              variant="secondary"
              className="rounded-full"
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
