import React from 'react';
import { PaginationBar } from './PaginationBar';
import { ViewToggle, ResultViewMode } from './ViewToggle';

export type { ResultViewMode } from './ViewToggle';

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
    paginationLabels
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
            {viewToggleNote ? (
              <span style={{ fontSize: '12px', color: 'var(--text-color-secondary)' }}>{viewToggleNote}</span>
            ) : null}
            <ViewToggle
              viewMode={viewMode ?? 'cards'}
              onChange={onViewModeChange!}
              cardsLabel={viewToggleLabels?.cards ?? 'Cards'}
              tableLabel={viewToggleLabels?.table ?? 'Table'}
            />
          </div>
        ) : null}
      </div>

      {items.length === 0 ? (
        emptyNode
      ) : isTable ? (
        <div className="data-table-shell">
          <table className={`data-table${roomyClass}`} style={{ minWidth: tableMinWidth }}>
            {tableCaption ? (
              <caption style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                {tableCaption}
              </caption>
            ) : null}
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
        <PaginationBar
          page={safePage}
          totalPages={totalPages}
          onPrev={() => onPageChange(Math.max(0, safePage - 1))}
          onNext={() => onPageChange(Math.min(totalPages - 1, safePage + 1))}
          info={paginationLabels ? paginationLabels.pageInfo(safePage + 1, totalPages) : `${safePage + 1} / ${totalPages}`}
          previousLabel={paginationLabels?.previous ?? 'Previous'}
          nextLabel={paginationLabels?.next ?? 'Next'}
        />
      )}
    </div>
  );
}
