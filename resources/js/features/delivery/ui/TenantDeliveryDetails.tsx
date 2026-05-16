import React from 'react';
import { StatusBadge } from '../../../components/shared';
import { formatCurrency, formatRentalDate } from '../../../utils/formatters';
import { STAGE_META, STATUS_META } from '../lib/deliveryConfig';
import { DeliveryStageForm } from './DeliveryStageForm';
import { CompensationResponseCard } from './CompensationResponseCard';
import { PostRentalRating } from './PostRentalRating';

const ROLE_LABELS = {
  owner: 'المؤجر',
  tenant: 'المستأجر',
};

const CONDITION_LABELS = {
  excellent: 'ممتازة',
  good: 'جيدة',
  fair: 'متوسطة',
  damaged: 'تحتاج مراجعة',
  partially_damaged: 'تلفيات جزئية',
};

export function TenantDeliveryDetails({
  rental,
  stage,
  reports,
  disputes,
  compensation,
  formSpec,
  activeForm,
  stageFeedback,
  onUpdateForm,
  onSubmitStage,
  onRespondCompensation,
  onOpenCompensationDispute,
  onSelectReport,
  onSubmitRating,
  hasReview,
}) {
  const totalAmount = rental.totalAmount ?? rental.total_amount ?? rental.total ?? 0;
  const insuranceAmount = rental.insuranceAmount ?? rental.insurance_amount ?? rental.insurance ?? 0;

  return (
    <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-xl font-bold text-[#222222]">{rental.equipment.name}</h2>
          <p className="m-0 mt-1 text-sm text-[#888888]">
            العملية {rental.orderNum} مع {rental.partnerLabel} {rental.partnerName}
          </p>
          <p className="m-0 mt-1 text-xs text-[#888888]">
            حالة الطلب الأصلية: {rental.statusLabel ?? rental.status}
          </p>
        </div>
        <StatusBadge
          status={STAGE_META[stage]?.status}
          meta={{
            ...STATUS_META[STAGE_META[stage]?.status],
            label: STAGE_META[stage]?.label,
          }}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">تاريخ البداية</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(rental.start_date)}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">تاريخ النهاية</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(rental.end_date)}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">موقع التسليم</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{rental.delivery_location || [rental.equipment?.governorate, rental.equipment?.address].filter(Boolean).join(' - ') || '—'}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">قيمة العملية</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatCurrency(totalAmount)} ر.ي</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">مبلغ التأمين</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatCurrency(insuranceAmount)} ر.ي</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">عدد المحاضر</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{reports.length} محضر</p>
        </div>
      </div>

      {/* Reports Log */}
      <div className="mt-5 rounded-2xl border border-[#E8ECEF] p-4">
        <h3 className="m-0 mb-3 text-base font-bold text-[#222222]">سجل التسليم والإرجاع</h3>
        {reports.length > 0 ? (
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => onSelectReport(report)}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-3 text-right text-sm transition-colors hover:bg-[#EEF3F0]"
              >
                <span className="font-semibold text-[#222222]">
                  {report.phase === 'delivery' ? 'محضر التسليم' : 'محضر الإرجاع'}
                  {' '}
                  - {ROLE_LABELS[report.submitted_by_role ?? report.submittedByRole] ?? 'طرف العملية'}
                </span>
                <span className="text-[#888888]">
                  {CONDITION_LABELS[report.condition_status ?? report.conditionStatus] ?? 'حالة غير محددة'} • {formatRentalDate(report.created_at)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="m-0 text-sm text-[#888888]">لا توجد تقارير موثقة بعد.</p>
        )}
      </div>

      {/* Stage Feedback */}
      <div className="mt-4 rounded-2xl border border-[#DDE8DA] bg-[#F5FAF4] p-4 text-sm leading-7 text-[#2D5A27]">
        {stageFeedback}
      </div>

      {/* Tenant Compensation Response */}
      {compensation ? (
        <div className="mt-4">
          <CompensationResponseCard
            compensation={compensation}
            onAccept={() => onRespondCompensation(compensation.id, 'accepted')}
            onReject={() => onRespondCompensation(compensation.id, 'rejected')}
            onOpenDispute={(claim, amount) => onOpenCompensationDispute(compensation.id, claim, amount)}
          />
        </div>
      ) : null}


      {/* Stage Form or Idle */}
      {formSpec ? (
        <DeliveryStageForm
          form={activeForm}
          spec={formSpec}
          onChange={onUpdateForm}
          onSubmit={onSubmitStage}
        />
      ) : (
        stage !== 'completed' && (
          <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#888888]">
            لا يوجد إجراء مطلوب منك في هذه المرحلة.
          </div>
        )
      )}

      {/* Post-Rental Rating (shown after completion if not reviewed) */}
      {stage === 'completed' && !hasReview ? (
        <PostRentalRating
          rental={rental}
          onSubmit={({ rating, comment }) => onSubmitRating({ rental, rating, comment })}
          onSkip={() => {}}
        />
      ) : null}
    </div>
  );
}
