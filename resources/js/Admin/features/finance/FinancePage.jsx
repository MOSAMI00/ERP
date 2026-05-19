import { useState } from 'react';
import SummaryCards from './components/SummaryCards';
import PaymentsTab from './components/PaymentsTab';
import EscrowTab from './components/EscrowTab';
import ProfitsTab from './components/ProfitsTab';
import RefundsTab from './components/RefundsTab';
import Tabs from '../../components/ui/Tabs';
import { financeTabs } from '../../data/finance';
import { asArray, normalizePayment } from '../../../utils/pageData';

export default function FinancePage({ payments: rawPayments, summary, filters }) {
  const [activeTab, setActiveTab] = useState('payments');
  const payments = asArray(rawPayments).map(normalizePayment);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SummaryCards summary={summary ?? {}} />

      <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
        <Tabs tabs={financeTabs} activeTab={activeTab} onChange={setActiveTab} />
        
        {activeTab === 'payments' && <PaymentsTab payments={payments} filters={filters ?? {}} />}
        {activeTab === 'escrow' && <EscrowTab payments={payments} summary={summary ?? {}} />}
        {activeTab === 'profits' && <ProfitsTab payments={payments} />}
        {activeTab === 'refunds' && <RefundsTab payments={payments} />}
      </div>
    </div>
  );
}
