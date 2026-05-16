import { Eye, PauseCircle, Ban, CheckCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Pagination from '../../../components/ui/Pagination';
import Table from '../../../components/ui/Table';

export default function UsersTable({ users, pagination, onOpenDrawer, onOpenActionModal }) {
  const columns = [
    { key: 'user', label: 'المستخدم' },
    { key: 'phone', label: 'الجوال' },
    { key: 'type', label: 'النوع' },
    { key: 'gov', label: 'المحافظة' },
    { key: 'rating', label: 'التقييم', className: 'px-6 py-4 text-center' },
    { key: 'ops', label: 'العمليات', className: 'px-6 py-4 text-center' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'actions', label: 'الإجراءات', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <Table
        columns={columns}
        data={users}
        renderRow={(user) => (
          <tr key={user.id} className="hover:bg-brand-content/50 transition-colors cursor-pointer" onClick={() => onOpenDrawer(user)}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-brand-border" />
                    <span className="font-bold text-brand-text-primary">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium" dir="ltr">{user.phone}</td>
                <td className="px-6 py-4">
                  <Badge unstyled className={`px-2.5 py-1 text-xs font-bold rounded-md bg-brand-${user.typeColor}/10 text-brand-${user.typeColor}`}>
                    {user.type}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-brand-text-muted">{user.gov}</td>
                <td className="px-6 py-4 text-center font-bold text-brand-text-primary">
                  ⭐ {user.rating}
                </td>
                <td className="px-6 py-4 text-center text-brand-text-muted">{user.ops}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className={`px-3 py-1 rounded-full text-xs font-bold bg-brand-${user.statusColor}/10 text-brand-${user.statusColor}`}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse" onClick={(e) => e.stopPropagation()}>
                    <Button unstyled onClick={() => onOpenDrawer(user)} className="p-1.5 text-brand-text-muted hover:text-brand-info hover:bg-brand-info/10 rounded-lg transition-colors" title="عرض">
                      <Eye size={18} />
                    </Button>
                    {user.status !== 'active' ? (
                      <Button unstyled onClick={() => onOpenActionModal(user, 'activate')} className="p-1.5 text-brand-text-muted hover:text-brand-success hover:bg-brand-success/10 rounded-lg transition-colors" title="تفعيل">
                        <CheckCircle size={18} />
                      </Button>
                    ) : (
                      <Button unstyled onClick={() => onOpenActionModal(user, 'suspend')} className="p-1.5 text-brand-text-muted hover:text-brand-warning hover:bg-brand-warning/10 rounded-lg transition-colors" title="تعليق">
                        <PauseCircle size={18} />
                      </Button>
                    )}
                    {user.status !== 'banned' && (
                      <Button unstyled onClick={() => onOpenActionModal(user, 'ban')} className="p-1.5 text-brand-text-muted hover:text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors" title="حظر">
                        <Ban size={18} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
        )}
      />
      <div className="px-6 py-4 border-t border-brand-border bg-brand-content text-sm text-brand-text-muted flex justify-between items-center">
        <span>
          عرض {pagination?.from ?? 0} إلى {pagination?.to ?? users.length} من {pagination?.total ?? users.length} مستخدم
        </span>
        <Pagination
          currentPage={pagination?.currentPage ?? 1}
          totalPages={pagination?.lastPage ?? 1}
          onPageChange={(page) => {
            if (!pagination?.path) return;
            router.get(pagination.path, { page }, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>
    </div>
  );
}
