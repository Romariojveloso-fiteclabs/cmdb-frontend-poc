import React, { useState } from 'react';
import { Search, ShieldCheck, FilePlus, BookOpen, AlertTriangle } from 'lucide-react';
import { FAMILIES, DIMENSIONS, Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { withBase } from '../utils/paths';

interface HomeViewProps {
  lang: Lang;
  onNavigate: (screen: string) => void;
  onOpenFamily: (key: string) => void;
  onSearch: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ lang, onNavigate, onOpenFamily, onSearch }) => {
  const t = TRANSLATIONS[lang];
  const [queryInput, setQueryInput] = useState('');

  const featuredFamilies = FAMILIES.slice(0, 3);

  const stats = [
    { n: '06', label: lang === 'pt' ? 'Famílias ativas' : 'Active families' },
    { n: '05', label: lang === 'pt' ? 'Relatórios publicados' : 'Published reports' },
    { n: '11', label: lang === 'pt' ? 'Amostras documentadas' : 'Documented samples' },
    { n: '100%', label: lang === 'pt' ? 'Evidência verificável' : 'Verifiable evidence' }
  ];

  const heroLines = lang === 'pt'
    ? ['Malware real.', 'Evidência verificável.', 'Pesquisa responsável.']
    : ['Real malware.', 'Verifiable evidence.', 'Responsible research.'];

  const quickTerms = [
    { label: 'Akira', query: 'Akira' },
    { label: 'Hive', query: 'Hive' },
    { label: 'Windows 7', query: 'Windows' },
    { label: 'CMDB-TR-006', query: 'CMDB-TR-006' }
  ];

  const steps = [
    {
      n: '01',
      label: lang === 'pt' ? 'Obtenção e verificação de hash' : 'Sample retrieval & hash check',
      desc: lang === 'pt' ? 'Amostra isolada e hash SHA-256 verificado antes de qualquer execução.' : 'Isolated sample & SHA-256 checksum verified prior to execution.'
    },
    {
      n: '02',
      label: lang === 'pt' ? 'Execução em ambiente isolado' : 'Execution in isolated lab',
      desc: lang === 'pt' ? 'Ambiente sem rede e sem dados reais para observação de comportamentos.' : 'Network-free VM with dummy files to observe dynamic behaviors.'
    },
    {
      n: '03',
      label: lang === 'pt' ? 'Registro e capturas com legenda' : 'Logging & captioned captures',
      desc: lang === 'pt' ? 'Evidência fotográfica e logs de syscall vinculados ao resultado.' : 'Visual proof & system call logs attached to the finding.'
    },
    {
      n: '04',
      label: lang === 'pt' ? 'Declaração aberta de limitações' : 'Open limitation disclosure',
      desc: lang === 'pt' ? 'Tudo o que não foi possível testar é registrado de forma transparente.' : 'Every unverified condition is published explicitly.'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearch(queryInput.trim());
      onNavigate('catalog');
    }
  };

  const renderBadge = (dimKey: string, valKey: string) => {
    const meta = DIMENSIONS[dimKey]?.[valKey];
    if (!meta) return null;
    const label = lang === 'pt' ? meta.pt : meta.en;
    
    let bg = '#EFE6D5';
    let color = '#403C34';
    if (meta.sev === 'success') { bg = '#E8F0E9'; color = '#3C6549'; }
    if (meta.sev === 'info') { bg = '#F7E9DF'; color = '#9C4B23'; }
    if (meta.sev === 'warning') { bg = '#FAF0DA'; color = '#A9761F'; }
    if (meta.sev === 'danger') { bg = '#FBE8E6'; color = '#8F1B12'; }

    return (
      <span style={{ background: bg, color: color, fontSize: '11px', fontFamily: 'var(--font-sans)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <section style={{ background: '#243A2E', color: '#F3EBDD', padding: '72px 28px 64px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '64px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.18em', color: '#D39A32', marginBottom: '18px' }}>
                {t.eyebrow}
              </div>
              <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '42px', lineHeight: 1.24, fontWeight: 600, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {heroLines.map((ln, idx) => (
                  <span key={idx} style={{ whiteSpace: 'nowrap' }}>{ln}</span>
                ))}
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#D8E3DA', maxWidth: '56ch', margin: '0 0 30px' }}>
                {t.heroSub}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('catalog')}
                style={{
                  background: '#B85C2E',
                  color: '#FDFAF4',
                  border: '1px solid #B85C2E',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Search size={16} />
                {t.ctaExplore}
              </button>

              <button
                onClick={() => onNavigate('security')}
                style={{
                  background: 'transparent',
                  color: '#F3EBDD',
                  border: '1px solid #537760',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={16} />
                {t.ctaSafety}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E0D4BE', borderRadius: '6px', padding: '16px 28px', background: '#F3EBDD' }}>
              <img src={withBase('/assets/cmdb-logo.png')} alt="Caatinga Malware DB" style={{ width: '100%', maxWidth: '300px', height: '196px', objectFit: 'contain', display: 'block' }} />
            </div>

            <div style={{ background: 'rgba(243,235,221,.06)', border: '1px solid #537760', borderRadius: '6px', padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.16em', color: '#D39A32', marginBottom: '14px' }}>
                {t.searchLabel}
              </div>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder={t.searchPh}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid #CFC0A6',
                    background: '#FDFAF4',
                    color: '#202522',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#243A2E',
                    color: '#F3EBDD',
                    border: '1px solid #537760',
                    borderRadius: '4px',
                    padding: '0 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Search size={16} />
                </button>
              </form>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
                {quickTerms.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSearch(term.query);
                      onNavigate('catalog');
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid #537760',
                      color: '#D8E3DA',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      padding: '4px 9px',
                      borderRadius: '99px',
                      cursor: 'pointer'
                    }}
                  >
                    {term.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '28px' }}>
        <div style={{ background: '#FAF0DA', border: '1px solid #D39A32', color: '#A9761F', borderRadius: '6px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
            {t.safetyBanner}
          </span>
        </div>
      </section>

      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '8px 28px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1px', background: 'var(--surface-border)', border: '1px solid var(--surface-border)', borderRadius: '6px', overflow: 'hidden' }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', padding: '22px 24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '34px', fontWeight: 500, color: '#243A2E', lineHeight: 1 }}>
                {s.n}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-color-secondary)', marginTop: '8px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 28px 56px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '26px', fontWeight: 600, margin: 0 }}>
            {t.recentTitle}
          </h2>
          <button onClick={() => onNavigate('catalog')} style={{ background: 'none', border: 'none', color: '#9C4B23', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {t.seeAll}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          {featuredFamilies.map((f) => (
            <article key={f.key} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '19px', fontWeight: 600, letterSpacing: '.06em', color: '#202522' }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-color-secondary)', marginTop: '6px' }}>
                    {lang === 'pt' ? f.headline.pt : f.headline.en}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.12em', color: '#B85C2E', whiteSpace: 'nowrap' }}>
                  {f.cat}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--surface-border)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-color-secondary)', textTransform: 'uppercase' }}>
                    {lang === 'pt' ? 'EDITORIAL' : 'EDITORIAL'}
                  </span>
                  {renderBadge('ed', f.ed)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-color-secondary)', textTransform: 'uppercase' }}>
                    {lang === 'pt' ? 'EVIDÊNCIA' : 'EVIDENCE'}
                  </span>
                  {renderBadge('ev', f.ev)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-color-secondary)' }}>{f.report}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-color-secondary)' }}>
                    {lang === 'pt' ? 'Atualizado em ' : 'Updated '} {f.updated}
                  </span>
                </div>
                <button
                  onClick={() => onOpenFamily(f.key)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--input-border)',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: '#202522',
                    cursor: 'pointer'
                  }}
                >
                  {t.viewStudy}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', padding: '52px 28px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '26px', fontWeight: 600, margin: '0 0 6px' }}>
            {t.flowTitle}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-color-secondary)', margin: '0 0 28px', maxWidth: '64ch' }}>
            {t.flowSub}
          </p>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
            {steps.map((st, idx) => (
              <li key={idx} style={{ borderTop: '2px solid #D39A32', paddingTop: '14px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#B85C2E', marginBottom: '8px' }}>
                  {st.n}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.35, marginBottom: '6px' }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-color-secondary)', lineHeight: 1.5 }}>
                  {st.desc}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '52px 28px 72px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '26px' }}>
          <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '21px', fontWeight: 600, margin: '0 0 10px' }}>
            {t.contribTitle}
          </h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-color-secondary)', margin: '0 0 20px' }}>
            {t.contribSub}
          </p>
          <button
            onClick={() => onNavigate('contribute')}
            style={{
              background: '#243A2E',
              color: '#F3EBDD',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 18px',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FilePlus size={16} />
            {t.contribCta}
          </button>
        </div>

        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '26px' }}>
          <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '21px', fontWeight: 600, margin: '0 0 10px' }}>
            {t.guidesTitle}
          </h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-color-secondary)', margin: '0 0 20px' }}>
            {t.guidesSub}
          </p>
          <button
            onClick={() => onNavigate('guides')}
            style={{
              background: 'transparent',
              color: '#202522',
              border: '1px solid var(--input-border)',
              borderRadius: '4px',
              padding: '10px 18px',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={16} />
            {t.guidesCta}
          </button>
        </div>
      </section>
    </div>
  );
};
