export const RENTAL_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'بانتظار الموافقة' },
  { id: 'confirmed', label: 'مؤكدة' },
  { id: 'in_use', label: 'قيد الاستخدام' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغية' },
  { id: 'disputed', label: 'نزاعات' },
];

export const fallbackEquipment = (rental) => {
  const equipment = rental?.equipment ?? {};
  const primaryImage = equipment.images?.find?.((image) => image.is_primary)?.image_url ?? equipment.images?.[0]?.image_url ?? equipment.image;
  return {
    ...equipment,
    name: equipment.name ?? 'معدة غير معروفة',
    image: primaryImage ?? '',
    location: equipment.location ?? equipment.governorate ?? equipment.address ?? '—',
  };
};
export const fallbackTenant = (rental) => {
  const tenant = rental?.tenant ?? {};
  return { ...tenant, name: tenant.name ?? tenant.full_name ?? 'مستخدم غير معروف', phone: tenant.phone ?? '—' };
};

export const buildRentalTimeline = (rental) => (
  rental
    ? [
      { label: 'تم الحجز', done: true },
      { label: 'تأكيد المؤجر', done: !['pending', 'cancelled'].includes(rental.status) },
      { label: 'الدفع وحجز الضمان', done: (rental.payment_status ?? rental.paymentStatus) === 'paid' || ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status) },
      { label: 'تسليم المعدة', done: ['in_use', 'completed', 'disputed'].includes(rental.status) },
      { label: 'إرجاع المعدة', done: rental.status === 'completed' },
      { label: 'اكتمال العملية', done: rental.status === 'completed' },
    ]
    : []
);
