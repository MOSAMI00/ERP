const REVIEWS_CONFIG = {
  tenant: {
    pageTitle: 'التقييمات',
    tabs: ['مستلمة', 'مرسلة', 'بانتظار التقييم'],
    emptyStateIcon: '⭐',
    emptyStateTitle: 'لا توجد تقييمات',
    emptyStateDesc: 'لم يتم العثور على تقييمات في هذا التبويب.',
    canSubmit: true,
  },
  owner: {
    pageTitle: 'تقييماتي',
    tabs: ['مستلمة', 'مرسلة', 'بانتظار التقييم'],
    emptyStateIcon: '⭐',
    emptyStateTitle: 'لا توجد تقييمات',
    emptyStateDesc: 'لم تستلم أي تقييمات حتى الآن.',
    canSubmit: true,
  }
};

export function getReviewsConfig(role) {
  return REVIEWS_CONFIG[role] || REVIEWS_CONFIG.tenant;
}
