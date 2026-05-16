import { Calendar } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function RentalsFilterBar() {
  const { props } = usePage();
  const filters = props.filters ?? {};
  const requestFilters = (nextFilters) => {
    router.get(route('admin.rentals.index'), nextFilters, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center">
      <SearchInput
        value={filters.search ?? ''}
        onChange={(event) => requestFilters({ ...filters, search: event.target.value || undefined })}
        placeholder="بحث باسم المستخدم أو المعدة..."
        className="w-full md:w-64"
      />
      
      <Select
        value={filters.status ?? ''}
        onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })}
        placeholder="الحالة: الكل"
        options={[
          { value: 'pending', label: 'قيد المراجعة' },
          { value: 'confirmed', label: 'بانتظار الدفع' },
          { value: 'paid', label: 'مدفوع' },
          { value: 'in_use', label: 'قيد الاستخدام' },
          { value: 'completed', label: 'مكتمل' },
          { value: 'cancelled', label: 'ملغي' },
          { value: 'disputed', label: 'نزاع' },
        ]}
      />

      <div className="flex items-center space-x-2 space-x-reverse border border-brand-border bg-brand-content rounded-lg px-4 py-2 text-sm text-brand-text-muted cursor-pointer hover:border-brand-primary transition-colors">
        <Calendar size={16} />
        <span>تاريخ البدء - الانتهاء</span>
      </div>
    </div>
  );
}
