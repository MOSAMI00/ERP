import React from 'react';
import { AppButton } from '../../../components/shared';

export function DeliveryStageForm({ form, onChange, onSubmit, spec }) {
  const isReturn = spec.phase === 'return';

  return (
    <div className="mt-5 rounded-2xl border border-[#E0E0E0] bg-[#FBFCFD] p-4">
      <h3 className="m-0 text-base font-bold text-[#222222]">{spec.title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-[#222222]">
          {isReturn ? 'هل توجد تلفيات؟' : 'حالة المعدة'}
          <select
            value={isReturn ? form.hasDamage : form.conditionStatus}
            onChange={(event) => onChange(isReturn ? 'hasDamage' : 'conditionStatus', event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E0E0E0] bg-white px-3 text-sm focus:border-[#2D5A27] focus:outline-none"
          >
            {isReturn ? (
              <>
                <option value="false">لا توجد تلفيات</option>
                <option value="true">توجد تلفيات</option>
              </>
            ) : (
              <>
                <option value="excellent">ممتازة</option>
                <option value="good">جيدة</option>
                <option value="fair">متوسطة</option>
                <option value="damaged">تحتاج مراجعة</option>
              </>
            )}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#222222]">
          صور التوثيق
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onChange('evidencePhotos', Array.from(event.target.files || []).map((file) => file.name))}
            className="mt-2 block w-full rounded-xl border border-dashed border-[#C8D6C5] bg-white px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs font-normal text-[#888888]">
            {form.evidencePhotos.length > 0 ? `${form.evidencePhotos.length} صورة مختارة` : 'الصور مطلوبة لتوثيق المرحلة'}
          </span>
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-[#222222]">
        ملاحظات
        <textarea
          value={form.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          rows={3}
          placeholder="أضف ملاحظات عن حالة المعدة أو التسليم..."
          className="mt-2 w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
        />
      </label>

      <AppButton
        className="mt-4"
        disabled={form.evidencePhotos.length === 0}
        onClick={onSubmit}
      >
        {spec.submitLabel}
      </AppButton>
    </div>
  );
}
