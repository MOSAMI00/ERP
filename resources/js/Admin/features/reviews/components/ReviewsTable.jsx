import { Star, Eye, Trash2, Flag } from 'lucide-react';
import { router } from '@inertiajs/react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

const renderStars = (rating) => {
  return Array(5).fill(0).map((_, i) => (
    <Star key={i} size={14} className={i < rating ? "text-brand-warning fill-brand-warning" : "text-brand-border"} />
  ));
};

export default function ReviewsTable({ reviews, onOpenDrawer }) {
  const columns = [
    { key: 'id', label: '#' },
    { key: 'rater', label: 'المُقيِّم' },
    { key: 'target', label: 'الهدف' },
    { key: 'rating', label: 'التقييم', className: 'px-6 py-4 text-center' },
    { key: 'text', label: 'نص المراجعة (مختصر)', className: 'px-6 py-4 w-1/3' },
    { key: 'date', label: 'التاريخ', className: 'px-6 py-4 text-center' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'actions', label: 'إجراءات', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <Table
        columns={columns}
        data={reviews}
        renderRow={(rev) => (
          <tr key={rev.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-muted" dir="ltr">{rev.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-brand-text-primary">{rev.rater}</p>
                    <p className="text-xs text-brand-text-muted">{rev.raterType}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-brand-text-primary">{rev.target}</p>
                    <p className="text-xs text-brand-text-muted">{rev.targetType}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-1 space-x-reverse" dir="ltr">
                    {renderStars(rev.rating)}
                  </div>
                </td>
                <td className="px-6 py-4 text-brand-text-muted truncate max-w-xs">{rev.text}</td>
                <td className="px-6 py-4 text-center text-brand-text-muted" dir="ltr">{rev.date}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    rev.status === 'نشط' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
                  }`}>
                    {rev.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Button unstyled onClick={() => onOpenDrawer(rev)} className="p-1.5 text-brand-text-muted hover:text-brand-info hover:bg-brand-info/10 rounded-lg transition-colors" title="عرض التفاصيل">
                      <Eye size={18} />
                    </Button>
                    <Button unstyled onClick={() => router.delete(route('admin.reviews.destroy', rev.id), { preserveScroll: true })} className="p-1.5 text-brand-text-muted hover:text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors" title="حذف التقييم">
                      <Trash2 size={18} />
                    </Button>
                    <Button unstyled onClick={() => router.post(route('admin.reviews.hide', rev.id), {}, { preserveScroll: true })} className="p-1.5 text-brand-text-muted hover:text-brand-warning hover:bg-brand-warning/10 rounded-lg transition-colors" title="إبلاغ">
                      <Flag size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
