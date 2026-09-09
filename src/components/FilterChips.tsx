import React from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ options, active, onChange }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
    {options.map((option) => {
      const isActive = option.value === active;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          style={{
            borderRadius: '99px',
            padding: '4px 10px',
            fontFamily: 'var(--font-sans)',
            fontSize: '11.5px',
            fontWeight: 500,
            cursor: 'pointer',
            border: `1px solid ${isActive ? 'var(--primary-color)' : 'var(--input-border)'}`,
            background: isActive ? 'var(--primary-color)' : 'transparent',
            color: isActive ? 'var(--primary-color-text)' : 'var(--text-color-secondary)'
          }}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
