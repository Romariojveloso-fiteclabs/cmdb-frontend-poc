import React, { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { FAMILIES, DIMENSIONS, SAMPLE_SHAS, Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';

interface CatalogViewProps {
  lang: Lang;
  initialQuery?: string;
  onOpenFamily: (key: string) => void;
}

function catalogParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

function catalogFilterParam(name: string, allowedValues: string[]): string {
  const value = catalogParam(name);
  return value && allowedValues.includes(value) ? value : 'all';
}

function catalogPageParam(): number {
  const page = Number(catalogParam('pagina') || 1);
  return Number.isInteger(page) && page > 0 ? page - 1 : 0;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ lang, initialQuery = '', onOpenFamily }) => {
  const t = TRANSLATIONS[lang];

  const [searchQuery, setSearchQuery] = useState(initialQuery || catalogParam('busca') || '');
  const [platFilter, setPlatFilter] = useState<string>(() => catalogFilterParam('plataforma', ['Windows', 'Linux']));
  const [edFilter, setEdFilter] = useState<string>(() => catalogFilterParam('editorial', Object.keys(DIMENSIONS.ed)));
  const [evFilter, setEvFilter] = useState<string>(() => catalogFilterParam('evidencia', Object.keys(DIMENSIONS.ev)));
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => catalogParam('visualizacao') === 'tabela' ? 'table' : 'cards');
  const [page, setPage] = useState(catalogPageParam);

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

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('busca', searchQuery.trim());
    if (platFilter !== 'all') params.set('plataforma', platFilter);
    if (edFilter !== 'all') params.set('editorial', edFilter);
    if (evFilter !== 'all') params.set('evidencia', evFilter);
    if (viewMode === 'table') params.set('visualizacao', 'tabela');
    if (currentPage > 0) params.set('pagina', String(currentPage + 1));

    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [currentPage, edFilter, evFilter, platFilter, searchQuery, viewMode]);

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

    let bg = 'var(--surface-100)';
    let color = 'var(--text-color-secondary)';
    if (meta.sev === 'success') { bg = 'var(--success-soft)'; color = 'var(--success-600)'; }
    if (meta.sev === 'info') { bg = 'var(--info-soft)'; color = 'var(--info-600)'; }
    if (meta.sev === 'warning') { bg = 'var(--warning-soft)'; color = 'var(--warning-600)'; }
    if (meta.sev === 'danger') { bg = 'var(--danger-soft)'; color = 'var(--danger-600)'; }

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
    border: `1px solid ${active ? 'var(--primary-color)' : 'var(--input-border)'}`,
    background: active ? 'var(--primary-color)' : 'transparent',
    color: active ? 'var(--primary-color-text)' : 'var(--text-color-secondary)'
  });

  return (
    <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>
        {t.catalogTitle}
      </h1>
      <p style={{ fontSize: '14.5px', color: 'var(--text-color-secondary)', margin: '0 0 24px', maxWidth: '70ch' }}>
        {t.catalogSub}
      </p>

      <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '272px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <aside className="filters-panel" style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px', position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <Search size={16} color="var(--secondary-color)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
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
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--info-600)', fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          >
            {t.clearFilters}
          </button>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div className="results-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)' }}>
              {filteredFamilies.length} {lang === 'pt' ? 'resultados encontrados' : 'results found'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>{t.cardNote}</span>
              <div style={{ display: 'flex', border: '1px solid var(--input-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <button
                  onClick={() => setViewMode('cards')}
                  style={{
                    background: viewMode === 'cards' ? 'var(--primary-color)' : 'transparent',
                    color: viewMode === 'cards' ? 'var(--primary-color-text)' : 'var(--text-color-secondary)',
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
                    background: viewMode === 'table' ? 'var(--primary-color)' : 'transparent',
                    color: viewMode === 'table' ? 'var(--primary-color-text)' : 'var(--text-color-secondary)',
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
              <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
                <thead>
                  <tr style={{ background: 'var(--table-header-background)', color: 'var(--table-header-text)' }}>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Família' : 'Family'}</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Relatório' : 'Report'}</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Categoria' : 'Category'}</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Plataformas' : 'Platforms'}</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Status Editorial' : 'Status'}</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>SHA-256</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase' }}>{lang === 'pt' ? 'Ação' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFamilies.map((f) => (
                    <tr key={f.key} style={{ borderTop: '1px solid var(--surface-border)' }}>
                      <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{f.disp}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--success-color)', marginTop: '3px' }}>{f.authors || f.alias}</div>
                      </td>
                      <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500 }}>{f.report}</td>
                      <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center', fontSize: '12.5px', color: 'var(--info-color)' }}>{f.cat}</td>
                      <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{f.plats.join(', ')}</td>
                      <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center' }}>{renderBadge('ed', f.ed)}</td>
                      <td
                        title={SAMPLE_SHAS[f.key]}
                        style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)', whiteSpace: 'nowrap' }}
                      >
                        {SAMPLE_SHAS[f.key]
                          ? `${SAMPLE_SHAS[f.key].slice(0, 10)}…${SAMPLE_SHAS[f.key].slice(-6)}`
                          : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          onClick={() => onOpenFamily(f.key)}
                          style={{ background: 'var(--primary-color)', color: 'var(--primary-color-text)', border: 'none', borderRadius: '4px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}
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
            <div className="catalog-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              {paginatedFamilies.map((f) => (
                <article key={f.key} style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, letterSpacing: '.05em' }}>{f.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-color-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
                        {lang === 'pt' ? f.headline.pt : f.headline.en}
                      </div>
                      {(f.authors || f.alias) && (
                        <div style={{ fontSize: '11px', color: 'var(--success-color)', marginTop: '4px' }}>{f.authors || f.alias}</div>
                      )}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.1em', color: 'var(--info-color)', textAlign: 'right' }}>{f.cat}</span>
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
