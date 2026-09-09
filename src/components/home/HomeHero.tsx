import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { Lang } from '../../data/families';
import { TRANSLATIONS } from '../../data/i18n';
import { withBase } from '../../utils/paths';

interface HomeHeroProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
  onSearch: (query: string) => void;
}

const QUICK_TERMS = [
  { label: 'Akira', query: 'Akira' },
  { label: 'Hive', query: 'Hive' },
  { label: 'Windows 7', query: 'Windows' },
  { label: 'CMDB-TR-006', query: 'CMDB-TR-006' }
];

export const HomeHero: React.FC<HomeHeroProps> = ({ lang, onNavigate, onSearch }) => {
  const t = TRANSLATIONS[lang];
  const [queryInput, setQueryInput] = useState('');

  const heroLines = lang === 'pt'
    ? ['Malware real.', 'Evidência verificável.', 'Pesquisa responsável.']
    : ['Real malware.', 'Verifiable evidence.', 'Responsible research.'];

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (queryInput.trim()) onSearch(queryInput.trim());
  };

  return (
    <section className="home-hero" style={{ color: 'var(--brand-panel-text)', padding: '72px 28px 64px' }}>
      <div className="home-hero-grid" style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '64px', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.18em', color: 'var(--brand-panel-accent)', marginBottom: '18px' }}>
              {t.eyebrow}
            </div>
            <h1 className="home-hero-title" style={{ fontFamily: 'var(--font-accent)', fontSize: '42px', lineHeight: 1.24, fontWeight: 600, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {heroLines.map((line, index) => (
                <span key={index} style={{ whiteSpace: 'nowrap' }}>{line}</span>
              ))}
            </h1>
            <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--brand-panel-muted)', maxWidth: '56ch', margin: '0 0 30px' }}>
              {t.heroSub}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="home-hero-primary"
              onClick={() => onNavigate('catalog')}
              style={{ borderRadius: '5px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Search size={16} />
              {t.ctaExplore}
            </button>

            <button
              onClick={() => onNavigate('security')}
              style={{ background: 'transparent', color: 'var(--brand-panel-text)', border: '1px solid var(--brand-panel-border)', borderRadius: '5px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ShieldCheck size={16} />
              {t.ctaSafety}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          <div className="home-brand-card">
            <img src={withBase('/assets/cmdb-logo.png')} alt="Caatinga Malware DB" />
          </div>

          <div className="home-search-panel">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.16em', color: 'var(--brand-panel-accent)', marginBottom: '14px' }}>
              {t.searchLabel}
            </div>
            <form className="home-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                aria-label={t.searchLabel}
                value={queryInput}
                onChange={(event) => setQueryInput(event.target.value)}
                placeholder={t.searchPh}
              />
              <button className="home-search-submit" type="submit" aria-label={lang === 'pt' ? 'Buscar no acervo' : 'Search the archive'}>
                <Search size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
              {QUICK_TERMS.map((term, index) => (
                <button
                  key={index}
                  onClick={() => onSearch(term.query)}
                  style={{ background: 'transparent', border: '1px solid var(--brand-panel-border)', color: 'var(--brand-panel-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 9px', borderRadius: '99px', cursor: 'pointer' }}
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
