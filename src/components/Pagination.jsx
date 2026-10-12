import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          style={{
            minWidth: '2.25rem',
            height: '2.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: currentPage === i ? 'var(--primary)' : 'var(--border)',
            backgroundColor: currentPage === i ? 'var(--primary)' : '#ffffff',
            color: currentPage === i ? '#ffffff' : 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '2rem'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="btn btn-outline btn-sm"
        style={{ padding: '0.5rem 0.75rem' }}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      <div style={{ display: 'flex', gap: '0.375rem' }}>
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="btn btn-outline btn-sm"
        style={{ padding: '0.5rem 0.75rem' }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
