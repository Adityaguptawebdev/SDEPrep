// Concepts:
// useState
// slice()
// Math.ceil()
// Array.from() to build page numbers
// Disabled buttons

import { useState } from "react";
import "./Pagination.css";

// 23 items, so the last page is not full
const items = Array.from({ length: 23 }, (_, index) => `Item ${index + 1}`);
const ITEMS_PER_PAGE = 5;

function Pagination() {
  // 1. State
  const [currentPage, setCurrentPage] = useState(1); // pages start at 1

  // 2. Event handlers
  function goToPage(page) {
    setCurrentPage(page);
  }

  function goToPrevious() {
    setCurrentPage(currentPage - 1);
  }

  function goToNext() {
    setCurrentPage(currentPage + 1);
  }

  // 3. Main logic
  // Example with 23 items and 5 per page:
  //   totalPages = Math.ceil(23 / 5) = Math.ceil(4.6) = 5    (page 5 has only 3 items)
  //   page 3 → startIndex = (3 - 1) * 5 = 10, endIndex = 15
  //          → items.slice(10, 15) = Item 11 … Item 15        (slice's end is NOT included)
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1); // [1, 2, 3, 4, 5]

  // 4. JSX
  return (
    <div className="pagination">
      <ul className="pagination-list">
        {currentItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="pagination-info">
        Showing {startIndex + 1}–{Math.min(endIndex, items.length)} of {items.length} · Page{" "}
        {currentPage} of {totalPages}
      </p>

      <div className="pagination-controls">
        <button onClick={goToPrevious} disabled={currentPage === 1}>
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            className={page === currentPage ? "pagination-page active" : "pagination-page"}
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <button onClick={goToNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
