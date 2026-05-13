export const RENTAL_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'بانتظار الموافقة' },
  { id: 'confirmed', label: 'مؤكدة' },
  { id: 'in_use', label: 'قيد الاستخدام' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغية' },
  { id: 'disputed', label: 'نزاعات' },
];

export const fallbackEquipment = (rental) => rental?.equipment ?? { name: 'معدة غير معروفة', image: '', location: '—' };
export const fallbackTenant = (rental) => rental?.tenant ?? { name: 'مستخدم غير معروف', phone: '—' };

export const buildRentalTimeline = (rental) => (
  rental
    ? [
      { label: 'تم الحجز', done: true },
      { label: 'تأكيد المؤجر', done: !['pending', 'cancelled'].includes(rental.status) },
      { label: 'الدفع وحجز الضمان', done: rental.paymentStatus === 'paid' },
      { label: 'تسليم المعدة', done: ['in_use', 'completed', 'disputed'].includes(rental.status) },
      { label: 'إرجاع المعدة', done: rental.status === 'completed' },
      { label: 'اكتمال العملية', done: rental.status === 'completed' },
    ]
    : []
);
