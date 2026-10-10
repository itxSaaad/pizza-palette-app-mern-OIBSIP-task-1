import { useState } from 'react';

// Shared pagination logic — previously reimplemented independently in
// Table.jsx (admin) and UserOrdersTable.jsx (user), each with its own
// currentPage state and slicing math.
export function usePagination(data, pageSize) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = data.slice(startIndex, endIndex);

  const goToPrevPage = () => setCurrentPage((prev) => prev - 1);
  const goToNextPage = () => setCurrentPage((prev) => prev + 1);

  return { currentPage, totalPages, pageData, goToPrevPage, goToNextPage };
}
