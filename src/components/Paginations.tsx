import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Limit the number of displayed page numbers
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // Adjust start and end page if there are not enough pages
  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    } else {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  }

  return (
    <nav>
      <ul className="pagination" style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="btn btn-dark" onClick={prevPage} disabled={currentPage === 1}>
            &laquo; Previous
          </button>
        </li>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <li key={startPage + index} className={`page-item ${currentPage === startPage + index ? "active" : ""}`}>
            <button
              className={`btn btn-ghost-dark ${currentPage === startPage + index ? "active" : ""}`}
              onClick={() => onPageChange(startPage + index)}
              style={{
                color: currentPage === startPage + index ? "white" : "black",
                backgroundColor: currentPage === startPage + index ? "#182433" : "transparent",
                textDecoration: "none",
                padding: "5px 12px",
                borderRadius: "5px",
              }}
            >
              {startPage + index}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="btn btn-dark" onClick={nextPage} disabled={currentPage === totalPages}>
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
