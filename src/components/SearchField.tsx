import React from 'react';
import { Search } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'search';
}

export const SearchField: React.FC<SearchFieldProps> = ({ value, onChange, placeholder, type = 'text' }) => (
  <div style={{ position: 'relative' }}>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '9px 12px 9px 34px',
        borderRadius: '4px',
        border: '1px solid var(--input-border)',
        background: 'var(--surface-ground)',
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        color: 'var(--text-color)'
      }}
    />
    <Search size={16} color="var(--secondary-color)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
  </div>
);
