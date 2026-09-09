import React from 'react';
import { Lang, MalwareFamily } from '../../data/families';
import { TRANSLATIONS } from '../../data/i18n';
import { DimensionBadge } from '../DimensionBadge';

interface FamilyHeaderProps {
  fam: MalwareFamily;
  lang: Lang;
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  onBack: () => void;
}

export const FamilyHeader: React.FC<FamilyHeaderProps> = ({ fam, lang, tabs, activeTab, onTabChange, onBack }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="family-header" style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--surface-border)', padding: '28px 28px 0' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--info-600)', fontFamily: 'var(--font-mono)', fontSize: '11.5px', cursor: 'pointer', marginBottom: '16px' }}
        >
          {t.backCatalog}
        </button>

        <div className="family-heading" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '38px', fontWeight: 600, letterSpacing: '.08em', margin: '0 0 8px' }}>
              {fam.name}
            </h1>
            <div style={{ fontSize: '15px', color: 'var(--text-color-secondary)', maxWidth: '60ch' }}>
              {lang === 'pt' ? fam.headline.pt : fam.headline.en}
            </div>
            <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', margin: '18px 0 0' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                  Aliases
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.aliases}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                  {lang === 'pt' ? 'Categoria' : 'Category'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.cat}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                  {lang === 'pt' ? 'Plataformas' : 'Platforms'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.plats.join(' · ')}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '4px' }}>
                  {lang === 'pt' ? 'Amostras' : 'Samples'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{fam.samples}</div>
              </div>
            </div>
          </div>

          <div className="family-status-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '280px', background: 'var(--surface-ground)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '2px' }}>
              {t.statusSystem}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Status Editorial</span>
              <DimensionBadge dimKey="ed" valKey={fam.ed} lang={lang} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Identificação</span>
              <DimensionBadge dimKey="id" valKey={fam.id} lang={lang} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Evidência</span>
              <DimensionBadge dimKey="ev" valKey={fam.ev} lang={lang} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>Disponibilidade</span>
              <DimensionBadge dimKey="av" valKey={fam.av} lang={lang} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '26px', display: 'flex', borderBottom: '1px solid var(--surface-border)', gap: '4px', overflowX: 'auto' }}>
          {tabs.map((tabLabel, index) => {
            const active = index === activeTab;
            return (
              <button
                key={index}
                onClick={() => onTabChange(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '3px solid var(--primary-color)' : '3px solid transparent',
                  padding: '10px 16px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--primary-color)' : 'var(--text-color-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
