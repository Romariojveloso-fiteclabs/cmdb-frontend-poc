import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { FAMILIES, DIMENSIONS, SAMPLE_SHAS, Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';

interface CatalogViewProps {
  lang: Lang;
  initialQuery?: string;
  onOpenFamily: (key: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ lang, initialQuery = '', onOpenFamily }) => {
  const t = TRANSLATIONS[lang];

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [platFilter, setPlatFilter] = useState<string>('all');
  const [edFilter, setEdFilter] = useState<string>('all');
  const [evFilter, setEvFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [page, setPage] = useState(0);

  const pageSize = 4;

  const filteredFamilies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAMILIES.filter((f) => {
      if (q && !(f.name + ' ' + f.aliases + ' ' + f.report + ' ' + f.disp).toLowerCase().includes(q)) {
        return false;
      }
      if (platFilter !== 'all' && !f.plats.includes(platFilter)) return false;
      if (edFilter !== 'all' && f.ed !== edFilter) return false;
      if (evFilter !== 'all' && f.ev !== evFilter) return false;
      return true;
    });
  }, [searchQuery, platFilter, edFilter, evFilter]);

  const totalPages = Math.ceil(filteredFamilies.length / pageSize) || 1;
  const currentPage = Math.min(page, totalPages - 1);
  const paginatedFamilies = filteredFamilies.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const clearAllFilters = () => {
    setSearchQuery('');
    setPlatFilter('all');
    setEdFilter('all');
    setEvFilter('all');
    setPage(0);
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
      <span style={{ background: bg, color: color, fontSize: '11px', fontFamily: 'var(--font-sans)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    );
  };

  const filterChipStyle = (active: boolean) => ({
    borderRadius: '99px',
    padding: '4px 10px',
    fontFamily: 'var(--font-sans)',
    fontSize: '11.5px',
    fontWeight: 500,
    cursor: 'pointer',
    border: `1px solid ${active ? '#243A2E' : 'var(--input-border)'}`,
    background: active ? '#243A2E' : 'transparent',
    color: active ? '#F3EBDD' : 'var(--text-color-secondary)'
  });

  return (
    <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>
        {t.catalogTitle}
      </h1>
      <p style={{ fontSize: '14.5px', color: 'var(--text-color-secondary)', margin: '0 0 24px', maxWidth: '70ch' }}>
        {t.catalogSub}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '272px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <aside style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px', position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder={t.searchShort}
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
            <Search size={16} color="#7C7362" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
              {lang === 'pt' ? 'PLATAFORMA' : 'PLATFORM'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setPlatFilter('all'); setPage(0); }} style={filterChipStyle(platFilter === 'all')}>
                {lang === 'pt' ? 'Todas' : 'All'}
              </button>
              <button onClick={() => { setPlatFilter('Windows'); setPage(0); }} style={filterChipStyle(platFilter === 'Windows')}>
                Windows
              </button>
              <button onClick={() => { setPlatFilter('Linux'); setPage(0); }} style={filterChipStyle(platFilter === 'Linux')}>
                Linux
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
              {lang === 'pt' ? 'STATUS EDITORIAL' : 'EDITORIAL STATUS'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setEdFilter('all'); setPage(0); }} style={filterChipStyle(edFilter === 'all')}>
                {lang === 'pt' ? 'Todos' : 'All'}
              </button>
              {Object.keys(DIMENSIONS.ed).map((k) => (
                <button key={k} onClick={() => { setEdFilter(k); setPage(0); }} style={filterChipStyle(edFilter === k)}>
                  {lang === 'pt' ? DIMENSIONS.ed[k].pt : DIMENSIONS.ed[k].en}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
              {lang === 'pt' ? 'EVIDÊNCIA' : 'EVIDENCE'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setEvFilter('all'); setPage(0); }} style={filterChipStyle(evFilter === 'all')}>
                {lang === 'pt' ? 'Todas' : 'All'}
              </button>
              {Object.keys(DIMENSIONS.ev).map((k) => (
                <button key={k} onClick={() => { setEvFilter(k); setPage(0); }} style={filterChipStyle(evFilter === k)}>
                  {lang === 'pt' ? DIMENSIONS.ev[k].pt : DIMENSIONS.ev[k].en}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearAllFilters}
            style={{ background: 'none', border: 'none', padding: 0, color: '#9C4B23', fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          >
            {t.clearFilters}
          </button>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)' }}>
              {filteredFamilies.length} {lang === 'pt' ? 'resultados encontrados' : 'results found'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>{t.cardNote}</span>
              <div style={{ display: 'flex', border: '1px solid var(--input-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <button
                  onClick={() => setViewMode('cards')}
                  style={{
                    background: viewMode === 'cards' ? '#243A2E' : 'transparent',
                    color: viewMode === 'cards' ? '#F3EBDD' : 'var(--text-color-secondary)',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {t.viewCards}
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    background: viewMode === 'table' ? '#243A2E' : 'transparent',
                    color: viewMode === 'table' ? '#F3EBDD' : 'var(--text-color-secondary)',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {t.viewTable}
                </button>
              </div>
            </div>
          </div>

          {filteredFamilies.length === 0 ? (
            <div style={{ background: 'var(--surface-card)', border: '1px dashed var(--input-border)', borderRadius: '6px', padding: '40px', textAlign: 'center', color: 'var(--text-color-secondary)', fontSize: '14px' }}>
              {t.empty}
            </div>
          ) : viewMode === 'table' ? (
            <div style={{ border: '1px solid var(--surface-border)', borderRadius: '6px', overflowX: 'auto', background: 'var(--surface-card)' }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
                <thead>
                  <tr style={{ background: '#243A2E', color: '#F3EBDD' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Família' : 'Family'}</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Relatório' : 'Report'}</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Categoria' : 'Category'}</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Plataformas' : 'Platforms'}</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Status Editorial' : 'Status'}</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>SHA-256</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Ação' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFamilies.map((f) => (
                    <tr key={f.key} style={{ borderTop: '1px solid var(--surface-border)' }}>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{f.disp}</div>
                        <div style={{ fontSize: '11.5px', color: '#4A7C59', marginTop: '3px' }}>{f.alias}</div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500 }}>{f.report}</td>
                      <td style={{ padding: '12px', verticalAlign: 'top', fontSize: '12.5px', color: '#B85C2E' }}>{f.cat}</td>
                      <td style={{ padding: '12px', verticalAlign: 'top', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{f.plats.join(', ')}</td>
                      <td style={{ padding: '12px', verticalAlign: 'top' }}>{renderBadge('ed', f.ed)}</td>
                      <td
                        title={SAMPLE_SHAS[f.key]}
                        style={{ padding: '12px', verticalAlign: 'top', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)', whiteSpace: 'nowrap' }}
                      >
                        {SAMPLE_SHAS[f.key]
                          ? `${SAMPLE_SHAS[f.key].slice(0, 10)}…${SAMPLE_SHAS[f.key].slice(-6)}`
                          : '—'}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top', textAlign: 'right' }}>
                        <button
                          onClick={() => onOpenFamily(f.key)}
                          style={{ background: '#243A2E', color: '#F3EBDD', border: 'none', borderRadius: '4px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}
                        >
                          {t.viewStudy}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              {paginatedFamilies.map((f) => (
                <article key={f.key} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, letterSpacing: '.05em' }}>{f.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-color-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
                        {lang === 'pt' ? f.headline.pt : f.headline.en}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.1em', color: '#B85C2E', textAlign: 'right' }}>{f.cat}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--surface-border)', paddingTop: '9px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-color-secondary)', textTransform: 'uppercase' }}>EDITORIAL</span>
                      {renderBadge('ed', f.ed)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-color-secondary)', textTransform: 'uppercase' }}>EVIDÊNCIA</span>
                      {renderBadge('ev', f.ev)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', borderTop: '1px solid var(--surface-border)', paddingTop: '9px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-color-secondary)' }}>{f.report}</span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-color-secondary)' }}>{f.plats.join(' · ')} · {f.samples} {lang === 'pt' ? 'amostras' : 'samples'}</span>
                    </div>
                    <button
                      onClick={() => onOpenFamily(f.key)}
                      style={{ background: 'transparent', border: '1px solid var(--input-border)', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                    >
                      {t.viewStudy}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginTop: '18px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>
                {lang === 'pt' ? `Página ${currentPage + 1} de ${totalPages}` : `Page ${currentPage + 1} of ${totalPages}`}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  style={{
                    background: currentPage === 0 ? 'var(--surface-100)' : 'var(--surface-card)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {lang === 'pt' ? 'Anterior' : 'Previous'}
                </button>
                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  style={{
                    background: currentPage >= totalPages - 1 ? 'var(--surface-100)' : 'var(--surface-card)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {lang === 'pt' ? 'Próxima' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
