import { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import AdminsTable from './components/AdminsTable';
import PermissionsMatrix from './components/PermissionsMatrix';
import SecurityTab from './components/SecurityTab';
import Tabs from '../../components/ui/Tabs';
import { adminsData, permissionsData, sessionsData } from '../../data/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('roles');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const tabs = [
    { id: 'roles', label: 'إدارة الأدوار والصلاحيات', icon: Users },
    { id: 'security', label: 'الأمان والمصادقة', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="flex border-b border-brand-border bg-brand-content/30 overflow-x-auto scrollbar-hide"
          getButtonClassName={(_, isActive) => `flex items-center space-x-2 space-x-reverse px-8 py-4 font-bold text-sm transition-colors relative ${isActive ? 'text-brand-primary' : 'text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-content'}`}
          renderTab={(tab) => {
            const Icon = tab.icon;
            return (
              <>
                <Icon size={18} />
                <span>{tab.label}</span>
              </>
            );
          }}
        />
      </div>

      {activeTab === 'roles' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <AdminsTable admins={adminsData} />
          <PermissionsMatrix permissions={permissionsData} />
        </div>
      )}

      {activeTab === 'security' && (
        <SecurityTab mfaEnabled={mfaEnabled} setMfaEnabled={setMfaEnabled} sessions={sessionsData} />
      )}
    </div>
  );
}
