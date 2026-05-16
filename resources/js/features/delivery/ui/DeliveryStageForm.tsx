import React from 'react';
import { AppButton } from '../../../components/shared';

export function DeliveryStageForm({ form, onChange, onSubmit, spec }) {
  const isReturn = spec.phase === 'return';
  const isOwner = spec.submitter === 'owner';

  return (
    <div className="mt-5 rounded-2xl border border-[#E0E0E0] bg-[#FBFCFD] p-4">
      <h3 className="m-0 text-base font-bold text-[#222222]">{spec.title}</h3>
      <p className="m-0 mt-2 text-sm leading-6 text-[#666666]">
        {isReturn
          ? isOwner
            ? 'راجع حالة المعدة عند عودتها وسجل ملاحظاتك كما هي ظاهرة في الصور. هذا المحضر سيستخدم عند طلب تعويض.'
            : 'وثق حالة المعدة قبل تسليمها للمؤجر، خصوصاً أي ملاحظات حدثت أثناء الاستخدام أو كانت موجودة سابقاً.'
          : isOwner
            ? 'سجل حالة المعدة قبل تسليمها للمستأجر. الصور والملاحظات هنا هي خط الأساس عند الإرجاع.'
            : 'راجع تقرير المؤجر وأضف تأكيدك بالصور إذا كانت المعدة مطابقة للحالة المستلمة.'}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-[#222222]">
          {isReturn ? 'نتيجة فحص الإرجاع' : 'حالة المعدة وقت التسليم'}
          <select
            value={isReturn ? form.conditionStatus : form.conditionStatus}
            onChange={(event) => {
              onChange('conditionStatus', event.target.value);
              if (isReturn) onChange('hasDamage', event.target.value === 'good' || event.target.value === 'excellent' ? 'false' : 'true');
            }}
            className="mt-2 h-11 w-full rounded-xl border border-[#E0E0E0] bg-white px-3 text-sm focus:border-[#2D5A27] focus:outline-none"
          >
            <option value="excellent">ممتازة ولا توجد ملاحظات</option>
            <option value="good">جيدة مع آثار استخدام عادية</option>
            <option value="fair">متوسطة وتحتاج متابعة</option>
            <option value="partially_damaged">تلفيات جزئية</option>
            <option value="damaged">متضررة وتحتاج مراجعة</option>
          </select>
        </label>

        <label className="text-sm font-semibold text-[#222222]">
          صور التوثيق
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onChange('evidencePhotos', Array.from(event.target.files || []))}
            className="mt-2 block w-full rounded-xl border border-dashed border-[#C8D6C5] bg-white px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs font-normal text-[#888888]">
            {form.evidencePhotos.length > 0 ? `${form.evidencePhotos.length} صورة مختارة` : 'أرفق صوراً واضحة للعداد، الهيكل، وأي ملاحظات ظاهرة'}
          </span>
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-[#222222]">
        ملاحظات
        <textarea
          value={form.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          rows={3}
          placeholder={isReturn ? 'اكتب ما تم فحصه عند الإرجاع، وأي تلف أو نقص في الملحقات...' : 'اكتب حالة المعدة عند التسليم، الملحقات المرفقة، وأي خدوش أو ملاحظات سابقة...'}
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
