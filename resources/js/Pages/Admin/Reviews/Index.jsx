import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import ReviewsPage from '@/Admin/features/reviews/ReviewsPage';

export default function ReviewsIndex() {
    return (
        <AdminLayout>
            <Head title="التقييمات" />
            <ReviewsPage />
        </AdminLayout>
    );
}
