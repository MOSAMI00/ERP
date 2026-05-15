import { Download } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import { route } from '../../../../inertia/routes';

export default function UsersFilterBar() {
  const { props } = usePage();
  const filters = props.filters ?? {};
  const requestFilters = (nextFilters) => {
    router.get(route('admin.users.index'), nextFilters, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center flex-1">
        <SearchInput
          placeholder="بحث باسم أو جوال..."
          className="w-full md:w-64"
          value={filters.search ?? ''}
          onChange={(event) => requestFilters({ ...filters, search: event.target.value || undefined })}
        />
        
        <Select value={filters.type ?? ''} onChange={(event) => requestFilters({ ...filters, type: event.target.value || undefined })} placeholder="النوع: الكل" options={[{ value: 'tenant', label: 'مستأجر' }, { value: 'owner', label: 'مؤجر' }]} />
        <Select value={filters.status ?? ''} onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })} placeholder="الحالة: الكل" options={[{ value: 'active', label: 'نشط' }, { value: 'suspended', label: 'موقوف' }, { value: 'banned', label: 'محظور' }]} />
        <Select placeholder="المحافظة: الكل" options={[{ value: 'sanaa', label: 'صنعاء' }, { value: 'aden', label: 'عدن' }, { value: 'taiz', label: 'تعز' }, { value: 'hadramout', label: 'حضرموت' }]} />
      </div>
      
      <Button unstyled className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-brand-content border border-brand-border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
        <Download size={16} />
        <span>تصدير CSV</span>
      </Button>
    </div>
  );
}
