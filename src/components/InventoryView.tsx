import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Lang } from '../data/families';
import {
  INVENTORY_RECORDS,
  INVENTORY_SOURCE_REGISTRATION_COUNT,
  InventoryPresence
} from '../data/inventory';
import { PageHeader } from './PageHeader';
import { SearchField } from './SearchField';
import { FilterPanel } from './FilterPanel';
import { FilterGroup } from './FilterGroup';
import { PaginationBar } from './PaginationBar';
import { readParam, readFilterParam, readPageParam, writeUrlParams } from '../utils/urlParams';
import { usePagination } from '../hooks/usePagination';

interface InventoryViewProps {
  lang: Lang;
  onOpenFamily: (familyKey: string) => void;
}

type MatchFilter = 'all' | 'confirmed' | 'not-confirmed';
type PresenceFilter = 'all' | 'confirmed' | 'not-confirmed' | 'absent';
type CmdbFilter = 'all' | 'documented' | 'not-documented';

const copy = {
  pt: {
    title: 'Inventário de famílias de malware',
    subtitle: 'Comparação entre fontes confiáveis para indicar o que já está documentado no CMDB e o que ainda precisa ser investigado.',
    search: 'Buscar família, alias ou registro',
    results: 'resultados encontrados',
    represented: 'registros representados',
    all: 'Todos',
    listed: 'Listados',
    notListed: 'Não listados',
    confirmed: 'Confirmados',
    notConfirmed: 'Não confirmados',
    documented: 'Documentados',
    notDocumented: 'Sem relatório',
    noMoreRansomStatus: 'STATUS NO NO MORE RANSOM',
    matchStatus: 'STATUS NO MALWAREBAZAAR',
    theZooStatus: 'STATUS NO THE ZOO',
    cmdbStatus: 'DOCUMENTAÇÃO NO CMDB',
    clearFilters: 'Limpar todos os filtros',
    empty: 'Nenhum registro encontrado com os filtros selecionados.',
    family: 'Família / grupo',
    noMoreRansom: 'No More Ransom',
    malwareBazaar: 'MalwareBazaar',
    samples: 'Ocorrências (amostras)',
    zoo: 'The Zoo',
    cmdb: 'CMDB',
    source: 'Abrir',
    noExactMatch: 'Sem confirmação por assinatura ou etiqueta exata',
    noReport: 'Sem relatório',
    previous: 'Anterior',
    next: 'Próxima',
    page: 'Página',
    of: 'de',
    tableCaption: 'Inventário comparativo de famílias de ransomware'
  },
  en: {
    title: 'Malware family inventory',
    subtitle: 'A cross-source comparison indicating what is already documented in the CMDB and what still needs investigation.',
    search: 'Search family, alias, or record',
    results: 'results found',
    represented: 'source records represented',
    all: 'All',
    listed: 'Listed',
    notListed: 'Not listed',
    confirmed: 'Confirmed',
    notConfirmed: 'Not confirmed',
    documented: 'Documented',
    notDocumented: 'No report',
    noMoreRansomStatus: 'NO MORE RANSOM STATUS',
    matchStatus: 'MALWAREBAZAAR STATUS',
    theZooStatus: 'THE ZOO STATUS',
    cmdbStatus: 'CMDB DOCUMENTATION',
    clearFilters: 'Clear all filters',
    empty: 'No records found with the selected filters.',
    family: 'Family / group',
    noMoreRansom: 'No More Ransom',
    malwareBazaar: 'MalwareBazaar',
    samples: 'Occurrences (samples)',
    zoo: 'The Zoo',
    cmdb: 'CMDB',
    source: 'Open',
    noExactMatch: 'No exact signature or tag confirmation',
    noReport: 'No report',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    tableCaption: 'Comparative ransomware family inventory'
  }
};

const statusStyle: Record<'success' | 'warning' | 'secondary', React.CSSProperties> = {
  success: { background: 'var(--success-soft)', color: 'var(--success-600)', borderColor: 'var(--primary-200)' },
  warning: { background: 'var(--warning-soft)', color: 'var(--warning-600)', borderColor: 'var(--warning-color)' },
  secondary: { background: 'var(--surface-100)', color: 'var(--secondary-600)', borderColor: 'var(--input-border)' }
};

function StatusBadge({ label, tone }: { label: string; tone: keyof typeof statusStyle }) {
  return (
    <span style={{ ...statusStyle[tone], display: 'inline-flex', alignItems: 'center', border: '1px solid', borderRadius: '4px', padding: '3px 8px', fontSize: '11.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function presenceLabel(status: InventoryPresence, lang: Lang) {
  if (status === 'confirmed') return lang === 'pt' ? 'Confirmado' : 'Confirmed';
  if (status === 'not-confirmed') return lang === 'pt' ? 'Não confirmado' : 'Not confirmed';
  return lang === 'pt' ? 'Não consta' : 'Not listed';
}

export const InventoryView: React.FC<InventoryViewProps> = ({ lang, onOpenFamily }) => {
  const t = copy[lang];
  const [query, setQuery] = useState(() => readParam('busca') || '');
  const [noMoreRansomFilter, setNoMoreRansomFilter] = useState<PresenceFilter>(() =>
    readFilterParam<PresenceFilter>('nomoreransom', ['all', 'confirmed', 'absent'] as const, 'all'),
  );
  const [matchFilter, setMatchFilter] = useState<MatchFilter>(() =>
    readFilterParam<MatchFilter>('malwarebazaar', ['all', 'confirmed', 'not-confirmed'] as const, 'all'),
  );
  const [theZooFilter, setTheZooFilter] = useState<PresenceFilter>(() =>
    readFilterParam<PresenceFilter>('thezoo', ['all', 'confirmed', 'not-confirmed', 'absent'] as const, 'all'),
  );
  const [cmdbFilter, setCmdbFilter] = useState<CmdbFilter>(() =>
    readFilterParam<CmdbFilter>('cmdb', ['all', 'documented', 'not-documented'] as const, 'all'),
  );
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const pageSize = 6;

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(lang === 'pt' ? 'pt-BR' : 'en');

    return INVENTORY_RECORDS.filter((record) => {
      const searchable = [
        record.name,
        ...record.noMoreRansomEntries,
        ...record.malwareBazaarMatches.map((match) => match.label),
        record.theZooEntry ?? ''
      ].join(' ').toLocaleLowerCase(lang === 'pt' ? 'pt-BR' : 'en');

      if (normalizedQuery && !searchable.includes(normalizedQuery)) return false;
      if (noMoreRansomFilter === 'confirmed' && record.noMoreRansomEntries.length === 0) return false;
      if (noMoreRansomFilter === 'absent' && record.noMoreRansomEntries.length > 0) return false;
      if (matchFilter === 'confirmed' && record.malwareBazaarStatus !== 'confirmed') return false;
      if (matchFilter === 'not-confirmed' && record.malwareBazaarStatus !== 'not-confirmed') return false;
      if (theZooFilter !== 'all' && record.theZooStatus !== theZooFilter) return false;
      if (cmdbFilter === 'documented' && !record.documentedFamilyKey) return false;
      if (cmdbFilter === 'not-documented' && record.documentedFamilyKey) return false;
      return true;
    });
  }, [cmdbFilter, lang, matchFilter, noMoreRansomFilter, query, theZooFilter]);

  const { page: currentPage, setPage, totalPages } = usePagination(filteredRecords.length, pageSize, readPageParam('pagina'));
  const visibleRecords = filteredRecords.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  useEffect(() => {
    writeUrlParams({
      busca: query.trim() || undefined,
      nomoreransom: noMoreRansomFilter !== 'all' ? noMoreRansomFilter : undefined,
      malwarebazaar: matchFilter !== 'all' ? matchFilter : undefined,
      thezoo: theZooFilter !== 'all' ? theZooFilter : undefined,
      cmdb: cmdbFilter !== 'all' ? cmdbFilter : undefined,
      pagina: currentPage > 0 ? String(currentPage + 1) : undefined
    });
  }, [cmdbFilter, currentPage, matchFilter, noMoreRansomFilter, query, theZooFilter]);

  const clearAllFilters = () => {
    setQuery('');
    setNoMoreRansomFilter('all');
    setMatchFilter('all');
    setTheZooFilter('all');
    setCmdbFilter('all');
    setPage(0);
  };

  const noMoreRansomOptions = [
    { value: 'all', label: t.all },
    { value: 'confirmed', label: t.listed },
    { value: 'absent', label: t.notListed }
  ];
  const malwareBazaarOptions = [
    { value: 'all', label: t.all },
    { value: 'confirmed', label: t.confirmed },
    { value: 'not-confirmed', label: t.notConfirmed }
  ];
  const theZooOptions = [
    { value: 'all', label: t.all },
    { value: 'confirmed', label: t.confirmed },
    { value: 'not-confirmed', label: t.notConfirmed },
    { value: 'absent', label: t.notListed }
  ];
  const cmdbOptions = [
    { value: 'all', label: t.all },
    { value: 'documented', label: t.documented },
    { value: 'not-documented', label: t.notDocumented }
  ];

  const renderPagination = (position: 'top' | 'bottom') => totalPages > 1 && (
    <PaginationBar
      page={currentPage}
      totalPages={totalPages}
      onPrev={() => setPage((value) => Math.max(0, value - 1))}
      onNext={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
      info={`${t.page} ${currentPage + 1} ${t.of} ${totalPages}`}
      previousLabel={t.previous}
      nextLabel={t.next}
      margin={position === 'top' ? '0 0 10px' : '18px 0 0'}
    />
  );

  return (
    <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <PageHeader title={t.title} intro={t.subtitle} />

      <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '272px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <FilterPanel>
          <SearchField
            type="search"
            value={query}
            onChange={(value) => { setQuery(value); setPage(0); }}
            placeholder={t.search}
          />
          <FilterGroup label={t.noMoreRansomStatus} options={noMoreRansomOptions} active={noMoreRansomFilter} onChange={(value) => { setNoMoreRansomFilter(value as PresenceFilter); setPage(0); }} />
          <FilterGroup label={t.matchStatus} options={malwareBazaarOptions} active={matchFilter} onChange={(value) => { setMatchFilter(value as MatchFilter); setPage(0); }} />
          <FilterGroup label={t.theZooStatus} options={theZooOptions} active={theZooFilter} onChange={(value) => { setTheZooFilter(value as PresenceFilter); setPage(0); }} />
          <FilterGroup label={t.cmdbStatus} options={cmdbOptions} active={cmdbFilter} onChange={(value) => { setCmdbFilter(value as CmdbFilter); setPage(0); }} />
          <button
            onClick={clearAllFilters}
            style={{ background: 'none', border: 'none', padding: 0, color: 'var(--info-600)', fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
          >
            {t.clearFilters}
          </button>
        </FilterPanel>

        <div style={{ minWidth: 0 }}>
          <div className="results-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)' }}>
              {filteredRecords.length} {t.results}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>
              {INVENTORY_SOURCE_REGISTRATION_COUNT} {t.represented}
            </span>
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ background: 'var(--surface-card)', border: '1px dashed var(--input-border)', borderRadius: '6px', padding: '40px', textAlign: 'center', color: 'var(--text-color-secondary)', fontSize: '14px' }}>
              {t.empty}
            </div>
          ) : (
          <>
          {renderPagination('top')}
          <div
            ref={topScrollRef}
            onScroll={(event) => {
              if (tableScrollRef.current) tableScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }}
            aria-hidden="true"
            style={{ overflowX: 'auto', overflowY: 'hidden', height: '16px', marginBottom: '6px' }}
          >
            <div style={{ width: '720px', height: '1px' }} />
          </div>
          <div
            ref={tableScrollRef}
            onScroll={(event) => {
              if (topScrollRef.current) topScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }}
            className="data-table-shell"
          >
        <table className="data-table data-table--comfortable" style={{ minWidth: '720px', tableLayout: 'fixed' }}>
          <caption style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{t.tableCaption}</caption>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '17%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--table-header-background)', color: 'var(--table-header-text)' }}>
              {[t.family, t.noMoreRansom, t.malwareBazaar, t.samples, t.zoo, t.cmdb].map((heading) => (
                <th key={heading} scope="col">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRecords.map((record) => (
              <tr key={`${record.name}-${record.noMoreRansomEntries.join('-')}`} style={{ borderTop: '1px solid var(--surface-border)' }}>
                <th scope="row" style={{ fontSize: '13.5px', overflowWrap: 'anywhere' }}>{record.name}</th>
                <td>
                  {record.noMoreRansomEntries.length > 0 ? (
                    <>
                      <StatusBadge label={lang === 'pt' ? 'Listado' : 'Listed'} tone="success" />
                      <div style={{ marginTop: '7px', fontSize: '12px', color: 'var(--text-color-secondary)', lineHeight: 1.45, overflowWrap: 'anywhere' }}>
                        {record.noMoreRansomEntries.join(' · ')}
                      </div>
                    </>
                  ) : (
                    <StatusBadge label={t.notListed} tone="secondary" />
                  )}
                </td>
                <td>
                  {record.malwareBazaarStatus === 'confirmed' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
                      <StatusBadge label={lang === 'pt' ? 'Confirmado' : 'Confirmed'} tone="success" />
                      {record.malwareBazaarMatches.map((match) => (
                        <a key={match.url} href={match.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', overflowWrap: 'anywhere' }}>
                          {match.kind === 'tag' ? (lang === 'pt' ? 'etiqueta' : 'tag') : (lang === 'pt' ? 'assinatura' : 'signature')} {match.label}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <StatusBadge label={lang === 'pt' ? 'Não confirmado' : 'Not confirmed'} tone="warning" />
                      <div style={{ marginTop: '7px', maxWidth: '28ch', fontSize: '11.5px', lineHeight: 1.45, color: 'var(--text-color-secondary)' }}>{t.noExactMatch}</div>
                    </div>
                  )}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {record.malwareBazaarMatches.length > 0
                    ? record.malwareBazaarMatches.map((match) => (
                      <div key={match.url}>{match.count.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')}</div>
                    ))
                    : '—'}
                </td>
                <td>
                  <StatusBadge
                    label={presenceLabel(record.theZooStatus, lang)}
                    tone={record.theZooStatus === 'confirmed' ? 'success' : record.theZooStatus === 'not-confirmed' ? 'warning' : 'secondary'}
                  />
                  {record.theZooEntry && <div style={{ marginTop: '7px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>{record.theZooEntry}</div>}
                </td>
                <td>
                  {record.documentedFamilyKey ? (
                    <button
                      type="button"
                      onClick={() => onOpenFamily(record.documentedFamilyKey!)}
                      style={{ background: 'var(--primary-color)', color: 'var(--primary-color-text)', border: 'none', borderRadius: '4px', padding: '5px 9px', fontSize: '11.5px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {t.source}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      style={{ background: 'var(--surface-300)', color: 'var(--surface-300)', border: 'none', borderRadius: '4px', padding: '5px 9px', fontSize: '11.5px', fontWeight: 500, cursor: 'not-allowed', whiteSpace: 'nowrap' }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
          </>
          )}

          {renderPagination('bottom')}
        </div>
      </div>
    </section>
  );
};
