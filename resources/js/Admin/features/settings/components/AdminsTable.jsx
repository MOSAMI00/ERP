import { Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';

export default function AdminsTable({ admins }) {
  const columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'role', label: 'الدور' },
    { key: 'action', label: 'إجراء', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <div className="p-4 border-b border-brand-border bg-brand-content/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-brand-text-primary">المسؤولون</h3>
        <Button unstyled className="flex items-center space-x-1 space-x-reverse bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-primary/90 transition-colors shadow-sm">
          <Plus size={16} /> <span>إضافة مسؤول جديد</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={admins}
        renderRow={(admin) => (
          <tr key={admin.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary">{admin.name}</td>
                <td className="px-6 py-4 text-brand-text-muted">{admin.email}</td>
                <td className="px-6 py-4">
                  <Select
                    className={`bg-brand-${admin.roleColor}/10 text-brand-${admin.roleColor} border border-brand-${admin.roleColor}/20 rounded-md px-3 py-1.5 font-bold text-xs focus:outline-none`}
                    defaultValue={admin.role}
                    options={[{ value: 'Super Admin', label: 'Super Admin' }, { value: 'Support', label: 'Support' }, { value: 'Finance', label: 'Finance' }]}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Button unstyled className="p-1.5 text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                      <Edit size={18} />
                    </Button>
                    <Button unstyled className="p-1.5 text-brand-text-muted hover:text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
