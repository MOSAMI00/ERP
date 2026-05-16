import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import DisputesPage from '@/Admin/features/disputes/DisputesPage';

export default function DisputesIndex() {
    return (
        <AdminLayout>
            <Head title="النزاعات" />
            <DisputesPage />
        </AdminLayout>
    );
}
