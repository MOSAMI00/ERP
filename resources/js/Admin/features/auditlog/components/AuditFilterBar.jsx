import { Download, Calendar } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';

export default function AuditFilterBar() {
  const { props } = usePage();
  const filters = props.filters ?? {};
  const requestFilters = (nextFilters) => {
    router.get(route('admin.audit-logs.index'), nextFilters, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <div className="bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center flex-1">
        <SearchInput placeholder="بحث بالحدث أو التفاصيل..." className="w-full md:w-64" />
        
        <Select placeholder="المسؤول: الكل" options={[{ value: 'ahmed', label: 'أحمد علي' }, { value: 'sara', label: 'سارة محمد' }, { value: 'khaled', label: 'خالد عمر' }]} />
        <Select value={filters.event_type ?? ''} onChange={(event) => requestFilters({ ...filters, event_type: event.target.value || undefined })} placeholder="نوع الحدث: الكل" options={[{ value: 'ban', label: 'حظر/تعليق مستخدم' }, { value: 'delete', label: 'حذف محتوى' }, { value: 'dispute', label: 'قرار نزاع' }, { value: 'edit', label: 'تعديل بيانات' }, { value: 'finance', label: 'إجراء مالي' }]} />

        <div className="flex items-center space-x-2 space-x-reverse border border-brand-border bg-brand-content rounded-lg px-4 py-2 text-sm text-brand-text-muted cursor-pointer hover:border-brand-primary transition-colors">
          <Calendar size={16} />
          <span>من: --- إلى: ---</span>
        </div>
      </div>
      
      <Button unstyled className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-brand-primary text-white border border-brand-primary rounded-lg text-sm font-bold shadow-sm hover:bg-brand-primary/90 transition-colors">
        <Download size={16} />
        <span>تصدير السجل</span>
      </Button>
    </div>
  );
}
