export const adminsData = [
  { id: 1, name: 'أحمد علي', email: 'ahmed@email.com', role: 'Super Admin', roleColor: 'success' },
  { id: 2, name: 'سارة محمد', email: 'sara@email.com', role: 'Support', roleColor: 'info' },
  { id: 3, name: 'خالد عمر', email: 'khaled@email.com', role: 'Finance', roleColor: 'warning' },
];

export const permissionsData = [
  { action: 'إدارة المستخدمين', super: true, support: true, finance: false },
  { action: 'الإشراف المالي', super: true, support: false, finance: true },
  { action: 'إدارة النزاعات', super: true, support: true, finance: false },
  { action: 'Audit Log', super: true, support: false, finance: false },
  { action: 'إدارة المعدات', super: true, support: true, finance: false },
];

export const sessionsData = [
  { id: 1, device: 'Windows PC - Chrome', ip: '192.168.1.45', time: 'نشط الآن', current: true },
  { id: 2, device: 'iPhone 13 - Safari', ip: '10.0.0.12', time: 'آخر نشاط: قبل ساعتين', current: false },
  { id: 3, device: 'MacBook Pro - Safari', ip: '172.16.0.5', time: 'آخر نشاط: أمس 14:30', current: false },
];
