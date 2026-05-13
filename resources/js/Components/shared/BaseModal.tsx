import React from 'react';
import { X } from 'lucide-react';

const BaseModal = ({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  maxWidth,
  bodyStyle,
  variant = 'default',
}) => {
  if (!isOpen) return null;

  return (
    <div className={`owner-modal-overlay owner-modal-overlay-${variant}`}>
      <div className="owner-modal" style={{ maxWidth }}>
        {(title || onClose) && (
          <div className="owner-modal-header">
            <div>
              {title ? <h3 className="owner-modal-title">{title}</h3> : null}
              {description ? <p className="text-muted mb-0" style={{ fontSize: 13 }}>{description}</p> : null}
            </div>
            {onClose ? <X className="owner-modal-close" onClick={onClose} /> : null}
          </div>
        )}
        <div className="owner-modal-body" style={bodyStyle}>
          {children}
        </div>
        {footer ? <div className="owner-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
};

export default BaseModal;

