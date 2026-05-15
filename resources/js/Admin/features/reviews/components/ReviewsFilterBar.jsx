import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function ReviewsFilterBar() {
  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center flex-1">
          <SearchInput placeholder="بحث في التقييمات..." className="w-full md:w-64" />
          
          <Select placeholder="النوع: الكل" options={[{ value: 'tenant', label: 'مستأجر' }, { value: 'owner', label: 'مؤجر' }]} />
          <Select placeholder="التقييم: الكل" options={[{ value: '5', label: '⭐⭐⭐⭐⭐' }, { value: '4', label: '⭐⭐⭐⭐' }, { value: '3', label: '⭐⭐⭐' }, { value: '2', label: '⭐⭐' }, { value: '1', label: '⭐' }]} />
          <Select placeholder="الحالة: الكل" options={[{ value: 'active', label: 'نشط' }, { value: 'deleted', label: 'محذوف' }]} />
      </div>
    </div>
  );
}
