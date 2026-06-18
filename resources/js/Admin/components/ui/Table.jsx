import EmptyState from './EmptyState';

export default function Table({
  columns,
  data,
  renderRow,
  emptyState,
  wrapperClassName = 'overflow-x-auto',
  tableClassName = 'w-full text-right text-sm',
  theadClassName = 'bg-brand-content text-brand-text-muted font-medium border-b border-brand-border',
  tbodyClassName = 'divide-y divide-brand-border',
}) {
  return (
    <div className={wrapperClassName}>
      <table className={tableClassName}>
        <thead className={theadClassName}>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.label} className={column.className || 'px-6 py-4'}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClassName}>
          {data.length > 0 ? data.map(renderRow) : (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState {...(emptyState || { title: 'لا توجد بيانات' })} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
