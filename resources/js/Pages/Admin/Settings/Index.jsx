import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import SettingsPage from '@/Admin/features/settings/SettingsPage';

export default function SettingsIndex({ settings }) {
    return (
        <AdminLayout>
            <Head title="الإعدادات" />
            <SettingsPage settings={settings} />
        </AdminLayout>
    );
}
