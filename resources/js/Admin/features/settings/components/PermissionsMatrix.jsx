import { CheckCircle2, XCircle } from 'lucide-react';
import Table from '../../../components/ui/Table';

export default function PermissionsMatrix({ permissions }) {
  const columns = [
    { key: 'action', label: 'الصلاحية', className: 'px-6 py-4 text-right' },
    { key: 'super', label: 'Super Admin', className: 'px-6 py-4 text-brand-success' },
    { key: 'support', label: 'Support', className: 'px-6 py-4 text-brand-info' },
    { key: 'finance', label: 'Finance', className: 'px-6 py-4 text-brand-warning' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <div className="p-4 border-b border-brand-border bg-brand-content/50">
        <h3 className="text-lg font-bold text-brand-text-primary">مصفوفة الصلاحيات (Roles Matrix)</h3>
        <p className="text-xs text-brand-text-muted mt-1">يتم تطبيق هذه الصلاحيات تلقائياً على كل مسؤول حسب دوره.</p>
      </div>
      <Table
        columns={columns}
        data={permissions}
        tableClassName="w-full text-center text-sm"
        theadClassName="bg-brand-content text-brand-text-muted font-bold border-b border-brand-border"
        renderRow={(perm, idx) => (
          <tr key={idx} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary text-right">{perm.action}</td>
                <td className="px-6 py-4">
                  {perm.super ? <CheckCircle2 size={20} className="text-brand-success mx-auto" /> : <XCircle size={20} className="text-brand-text-muted opacity-30 mx-auto" />}
                </td>
                <td className="px-6 py-4">
                  {perm.support ? <CheckCircle2 size={20} className="text-brand-success mx-auto" /> : <XCircle size={20} className="text-brand-text-muted opacity-30 mx-auto" />}
                </td>
                <td className="px-6 py-4">
                  {perm.finance ? <CheckCircle2 size={20} className="text-brand-success mx-auto" /> : <XCircle size={20} className="text-brand-text-muted opacity-30 mx-auto" />}
                </td>
              </tr>
        )}
      />
    </div>
  );
}
