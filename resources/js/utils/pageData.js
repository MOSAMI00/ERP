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

const enumValue = (value, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'object' && value.value) return value.value;
    return value;
};

const dateText = (value) => {
    if (!value) return '';
    return String(value).slice(0, 10);
};

const statusLabel = (status, labels = {}) => {
    const value = enumValue(status);
    return labels[value] || value || 'غير محدد';
};

const statusColor = (status, map = {}) => {
    const value = enumValue(status);
    return map[value] || 'info';
};

export const normalizePayment = (payment) => {
    if (!payment) return null;
    return {
        ...payment,
        type: enumValue(payment.type),
        status: enumValue(payment.status),
        escrow_status: enumValue(payment.escrow_status),
        payer: payment.payer ? normalizeUser(payment.payer) : null,
        amount: Number(payment.amount ?? 0),
        platform_fee: Number(payment.platform_fee ?? 0),
    };
};

export const normalizeReview = (review) => {
    if (!review) return null;
    return {
        ...review,
        status: enumValue(review.status, 'visible'),
        reviewer: review.reviewer ? normalizeUser(review.reviewer) : { name: 'مستخدم', type: 'tenant' },
        rating: Number(review.rating ?? 0),
        text: review.comment || review.review_text || review.text || '',
    };
};

export const normalizeRental = (rental) => {
    if (!rental) return null;
    const status = enumValue(rental.status);
    const rentalAmount = Number(rental.rental_amount ?? 0);
    const insurance = Number(rental.insurance_amount ?? 0);
    const total = Number(rental.total_amount ?? rentalAmount + insurance);

    return {
        ...rental,
        id: `OP-${String(rental.id).padStart(4, '0')}`,
        rawId: rental.id,
        tenant: rental.tenant?.full_name || rental.tenant?.name || 'مستأجر',
        owner: rental.owner?.full_name || rental.owner?.name || 'مؤجر',
        eq: rental.equipment?.name || 'معدة',
        duration: `${rental.duration_days ?? 0} يوم`,
        total,
        insurance,
        escrow: Number(rental.payments?.find?.((payment) => enumValue(payment.escrow_status) === 'held')?.amount ?? total),
        status,
        statusLabel: statusLabel(status, {
            pending: 'قيد المراجعة',
            confirmed: 'بانتظار الدفع',
            paid: 'مدفوع',
            in_use: 'قيد الاستخدام',
            return_done: 'تم الإرجاع',
            compensation_requested: 'تعويض مطلوب',
            completed: 'مكتمل',
            cancelled: 'ملغي',
            disputed: 'نزاع',
        }),
        statusColor: statusColor(status, {
            pending: 'warning',
            confirmed: 'info',
            paid: 'success',
            in_use: 'primary',
            return_done: 'info',
            compensation_requested: 'warning',
            completed: 'success',
            cancelled: 'danger',
            disputed: 'danger',
        }),
        startDate: dateText(rental.start_date),
        endDate: dateText(rental.end_date),
    };
};

export const normalizeDispute = (dispute) => {
    if (!dispute) return null;
    const status = enumValue(dispute.status, 'open');

    return {
        ...dispute,
        id: dispute.id,
        status,
        statusLabel: statusLabel(status, {
            open: 'مفتوحة',
            under_review: 'قيد المراجعة',
            resolved: 'محلولة',
        }),
        requestedAmount: Number(dispute.requested_amount ?? dispute.requested_compensation ?? dispute.final_compensation ?? 0),
        finalCompensation: Number(dispute.final_compensation ?? 0),
        rental: dispute.rental ? {
            ...dispute.rental,
            tenant: dispute.rental.tenant ? normalizeUser(dispute.rental.tenant) : null,
            owner: dispute.rental.owner ? normalizeUser(dispute.rental.owner) : null,
        } : null,
    };
};

export const normalizeEquipment = (equipment) => {
    if (!equipment) return null;
    const status = enumValue(equipment.status, 'active');
    const images = asArray(equipment.images)
        .map((image) => assetUrl(image.image_url || image.url || image))
        .filter(Boolean);

    return {
        ...equipment,
        images: images.length ? images : ['https://placehold.co/800x500/f4f6f9/888?text=Equipment'],
        name: equipment.name || 'معدة',
        desc: equipment.description || 'لا يوجد وصف مسجل لهذه المعدة.',
        category: equipment.category?.name_ar || equipment.category?.name || 'غير مصنف',
        location: equipment.governorate || equipment.location || 'غير محدد',
        owner: equipment.owner?.full_name || equipment.owner?.name || 'مؤجر',
        price: Number(equipment.price_per_day ?? equipment.price ?? 0),
        insurance: Number(equipment.insurance_amount ?? equipment.insurance ?? 0),
        rentCount: Number(equipment.rentals_count ?? equipment.rent_count ?? 0),
        status,
        statusLabel: statusLabel(status, {
            active: 'نشطة',
            hidden: 'مخفية',
            deleted: 'محذوفة',
        }),
        statusColor: statusColor(status, {
            active: 'success',
            hidden: 'warning',
            deleted: 'danger',
        }),
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
