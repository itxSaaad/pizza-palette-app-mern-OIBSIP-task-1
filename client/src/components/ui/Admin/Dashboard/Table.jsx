import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';

import Button from '../Button';

function Table({ data, columns, handleDelete, handleChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="bg-orange-900 w-full table-auto border-collapse border-2 border-orange-900 rounded-lg text-center overflow-hidden whitespace-no-wrap">
        <thead className="bg-orange-900 h-10 uppercase font-bold">
          <tr>
            {columns.map((column) => (
              <th key={column}>{column.replace(/([A-Z])/g, ' $1').trim()}</th>
            ))}
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="bg-orange-700 text-orange-100">
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((column) => (
                <td
                  key={column}
                  className="border border-orange-500 px-4 py-2 sm:px-2 sm:py-1"
                >
                  {column === 'isAdmin' ? (
                    <input
                      className="h-5 w-5 "
                      type="checkbox"
                      checked={row[column]}
                      onChange={() => handleChange(row._id, !row[column])}
                    />
                  ) : column === 'imageUrl' ? (
                    <img
                      className="h-14 w-14 rounded-lg"
                      src={row[column]}
                      alt={row[column]}
                    />
                  ) : column === 'avatar' ? (
                    <img
                      className="h-14 w-14 rounded-lg"
                      src={row[column]}
                      alt={row[column]}
                    />
                  ) : (
                    row[column]
                  )}
                </td>
              ))}

              <td className="border border-orange-500">
                <Button
                  variant="danger"
                  className="rounded-md"
                  onClick={() => handleDelete(row._id)}
                >
                  <FaTrash className="text-white" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Table;
