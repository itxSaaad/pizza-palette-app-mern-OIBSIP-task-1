import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';

// Import Hooks
import { usePagination } from '../../../../hooks/usePagination';

// Import Components
import Button from '../../Button';
import Pagination from '../../Pagination';

function formatColumnLabel(column) {
  return column.replace(/([A-Z])/g, ' $1').trim();
}

// Table stays domain-agnostic: it only knows how to render primitives,
// arrays, and populated Mongo references generically. Any column that
// needs domain-specific UI (a status <select>, a checkbox, business logic
// like "only COD is editable") is supplied by the consumer via
// `columnRenderers`, so a new list doesn't have to add another branch here.
function renderCellValue(column, row, handleChange, columnRenderers) {
  if (columnRenderers?.[column]) {
    return columnRenderers[column](row, handleChange);
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

function Table({ data, columns, handleDelete, handleChange, columnRenderers }) {
  const { currentPage, totalPages, pageData, goToPrevPage, goToNextPage } = usePagination(data, 10);

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
                  <td key={column} className="border border-primary-300 px-4 py-2 sm:px-2 sm:py-1">
                    {renderCellValue(column, row, handleChange, columnRenderers)}
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
                <div className="text-neutral-800 break-words">
                  {renderCellValue(column, row, handleChange, columnRenderers)}
                </div>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={goToPrevPage}
        onNext={goToNextPage}
        variant="secondary"
      />
    </>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleChange: PropTypes.func,
  columnRenderers: PropTypes.objectOf(PropTypes.func),
};

export default Table;
