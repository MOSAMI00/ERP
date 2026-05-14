import React from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import {
  Calendar, MapPin, User, Package, Shield,
  ArrowRight, CheckCircle2, AlertCircle, Clock,
  FileText, CreditCard, Truck, RefreshCw, Star
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const StatusTimeline = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'الطلب', icon: FileText },
    { key: 'confirmed', label: 'الموافقة', icon: CheckCircle2 },
    { key: 'paid', label: 'الدفع', icon: CreditCard },
    { key: 'in_use', label: 'الاستلام', icon: Truck },
    { key: 'completed', label: 'الإرجاع', icon: RefreshCw },
  ];

  const getStatusIndex = (s) => {
    const map = { pending: 0, confirmed: 1, paid: 2, in_use: 3, completed: 4, cancelled: -1 };
    return map[s] ?? 0;
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx <= currentIndex && status !== 'cancelled';
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted-foreground'
                }`}>
                <Icon size={20} />
              </div>
              <span className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${idx < currentIndex ? 'bg-primary' : 'bg-border'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function RentalDetailsPage() {
  const { rental, auth } = usePage<any>().props;
  const isOwner = auth.user.id === rental.owner_id;
  const isTenant = auth.user.id === rental.tenant_id;

  const handleAction = (action, route) => {
    if (confirm(`هل أنت متأكد من القيام بـ ${action}؟`)) {
      router.post(route);
    }
  };

  const backUrl = isOwner ? '/owner/rentals' : '/dashboard';


  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={backUrl} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowRight size={20} />
          </Link>
          <h1 className="font-bold text-lg">تفاصيل الطلب #{rental.id}</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <StatusTimeline status={rental.status} />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Equipment Card */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="aspect-video bg-muted relative">
                {rental.equipment.images?.[0] ? (
                  <img src={rental.equipment.images[0].image_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`badge badge-${rental.status}`}>
                    {rental.status === 'pending' ? 'بانتظار الموافقة' :
                      rental.status === 'confirmed' ? 'بانتظار الدفع' :
                        rental.status === 'paid' ? 'بانتظار التسليم' :
                          rental.status === 'in_use' ? 'قيد الاستخدام' : 'مكتمل'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{rental.equipment.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{rental.delivery_location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{rental.duration_days} أيام</span>
                  </div>
                </div>
              </div>
            </div>

            {/* People Info */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <User size={18} className="text-primary" />
                {isOwner ? 'بيانات المستأجر' : 'بيانات المالك'}
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                  {(isOwner ? rental.tenant.full_name : rental.owner.full_name).charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{isOwner ? rental.tenant.full_name : rental.owner.full_name}</div>
                  <div className="text-sm text-muted-foreground">{isOwner ? rental.tenant.phone : rental.owner.phone}</div>
                </div>
                <div className="mr-auto">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            {rental.contract && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  العقد الإلكتروني
                </h3>
                <div className="bg-muted/50 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line border border-border">
                  {rental.contract.contract_body}
                </div>
                <div className="mt-4 flex gap-6 text-xs font-bold">
                  <div className="flex items-center gap-1 text-success">
                    <CheckCircle2 size={14} />
                    تم توقيع المستأجر
                  </div>
                  {rental.contract.owner_signature === 'signed' ? (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 size={14} />
                      تم توقيع المالك
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      بانتظار توقيع المالك
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold mb-4">ملخص التكاليف</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تكلفة الإيجار ({rental.duration_days} أيام):</span>
                  <span className="font-bold">{formatCurrency(rental.rental_amount)} ر.ي</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مبلغ التأمين:</span>
                  <span className="font-bold">{formatCurrency(rental.insurance_amount)} ر.ي</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between text-lg">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-bold text-primary">{formatCurrency(rental.total_amount)} ر.ي</span>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold mb-4">الإجراءات المطلوبة</h3>

              <div className="space-y-3">
                {/* Tenant Actions */}
                {isTenant && rental.status === 'confirmed' && (
                  <Link
                    href={`/rentals/${rental.id}/pay`}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <CreditCard size={18} />
                    دفع المبلغ وتأكيد الحجز
                  </Link>
                )}

                {isTenant && rental.status === 'paid' && (
                  <Link
                    href="/dashboard/delivery"
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Truck size={18} />
                    بدء إجراءات الاستلام
                  </Link>
                )}

                {/* Owner Actions */}
                {isOwner && rental.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction('الموافقة', `/rentals/${rental.id}/confirm`)}
                      className="w-full h-12 bg-success text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-success/90 transition-colors"
                    >
                      <CheckCircle2 size={18} />
                      موافقة وتوقيع العقد
                    </button>
                    <button
                      onClick={() => handleAction('الرفض', `/rentals/${rental.id}/cancel`)}
                      className="w-full h-12 bg-danger text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-danger/90 transition-colors"
                    >
                      <AlertCircle size={18} />
                      رفض الطلب
                    </button>
                  </>
                )}

                {isOwner && rental.status === 'paid' && (
                  <Link
                    href={`/delivery?id=${rental.id}`}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Package size={18} />
                    رفع تقرير تسليم المعدة
                  </Link>
                )}

                {isOwner && rental.status === 'completed' && !rental.compensation && (
                  <Link
                    href={`/delivery?id=${rental.id}`}
                    className="w-full h-12 bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                  >
                    <AlertCircle size={18} />
                    تبليغ عن أضرار / فتح نزاع
                  </Link>
                )}

                {/* Shared Empty State */}
                {((isTenant && rental.status === 'pending') || (isOwner && rental.status === 'confirmed')) && (
                  <div className="p-4 bg-muted rounded-xl text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                    <Clock size={24} />
                    بانتظار إجراء الطرف الآخر للمتابعة
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <Shield className="text-primary" size={24} />
              <div className="text-xs">
                <div className="font-bold text-primary">حماية منصة إيجار</div>
                <div className="text-muted-foreground">حقوقك محفوظة عبر نظام العقود والتعويضات</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
