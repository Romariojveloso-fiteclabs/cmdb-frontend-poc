import React, { useEffect, useState, useMemo } from 'react';
import { FAMILIES, DIMENSIONS, SAMPLE_SHAS, Lang } from '../data/families';
import { TRANSLATIONS } from '../data/i18n';
import { ResultsBrowser } from './ResultsBrowser';
import { FamilyCard } from './FamilyCard';
import { DimensionBadge } from './DimensionBadge';
import { PageHeader } from './PageHeader';
import { SearchField } from './SearchField';
import { FilterPanel } from './FilterPanel';
import { FilterGroup } from './FilterGroup';
import { readParam, readFilterParam, readPageParam, writeUrlParams } from '../utils/urlParams';
import { usePagination } from '../hooks/usePagination';

interface CatalogViewProps {
  lang: Lang;
  initialQuery?: string;
  onOpenFamily: (key: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ lang, initialQuery = '', onOpenFamily }) => {
  const t = TRANSLATIONS[lang];

  const [searchQuery, setSearchQuery] = useState(initialQuery || readParam('busca') || '');
  const [platFilter, setPlatFilter] = useState<string>(() => readFilterParam('plataforma', ['Windows', 'Linux'], 'all'));
  const [edFilter, setEdFilter] = useState<string>(() => readFilterParam('editorial', Object.keys(DIMENSIONS.ed), 'all'));
  const [evFilter, setEvFilter] = useState<string>(() => readFilterParam('evidencia', Object.keys(DIMENSIONS.ev), 'all'));
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => readParam('visualizacao') === 'tabela' ? 'table' : 'cards');

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

  const { page: currentPage, setPage } = usePagination(filteredFamilies.length, pageSize, readPageParam('pagina'));

  useEffect(() => {
    writeUrlParams({
      busca: searchQuery.trim() || undefined,
      plataforma: platFilter !== 'all' ? platFilter : undefined,
      editorial: edFilter !== 'all' ? edFilter : undefined,
      evidencia: evFilter !== 'all' ? evFilter : undefined,
      visualizacao: viewMode === 'table' ? 'tabela' : undefined,
      pagina: currentPage > 0 ? String(currentPage + 1) : undefined
    });
  }, [currentPage, edFilter, evFilter, platFilter, searchQuery, viewMode]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setPlatFilter('all');
    setEdFilter('all');
    setEvFilter('all');
    setPage(0);
  };

  const allLabel = lang === 'pt' ? 'Todas' : 'All';
  const platformOptions = [
    { value: 'all', label: allLabel },
    { value: 'Windows', label: 'Windows' },
    { value: 'Linux', label: 'Linux' }
  ];
  const editorialOptions = [
    { value: 'all', label: lang === 'pt' ? 'Todos' : 'All' },
    ...Object.keys(DIMENSIONS.ed).map((key) => ({
      value: key,
      label: lang === 'pt' ? DIMENSIONS.ed[key].pt : DIMENSIONS.ed[key].en
    }))
  ];
  const evidenceOptions = [
    { value: 'all', label: allLabel },
    ...Object.keys(DIMENSIONS.ev).map((key) => ({
      value: key,
      label: lang === 'pt' ? DIMENSIONS.ev[key].pt : DIMENSIONS.ev[key].en
    }))
  ];

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
      <PageHeader title={t.catalogTitle} intro={t.catalogSub} />

      <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '272px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <FilterPanel>
          <SearchField
            value={searchQuery}
            onChange={(value) => { setSearchQuery(value); setPage(0); }}
            placeholder={t.searchShort}
          />
          <FilterGroup
            label={lang === 'pt' ? 'PLATAFORMA' : 'PLATFORM'}
            options={platformOptions}
            active={platFilter}
            onChange={(value) => { setPlatFilter(value); setPage(0); }}
          />
          <FilterGroup
            label={lang === 'pt' ? 'STATUS EDITORIAL' : 'EDITORIAL STATUS'}
            options={editorialOptions}
            active={edFilter}
            onChange={(value) => { setEdFilter(value); setPage(0); }}
          />
          <FilterGroup
            label={lang === 'pt' ? 'EVIDÊNCIA' : 'EVIDENCE'}
            options={evidenceOptions}
            active={evFilter}
            onChange={(value) => { setEvFilter(value); setPage(0); }}
          />
          <button
            onClick={clearAllFilters}
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--info-600)', fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          >
            {t.clearFilters}
          </button>
        </FilterPanel>

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
