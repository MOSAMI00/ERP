import { STATUS_CONFIG } from '../../../entities/rental';

export const UNKNOWN_EQUIPMENT = 'معدة غير معروفة';
export const UNKNOWN_USER = 'مستخدم غير معروف';
export const UNKNOWN_STATUS = 'غير معروف';

export const requestTabDefinitions = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'بانتظار الموافقة' },
  { id: 'confirmed', label: 'مقبولة' },
  { id: 'in_use', label: 'قيد الاستخدام' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغية' },
];

export const statusConfig = (status) => (
  STATUS_CONFIG[status] ?? { label: status ?? UNKNOWN_STATUS, color: '#95A5A6' }
);

export const equipmentOf = (rental) => rental?.equipment ?? {};
export const tenantOf = (rental) => rental?.tenant ?? {};
