import { Grid, List as ListIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function EquipmentFilterBar({ viewMode, setViewMode }) {
  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center flex-1">
          <SearchInput placeholder="بحث عن معدة..." className="w-full md:w-64" />
          
          <Select placeholder="الفئة: الكل" options={[{ value: 'build', label: 'بناء' }, { value: 'heavy', label: 'معدات ثقيلة' }, { value: 'power', label: 'طاقة' }]} />
          <Select placeholder="الحالة: الكل" options={[{ value: 'active', label: 'نشط' }, { value: 'hidden', label: 'مخفي' }]} />
          <Select placeholder="المحافظة: الكل" options={[{ value: 'sanaa', label: 'صنعاء' }, { value: 'aden', label: 'عدن' }]} />
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
