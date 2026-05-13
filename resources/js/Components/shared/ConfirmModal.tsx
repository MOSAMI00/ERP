import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import BaseModal from './BaseModal';

const VARIANT_ICON = {
  success: <Check size={32} color="var(--color-completed)" />,
  danger: <AlertTriangle size={32} color="var(--color-disputed)" />,
  default: <Check size={32} color="var(--color-primary-green)" />,
};

const VARIANT_CLASS = {
  success: 'owner-btn-success',
  danger: 'owner-btn-danger',
  default: 'owner-btn-primary',
};

const ConfirmModal = ({
  isOpen,
  title,
  description,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  variant = 'default',
}) => (
  <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    maxWidth={420}
    bodyStyle={{ textAlign: 'center', padding: '40px 32px' }}
    variant={variant}
  >
    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: variant === 'danger' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(39, 174, 96, 0.1)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {VARIANT_ICON[variant] ?? VARIANT_ICON.default}
    </div>
    <h3 style={{ margin: '0 0 12px' }}>{title}</h3>
    {description ? <p className="text-muted mb-6">{description}</p> : null}
    {children}
    <div className="flex-center gap-4">
      <button className="owner-btn owner-btn-outline" style={{ flex: 1 }} onClick={onClose}>{cancelLabel}</button>
      <button className={`owner-btn ${VARIANT_CLASS[variant] ?? VARIANT_CLASS.default}`} style={{ flex: 1 }} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </BaseModal>
);

export default ConfirmModal;

