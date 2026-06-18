import { useState } from 'react';
import SummaryCards from './components/SummaryCards';
import ComplaintsTable from './components/ComplaintsTable';
import NotificationsTab from './components/NotificationsTab';
import ComplaintModal from './components/ComplaintModal';
import useModal from '../../hooks/useModal';
import Tabs from '../../components/ui/Tabs';
import { complaintsTabs } from '../../data/complaints';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('complaints');
  const [actionType, setActionType] = useState('warn');
  const modal = useModal();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SummaryCards />

      <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden flex flex-col min-h-[500px]">
        <Tabs tabs={complaintsTabs} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'complaints' ? (
          <ComplaintsTable onOpenModal={() => modal.open()} />
        ) : (
          <NotificationsTab />
        )}
      </div>

      <ComplaintModal
        isOpen={modal.isOpen}
        actionType={actionType}
        setActionType={setActionType}
        onClose={modal.close}
      />
    </div>
  );
}
