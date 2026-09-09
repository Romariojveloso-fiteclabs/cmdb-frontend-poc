import React from 'react';

export type ResultViewMode = 'cards' | 'table';

export interface ResultsBrowserProps<Item> {
  items: readonly Item[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;

  resultsLabel: React.ReactNode;
  toolbarRight?: React.ReactNode;

  emptyNode: React.ReactNode;

  renderCard?: (item: Item, index: number) => React.ReactNode;
  cardGridClassName?: string;

  viewMode?: ResultViewMode;
  onViewModeChange?: (mode: ResultViewMode) => void;
  viewToggleNote?: React.ReactNode;
  viewToggleLabels?: { cards: string; table: string };

  tableColumns: readonly string[];
  renderTableRow: (item: Item, index: number) => React.ReactNode;
  tableMinWidth?: number;
  tableRoominess?: 'roomy' | 'comfortable' | 'standard';
  tableCaption?: string;

  paginationLabels?: {
    previous: string;
    next: string;
    pageInfo: (page: number, total: number) => string;
  };
}

export function ResultsBrowser<Item>(props: ResultsBrowserProps<Item>) {
  const {
    items,
    page,
    pageSize,
    onPageChange,
    resultsLabel,
    toolbarRight,
    emptyNode,
    renderCard,
    cardGridClassName = 'card-grid card-grid--2',
    viewMode,
    onViewModeChange,
    viewToggleNote,
    viewToggleLabels,
    tableColumns,
    renderTableRow,
    tableMinWidth,
    tableRoominess = 'standard',
    tableCaption,
    paginationLabels,
  } = props;

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  const visible = items.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const isTable = !renderCard || viewMode === 'table';
  const showToggle = Boolean(renderCard && onViewModeChange);

  const roomyClass = tableRoominess === 'roomy'
    ? ' data-table--roomy'
    : tableRoominess === 'comfortable'
      ? ' data-table--comfortable'
      : '';

  return (
    <div style={{ minWidth: 0 }}>
      <div className="results-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-color-secondary)' }}>
          {resultsLabel}
        </span>

        {toolbarRight ? (
          toolbarRight
        ) : showToggle ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {viewToggleNote && (
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>{viewToggleNote}</span>
            )}
            <div style={{ display: 'flex', border: '1px solid var(--input-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => onViewModeChange?.('cards')}
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
                {viewToggleLabels?.cards ?? 'Cards'}
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange?.('table')}
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
                {viewToggleLabels?.table ?? 'Table'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {items.length === 0 ? (
        emptyNode
      ) : isTable ? (
        <div className="data-table-shell">
          <table className={`data-table${roomyClass}`} style={{ minWidth: tableMinWidth }}>
            {tableCaption && (
              <caption style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                {tableCaption}
              </caption>
            )}
            <thead>
              <tr>
                {tableColumns.map((heading) => (
                  <th key={heading} scope="col">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((item, index) => renderTableRow(item, index))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={cardGridClassName}>
          {visible.map((item, index) => renderCard?.(item, index))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="results-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginTop: '18px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-color-secondary)' }}>
            {paginationLabels ? paginationLabels.pageInfo(safePage + 1, totalPages) : `${safePage + 1} / ${totalPages}`}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => onPageChange(Math.max(0, safePage - 1))}
              style={{
                background: safePage === 0 ? 'var(--surface-100)' : 'var(--surface-card)',
                border: '1px solid var(--input-border)',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: safePage === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {paginationLabels?.previous ?? 'Previous'}
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => onPageChange(Math.min(totalPages - 1, safePage + 1))}
              style={{
                background: safePage >= totalPages - 1 ? 'var(--surface-100)' : 'var(--surface-card)',
                border: '1px solid var(--input-border)',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: safePage >= totalPages - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              {paginationLabels?.next ?? 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
