import React from 'react';
import { CreditCard, Edit2, Plus } from 'lucide-react';

const PayoutMethodCard = ({ onAddMethod }) => (
  <div className="owner-card">
    <div className="flex-between mb-6">
      <h4 className="flex-center gap-2" style={{ margin: 0 }}><CreditCard size={20} /> وسيلة استلام الأرباح</h4>
    </div>
    <div style={{ backgroundColor: 'var(--color-page-bg)', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div>
        <p style={{ margin: '0 0 4px', fontWeight: 600 }}>البنك الأهلي اليمني</p>
        <p className="text-muted" style={{ margin: 0, direction: 'ltr', display: 'inline-block' }}>**** 4521</p>
      </div>
      <span className="badge badge-completed">محددة</span>
    </div>
    <div className="flex-center gap-4">
      <button className="owner-btn owner-btn-outline" style={{ flex: 1 }} type="button"><Edit2 size={16} /> تعديل</button>
      <button className="owner-btn owner-btn-primary" style={{ flex: 1 }} onClick={onAddMethod} type="button"><Plus size={16} /> إضافة وسيلة</button>
    </div>
  </div>
);

export default PayoutMethodCard;
