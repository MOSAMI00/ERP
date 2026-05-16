export const assetUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path.replace(/^\/+/, '')}`;
};

export const normalizeUser = (user) => {
    if (!user) return null;
    return {
        id: user.id,
        name: user.full_name || user.name || 'مستخدم',
        email: user.email,
        phone: user.phone || 'غير مسجل',
        avatar: assetUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.name || 'U')}&background=random`,
        type: user.type || 'tenant',
        gov: user.governorate || user.gov || 'غير محدد',
        status: user.status || 'active',
        kyc: !!user.kyc_status && user.kyc_status === 'approved',
        joined: user.created_at,
    };
};

export const asArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
};

export const paginator = (data) => {
    if (!data || !data.links) return null;
    return {
        links: data.links,
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
        path: data.path,
    };
};
