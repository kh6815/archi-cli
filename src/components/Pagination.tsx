/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

const paginationStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .pagination-button {
    margin: 0 5px;
    padding: 10px;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f4f4f4;
    text-align: center;
    &:hover {
      background-color: #ddd;
    }
    &.active {
      background-color: #333;
      color: #fff;
    }
  }
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div css={paginationStyle}>
      {pageNumbers.map(number => (
        <div
          key={number}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </div>
      ))}
    </div>
  );
}

export default Pagination;
