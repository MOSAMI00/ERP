export const STATUS_CONFIG = {
  active:    { label: 'نشط', color: '#27AE60', bg: '#EAFAF1' },
  completed: { label: 'مكتمل', color: '#3498DB', bg: '#EBF5FB' },
  expired:   { label: 'منتهي', color: '#95A5A6', bg: '#F2F3F4' },
};

export const CONTRACTS = [
  { id: '1', contractNum: 'CT-2047', owner: 'محمد سالم', equipment: 'حفارة صغيرة', date: '05 فبراير 2025', amount: '120,000', status: 'active' },
  { id: '2', contractNum: 'CT-2048', owner: 'أحمد علي', equipment: 'مولد كهرباء', date: '01 فبراير 2025', amount: '45,000', status: 'active' },
  { id: '3', contractNum: 'CT-2041', owner: 'علي حسن', equipment: 'رافعة شوكية', date: '20 يناير 2025', amount: '200,000', status: 'completed' },
  { id: '4', contractNum: 'CT-2038', owner: 'خالد يوسف', equipment: 'كاميرا تصوير', date: '12 يناير 2025', amount: '15,000', status: 'completed' },
  { id: '5', contractNum: 'CT-2031', owner: 'عمر ناصر', equipment: 'ضاغط هواء', date: '05 يناير 2025', amount: '30,000', status: 'expired' },
  { id: '6', contractNum: 'CT-2028', owner: 'حسام فارس', equipment: 'خلاط خرسانة', date: '28 ديسمبر 2024', amount: '60,000', status: 'expired' },
];
