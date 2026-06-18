import React from 'react';
import { CreditCard, Plus, CheckCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

const PayoutMethodCard = ({ methods = [], onAddMethod }) => {
  const handleSetDefault = (methodId) => {
    router.patch(`/payment-methods/${methodId}/default`, {}, {
      preserveScroll: true,
    });
  };

  return (
    <div className="owner-card">
      <div className="flex-between mb-6">
        <h4 className="flex-center gap-2" style={{ margin: 0 }}>
          <CreditCard size={20} /> وسيلة استلام الأرباح
        </h4>
      </div>

      {methods.length > 0 ? (
        <div className="space-y-3 mb-6" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {methods.map((method) => (
            <div 
              key={method.id}
              style={{ 
                backgroundColor: method.is_default ? 'rgba(45, 90, 39, 0.05)' : 'var(--color-page-bg)', 
                padding: 16, 
                borderRadius: 12, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: method.is_default ? '1px solid var(--color-primary)' : '1px solid #E0E0E0',
                cursor: method.is_default ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => !method.is_default && handleSetDefault(method.id)}
            >
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600 }}>
                  {method.type === 'bank_account' ? method.bank_name : 'محفظة إلكترونية'}
                </p>
                <p className="text-muted" style={{ margin: 0, direction: 'ltr', display: 'inline-block' }}>
                  {method.type === 'bank_account' 
                    ? `**** ${method.account_number?.slice(-4) || '****'}` 
                    : (method.wallet_number || '****')}
                </p>
              </div>
              {method.is_default ? (
                <span className="badge badge-completed flex items-center gap-1" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                  <CheckCircle size={12} /> محددة
                </span>
              ) : (
                <button 
                  className="text-xs text-primary hover:underline font-medium"
                  style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetDefault(method.id);
                  }}
                >
                  تحديد كافتراضية
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--color-page-bg)', padding: 24, borderRadius: 12, textAlign: 'center', marginBottom: 16, border: '2px dashed #E0E0E0' }}>
          <p className="text-muted" style={{ margin: 0 }}>لا توجد وسائل دفع مضافة</p>
        </div>
      )}

      <div className="flex-center">
        <button className="owner-btn owner-btn-primary w-full" onClick={onAddMethod} type="button">
          <Plus size={16} /> إضافة وسيلة استلام جديدة
        </button>
      </div>
    </div>
  );
};

export default PayoutMethodCard;
