export const UNKNOWN_EQUIPMENT = 'معدة غير معروفة';
export const UNKNOWN_USER = 'مستخدم غير معروف';
export const UNKNOWN_STATUS = 'غير معروف';
export const equipmentOf = (rental) => {
  const equipment = rental?.equipment ?? {};
  return {
    ...equipment,
    location: equipment.location ?? equipment.governorate ?? equipment.address,
  };
};

export const tenantOf = (rental) => {
  const tenant = rental?.tenant ?? {};
  return {
    ...tenant,
    name: tenant.name ?? tenant.full_name,
    avatarUrl: tenant.avatarUrl ?? tenant.avatar,
  };
};
