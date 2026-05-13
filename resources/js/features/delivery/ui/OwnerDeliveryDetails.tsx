import React from 'react';
import { StatusBadge } from '../../../components/shared';
import { formatRentalDate } from '../../../utils/formatters';
import { STAGE_META, STATUS_META } from '../lib/deliveryConfig';
import { DeliveryStageForm } from './DeliveryStageForm';
import { OwnerCompensationCard } from './OwnerCompensationCard';
import { PostRentalRating } from './PostRentalRating';

export function OwnerDeliveryDetails({
  rental,
  stage,
  reports,
  disputes,
  compensation,
  formSpec,
  activeForm,
  activeCompensationForm,
  stageFeedback,
  onUpdateForm,
  onSubmitStage,
  onUpdateCompensationForm,
  onRequestCompensation,
  onSelectReport,
  onSubmitRating,
}) {
  const ownerReturnReport = reports.find((report) => report.phase === 'return' && report.submittedByRole === 'owner');

  return (
    <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-xl font-bold text-[#222222]">{rental.equipment.name}</h2>
          <p className="m-0 mt-1 text-sm text-[#888888]">
            {rental.orderNum} • {rental.partnerLabel}: {rental.partnerName}
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
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(rental.startDate)}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">تاريخ النهاية</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(rental.endDate)}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">موقع التسليم</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{rental.deliveryInfo?.address || rental.equipment.location}</p>
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
                  {report.phase === 'delivery' ? 'تقرير التسليم' : 'تقرير الإرجاع'}
                </span>
                <span className="text-[#888888]">{formatRentalDate(report.createdAt)}</span>
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

      {/* Owner Compensation */}
      {ownerReturnReport ? (
        <OwnerCompensationCard
          compensation={compensation}
          form={activeCompensationForm}
          onChange={onUpdateCompensationForm}
          onSubmit={onRequestCompensation}
        />
      ) : null}

      {/* Disputes Notice */}
      {disputes.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-[#F5B7B1] bg-[#FDEDEC] p-4 text-sm text-[#C0392B]">
          يوجد نزاع مفتوح على هذه العملية. تابع تفاصيله من نفس السجل عند ربط backend النزاعات.
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

      {/* Post-Rental Rating (shown after completion) */}
      {stage === 'completed' ? (
        <PostRentalRating
          rental={rental}
          onSubmit={({ rating, comment }) => onSubmitRating({ rental, rating, comment })}
          onSkip={() => {}}
        />
      ) : null}
    </div>
  );
}
