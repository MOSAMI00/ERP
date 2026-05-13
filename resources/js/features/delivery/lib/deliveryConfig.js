export const DELIVERY_CONFIG = {
  tenant: {
    pageTitle: 'التسليم والإرجاع',
    description: 'متابعة عمليات الاستلام والإرجاع والنزاعات من واجهة موحدة.',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'delivery', label: 'بانتظار التسليم' },
      { id: 'handover', label: 'قيد التسليم' },
      { id: 'in_use', label: 'قيد الاستخدام' },
      { id: 'return', label: 'بانتظار الإرجاع' },
      { id: 'disputes', label: 'النزاعات' },
    ],
    containerClassName: 'p-4 md:p-6 pb-24 md:pb-6',
  },
  owner: {
    pageTitle: 'التسليم والإرجاع',
    description: 'متابعة عمليات التسليم والإرجاع والنزاعات من واجهة موحدة.',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'delivery', label: 'بانتظار التسليم' },
      { id: 'handover', label: 'قيد التسليم' },
      { id: 'in_use', label: 'قيد الاستخدام' },
      { id: 'return', label: 'بانتظار الإرجاع' },
      { id: 'disputes', label: 'النزاعات' },
    ],
    containerClassName: 'p-4 md:p-6 pb-24 md:pb-6',
  },
};

export function getDeliveryConfig(role) {
  return DELIVERY_CONFIG[role] || DELIVERY_CONFIG.tenant;
}

export const STAGE_META = {
  delivery: { label: 'بانتظار التسليم', status: 'confirmed' },
  handover: { label: 'قيد التسليم', status: 'confirmed' },
  in_use: { label: 'قيد الاستخدام', status: 'in_use' },
  return: { label: 'بانتظار الإرجاع', status: 'in_use' },
  disputes: { label: 'نزاع مفتوح', status: 'disputed' },
  completed: { label: 'مكتمل', status: 'completed' },
};

export const STATUS_META = {
  confirmed: { label: 'بانتظار التسليم', color: '#2D5A27', bg: '#EAF3E9' },
  in_use: { label: 'قيد الاستخدام', color: '#E67E22', bg: 'rgba(230,126,34,0.12)' },
  disputed: { label: 'نزاع مفتوح', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
};

