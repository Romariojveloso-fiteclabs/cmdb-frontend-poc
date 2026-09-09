import { useState } from 'react';

export function usePagination(itemCount: number, pageSize: number, initialPage = 0) {
  const [page, setPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
  const currentPage = Math.min(Math.max(0, page), totalPages - 1);
  return { page: currentPage, setPage, totalPages };
}
