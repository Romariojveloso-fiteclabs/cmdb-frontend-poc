import React, { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { FAMILIES, DIMENSIONS, SAMPLE_SHAS, Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { ResultsBrowser } from './ResultsBrowser';
import { FamilyCard } from './FamilyCard';
import { DimensionBadge } from './DimensionBadge';

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

  const pageSize = 6;

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

  const tableColumns = [
    lang === 'pt' ? 'Família' : 'Family',
    lang === 'pt' ? 'Relatório' : 'Report',
    lang === 'pt' ? 'Categoria' : 'Category',
    lang === 'pt' ? 'Plataformas' : 'Platforms',
    lang === 'pt' ? 'Status Editorial' : 'Status',
    'SHA-256',
    lang === 'pt' ? 'Ação' : 'Action'
  ];

  return (
    <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>
        {t.catalogTitle}
      </h1>
      <p className="page-intro">
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

        <ResultsBrowser
          items={filteredFamilies}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          resultsLabel={
            <>
              {filteredFamilies.length} {lang === 'pt' ? 'resultados encontrados' : 'results found'}
            </>
          }
          emptyNode={
            <div style={{ background: 'var(--surface-card)', border: '1px dashed var(--input-border)', borderRadius: '6px', padding: '40px', textAlign: 'center', color: 'var(--text-color-secondary)', fontSize: '14px' }}>
              {t.empty}
            </div>
          }
          cardGridClassName="catalog-card-grid card-grid card-grid--3"
          renderCard={(f) => <FamilyCard key={f.key} family={f} lang={lang} onOpen={onOpenFamily} />}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          viewToggleLabels={{ cards: t.viewCards, table: t.viewTable }}
          tableColumns={tableColumns}
          tableMinWidth={640}
          tableRoominess="roomy"
          tableCaption={lang === 'pt' ? 'Catálogo de famílias de malware' : 'Malware family catalogue'}
          renderTableRow={(f) => (
            <tr key={f.key}>
              <td>
                <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{f.disp}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--success-color)', marginTop: '3px' }}>{f.authors || f.alias}</div>
              </td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500 }}>{f.report}</td>
              <td style={{ fontSize: '12.5px', color: 'var(--info-color)' }}>{f.cat}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{f.plats.join(', ')}</td>
              <td>
                <DimensionBadge dimKey="ed" valKey={f.ed} lang={lang} />
              </td>
              <td
                title={SAMPLE_SHAS[f.key]}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)', whiteSpace: 'nowrap' }}
              >
                {SAMPLE_SHAS[f.key]
                  ? `${SAMPLE_SHAS[f.key].slice(0, 10)}…${SAMPLE_SHAS[f.key].slice(-6)}`
                  : '—'}
              </td>
              <td>
                <button
                  onClick={() => onOpenFamily(f.key)}
                  style={{ background: 'var(--primary-color)', color: 'var(--primary-color-text)', border: 'none', borderRadius: '4px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 500, cursor: 'pointer' }}
                >
                  {t.viewStudy}
                </button>
              </td>
            </tr>
          )}
          paginationLabels={{
            previous: lang === 'pt' ? 'Anterior' : 'Previous',
            next: lang === 'pt' ? 'Próxima' : 'Next',
            pageInfo: (p, total) => (lang === 'pt' ? `Página ${p} de ${total}` : `Page ${p} of ${total}`)
          }}
        />
      </div>
    </section>
  );
};
