import React from 'react';
import { useForm } from '@inertiajs/react';

const PayoutMethodModal = ({ isOpen, onClose }) => {
  const { data, setData, post, processing, reset, errors } = useForm({
    type: 'bank_account',
    bank_name: '',
    account_number: '',
    account_name: '',
    wallet_number: '',
    is_default: true,
  });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/payment-methods', {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className="owner-modal-overlay">
      <form className="owner-modal" style={{ maxWidth: 500 }} onSubmit={handleSubmit}>
        <div className="owner-modal-header">
          <h3 className="owner-modal-title">إضافة وسيلة استلام</h3>
          <button className="owner-modal-close" onClick={onClose} type="button">×</button>
        </div>
        <div className="owner-modal-body">
          <div className="mb-4">
            <label className="owner-label">اختر النوع</label>
            <div className="radio-group">
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="methodType" 
                  checked={data.type === 'bank_account'} 
                  onChange={() => setData('type', 'bank_account')}
                /> حساب بنكي
              </label>
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="methodType" 
                  checked={data.type === 'e_wallet'} 
                  onChange={() => setData('type', 'e_wallet')}
                /> محفظة إلكترونية
              </label>
            </div>
          </div>

          {data.type === 'bank_account' ? (
            <>
              <div className="mb-4">
                <label className="owner-label">اسم البنك *</label>
                <input 
                  type="text" 
                  className="owner-input" 
                  placeholder="مثال: بنك الكريمي" 
                  value={data.bank_name}
                  onChange={e => setData('bank_name', e.target.value)}
                  required
                />
                {errors.bank_name && <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>}
              </div>
              <div className="mb-4">
                <label className="owner-label">رقم الحساب *</label>
                <input 
                  type="text" 
                  className="owner-input" 
                  placeholder="123456789" 
                  style={{ direction: 'ltr' }} 
                  value={data.account_number}
                  onChange={e => setData('account_number', e.target.value)}
                  required
                />
                {errors.account_number && <p className="text-red-500 text-xs mt-1">{errors.account_number}</p>}
              </div>
              <div className="mb-4">
                <label className="owner-label">اسم صاحب الحساب *</label>
                <input 
                  type="text" 
                  className="owner-input" 
                  placeholder="كما هو في البنك" 
                  value={data.account_name}
                  onChange={e => setData('account_name', e.target.value)}
                  required
                />
                {errors.account_name && <p className="text-red-500 text-xs mt-1">{errors.account_name}</p>}
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="owner-label">رقم المحفظة / الهاتف *</label>
              <input 
                type="text" 
                className="owner-input" 
                placeholder="77XXXXXXX" 
                style={{ direction: 'ltr' }} 
                value={data.wallet_number}
                onChange={e => setData('wallet_number', e.target.value)}
                required
              />
              {errors.wallet_number && <p className="text-red-500 text-xs mt-1">{errors.wallet_number}</p>}
            </div>
          )}
        </div>
        <div className="owner-modal-footer">
          <button className="owner-btn owner-btn-outline" onClick={onClose} type="button">إلغاء</button>
          <button className="owner-btn owner-btn-primary" disabled={processing} type="submit">
            {processing ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayoutMethodModal;
