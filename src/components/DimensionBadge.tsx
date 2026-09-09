import React from 'react';
import { DIMENSIONS, Lang } from '../data/families';

interface DimensionBadgeProps {
  dimKey: string;
  valKey: string;
  lang: Lang;
}

export const DimensionBadge: React.FC<DimensionBadgeProps> = ({ dimKey, valKey, lang }) => {
  const meta = DIMENSIONS[dimKey]?.[valKey];
  if (!meta) return null;
  const label = lang === 'pt' ? meta.pt : meta.en;

  let bg = 'var(--surface-100)';
  let color = 'var(--text-color-secondary)';
  if (meta.sev === 'success') { bg = 'var(--success-soft)'; color = 'var(--success-600)'; }
  if (meta.sev === 'info') { bg = 'var(--info-soft)'; color = 'var(--info-600)'; }
  if (meta.sev === 'warning') { bg = 'var(--warning-soft)'; color = 'var(--warning-600)'; }
  if (meta.sev === 'danger') { bg = 'var(--danger-soft)'; color = 'var(--danger-600)'; }

  return (
    <span style={{ background: bg, color, fontSize: '11px', fontFamily: 'var(--font-sans)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
};
