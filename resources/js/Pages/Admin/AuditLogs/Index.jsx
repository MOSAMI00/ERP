import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import AuditLogPage from '@/Admin/features/auditlog/AuditLogPage';

export default function AuditLogsIndex() {
    return (
        <AdminLayout>
            <Head title="سجل العمليات" />
            <AuditLogPage />
        </AdminLayout>
    );
}
