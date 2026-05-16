import { router } from '@inertiajs/react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';

export default function DisputesTable({ disputes, pagination, filters = {}, onOpenReview }) {
  const requestFilters = (nextFilters = {}) => {
    router.get(route('admin.disputes.index'), nextFilters, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'tenant', label: 'المستأجر' },
    { key: 'owner', label: 'المؤجر' },
    { key: 'eq', label: 'المعدة' },
    { key: 'amount', label: 'مبلغ النزاع (ر.ي)', className: 'px-6 py-4 text-center' },
    { key: 'date', label: 'تاريخ الفتح', className: 'px-6 py-4 text-center' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'actions', label: 'الإجراءات', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <div className="p-4 border-b border-brand-border bg-brand-content/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-brand-text-primary">قائمة النزاعات</h3>
        <div className="flex flex-wrap gap-2">
          <SearchInput
            value={filters.search ?? ''}
            onChange={(event) => requestFilters({ ...filters, search: event.target.value || undefined })}
            placeholder="بحث عن نزاع..."
          />
          <Select
            value={filters.status ?? ''}
            onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })}
            className="border border-brand-border bg-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-primary"
            placeholder="الحالة: الكل"
            options={[
              { value: 'open', label: 'مفتوحة' },
              { value: 'under_review', label: 'قيد المراجعة' },
              { value: 'resolved', label: 'محلولة' },
            ]}
          />
        </div>
      </div>
      <Table
        columns={columns}
        data={disputes}
        renderRow={(dispute) => (
          <tr key={dispute.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary" dir="ltr">{dispute.id}</td>
                <td className="px-6 py-4">{dispute.tenant}</td>
                <td className="px-6 py-4">{dispute.owner}</td>
                <td className="px-6 py-4 text-brand-text-muted">{dispute.eq}</td>
                <td className="px-6 py-4 text-center font-bold text-brand-danger">{dispute.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-center text-brand-text-muted">{dispute.date}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className={`px-2.5 py-1 rounded-md text-xs font-bold bg-brand-${dispute.statusColor}/10 text-brand-${dispute.statusColor}`}>
                    {dispute.statusLabel ?? dispute.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button
                    unstyled
                    onClick={() => onOpenReview(dispute)}
                    className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary/90 transition-colors shadow-sm inline-flex items-center"
                  >
                    مراجعة
                  </Button>
                </td>
              </tr>
        )}
      />
      <div className="px-6 py-4 border-t border-brand-border bg-brand-content text-sm text-brand-text-muted flex justify-between items-center">
        <span>
          عرض {pagination?.from ?? 0} إلى {pagination?.to ?? disputes.length} من {pagination?.total ?? disputes.length} نزاع
        </span>
        <Pagination
          currentPage={pagination?.currentPage ?? 1}
          totalPages={pagination?.lastPage ?? 1}
          onPageChange={(page) => {
            if (!pagination?.path) return;
            router.get(pagination.path, { ...filters, page }, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>
    </div>
  );
}
