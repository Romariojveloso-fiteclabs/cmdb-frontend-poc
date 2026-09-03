import React, { useMemo, useRef, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { Lang } from '../data/families';
import {
  INVENTORY_RECORDS,
  INVENTORY_SOURCE_REGISTRATION_COUNT,
  InventoryPresence
} from '../data/inventory';

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
    subtitle: 'Este levantamento reúne informações de fontes confiáveis para incentivar a contribuição contínua de novos entusiastas da área, facilitar a identificação das documentações já publicadas no CMDB e evidenciar o que ainda precisa ser investigado.',
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
    subtitle: 'This survey brings together information from trusted sources to encourage continued contributions from newcomers to the field, make published CMDB documentation easier to identify, and highlight what still needs to be investigated.',
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
  success: { background: '#E8F0E9', color: '#3C6549', borderColor: '#B4C8B9' },
  warning: { background: '#FAF0DA', color: '#8A651C', borderColor: '#E7C977' },
  secondary: { background: '#EFE6D5', color: '#5C564A', borderColor: '#CFC0A6' }
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
  const [query, setQuery] = useState('');
  const [noMoreRansomFilter, setNoMoreRansomFilter] = useState<PresenceFilter>('all');
  const [matchFilter, setMatchFilter] = useState<MatchFilter>('all');
  const [theZooFilter, setTheZooFilter] = useState<PresenceFilter>('all');
  const [cmdbFilter, setCmdbFilter] = useState<CmdbFilter>('all');
  const [page, setPage] = useState(0);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const pageSize = 20;

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

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleRecords = filteredRecords.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const clearAllFilters = () => {
    setQuery('');
    setNoMoreRansomFilter('all');
    setMatchFilter('all');
    setTheZooFilter('all');
    setCmdbFilter('all');
    setPage(0);
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

  const renderPagination = (position: 'top' | 'bottom') => totalPages > 1 && (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', margin: position === 'top' ? '0 0 10px' : '18px 0 0' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>
        {t.page} {currentPage + 1} {t.of} {totalPages}
      </span>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          disabled={currentPage === 0}
          onClick={() => setPage((value) => Math.max(0, value - 1))}
          style={{ background: currentPage === 0 ? 'var(--surface-100)' : 'var(--surface-card)', border: '1px solid var(--input-border)', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
        >
          {t.previous}
        </button>
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
          style={{ background: currentPage >= totalPages - 1 ? 'var(--surface-100)' : 'var(--surface-card)', border: '1px solid var(--input-border)', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
        >
          {t.next}
        </button>
      </div>
    </div>
  );

  return (
    <section className="page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 28px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-accent)', fontSize: '34px', fontWeight: 600, margin: '0 0 8px' }}>{t.title}</h1>
      <p style={{ fontSize: '14.5px', color: 'var(--text-color-secondary)', margin: '0 0 24px', maxWidth: '70ch', lineHeight: 1.6 }}>
        {t.subtitle}
      </p>

      <div className="responsive-split" style={{ display: 'grid', gridTemplateColumns: '272px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <aside className="filters-panel" style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: '6px', padding: '18px', position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(0); }}
              placeholder={t.search}
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
              {t.noMoreRansomStatus}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setNoMoreRansomFilter('all'); setPage(0); }} style={filterChipStyle(noMoreRansomFilter === 'all')}>{t.all}</button>
              <button onClick={() => { setNoMoreRansomFilter('confirmed'); setPage(0); }} style={filterChipStyle(noMoreRansomFilter === 'confirmed')}>{t.listed}</button>
              <button onClick={() => { setNoMoreRansomFilter('absent'); setPage(0); }} style={filterChipStyle(noMoreRansomFilter === 'absent')}>{t.notListed}</button>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
              {t.matchStatus}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setMatchFilter('all'); setPage(0); }} style={filterChipStyle(matchFilter === 'all')}>{t.all}</button>
              <button onClick={() => { setMatchFilter('confirmed'); setPage(0); }} style={filterChipStyle(matchFilter === 'confirmed')}>{t.confirmed}</button>
              <button onClick={() => { setMatchFilter('not-confirmed'); setPage(0); }} style={filterChipStyle(matchFilter === 'not-confirmed')}>{t.notConfirmed}</button>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
              {t.theZooStatus}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setTheZooFilter('all'); setPage(0); }} style={filterChipStyle(theZooFilter === 'all')}>{t.all}</button>
              <button onClick={() => { setTheZooFilter('confirmed'); setPage(0); }} style={filterChipStyle(theZooFilter === 'confirmed')}>{t.confirmed}</button>
              <button onClick={() => { setTheZooFilter('not-confirmed'); setPage(0); }} style={filterChipStyle(theZooFilter === 'not-confirmed')}>{t.notConfirmed}</button>
              <button onClick={() => { setTheZooFilter('absent'); setPage(0); }} style={filterChipStyle(theZooFilter === 'absent')}>{t.notListed}</button>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-color-secondary)', marginBottom: '9px' }}>
              {t.cmdbStatus}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => { setCmdbFilter('all'); setPage(0); }} style={filterChipStyle(cmdbFilter === 'all')}>{t.all}</button>
              <button onClick={() => { setCmdbFilter('documented'); setPage(0); }} style={filterChipStyle(cmdbFilter === 'documented')}>{t.documented}</button>
              <button onClick={() => { setCmdbFilter('not-documented'); setPage(0); }} style={filterChipStyle(cmdbFilter === 'not-documented')}>{t.notDocumented}</button>
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
            <div style={{ width: '860px', height: '1px' }} />
          </div>
          <div
            ref={tableScrollRef}
            onScroll={(event) => {
              if (topScrollRef.current) topScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }}
            style={{ border: '1px solid var(--surface-border)', borderRadius: '6px', overflowX: 'auto', background: 'var(--surface-card)' }}
          >
        <table style={{ width: '100%', minWidth: '860px', tableLayout: 'fixed', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
          <caption style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{t.tableCaption}</caption>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '19%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#243A2E', color: '#F3EBDD' }}>
              {[t.family, t.noMoreRansom, t.malwareBazaar, t.samples, t.zoo, t.cmdb].map((heading) => (
                <th key={heading} scope="col" style={{ padding: '12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.04em' }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRecords.map((record) => (
              <tr key={`${record.name}-${record.noMoreRansomEntries.join('-')}`} style={{ borderTop: '1px solid var(--surface-border)' }}>
                <th scope="row" style={{ padding: '12px', verticalAlign: 'top', textAlign: 'left', fontSize: '13.5px', overflowWrap: 'anywhere' }}>{record.name}</th>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
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
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  {record.malwareBazaarStatus === 'confirmed' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '7px' }}>
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
                <td style={{ padding: '12px', verticalAlign: 'top', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {record.malwareBazaarMatches.length > 0
                    ? record.malwareBazaarMatches.map((match) => (
                      <div key={match.url}>{match.count.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US')}</div>
                    ))
                    : '—'}
                </td>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  <StatusBadge
                    label={presenceLabel(record.theZooStatus, lang)}
                    tone={record.theZooStatus === 'confirmed' ? 'success' : record.theZooStatus === 'not-confirmed' ? 'warning' : 'secondary'}
                  />
                  {record.theZooEntry && <div style={{ marginTop: '7px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>{record.theZooEntry}</div>}
                </td>
                <td style={{ padding: '12px', verticalAlign: 'top' }}>
                  {record.documentedFamilyKey ? (
                    <button
                      type="button"
                      onClick={() => onOpenFamily(record.documentedFamilyKey!)}
                      style={{ background: '#243A2E', color: '#F3EBDD', border: 'none', borderRadius: '4px', padding: '5px 9px', fontSize: '11.5px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {t.source}
                    </button>
                  ) : <span style={{ fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>{t.noReport}</span>}
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
