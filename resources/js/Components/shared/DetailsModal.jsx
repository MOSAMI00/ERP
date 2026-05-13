import React from 'react';
import BaseModal from './BaseModal';

const DetailsModal = ({
  isOpen,
  title,
  description,
  children,
  onClose,
  footer,
  maxWidth,
  variant = 'default',
}) => (
  <BaseModal
    isOpen={isOpen}
    title={title}
    description={description}
    onClose={onClose}
    footer={footer}
    maxWidth={maxWidth}
    variant={variant}
  >
    {children}
  </BaseModal>
);

export default DetailsModal;

