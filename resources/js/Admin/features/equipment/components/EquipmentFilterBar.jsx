import { Grid, List as ListIcon } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function EquipmentFilterBar({ viewMode, setViewMode }) {
  const { props } = usePage();
  const filters = props.filters ?? {};
  const requestFilters = (nextFilters) => {
    router.get(route('admin.equipment.index'), nextFilters, {
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
            placeholder="بحث عن معدة أو مؤجر..."
            className="w-full md:w-64"
          />
          
          <Select
            value={filters.status ?? ''}
            onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })}
            placeholder="الحالة: الكل"
            options={[{ value: 'active', label: 'نشط' }, { value: 'hidden', label: 'مخفي' }, { value: 'deleted', label: 'محذوف' }]}
          />
      </div>
      
      <div className="flex items-center space-x-2 space-x-reverse bg-brand-content rounded-lg p-1 border border-brand-border">
          <Button 
            unstyled
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-text-muted hover:text-brand-text-primary'}`}
          >
            <Grid size={18} />
          </Button>
          <Button 
            unstyled
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-text-muted hover:text-brand-text-primary'}`}
          >
            <ListIcon size={18} />
          </Button>
      </div>
    </div>
  );
}
