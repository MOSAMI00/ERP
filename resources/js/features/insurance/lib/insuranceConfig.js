export const INSURANCE_CONFIG = {
  tenant: {
    pageTitle: 'التأمينات',
    description: 'متابعة التأمين المحتجز والمسترد والخصومات النهائية لكل عملية',
    partnerColumnHeader: 'اسم المؤجر',
    amountColumnHeader: 'مبلغ التأمين',
    deductionColumnHeader: 'الخصم/الحالة',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'held', label: 'محتجز' },
      { id: 'released', label: 'تم خصم جزء' },
      { id: 'refunded', label: 'مسترد بالكامل' },
      { id: 'not_started', label: 'لم يبدأ' },
      { id: 'disputed', label: 'نزاع' },
    ],
    emptyTitle: 'لا توجد تأمينات بعد',
    emptyDescription: 'ستظهر هنا مبالغ التأمين عند إنشاء طلبات إيجار.',
  },
  owner: {
    pageTitle: 'إدارة التأمين',
    description: 'متابعة ضمانات المستأجرين ومبالغ الخصم والتسويات النهائية',
    partnerColumnHeader: 'اسم المستأجر',
    amountColumnHeader: 'مبلغ التأمين',
    deductionColumnHeader: 'خصم مطلوب',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'held', label: 'محتجز' },
      { id: 'released', label: 'تم خصم جزء' },
      { id: 'refunded', label: 'مسترد بالكامل' },
      { id: 'not_started', label: 'لم يبدأ' },
      { id: 'disputed', label: 'نزاع' },
    ],
    emptyTitle: 'لا توجد تأمينات حالياً',
    emptyDescription: 'ستظهر الضمانات عند قبول الطلبات وإتمام الدفع.',
  },
};

export const INSURANCE_STATUS_META = {
  held: { label: 'محتجز', color: '#3498DB', bg: 'rgba(52,152,219,0.12)' },
  released: { label: 'تم خصم جزء', color: '#B9770E', bg: 'rgba(185,119,14,0.12)' },
  refunded: { label: 'مسترد بالكامل', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  not_started: { label: 'لم يبدأ', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
  disputed: { label: 'نزاع', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
};

export function getInsuranceConfig(role) {
  return INSURANCE_CONFIG[role] || INSURANCE_CONFIG.tenant;
}
