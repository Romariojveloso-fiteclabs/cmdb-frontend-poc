import React from 'react';

interface FilterPanelProps {
  children: React.ReactNode;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ children }) => (
  <aside
    className="filters-panel"
    style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--surface-border)',
      borderRadius: '6px',
      padding: '18px',
      position: 'sticky',
      top: '88px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}
  >
    {children}
  </aside>
);
