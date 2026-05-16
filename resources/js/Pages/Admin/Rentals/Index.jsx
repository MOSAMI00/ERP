import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import RentalsPage from '@/Admin/features/rentals/RentalsPage';

export default function RentalsIndex() {
    return (
        <AdminLayout>
            <Head title="عمليات التأجير" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">عمليات التأجير</h1>
                    <p className="text-sm text-gray-500">متابعة الطلبات والعقود والمدفوعات المرتبطة بها</p>
                </div>
                <RentalsPage />
            </div>
        </AdminLayout>
    );
}
