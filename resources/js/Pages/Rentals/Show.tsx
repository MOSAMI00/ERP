import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Shield,
  Star,
  Truck,
  User,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ContractBody } from '../../features/contracts/ui/ContractBody';

const STATUS_META = {
  pending: { label: 'بانتظار الموافقة', tone: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'بانتظار الدفع', tone: 'bg-blue-100 text-blue-800' },
  paid: { label: 'بانتظار التسليم', tone: 'bg-emerald-100 text-emerald-800' },
  in_use: { label: 'قيد الاستخدام', tone: 'bg-indigo-100 text-indigo-800' },
  return_done: { label: 'تم الإرجاع', tone: 'bg-slate-100 text-slate-800' },
  compensation_requested: { label: 'طلب تعويض', tone: 'bg-orange-100 text-orange-800' },
  disputed: { label: 'نزاع مفتوح', tone: 'bg-red-100 text-red-800' },
  completed: { label: 'مكتملة', tone: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ملغية', tone: 'bg-gray-100 text-gray-700' },
};

const TIME_SLOT_LABELS = {
  morning: 'صباحاً (8ص - 12م)',
  afternoon: 'ظهراً (12م - 4م)',
  evening: 'مساءً (4م - 8م)',
};

function statusValue(value: any) {
  return typeof value === 'object' ? value?.value : value;
}

function isPaidRental(rental: any) {
  return (
    ['paid', 'in_use', 'return_done', 'compensation_requested', 'completed', 'disputed'].includes(rental.status) ||
    rental.payments?.some?.((payment: any) => statusValue(payment.status) === 'paid')
  );
}

function primaryImage(equipment: any) {
  return (
    equipment?.images?.find?.((image: any) => image.is_primary)?.image_url ??
    equipment?.images?.[0]?.image_url ??
    equipment?.image_url ??
    equipment?.image
  );
}

function whatsappUrl(phone?: string | null) {
  const clean = String(phone ?? '').replace(/[^\d]/g, '');
  return clean ? `https://wa.me/${clean}` : null;
}

function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'pending', label: 'الطلب', icon: FileText },
    { key: 'confirmed', label: 'الموافقة', icon: CheckCircle2 },
    { key: 'paid', label: 'الدفع', icon: CreditCard },
    { key: 'in_use', label: 'الاستلام', icon: Truck },
    { key: 'completed', label: 'الإرجاع', icon: RefreshCw },
  ];
  const indexByStatus = {
    pending: 0,
    confirmed: 1,
    paid: 2,
    in_use: 3,
    return_done: 4,
    compensation_requested: 4,
    disputed: 4,
    completed: 4,
    cancelled: -1,
  };
  const currentIndex = indexByStatus[status] ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const done = status !== 'cancelled' && index <= currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex min-w-[48px] flex-col items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${done ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground'}`}>
                  <Icon size={19} />
                </div>
                <span className={`text-xs font-bold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${index < currentIndex && status !== 'cancelled' ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ContactPerson({ title, person, address }: { title: string; person: any; address?: string | null }) {
  const wa = whatsappUrl(person?.phone);

  return (
    <div className="rounded-xl bg-muted/40 p-4">
      <p className="mb-1 text-xs text-muted-foreground">{title}</p>
      <p className="font-bold">{person?.full_name ?? person?.name ?? '—'}</p>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <Phone size={15} className="text-primary" />
        <span>{person?.phone ?? 'لا يوجد رقم هاتف'}</span>
      </div>
      {wa && (
        <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-bold text-primary underline">
          تواصل عبر واتساب
        </a>
      )}
      <p className="mt-3 text-sm text-muted-foreground">{address ?? person?.governorate ?? '—'}</p>
    </div>
  );
}

function ContactCard({ rental }: { rental: any }) {
  if (!isPaidRental(rental)) return null;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <Phone size={18} className="text-primary" />
        بيانات التواصل والتسليم
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <ContactPerson title="المؤجر" person={rental.owner} address={rental.equipment?.address ?? rental.equipment?.governorate} />
        <ContactPerson title="المستأجر" person={rental.tenant} address={rental.delivery_location} />
      </div>
    </div>
  );
}

function PeopleCard({ rental, isOwner }: { rental: any; isOwner: boolean }) {
  const partner = isOwner ? rental.tenant : rental.owner;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <User size={18} className="text-primary" />
        {isOwner ? 'بيانات المستأجر' : 'بيانات المالك'}
      </h3>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-bold">
          {(partner?.full_name ?? partner?.name ?? '?').charAt(0)}
        </div>
        <div>
          <div className="font-bold">{partner?.full_name ?? partner?.name ?? '—'}</div>
          <div className="text-sm text-muted-foreground">{partner?.governorate ?? '—'}</div>
        </div>
        <div className="mr-auto flex items-center gap-1 font-bold text-yellow-500">
          <Star size={14} fill="currentColor" />
          <span>{Number(partner?.rating ?? 0).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default function RentalDetailsPage() {
  const { rental, auth } = usePage<any>().props;
  const user = auth?.user;
  const isOwner = Number(user?.id) === Number(rental.owner_id);
  const isTenant = Number(user?.id) === Number(rental.tenant_id);
  const meta = STATUS_META[rental.status] ?? { label: rental.status, tone: 'bg-gray-100 text-gray-700' };
  const paid = isPaidRental(rental);
  const image = primaryImage(rental.equipment);
  const backUrl = isOwner ? '/owner/requests' : '/dashboard';
  const preferredTime = TIME_SLOT_LABELS[rental.preferred_time_slot] ?? rental.delivery_time ?? '—';
  const canCancelBeforePayment = ['pending', 'confirmed'].includes(rental.status) && !paid && (isTenant || rental.status === 'confirmed');

  const postAction = (label: string, url: string, data: Record<string, any> = {}) => {
    if (!confirm(`هل أنت متأكد من ${label}؟`)) return;
    router.post(url, data, { preserveScroll: true });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20" dir="rtl">
      <div className="sticky top-0 z-10 border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={backUrl} className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowRight size={20} />
          </Link>
          <div className="text-center">
            <h1 className="font-bold text-lg">تفاصيل العملية #{rental.id}</h1>
            <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="container mx-auto max-w-5xl px-4 py-6">
        <StatusTimeline status={rental.status} />

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="relative aspect-video bg-muted">
                {image ? (
                  <img src={image} alt={rental.equipment?.name ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Package size={48} />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="mb-3 text-xl font-bold">{rental.equipment?.name ?? 'معدة غير معروفة'}</h2>
                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <p className="flex items-center gap-2"><MapPin size={16} /> {rental.delivery_location ?? '—'}</p>
                  <p className="flex items-center gap-2"><Clock size={16} /> {preferredTime}</p>
                  <p className="flex items-center gap-2"><Calendar size={16} /> {rental.start_date?.slice?.(0, 10) ?? rental.start_date} إلى {rental.end_date?.slice?.(0, 10) ?? rental.end_date}</p>
                  <p className="flex items-center gap-2"><Package size={16} /> {rental.duration_days} أيام</p>
                </div>
              </div>
            </div>

            <PeopleCard rental={rental} isOwner={isOwner} />
            <ContactCard rental={rental} />

            {rental.contract && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-bold">
                  <FileText size={18} className="text-primary" />
                  العقد الإلكتروني
                </h3>
                <div className="max-h-[560px] overflow-y-auto rounded-xl bg-muted/30 p-3">
                  <ContractBody body={rental.contract.contract_body} />
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1 text-success"><CheckCircle2 size={14} /> تم توقيع المستأجر</span>
                  {rental.contract.owner_signature === 'signed'
                    ? <span className="flex items-center gap-1 text-success"><CheckCircle2 size={14} /> تم توقيع المؤجر</span>
                    : <span className="flex items-center gap-1 text-muted-foreground"><Clock size={14} /> بانتظار توقيع المؤجر</span>}
                </div>
              </div>
            )}

          </section>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold">ملخص التكاليف</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">الإيجار</span>
                  <span className="font-bold">{formatCurrency(rental.rental_amount)} ر.ي</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">التأمين</span>
                  <span className="font-bold">{formatCurrency(rental.insurance_amount)} ر.ي</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-border pt-3 text-lg">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-bold text-primary">{formatCurrency(rental.total_amount)} ر.ي</span>
                </div>
              </div>
              <div className={`mt-4 rounded-xl p-3 text-sm font-bold ${paid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                {paid ? 'تم الدفع وحجز المبلغ في الضمان' : 'لم يكتمل الدفع بعد'}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold">الإجراءات المطلوبة</h3>
              <div className="space-y-3">
                {isTenant && rental.status === 'confirmed' && (
                  <Link href={`/rentals/${rental.id}/pay`} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white transition-colors hover:bg-primary/90">
                    <CreditCard size={18} />
                    إتمام الدفع
                  </Link>
                )}

                {isTenant && rental.status === 'paid' && (
                  <Link href="/dashboard/delivery" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white transition-colors hover:bg-primary/90">
                    <Truck size={18} />
                    بدء إجراءات الاستلام
                  </Link>
                )}

                {isOwner && rental.status === 'pending' && (
                  <>
                    <button type="button" onClick={() => postAction('الموافقة على الطلب', `/rentals/${rental.id}/confirm`)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-success font-bold text-white transition-colors hover:bg-success/90">
                      <CheckCircle2 size={18} />
                      موافقة وتوقيع العقد
                    </button>
                    <button type="button" onClick={() => postAction('رفض الطلب', `/rentals/${rental.id}/cancel`, { cancellation_reason: 'رفض المؤجر طلب التأجير' })} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger font-bold text-white transition-colors hover:bg-danger/90">
                      <AlertCircle size={18} />
                      رفض الطلب
                    </button>
                  </>
                )}

                {isOwner && rental.status === 'paid' && (
                  <Link href={`/owner/delivery?id=${rental.id}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white transition-colors hover:bg-primary/90">
                    <Package size={18} />
                    رفع محضر التسليم
                  </Link>
                )}

                {isOwner && rental.status === 'return_done' && (
                  <Link href={`/owner/delivery?id=${rental.id}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 font-bold text-white transition-colors hover:bg-orange-600">
                    <AlertCircle size={18} />
                    مراجعة الإرجاع أو التعويض
                  </Link>
                )}

                {canCancelBeforePayment && (
                  <button type="button" onClick={() => postAction('إلغاء العملية', `/rentals/${rental.id}/cancel`, { cancellation_reason: isOwner ? 'ألغى المؤجر العملية قبل الدفع' : 'ألغى المستأجر العملية قبل الدفع' })} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger font-bold text-danger transition-colors hover:bg-danger/5">
                    <AlertCircle size={18} />
                    إلغاء العملية
                  </button>
                )}

                {((isTenant && rental.status === 'pending') || (isOwner && rental.status === 'confirmed')) && (
                  <div className="flex flex-col items-center gap-2 rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                    <Clock size={24} />
                    بانتظار إجراء الطرف الآخر للمتابعة
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <Shield className="text-primary" size={24} />
              <div className="text-xs">
                <div className="font-bold text-primary">حماية منصة إيجار</div>
                <div className="text-muted-foreground">العقد والدفع محفوظان داخل العملية.</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
