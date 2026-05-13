import React from 'react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';

const RentalDetailsPanel = ({
  rental,
  equipment,
  tenant,
  handovers,
}) => (
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
      </div>
      <div>
        <span className="text-muted" style={{ fontSize: 12 }}>الهاتف</span>
        <p style={{ fontWeight: 600, margin: '2px 0', direction: 'ltr', textAlign: 'right' }}>
          {tenant?.phone ?? '—'}
        </p>
      </div>
      <div>
        <span className="text-muted" style={{ fontSize: 12 }}>الفترة</span>
        <p style={{ fontWeight: 600, margin: '2px 0', fontSize: 13 }}>
          {formatRentalDateRange(rental.startDate, rental.endDate)}
        </p>
      </div>
      <div>
        <span className="text-muted" style={{ fontSize: 12 }}>الدفع</span>
        <p style={{ fontWeight: 600, margin: '2px 0' }}>
          {rental.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}
        </p>
      </div>
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
    <div className="flex-between mb-2"><span className="text-muted">مبلغ الإيجار</span><span>{formatCurrency(rental.rentalAmount)} ر.ي</span></div>
    <div className="flex-between mb-2"><span className="text-muted">مبلغ التأمين</span><span>{formatCurrency(rental.insuranceAmount)} ر.ي</span></div>
    <div className="flex-between" style={{ fontWeight: 700 }}>
      <span>الإجمالي</span>
      <span style={{ color: 'var(--color-primary-green)' }}>{formatCurrency(rental.totalAmount)} ر.ي</span>
    </div>

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

export default RentalDetailsPanel;
