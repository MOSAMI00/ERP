export const INSURANCE_CONFIG = {
  tenant: {
    pageTitle: 'التأمينات',
    description: 'متابعة مبالغ التأمين والضمان الخاصة بطلباتك',
    partnerColumnHeader: 'اسم المؤجر',
    amountColumnHeader: 'مبلغ التأمين',
    deductionColumnHeader: 'الخصم/الحالة',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'held', label: 'محتجز' },
      { id: 'released', label: 'مسترد' },
      { id: 'refunded', label: 'مردود' },
      { id: 'not_started', label: 'لم يبدأ' },
      { id: 'disputed', label: 'نزاع' },
    ],
    emptyTitle: 'لا توجد تأمينات بعد',
    emptyDescription: 'ستظهر هنا مبالغ التأمين عند إنشاء طلبات إيجار.',
  },
  owner: {
    pageTitle: 'إدارة التأمين',
    description: 'متابعة الضمانات المحتجزة والمستردة وحالات النزاع',
    partnerColumnHeader: 'اسم المستأجر',
    amountColumnHeader: 'مبلغ التأمين',
    deductionColumnHeader: 'خصم مطلوب',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'held', label: 'محتجز' },
      { id: 'released', label: 'مسترد' },
      { id: 'refunded', label: 'مردود' },
      { id: 'not_started', label: 'لم يبدأ' },
      { id: 'disputed', label: 'نزاع' },
    ],
    emptyTitle: 'لا توجد تأمينات حالياً',
    emptyDescription: 'ستظهر الضمانات عند قبول الطلبات وإتمام الدفع.',
  },
};

export const INSURANCE_STATUS_META = {
  held: { label: 'محتجز', color: '#3498DB', bg: 'rgba(52,152,219,0.12)' },
  released: { label: 'مسترد', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  refunded: { label: 'مردود', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
  not_started: { label: 'لم يبدأ', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
  disputed: { label: 'نزاع', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
};

export function getInsuranceConfig(role) {
  return INSURANCE_CONFIG[role] || INSURANCE_CONFIG.tenant;
}
