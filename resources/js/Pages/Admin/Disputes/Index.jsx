import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import DisputesPage from '@/Admin/features/disputes/DisputesPage';

export default function DisputesIndex({ disputes, summary, filters }) {
    return (
        <AdminLayout>
            <Head title="النزاعات" />
            <DisputesPage disputes={disputes} summary={summary} filters={filters} />
        </AdminLayout>
    );
}
