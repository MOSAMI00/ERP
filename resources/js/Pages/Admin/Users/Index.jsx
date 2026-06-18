import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import UsersPage from '@/Admin/features/users/UsersPage';

export default function UsersIndex({ users, filters }) {
    return (
        <AdminLayout>
            <Head title="المستخدمون" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
                    <p className="text-sm text-gray-500">مشاهدة وإدارة كافة مستخدمي المنصة</p>
                </div>
                <UsersPage users={users} filters={filters} />
            </div>
        </AdminLayout>
    );
}
