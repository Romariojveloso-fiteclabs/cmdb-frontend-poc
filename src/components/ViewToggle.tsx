import React from 'react';

export type ResultViewMode = 'cards' | 'table';

interface ViewToggleProps {
  viewMode: ResultViewMode;
  onChange: (mode: ResultViewMode) => void;
  cardsLabel: string;
  tableLabel: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange, cardsLabel, tableLabel }) => (
  <div style={{ display: 'flex', border: '1px solid var(--input-border)', borderRadius: '4px', overflow: 'hidden' }}>
    <button
      type="button"
      onClick={() => onChange('cards')}
      style={{
        background: viewMode === 'cards' ? 'var(--primary-color)' : 'transparent',
        color: viewMode === 'cards' ? 'var(--primary-color-text)' : 'var(--text-color-secondary)',
        border: 'none',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer'
      }}
    >
      {cardsLabel}
    </button>
    <button
      type="button"
      onClick={() => onChange('table')}
      style={{
        background: viewMode === 'table' ? 'var(--primary-color)' : 'transparent',
        color: viewMode === 'table' ? 'var(--primary-color-text)' : 'var(--text-color-secondary)',
        border: 'none',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer'
      }}
    >
      {tableLabel}
    </button>
  </div>
);
