export const SETTINGS_CONFIG = {
  tenant: {
    pageTitle: 'الإعدادات',
    tabs: [
      { id: 'profile', name: 'الملف الشخصي', iconName: 'User' },
      { id: 'security', name: 'الأمان وكلمة المرور', iconName: 'Shield' },
      { id: 'kyc', name: 'التحقق من الهوية KYC', iconName: 'CreditCard' },
    ]
  },
  owner: {
    pageTitle: 'الإعدادات',
    tabs: [
      { id: 'profile', name: 'الملف الشخصي', iconName: 'User' },
      { id: 'security', name: 'الأمان وكلمة المرور', iconName: 'Shield' },
      { id: 'kyc', name: 'التحقق من الهوية KYC', iconName: 'CreditCard' },
    ]
  }
};

export function getSettingsConfig(role) {
  return SETTINGS_CONFIG[role] || SETTINGS_CONFIG.tenant;
}
