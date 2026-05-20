import { useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, Save, Shield, Users } from 'lucide-react';
import AdminsTable from './components/AdminsTable';
import PermissionsMatrix from './components/PermissionsMatrix';
import SecurityTab from './components/SecurityTab';
import Tabs from '../../components/ui/Tabs';
import { adminsData, permissionsData, sessionsData } from '../../data/settings';

export default function SettingsPage({ settings: propSettings }) {
  const settings = propSettings ?? {};
  const [activeTab, setActiveTab] = useState('roles');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [platformForm, setPlatformForm] = useState({
    platform_fee_rate: settings.platform_fee_rate ?? 0,
    payment_deadline_hours: settings.payment_deadline_hours ?? 24,
    min_rental_days: settings.min_rental_days ?? 1,
    max_rental_days: settings.max_rental_days ?? 365,
    objection_window_hours: settings.objection_window_hours ?? 24,
    refund_window_days: settings.refund_window_days ?? 7,
    kyc_required: Boolean(settings.kyc_required ?? true),
    platform_terms: settings.platform_terms ?? '',
    contract_template: settings.contract_template ?? '',
  });
  const tabs = [
    { id: 'roles', label: 'إدارة الأدوار والصلاحيات', icon: Users },
    // { id: 'security', label: 'الأمان والمصادقة', icon: Shield },
    { id: 'platform', label: 'شروط وعقود المنصة', icon: FileText },
  ];

  const updatePlatform = (key, value) => setPlatformForm((current) => ({ ...current, [key]: value }));
  const savePlatformSettings = () => {
    router.put('/admin/settings', platformForm, { preserveScroll: true });
  };

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

      {/* {activeTab === 'security' && (
        <SecurityTab mfaEnabled={mfaEnabled} setMfaEnabled={setMfaEnabled} sessions={sessionsData} />
      )} */}

      {activeTab === 'platform' && (
        <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border p-6 space-y-5 animate-in fade-in duration-300">
          <div className="grid md:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm font-bold">
              <span>نسبة المنصة</span>
              <input className="w-full rounded-lg border border-brand-border p-3 bg-white" value={platformForm.platform_fee_rate} onChange={(e) => updatePlatform('platform_fee_rate', e.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              <span>مهلة الدفع بالساعات</span>
              <input className="w-full rounded-lg border border-brand-border p-3 bg-white" value={platformForm.payment_deadline_hours} onChange={(e) => updatePlatform('payment_deadline_hours', e.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              <span>نافذة الاعتراض بالساعات</span>
              <input className="w-full rounded-lg border border-brand-border p-3 bg-white" value={platformForm.objection_window_hours} onChange={(e) => updatePlatform('objection_window_hours', e.target.value)} />
            </label>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm font-bold">
              <span>أقل مدة إيجار</span>
              <input className="w-full rounded-lg border border-brand-border p-3 bg-white" value={platformForm.min_rental_days} onChange={(e) => updatePlatform('min_rental_days', e.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              <span>أقصى مدة إيجار</span>
              <input className="w-full rounded-lg border border-brand-border p-3 bg-white" value={platformForm.max_rental_days} onChange={(e) => updatePlatform('max_rental_days', e.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-bold">
              <span>أيام رد المبالغ</span>
              <input className="w-full rounded-lg border border-brand-border p-3 bg-white" value={platformForm.refund_window_days} onChange={(e) => updatePlatform('refund_window_days', e.target.value)} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={platformForm.kyc_required} onChange={(e) => updatePlatform('kyc_required', e.target.checked)} />
            تفعيل إلزامية توثيق الهوية
          </label>
          <label className="space-y-2 text-sm font-bold block">
            <span>شروط المنصة المعروضة في صفحة المعدة</span>
            <textarea className="w-full min-h-[140px] rounded-lg border border-brand-border p-3 bg-white" value={platformForm.platform_terms} onChange={(e) => updatePlatform('platform_terms', e.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-bold block">
            <span>قالب العقد</span>
            <textarea className="w-full min-h-[220px] rounded-lg border border-brand-border p-3 bg-white font-mono text-sm" value={platformForm.contract_template} onChange={(e) => updatePlatform('contract_template', e.target.value)} placeholder="{tenant_name} {owner_name} {equipment_name} {rental_price} {start_date} {end_date}" />
          </label>
          <button type="button" onClick={savePlatformSettings} className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-white font-bold">
            <Save size={18} />
            حفظ إعدادات المنصة
          </button>
        </div>
      )}
    </div>
  );
}
