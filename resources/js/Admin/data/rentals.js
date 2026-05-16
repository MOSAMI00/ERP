export const rentalsTabs = [
  { id: 'all', label: 'الكل', count: 1240 },
  { id: 'pending', label: 'قيد المراجعة', count: 45 },
  { id: 'confirmed', label: 'بانتظار الدفع', count: 89 },
  { id: 'paid', label: 'مدفوع', count: 0 },
  { id: 'in_use', label: 'قيد الاستخدام', count: 230 },
  { id: 'completed', label: 'مكتمل', count: 850 },
  { id: 'cancelled', label: 'ملغي', count: 18 },
  { id: 'disputed', label: 'نزاع', count: 8 },
];

export const rentalsData = [
  { id: 'OP-2024-0847', tenant: 'أحمد محمد', owner: 'مؤسسة التقنية', eq: 'حفار صغير JCB', duration: '3 أيام', total: 45000, status: 'In Use', statusColor: 'warning', startDate: '2024-05-15', endDate: '2024-05-18', insurance: 50000, escrow: 95000 },
  { id: 'OP-2024-0846', tenant: 'ياسر علي', owner: 'شركة البناء', eq: 'رافعة شوكية 3 طن', duration: '1 يوم', total: 20000, status: 'Completed', statusColor: 'success', startDate: '2024-05-10', endDate: '2024-05-11', insurance: 100000, escrow: 0 },
  { id: 'OP-2024-0845', tenant: 'خالد عبدلله', owner: 'أحمد محمد', eq: 'مولد كهربائي 50KVA', duration: '5 أيام', total: 50000, status: 'Pending', statusColor: 'pending', startDate: '2024-05-20', endDate: '2024-05-25', insurance: 30000, escrow: 80000 },
  { id: 'OP-2024-0844', tenant: 'سالم سعيد', owner: 'شركة الإعمار', eq: 'خلاطة إسمنت مركزية', duration: '10 أيام', total: 350000, status: 'Disputed', statusColor: 'danger', startDate: '2024-05-01', endDate: '2024-05-10', insurance: 150000, escrow: 500000 },
  { id: 'OP-2024-0843', tenant: 'مؤسسة السلام', owner: 'علي صالح', eq: 'حفار صغير JCB', duration: '2 أيام', total: 30000, status: 'Confirmed', statusColor: 'info', startDate: '2024-05-16', endDate: '2024-05-18', insurance: 50000, escrow: 80000 },
];
