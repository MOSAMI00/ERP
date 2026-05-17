import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { PaymentMethods } from '../../../../features/cart/StepContent/PaymentMethods';
import { STATUS_CONFIG } from '../../../../entities/rental';
import { formatCurrency, formatRentalDate } from '../../../../utils/formatters';
import { Breadcrumb } from './components/Breadcrumb';
import { OrderInfoCard } from './components/OrderInfoCard';
import { RentalInfoCard } from './components/RentalInfoCard';
import { OrderTimeline } from './components/OrderTimeline';
import { ActionButtons } from './components/ActionButtons';
import { OrderSummary } from './components/OrderSummary';
import { EscrowStatus } from './components/EscrowStatus';
import { TenantLayout } from '../../../../Layouts/tenant/TenantLayout';

function buildTimeline(status) {
  const steps = [
    { key: 'order', label: 'الطلب' },
    { key: 'confirm', label: 'التأكيد' },
    { key: 'pay', label: 'الدفع' },
    { key: 'receive', label: 'الاستلام' },
    { key: 'use', label: 'الاستخدام' },
    { key: 'return', label: 'الإرجاع' },
  ];

  const activeByStatus = {
    pending: 'order',
    confirmed: 'receive',
    paid: 'receive',
    in_use: 'use',
    completed: 'return',
    cancelled: 'order',
    disputed: 'return',
  };
  const doneIndexByStatus = {
    pending: 0,
    confirmed: 2,
    paid: 2,
    in_use: 4,
    completed: 5,
    cancelled: 0,
    disputed: 4,
  };

  const activeKey = activeByStatus[status];
  const doneIndex = doneIndexByStatus[status];

  return steps.map((step, index) => ({
    ...step,
    done: index <= doneIndex || step.key === activeKey,
    active: status !== 'completed' && status !== 'cancelled' && step.key === activeKey,
  }));
}

function HandoverSummary({ reports }) {
  if (!reports || reports.length === 0) return null;

  const delivery = reports.find((report) => report.phase === 'delivery');
  const returnReport = reports.find((report) => report.phase === 'return');

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">ملخص التسليم</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">الاستلام</p>
          <p className="font-semibold text-[#222222]">
            {delivery ? `تم في ${formatRentalDate(delivery.created_at ?? delivery.createdAt)}` : 'لم يسجل بعد'}
          </p>
          {delivery?.condition_status && (
            <p className="text-xs text-[#888888] mt-1">الحالة: {delivery.condition_status}</p>
          )}
        </div>
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">الإرجاع</p>
          <p className="font-semibold text-[#222222]">
            {returnReport ? `تم في ${formatRentalDate(returnReport.created_at ?? returnReport.createdAt)}` : 'لم يسجل بعد'}
          </p>
          {returnReport && (
            <p className="text-xs text-[#888888] mt-1">
              {returnReport.has_damage ? 'يوجد تلفيات مسجلة' : 'لا توجد تلفيات'}
            </p>
          )}
        </div>
      </div>
      {reports.some((report) => report.notes) && (
        <p className="text-sm text-[#888888] mt-3">
          {reports.find((report) => report.notes)?.notes}
        </p>
      )}
    </div>
  );
}

function ContactInfoCard({ rental, isPaid }) {
  if (!isPaid) return null;

  const cleanPhone = (phone) => String(phone ?? '').replace(/[^\d]/g, '');
  const ownerPhone = rental.owner?.phone;
  const tenantPhone = rental.tenant?.phone;
  const ownerWhatsapp = ownerPhone ? `https://wa.me/${cleanPhone(ownerPhone)}` : null;
  const tenantWhatsapp = tenantPhone ? `https://wa.me/${cleanPhone(tenantPhone)}` : null;

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">بيانات التواصل والتسليم</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">المؤجر</p>
          <p className="font-semibold text-[#222222]">{rental.owner?.full_name ?? '—'}</p>
          <p className="text-sm text-[#555555] mt-1">{ownerPhone ?? 'لا يوجد رقم هاتف'}</p>
          {ownerWhatsapp && (
            <a className="text-sm font-bold text-[#2D5A27] underline" href={ownerWhatsapp} target="_blank" rel="noreferrer">
              تواصل عبر واتساب
            </a>
          )}
        </div>
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">المستأجر</p>
          <p className="font-semibold text-[#222222]">{rental.tenant?.full_name ?? '—'}</p>
          <p className="text-sm text-[#555555] mt-1">{tenantPhone ?? 'لا يوجد رقم هاتف'}</p>
          {tenantWhatsapp && (
            <a className="text-sm font-bold text-[#2D5A27] underline" href={tenantWhatsapp} target="_blank" rel="noreferrer">
              تواصل عبر واتساب
            </a>
          )}
        </div>
      </div>
      <div className="mt-3 text-sm text-[#555555] space-y-1">
        <p>عنوان المستأجر: {rental.delivery_location ?? '—'}</p>
        <p>عنوان المؤجر/المعدة: {rental.equipment?.address ?? rental.equipment?.governorate ?? '—'}</p>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { props } = usePage();
  const rental = props.rental ?? null;
  const reports = props.handover_reports ?? [];
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [agreeToContract, setAgreeToContract] = useState(false);

  const payForm = useForm({
    rental_op_id: rental?.id,
    payment_method: null,
  });

  if (!rental) {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 text-center">
          <h2 className="text-xl font-bold text-[#222222] mb-2">الطلب غير موجود</h2>
          <p className="text-sm text-[#888888] mb-5">لم نتمكن من العثور على طلب بهذا الرقم.</p>
          <Link href="/dashboard" className="inline-flex h-11 px-5 items-center justify-center rounded-xl bg-[#2D5A27] text-white font-bold">
            العودة إلى طلباتي
          </Link>
        </div>
      </div>
    );
  }

  const st = STATUS_CONFIG[rental.status] ?? { label: rental.status, color: '#888', bg: '#F2F3F4' };
  const hasPaidPayment = rental.payments?.some?.((payment) => {
    const status = typeof payment.status === 'object' ? payment.status?.value : payment.status;
    return status === 'paid';
  });
  const showPayForm = rental.status === 'confirmed' && !hasPaidPayment;
  const orderNum = rental.order_num ?? rental.orderNum;
  const durationDays = rental.duration_days ?? rental.durationDays;
  const rentalAmount = rental.rental_amount ?? rental.rentalAmount;
  const serviceFee = rental.service_fee ?? rental.serviceFee;
  const insuranceAmount = rental.insurance_amount ?? rental.insuranceAmount;
  const totalAmount = rental.total_amount ?? rental.totalAmount;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Breadcrumb id={orderNum} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-8 flex flex-col gap-5">
          <OrderInfoCard rental={rental} statusLabel={st.label} statusColor={st.color} statusBg={st.bg} />
          <RentalInfoCard rental={rental} />
          <ContactInfoCard rental={rental} isPaid={hasPaidPayment || ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status)} />
          <OrderTimeline steps={buildTimeline(rental.status)} />
          {showPayForm && (
            <div className="bg-white rounded-2xl border border-border p-5 md:p-6">
              <PaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={(method) => {
                  setPaymentMethod(method);
                  payForm.setData('payment_method', method);
                }}
                agreeToContract={agreeToContract}
                setAgreeToContract={setAgreeToContract}
                onBack={() => {}}
                payAfterLessorApproval
                hideBack
                processing={payForm.processing}
                onConfirm={() => {
                  if (!paymentMethod) return;
                  payForm.post('/payments', {
                    onSuccess: () => toast.success('تم الدفع وحفظ المبلغ في الضمان'),
                  });
                }}
              />
            </div>
          )}
          <HandoverSummary reports={reports} />
          <ActionButtons rental={rental} />
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <OrderSummary
              items={[
                { label: `الإيجار (${durationDays} أيام)`, value: formatCurrency(rentalAmount) },
                { label: 'رسوم الخدمة', value: formatCurrency(serviceFee) },
                { label: 'التأمين', value: formatCurrency(insuranceAmount) },
              ]}
              total={formatCurrency(totalAmount)}
            />
            <EscrowStatus rental={rental} />
          </div>
        </aside>
      </div>
    </div>
  );
}

OrderDetailPage.layout = (page) => <TenantLayout>{page}</TenantLayout>;
