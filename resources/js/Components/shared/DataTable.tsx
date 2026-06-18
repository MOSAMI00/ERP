import * as React from 'react';
import { cn } from '../ui/utils';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';

export function DataTable({
  columns,
  data,
  getRowKey,
  loading = false,
  loadingLabel,
  emptyState,
  className,
  tableClassName,
  rowClassName,
  onRowClick,
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-[#E0E0E0] bg-white', className)}>
      <div className="overflow-x-auto">
        <table className={cn('w-full border-collapse text-right text-sm', tableClassName)} style={{ direction: 'rtl' }}>
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#F4F6F9]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn('whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase text-[#888888]', column.headerClassName)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E0E0]">
            {!loading && data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className={cn(
                  'transition-colors hover:bg-[#F4F6F9]',
                  onRowClick ? 'cursor-pointer' : '',
                  rowClassName?.(row, index),
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-4 py-4 align-middle', column.className)}>
                    {column.cell(row, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading ? (
        <LoadingState label={loadingLabel} className="rounded-none border-0 border-t border-[#E0E0E0]" />
      ) : null}

      {!loading && data.length === 0 ? (
        <EmptyState compact type="empty" {...emptyState} className={cn('rounded-none border-0 border-t border-[#E0E0E0]', emptyState?.className)} />
      ) : null}
    </div>
  );
}
