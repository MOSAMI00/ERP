import WarningBanner from './components/WarningBanner';
import AuditFilterBar from './components/AuditFilterBar';
import AuditTable from './components/AuditTable';

import { asArray } from '../../../utils/pageData';

export default function AuditLogPage({ logs: rawLogs, filters }) {
  const logs = asArray(rawLogs).map((log) => ({
    ...log,
    time: log.created_at ?? log.time,
    admin: log.admin?.name ?? log.admin?.full_name ?? '—',
    role: log.admin?.role?.name ?? 'Admin',
    roleColor: 'primary',
    event: log.event_type ?? log.event,
    details: log.description ?? log.details ?? '',
    ip: log.ip_address ?? log.ip ?? '',
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <WarningBanner />
      <AuditFilterBar filters={filters} />
      <AuditTable auditData={logs} />
    </div>
  );
}
