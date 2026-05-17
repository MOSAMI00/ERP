import React from 'react';
import { router } from '@inertiajs/react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import { StatusBadge } from '../../../../components/shared';
import RequestDecisionActions from './RequestDecisionActions';
import {
  equipmentOf,
  tenantOf,
  UNKNOWN_EQUIPMENT,
  UNKNOWN_USER,
} from '../requestHelpers';
import { statusMap } from '@/utils/sharedStatus';

const toneColor = (tone: string) => ({
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  primary: '#2D5A27',
  neutral: '#95A5A6',
}[tone] ?? '#95A5A6');

const RequestCard = ({ rental, onOpenModal, rentalStatuses = [] }) => {
  const equipment = equipmentOf(rental);
  const tenant = tenantOf(rental);
  const sharedStatus = statusMap(rentalStatuses)[rental?.status];
  const status = {
    label: sharedStatus?.label ?? rental?.status,
    color: toneColor(sharedStatus?.tone ?? 'neutral'),
  };
  const completedCount = tenant.completedRentalsCount;
  const tenantRating = tenant.rating;

  const openRental = () => router.visit(`/rentals/${rental.id}`);

  return (
    <div
      className="owner-card"
      style={{ borderTop: `3px solid ${status.color}`, cursor: 'pointer' }}
      onClick={openRental}
    >
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
          {formatRentalDateRange(rental?.start_date ?? rental?.startDate ?? '', rental?.end_date ?? rental?.endDate ?? '')} | {rental?.duration_days ?? rental?.durationDays ?? '—'} أيام
        </p>
        <p className="text-muted mb-2" style={{ fontSize: 14 }}>{equipment.location ?? '—'}</p>
        <p style={{ fontSize: 14, margin: 0 }}>
          الإيجار: <strong>{formatCurrency(rental?.rental_amount ?? rental?.rentalAmount ?? 0)} ر.ي</strong> | التأمين: <strong>{formatCurrency(rental?.insurance_amount ?? rental?.insuranceAmount ?? 0)} ر.ي</strong>
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
      <div onClick={(event) => event.stopPropagation()}>
        <RequestDecisionActions rental={rental} onOpenModal={onOpenModal} />
      </div>
    </div>
  );
};

export default RequestCard;
