import React from 'react';
import { MalwareFamily, Lang } from '../data/families';
import { DimensionBadge } from './DimensionBadge';

interface FamilyCardProps {
  family: MalwareFamily;
  lang: Lang;
  onOpen: (key: string) => void;
}

export const FamilyCard: React.FC<FamilyCardProps> = ({ family: f, lang, onOpen }) => {
  return (
    <article className="content-card family-card" style={{ gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, letterSpacing: '.05em', color: 'var(--text-color)' }}>
            {f.name}
          </div>
          <div
            style={{
              fontSize: '12.5px',
              color: 'var(--text-color-secondary)',
              marginTop: '5px',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {lang === 'pt' ? f.headline.pt : f.headline.en}
          </div>
          {(f.authors || f.alias) && (
            <div style={{ fontSize: '11px', color: 'var(--success-color)', marginTop: '5px' }}>
              {f.authors || f.alias}
            </div>
          )}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.12em', color: 'var(--info-color)', whiteSpace: 'nowrap', textAlign: 'right' }}>
          {f.cat}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--surface-border)', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-color-secondary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {lang === 'pt' ? 'EDITORIAL' : 'EDITORIAL'}
          </span>
          <DimensionBadge dimKey="ed" valKey={f.ed} lang={lang} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-color-secondary)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {lang === 'pt' ? 'EVIDÊNCIA' : 'EVIDENCE'}
          </span>
          <DimensionBadge dimKey="ev" valKey={f.ev} lang={lang} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderTop: '1px solid var(--surface-border)', paddingTop: '10px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-color-secondary)' }}>{f.report}</span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-color-secondary)' }}>
            {f.plats.join(' · ')} · {f.samples} {lang === 'pt' ? 'amostras' : 'samples'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(f.key)}
          style={{
            background: 'transparent',
            border: '1px solid var(--input-border)',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12.5px',
            fontWeight: 500,
            color: 'var(--text-color)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          {lang === 'pt' ? 'Ver estudo' : 'View study'}
        </button>
      </div>
    </article>
  );
};
