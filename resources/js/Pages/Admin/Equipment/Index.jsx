import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import EquipmentPage from '@/Admin/features/equipment/EquipmentPage';

export default function EquipmentIndex({ equipment, filters }) {
    return (
        <AdminLayout>
            <Head title="المعدات" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المعدات</h1>
                    <p className="text-sm text-gray-500">عرض معدات المنصة وحالاتها وعملياتها</p>
                </div>
                <EquipmentPage equipment={equipment} filters={filters} />
            </div>
        </AdminLayout>
    );
}
