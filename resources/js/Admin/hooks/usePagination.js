import { useCallback, useState } from 'react';

export default function usePagination(pageSize = 10) {
  const [page, setPage] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));

  const paginate = useCallback((data) => {
    if (data.length !== itemCount) {
      setItemCount(data.length);
    }

    const nextTotalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const safePage = Math.min(page, nextTotalPages);
    return data.slice((safePage - 1) * pageSize, safePage * pageSize);
  }, [itemCount, page, pageSize]);

  const setSafePage = useCallback((nextPage) => {
    setPage((currentPage) => {
      const resolvedPage = typeof nextPage === 'function' ? nextPage(currentPage) : nextPage;
      return Math.min(Math.max(1, resolvedPage), totalPages);
    });
  }, [totalPages]);

  return { page, totalPages, setPage: setSafePage, paginate };
}
