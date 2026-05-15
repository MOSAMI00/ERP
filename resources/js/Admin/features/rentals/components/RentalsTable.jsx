import { FileText } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

export default function RentalsTable({ rentals, onOpenDrawer }) {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'tenant', label: 'المستأجر' },
    { key: 'owner', label: 'المؤجر' },
    { key: 'eq', label: 'المعدة' },
    { key: 'duration', label: 'المدة', className: 'px-6 py-4 text-center' },
    { key: 'total', label: 'الإجمالي (ر.ي)', className: 'px-6 py-4 text-center' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'contract', label: 'العقد', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <Table
        columns={columns}
        data={rentals}
        renderRow={(rental) => (
          <tr key={rental.id} className="hover:bg-brand-content/50 transition-colors cursor-pointer" onClick={() => onOpenDrawer(rental)}>
                <td className="px-6 py-4 font-bold text-brand-text-primary" dir="ltr">{rental.id}</td>
                <td className="px-6 py-4">{rental.tenant}</td>
                <td className="px-6 py-4">{rental.owner}</td>
                <td className="px-6 py-4 text-brand-text-muted">{rental.eq}</td>
                <td className="px-6 py-4 text-center font-bold text-brand-text-primary">{rental.duration}</td>
                <td className="px-6 py-4 text-center font-bold text-brand-primary">{rental.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    rental.statusColor === 'pending' ? 'bg-brand-text-muted/10 text-brand-text-muted' :
                    `bg-brand-${rental.statusColor}/10 text-brand-${rental.statusColor}`
                  }`}>
                    {rental.status === 'In Use' ? 'In Use 🔧' : rental.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button unstyled onClick={(e) => { e.stopPropagation(); onOpenDrawer(rental); }} className="p-1.5 text-brand-info hover:bg-brand-info/10 rounded-lg transition-colors" title="عرض العقد">
                    <FileText size={18} />
                  </Button>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
