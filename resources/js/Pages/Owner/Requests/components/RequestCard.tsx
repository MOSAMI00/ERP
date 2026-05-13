import React from 'react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import { StatusBadge } from '../../../../components/shared';
import RequestDecisionActions from './RequestDecisionActions';
import {
  equipmentOf,
  statusConfig,
  tenantOf,
  UNKNOWN_EQUIPMENT,
  UNKNOWN_USER,
} from '../requestHelpers';

const RequestCard = ({ rental, onOpenModal }) => {
  const equipment = equipmentOf(rental);
  const tenant = tenantOf(rental);
  const status = statusConfig(rental?.status);
  const completedCount = tenant.completedRentalsCount;
  const tenantRating = tenant.rating;

  return (
    <div className="owner-card" style={{ borderTop: `3px solid ${status.color}` }}>
      <div className="flex-between mb-4">
        <div className="flex-center gap-4" style={{ justifyContent: 'flex-start' }}>
          {tenant.avatarUrl ? (
            <img src={tenant.avatarUrl} alt={tenant.name ?? ''} style={{ width: 48, height: 48, borderRadius: '50%' }} />
          ) : (
            <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-page-bg)', fontWeight: 700 }}>
              {(tenant.name ?? '?').charAt(0)}
            </div>
          )}
          <div>
            <h4 style={{ margin: '0 0 2px' }}>{tenant.name ?? UNKNOWN_USER}</h4>
            <span className="text-muted" style={{ fontSize: 13, direction: 'ltr', display: 'inline-block' }}>
              {tenant.phone ?? '—'}
            </span>
            {(tenantRating != null || completedCount != null) ? (
              <div className="flex-center gap-2 mt-2" style={{ justifyContent: 'flex-start' }}>
                {tenantRating != null ? <span className="text-muted" style={{ fontSize: 12 }}>{tenantRating}</span> : null}
                {tenantRating != null && completedCount != null ? <span className="text-muted" style={{ fontSize: 12 }}>|</span> : null}
                {completedCount != null ? <span className="text-muted" style={{ fontSize: 12 }}>{completedCount} عمليات سابقة</span> : null}
              </div>
            ) : null}
          </div>
        </div>
        <StatusBadge status={rental?.status} label={status.label} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />

      <div className="mb-4">
        <p style={{ fontWeight: 600, margin: '0 0 8px' }}>#{rental?.orderNum ?? '—'} · {equipment.name ?? UNKNOWN_EQUIPMENT}</p>
        <p className="text-muted mb-2" style={{ fontSize: 14 }}>
          {formatRentalDateRange(rental?.startDate ?? '', rental?.endDate ?? '')} | {rental?.durationDays ?? '—'} أيام
        </p>
        <p className="text-muted mb-2" style={{ fontSize: 14 }}>{equipment.location ?? '—'}</p>
        <p style={{ fontSize: 14, margin: 0 }}>
          الإيجار: <strong>{formatCurrency(rental?.rentalAmount ?? 0)} ر.ي</strong> | التأمين: <strong>{formatCurrency(rental?.insuranceAmount ?? 0)} ر.ي</strong>
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
      <RequestDecisionActions rental={rental} onOpenModal={onOpenModal} />
    </div>
  );
};

export default RequestCard;
