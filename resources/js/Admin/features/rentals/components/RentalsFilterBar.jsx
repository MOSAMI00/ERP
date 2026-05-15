import { Calendar } from 'lucide-react';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function RentalsFilterBar() {
  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center">
      <SearchInput placeholder="بحث باسم المستخدم أو ID..." className="w-full md:w-64" />
      
      <Select placeholder="المحافظة: الكل" options={[{ value: 'sanaa', label: 'صنعاء' }, { value: 'aden', label: 'عدن' }]} />

      <div className="flex items-center space-x-2 space-x-reverse border border-brand-border bg-brand-content rounded-lg px-4 py-2 text-sm text-brand-text-muted cursor-pointer hover:border-brand-primary transition-colors">
        <Calendar size={16} />
        <span>تاريخ البدء - الانتهاء</span>
      </div>
    </div>
  );
}
