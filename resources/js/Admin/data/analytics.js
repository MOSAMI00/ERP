export const govData = [
  { name: 'صنعاء', value: 850 },
  { name: 'عدن', value: 420 },
  { name: 'تعز', value: 310 },
  { name: 'حضرموت', value: 280 },
  { name: 'إب', value: 150 },
  { name: 'الحديدة', value: 120 },
];

export const profitData = [
  { name: 'يناير', value: 1200000 },
  { name: 'فبراير', value: 1800000 },
  { name: 'مارس', value: 1500000 },
  { name: 'أبريل', value: 2200000 },
  { name: 'مايو', value: 2800000 },
  { name: 'يونيو', value: 3500000 },
];

export const compareData = [
  { name: 'يناير', completed: 85, cancelled: 15 },
  { name: 'فبراير', completed: 90, cancelled: 10 },
  { name: 'مارس', completed: 82, cancelled: 18 },
  { name: 'أبريل', completed: 92, cancelled: 8 },
  { name: 'مايو', completed: 95, cancelled: 5 },
];

export const topOwnersData = [
  { name: 'شركة البناء', value: 145 },
  { name: 'مؤسسة التقنية', value: 120 },
  { name: 'أحمد محمد', value: 85 },
  { name: 'معدات اليمن', value: 64 },
  { name: 'علي صالح', value: 42 },
];

export const disputeRate = 3.2; 

export const gaugeData = [
  { name: 'Disputes', value: disputeRate, color: disputeRate > 5 ? '#E74C3C' : '#27AE60' },
  { name: 'Safe', value: 100 - disputeRate, color: '#F4F6F9' }
];
