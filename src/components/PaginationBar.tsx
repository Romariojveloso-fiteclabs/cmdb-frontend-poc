import React from 'react';

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  info: string;
  previousLabel: string;
  nextLabel: string;
  margin?: string;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  totalPages,
  onPrev,
  onNext,
  info,
  previousLabel,
  nextLabel,
  margin = '18px 0 0'
}) => (
  <div className="results-pagination" style={{ margin }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>
      {info}
    </span>
    <div style={{ display: 'flex', gap: '6px' }}>
      <button
        type="button"
        disabled={page === 0}
        onClick={onPrev}
        style={{
          background: page === 0 ? 'var(--surface-100)' : 'var(--surface-card)',
          border: '1px solid var(--input-border)',
          borderRadius: '4px',
          padding: '6px 12px',
          fontSize: '12px',
          cursor: page === 0 ? 'not-allowed' : 'pointer'
        }}
      >
        {previousLabel}
      </button>
      <button
        type="button"
        disabled={page >= totalPages - 1}
        onClick={onNext}
        style={{
          background: page >= totalPages - 1 ? 'var(--surface-100)' : 'var(--surface-card)',
          border: '1px solid var(--input-border)',
          borderRadius: '4px',
          padding: '6px 12px',
          fontSize: '12px',
          cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer'
        }}
      >
        {nextLabel}
      </button>
    </div>
  </div>
);
