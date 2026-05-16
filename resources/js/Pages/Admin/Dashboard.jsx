import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import OverviewPage from '@/Admin/features/overview/OverviewPage';

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <Head title="لوحة التحكم" />
            <OverviewPage />
        </AdminLayout>
    );
}
