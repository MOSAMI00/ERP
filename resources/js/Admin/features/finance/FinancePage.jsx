import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import SummaryCards from './components/SummaryCards';
import PaymentsTab from './components/PaymentsTab';
import EscrowTab from './components/EscrowTab';
import ProfitsTab from './components/ProfitsTab';
import RefundsTab from './components/RefundsTab';
import Tabs from '../../components/ui/Tabs';
import { financeTabs } from '../../data/finance';
import { asArray, normalizePayment } from '../../../utils/pageData';

export default function FinancePage() {
  const { props } = usePage();
  const [activeTab, setActiveTab] = useState('payments');
  const payments = asArray(props.payments).map(normalizePayment);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SummaryCards summary={props.summary ?? {}} />

      <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
        <Tabs tabs={financeTabs} activeTab={activeTab} onChange={setActiveTab} />
        
        {activeTab === 'payments' && <PaymentsTab payments={payments} filters={props.filters ?? {}} />}
        {activeTab === 'escrow' && <EscrowTab />}
        {activeTab === 'profits' && <ProfitsTab />}
        {activeTab === 'refunds' && <RefundsTab />}
      </div>
    </div>
  );
}
