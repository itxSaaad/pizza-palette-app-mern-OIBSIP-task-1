import PropTypes from 'prop-types';

import Button from './Button';

// Shared Prev/Next pager, paired with the usePagination hook. Consumed by
// both the admin Table and UserOrdersTable, which previously each
// reimplemented near-identical pager JSX.
function Pagination({ currentPage, totalPages, onPrev, onNext, variant = 'secondary' }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center my-2 gap-2">
      {currentPage > 1 && (
        <Button variant={variant} className="rounded-pill" onClick={onPrev}>
          Prev
        </Button>
      )}
      <span className="mx-4 text-neutral-700">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Button variant={variant} className="rounded-pill" onClick={onNext}>
          Next
        </Button>
      )}
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  variant: PropTypes.string,
};

export default Pagination;
