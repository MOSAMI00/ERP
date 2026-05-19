import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import FinancePage from '@/Admin/features/finance/FinancePage';

export default function PaymentsIndex({ payments, summary, filters }) {
    return (
        <AdminLayout>
            <Head title="الإشراف المالي" />
            <FinancePage payments={payments} summary={summary} filters={filters} />
        </AdminLayout>
    );
}
