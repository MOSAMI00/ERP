import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Admin/components/layout/AdminLayout';
import AuditLogPage from '@/Admin/features/auditlog/AuditLogPage';

export default function AuditLogsIndex({ logs, filters }) {
    return (
        <AdminLayout>
            <Head title="سجل العمليات" />
            <AuditLogPage logs={logs} filters={filters} />
        </AdminLayout>
    );
}
