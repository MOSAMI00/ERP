import { router } from '@inertiajs/react';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function ReviewsFilterBar({ filters: propFilters }) {
  const filters = propFilters ?? {};
  const requestFilters = (nextFilters) => {
    router.get(route('admin.reviews.index'), nextFilters, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center flex-1">
          <SearchInput
            value={filters.search ?? ''}
            onChange={(event) => requestFilters({ ...filters, search: event.target.value || undefined })}
            placeholder="بحث باسم المقيم..."
            className="w-full md:w-64"
          />
          
          <Select
            value={filters.target_type ?? ''}
            onChange={(event) => requestFilters({ ...filters, target_type: event.target.value || undefined })}
            placeholder="الهدف: الكل"
            options={[{ value: 'user', label: 'مستخدم' }, { value: 'equipment', label: 'معدة' }]}
          />
          <Select
            value={filters.status ?? ''}
            onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })}
            placeholder="الحالة: الكل"
            options={[{ value: 'visible', label: 'نشط' }, { value: 'hidden', label: 'مخفي' }, { value: 'flagged', label: 'مبلغ عنه' }]}
          />
      </div>
    </div>
  );
}
