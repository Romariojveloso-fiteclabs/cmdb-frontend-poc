import React from 'react';
import { FilterChips, FilterOption } from './FilterChips';

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ label, options, active, onChange }) => (
  <div>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
      {label}
    </div>
    <FilterChips options={options} active={active} onChange={onChange} />
  </div>
);
