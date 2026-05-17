import React from 'react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';

const RentalDetailsPanel = ({
  rental,
  equipment,
  tenant,
  owner,
  handovers,
}) => {
  const payments = rental.payments ?? [];
  const hasPaidPayment = payments.some?.((payment) => {
    const status = typeof payment.status === 'object' ? payment.status?.value : payment.status;
    return status === 'paid';
  });
  const isPaid = hasPaidPayment || ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status);
  const tenantPhone = tenant?.phone;
  const ownerPhone = owner?.phone;
  const whatsappLink = (phone?: string) => phone ? `https://wa.me/${String(phone).replace(/[^\d]/g, '')}` : null;

  return (
  <div className="owner-card">
    <h4 className="mb-4">معلومات العملية</h4>
    <div className="flex-center gap-4 mb-6" style={{ justifyContent: 'flex-start' }}>
      {equipment.image ? (
        <img src={equipment.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
      ) : (
        <div className="flex-center" style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: 'var(--color-page-bg)', color: 'var(--color-text-muted)' }}>
          —
        </div>
      )}
      <div>
        <h5 style={{ margin: '0 0 4px' }}>{equipment.name}</h5>
        <p className="text-muted mb-0" style={{ fontSize: 13 }}>الموقع: {equipment.location}</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
      <div>
        <span className="text-muted" style={{ fontSize: 12 }}>المستأجر</span>
        <p style={{ fontWeight: 600, margin: '2px 0' }}>{tenant?.name ?? 'مستخدم غير معروف'}</p>
        <p className="text-muted" style={{ fontSize: 12, margin: '2px 0' }}>⭐ {Number(tenant?.rating ?? 0).toFixed(1)}</p>
      </div>
      <div>
        <span className="text-muted" style={{ fontSize: 12 }}>الفترة</span>
        <p style={{ fontWeight: 600, margin: '2px 0', fontSize: 13 }}>
          {formatRentalDateRange(rental.start_date ?? rental.startDate, rental.end_date ?? rental.endDate)}
        </p>
      </div>
      <div>
        <span className="text-muted" style={{ fontSize: 12 }}>الدفع</span>
        <p style={{ fontWeight: 600, margin: '2px 0' }}>
          {(rental.payment_status ?? rental.paymentStatus) === 'paid' || ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status) ? 'مدفوع' : 'غير مدفوع'}
        </p>
      </div>
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
    <div className="flex-between mb-2"><span className="text-muted">مبلغ الإيجار</span><span>{formatCurrency(rental.rental_amount ?? rental.rentalAmount)} ر.ي</span></div>
    <div className="flex-between mb-2"><span className="text-muted">مبلغ التأمين</span><span>{formatCurrency(rental.insurance_amount ?? rental.insuranceAmount)} ر.ي</span></div>
    <div className="flex-between" style={{ fontWeight: 700 }}>
      <span>الإجمالي</span>
      <span style={{ color: 'var(--color-primary-green)' }}>{formatCurrency(rental.total_amount ?? rental.totalAmount)} ر.ي</span>
    </div>

    {isPaid && (
      <>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
        <h5 className="mb-3">بيانات التواصل والتسليم</h5>
        <div className="owner-card" style={{ boxShadow: 'none', backgroundColor: 'var(--color-page-bg)', marginBottom: 8 }}>
          <div className="mb-3">
            <span className="text-muted" style={{ fontSize: 12 }}>المستأجر</span>
            <p style={{ margin: '2px 0', fontWeight: 700 }}>{tenant?.name ?? tenant?.full_name ?? '—'}</p>
            <p style={{ margin: '2px 0' }}>{tenantPhone ?? 'لا يوجد رقم هاتف'}</p>
            {whatsappLink(tenantPhone) && (
              <a href={whatsappLink(tenantPhone) ?? '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary-green)', fontWeight: 700 }}>
                تواصل عبر واتساب
              </a>
            )}
          </div>
          <div className="mb-3">
            <span className="text-muted" style={{ fontSize: 12 }}>المؤجر</span>
            <p style={{ margin: '2px 0', fontWeight: 700 }}>{owner?.full_name ?? owner?.name ?? '—'}</p>
            <p style={{ margin: '2px 0' }}>{ownerPhone ?? 'لا يوجد رقم هاتف'}</p>
            {whatsappLink(ownerPhone) && (
              <a href={whatsappLink(ownerPhone) ?? '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary-green)', fontWeight: 700 }}>
                تواصل عبر واتساب
              </a>
            )}
          </div>
          <p className="text-muted mb-1" style={{ fontSize: 12 }}>عنوان المستأجر: {rental.delivery_location ?? rental.deliveryLocation ?? '—'}</p>
          <p className="text-muted mb-0" style={{ fontSize: 12 }}>عنوان المؤجر/المعدة: {equipment.address ?? equipment.location ?? '—'}</p>
        </div>
      </>
    )}

    {handovers.length > 0 && (
      <>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
        <h5 className="mb-3">تقارير التسليم</h5>
        {handovers.map((handover) => (
          <div key={handover.id} className="owner-card" style={{ boxShadow: 'none', backgroundColor: 'var(--color-page-bg)', marginBottom: 8 }}>
            <div className="flex-between mb-1">
              <span style={{ fontWeight: 600, fontSize: 13 }}>
                {handover.phase === 'delivery' ? 'تسليم' : 'إرجاع'}
              </span>
              <span className={`badge ${handover.confirmedAt ? 'badge-completed' : 'badge-pending'}`} style={{ fontSize: 11 }}>
                {handover.confirmedAt ? 'مؤكد' : 'بانتظار تأكيدك'}
              </span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: 12 }}>
              الحالة: {handover.conditionStatus ?? '—'} | أضرار: {handover.hasDamage ? 'نعم' : 'لا'}
            </p>
          </div>
        ))}
      </>
    )}
  </div>
  );
};

export default RentalDetailsPanel;
